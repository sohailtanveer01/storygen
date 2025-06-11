import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';

// Configure the route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const runway = new RunwayML({
  apiKey: 'key_804b6411b7b57196c387f7bf0ce1fded5d54b667056e4a667bfec2462b89c853ba75840a463fbd56643aae546d2e7d6bee7b921e78e53c0341f3d46a111b4a52'
});

// Add delay between retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Maximum number of retries
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function createImageTask(prompt: string, dataUrl: string, retryCount = 0): Promise<any> {
  try {
    console.log(`Attempt ${retryCount + 1} to create image task`);
    const taskResponse = await runway.textToImage.create({
      model: 'gen4_image',
      ratio: '1024:1024',
      promptText: prompt,
      referenceImages: [{
        uri: dataUrl,
        tag: 'child'
      }]
    });
    return taskResponse;
  } catch (error: any) {
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status === 500)) {
      console.log(`Rate limited or server error, retrying in ${RETRY_DELAY}ms...`);
      await delay(RETRY_DELAY);
      return createImageTask(prompt, dataUrl, retryCount + 1);
    }
    throw error;
  }
}

async function pollTaskStatus(taskId: string, retryCount = 0): Promise<any> {
  try {
    const currentTask = await runway.tasks.retrieve(taskId);
    console.log('Task status:', currentTask.status);

    if (currentTask.status === 'FAILED') {
      throw new Error('Task failed');
    }

    if (currentTask.status === 'SUCCEEDED') {
      return currentTask;
    }

    // If still processing, wait and retry
    await delay(1000);
    return pollTaskStatus(taskId, retryCount + 1);
  } catch (error: any) {
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status === 500)) {
      console.log(`Rate limited or server error while polling, retrying in ${RETRY_DELAY}ms...`);
      await delay(RETRY_DELAY);
      return pollTaskStatus(taskId, retryCount + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  console.log('Received request to /api/runway');
  
  try {
    // Log request headers
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      console.error('Invalid content type:', request.headers.get('content-type'));
      return NextResponse.json(
        { error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    console.log('Form data keys:', Array.from(formData.keys()));
    
    const prompt = formData.get('prompt') as string;
    const childImage = formData.get('childImage') as File;
    const style = formData.get('style') as string;

    console.log('Received request data:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      style, 
      hasImage: !!childImage,
      imageType: childImage?.type,
      imageSize: childImage?.size
    });

    if (!prompt || !childImage) {
      console.error('Missing required fields:', { prompt, hasImage: !!childImage });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!(childImage instanceof File)) {
      console.error('Invalid image file:', childImage);
      return NextResponse.json(
        { error: 'Invalid image file' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for the SDK
    console.log('Converting image to base64...');
    const arrayBuffer = await childImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${childImage.type};base64,${base64Image}`;

    console.log('Creating image generation task...');
    console.log('Prompt:', prompt);
    
    try {
      // Create task with retries
      const taskResponse = await createImageTask(prompt, dataUrl);
      console.log('Task created:', taskResponse);

      // Poll for completion with retries
      const currentTask = await pollTaskStatus(taskResponse.id);

      if (!currentTask.output || !currentTask.output[0]) {
        console.error('No output in task:', currentTask);
        return NextResponse.json(
          { error: 'No output image generated' },
          { status: 500 }
        );
      }

      console.log('Task succeeded:', currentTask);

      return NextResponse.json({
        imageUrl: currentTask.output[0]
      });
    } catch (runwayError) {
      console.error('RunwayML API Error:', runwayError);
      return NextResponse.json(
        { error: runwayError instanceof Error ? runwayError.message : 'RunwayML API error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import RunwayML from '@runwayml/sdk';

// Configure the route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const runway = new RunwayML({
  apiKey: 'key_498211c68c401be03df646fb101d534323fe86745521dae09a866bf5aff00ece7b3ac370c1708cf0d367cdb4ca479674c561a092a3640a2379a85cad2efe149e'
});

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
    
    try {
      // Create a new image generation task
      const taskResponse = await runway.textToImage.create({
        model: 'gen4_image',
        ratio: '1024:1024',
        promptText: prompt,
        referenceImages: [{
          uri: dataUrl,
          tag: 'child'
        }]
      });

      console.log('Task created:', taskResponse);

      // Get the task ID from the response
      const taskId = taskResponse.id;
      let currentTask;

      // Poll for completion
      do {
        // Wait for 1 second before polling
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentTask = await runway.tasks.retrieve(taskId);
        console.log('Task status:', currentTask.status);
      } while (!['SUCCEEDED', 'FAILED'].includes(currentTask.status));

      if (currentTask.status === 'FAILED') {
        console.error('Task failed:', currentTask);
        return NextResponse.json(
          { error: 'Image generation failed' },
          { status: 500 }
        );
      }

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
    // Ensure we always return JSON
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 
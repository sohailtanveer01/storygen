// RunwayML API Integration
import RunwayML from '@runwayml/sdk';

interface RunwayImageRequest {
  prompt: string;
  childImage: File;
  style: string;
}

interface RunwayImageResponse {
  imageUrl: string;
  animationUrl?: string;
}

export class RunwayAPI {
  async generateAnimatedImage(prompt: string, childImage: File): Promise<string> {
    if (!prompt || !childImage) {
      throw new Error('Prompt and child image are required');
    }

    try {
      console.log('Starting image generation with prompt:', prompt);
      console.log('Child image details:', {
        type: childImage.type,
        size: childImage.size,
        name: childImage.name
      });

      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('childImage', childImage);

      console.log('Sending request to /api/runway');
      const response = await fetch('/api/runway', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      console.log('Response content type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `RunwayML API error (${response.status}): ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      console.log('Image generation successful:', data.imageUrl);
      return data.imageUrl;
    } catch (error) {
      console.error('RunwayML API Error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
      }
      throw new Error('Failed to generate image: Unknown error');
    }
  }

  async generateStoryImages(pages: any[], childImage: File): Promise<string[]> {
    console.log('Generating images for', pages.length, 'pages');
    const imagePromises = pages.map((page, index) => {
      console.log(`Generating image ${index + 1}/${pages.length}`);
      return this.generateAnimatedImage(page.imagePrompt, childImage);
    });

    try {
      const results = await Promise.all(imagePromises);
      return results;
    } catch (error) {
      console.error('Error generating story images:', error);
      throw error;
    }
  }
}

// Usage example:
// const runwayAPI = new RunwayAPI(process.env.RUNWAY_API_KEY);
// const animatedImage = await runwayAPI.generateAnimatedImage({
//   prompt: "A child riding a unicorn through a magical forest",
//   childImage: uploadedFile,
//   style: "whimsical_cartoon"
// });
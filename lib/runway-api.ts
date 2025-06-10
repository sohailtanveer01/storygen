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
  async generateAnimatedImage(request: RunwayImageRequest): Promise<RunwayImageResponse> {
    try {
      console.log('Preparing form data...');
      const formData = new FormData();
      formData.append('prompt', request.prompt);
      formData.append('childImage', request.childImage);
      formData.append('style', request.style);

      console.log('Sending request to /api/runway...');
      const response = await fetch('/api/runway', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      return {
        imageUrl: data.imageUrl,
        animationUrl: undefined // Animation not supported yet
      };
    } catch (error) {
      console.error('RunwayML API Error:', error);
      throw error;
    }
  }

  async generateStoryImages(pages: any[], childImage: File): Promise<string[]> {
    console.log('Generating images for', pages.length, 'pages');
    const imagePromises = pages.map((page, index) => {
      console.log(`Generating image ${index + 1}/${pages.length}`);
      return this.generateAnimatedImage({
        prompt: page.imagePrompt,
        childImage,
        style: 'children_book_illustration',
      });
    });

    try {
      const results = await Promise.all(imagePromises);
      return results.map(result => result.imageUrl);
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
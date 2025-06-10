"use client";

import { useState } from 'react';
import { StoryForm } from '@/components/story-form';
import { StoryPreview } from '@/components/story-preview';
import { GenerationProgress } from '@/components/generation-progress';
import { Header } from '@/components/header';
import { StoryData } from '@/types/story';
import { RunwayAPI } from '@/lib/runway-api';
import { generateStoryContent } from '@/lib/story-generator';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'preview'>('form');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedStory, setGeneratedStory] = useState<any>(null);

  const handleFormSubmit = async (data: StoryData) => {
    setStoryData(data);
    setCurrentStep('generating');
    
    try {
      // Generate story content
      const story = generateStoryContent(data);
      setGeneratedStory(story);
      
      // Initialize RunwayML API
      const runwayAPI = new RunwayAPI();
      
      // Generate images for each page
      const totalPages = story.pages.length;
      for (let i = 0; i < totalPages; i++) {
        // Update progress
        const progress = Math.floor((i / totalPages) * 100);
        setGenerationProgress(progress);
        
        
        // Generate image for current page
        const result = await runwayAPI.generateAnimatedImage({
          prompt: story.pages[i].imagePrompt,
          childImage: data.childImage,
          style: 'children_book_illustration',
        });
        
        // Update story with generated image
        story.pages[i].animatedImage = result.imageUrl;
      }
      
      // Set final progress
      setGenerationProgress(100);
      setGeneratedStory(story);
      
      // Move to preview
      setTimeout(() => {
        setCurrentStep('preview');
      }, 1000);
    } catch (error) {
      console.error('Error generating story:', error);
      // Handle error appropriately
      alert('There was an error generating your story. Please try again.');
      setCurrentStep('form');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setStoryData(null);
    setGenerationProgress(0);
    setGeneratedStory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'form' && (
          <div className="animate-in fade-in-0 duration-500">
            <StoryForm onSubmit={handleFormSubmit} />
          </div>
        )}
        
        {currentStep === 'generating' && (
          <div className="animate-in fade-in-0 duration-500">
            <GenerationProgress 
              progress={generationProgress}
              storyData={storyData!}
            />
          </div>
        )}
        
        {currentStep === 'preview' && storyData && generatedStory && (
          <div className="animate-in fade-in-0 duration-500">
            <StoryPreview 
              storyData={storyData}
              story={generatedStory}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </main>
    </div>
  );
}
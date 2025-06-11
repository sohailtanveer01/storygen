"use client";

import { useState } from 'react';
import { StoryForm } from '@/components/story-form';
import { StoryPreview } from '@/components/story-preview';
import { GenerationProgress } from '@/components/generation-progress';
import { Header } from '@/components/header';
import { StoryData } from '@/types/story';
import { RunwayAPI } from '@/lib/runway-api';
import { generateStoryContent } from '@/lib/story-generator';

interface GeneratedStory {
  title: string;
  theme: string;
  pages: {
    title: string;
    content: string;
    imagePrompt: string;
    animatedImage?: string;
    pageNumber?: number;
    scenario?: string;
  }[];
}

type StoryTheme = 'superhero' | 'princess' | 'space';

const themeOptions = [
  { value: 'superhero', label: 'Superhero' },
  { value: 'princess', label: 'Princess' },
  { value: 'space', label: 'Space' }
] as const;

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'preview'>('form');
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: StoryData) => {
    try {
      setError(null);
      setStoryData(data);
      setCurrentStep('generating');
      
      // Generate story content
      const storyContent = await generateStoryContent(
        data.childName,
        data.childAge,
        data.theme as any
      );
      
      // Add theme to the story
      const story: GeneratedStory = {
        ...storyContent,
        theme: data.theme || 'adventure' // Provide default theme if undefined
      };
      
      // Set story before starting image generation
      setGeneratedStory(story);
      
      // Initialize RunwayML API
      const runwayAPI = new RunwayAPI();
      
      // Generate images for each page
      const totalPages = story.pages.length;
      for (let i = 0; i < totalPages; i++) {
        try {
          // Update progress
          const progress = Math.floor((i / totalPages) * 100);
          setGenerationProgress(progress);
          
          // Generate image for current page
          const imageUrl = await runwayAPI.generateAnimatedImage(
            story.pages[i].imagePrompt,
            data.childImage
          );
          
          // Update story with generated image
          story.pages[i].animatedImage = imageUrl;
          
          // Update the story state after each successful image generation
          setGeneratedStory({ ...story });
        } catch (imageError) {
          console.error(`Error generating image for page ${i + 1}:`, imageError);
          // Continue with other pages even if one fails
          story.pages[i].animatedImage = '/placeholder-image.png'; // Use a placeholder image
        }
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
      setError(error instanceof Error ? error.message : 'An error occurred while generating the story');
      setCurrentStep('form');
    }
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setStoryData(null);
    setGenerationProgress(0);
    setGeneratedStory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
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
              story={{
                ...generatedStory,
                pages: generatedStory.pages.map((page, i) => ({
                  ...page,
                  pageNumber: i + 1,
                  scenario: page.title
                }))
              }}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </main>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoryData, GeneratedStory } from '@/types/story';
import { Download, RotateCcw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { generatePDF } from '@/lib/pdf-generator';

interface StoryPreviewProps {
  storyData: StoryData;
  story: GeneratedStory;
  onStartOver: () => void;
}

export function StoryPreview({ storyData, story, onStartOver }: StoryPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const totalPages = story.pages.length;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(story, storyData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentStoryPage = story.pages[currentPage];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          {story.title}
        </h2>
        <p className="text-lg text-gray-600">
          Your personalized storybook is ready!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Story Preview */}
        <div className="md:col-span-2">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Page {currentPage + 1} of {totalPages}</span>
                <Badge variant="secondary" className="text-sm">
                  {story.theme} Theme
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {currentStoryPage.animatedImage ? (
                  <img
                    src={currentStoryPage.animatedImage}
                    alt={currentStoryPage.scenario}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <img
                      src={storyData.imagePreview}
                      alt={storyData.childName}
                      className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                    />
                    <p className="text-sm text-purple-600 font-medium">
                      {currentStoryPage.scenario}
                    </p>
                    <div className="mt-4 text-xs text-gray-500">
                      Animated illustration will be generated here
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {currentStoryPage.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentStoryPage.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={prevPage}
              variant="outline"
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Page
            </Button>
            <Button
              onClick={nextPage}
              variant="outline"
              className="flex items-center"
            >
              Next Page
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <span>Story Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download Storybook PDF'}
                </Button>
                
                <Button
                  onClick={onStartOver}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Create Another Story
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
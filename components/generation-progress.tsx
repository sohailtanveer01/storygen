"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StoryData } from '@/types/story';
import { Sparkles, ImageIcon, BookOpen, Wand2 } from 'lucide-react';

interface GenerationProgressProps {
  progress: number;
  storyData: StoryData;
}

export function GenerationProgress({ progress, storyData }: GenerationProgressProps) {
  const getProgressMessage = () => {
    if (progress < 25) return "Crafting your magical tale...";
    if (progress < 50) return "Generating animated scenes...";
    if (progress < 75) return "Adding finishing touches...";
    return "Almost ready!";
  };

  const getProgressIcon = () => {
    if (progress < 25) return <BookOpen className="h-8 w-8 text-purple-600 animate-pulse" />;
    if (progress < 50) return <ImageIcon className="h-8 w-8 text-blue-600 animate-pulse" />;
    if (progress < 75) return <Wand2 className="h-8 w-8 text-pink-600 animate-pulse" />;
    return <Sparkles className="h-8 w-8 text-yellow-600 animate-pulse" />;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Creating {storyData.childName}'s
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Magical Adventure
          </span>
        </h2>
        <p className="text-lg text-gray-600">
          Please wait while we create a personalized storybook with animated illustrations
        </p>
      </div>

      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Child's Image */}
            <div className="relative mx-auto w-24 h-24">
              <img
                src={storyData.imagePreview}
                alt={storyData.childName}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white animate-spin" />
              </div>
            </div>

            {/* Progress Icon */}
            <div className="flex justify-center">
              {getProgressIcon()}
            </div>

            {/* Progress Message */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {getProgressMessage()}
              </h3>
              <p className="text-gray-600">
                This may take a few moments as we generate unique illustrations
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-500">{progress}% complete</p>
            </div>

            {/* Generation Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                progress >= 25 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'
              }`}>
                <BookOpen className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Story Creation</p>
              </div>
              <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                progress >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
              }`}>
                <ImageIcon className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Image Generation</p>
              </div>
              <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                progress >= 75 ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-500'
              }`}>
                <Wand2 className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Animation</p>
              </div>
              <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                progress >= 100 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
              }`}>
                <Sparkles className="h-6 w-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Finishing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
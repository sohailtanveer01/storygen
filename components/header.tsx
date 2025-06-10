import { BookOpen, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <BookOpen className="h-8 w-8 text-purple-600" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StoryBook Generator
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create magical personalized stories for your little ones
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
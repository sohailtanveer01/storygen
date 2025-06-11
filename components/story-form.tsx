"use client";

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, ImageIcon, Sparkles, Heart } from 'lucide-react';
import { StoryData } from '@/types/story';
import { cn } from '@/lib/utils';

interface StoryFormProps {
  onSubmit: (data: StoryData) => void;
}

export function StoryForm({ onSubmit }: StoryFormProps) {
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    theme: 'superhero',
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrors(prev => ({ ...prev, image: '' }));
      }
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.childName.trim()) {
      newErrors.childName = 'Child\'s name is required';
    }
    
    if (!formData.childAge || parseInt(formData.childAge) < 1 || parseInt(formData.childAge) > 12) {
      newErrors.childAge = 'Please enter a valid age between 1-12';
    }
    
    if (!uploadedFile) {
      newErrors.image = 'Please upload a photo of your child';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const storyData: StoryData = {
      childName: formData.childName.trim(),
      childAge: parseInt(formData.childAge),
      childImage: uploadedFile!,
      imagePreview,
      theme: formData.theme,
    };
    
    onSubmit(storyData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Let's Create Your Child's
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Magical Story
          </span>
        </h2>
        <p className="text-lg text-gray-600">
          Upload a photo and tell us about your little one to create a personalized 20-page storybook adventure!
        </p>
      </div>

      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>Story Details</span>
          </CardTitle>
          <CardDescription>
            Fill in the details to create a unique adventure story
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Child's Photo</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                  isDragActive 
                    ? "border-purple-400 bg-purple-50" 
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50",
                  errors.image && "border-red-400 bg-red-50"
                )}
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Child preview"
                      className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Click or drag to change photo
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      {isDragActive ? (
                        <Upload className="h-8 w-8 text-purple-600 animate-bounce" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? "Drop the photo here!" : "Upload your child's photo"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Drag & drop or click to browse (JPG, PNG, WebP)
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Child's Name */}
            <div className="space-y-2">
              <Label htmlFor="childName">Child's Name</Label>
              <Input
                id="childName"
                type="text"
                placeholder="Enter your child's name"
                value={formData.childName}
                onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                className={cn(
                  "text-lg",
                  errors.childName && "border-red-400 focus:border-red-400"
                )}
              />
              {errors.childName && (
                <p className="text-sm text-red-600">{errors.childName}</p>
              )}
            </div>

            {/* Child's Age */}
            <div className="space-y-2">
              <Label htmlFor="childAge">Child's Age</Label>
              <Input
                id="childAge"
                type="number"
                min="1"
                max="12"
                placeholder="Age (1-12 years)"
                value={formData.childAge}
                onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                className={cn(
                  "text-lg",
                  errors.childAge && "border-red-400 focus:border-red-400"
                )}
              />
              {errors.childAge && (
                <p className="text-sm text-red-600">{errors.childAge}</p>
              )}
            </div>

            {/* Story Theme */}
            <div className="space-y-2">
              <Label htmlFor="theme">Story Theme</Label>
              <Select
                value={formData.theme}
                onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}
              >
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Choose a story theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="superhero">🦸 Superhero Journey</SelectItem>
                  <SelectItem value="princess">👑 Royal Adventure</SelectItem>
                  <SelectItem value="space">🚀 Space Explorer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Create My Story
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
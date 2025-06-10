export interface StoryData {
  childName: string;
  childAge: number;
  childImage: File;
  imagePreview: string;
  theme?: string;
}

export interface StoryPage {
  pageNumber: number;
  title: string;
  content: string;
  scenario: string;
  imagePrompt: string;
  animatedImage?: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  theme: string;
}
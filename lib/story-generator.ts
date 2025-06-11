import { StoryData, GeneratedStory, StoryPage } from '@/types/story';

const storyThemes = {
  superhero: {
    title: "The Day I Became a Superhero",
    scenarios: [
      "was exploring their grandmother's attic when they found a glowing cape whispering secrets of ancient heroes",
      "put on the cape and suddenly felt a rush of energy—new powers surged through them",
      "heard a tiny voice calling for help and discovered a baby phoenix with a broken wing",
      "used their golden healing powers to help the phoenix, who became their magical companion",
      "practiced their powers by lifting heavy objects and flying, accidentally scaring some birds off a rooftop",
      "used their super strength to help their neighbor Mrs. Jenkins carry groceries, earning a warm smile",
      "rushed to the community garden when a broken pipe caused flooding and used their ice powers to seal the leak",
      "rescued a scared kitten from an oak tree and was celebrated by the neighbors",
      "organized a neighborhood cleanup with their new friends, sparking a wave of local heroism",
      "realized that true heroism wasn't the cape, but the courage and kindness in their heart"
    ]
  },  
  princess: {
    title: "The Crystal Kingdom's Secret",
    scenarios: [
      "found a crystal crown in their backyard that opened a magical portal",
      "stepped through and met Luna, a silver unicorn who led them into the Crystal Kingdom",
      "entered the Crystal Castle and learned they were destined to restore the land's fading magic",
      "danced at the Grand Moonlight Ball with fireflies and royalty, feeling the magic of the realm",
      "visited the ancient library where floating books revealed the kingdom's hidden past",
      "was gifted a glowing map by the talking mirror, showing where the Fairy Queen was last seen",
      "followed the map through starlit meadows, solving a rainbow riddle along the way",
      "found the lost Fairy Queen, who had been trapped in a time bubble needing a pure heart to break it",
      "freed the Queen and was crowned Guardian of the Crystal Kingdom by Luna and the council",
      "returned home with a charm that sparkled with memories and a promise to return anytime"
    ]
  },  
  space: {
    title: "My Adventure in the Cosmic Playground",
    scenarios: [
      "built a rocket ship from toy blocks, which magically transformed into a real spaceship when their teddy bear joined as co-pilot",
      "blasted off and flew through the clouds, waving goodbye to Earth",
      "landed on a colorful planet full of zero-gravity playgrounds and bouncing jelly-trampolines",
      "met Zippy, a shape-shifting alien who became their guide and taught them the Galactic Greeting Dance",
      "zoomed to the Planet of Sweets where they had a candy feast and made cotton candy castles",
      "took a comet ride through a rainbow nebula that painted their hair in sparkles",
      "visited the Moon's Secret Garden and planted a seed of friendship that glowed under starlight",
      "explored the Galactic Carnival, where they taught aliens how to dance and won a prize",
      "had a farewell feast with space whales who sang lullabies that made stars twinkle",
      "returned home safely, with stardust in their pockets and a promise from Zippy to visit again"
    ]
  }
  
};

interface StoryContent {
  title: string;
  pages: {
    title: string;
    content: string;
    imagePrompt: string;
  }[];
}

export async function generateStoryContent(
  childName: string,
  age: number,
  theme: keyof typeof storyThemes
): Promise<StoryContent> {
  const themeData = storyThemes[theme];
  const title = themeData.title;
  const scenarios = themeData.scenarios;

  // Generate exactly 10 pages
  const pages = scenarios.map((scenario, index) => {
    const pageNumber = index + 1;
    const content = generatePageContent(childName, age, theme, scenario, pageNumber);
    const imagePrompt = generateImagePrompt(childName, theme, scenario, pageNumber);
    
    return {
      title: `Page ${pageNumber}`,
      content,
      imagePrompt
    };
  });

  return {
    title,
    pages
  };
}

function generatePageContent(
  childName: string,
  age: number,
  theme: string,
  scenario: string,
  pageNumber: number
): string {
  return `${childName} ${scenario}`;
}

function generateImagePrompt(
  childName: string,
  theme: string,
  scenario: string,
  pageNumber: number
): string {
  return `A magical children's book illustration of ${childName} ${scenario}. The child's face and appearance must exactly match the reference image provided, maintaining their unique facial features, hairstyle, and overall look. The illustration should be in a ${theme} style, suitable for a children's book, with vibrant colors, magical lighting, and a dreamy atmosphere. The scene should be rich in detail and full of wonder, perfect for page ${pageNumber} of the story. Include subtle magical elements and ensure the child is the central focus of the image.`;
}
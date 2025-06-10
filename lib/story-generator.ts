import { StoryData, GeneratedStory, StoryPage } from '@/types/story';

const storyThemes = {
  adventure: {
    title: "The Great Adventure of {name}",
    scenarios: [
      "discovering a magical map in the attic",
      "meeting a friendly dragon in an enchanted cave",
      "crossing a rainbow bridge to a mystical land",
      "finding a treasure chest filled with golden coins",
      "riding on the back of a majestic unicorn",
      "exploring an ancient castle with secret passages",
      "befriending woodland creatures in an enchanted forest",
      "solving riddles posed by a wise old owl",
      "sailing across a sparkling magical lake",
      "climbing a beanstalk to reach the clouds",
      "discovering a hidden village of friendly elves",
      "using a magic wand to help others",
      "flying on a magic carpet through the sky",
      "finding a door that leads to different worlds",
      "meeting a genie who grants three wishes",
      "helping a lost fairy find her way home",
      "discovering they have the power to talk to animals",
      "finding a magic paintbrush that brings drawings to life",
      "celebrating with all their new magical friends",
      "returning home with wonderful memories and new powers"
    ]
  },
  space: {
    title: "{name}'s Cosmic Journey",
    scenarios: [
      "building a rocket ship in the backyard",
      "blasting off into the starry night sky",
      "landing on a colorful alien planet",
      "meeting friendly aliens who love to dance",
      "exploring craters on the moon",
      "discovering a space station floating among the stars",
      "riding on a comet through the galaxy",
      "visiting a planet made entirely of candy",
      "helping aliens repair their broken spaceship",
      "learning to float in zero gravity",
      "discovering a planet where everything is backwards",
      "meeting a robot who becomes their best friend",
      "finding a wormhole that leads to another galaxy",
      "visiting the rings of Saturn",
      "discovering a planet where music creates colors",
      "helping space creatures solve a mystery",
      "learning that kindness is universal",
      "saying goodbye to alien friends",
      "flying back to Earth with amazing stories",
      "looking up at the stars and remembering the adventure"
    ]
  },
  ocean: {
    title: "{name} and the Underwater Kingdom",
    scenarios: [
      "putting on a magical diving suit",
      "diving deep into the crystal blue ocean",
      "meeting a wise old sea turtle",
      "discovering a beautiful coral reef city",
      "befriending a family of colorful fish",
      "riding on the back of a gentle whale",
      "finding a treasure map in an old shipwreck",
      "meeting a mermaid who needs help",
      "exploring underwater caves filled with pearls",
      "dancing with dolphins in the ocean currents",
      "discovering a seahorse racing competition",
      "helping clean up the ocean with sea friends",
      "finding a magical conch shell",
      "meeting the wise octopus king",
      "discovering an underwater rainbow",
      "learning the songs of the whales",
      "helping baby sea turtles reach the ocean",
      "finding a way to breathe underwater forever",
      "saying farewell to ocean friends",
      "returning to shore with treasured memories"
    ]
  },
  forest: {
    title: "{name} in the Enchanted Forest",
    scenarios: [
      "following a glowing butterfly into the woods",
      "discovering a tree house built by forest sprites",
      "meeting a family of talking rabbits",
      "finding a clearing where flowers sing",
      "befriending a wise old bear",
      "discovering a stream that grants wishes",
      "meeting a fox who knows all the forest secrets",
      "finding mushrooms that glow in the dark",
      "helping a lost baby deer find its family",
      "discovering a tree that grows different fruits on each branch",
      "meeting the forest queen who rules with kindness",
      "learning the language of the trees",
      "discovering a hidden village of woodland creatures",
      "finding a magic acorn that grows into anything",
      "helping animals prepare for winter",
      "discovering they can understand all forest languages",
      "meeting a dragon who protects the forest",
      "learning that the forest has been waiting for them",
      "receiving a special gift from the forest",
      "promising to protect nature and returning home"
    ]
  },
  superhero: {
    title: "{name}: The Little Hero",
    scenarios: [
      "discovering they have special powers",
      "creating their very own superhero costume",
      "learning to fly above the neighborhood",
      "helping a cat stuck in a tree",
      "stopping a runaway shopping cart",
      "helping an elderly person cross the street",
      "finding a lost child in the park",
      "cleaning up litter with super speed",
      "helping vegetables grow in a community garden",
      "stopping bullies with the power of kindness",
      "helping firefighters save the day",
      "using super hearing to help find lost pets",
      "organizing a neighborhood clean-up day",
      "teaching other kids how to be everyday heroes",
      "helping at the local animal shelter",
      "using super strength to help move heavy things",
      "creating a team of young heroes",
      "learning that real heroes help others",
      "receiving thanks from everyone they helped",
      "realizing that everyone can be a hero"
    ]
  },
  princess: {
    title: "Princess {name}'s Royal Adventure",
    scenarios: [
      "discovering they are royalty of a magical kingdom",
      "putting on a beautiful, sparkly crown",
      "meeting their royal pet unicorn",
      "exploring the magnificent castle",
      "learning royal etiquette from a friendly butler",
      "hosting a tea party for stuffed animal friends",
      "dancing at a grand royal ball",
      "helping villagers solve their problems",
      "discovering a secret garden behind the castle",
      "meeting a dragon who just wants to be friends",
      "organizing a festival for the kingdom",
      "learning that being royal means helping others",
      "solving a mystery in the castle library",
      "helping other kingdoms make peace",
      "discovering they have the power to make plants grow",
      "meeting other royal children from distant lands",
      "learning that true beauty comes from kindness",
      "helping their kingdom in a time of need",
      "deciding to use their royal power for good",
      "realizing that being royal is about serving others"
    ]
  }
};

export function generateStoryContent(storyData: StoryData): GeneratedStory {
  const theme = storyData.theme || 'adventure';
  const themeData = storyThemes[theme as keyof typeof storyThemes] || storyThemes.adventure;
  
  const pages: StoryPage[] = themeData.scenarios.slice(0, 20).map((scenario, index) => ({
    pageNumber: index + 1,
    title: `Chapter ${index + 1}`,
    content: generatePageContent(scenario, storyData),
    scenario: scenario,
    imagePrompt: generateImagePrompt(scenario, storyData),
  }));

  return {
    title: themeData.title.replace('{name}', storyData.childName),
    pages,
    theme: theme,
  };
}

function generatePageContent(scenario: string, storyData: StoryData): string {
  const ageAppropriateContent = getAgeAppropriateContent(storyData.childAge);
  
  // Create story content based on scenario and child's details
  const stories = [
    `One magical day, ${storyData.childName} found themselves ${scenario}. With excitement sparkling in their eyes, they took their first brave step into this new adventure.`,
    
    `As ${storyData.childName} continued their journey, they discovered that ${scenario} was just the beginning of something truly extraordinary. Their heart filled with wonder at all the amazing things around them.`,
    
    `${storyData.childName} learned something special while ${scenario}. They realized that being brave doesn't mean not being scared - it means doing what's right even when you feel nervous.`,
    
    `The adventure led ${storyData.childName} to understand that ${scenario} taught them about the importance of kindness and helping others whenever possible.`,
    
    `While ${scenario}, ${storyData.childName} made new friends who showed them that differences make the world more beautiful and interesting.`
  ];
  
  // Return age-appropriate version
  const baseStory = stories[Math.floor(Math.random() * stories.length)];
  return ageAppropriateContent.enhance(baseStory);
}

function generateImagePrompt(scenario: string, storyData: StoryData): string {
  return `Create a beautiful, child-friendly animated illustration showing a ${storyData.childAge}-year-old child named ${storyData.childName} ${scenario}. The scene should be colorful, magical, and appropriate for children's storybooks. Style: whimsical cartoon illustration with bright colors and gentle animations.`;
}

function getAgeAppropriateContent(age: number) {
  if (age <= 4) {
    return {
      enhance: (content: string) => content.replace(/\b(big|large)\b/g, 'very big').replace(/\./g, '!')
    };
  } else if (age <= 7) {
    return {
      enhance: (content: string) => content
    };
  } else {
    return {
      enhance: (content: string) => content + ' They felt proud of their growing independence and wisdom.'
    };
  }
}
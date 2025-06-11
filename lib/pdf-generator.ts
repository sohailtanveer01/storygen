import jsPDF from 'jspdf';
import { GeneratedStory, StoryData } from '@/types/story';

const themeStyles = {
  superhero: {
    primary: [255, 69, 0], // Orange
    secondary: [0, 112, 192], // Blue
    background: [255, 248, 240], // Light orange tint
  },
  princess: {
    primary: [255, 105, 180], // Pink
    secondary: [147, 112, 219], // Purple
    background: [255, 240, 245], // Light pink tint
  },
  space: {
    primary: [25, 25, 112], // Dark blue
    secondary: [72, 61, 139], // Dark slate blue
    background: [240, 248, 255], // Light blue tint
  }
};

export async function generatePDF(story: GeneratedStory, storyData: StoryData) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const theme = story.theme as keyof typeof themeStyles;
  const style = themeStyles[theme] || themeStyles.superhero;

  // Title Page
  pdf.setFillColor(style.primary[0], style.primary[1], style.primary[2]);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  
  const titleLines = pdf.splitTextToSize(story.title, contentWidth);
  const titleHeight = titleLines.length * 12;
  pdf.text(titleLines, pageWidth / 2, (pageHeight - titleHeight) / 2, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`A Magical Story for ${storyData.childName}`, pageWidth / 2, pageHeight - 40, { align: 'center' });

  // Story Pages
  for (const page of story.pages) {
    pdf.addPage();
    
    // Background
    pdf.setFillColor(style.background[0], style.background[1], style.background[2]);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Title
    pdf.setTextColor(style.primary[0], style.primary[1], style.primary[2]);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    const titleLines = pdf.splitTextToSize(page.title, contentWidth);
    pdf.text(titleLines, margin, margin + 20);
    
    // Generated Image
    if (page.animatedImage) {
      try {
        // Fetch the image
        const imageResponse = await fetch(page.animatedImage);
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Create a temporary image to get dimensions
        const img = new Image();
        img.src = imageUrl;
        
        await new Promise((resolve) => {
          img.onload = () => {
            // Calculate dimensions maintaining aspect ratio
            const maxWidth = contentWidth;
            const maxHeight = 140; // Maximum height for the image
            let width = img.width;
            let height = img.height;
            
            // Calculate aspect ratio
            const aspectRatio = width / height;
            
            // Adjust dimensions to fit within maxWidth and maxHeight while maintaining aspect ratio
            if (width > maxWidth) {
              width = maxWidth;
              height = width / aspectRatio;
            }
            if (height > maxHeight) {
              height = maxHeight;
              width = height * aspectRatio;
            }
            
            // Add the image to the PDF with calculated dimensions
            const imageY = margin + 20;
            pdf.addImage(imageUrl, 'JPEG', margin, imageY, width, height);
            
            // Clean up
            URL.revokeObjectURL(imageUrl);
            resolve(null);
          };
        });
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        // Themed placeholder if image loading fails
        pdf.setFillColor(style.background[0], style.background[1], style.background[2]);
        pdf.rect(margin, margin + 40, contentWidth, 80, 'F');
        pdf.setTextColor(style.primary[0], style.primary[1], style.primary[2]);
        pdf.setFontSize(10);
        pdf.text('Image loading failed', pageWidth / 2, margin + 80, { align: 'center' });
      }
    } else {
      // Themed placeholder if no image is available
      pdf.setFillColor(style.background[0], style.background[1], style.background[2]);
      pdf.rect(margin, margin + 40, contentWidth, 80, 'F');
      pdf.setTextColor(style.primary[0], style.primary[1], style.primary[2]);
      pdf.setFontSize(10);
      pdf.text('Image not available', pageWidth / 2, margin + 80, { align: 'center' });
    }
    
    // Story content below the image
    const contentY = margin + 180; // Increased spacing after image
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14); // Slightly larger font
    pdf.setFont('helvetica', 'normal');
    
    const contentLines = pdf.splitTextToSize(page.content, contentWidth);
    pdf.text(contentLines, margin, contentY);
  }

  // Save the PDF
  pdf.save(`${storyData.childName}_Storybook.pdf`);
}
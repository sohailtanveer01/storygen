import jsPDF from 'jspdf';
import { GeneratedStory, StoryData } from '@/types/story';

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

  // Title Page
  pdf.setFillColor(138, 43, 226); // Purple background
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
    pdf.setFillColor(255, 250, 240); // Cream background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Page border
    pdf.setDrawColor(138, 43, 226);
    pdf.setLineWidth(2);
    pdf.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
    
    // Page number
    pdf.setTextColor(138, 43, 226);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${page.pageNumber}`, pageWidth - margin, margin);
    
    // Title
    pdf.setTextColor(0, 0, 0);
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
        
        // Add the image to the PDF
        const imageY = margin + 40;
        const imageHeight = 80;
        pdf.addImage(imageUrl, 'JPEG', margin, imageY, contentWidth, imageHeight);
        
        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        // Fallback to placeholder if image loading fails
        pdf.setFillColor(230, 230, 250); // Light purple
        pdf.rect(margin, margin + 40, contentWidth, 80, 'F');
        pdf.setTextColor(138, 43, 226);
        pdf.setFontSize(10);
        pdf.text('Image loading failed', pageWidth / 2, margin + 80, { align: 'center' });
      }
    } else {
      // Placeholder if no image is available
      pdf.setFillColor(230, 230, 250); // Light purple
      pdf.rect(margin, margin + 40, contentWidth, 80, 'F');
      pdf.setTextColor(138, 43, 226);
      pdf.setFontSize(10);
      pdf.text('Image not available', pageWidth / 2, margin + 80, { align: 'center' });
    }
    
    // Story content
    const contentY = margin + 140;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const contentLines = pdf.splitTextToSize(page.content, contentWidth);
    pdf.text(contentLines, margin, contentY);
  }

  // Save the PDF
  pdf.save(`${storyData.childName}_Storybook.pdf`);
}
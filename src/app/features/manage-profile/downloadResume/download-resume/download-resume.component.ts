import { Component, signal, EventEmitter, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Tabs, TabsElementModel } from '../../../common/edit-resume-tabs.const';
import jsPDF, {  } from 'jspdf';
import html2canvas from 'html2canvas';
import { DetailsCVComponent } from "../../../cv/detailsCV/details-cv/details-cv.component";
import { ShortCvComponent } from "../../../cv/shortCV/short-cv/short-cv.component";
import { CommonModule, NgClass } from '@angular/common';


interface Html2CanvasOptions {
  scale?: number;
  useCORS?: boolean;
  allowTaint?: boolean;
  logging?: boolean;
  scrollY?: number;
  windowHeight?: number;
  onclone?: (document: Document) => void;
}

@Component({
  selector: 'app-download-resume',
  imports: [NgClass, CommonModule,DetailsCVComponent, ShortCvComponent],
  templateUrl: './download-resume.component.html',
  styleUrl: './download-resume.component.scss'
})
export class DownloadResumeComponent {

  @Output() close = new EventEmitter<void>();

  iframeUrl!: SafeResourceUrl;
  mainTabs = Tabs;
  activeMainTab = signal(this.mainTabs[0]);
  showResume: boolean = true;
  activeTab: 'details' | 'short' = 'details';

  selectedFileType: 'pdf' | 'doc' = 'pdf';

  selectFileType(type: 'pdf' | 'doc') {
    this.selectedFileType = type;
  }


  setTab(tab: TabsElementModel) {
    this.activeMainTab.set(tab);
  }

  setActiveTab(tab: 'details' | 'short') {
    this.activeTab = tab;
  }

  isMainTabActive(tabId: string): boolean {
    return this.activeMainTab().value === tabId;
  }

  handleBack() {
    this.showResume = false;
    document.body.style.overflow = '';
    this.close.emit(); 
  }

  openInNewTab(event: MouseEvent) {
    event.preventDefault();
    if (this.isMainTabActive('details-cv')) {
      const url = '/jobseeker-panel/details-cv';
      const windowFeatures = 'width=1024,height=768,left=200,top=200,resizable=yes,scrollbars=yes,status=yes';
      window.open(url, '_blank', windowFeatures);
    } else if (this.isMainTabActive('short-cv')) {
      const url = '/jobseeker-panel/short-cv';
      const windowFeatures = 'width=1024,height=768,left=200,top=200,resizable=yes,scrollbars=yes,status=yes';
      window.open(url, '_blank', windowFeatures);
    } else {
      const url = '/jobseeker-panel';
    }
  }


downloadAsDOC() {
  const resumeElement = document.getElementById('resume-content');
  
  if (!resumeElement) {
    alert('Resume content not available for DOC download.');
    return;
  }

  const clone = resumeElement.cloneNode(true) as HTMLElement;
  
  this.cleanElementForDOC(clone);
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Resume</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        img { max-width: 100%; height: auto; }
      </style>
    </head>
    <body>
      ${clone.innerHTML}
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  
  const isDetailsCV = this.isMainTabActive('details-cv');
  const fileName = isDetailsCV ? 'resume-details.doc' : 'resume-short.doc';
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

private cleanElementForDOC(element: HTMLElement) {
  const elementsToRemove = element.querySelectorAll('.no-print, button, [onclick]');
  elementsToRemove.forEach(el => el.remove());
  
  // Fix image URLs
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (img.src.startsWith('http') && !img.src.startsWith(window.location.origin)) {
      // Convert to absolute URL
      img.src = img.src;
    }
  });
}


async downloadAsPDF() {
  const resumeElement = document.getElementById('resume-content');
  
  if (!resumeElement) {
    alert('Resume content not available for PDF download.');
    return;
  }

  const originalOverflow = resumeElement.style.overflow;
  const originalHeight = resumeElement.style.height;
  const originalPosition = resumeElement.style.position;
  
  resumeElement.style.overflow = 'visible';
  resumeElement.style.height = 'auto';
  resumeElement.style.position = 'relative';

  try {
    // Create options with proper typing
    const options: Html2CanvasOptions = {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: true,
    scrollY: 0,
    windowHeight: resumeElement.scrollHeight,
    onclone: (clonedDoc: Document) => {
      const clonedResume = clonedDoc.getElementById('resume-content');
      if (clonedResume) {
        clonedResume.style.overflow = 'visible';
        clonedResume.style.height = 'auto';
        clonedResume.style.position = 'relative';
      }
    }
  };

    // Create canvas
    const canvas = await html2canvas(resumeElement, options);
    
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95; // 5% margin
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 
      (pdfWidth - imgWidth * ratio) / 2,
      10,
      imgWidth * ratio, 
      imgHeight * ratio
    );

    // Determine filename based on active tab
    const isDetailsCV = this.isMainTabActive('details-cv');
    const fileName = isDetailsCV ? 'resume-details.pdf' : 'resume-short.pdf';
    
    // Save PDF
    pdf.save(fileName);
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('Failed to generate PDF. Please try again or use print option.');
  } finally {
    // Restore original styles
    resumeElement.style.overflow = originalOverflow;
    resumeElement.style.height = originalHeight;
    resumeElement.style.position = originalPosition;
  }
}


 triggerPrint(): void {
  
  // Get the original content
  const printContent = document.getElementById('resume-content');
  
  if (!printContent) {
    console.warn('Print content not found');
    return;
  }

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '1px';
  iframe.style.height = '1px';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  
  // Preserve all styles from the main document
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('\n');

  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          ${styles}
          <style>
            @page {
              size: auto;
              margin: 0;
            }
            body {
              margin: 20px !important;
              padding: 0 !important;
            }
            #printable-content {
              width: 100% !important;
            }
          </style>
        </head>
        <body>
          <div id="printable-content">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for content and images to load
    const waitForPrint = () => {
      if (iframe.contentDocument?.readyState === 'complete') {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      } else {
        setTimeout(waitForPrint, 100);
      }
    };

    waitForPrint();
  }
}

cancel(){
  this.showResume = false;
  document.body.style.overflow = '';

}
download(){
  if (this.selectedFileType === 'pdf') {
    this.downloadAsPDF();
  } else if (this.selectedFileType === 'doc') {
    this.downloadAsDOC();
  } else {
    alert('Please select a valid file type for download.');
  }

}
}
  













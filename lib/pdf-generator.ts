// FIR PDF Generator Service
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface FIRData {
  caseNumber: string;
  dateReported: string;
  dateOccurred: string;
  timeOccurred: string;
  location: string;
  crimeType: string;
  ipcSections: string[];

  complainant: {
    name: string;
    fatherName: string;
    age: number;
    address: string;
    phone: string;
    idProof: string;
    idNumber: string;
  };

  accused: {
    name: string;
    description: string;
    address: string;
    known: boolean;
  }[];

  incidentDescription: string;

  evidence: {
    item: string;
    collected: boolean;
  }[];

  witnesses: {
    name: string;
    address: string;
    phone: string;
  }[];

  actionTaken: string;

  signatures: {
    officerName: string;
    designation: string;
    aadhaarVerified: boolean;
    timestamp: string;
    gpsLocation: string;
    certificateId: string;
  }[];

  station: {
    name: string;
    address: string;
    district: string;
    state: string;
  };
}

export type PDFCopyType = 'original' | 'certified' | 'public' | 'draft';

export async function generateFIRPDF(
  firData: FIRData,
  copyType: PDFCopyType = 'original'
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let currentY = margin;

  // Generate unique document ID
  const documentId = generateDocumentHash(firData);
  const generatedAt = new Date().toISOString();

  // Generate QR Code
  const qrCodeDataUrl = await generateQRCode(
    `https://appolice.gov.in/verify/${firData.caseNumber}?hash=${documentId}`
  );

  // Helper functions
  const addPage = () => {
    doc.addPage();
    currentY = margin;
    addWatermark();
    addBorder();
  };

  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 30) {
      addPage();
    }
  };

  // Add watermark
  const addWatermark = () => {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);
    doc.setFont('helvetica', 'bold');

    // Save graphics state
    const textWidth = doc.getTextWidth('ANDHRA PRADESH POLICE');

    // Rotate and add watermark
    doc.text('ANDHRA PRADESH POLICE', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45,
    });

    // Add copy type watermark
    if (copyType === 'certified') {
      doc.setTextColor(0, 100, 0);
      doc.setFontSize(30);
      doc.text('CERTIFIED TRUE COPY', pageWidth / 2, pageHeight / 2 + 30, {
        align: 'center',
        angle: 45,
      });
    } else if (copyType === 'draft') {
      doc.setTextColor(255, 0, 0);
      doc.setFontSize(40);
      doc.text('DRAFT - NOT FOR LEGAL USE', pageWidth / 2, pageHeight / 2 + 30, {
        align: 'center',
        angle: 45,
      });
    }

    doc.setTextColor(0, 0, 0);
  };

  // Add decorative border
  const addBorder = () => {
    // Outer border
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Inner border
    doc.setLineWidth(0.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // Corner decorations
    const cornerSize = 10;
    doc.setDrawColor(0, 51, 102);

    // Top-left
    doc.line(5, 15, 15, 15);
    doc.line(15, 5, 15, 15);

    // Top-right
    doc.line(pageWidth - 15, 5, pageWidth - 15, 15);
    doc.line(pageWidth - 15, 15, pageWidth - 5, 15);

    // Bottom-left
    doc.line(5, pageHeight - 15, 15, pageHeight - 15);
    doc.line(15, pageHeight - 15, 15, pageHeight - 5);

    // Bottom-right
    doc.line(pageWidth - 15, pageHeight - 15, pageWidth - 15, pageHeight - 5);
    doc.line(pageWidth - 15, pageHeight - 15, pageWidth - 5, pageHeight - 15);
  };

  // Add initial watermark and border
  addWatermark();
  addBorder();

  // ===== HEADER SECTION =====
  currentY = 15;

  // AP Police Emblem (placeholder - using text)
  doc.setFillColor(0, 51, 102);
  doc.circle(pageWidth / 2, currentY + 10, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('AP', pageWidth / 2, currentY + 8, { align: 'center' });
  doc.text('POLICE', pageWidth / 2, currentY + 12, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  currentY += 25;

  // "ANDHRA PRADESH POLICE" title
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('ANDHRA PRADESH POLICE', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Station name and address
  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(firData.station.name, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.setFontSize(9);
  doc.text(firData.station.address, pageWidth / 2, currentY, { align: 'center' });
  currentY += 5;
  doc.text(`${firData.station.district}, ${firData.station.state}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  // "FIRST INFORMATION REPORT" title
  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.text('FIRST INFORMATION REPORT', pageWidth / 2, currentY, { align: 'center' });

  // Underline
  const firTitleWidth = doc.getTextWidth('FIRST INFORMATION REPORT');
  doc.setLineWidth(0.5);
  doc.line(
    (pageWidth - firTitleWidth) / 2,
    currentY + 1,
    (pageWidth + firTitleWidth) / 2,
    currentY + 1
  );
  currentY += 10;

  // FIR Number in red box
  doc.setFillColor(220, 53, 69);
  doc.roundedRect(pageWidth / 2 - 40, currentY - 5, 80, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text(`FIR No: ${firData.caseNumber}`, pageWidth / 2, currentY + 2, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  // QR Code (top right)
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 40, 15, 25, 25);
    doc.setFontSize(6);
    doc.text('Scan to verify', pageWidth - 27.5, 42, { align: 'center' });
  }

  currentY += 15;

  // ===== SECTION 1: CASE DETAILS =====
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('1. CASE DETAILS', margin, currentY);
  currentY += 2;
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  // Case details table
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const caseDetails = [
    ['FIR Number', firData.caseNumber],
    ['Date Reported', formatDate(firData.dateReported)],
    ['Date of Occurrence', formatDate(firData.dateOccurred)],
    ['Time of Occurrence', firData.timeOccurred],
    ['Place of Occurrence', firData.location],
    ['Type of Crime', firData.crimeType],
    ['IPC/BNS Sections', firData.ipcSections.join(', ')],
  ];

  caseDetails.forEach(([label, value]) => {
    doc.setFont('times', 'bold');
    doc.text(`${label}:`, margin + 5, currentY);
    doc.setFont('times', 'normal');
    doc.text(value, margin + 55, currentY);
    currentY += 6;
  });

  currentY += 5;

  // ===== SECTION 2: COMPLAINANT INFORMATION =====
  checkPageBreak(50);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('2. COMPLAINANT INFORMATION', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const complainantDetails = [
    ['Name', firData.complainant.name],
    ['Father\'s/Husband\'s Name', firData.complainant.fatherName],
    ['Age', `${firData.complainant.age} years`],
    ['Address', firData.complainant.address],
    ['Phone', copyType === 'public' ? maskPhone(firData.complainant.phone) : firData.complainant.phone],
    ['ID Proof', `${firData.complainant.idProof}: ${copyType === 'public' ? maskId(firData.complainant.idNumber) : firData.complainant.idNumber}`],
  ];

  complainantDetails.forEach(([label, value]) => {
    doc.setFont('times', 'bold');
    doc.text(`${label}:`, margin + 5, currentY);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(value, pageWidth - margin - 65);
    doc.text(lines, margin + 55, currentY);
    currentY += lines.length * 5 + 2;
  });

  currentY += 5;

  // ===== SECTION 3: ACCUSED DETAILS =====
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('3. ACCUSED DETAILS', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  if (firData.accused.length === 0 || !firData.accused[0].known) {
    doc.text('Accused: Unknown', margin + 5, currentY);
    currentY += 6;
  } else {
    firData.accused.forEach((accused, index) => {
      doc.setFont('times', 'bold');
      doc.text(`Accused ${index + 1}:`, margin + 5, currentY);
      currentY += 5;
      doc.setFont('times', 'normal');
      doc.text(`Name: ${accused.name}`, margin + 10, currentY);
      currentY += 5;
      doc.text(`Description: ${accused.description}`, margin + 10, currentY);
      currentY += 5;
      if (accused.address) {
        doc.text(`Address: ${accused.address}`, margin + 10, currentY);
        currentY += 5;
      }
      currentY += 3;
    });
  }

  currentY += 5;

  // ===== SECTION 4: INCIDENT DESCRIPTION =====
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('4. DETAILS OF INCIDENT', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const incidentLines = doc.splitTextToSize(firData.incidentDescription, pageWidth - margin * 2 - 10);
  incidentLines.forEach((line: string) => {
    checkPageBreak(6);
    doc.text(line, margin + 5, currentY);
    currentY += 5;
  });

  currentY += 5;

  // ===== SECTION 5: EVIDENCE COLLECTED =====
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('5. EVIDENCE COLLECTED', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  firData.evidence.forEach((evidence) => {
    checkPageBreak(6);
    const checkbox = evidence.collected ? '☑' : '☐';
    doc.text(`${checkbox} ${evidence.item}`, margin + 5, currentY);
    currentY += 5;
  });

  currentY += 5;

  // ===== SECTION 6: WITNESS DETAILS =====
  checkPageBreak(40);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('6. WITNESS DETAILS', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  if (firData.witnesses.length === 0) {
    doc.text('No witnesses recorded.', margin + 5, currentY);
    currentY += 6;
  } else {
    firData.witnesses.forEach((witness, index) => {
      checkPageBreak(15);
      doc.text(`${index + 1}. ${witness.name}`, margin + 5, currentY);
      currentY += 5;
      doc.text(`   Address: ${witness.address}`, margin + 5, currentY);
      currentY += 5;
      const phone = copyType === 'public' ? maskPhone(witness.phone) : witness.phone;
      doc.text(`   Phone: ${phone}`, margin + 5, currentY);
      currentY += 6;
    });
  }

  currentY += 5;

  // ===== SECTION 7: ACTION TAKEN =====
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('7. ACTION TAKEN', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 5;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const actionLines = doc.splitTextToSize(firData.actionTaken, pageWidth - margin * 2 - 10);
  actionLines.forEach((line: string) => {
    checkPageBreak(6);
    doc.text(line, margin + 5, currentY);
    currentY += 5;
  });

  currentY += 10;

  // ===== SECTION 8: DIGITAL SIGNATURES =====
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('8. DIGITAL SIGNATURES', margin, currentY);
  currentY += 2;
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  const sigWidth = (pageWidth - margin * 2 - 10) / 2;
  let sigX = margin + 5;
  let sigStartY = currentY;

  firData.signatures.forEach((sig, index) => {
    if (index > 0 && index % 2 === 0) {
      sigX = margin + 5;
      sigStartY = currentY + 5;
    }

    checkPageBreak(45);

    // Signature box
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.3);
    doc.rect(sigX, sigStartY, sigWidth - 5, 40, 'S');

    let sigY = sigStartY + 5;

    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.text(sig.officerName, sigX + 3, sigY);
    sigY += 4;

    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.text(sig.designation, sigX + 3, sigY);
    sigY += 5;

    // Digital signature placeholder
    doc.setFillColor(240, 240, 240);
    doc.rect(sigX + 3, sigY, sigWidth - 11, 10, 'F');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Digital Signature', sigX + (sigWidth - 11) / 2 + 3, sigY + 6, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    sigY += 13;

    doc.setFontSize(7);
    if (sig.aadhaarVerified) {
      doc.setTextColor(0, 128, 0);
      doc.text('✓ Aadhaar Verified', sigX + 3, sigY);
      doc.setTextColor(0, 0, 0);
    }
    sigY += 4;

    doc.text(`Time: ${sig.timestamp}`, sigX + 3, sigY);
    sigY += 3;
    doc.text(`Location: ${sig.gpsLocation}`, sigX + 3, sigY);
    sigY += 3;
    doc.text(`Cert ID: ${sig.certificateId}`, sigX + 3, sigY);

    if (index % 2 === 0) {
      sigX = margin + 5 + sigWidth + 5;
    } else {
      currentY = sigStartY + 45;
    }
  });

  if (firData.signatures.length % 2 === 1) {
    currentY = sigStartY + 45;
  }

  currentY += 10;

  // ===== FOOTER =====
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 20;

    // Footer line
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(7);
    doc.setFont('times', 'normal');
    doc.setTextColor(80, 80, 80);

    // Left side - Document info
    doc.text(`Document ID: ${documentId}`, margin, footerY);
    doc.text(`Generated: ${formatDateTime(generatedAt)}`, margin, footerY + 3);

    // Center - Page number
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });

    // Right side - Verification
    doc.text('Verify at: appolice.gov.in/verify', pageWidth - margin, footerY, { align: 'right' });
    doc.text('This is a digitally signed document', pageWidth - margin, footerY + 3, { align: 'right' });
  };

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Return as blob
  return doc.output('blob');
}

// Helper functions
function generateDocumentHash(data: FIRData): string {
  const str = JSON.stringify(data) + Date.now();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
}

async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 100,
      margin: 1,
      color: {
        dark: '#003366',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR Code generation failed:', err);
    return '';
  }
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  return 'XXX-XXX-' + phone.slice(-4);
}

function maskId(id: string): string {
  if (!id || id.length < 4) return id;
  return 'XXXX-XXXX-' + id.slice(-4);
}

// Download helper function
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Sample FIR data for testing
export function getSampleFIRData(): FIRData {
  return {
    caseNumber: 'AP-2026-VJA-00234',
    dateReported: '2026-01-02',
    dateOccurred: '2026-01-01',
    timeOccurred: '18:30',
    location: 'Central Market, MG Road, Vijayawada',
    crimeType: 'Theft - Mobile Phone',
    ipcSections: ['379', '380', '411'],

    complainant: {
      name: 'Rajesh Kumar Sharma',
      fatherName: 'Suresh Kumar Sharma',
      age: 35,
      address: 'H.No. 12-4-56, Gandhi Nagar, Vijayawada, Krishna District, Andhra Pradesh - 520001',
      phone: '9876543210',
      idProof: 'Aadhaar Card',
      idNumber: '1234-5678-9012'
    },

    accused: [
      {
        name: 'Unknown',
        description: 'Male, approximately 25-30 years old, medium build, wearing red shirt and black jeans, fled on a black motorcycle',
        address: '',
        known: false
      }
    ],

    incidentDescription: `On 01-01-2026 at approximately 18:30 hours, the complainant Shri Rajesh Kumar Sharma appeared at the police station and lodged the following complaint:

The complainant stated that he was walking through Central Market, MG Road, Vijayawada when an unknown person on a black motorcycle snatched his mobile phone (Samsung Galaxy S23 Ultra, Black color, IMEI: 123456789012345) worth approximately Rs. 1,25,000/- from his hand and fled towards the railway station side.

The complainant immediately raised an alarm but the accused managed to escape. The complainant then approached this police station to lodge the complaint.

Based on the complaint received, a case has been registered under sections 379 and 380 of IPC for investigation. The matter is under investigation.`,

    evidence: [
      { item: 'Written complaint from complainant', collected: true },
      { item: 'CCTV footage from nearby shops', collected: true },
      { item: 'Mobile purchase bill/receipt', collected: true },
      { item: 'IMEI documentation', collected: true },
      { item: 'Witness statements', collected: false },
      { item: 'Photographs of incident location', collected: true }
    ],

    witnesses: [
      {
        name: 'Venkat Rao',
        address: 'Shop No. 45, Central Market, Vijayawada',
        phone: '9988776655'
      },
      {
        name: 'Lakshmi Devi',
        address: 'H.No. 8-2-34, MG Road, Vijayawada',
        phone: '9877665544'
      }
    ],

    actionTaken: `1. FIR has been registered under sections 379, 380 of IPC.
2. Scene of crime has been visited and inspected.
3. CCTV footage from nearby establishments has been collected.
4. Mobile IMEI has been blocked through CEIR portal.
5. Alert has been circulated to all nearby police stations.
6. Investigation is in progress.`,

    signatures: [
      {
        officerName: 'K. Suresh Kumar',
        designation: 'Constable (PC-1234)',
        aadhaarVerified: true,
        timestamp: '02-01-2026 10:45:23',
        gpsLocation: '16.5062° N, 80.6480° E',
        certificateId: 'DSC-AP-2026-001234'
      },
      {
        officerName: 'R. Venkata Rao',
        designation: 'Sub Inspector (SI)',
        aadhaarVerified: true,
        timestamp: '02-01-2026 11:30:15',
        gpsLocation: '16.5062° N, 80.6480° E',
        certificateId: 'DSC-AP-2026-005678'
      },
      {
        officerName: 'P. Lakshmi Narayana',
        designation: 'Circle Inspector (CI)',
        aadhaarVerified: true,
        timestamp: '02-01-2026 14:15:42',
        gpsLocation: '16.5062° N, 80.6480° E',
        certificateId: 'DSC-AP-2026-009012'
      }
    ],

    station: {
      name: 'Vijayawada Central Police Station',
      address: 'Police Station Road, Governorpet',
      district: 'Krishna District',
      state: 'Andhra Pradesh - 520002'
    }
  };
}


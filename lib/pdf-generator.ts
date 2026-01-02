// FIR PDF Generator Service - Fixed and Enhanced
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

  filingOfficer?: {
    name: string;
    designation: string;
    badgeNumber: string;
    signature?: string;
    timestamp: string;
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
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await generateQRCode(
      `https://appolice.gov.in/verify/${firData.caseNumber}?hash=${documentId}`
    );
  } catch (e) {
    console.log('QR generation failed');
  }

  // Add watermark function
  const addWatermark = () => {
    doc.saveGraphicsState();
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(45);
    doc.setFont('helvetica', 'bold');

    // Diagonal watermark
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    doc.text('ANDHRA PRADESH POLICE', centerX, centerY, {
      align: 'center',
      angle: 45,
    });

    // Copy type watermark
    if (copyType === 'certified') {
      doc.setTextColor(0, 150, 0);
      doc.setFontSize(25);
      doc.text('CERTIFIED TRUE COPY', centerX, centerY + 25, {
        align: 'center',
        angle: 45,
      });
    } else if (copyType === 'draft') {
      doc.setTextColor(255, 100, 100);
      doc.setFontSize(35);
      doc.text('DRAFT - NOT FOR LEGAL USE', centerX, centerY + 25, {
        align: 'center',
        angle: 45,
      });
    }

    doc.restoreGraphicsState();
  };

  // Add decorative border
  const addBorder = () => {
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(1.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    doc.setLineWidth(0.5);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  };

  // Add footer to page
  const addFooter = (pageNum: number, totalPages: number) => {
    const footerY = pageHeight - 15;

    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);

    doc.text(`Document ID: ${documentId}`, margin, footerY);
    doc.text(`Generated: ${formatDateTime(generatedAt)}`, margin, footerY + 3);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
    doc.text('Verify: appolice.gov.in/verify', pageWidth - margin, footerY, { align: 'right' });
    doc.text('Digitally Signed Document', pageWidth - margin, footerY + 3, { align: 'right' });
  };

  // Add new page function
  const addPage = () => {
    doc.addPage();
    currentY = margin + 5;
    addWatermark();
    addBorder();
  };

  // Check page break
  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 25) {
      addPage();
      return true;
    }
    return false;
  };

  // Initialize first page
  addWatermark();
  addBorder();

  // ===== HEADER SECTION =====
  currentY = 18;

  // AP Police Emblem
  doc.setFillColor(0, 51, 102);
  doc.circle(pageWidth / 2, currentY + 8, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('AP', pageWidth / 2, currentY + 6, { align: 'center' });
  doc.text('POLICE', pageWidth / 2, currentY + 10, { align: 'center' });

  currentY += 22;

  // Title
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('ANDHRA PRADESH POLICE', pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  // Station info
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(firData.station.name, pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;
  doc.setFontSize(8);
  doc.text(firData.station.address, pageWidth / 2, currentY, { align: 'center' });
  currentY += 3;
  doc.text(`${firData.station.district}, ${firData.station.state}`, pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // FIR Title
  doc.setFontSize(13);
  doc.setFont('times', 'bold');
  doc.text('FIRST INFORMATION REPORT', pageWidth / 2, currentY, { align: 'center' });

  // Underline
  const titleWidth = doc.getTextWidth('FIRST INFORMATION REPORT');
  doc.setLineWidth(0.5);
  doc.line((pageWidth - titleWidth) / 2, currentY + 1, (pageWidth + titleWidth) / 2, currentY + 1);
  currentY += 8;

  // FIR Number box
  doc.setFillColor(200, 30, 30);
  doc.roundedRect(pageWidth / 2 - 35, currentY - 4, 70, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`FIR No: ${firData.caseNumber}`, pageWidth / 2, currentY + 2, { align: 'center' });

  // QR Code
  if (qrCodeDataUrl) {
    try {
      doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 38, 15, 22, 22);
      doc.setFontSize(5);
      doc.setTextColor(100, 100, 100);
      doc.text('Scan to verify', pageWidth - 27, 39, { align: 'center' });
    } catch (e) {
      console.log('QR image add failed');
    }
  }

  currentY += 12;
  doc.setTextColor(0, 0, 0);

  // ===== SECTION 1: CASE DETAILS =====
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('1. CASE DETAILS', margin, currentY);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const caseDetails = [
    ['FIR Number:', firData.caseNumber],
    ['Date Reported:', formatDate(firData.dateReported)],
    ['Date of Occurrence:', formatDate(firData.dateOccurred)],
    ['Time of Occurrence:', firData.timeOccurred],
    ['Place of Occurrence:', firData.location],
    ['Type of Crime:', firData.crimeType],
    ['IPC/BNS Sections:', firData.ipcSections.join(', ')],
  ];

  caseDetails.forEach(([label, value]) => {
    doc.setFont('times', 'bold');
    doc.text(label, margin + 3, currentY);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(String(value), pageWidth - margin - 55);
    doc.text(lines, margin + 45, currentY);
    currentY += lines.length * 4 + 1;
  });

  currentY += 4;

  // ===== SECTION 2: COMPLAINANT =====
  checkPageBreak(45);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('2. COMPLAINANT INFORMATION', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);

  const complainantInfo = [
    ['Name:', firData.complainant.name],
    ['Father\'s/Husband\'s Name:', firData.complainant.fatherName],
    ['Age:', `${firData.complainant.age} years`],
    ['Address:', firData.complainant.address],
    ['Phone:', copyType === 'public' ? maskPhone(firData.complainant.phone) : firData.complainant.phone],
    ['ID Proof:', `${firData.complainant.idProof}: ${copyType === 'public' ? maskId(firData.complainant.idNumber) : firData.complainant.idNumber}`],
  ];

  complainantInfo.forEach(([label, value]) => {
    doc.setFont('times', 'bold');
    doc.text(label, margin + 3, currentY);
    doc.setFont('times', 'normal');
    const lines = doc.splitTextToSize(String(value), pageWidth - margin - 55);
    doc.text(lines, margin + 45, currentY);
    currentY += lines.length * 4 + 1;
  });

  currentY += 4;

  // ===== SECTION 3: ACCUSED =====
  checkPageBreak(35);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('3. ACCUSED DETAILS', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  if (firData.accused.length === 0 || !firData.accused[0].known) {
    doc.text('Accused: Unknown / Not identified at the time of filing', margin + 3, currentY);
    currentY += 5;
  } else {
    firData.accused.forEach((accused, idx) => {
      checkPageBreak(20);
      doc.setFont('times', 'bold');
      doc.text(`Accused ${idx + 1}:`, margin + 3, currentY);
      currentY += 4;
      doc.setFont('times', 'normal');
      doc.text(`Name: ${accused.name}`, margin + 8, currentY);
      currentY += 4;
      const descLines = doc.splitTextToSize(`Description: ${accused.description}`, pageWidth - margin - 15);
      doc.text(descLines, margin + 8, currentY);
      currentY += descLines.length * 4;
      if (accused.address) {
        doc.text(`Address: ${accused.address}`, margin + 8, currentY);
        currentY += 4;
      }
      currentY += 2;
    });
  }

  currentY += 4;

  // ===== SECTION 4: INCIDENT DESCRIPTION =====
  checkPageBreak(50);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('4. DETAILS OF INCIDENT', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  const narrativeLines = doc.splitTextToSize(firData.incidentDescription, pageWidth - margin * 2 - 6);
  narrativeLines.forEach((line: string) => {
    checkPageBreak(5);
    doc.text(line, margin + 3, currentY);
    currentY += 4;
  });

  currentY += 4;

  // ===== SECTION 5: EVIDENCE =====
  checkPageBreak(30);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('5. EVIDENCE COLLECTED', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  firData.evidence.forEach((ev) => {
    checkPageBreak(5);
    const check = ev.collected ? '[X]' : '[ ]';
    doc.text(`${check} ${ev.item}`, margin + 3, currentY);
    currentY += 4;
  });

  currentY += 4;

  // ===== SECTION 6: WITNESSES =====
  checkPageBreak(30);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('6. WITNESS DETAILS', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  if (firData.witnesses.length === 0) {
    doc.text('No witnesses recorded at the time of filing.', margin + 3, currentY);
    currentY += 5;
  } else {
    firData.witnesses.forEach((w, idx) => {
      checkPageBreak(12);
      doc.text(`${idx + 1}. ${w.name}`, margin + 3, currentY);
      currentY += 4;
      doc.text(`   Address: ${w.address}`, margin + 3, currentY);
      currentY += 4;
      const phone = copyType === 'public' ? maskPhone(w.phone) : w.phone;
      doc.text(`   Phone: ${phone}`, margin + 3, currentY);
      currentY += 5;
    });
  }

  currentY += 4;

  // ===== SECTION 7: ACTION TAKEN =====
  checkPageBreak(25);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('7. ACTION TAKEN', margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  const actionLines = doc.splitTextToSize(firData.actionTaken, pageWidth - margin * 2 - 6);
  actionLines.forEach((line: string) => {
    checkPageBreak(5);
    doc.text(line, margin + 3, currentY);
    currentY += 4;
  });

  currentY += 8;

  // ===== SECTION 8: FILING OFFICER SIGNATURE =====
  if (firData.filingOfficer) {
    checkPageBreak(40);
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.setTextColor(0, 51, 102);
    doc.text('8. FILING OFFICER (CONSTABLE) SIGNATURE', margin, currentY);
    doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
    currentY += 6;

    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.3);
    doc.rect(margin + 3, currentY, (pageWidth - margin * 2 - 10) / 2, 30, 'S');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('times', 'bold');
    doc.text(firData.filingOfficer.name, margin + 6, currentY + 5);
    doc.setFont('times', 'normal');
    doc.text(firData.filingOfficer.designation, margin + 6, currentY + 9);
    doc.text(`Badge: ${firData.filingOfficer.badgeNumber}`, margin + 6, currentY + 13);

    // Signature box
    doc.setFillColor(245, 245, 245);
    doc.rect(margin + 6, currentY + 15, 50, 10, 'F');
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text('Digital Signature', margin + 31, currentY + 21, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text(`Time: ${firData.filingOfficer.timestamp}`, margin + 6, currentY + 28);

    currentY += 35;
  }

  // ===== SECTION 9: APPROVAL SIGNATURES =====
  checkPageBreak(50);
  doc.setFontSize(11);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 51, 102);
  const sigSectionNum = firData.filingOfficer ? '9' : '8';
  doc.text(`${sigSectionNum}. APPROVAL SIGNATURES`, margin, currentY);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);
  currentY += 6;

  const sigBoxWidth = (pageWidth - margin * 2 - 10) / 2;
  let sigX = margin + 3;
  let sigStartY = currentY;

  firData.signatures.forEach((sig, idx) => {
    if (idx > 0 && idx % 2 === 0) {
      sigX = margin + 3;
      sigStartY = currentY + 3;
    }

    checkPageBreak(38);

    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.3);
    doc.rect(sigX, sigStartY, sigBoxWidth - 3, 32, 'S');

    let sigY = sigStartY + 4;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.setFont('times', 'bold');
    doc.text(sig.officerName, sigX + 3, sigY);
    sigY += 3;
    doc.setFont('times', 'normal');
    doc.text(sig.designation, sigX + 3, sigY);
    sigY += 4;

    // Signature placeholder
    doc.setFillColor(245, 245, 245);
    doc.rect(sigX + 3, sigY, sigBoxWidth - 9, 8, 'F');
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text('Digital Signature', sigX + (sigBoxWidth - 9) / 2 + 3, sigY + 5, { align: 'center' });
    sigY += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    if (sig.aadhaarVerified) {
      doc.setTextColor(0, 128, 0);
      doc.text('✓ Aadhaar Verified', sigX + 3, sigY);
      doc.setTextColor(0, 0, 0);
    }
    sigY += 3;
    doc.text(`Time: ${sig.timestamp}`, sigX + 3, sigY);
    sigY += 3;
    doc.text(`GPS: ${sig.gpsLocation}`, sigX + 3, sigY);
    sigY += 3;
    doc.text(`Cert: ${sig.certificateId}`, sigX + 3, sigY);

    if (idx % 2 === 0) {
      sigX = margin + 3 + sigBoxWidth + 4;
    } else {
      currentY = sigStartY + 35;
    }
  });

  if (firData.signatures.length % 2 === 1) {
    currentY = sigStartY + 35;
  }

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

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
  return Math.abs(hash).toString(16).toUpperCase().padStart(12, '0');
}

async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 100,
      margin: 1,
      color: { dark: '#003366', light: '#ffffff' }
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
    return dateStr || 'Not specified';
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
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone || 'N/A';
  return 'XXXXXX' + phone.slice(-4);
}

function maskId(id: string): string {
  if (!id || id.length < 4) return id || 'N/A';
  return 'XXXX-XXXX-' + id.slice(-4);
}

// Download function
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// Sample FIR data
export function getSampleFIRData(): FIRData {
  return {
    caseNumber: 'AP-2026-VJA-00234',
    dateReported: '2026-01-02',
    dateOccurred: '2026-01-01',
    timeOccurred: '18:30',
    location: 'Central Market, MG Road, Vijayawada',
    crimeType: 'Theft - Mobile Phone',
    ipcSections: ['379 - Theft', '380 - Theft in dwelling house'],

    complainant: {
      name: 'Rajesh Kumar Sharma',
      fatherName: 'Suresh Kumar Sharma',
      age: 35,
      address: 'H.No. 12-4-56, Gandhi Nagar, Vijayawada, Krishna District, AP - 520001',
      phone: '9876543210',
      idProof: 'Aadhaar Card',
      idNumber: '1234-5678-9012'
    },

    accused: [
      {
        name: 'Unknown',
        description: 'Male, 25-30 years, medium build, red shirt, black jeans, fled on black motorcycle',
        address: '',
        known: false
      }
    ],

    incidentDescription: `On 01-01-2026 at approximately 18:30 hours, the complainant Shri Rajesh Kumar Sharma appeared at this police station and lodged the following complaint:

The complainant stated that he was walking through Central Market, MG Road, Vijayawada when an unknown person riding a black motorcycle snatched his mobile phone (Samsung Galaxy S23 Ultra, Black color, IMEI: 123456789012345) worth approximately Rs. 1,25,000/- from his hand and fled towards the railway station.

The complainant immediately raised an alarm but the accused managed to escape. The complainant then approached this police station to lodge the formal complaint.

Based on the complaint received, a case has been registered under sections 379 and 380 of IPC for investigation.`,

    evidence: [
      { item: 'Written complaint from complainant', collected: true },
      { item: 'CCTV footage from nearby shops', collected: true },
      { item: 'Mobile purchase bill/receipt', collected: true },
      { item: 'IMEI documentation', collected: true },
      { item: 'Witness statements', collected: false },
      { item: 'Photographs of incident location', collected: true }
    ],

    witnesses: [
      { name: 'Venkat Rao', address: 'Shop No. 45, Central Market, Vijayawada', phone: '9988776655' },
      { name: 'Lakshmi Devi', address: 'H.No. 8-2-34, MG Road, Vijayawada', phone: '9877665544' }
    ],

    actionTaken: `1. FIR registered under sections 379, 380 of IPC.
2. Scene of crime visited and inspected.
3. CCTV footage from nearby establishments collected.
4. Mobile IMEI blocked through CEIR portal.
5. Alert circulated to all nearby police stations.
6. Investigation in progress.`,

    filingOfficer: {
      name: 'K. Suresh Kumar',
      designation: 'Police Constable',
      badgeNumber: 'PC-1234',
      timestamp: '02-01-2026 10:45:23'
    },

    signatures: [
      {
        officerName: 'R. Venkata Rao',
        designation: 'Sub Inspector (SI)',
        aadhaarVerified: true,
        timestamp: '02-01-2026 11:30:15',
        gpsLocation: '16.5062°N, 80.6480°E',
        certificateId: 'DSC-AP-2026-005678'
      },
      {
        officerName: 'P. Lakshmi Narayana',
        designation: 'Circle Inspector (CI)',
        aadhaarVerified: true,
        timestamp: '02-01-2026 14:15:42',
        gpsLocation: '16.5062°N, 80.6480°E',
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


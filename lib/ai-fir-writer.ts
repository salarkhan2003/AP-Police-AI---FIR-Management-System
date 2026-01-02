// AI FIR Writer Service using Gemini API

const GEMINI_API_KEY = 'AIzaSyCAuhQwSqprfgRSpPWiSRmv0-lNQ6Y4uRk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface FIRGenerationInput {
  keywords: string[];
  crimeType?: string;
  location?: string;
  date?: string;
  time?: string;
  complainantName?: string;
  language?: 'english' | 'hindi' | 'telugu';
}

export interface GeneratedFIR {
  narrative: string;
  suggestedIPCSections: string[];
  suggestedEvidence: string[];
  riskScore: number;
  summary: string;
}

export async function generateFIRNarrative(input: FIRGenerationInput): Promise<GeneratedFIR> {
  const prompt = buildPrompt(input);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return parseGeneratedResponse(generatedText, input);
  } catch (error) {
    console.error('Error generating FIR:', error);
    // Return fallback response
    return generateFallbackFIR(input);
  }
}

function buildPrompt(input: FIRGenerationInput): string {
  const keywordsList = input.keywords.join(', ');
  const language = input.language || 'english';

  return `You are an expert police FIR (First Information Report) writer for the Andhra Pradesh Police Department in India. Generate a professional, legally appropriate FIR narrative based on the following information.

KEYWORDS/DETAILS PROVIDED:
${keywordsList}
${input.crimeType ? `Crime Type: ${input.crimeType}` : ''}
${input.location ? `Location: ${input.location}` : ''}
${input.date ? `Date: ${input.date}` : ''}
${input.time ? `Time: ${input.time}` : ''}
${input.complainantName ? `Complainant: ${input.complainantName}` : ''}

LANGUAGE: ${language}

Please generate the following in JSON format:
{
  "narrative": "A detailed, professional FIR narrative paragraph (150-250 words) written in formal police language. Include all relevant details, time, place, and circumstances of the incident. Use phrases like 'The complainant stated that...' and 'As per the statement recorded...'",
  "suggestedIPCSections": ["Array of relevant IPC section numbers with brief descriptions"],
  "suggestedEvidence": ["Array of evidence that should be collected for this type of case"],
  "riskScore": "A number from 1-10 indicating the severity/urgency of the case",
  "summary": "A one-line summary of the incident (max 20 words)"
}

Important Guidelines:
1. Use formal police report language
2. Be factual and objective
3. Include placeholders like [COMPLAINANT_NAME] if name not provided
4. Mention relevant IPC/BNS sections
5. The narrative should be suitable for an official police document
6. If the language is Hindi or Telugu, generate the narrative in that language but keep section names in English

Generate ONLY the JSON response, no additional text.`;
}

function parseGeneratedResponse(text: string, input: FIRGenerationInput): GeneratedFIR {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        narrative: parsed.narrative || generateFallbackNarrative(input),
        suggestedIPCSections: parsed.suggestedIPCSections || [],
        suggestedEvidence: parsed.suggestedEvidence || [],
        riskScore: parseInt(parsed.riskScore) || 5,
        summary: parsed.summary || 'Incident reported'
      };
    }
  } catch (e) {
    console.error('Error parsing response:', e);
  }

  // If parsing fails, use the text as narrative
  return {
    narrative: text || generateFallbackNarrative(input),
    suggestedIPCSections: getSuggestedSections(input.crimeType || input.keywords.join(' ')),
    suggestedEvidence: getSuggestedEvidence(input.crimeType || input.keywords.join(' ')),
    riskScore: 5,
    summary: `${input.crimeType || 'Incident'} reported at ${input.location || 'location'}`
  };
}

function generateFallbackFIR(input: FIRGenerationInput): GeneratedFIR {
  return {
    narrative: generateFallbackNarrative(input),
    suggestedIPCSections: getSuggestedSections(input.crimeType || input.keywords.join(' ')),
    suggestedEvidence: getSuggestedEvidence(input.crimeType || input.keywords.join(' ')),
    riskScore: 5,
    summary: `${input.crimeType || 'Incident'} reported at ${input.location || 'the location'}`
  };
}

function generateFallbackNarrative(input: FIRGenerationInput): string {
  const complainant = input.complainantName || '[COMPLAINANT_NAME]';
  const location = input.location || '[LOCATION]';
  const date = input.date || '[DATE]';
  const time = input.time || '[TIME]';
  const crimeType = input.crimeType || 'incident';
  const keywords = input.keywords.join(', ');

  return `On ${date} at approximately ${time}, the complainant ${complainant} appeared at the police station and reported the following incident. As per the statement recorded, the complainant stated that a ${crimeType.toLowerCase()} occurred at ${location}. The incident involved the following: ${keywords}. The complainant further stated that immediate action is required. Based on the complaint received, a case has been registered for further investigation. The complainant has been assured that appropriate legal action will be taken against the accused person(s) as per the provisions of law.`;
}

function getSuggestedSections(crimeInfo: string): string[] {
  const lowerInfo = crimeInfo.toLowerCase();

  const sectionMap: { [key: string]: string[] } = {
    'theft': ['379 - Theft', '380 - Theft in dwelling house', '411 - Dishonestly receiving stolen property'],
    'robbery': ['392 - Robbery', '397 - Robbery with attempt to cause death', '398 - Attempt to commit robbery'],
    'assault': ['323 - Voluntarily causing hurt', '324 - Voluntarily causing hurt by dangerous weapons', '325 - Voluntarily causing grievous hurt'],
    'murder': ['302 - Murder', '307 - Attempt to murder', '304 - Culpable homicide'],
    'cyber': ['420 - Cheating', '467 - Forgery of valuable security', '468 - Forgery for purpose of cheating', '471 - Using forged document as genuine'],
    'domestic': ['498A - Cruelty by husband or relatives', '323 - Voluntarily causing hurt', '506 - Criminal intimidation'],
    'fraud': ['420 - Cheating', '406 - Criminal breach of trust', '467 - Forgery'],
    'kidnapping': ['363 - Kidnapping', '365 - Kidnapping with intent to secretly confine', '366 - Kidnapping woman to compel marriage'],
    'missing': ['363 - Kidnapping', '365 - Wrongful confinement', '366 - Kidnapping/abducting woman'],
    'accident': ['279 - Rash driving', '337 - Causing hurt by act endangering life', '338 - Causing grievous hurt', '304A - Causing death by negligence'],
    'rape': ['376 - Rape', '354 - Assault on woman with intent to outrage modesty', '509 - Word, gesture or act intended to insult modesty'],
    'chain': ['392 - Robbery', '356 - Assault in attempt to commit theft', '379 - Theft'],
    'mobile': ['379 - Theft', '411 - Dishonestly receiving stolen property'],
    'vehicle': ['379 - Theft', '411 - Dishonestly receiving stolen property', '413 - Habitually dealing in stolen property']
  };

  for (const [key, sections] of Object.entries(sectionMap)) {
    if (lowerInfo.includes(key)) {
      return sections;
    }
  }

  return ['154 CrPC - Information in cognizable cases', '156 CrPC - Police officer\'s power to investigate'];
}

function getSuggestedEvidence(crimeInfo: string): string[] {
  const lowerInfo = crimeInfo.toLowerCase();

  const baseEvidence = [
    'Complainant statement (written and recorded)',
    'Identity proof of complainant',
    'Photographs of the scene'
  ];

  if (lowerInfo.includes('theft') || lowerInfo.includes('robbery') || lowerInfo.includes('mobile') || lowerInfo.includes('vehicle')) {
    return [
      ...baseEvidence,
      'CCTV footage from nearby areas',
      'List of stolen items with estimated value',
      'Purchase receipts/bills of stolen items',
      'Witness statements',
      'IMEI number (for mobile theft)'
    ];
  }

  if (lowerInfo.includes('cyber') || lowerInfo.includes('fraud')) {
    return [
      ...baseEvidence,
      'Screenshots of fraudulent messages/calls',
      'Bank transaction records',
      'Email headers and communication logs',
      'Device logs and IP addresses',
      'UPI/Payment app transaction history'
    ];
  }

  if (lowerInfo.includes('assault') || lowerInfo.includes('domestic')) {
    return [
      ...baseEvidence,
      'Medical examination report',
      'Injury photographs',
      'Witness statements',
      'Previous complaint records (if any)',
      'Audio/video recordings (if available)'
    ];
  }

  if (lowerInfo.includes('accident')) {
    return [
      ...baseEvidence,
      'Vehicle registration documents',
      'Driver\'s license',
      'Insurance documents',
      'Medical reports of injured',
      'Traffic camera footage',
      'Witness statements',
      'Sketch of accident scene'
    ];
  }

  return [
    ...baseEvidence,
    'CCTV footage (if available)',
    'Witness statements',
    'Any documentary evidence',
    'Physical evidence from scene'
  ];
}

// Quick FIR generation from simple keywords
export async function quickGenerateFIR(keywords: string): Promise<GeneratedFIR> {
  const keywordArray = keywords.split(/[,\s]+/).filter(k => k.trim().length > 0);

  // Try to extract structured info from keywords
  const input: FIRGenerationInput = {
    keywords: keywordArray,
    crimeType: detectCrimeType(keywords),
    location: extractLocation(keywords),
    date: extractDate(keywords),
    time: extractTime(keywords)
  };

  return generateFIRNarrative(input);
}

function detectCrimeType(keywords: string): string | undefined {
  const lowerKeywords = keywords.toLowerCase();

  const crimeTypes: { [key: string]: string } = {
    'theft': 'Theft',
    'robbery': 'Robbery',
    'stolen': 'Theft',
    'assault': 'Assault',
    'beat': 'Assault',
    'hit': 'Assault',
    'murder': 'Murder',
    'kill': 'Murder',
    'fraud': 'Fraud',
    'scam': 'Cyber Fraud',
    'cyber': 'Cyber Crime',
    'online': 'Cyber Crime',
    'domestic': 'Domestic Violence',
    'wife': 'Domestic Violence',
    'husband': 'Domestic Violence',
    'accident': 'Road Accident',
    'vehicle': 'Vehicle Theft',
    'car': 'Vehicle Theft',
    'bike': 'Vehicle Theft',
    'mobile': 'Mobile Theft',
    'phone': 'Mobile Theft',
    'missing': 'Missing Person',
    'kidnap': 'Kidnapping',
    'chain': 'Chain Snatching',
    'gold': 'Robbery/Theft',
    'jewelry': 'Robbery/Theft'
  };

  for (const [key, type] of Object.entries(crimeTypes)) {
    if (lowerKeywords.includes(key)) {
      return type;
    }
  }

  return undefined;
}

function extractLocation(keywords: string): string | undefined {
  // Common location patterns
  const locationPatterns = [
    /(?:at|near|in)\s+([A-Za-z\s]+(?:market|road|street|area|colony|nagar|puram|station|mall|shop|store|house|building|office|bank|hospital))/i,
    /([A-Za-z]+\s*(?:Central|East|West|North|South))/i,
    /(Vijayawada|Guntur|Visakhapatnam|Hyderabad|Tirupati|Rajahmundry|Nellore|Kakinada)/i
  ];

  for (const pattern of locationPatterns) {
    const match = keywords.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return undefined;
}

function extractDate(keywords: string): string | undefined {
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(today|yesterday|last\s+(?:night|week|month))/i,
    /(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December))/i
  ];

  for (const pattern of datePatterns) {
    const match = keywords.match(pattern);
    if (match) {
      if (match[1].toLowerCase() === 'today') {
        return new Date().toLocaleDateString();
      }
      if (match[1].toLowerCase() === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toLocaleDateString();
      }
      return match[1];
    }
  }

  return undefined;
}

function extractTime(keywords: string): string | undefined {
  const timePatterns = [
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/,
    /(\d{1,2}:\d{2})/,
    /(morning|afternoon|evening|night|midnight|noon)/i
  ];

  for (const pattern of timePatterns) {
    const match = keywords.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}


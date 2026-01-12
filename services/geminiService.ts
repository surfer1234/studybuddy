
import { GoogleGenAI, Type } from "@google/genai";
import { StudyFeature, QuizDifficulty } from "../types";

const SYSTEM_INSTRUCTION = `Je bent StudyBuddy, een hyper-intelligente AI voor Nederlandse studenten (10-18 jaar).
Je output is enthousiast, modern en gebruikt soms emoji's.
Analyseer ALTIJD alle pagina's als één context.
Pas je taalgebruik aan op het niveau: 
- Groep 7/8: Simpel, verhalend, focus op de basis.
- VMBO/HAVO: To-the-point, praktisch.
- VWO/HBO/WO: Academisch, diepgaand, kritisch.`;

export async function analyzeStudyMaterial(
  imagesBase64: string[],
  feature: StudyFeature,
  options: { level?: string; grade?: string; difficulty?: QuizDifficulty; questionCount?: number; [key: string]: any } = {}
): Promise<any> {
  // Fix: Initializing GoogleGenAI with named parameter apiKey as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Fix: Selecting gemini-3-pro-preview for complex reasoning and content analysis tasks
  const model = 'gemini-3-pro-preview';
  
  const imageParts = imagesBase64.map(base64 => ({
    inlineData: {
      data: base64.split(',')[1] || base64,
      mimeType: 'image/jpeg',
    },
  }));

  const levelInfo = options.level ? `\nDOELGROEP NIVEAU: ${options.level}` : '';
  const gradeInfo = options.grade ? `\nLEERJAAR: ${options.grade}` : '';
  const diffInfo = options.difficulty ? `\nMOEILIJKHEIDSGRAAD: ${options.difficulty}` : '\nMOEILIJKHEIDSGRAAD: GEMIDDELD';
  const personalization = `${levelInfo}${gradeInfo}${diffInfo}`;

  let prompt = '';
  let responseSchema: any = null;

  switch (feature) {
    case StudyFeature.SUMMARY:
      prompt = `Maak een vette samenvatting van AL deze pagina's. Gebruik emoji's voor de sfeer. 
      Zorg dat elk hoofdstuk aan bod komt.${personalization}`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ['title', 'content']
            }
          },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'chapters', 'keyConcepts']
      };
      break;

    case StudyFeature.QUIZ:
      const qCount = options.questionCount || 10;
      prompt = `Genereer een OVERHORING van precies ${qCount} vragen.${personalization}
      GEBRUIK EEN MIX VAN: 
      - MCQ (Multiple Choice)
      - OPEN (Open vragen)
      - TRUE_FALSE (Waar/Niet waar)
      - INVUL (Gebruik [?] voor het gat)
      - MATCH (Koppel begrippen aan definities)
      - ORDERING (Zet stappen of jaartallen in de juiste volgorde)
      
      Vraagtypes moeten passen bij de moeilijkheidsgraad ${options.difficulty || 'GEMIDDELD'}.
      Geef bij elke vraag een duidelijke uitleg (explanation).`;
      
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['MCQ', 'OPEN', 'TRUE_FALSE', 'INVUL', 'MATCH', 'ORDERING'] },
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Gebruikt voor MCQ opties, MATCH items, of ORDERING elementen" },
                answer: { type: Type.STRING, description: "Correct antwoord (voor MCQ) of de juiste volgorde/koppeling gescheiden door komma's" },
                explanation: { type: Type.STRING }
              },
              required: ['id', 'type', 'question', 'answer', 'explanation']
            }
          }
        },
        required: ['questions']
      };
      break;

    case StudyFeature.TIPS:
      prompt = `Genereer gepersonaliseerde studietips voor dit materiaal.${personalization}
      Lever een JSON met de volgende velden:
      - mnemonics: array van objecten met {concept, trick} (ezelsbruggetjes)
      - strategies: array van strings (hoe dit vak te leren)
      - pitfalls: array van strings (veelgemaakte fouten in dit onderwerp)
      - timeManagement: een advies per hoofdstuk/onderwerp hoe lang te leren
      - examTips: specifieke tactieken voor de toets
      - realLifeConnections: hoe pas je dit toe in de echte wereld?`;
      
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          mnemonics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                concept: { type: Type.STRING },
                trick: { type: Type.STRING }
              },
              required: ['concept', 'trick']
            }
          },
          strategies: { type: Type.ARRAY, items: { type: Type.STRING } },
          pitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeManagement: { type: Type.ARRAY, items: { type: Type.STRING } },
          examTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          realLifeConnections: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['title', 'mnemonics', 'strategies', 'pitfalls', 'timeManagement', 'examTips', 'realLifeConnections']
      };
      break;

    case StudyFeature.CHEAT_SHEET:
      prompt = `Maak een compact leerbriefje van AL dit materiaal.${personalization}`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['label', 'items']
            }
          }
        },
        // Fix: Added missing required top-level fields for the schema
        required: ['title', 'sections']
      };
      break;

    default:
      prompt = 'Analyseer dit materiaal.';
  }

  try {
    // Fix: Using generateContent with correct model name and multi-part content
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [...imageParts, { text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema
      },
    });
    // Fix: Directly accessing .text property (not a method) as per SDK guidelines
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw error;
  }
}

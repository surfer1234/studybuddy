
export enum StudyFeature {
  SUMMARY = 'SUMMARY',
  CHEAT_SHEET = 'CHEAT_SHEET',
  QUIZ = 'QUIZ',
  TIPS = 'TIPS',
  EXTRA_INFO = 'EXTRA_INFO'
}

export type QuizDifficulty = 'BASIS' | 'GEMIDDELD' | 'GEVORDERD';

export interface UserSettings {
  name: string;
  level: string;
  grade: string;
  notifications: boolean;
  aiPersonality: 'HYPED' | 'CHILL' | 'PRO';
  streakReminders: boolean;
  avatarSeed: string;
  apiKey?: string;
  onboardingComplete?: boolean;
}

export interface SummaryData {
  title: string;
  chapters: {
    title: string;
    content: string;
  }[];
  keyConcepts: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'MCQ' | 'OPEN' | 'TRUE_FALSE' | 'INVUL' | 'MATCH' | 'ORDERING';
  question: string;
  options?: string[]; 
  answer: string;
  explanation: string;
  difficulty?: QuizDifficulty;
}

export interface QuizData {
  questions: QuizQuestion[];
  difficulty: QuizDifficulty;
}

export interface TipsData {
  title: string;
  mnemonics: { concept: string; trick: string }[];
  strategies: string[];
  pitfalls: string[];
  timeManagement: string[];
  examTips: string[];
  realLifeConnections: string[];
}

export interface CheatSheetData {
  title: string;
  sections: {
    label: string;
    items: string[];
  }[];
  formulas?: string[];
  mnemonics?: string[];
}

export interface StudyResult {
  id: string;
  date: string;
  testDate?: string;
  level?: string;
  grade?: string;
  subject: string;
  images: string[];
  feature: StudyFeature;
  content: any;
  generatedFeatures?: StudyFeature[];
  quizDifficulty?: QuizDifficulty;
  lastScore?: number;
}

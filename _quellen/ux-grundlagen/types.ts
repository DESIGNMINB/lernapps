export enum ViewState {
  HOME = 'HOME',
  INTRO = 'INTRO',
  FUNDAMENTALS = 'FUNDAMENTALS',
  THEORY = 'THEORY',
  ISO = 'ISO',
  GESTALT = 'GESTALT',
  PERCEPTION = 'PERCEPTION',
  EVALUATION = 'EVALUATION',
  LAB = 'LAB',
  QUIZ = 'QUIZ',
  LITERATURE = 'LITERATURE',
  GLOSSARY = 'GLOSSARY',
  ACCESSIBILITY = 'ACCESSIBILITY',
  METHODS = 'METHODS',
  AI_UX = 'AI_UX',
  UX_LAWS = 'UX_LAWS',
  DESIGN_SYSTEM = 'DESIGN_SYSTEM'
}

export interface UxLaw {
  id: string;
  name: string;
  description: string;
  takeaway: string;
  category: 'Heuristik' | 'Psychologie' | 'Prinzip';
  imageUrl?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Grundlagen' | 'Psychologie' | 'Prozess' | 'UI-Elemente' | 'Testing' | 'Metriken';
}

export interface Example {
  context: string;
  title: string;
  description: string;
}

export interface GestaltPrinciple {
  id: string;
  name: string;
  detailedDescription: string;
  visualType: string;
  examples: Example[];
}

export interface IsoPrinciple {
  id: number;
  title: string;
  englishTitle: string;
  description: string;
  example: string;
}

export interface NielsenHeuristic {
  id: number;
  title: string;
  description: string;
  example: string;
}

export interface LiteratureItem {
  id: string;
  title: string;
  author: string;
  year: string;
  isbn: string;
  description: string;
  category: string;
  color: string;
}

export interface OnlineResource {
  id: string;
  platform: string;
  title: string;
  description: string;
  level: string;
  cost: string;
  icon: string;
}

export interface GuideResource {
  title: string;
  description: string;
  url?: string;
  isFree?: boolean;
}

export interface GuideSection {
  id: string;
  title: string;
  description?: string;
  resources: GuideResource[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source?: 'ai' | 'fallback';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

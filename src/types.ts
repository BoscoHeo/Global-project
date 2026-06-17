export enum EvaluationLevel {
  VERY_GOOD = "매우 잘함",
  GOOD = "잘함",
  NORMAL = "보통",
  NEED_EFFORT = "노력 요함"
}

export type TopicType = "음식" | "언어/인사" | "의상/축제" | "통합";

export interface GroupMember {
  name: string;
  role: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  category: TopicType;
  screenVisual: string;
  audioText: string;
  notes: string;
}

export interface StoryboardData {
  scenes: StoryboardScene[];
  aiFeedback?: string;
  aiRecommendations?: string[];
  aiLevel?: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  continent: string;
  flag: string;
  description: string;
  highlights: {
    food: string;
    greeting: string;
    costume: string;
    festival: string;
  };
  quiz: QuizQuestion[];
}

export interface StampData {
  countryCode: string;
  countryName: string;
  unlockedAt: string;
}

export interface UNResolution {
  sponsorCountry: string;
  resolutionNumber: string;
  title: string;
  preamble: string; // 전문
  operativeClauses: string[]; // 실천 조항
  aiAnalysis?: string;
  aiSuggestions?: string[];
  aiStatus?: string;
  updatedAt: string;
}

export interface CitizenOath {
  studentName: string;
  pledges: string[];
  signedAt: string;
}

export interface ExpoBanner {
  title: string;
  motto: string;
  zoneType: string;
  description: string;
}

// Data model representing a group's current progress & code activities in teacher dashboard
export interface StudentGroupProgress {
  id: string;
  groupName: string;
  members: GroupMember[];
  targetCountry: string;
  storyboard: StoryboardData;
  resolution: UNResolution;
  oath: CitizenOath;
  stampsUnlocked: string[];
  teacherFeedback?: {
    level: EvaluationLevel;
    comment: string;
    evaluatedAt: string;
  };
}

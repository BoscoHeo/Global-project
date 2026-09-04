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
  durationSec?: number;
}

export interface OfflineBoothPlan {
  boothName: string;
  boothLocation: string;
  operatingTime: string;
  missions: {
    greeting: string;
    cultureExp: string;
    quizTaste: string;
    videoWatch: string;
  };
  memberRoles: { name: string; role: string; boothTask: string }[];
  checklist: { item: string; checked: boolean; owner: string }[];
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

/**
 * 모둠원 간 실시간 클라우드 공유 및 협업용 통합 데이터 모델
 */
export interface GroupWorkspaceData {
  classCode: string;
  groupName: string;
  groupMembers: GroupMember[];
  selectedCountryName?: string;
  selectedCountryCode?: string;
  userPassportStamps?: StampData[];
  storyboard: StoryboardScene[];
  boothPlan: OfflineBoothPlan;
  studentResearch: {
    food: string;
    greeting: string;
    costume: string;
    festival: string;
  };
  resolution: {
    sponsorCountry: string;
    resolutionNumber: string;
    title: string;
    preamble: string;
  };
  operativeClauses: string[];
  campaignInput: {
    title: string;
    slogan: string;
    actionItem1: string;
    actionItem2: string;
  };
  citizenOath: {
    studentName: string;
    pledge1: string;
    pledge2: string;
    pledge3: string;
  };
  signedOath: boolean;
  videoUrl: string;
  materials?: BoothMaterialItem[];
  activityIntro?: string;
  updatedAt: string;
  lastAuthor?: string;
}

/**
 * 준비물 신청 오픈마켓 타입
 */
export type OpenMarketType = "아이스크림몰" | "11번가" | "지마켓" | "기타";

/**
 * 부스 준비물 및 예산 신청 품목 데이터 모델 (구글 스프레드시트 양식 연동)
 */
export interface BoothMaterialItem {
  id: string; // 품목 고유 식별자
  market: OpenMarketType; // 오픈마켓 드롭다운 선택
  name: string; // 내용 (물품명)
  unit: string; // 단위 (규격: 1kg, 낱개, 100pcs 등)
  quantity: number; // 수량
  unitPrice: number; // 예상 단가 (원)
  totalPrice: number; // 예상 금액 (수량 * 단가 자동 계산)
  url: string; // 구매 링크 URL
  note: string; // 비고 (택배비 포함 여부, 옵션 등)
  createdAt: string; // 등록 일시
}

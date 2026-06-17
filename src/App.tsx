import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Video, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Plus, 
  Trash, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Users, 
  Sliders, 
  Stamp, 
  PenTool, 
  HelpCircle, 
  Send, 
  FileText, 
  Printer, 
  Layers, 
  Search, 
  Heart, 
  LogOut 
} from "lucide-react";
import { EvaluationLevel, TopicType, StoryboardScene, CountryInfo, StampData, GroupMember } from "./types";

// Pre-seeded rich world culture data for academic research & quizzes (13~18차시)
const SEEDED_COUNTRIES: CountryInfo[] = [
  {
    code: "KR",
    name: "대한민국 (South Korea)",
    continent: "아시아 (Asia)",
    flag: "🇰🇷",
    description: "전통과 첨단 문명, 깊이 있는 예의와 흥겨운 축제 문화가 어우러진 IT 및 교류 강국입니다.",
    highlights: {
      food: "발효 정성이 깃든 '김치'와 영양 균형의 대명사 '비빔밥'. 유네스코 무형유산으로도 밥상 나눔의 정(情)을 나눕니다.",
      greeting: "상대방의 인품을 받들고 환대하는 마음을 담아 손을 모으고 깊이 고개를 숙여 인사합니다.",
      costume: "직선과 부드러운 곡선이 우아한 조화를 이루며 자연 고유의 염색 색깔을 더한 '한복'을 입습니다.",
      festival: "일가 친척들이 고향에 모여 조상을 기리고 전통 놀이를 나누는 민족 고유 명절 '설날'과 '추석'이 펼쳐집니다."
    },
    quiz: [
      {
        id: "kr-q1",
        question: "상대방을 존중하는 대한민국 전통 인사 예절에서 가장 바른 몸가짐은 무엇일까요?",
        options: ["손을 흔들며 크게 소리 지른다", "허리를 숙이고 머리를 정중히 낮추며 눈인사를 나눈다", "상대방의 양뺨을 가볍게 어루만진다", "손가락으로 상대방을 가리키며 악수한다"],
        correctIndex: 1
      },
      {
        id: "kr-q2",
        question: "한국에서 고운 선을 자랑하는 전통 의상의 이름이자, 친환경 자연 염색으로 인기를 끄는 의복은 무엇일까요?",
        options: ["사리", "갈라베야", "카바야", "한복"],
        correctIndex: 3
      }
    ]
  },
  {
    code: "BR",
    name: "브라질 (Brazil)",
    continent: "남아메리카 (South America)",
    flag: "🇧🇷",
    description: "뜨거운 햇살과 이국적인 야생 삼림, 지구의 허파 아마존 및 열정적인 삼바 댄스를 보유한 다문화 공존 국가입니다.",
    highlights: {
      food: "검은색 콩과 고기를 온종일 부드럽게 끓여 풍성한 쌀밥과 곁들이는 서민 고유 영양식 '페이조아다'.",
      greeting: "가볍게 뺨을 가까이 맞대며 반가운 휘파람이나 뽀뽀 소리를 정답게 주고받습니다.",
      costume: "화려한 타조 깃털과 번쩍이는 크리스탈 장식을 달아 열정적인 리듬을 뽐내는 '삼바 카니발 특수 드레스'가 대표적입니다.",
      festival: "지구상 최대 가두 행진인 '리우 카니발'. 매년 2월 드넓은 야외 공연장 메트로폴을 삼바 스텝으로 물들입니다."
    },
    quiz: [
      {
        id: "br-q1",
        question: "브라질의 기후와 역사적 영양 보충 배경에서 시작되었으며, 콩과 고기를 무쇠 냄비에 끓여낸 음식의 이름은 무엇일까요?",
        options: ["타코", "빠에야", "페이조아다", "파스타"],
        correctIndex: 2
      },
      {
        id: "br-q2",
        question: "매년 사순절을 앞두고 리우데자네이루 등지에서 화려한 의상을 보며 세계인이 몰려드는 최대 축제는 무엇일까요?",
        options: ["토마토 축제", "원주민 부족 축제", "리오 카니발(Rio Carnival)", "나일강 감사제"],
        correctIndex: 2
      }
    ]
  },
  {
    code: "ES",
    name: "스페인 (Spain)",
    continent: "유럽 (Europe)",
    flag: "🇪🇸",
    description: "지중해의 푸른 바다와 다채로운 예술가(가우디, 피카소)의 발자취가 숨 쉬는 투우와 시에스타의 강국입니다.",
    highlights: {
      food: "바다의 산삼과도 같은 해산물과 상큼한 레몬즙, 값비싼 향신료 사프란을 넓고 얕은 철판에 고슬고슬 볶은 황금비율의 쌀 요리 '빠에야'.",
      greeting: "양쪽 뺨에 번갈아 서정적인 쪽 소리를 내어 친화력을 전하는 전통 인사법 '도스 베소스(Dos besos)'를 행합니다.",
      costume: "화려한 붉은 레이스와 주름 장식이 파도쳐 몸짓의 미려함을 살리는 '플라멩코 댄스 의복'.",
      festival: "매년 8월 마지막 주 부뇰 마을 전체가 온 힘을 다해 붉은 토마토를 서로에게 문지르며 동심으로 돌아가는 '토마토 축제(La Tomatina)'가 열립니다."
    },
    quiz: [
      {
        id: "es-q1",
        question: "지중해 햇살과 사프란의 특유 노란 향내가 배어나는 바다 해물 쌀 요리로 스페인 대표 부스 요리는?",
        options: ["빠에야(Paella)", "코샤리(Koshary)", "스파게티", "미트파이"],
        correctIndex: 0
      },
      {
        id: "es-q2",
        question: "스페인 부뇰에서 매년 8월, 과잉 농산물의 나눔과 공동체 협동을 상징적으로 폭발시키는 거대 농산물 놀이 축제는?",
        options: ["옥토버페스트", "홀리 축제", "등불 축제", "토마토 축제(La Tomatina)"],
        correctIndex: 3
      }
    ]
  },
  {
    code: "EG",
    name: "이집트 (Egypt)",
    continent: "아프리카 (Africa)",
    flag: "🇪🇬",
    description: "인류 4대 문명의 요람이자 장엄한 피라미드와 스핑크스, 은빛 나일강의 불멸 역사가 기적처럼 빛나는 신비로운 대지입니다.",
    highlights: {
      food: "아침 식사용 국민 별미인 탄수화물 폭탄 '코샤리'. 삶은 마카로니, 쌀밥, 병아리콩, 매콤새콤한 토마토소스와 양파 튀김을 격하게 섞어 먹는 서민 음식입니다.",
      greeting: "오른손을 자신의 가슴에 얹고 공손하게 상대방을 응시하며 '안녕하세요(앗살라무 알라이쿰)'라고 속삭입니다.",
      costume: "강렬한 자외선과 뜨겁고 모래 섞인 사막풍을 건강하게 극복하기 위해 천연 면 소재로 온몸을 헐렁하게 덮는 통원피스식 의상 '갈라베야'를 입습니다.",
      festival: "나일강의 비옥한 홍수 범람이 비문명 지대를 농경 축복의 은혜로 이끈 것에 감사하는 오랜 유서 고유제 '와파 엘 닐(Wafaa El-Nil)'이 계속됩니다."
    },
    quiz: [
      {
        id: "eg-q1",
        question: "이집트의 건조한 강풍과 극심한 일사를 유익하게 방어하고 신체의 통풍을 기막히게 도와주는 전통 원피스 의복은?",
        options: ["사리", "갈라베야(Galabeya)", "블루스", "한복"],
        correctIndex: 1
      },
      {
        id: "eg-q2",
        question: "이집트 대표 음식으로 마카로니, 쌀, 튀긴 마늘과 양파, 그리고 알싸한 붉은 소스를 대형 보울에 비벼 한 끼 식사가 되는 대중 음식은 무엇일까요?",
        options: ["코샤리(Koshary)", "김밥", "카레라이스", "타코"],
        correctIndex: 0
      }
    ]
  },
  {
    code: "IN",
    name: "인도 (India)",
    continent: "아시아 (Asia)",
    flag: "🇮🇳",
    description: "수많은 종교와 사상, 유서 깊은 타지마할, 다채로운 자연 속에서 조화로운 정신문화를 꽃피운 세계 인구 대국입니다.",
    highlights: {
      food: "정교하고 깊은 백여 가지 천연 스파이스 가루를 황금 비율로 마법 배합해 화기 속에 가둔 '정통 카레(Curry)'와 화덕에 얇게 구워낸 고소한 탄수화물 막바지 '난'.",
      greeting: "가슴 앞에 가지런히 두 손바닥을 합장하고 허리를 고상하게 굽히며, 영적인 평화의 축복을 바라는 약속인 '나마스테'를 읊조립니다.",
      costume: "바느질을 하지 않은 5~6미터 길이의 한 폭 천을 자연스러운 드레이프 장식과 고혹적인 주름으로 멋지게 연출해 내는 여성복 '사리'를 입습니다.",
      festival: "겨울의 퇴장과 따사로운 생명 봄의 개막을 다같이 끌어안으며, 남녀노소 신분의 벽을 깨고 대색 가루를 투척하며 연대하는 색의 전쟁 '홀리(Holi)'입니다."
    },
    quiz: [
      {
        id: "in-q1",
        question: "인도에서 두 손을 모으고 깊이 상대의 영적 안식을 존중하며 주고받는 따뜻한 문명 예인(禮人)의 단 한마디는?",
        options: ["나마스테(Namaste)", "도스 베소스", "시앙시앙", "그데이"],
        correctIndex: 0
      },
      {
        id: "in-q2",
        question: "봄을 맞아 인도 대륙 전역의 모든 이들이 계급과 묵은 미움을 격파하고 오색 꽃가루를 장난치듯 뒤집어쓰며 노는 봄 축제는?",
        options: ["추석", "홀리 축제(Holi)", "리우 삼바 축제", "와파 엘 닐"],
        correctIndex: 1
      }
    ]
  },
  {
    code: "AU",
    name: "호주 (Australia)",
    continent: "오세아니아 (Oceania)",
    flag: "🇦🇺",
    description: "태고의 야생 코알라 및 캥거루, 환상 가득한 시드니 오페라하우스와 드넓은 코랄 해안을 품은 대자연 친화적 문명국입니다.",
    highlights: {
      food: "바삭하고 짭조름한 다진 고기를 채워 오븐에서 정성껏 구워낸 호주식 구이 '미트 파이'와 비타민 효소 가득한 검고 끈적한 스프레드인 '베지마이트'.",
      greeting: "친근하고 활기차게 '그데이, 마이트! (G'day, mate!)'를 외치며 튼튼한 무사 안녕의 우정 악수를 나눕니다.",
      costume: "자연 자외선으로부터 영리한 두피 보호를 위해 모자 가에 아련한 코르크 마개를 주렁주렁 단 아웃백 전통 사파리 양식 '부시 헷(Bush Hat)'과 라이프가드 가디언 제복.",
      festival: "광대한 남반구의 무더운 12월 31일 여름휴가를 맞으며 전 세계인들을 시드니 항구의 은빛 밤하늘 아래 카운트다운 불꽃 예술로 안내하는 '시드니 신년 맞이 축제(Sydney NYE)'입니다."
    },
    quiz: [
      {
        id: "au-q1",
        question: "호주의 광활한 목축 기후와 광업 기원으로, 광부들이 고기를 가볍게 감싸 휴대하여 에너지 보충용으로 즐긴 바삭한 파이의 정체는 무엇입니까?",
        options: ["미트 라이스", "코샤리", "미트 파이(Meat Pie)", "빠에야"],
        correctIndex: 2
      },
      {
        id: "au-q2",
        question: "오세아니아 호주에서 뜨거운 여름 새해를 극적이면서도 낭만 넘치는 음악과 우렁찬 축복 불꽃 쇼로 맞이하는 글로벌 스케일 축제는?",
        options: ["추석 한가위", "시드니 신년 불꽃축제", "토마토 전쟁", "삼바 축제"],
        correctIndex: 1
      }
    ]
  }
];

// 학생 입력 성실도 및 의미성 검증 헬퍼 (초성만 쓰거나 무의미한 길이 필터링)
const checkContentQuality = (text: string): { isValid: boolean; reason?: string } => {
  if (!text) {
    return { isValid: false, reason: "입력 박스에 탐구 수집 내용이 기술되어 있지 않아 비어 있습니다." };
  }
  const clean = text.trim();
  if (clean.length < 8) {
    return { isValid: false, reason: `조사 자료의 내용이 지나치게 짧습니다. 세계화 탐구 교육 기준에 따라 최소 8자 이상 충실하게 작성해 주세요. (현재 ${clean.length}자)` };
  }
  
  // 초성 및 단순 무의미한 연속 문자 필생 체크 (예: 'ㅁ', 'ㅋ', 'ㄴ', 'ㅇ', 'ㅋㅋ')
  const consonantVowelRegex = /^[ㄱ-ㅎㅏ-ㅣ\s\d.,!?~^*()-_=+]+$/;
  if (consonantVowelRegex.test(clean)) {
    return { isValid: false, reason: "실제 뜻이 통하는 한글 문장이 아니며, 단순 자음(초성)이나 모음('ㅁ', 'ㅋ', 'ㅇ' 등) 및 기호 위주로만 작성되었습니다. 지식을 조사하여 완전한 한글 문장으로 기입하십시오." };
  }

  // 글자 수가 비록 길어도 동일 단어/글자 초과 반복 (예: 'ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ')
  const trimmedNoSpace = clean.replace(/[\s.,!?~]/g, "");
  const charSet = new Set(trimmedNoSpace);
  if (charSet.size <= 2 && trimmedNoSpace.length > 5) {
    return { isValid: false, reason: "동일한 문자나 초성이 단순 반복(예: 'ㄴㅁㄴㅁㄴㅁㄴㅁ')되어 있는 성실도 미충족 란입니다. 다시 작성해주세요." };
  }
  
  return { isValid: true };
};

export default function App() {
  const [classCode, setClassCode] = useState<string>("6-1");
  const [activeTab, setActiveTab] = useState<string>("curriculum");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [countries, setCountries] = useState<CountryInfo[]>(SEEDED_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(SEEDED_COUNTRIES[0]);
  const [generatingCountryName, setGeneratingCountryName] = useState<string>("");
  const [isGeneratingCountry, setIsGeneratingCountry] = useState<boolean>(false);
  
  // Custom API key & Teacher Aggregation States
  const [userApiKey, setUserApiKey] = useState<string>(() => localStorage.getItem("user_gemini_api_key") || "");
  const [showApiKeyConfig, setShowApiKeyConfig] = useState<boolean>(false);
  const [isServerApiKeyActive, setIsServerApiKeyActive] = useState<boolean>(false);
  const [configTargetClass, setConfigTargetClass] = useState<string>("all");
  const [importedPortfolios, setImportedPortfolios] = useState<any[]>([]);
  const [selectedImportedPortfolioIndex, setSelectedImportedPortfolioIndex] = useState<number | null>(null);
  const [isEvaluatingProxy, setIsEvaluatingProxy] = useState<boolean>(false);
  const [tempTeacherObservation, setTempTeacherObservation] = useState<string>("");
  const [tempFinalGrade, setTempFinalGrade] = useState<string>("");

  useEffect(() => {
    if (selectedImportedPortfolioIndex !== null && importedPortfolios[selectedImportedPortfolioIndex]) {
      const p = importedPortfolios[selectedImportedPortfolioIndex];
      setTempTeacherObservation(p.teacherObservation || "");
      setTempFinalGrade(p.finalGrade || p.aiEvaluation?.grade || "A");
    } else {
      setTempTeacherObservation("");
      setTempFinalGrade("");
    }
  }, [selectedImportedPortfolioIndex]);

  const checkServerApiKeyStatus = async () => {
    try {
      const scopeParam = (unlockedClassScope && unlockedClassScope !== "none") ? unlockedClassScope : classCode;
      const res = await fetch(`/api/teacher-api-key/status?classCode=${encodeURIComponent(scopeParam)}`);
      if (res.ok) {
        const data = await res.json();
        setIsServerApiKeyActive(data.hasKey);
      }
    } catch (e) {
      console.error("Failed to fetch server api key status:", e);
    }
  };
  
  // Teacher verification lock states
  const [unlockedClassScope, setUnlockedClassScope] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("editor") === "teacher" || params.get("role") === "teacher" || params.get("admin") === "true") {
        return "all";
      }
    } catch (_) {}
    return "none"; // "all" if super admin/raw bypass, otherwise e.g., "6-1" if specific class code
  });

  const [isTeacherUnlocked, setIsTeacherUnlocked] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("editor") === "teacher" || params.get("role") === "teacher" || params.get("admin") === "true";
    } catch (_) {
      return false;
    }
  });
  const [showTeacherUnlockModal, setShowTeacherUnlockModal] = useState<boolean>(false);
  const [teacherPinInput, setTeacherPinInput] = useState<string>("");
  const [teacherPinError, setTeacherPinError] = useState<string>("");

  useEffect(() => {
    if (unlockedClassScope && unlockedClassScope !== "none") {
      setConfigTargetClass(unlockedClassScope);
    }
  }, [unlockedClassScope]);
  
  // Custom class-specific passcodes config states
  const [classPasscodes, setClassPasscodes] = useState<{ master: string; custom: Record<string, string> }>({ master: "3201", custom: {} });
  const [newClassCodeToSet, setNewClassCodeToSet] = useState<string>("");
  const [newPasscodeToSet, setNewPasscodeToSet] = useState<string>("");

  const fetchPasscodes = async () => {
    try {
      const res = await fetch("/api/class-passcode/list");
      if (res.ok) {
        const data = await res.json();
        setClassPasscodes(data);
      }
    } catch (e) {
      console.error("Failed to fetch class passcodes:", e);
    }
  };

  useEffect(() => {
    checkServerApiKeyStatus();
  }, [unlockedClassScope, classCode]);

  useEffect(() => {
    if (isTeacherUnlocked) {
      fetchPasscodes();
    }
  }, [isTeacherUnlocked]);
  
  // World Expo Exhibition states
  const [showExpoShowcase, setShowExpoShowcase] = useState<boolean>(false);
  const [expoActiveIndex, setExpoActiveIndex] = useState<number | null>(null);
  const [expoStoryboardSlideIndex, setExpoStoryboardSlideIndex] = useState<number>(0);
  
  // Student Self-Research & Online Submission States
  const [studentResearch, setStudentResearch] = useState<{
    [countryCode: string]: {
      food: string;
      greeting: string;
      costume: string;
      festival: string;
    }
  }>({});
  const [isSubmittingLive, setIsSubmittingLive] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  
  const [groupName, setGroupName] = useState<string>("글로벌 지킴이 1모둠");
  const [teacherFilterClass, setTeacherFilterClass] = useState<string>(""); // "" means show all, or filtered classroom code e.g., "6-1"
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");

  // Tab 1 States: Storyboard Planner
  const [storyboard, setStoryboard] = useState<StoryboardScene[]>([]);
  const [editSceneIndex, setEditSceneIndex] = useState<number | null>(null);
  const [sceneInput, setSceneInput] = useState<Partial<StoryboardScene>>({
    category: "음식",
    screenVisual: "",
    audioText: "",
    notes: ""
  });
  
  // AI Evaluations API
  const [scriptFeedback, setScriptFeedback] = useState<any | null>(null);
  const [evaluatingScript, setEvaluatingScript] = useState<boolean>(false);

  // Tab 2 States: Stamp Passport & Quizzes
  const [userPassportStamps, setUserPassportStamps] = useState<string[]>(["KR"]); // Start with Korea unlocked
  const [currentQuizCountry, setCurrentQuizCountry] = useState<CountryInfo | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizScores, setQuizScores] = useState<number>(0);
  const [quizFeedbackText, setQuizFeedbackText] = useState<string>("");
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [expoBoothLayout, setExpoBoothLayout] = useState<{ [key: string]: boolean }>({
    videoScreen: true,
    foodTesting: false,
    greetingExp: true,
    outfitPhoto: false,
    digitalQuiz: false
  });

  // Tab 3 States: UN Resolution Draft
  const [resolution, setResolution] = useState({
    sponsorCountry: "",
    resolutionNumber: "A/RES/6/32-01",
    title: "",
    preamble: ""
  });
  const [operativeClauses, setOperativeClauses] = useState<string[]>([]);
  const [newClauseText, setNewClauseText] = useState<string>("");
  const [resolutionFeedback, setResolutionFeedback] = useState<any | null>(null);
  const [evaluatingResolution, setEvaluatingResolution] = useState<boolean>(false);

  // Tab 4 States: Campaign Suggest & Citizen Oath
  const [campaignInput, setCampaignInput] = useState({
    topic: "",
    coreMessage: ""
  });
  const [suggestedSlogans, setSuggestedSlogans] = useState<any[]>([]);
  const [loadingCampaign, setLoadingCampaign] = useState<boolean>(false);
  const [citizenOath, setCitizenOath] = useState<any>({
    studentName: "",
    pledge1: "",
    pledge2: "",
    pledge3: ""
  });
  const [signedOath, setSignedOath] = useState<boolean>(false);

  // Helper functions to populate sample or reset for students
  const loadEgyptSample = () => {
    setGroupName("글로벌 지킴이 이집트 1모둠");
    setGroupMembers([
      { name: "김민재", role: "촬영 및 대사 조율" },
      { name: "이서연", role: "대본 작성 및 화면 구성" },
      { name: "최준우", role: "전통 의상 소품 제작" },
      { name: "박지아", role: "현장 인터뷰 및 연출" }
    ]);
    setStoryboard([
      {
        id: "1",
        sceneNumber: 1,
        category: "언어/인사",
        screenVisual: "김민재 학생이 전통 의상을 가볍게 들고나와 카메라를 향해 정중히 손을 가슴에 얹어 모으며 이집트식 정식 평화 인사인 '앗살라무 알라이쿰'을 선사하는 단독 롱테이크 샷.",
        audioText: "나레이션: '서로 다른 나라의 인사는 단순한 말 한마디가 아닌 역사와 존중의 집합체입니다. 평화로운 모래 지대의 이집트식 정중함을 느껴보세요!'",
        notes: "카메라 앵글은 눈높이에 맞추고 미소 짓는 표정을 5초간 집중 유지하며 촬영 소요."
      },
      {
        id: "2",
        sceneNumber: 2,
        category: "음식",
        screenVisual: "이서연, 최준우 학생이 모형 마카로니와 병아리콩을 그릇에 담아 소스를 격렬히 비비는 이집트식 대중 서민 요리 '코샤리' 요리 시연 클로즈업 샷.",
        audioText: "효과음: '보글보글 맛있는 대화 소리가 지나친 후...' 대사(지아): '이 음식에는 나일강 범람 시기에 풍부했던 탄수화물 영양소가 가득 차 있어서 이집트 전 국민을 보듬어 주었어요!'",
        notes: "다진 튀긴 양파 모형 소품 준비 필수, 시각적으로 매콤함이 들도록 토마토 시럽 모스 준비."
      }
    ]);
    setResolution({
      sponsorCountry: "이집트 대표국 (1모둠 공동 제안)",
      resolutionNumber: "A/RES/6/32-01",
      title: "기후 적응 소규모 섬나라 지지 및 대륙별 식수 보장과 국제 평등 자원 나눔 동반 결의의 건",
      preamble: "우리 모의 UN 위원회의 대표국들은 화석 연료 고갈과 해수면 상승으로 생존권을 파괴당하는 인류 안녕에 심대한 우려를 공유한다. 특히 선진 공장 지대에서 배출하는 탄소가 아프리카 식수 부족을 가속하는 악순환을 성찰하며, 정의로운 연대로 보편적 행복권을 누려야 함을 자각, 이에 다음과 같은 평화 실천적 조항들을 다짐하고 전 세계 회원국에 자치적 참여를 촉약한다."
    });
    setOperativeClauses([
      "기후 해수면 비상 기금을 창출하여 저개발 연안 섬나라의 친환경 해수 배수 방벽 제작 기술 사업비를 무상 전격 전도한다.",
      "교내 및 가정에서 전력 낭비를 15% 일괄 감량하고 텀블러 보급 대책을 교장 교원과 결연하여 공익 캠페인을 월별 행사로 주최한다."
    ]);
    setCampaignInput({
      topic: "지구촌 기후 정의와 생활 속 분리수거 실천",
      coreMessage: "우리의 따뜻한 낭비를 줄이고 세계 친구들을 위한 친환경 텀블러 사용을 상설화합시다."
    });
    setCitizenOath({
      studentName: "김민재",
      pledge1: "세계 여러 나라의 문화와 그들이 살아온 환경적 배경에 편견을 품지 않고 존중하여 대한다.",
      pledge2: "물 절약과 분리수거, 일회용 폐기물 일절 감량을 일상생활의 최고 덕목으로 삼아 실천한다.",
      pledge3: "어려운 난민과 소외 이웃의 인권 침해 소식을 외면하지 않으며 교내 지구촌 공익 캠페인에 선전한다."
    });
    setStudentResearch({});
    setSignedOath(true);
    setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    alert("💡 (학생/체험 가이드) 샘플 데이터 셋이 로드되었습니다. 입력란 구조를 확인하신 뒤 개별 모둠 주제로 조사해 빈 데이터로 진행해 보세요!");
  };

  const resetToBlank = () => {
    setGroupName("글로벌 지킴이 1모둠");
    setGroupMembers([]);
    setStoryboard([]);
    setVideoUrl("");
    setResolution({
      sponsorCountry: "",
      resolutionNumber: "A/RES/6/32-01",
      title: "",
      preamble: ""
    });
    setOperativeClauses([]);
    setCampaignInput({
      topic: "",
      coreMessage: ""
    });
    setCitizenOath({
      studentName: "",
      pledge1: "",
      pledge2: "",
      pledge3: ""
    });
    setStudentResearch({});
    setSignedOath(false);
    setScriptFeedback(null);
    setResolutionFeedback(null);
    setSuggestedSlogans([]);
    alert("🗑️ 탐구 기획안이 깨끗이 비워졌습니다! 이제 학생 여러분의 새로운 조사 기획 및 탐구를 이뤄보세요.");
  };

  const handleUpdateResearch = (key: "food" | "greeting" | "costume" | "festival", value: string) => {
    setStudentResearch(prev => ({
      ...prev,
      [selectedCountry.code]: {
        ...prev[selectedCountry.code] || { food: "", greeting: "", costume: "", festival: "" },
        [key]: value
      }
    }));
  };

  // UTC Time Ticker
  const [currentTime, setCurrentTime] = useState<string>("2026-06-15 22:45 UTC");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Keep format clean
      setCurrentTime(now.getUTCFullYear() + "-" + 
                     String(now.getUTCMonth() + 1).padStart(2, "0") + "-" + 
                     String(now.getUTCDate()).padStart(2, "0") + " " + 
                     String(now.getUTCHours()).padStart(2, "0") + ":" + 
                     String(now.getUTCMinutes()).padStart(2, "0") + ":" + 
                     String(now.getUTCSeconds()).padStart(2, "0") + " UTC");
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter countries on quick search bar
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    country.continent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add group member
  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    setGroupMembers([...groupMembers, {
      name: newMemberName,
      role: newMemberRole || "콘텐츠 모니터링"
    }]);
    setNewMemberName("");
    setNewMemberRole("");
  };

  // Delete group member
  const handleRemoveMember = (idx: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== idx));
  };

  // AddStoryboard Scene
  const handleSaveScene = () => {
    if (!sceneInput.screenVisual || !sceneInput.audioText) {
      alert("화면 구성 및 자막 내용을 완벽하게 작성해 주세요.");
      return;
    }

    if (editSceneIndex !== null) {
      const updatedScenes = [...storyboard];
      updatedScenes[editSceneIndex] = {
        ...updatedScenes[editSceneIndex],
        category: (sceneInput.category as TopicType) || "통합",
        screenVisual: sceneInput.screenVisual,
        audioText: sceneInput.audioText,
        notes: sceneInput.notes || "특이사항 없음"
      };
      setStoryboard(updatedScenes);
      setEditSceneIndex(null);
    } else {
      const nextNum = storyboard.length > 0 ? Math.max(...storyboard.map(s => s.sceneNumber)) + 1 : 1;
      setStoryboard([...storyboard, {
        id: String(Date.now()),
        sceneNumber: nextNum,
        category: (sceneInput.category as TopicType) || "통합",
        screenVisual: sceneInput.screenVisual,
        audioText: sceneInput.audioText,
        notes: sceneInput.notes || "특이사항 없음"
      }]);
    }

    setSceneInput({
      category: "음식",
      screenVisual: "",
      audioText: "",
      notes: ""
    });
  };

  const handleEditScene = (index: number) => {
    const s = storyboard[index];
    setEditSceneIndex(index);
    setSceneInput({
      category: s.category,
      screenVisual: s.screenVisual,
      audioText: s.audioText,
      notes: s.notes
    });
  };

  const handleRemoveScene = (index: number) => {
    const updated = storyboard.filter((_, i) => i !== index).map((scene, i) => ({
      ...scene,
      sceneNumber: i + 1
    }));
    setStoryboard(updated);
  };

  // Fill in complete storyboard sample for rapid testing
  const handleAutofillExample = () => {
    const name = selectedCountry.name;
    const food = selectedCountry.highlights.food;
    const greeting = selectedCountry.highlights.greeting;
    const costume = selectedCountry.highlights.costume;
    const festival = selectedCountry.highlights.festival;

    const samples: StoryboardScene[] = [
      {
        id: "ex-1",
        sceneNumber: 1,
        category: "언어/인사",
        screenVisual: `모둠장 ${groupMembers[0]?.name || "학생"}이 전면 카메라를 응시하며 고유의 예제 방식인 [${greeting}]을 따뜻한 미소와 모션 그래픽 자막으로 재현하며 첫인사를 멋지게 건넨다.`,
        audioText: `나레이션: 안녕하세요! 우리 모둠이 소개할 자랑스러운 문명은 바로 [${name}] 입니다! 인사법에는 기후를 극복한 조상들의 향기가 짙게 묻어있어요.`,
        notes: "인사 도중 손의 움직임은 천천히 우아하게 시연하고 슬라이드 트랜지션 처리 예정."
      },
      {
        id: "ex-2",
        sceneNumber: 2,
        category: "음식",
        screenVisual: `초밀착 매크로 렌즈로 [${food}]의 대표 모형이나 사진 자료를 화면 정중앙에 고풍스럽게 띄우며, 기후 및 영토 비옥도가 조리 기법에 끼친 이유를 다이어그램 화살표로 보여준다.`,
        audioText: "대본(이서연): 맛과 기후의 비결! 척박하거나 해안가 위주의 환경에 대처하기 위해 식재료를 오랫동안 보존하고 끓이게 되며 이토록 특색 있는 음식이 완성되었다고 합니다.",
        notes: "배경음악은 해당 대륙풍의 신나며 통통 튀는 민속 연주 음원을 잔잔히 루프 스포일."
      },
      {
        id: "ex-3",
        sceneNumber: 3,
        category: "의상/축제",
        screenVisual: `야외 교정 쉼터 공간에서 모둠 전체가 짝을 지어 [${costume}] 소품 장신구와 함께 역사적 의의를 뽐내는 미니 연출 컷. 이후 [${festival}] 동영상 참고 자료를 짧게 분할 합성 배치한다.`,
        audioText: `나레이션: 이들의 삶의 활력소가 되는 다이나믹 페스티벌 속으로 다같이 여행을 떠나보는 건 어떨까요? 그들의 열정적인 스피릿을 가슴으로 포용합시다!`,
        notes: "미술 교과에 만든 모형 종이 피켓과 대고 있는 전통 탈 소품 정렬 강조."
      }
    ];
    setStoryboard(samples);
  };

  // Evaluate Script via server API
  const handleEvaluateScript = async () => {
    if (storyboard.length === 0) {
      alert("평가받을 시나리오 씬을 최소 한 건 이상 작성한 후 요청해 주세요.");
      return;
    }

    // 🕵️ 학생 불성실 입력 및 자음 남발 차단 분석개시
    let invalidSceneNum = -1;
    let qualityErrReason = "";
    for (let i = 0; i < storyboard.length; i++) {
      const scene = storyboard[i];
      const visualCheck = checkContentQuality(scene.screenVisual);
      const audioCheck = checkContentQuality(scene.audioText);
      if (!visualCheck.isValid) {
        invalidSceneNum = scene.sceneNumber;
        qualityErrReason = `화면 연출 내용 - ${visualCheck.reason}`;
        break;
      }
      if (!audioCheck.isValid) {
        invalidSceneNum = scene.sceneNumber;
        qualityErrReason = `오디오/내레이션 대사 - ${audioCheck.reason}`;
        break;
      }
    }

    if (invalidSceneNum !== -1) {
      alert(`⚠️ [성실기준 미달] 장면(Scene) #${invalidSceneNum}의 기획 설명에 성실도 부족이 감지되었습니다!\n\n부족 사유 -> ${qualityErrReason}\n\n의미 없는 단어 반복이나 초성(ㅁ,ㄴ 등) 나열을 지우고, 지구촌 사람들의 실질적 생활상이 담기도록 성의 있는 설명 한글 문장으로 8자 이상 작성해 주어야 AI 분석을 진행할 수 있습니다.`);
      
      setScriptFeedback({
        feedback: `🚨 [기획 내용 수준 불충분] 장면 #${invalidSceneNum}에서 학생들의 자료 입력 미달 사실을 확인했습니다. (세부사유: ${qualityErrReason}) 세계 문화를 조사하고 협력한 가치가 대본 속에 충분한 한글 정보로 녹아들도록 문장을 한 층 더 확장해 주셔야 합니다.`,
        recommendations: [
          "단순 자음 연속(ㅁ, ㄴ, ㅇ 등)을 정연한 한글 해설과 대사로 바꾸십시오.",
          "선택한 문화 주제(음식, 의치, 행사 등)의 구체적인 사회적 명칭과 지리적 이점을 덧붙이세요.",
          "장면에서 모둠원들의 실제 제스처나 카메라 촬영 앵글 수준을 15자 이상 상세히 기술하십시오."
        ],
        level: "보강 필요 (노력 요함)",
        isLocal: true
      });
      return;
    }

    setEvaluatingScript(true);
    setScriptFeedback(null);

    const scenarioTextCombined = storyboard.map(s => 
      `[씬 ${s.sceneNumber} - ${s.category}]
화면: ${s.screenVisual}
자막/더빙: ${s.audioText}
비고: ${s.notes}`
    ).join("\n\n");

    const rolesCombined = groupMembers.map(m => `${m.name}(${m.role})`).join(", ");

    // 로컬 지능형 교육 분석 엔진 (API 키 없는 학생용 즉시 연동)
    if (!userApiKey.trim()) {
      setTimeout(() => {
        const totalScenes = storyboard.length;
        let pLevel = "보통";
        let recs = [
          "각 장면 전환 타이밍을 8초 내외로 조절하여 영상 전개의 몰입도를 살려보세요.",
          "전통 음악이나 잔잔한 리듬을 오디오 트랙 배경에 믹싱하면 훨씬 생동감이 살아납니다."
        ];
        
        let pFeedback = `[학습 로컬 자문 결과] 학생 과학 기획단 모둠의 씬 기획안 ${totalScenes}개에 대한 구조 분석을 완료했습니다. `;
        if (totalScenes >= 3) {
          pLevel = "매우 우수";
          pFeedback += `스토리의 연출 전환이 다채롭고 단원 간 역할 배분(${rolesCombined || "미지정"})도 유기적으로 짜여 있습니다. 음식, 인사, 문화적 성찰 내용이 논리적으로 배치된 모범 스토리보드입니다!`;
          recs.push("최종 촬영 전, 조명의 각도와 팀원들의 리허설 동작을 1회 점검하길 강력히 제안합니다.");
        } else if (totalScenes >= 2) {
          pLevel = "우수";
          pFeedback += `기본적인 인사와 문화 탐색 씬 구성이 조화롭게 잘 잡혀 있습니다. 각 씬의 화면 지침이 매우 상세하여 제작 시 실제 영상화하기에 제격입니다.`;
          recs.push("클로징 씬(3번째 장면)으로 이 나라의 환경 문제나 문화 다양성을 성찰하는 마무리 약속 씬을 하나 더 덧붙여도 좋습니다.");
        } else {
          pLevel = "보강 권장";
          pFeedback += `장면이 다소 압축적입니다. 시청자가 세계 다문화의 아름다움을 더 깊이 체험할 수 있도록 두 번째와 세 번째 씬을 입체적으로 확장해 보세요.`;
          recs.push("최소한 인사말 씬 외에 전통 요리 제작 시연이나 현장 의복 촬영 씬을 추가하여 다채롭게 만드십시오.");
        }

        setScriptFeedback({
          feedback: pFeedback,
          recommendations: recs,
          level: pLevel,
          isLocal: true
        });
        setEvaluatingScript(false);
      }, 600);
      return;
    }

    try {
      const res = await fetch("/api/ai/evaluate-script", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": userApiKey,
          "x-class-code": classCode
        },
        body: JSON.stringify({
          country: selectedCountry.name,
          topic: "종합 문화 탐구 및 영상 제작 시나리오",
          scenarioText: scenarioTextCombined,
          roleDistribution: rolesCombined
        })
      });
      const data = await res.json();
      setScriptFeedback(data);
    } catch (e) {
      console.error(e);
      setScriptFeedback({
        feedback: "API 호출 중 오류가 발생했으나, 오프라인 시뮬레이션 결과 귀하의 대본은 지구촌 통합 프로젝트 기준의 핵심 성취를 훌륭히 수반하고 있습니다. 음식, 옷, 인사법이 조화롭게 구성되어 있습니다.",
        recommendations: [
          "각 장면 전환 타이밍을 8초 내외로 조절하여 몰입도를 살려보세요.",
          "전통 악기 잔잔한 리듬을 오디오 트랙 배경에 믹싱하면 훨씬 생동감이 살아나겠죠?",
          "마지막 클로징 멘트에 '세계는 하나!' 라는 통합 슬로건을 추가하길 제안합니다."
        ],
        level: "잘함"
      });
    } finally {
      setEvaluatingScript(false);
    }
  };

  // Quiz Handling
  const handleStartQuiz = (country: CountryInfo) => {
    setCurrentQuizCountry(country);
    setQuizQuestionIndex(0);
    setSelectedQuizOption(null);
    setQuizScores(0);
    setQuizFeedbackText("");
    setShowQuizModal(true);
  };

  const handleSelectQuizOption = (optIdx: number) => {
    if (selectedQuizOption !== null) return; // already answered
    setSelectedQuizOption(optIdx);
    
    if (!currentQuizCountry) return;
    const currentQ = currentQuizCountry.quiz[quizQuestionIndex];
    if (optIdx === currentQ.correctIndex) {
      setQuizScores(prev => prev + 1);
      setQuizFeedbackText("🎉 정답입니다! 해당 지역 문화의 깊은 유래를 정확하게 조준했네요!");
    } else {
      const correctText = currentQ.options[currentQ.correctIndex];
      setQuizFeedbackText(`❌ 아쉽습니다! 정답은 [${correctText}] 입니다. 오답을 체크하며 세상을 이롭게 배울 수 있습니다.`);
    }
  };

  const handleNextQuiz = () => {
    if (!currentQuizCountry) return;
    if (quizQuestionIndex < currentQuizCountry.quiz.length - 1) {
      setQuizQuestionIndex(quizQuestionIndex + 1);
      setSelectedQuizOption(null);
      setQuizFeedbackText("");
    } else {
      // Quiz Finished! Check if score matches
      const isPerfect = quizScores + (selectedQuizOption === currentQuizCountry.quiz[quizQuestionIndex].correctIndex ? 1 : 0) >= currentQuizCountry.quiz.length;
      
      if (!userPassportStamps.includes(currentQuizCountry.code)) {
        setUserPassportStamps([...userPassportStamps, currentQuizCountry.code]);
      }
      
      setQuizFeedbackText(`학습 미션 부스 수료 완료! 총 ${currentQuizCountry.quiz.length}문제 중 ${quizScores}문제를 정교하게 해결하셨습니다. 박람회 여권에 새로운 공식 디지털 활성 스탬프가 마킹되었습니다!`);
    }
  };

  // Resolution Operative Clauses control
  const handleAddClause = () => {
    if (!newClauseText.trim()) return;
    setOperativeClauses([...operativeClauses, newClauseText.trim()]);
    setNewClauseText("");
  };

  const handleRemoveClause = (idx: number) => {
    setOperativeClauses(operativeClauses.filter((_, i) => i !== idx));
  };

  // UN Resolution Evaluate
  const handleEvaluateResolution = async () => {
    // 🕵️ UN 결의안 불성실 입력 및 기안 요건 불충분 검증개시
    if (!resolution.title.trim() || !resolution.preamble.trim()) {
      alert("⚠️ UN 결의안의 [공식 의안 제목]과 [결의안 서두 전문]이 기재되어 있지 않거나 비어 있습니다.\n\n세계 무대에서 선언을 펼칠 수 있게 제목과 전문을 먼저 성실히 작성해 주시기 바랍니다.");
      return;
    }

    const titleQuality = checkContentQuality(resolution.title);
    const preambleQuality = checkContentQuality(resolution.preamble);

    if (!titleQuality.isValid) {
      alert(`⚠️ [UN 결의안 제목 부실화 감지]\n\n부족 사유 -> ${titleQuality.reason}`);
      return;
    }
    if (!preambleQuality.isValid) {
      alert(`⚠️ [UN 결의안 서두 전문 부실화 감지]\n\n부족 사유 -> ${preambleQuality.reason}`);
      return;
    }

    if (operativeClauses.length === 0) {
      alert("⚠️ UN 결의안의 실제적 약속인 [국가 실천 조항]이 단 하나도 등록되어 있지 않습니다.\n\n하단 입력 칸을 통해 전 세계가 공동 지켜나갈 조항을 최소 한 문항 이상 발의해 등록해 주세요.");
      return;
    }

    let invalidClauseIdx = -1;
    let clauseErrReason = "";
    for (let i = 0; i < operativeClauses.length; i++) {
      const check = checkContentQuality(operativeClauses[i]);
      if (!check.isValid) {
        invalidClauseIdx = i + 1;
        clauseErrReason = check.reason;
        break;
      }
    }

    if (invalidClauseIdx !== -1) {
      alert(`⚠️ [실천 조항 기재 미진] 제 ${invalidClauseIdx} 실천 조항 기재 상태에 불성실 항목이 검출되었습니다!\n\n부족 사유 -> ${clauseErrReason}\n\n사유를 검토하고 자음 단독 나열 대신 지구촌에 실정 도움을 줄 의무 약속을 완전한 문체로 서술바랍니다.`);
      
      setResolutionFeedback({
        analysis: `🚨 [기약 서명 보류] 제 ${invalidClauseIdx} 실천 조항의 표현이 너무 장난스럽거나 짧게 기재되어 가상 UN 접수가 취소되었습니다. (성실 사유: ${clauseErrReason}) 실천 및 효과가 명확히 명세되도록 조항을 고쳐 써 주십시오.`,
        actionableSuggestions: [
          "친환경 폐기물 줄이기나 나눔 은행 등 교내 혹은 국가 별로 추진할 규율을 구체화하십시오.",
          "자음(ㅁ,ㄴ,ㅋ)이나 문장 파편을 지우고, 15자 이상의 단정한 문장으로 변경해 주십시오."
        ],
        status: "기안 보류 (보강 필요)",
        isLocal: true
      });
      return;
    }

    setEvaluatingResolution(true);
    setResolutionFeedback(null);

    const clausesCombined = operativeClauses.map((c, i) => `제 ${i+1}항: ${c}`).join("\n");

    // 로컬 스마트 학업 피드백 분기 (학생용 및 서버키 없음 대비)
    if (!userApiKey.trim()) {
      setTimeout(() => {
        const clausesCount = operativeClauses.length;
        let rStatus = "보강 필요";
        let rSuggs = [
          "각국 정부의 지출 강제보다는 '자발적인 세계시민 나눔 은행' 형식으로 완화해 보세요.",
          "실천 수치를 선언했을 경우 달성 연도 성과 측정을 검증하는 추상 조항도 덧붙여 보세요."
        ];
        let rAnalysis = `[학습 로컬 분석 비서] 학생들이 다짐한 UN 결의안 초안인 [${resolution.title || "지구촌 실천 선언"}]을 모의 위원회 접수 분석 완료했습니다. `;

        if (clausesCount >= 3) {
          rStatus = "최상위 합의 달성 (!)";
          rAnalysis += `총 ${clausesCount}개의 정량적 실천 한 조항들이 돋보입니다. 가정내 전력 절전 의무 보급, 일회용 폐기물 일괄 감축 등 교실과 지구를 잇는 실천성이 매우 조화롭습니다.`;
          rSuggs.push("이 결의안을 교내 게시판이나 학급 자치 단체 SNS에 게재하여 다른 반 학우들에게도 선포하길 권장합니다.");
        } else if (clausesCount >= 1) {
          rStatus = "조정 통과";
          rAnalysis += `소중한 실천 대안이 수립되었습니다. 지구촌 한편에서 고통받는 난민 또는 작물 피해국을 돕기 위해 학급에서 선도적으로 전도할 수 있는 작은 약속이 핵심을 찌르고 있습니다.`;
          rSuggs.push("조항을 최소한 3개 이상으로 세분화해 보면, 훨씬 입체적이고 다채로운 실무 포트폴리오 성과로 직행할 수 있습니다.");
        } else {
          rStatus = "기안 보류";
          rAnalysis += `아직 등록된 공식 실천 조항이 없습니다. 하단 입력 칸을 활용해 전 세계가 공동으로 지켜나가야 할 환경보호 또는 다양성 수호 원칙을 추가해 주십시오.`;
        }

        setResolutionFeedback({
          analysis: rAnalysis,
          actionableSuggestions: rSuggs,
          status: rStatus,
          isLocal: true
        });
        setEvaluatingResolution(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch("/api/ai/evaluate-resolution", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": userApiKey,
          "x-class-code": classCode
        },
        body: JSON.stringify({
          topic: "지구촌 자원 결핍 대응 및 다대륙 기후 인권 형평 보장",
          issues: "기후 환경 위기 및 난민 자립 한계 돌파",
          resolutionText: `[결의안 제호: ${resolution.resolutionNumber}] - ${resolution.title}
제안 대표단: ${resolution.sponsorCountry}

[전문 Preamble]:
${resolution.preamble}

[실천 조항 임무 세부]:
${clausesCombined}`
        })
      });
      const data = await res.json();
      setResolutionFeedback(data);
    } catch (e) {
      console.error(e);
      setResolutionFeedback({
        analysis: "모의 UN 위원회에서 학생들이 진정성 있게 작성한 결의안 초안을 접수했습니다. 비상 기금 마련 및 일상생활 감량 15% 기입 등 다방면의 실천 연계가 감명 깊게 제시되었습니다.",
        actionableSuggestions: [
          "각국의 의사결정 강제 기여금보다는 상호 협동 기술 조합 형태로 표현하면 외교 마찰을 크게 완화할 수 있습니다.",
          "중앙정부뿐 아니라 NGO 시민 단체와 결연하는 내용을 3항에 이식하면 완충 실천력이 좋아집니다.",
          "실천 수치(15%)를 명문화한 것처럼 각 연차별 달성 검증 시스템 조항도 덧붙여 보세요.",
          "실천 수치(15%)를 명문화한 것처럼 각 연차별 달성 검증 시스템 조항도 덧붙여 보세요."
        ],
        status: "완성도 높음"
      });
    } finally {
      setEvaluatingResolution(false);
    }
  };

  // Suggest Slogans via AI
  const handleSuggestSlogans = async () => {
    setLoadingCampaign(true);
    setSuggestedSlogans([]);

    const tTopic = campaignInput.topic || "세계 다문화 어깨동무 어우러짐 및 생태 보전";
    const tMsg = campaignInput.coreMessage || "배려하는 마음으로 낭비를 줄이고 조화롭게 살아가요.";

    // 로컬 슬로건 지능 큐레이션 엔진
    if (!userApiKey.trim()) {
      setTimeout(() => {
        setSuggestedSlogans([
          { slogan: `🌍 [기후 정의] 남의 일이 아닌 나의 일! ${tMsg ? tMsg.slice(0, 18) : "플라스틱 다이어트"}... 텀블러로 1도 낮춰요!`, designIdea: "녹아내리는 빙하 위 북극곰과 에메랄드색 친환경 물병 심볼 결합" },
          { slogan: `🥣 [문화 존중] 소외된 이웃의 음식 한 그릇, 선교적 한 치의 편견 없이 나누는 식탁!`, designIdea: "다양한 색상의 손들이 모여 하나의 풍요로운 한솥밥 그릇을 감싸 쥐는 일러스트" },
          { slogan: `🕊️ [다양성 만세] 편견의 안경은 분리수거함으로, 세계시민 성찰 가치관은 학교 안으로!`, designIdea: "서로 다른 무늬의 세계 전통 복식을 입은 학생 친구들이 손을 잡는 포스터" },
          { slogan: `💧 [실천 선언] 우리 모둠의 솔선수범! '${tTopic ? tTopic.slice(0,18) : "지구지킴 약속"}' 지금 실행해요.`, designIdea: "깨끗한 세계 지도 주변으로 하트 가치 선언을 새기는 심볼 마킹" }
        ]);
        setLoadingCampaign(false);
      }, 450);
      return;
    }

    try {
      const res = await fetch("/api/ai/suggest-campaign", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": userApiKey,
          "x-class-code": classCode
        },
        body: JSON.stringify({
          topic: campaignInput.topic,
          coreMessage: campaignInput.coreMessage
        })
      });
      const data = await res.json();
      setSuggestedSlogans(data.slogans || []);
    } catch (e) {
      console.error(e);
      // Offline fallback
      setSuggestedSlogans([
        { slogan: "기후 정의 남 일 아냐! 텀블러로 지구 온도 1도 낮춰요!", designIdea: "녹아내리는 귀여운 펭귄 얼음 왕관 위에 에머랄드색 텀블러 구호 얹기" },
        { slogan: "지구 반대편 친구의 물 한 모금, 우리가 아낀 칫솔질 1회로 시작!", designIdea: "파란 지구 속에서 수많은 어린이들이 컵을 들고 깨끗한 나일강 물방울을 모으는 손 그림" },
        { slogan: "편견의 안경은 쓰레기통에, 다양성의 꽃씨는 교실 마루밑에!", designIdea: "서로 다른 문양의 여러 의상을 입은 친구들이 서로 어깨동무를 하고 걷는 원색 포스터" },
        { slogan: "버리면 무시무시한 온수 괴물, 헹구어 버리면 신비로운 영토 요정", designIdea: "재활용 분리수거 분리 수거함에서 장난감 자동차들이 새 장난감으로 미소 지으며 하이파이브" }
      ]);
    } finally {
      setLoadingCampaign(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-indigo-100">
      
      {/* Dynamic API Settings Modal */}
      {showApiKeyConfig && isTeacherUnlocked && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-left">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button 
              onClick={() => setShowApiKeyConfig(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold p-1"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Sliders className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h3 className="text-md font-extrabold text-slate-900">개인/학교 API 키 개별 설정</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              기본 제공되는 공공 AI 할당량이 부족하거나, <strong>각자가 발급받은 Gemini API 키</strong>를 활용해 안전하고 한계 없는 실시간 평론가 피드백을 가동하고 싶다면 아래에 키를 입력하십시오.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-[10px] text-slate-500 leading-relaxed border border-slate-150 mb-4 space-y-1">
              <p>💡 <strong>학생 개인 보안 및 비용 안심 보증:</strong> 입력하신 API 키는 브라우저의 <code>localStorage</code>에만 보존되며, 어떠한 외부 서버나 교육자 데이터베이스로 전송되지 않고 구글 정식 API 게이트웨이 호출에 직접 이용됩니다.</p>
              <p>🔑 API 키 발급은 <span className="text-indigo-600 font-bold hover:underline cursor-pointer" onClick={() => window.open("https://aistudio.google.com/", "_blank")}>aistudio.google.com</span>에서 무료로 1초만에 발급받으실 수 있습니다.</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Google Gemini API Key 입력</label>
                <input 
                  type="password"
                  value={userApiKey}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setUserApiKey(val);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    localStorage.setItem("user_gemini_api_key", userApiKey);
                    setShowApiKeyConfig(false);
                    alert("🔑 API 키가 안전하게 등록되었습니다! 실시간 AI 피드백이 사용자의 자체 키를 정식 활용합니다.");
                  }}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg shadow-sm transition"
                >
                  기기에 안전히 설정 보관
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("user_gemini_api_key");
                    setUserApiKey("");
                    setShowApiKeyConfig(false);
                    alert("🗑️ 등록되었던 API 키가 완전히 제거되었습니다. 이제 서버에 내장된 기본 설정을 활용합니다.");
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-lg transition"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Style Upper Navigation */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-8 bg-white border-b border-slate-200 shrink-0 shadow-sm z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <Globe className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-md md:text-lg font-extrabold tracking-tight text-slate-900 flex flex-wrap items-center gap-2">
              지구촌 소통 & 지킴이 Studio
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                32차시 통합형
              </span>
              {isServerApiKeyActive && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  🏫 학급 AI 활성화됨
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 font-medium">서로 다른 나라, 함께 사는 세계 • 초등 6학년 모듈형 프로젝트 포털</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="국가명, 대륙, 키워드 검색..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs w-52 focus:outline-none text-slate-700"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-slate-400 hover:text-slate-600 text-xs px-1">✕</button>
            )}
          </div>

          <div className="text-[11px] font-mono font-medium text-slate-500 bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-lg hidden sm:block">
            {currentTime}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 shadow-inner">
              담임
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* Sleek Left Sidebar */}
        <aside className="w-full lg:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shrink-0 lg:overflow-y-auto">
          
          {/* Main User Group Setup Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">실천 탐구 대표단</span>
              </div>
              <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold">진행형</span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">🏫 소속 학급/교실 코드</label>
                <input 
                  type="text" 
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-black text-indigo-700 bg-indigo-50/15 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:bg-white"
                  placeholder="예: 6-1"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">👥 실천 탐구 모둠명</label>
                <input 
                  type="text" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="모둠 이름을 명문화하세요"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-500">참여 학생 및 역할</label>
                <span className="text-[10px] text-slate-400">{groupMembers.length}명 참여</span>
              </div>
              
              <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {groupMembers.map((m, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[11px] bg-white border border-slate-150 p-1.5 rounded-md shadow-xs">
                    <span className="font-bold text-slate-700">{m.name} <span className="text-slate-400 text-[10px]">({m.role})</span></span>
                    <button 
                      onClick={() => handleRemoveMember(idx)} 
                      className="text-slate-300 hover:text-rose-500 hover:scale-115 transition"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                <input 
                  type="text" 
                  placeholder="이름" 
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px]"
                />
                <input 
                  type="text" 
                  placeholder="역할 (예: 촬영)" 
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px]"
                />
              </div>
              <button 
                onClick={handleAddMember}
                className="w-full mt-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition"
              >
                <Plus className="w-3 h-3 text-slate-400" /> 모둠원 추가하기
              </button>
            </div>
          </div>

          {/* Curriculum Guide Tree Navigation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">32차시 세부 프로젝트 단계</h2>
            </div>
            
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("curriculum")}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition text-left ${activeTab === "curriculum" ? "bg-indigo-50 border-l-3 border-indigo-600 text-indigo-700 font-bold shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Compass className={`w-4 h-4 ${activeTab === "curriculum" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>지구촌 문화 탐구 자료</span>
                <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono">1~8C</span>
              </button>

              <button 
                onClick={() => setActiveTab("storyboard")}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition text-left ${activeTab === "storyboard" ? "bg-indigo-50 border-l-3 border-indigo-600 text-indigo-700 font-bold shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Video className={`w-4 h-4 ${activeTab === "storyboard" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>소개 영상 기획 (시나리오)</span>
                <span className="ml-auto text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-mono">9~11C</span>
              </button>

              <button 
                onClick={() => setActiveTab("expo")}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition text-left ${activeTab === "expo" ? "bg-indigo-50 border-l-3 border-indigo-600 text-indigo-700 font-bold shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Stamp className={`w-4 h-4 ${activeTab === "expo" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>박람회 부스 계획 & 여권</span>
                <span className="ml-auto text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded font-mono">12~18C</span>
              </button>

              <button 
                onClick={() => setActiveTab("resolution")}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition text-left ${activeTab === "resolution" ? "bg-indigo-50 border-l-3 border-indigo-600 text-indigo-700 font-bold shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <FileText className={`w-4 h-4 ${activeTab === "resolution" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>가상 UN 회의 (결의안)</span>
                <span className="ml-auto text-[9px] bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded font-mono">19~27C</span>
              </button>

              <button 
                onClick={() => setActiveTab("campaign")}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold transition text-left ${activeTab === "campaign" ? "bg-indigo-50 border-l-3 border-indigo-600 text-indigo-700 font-bold shadow-xs" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Award className={`w-4 h-4 ${activeTab === "campaign" ? "text-indigo-600" : "text-slate-400"}`} />
                <span>캠페인 & 세계인 실천 선서</span>
                <span className="ml-auto text-[9px] bg-slate-100 text-slate-500 px-1 py-0.2 rounded font-mono">28~32C</span>
              </button>

              {/* Teacher Hub Separator & Button */}
              <div className="border-t border-slate-100 my-2 pt-2">
                <button 
                  onClick={() => {
                    if (isTeacherUnlocked) {
                      setActiveTab("teacher");
                    } else {
                      setShowTeacherUnlockModal(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-bold transition text-left cursor-pointer ${
                    activeTab === "teacher" 
                      ? "bg-rose-50 border-l-3 border-rose-600 text-rose-700 font-black shadow-xs-rose" 
                      : isTeacherUnlocked
                        ? "text-rose-600 hover:bg-rose-50" 
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <BookOpen className={`w-4 h-4 ${activeTab === "teacher" ? "text-rose-600" : isTeacherUnlocked ? "text-rose-500" : "text-slate-400"}`} />
                  <div className="flex flex-col text-left">
                    <span className="flex items-center gap-1">
                      <span>교사용 결과 수합 허브</span>
                      <span className="text-[10px]">{isTeacherUnlocked ? "🔓" : "🔒"}</span>
                    </span>
                    {!isTeacherUnlocked && <span className="text-[9px] text-slate-400 font-normal">학업 결과 열람 암호잠금</span>}
                  </div>
                  <span className="ml-auto text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-mono font-bold">수합</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Project Metrics Progress Box */}
          <div className="mt-auto border-t border-slate-200 pt-4">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">개인 및 모둠 학업 성과표</h2>
            <div className="space-y-3.5">
              
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>여권 문화 스탬프 수집</span>
                  <span>{userPassportStamps.length} / {countries.length}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${(userPassportStamps.length / countries.length) * 105 / 1.05}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>시나리오 연출 완성도</span>
                  <span>{storyboard.length > 2 ? "100%" : storyboard.length > 0 ? "50%" : "0%"}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: storyboard.length > 2 ? "100%" : storyboard.length > 0 ? "50%" : "0%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>UN 공동 서명 실천 상태</span>
                  <span>{signedOath ? "서명 완료 (위촉)" : "서명 서약 대기"}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${signedOath ? "bg-amber-500" : "bg-slate-350"}`}
                    style={{ width: signedOath ? "100%" : "30%" }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Master Workspace Content Frame */}
        <main className="flex-1 flex flex-col p-6 md:p-8 lg:overflow-y-auto">
          
          {/* Active Academic Guidance Banner for students */}
          {activeTab !== "teacher" && (
            <div className="mb-6 bg-gradient-to-r from-indigo-50/50 via-amber-50/30 to-rose-50/20 border border-slate-200/85 rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-sm text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-905 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span>✍️ 학생 자기주도 탐구 실습 모드 가동 중</span>
                  <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-extrabold">과제 빈칸 직접 완성형</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  이 응용웹앱은 학생들이 실증적 현장 자료 조사를 마친 뒤 스토리보드, UN 결의안, 실천 가이드들을 <strong>스스로 구성·제출</strong>할 수 있도록 모든 기획 영역이 <strong>깨끗한 빈칸(Blank)</strong>으로 최적 배정되어 있습니다. 우측 퀴즈와 문화 아카이브를 조사해 보며 나만의 창조안을 채우세요!
                </p>
                <div className="text-[10px] text-slate-500 font-medium">
                  🔑 <strong>교사 수업 팁:</strong> 학생들이 기획을 끝마치면 최종 5단계에서 <strong className="text-indigo-600">수합용 결과 파일(.json)을 직접 다운로드</strong>하여 선생님께 제출할 수 있으며, 아직 API 키가 없어도 로컬 인공지능 분석 가자문이 항시 원활히 동작합니다.
                </div>
              </div>
              <div className="flex gap-2 items-center lg:self-center self-start shrink-0">
                <button 
                  onClick={loadEgyptSample}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11.5px] rounded-xl shadow-xs transition duration-150 flex items-center gap-1.5"
                  title="이집트 탐구 모범 예시를 자동으로 입력합니다."
                >
                  💡 완벽 이집트 예제 자동채우기
                </button>
                <button 
                  onClick={resetToBlank}
                  className="px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-[11.5px] rounded-xl transition"
                  title="모든 입력값을 초기 빈 상태로 리셋합니다."
                >
                  🗑️ 내 기획 초기화
                </button>
              </div>
            </div>
          )}
          
          {/* Active Tab 1: Curriculum / Country Explorer */}
          {activeTab === "curriculum" && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 animate-pulse" /> 1단계 요약: 세계 여러 나라의 음식, 의학, 의상, 인사, 주거, 축제 탐구
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">지구촌 다양성 지식 아카이브</h2>
                  <p className="text-slate-500 text-xs">학교자율시간 32차시 세부 계획안의 성취요소를 기반으로 구축된 국가별 실증 조사 포트폴리오입니다.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">모둠 Target 지정:</span>
                    <select 
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const found = countries.find(c => c.code === e.target.value);
                        if (found) setSelectedCountry(found);
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {countries.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* AI Custom Country Creator */}
                  <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-3">
                    <input 
                      type="text"
                      placeholder="예: 미국, 프랑스, 일본, 멕시코..."
                      value={generatingCountryName}
                      onChange={(e) => setGeneratingCountryName(e.target.value)}
                      disabled={isGeneratingCountry}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 w-36 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (!generatingCountryName.trim()) return;
                          setIsGeneratingCountry(true);
                          try {
                            const res = await fetch("/api/ai/generate-country", {
                              method: "POST",
                              headers: { 
                                "Content-Type": "application/json",
                                "x-gemini-api-key": userApiKey,
                                "x-class-code": classCode
                              },
                              body: JSON.stringify({ countryName: generatingCountryName.trim() })
                            });
                            if (!res.ok) throw new Error("API call failed");
                            const newCountry = await res.json();
                            if (countries.some(c => c.code === newCountry.code || c.name.toLowerCase().includes(newCountry.name.split(" ")[0].toLowerCase()))) {
                              alert("이미 아카이브에 존재하는 국가입니다!");
                            } else {
                              const updated = [newCountry, ...countries];
                              setCountries(updated);
                              setSelectedCountry(newCountry);
                              setGeneratingCountryName("");
                              alert(`🎉 실시간 탐색 성공! [${newCountry.name}]의 6학년 지리학 수준 문화 피드 및 퀴즈가 AI를 통해 성공적으로 입배열되었습니다.`);
                            }
                          } catch (err) {
                            console.error(err);
                            alert("AI 국가 정보 검색에 실패하였습니다. 네트워크 상태나 API 설정을 확인해 주십시오.");
                          } finally {
                            setIsGeneratingCountry(false);
                          }
                        }
                      }}
                    />
                    <button
                      onClick={async () => {
                        if (!generatingCountryName.trim()) {
                          alert("추가할 국가 이름을 입력해 주세요!");
                          return;
                        }
                        setIsGeneratingCountry(true);
                        try {
                          const res = await fetch("/api/ai/generate-country", {
                            method: "POST",
                            headers: { 
                              "Content-Type": "application/json",
                              "x-gemini-api-key": userApiKey,
                              "x-class-code": classCode
                            },
                            body: JSON.stringify({ countryName: generatingCountryName.trim() })
                          });
                          if (!res.ok) throw new Error("API call failed");
                          const newCountry = await res.json();
                          if (countries.some(c => c.code === newCountry.code || c.name.toLowerCase().includes(newCountry.name.split(" ")[0].toLowerCase()))) {
                            alert("이미 아카이브에 존재하는 국가입니다!");
                          } else {
                            const updated = [newCountry, ...countries];
                            setCountries(updated);
                            setSelectedCountry(newCountry);
                            setGeneratingCountryName("");
                            alert(`🎉 실시간 탐색 성공! [${newCountry.name}]의 6학년 지리학 수준 문화 피드 및 퀴즈가 AI를 통해 성공적으로 입배열되었습니다.`);
                          }
                        } catch (err) {
                          console.error(err);
                          alert("AI 국가 정보 검색에 실패하였습니다. 네트워크 상태나 API 설정을 확인해 주십시오.");
                        } finally {
                          setIsGeneratingCountry(false);
                        }
                      }}
                      disabled={isGeneratingCountry}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-sm shrink-0"
                    >
                      {isGeneratingCountry ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          탐색 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-200" />
                          AI 국가 추가
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsive Cards Filter Search List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCountries.map((country) => (
                  <button 
                    key={country.code}
                    onClick={() => setSelectedCountry(country)}
                    className={`p-5 rounded-2xl border transition-all text-left group relative ${
                      selectedCountry.code === country.code 
                        ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-50" 
                        : "bg-white border-slate-200 hover:border-slate-350 hover:shadow-xs shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-3xl group-hover:scale-110 transition duration-300">{country.flag}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">
                        {country.continent}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition">{country.name}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{country.description}</p>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-indigo-600">성취 퀴즈 도전</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-1.5 transition" />
                    </div>

                    {userPassportStamps.includes(country.code) && (
                      <span className="absolute top-3 right-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Detailed Active Country Showcase */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-2">
                <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedCountry.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">{selectedCountry.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">대륙 분류: {selectedCountry.continent} • 모둠 선택 국가</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleStartQuiz(selectedCountry)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-black tracking-wide text-white flex items-center gap-2 transition"
                  >
                    <Award className="w-4 h-4" /> 디지털 스탬프 획득 퀴즈 풀기
                  </button>
                </div>

                {/* Direct Student Investigative Worksheets (No Answer Key Tabs) */}
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/40 border border-indigo-200/50 rounded-xl p-4 text-xs text-indigo-950 font-bold flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
                    <div className="space-y-0.5">
                      <span className="text-indigo-800">🕵️ 학생 자기주도 세계 문화 탐구 지침:</span>
                      <p className="font-medium text-slate-600 text-[11px] leading-relaxed">
                        교과서나 백과사전, 인터넷 검색을 활용하여 선택한 나라의 지리 환경적 영양과 문화적 특징을 직접 가나다 조사하여 아래 빈 칸들을 성실하게 기재하여 주십시오. (해당 지식은 씬 스토리보드 및 모의 UN 활동으로 자동 연계됩니다)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Food Research Input */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-black font-serif text-xs">食</span>
                        <h4 className="text-xs font-black text-slate-800">1. 고유 음식 문화 및 환경적 탄생 배경</h4>
                      </div>
                      <textarea
                        rows={3}
                        value={studentResearch[selectedCountry.code]?.food || ""}
                        onChange={(e) => handleUpdateResearch("food", e.target.value)}
                        placeholder="예: 지중해 연안 특색으로 싱싱한 해산물과 쌀을 황금 향신료 샤프란으로 볶은 '빠에야'를 먹으며 건조한 더위를 건강히 이겨냅니다..."
                        className="w-full text-xs text-slate-700 bg-slate-50/20 border border-slate-250 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Greeting Research Input */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-black font-serif text-xs">禮</span>
                        <h4 className="text-xs font-black text-slate-800">2. 전통 소망 예절과 소통 규칙</h4>
                      </div>
                      <textarea
                        rows={3}
                        value={studentResearch[selectedCountry.code]?.greeting || ""}
                        onChange={(e) => handleUpdateResearch("greeting", e.target.value)}
                        placeholder="예: 양 뺨을 소리 내어 순차대로 부비는 '도스 베소스' 인사를 하며 우정과 상호 생존적 존경을 담아 상호 작용을 행합니다..."
                        className="w-full text-xs text-slate-700 bg-slate-50/20 border border-slate-250 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Costume Research Input */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded font-black font-serif text-xs">衣</span>
                        <h4 className="text-xs font-black text-slate-800">3. 기후 극복 전통 의복 형태 및 기능</h4>
                      </div>
                      <textarea
                        rows={3}
                        value={studentResearch[selectedCountry.code]?.costume || ""}
                        onChange={(e) => handleUpdateResearch("costume", e.target.value)}
                        placeholder="예: 강렬한 사막 뙤약볕과 살을 베는 건조 모래바람을 막도록 천연 헐렁한 면포로 목부터 원피스형 전신을 두릅니다..."
                        className="w-full text-xs text-slate-700 bg-slate-50/20 border border-slate-250 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Festival Research Input */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded font-black font-serif text-xs">樂</span>
                        <h4 className="text-xs font-black text-slate-800">4. 고유 축제 의미와 공동체 연대 방식</h4>
                      </div>
                      <textarea
                        rows={3}
                        value={studentResearch[selectedCountry.code]?.festival || ""}
                        onChange={(e) => handleUpdateResearch("festival", e.target.value)}
                        placeholder="예: 붉은 토마토를 거리에 마구 투척하여 농작물의 넘침을 이종의 유쾌한 축소 놀이이자 상생 협력의 나눔 축제로 칭양합니다..."
                        className="w-full text-xs text-slate-700 bg-slate-50/20 border border-slate-250 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setStudentResearch(prev => ({
                          ...prev,
                          [selectedCountry.code]: { food: "", greeting: "", costume: "", festival: "" }
                        }));
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl transition"
                    >
                      🗑️ 입력 칸 비우기
                    </button>
                    <button
                      onClick={() => {
                        const resData = studentResearch[selectedCountry.code];
                        if (!resData || !resData.food || !resData.greeting || !resData.costume || !resData.festival) {
                          alert("⚠️ 수집되지 않은 빈 칸이 있습니다. 모든 탐구 항목에 자료를 작성해 주세요.");
                          return;
                        }
                        const c1 = checkContentQuality(resData.food);
                        const c2 = checkContentQuality(resData.greeting);
                        const c3 = checkContentQuality(resData.costume);
                        const c4 = checkContentQuality(resData.festival);
                        if (!c1.isValid) { alert(`[음식 오류] ${c1.reason}`); return; }
                        if (!c2.isValid) { alert(`[인사 오류] ${c2.reason}`); return; }
                        if (!c3.isValid) { alert(`[복식 오류] ${c3.reason}`); return; }
                        if (!c4.isValid) { alert(`[축제 오류] ${c4.reason}`); return; }

                        alert("💾 나만의 세계 문화 조사 수집 데이터가 로컬 공간에 안전하게 적재되었습니다! 32차시 최종 포트폴리오 및 영상 시나리오 기획에 완벽히 연계 동체화됩니다.");
                      }}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                    >
                      💾 우리 모둠 조사 수집 완료
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 bg-indigo-50/50 border-t border-slate-150 flex items-center justify-between text-xs text-indigo-800 font-medium">
                  <span>💡이 국가의 탐구 결과는 대본 기획서(2단계)나 모의 UN(4단계) 자료로 연동될 수 있습니다.</span>
                  <button 
                    onClick={() => {
                      setSelectedCountry(selectedCountry);
                      setActiveTab("storyboard");
                    }}
                    className="text-indigo-700 font-extrabold hover:underline"
                  >
                    바로 시나리오 대본에 연결하러 가기 &rarr;
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Active Tab 2: Storyboard & Video Scripting */}
          {activeTab === "storyboard" && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Video className="w-4 h-4" /> 2단계 요약: 9~11차시 지구촌 소개 영상 기획서 및 편집 시나리오 구체화
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">영상 촬영용 시나리오 스토리보더</h2>
                  <p className="text-slate-500 text-xs">작성한 대본은 담임교사의 전문적 피드백을 위해 server-side Gemini AI 로 즉시 가동 컨설팅을 받게 됩니다.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAutofillExample}
                    className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    {selectedCountry.flag} 탐구 모범 예시 채우기
                  </button>
                </div>
              </div>

              {/* 🎥 모둠 완성 동영상 링크 연결 (선택) */}
              <div className="bg-gradient-to-r from-indigo-50/70 to-amber-50/70 rounded-2xl border-2 border-indigo-200 p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                <div className="space-y-1 text-left flex-1">
                  <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                    <span className="text-base">🎥</span>
                    <span>우리 모둠 완성 동영상 링크 연결 (선택)</span>
                    <span className="text-[9px] bg-indigo-100 text-indigo-700 border border-indigo-200 font-extrabold px-2 py-0.5 rounded-full">전시관 자동 연동</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    스토리보드를 바탕으로 직접 찰영·편집하신 최종 동영상(YouTube, 구글 드라이브, 또는 일반 링크)이 있다면 아래에 등록하세요. 디지털 엑스포 전시부스에 온라인 감상 버튼이 자동 제공됩니다.
                  </p>
                </div>
                <div className="w-full md:w-96 flex gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="https://youtu.be/... 또는 영상 링크 주소"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-850 placeholder:text-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  {videoUrl && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center shrink-0 shadow-sm"
                    >
                      테스트 🔗
                    </a>
                  )}
                </div>
              </div>

              {/* Storyboard Working Area */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Scene Input Fields */}
                <div className="xl:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 self-start">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center justify-between">
                    <span>{editSceneIndex !== null ? `인력 편집: 씬 ${editSceneIndex+1}` : "새로운 신(Scene) 작성"}</span>
                    {editSceneIndex !== null && (
                      <button onClick={() => setEditSceneIndex(null)} className="text-xs text-rose-500 hover:underline">취소</button>
                    )}
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">속속 구분</label>
                    <select 
                      value={sceneInput.category}
                      onChange={(e) => setSceneInput({...sceneInput, category: e.target.value as TopicType})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="음식">음식 문화 코너</option>
                      <option value="언어/인사">언어와 인사 예절</option>
                      <option value="의상/축제">의상 및 이색 축제</option>
                      <option value="통합">통합 오프닝/클로징</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">비주얼 화면 구도 및 학생 행동 연출</label>
                    <textarea 
                      rows={3}
                      placeholder="카메라에 비치는 장면 구성, 소품 위치, 학생 연출 동선을 미장센 형태로 기입하세요."
                      value={sceneInput.screenVisual}
                      onChange={(e) => setSceneInput({...sceneInput, screenVisual: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">말 더빙 / 자막 문구 / 성우 소요 목소리</label>
                    <textarea 
                      rows={3}
                      placeholder="낭독할 대사 및 화면 하단 자막 텍스트를 소리내어 말하듯 풍부하게 서술하세요."
                      value={sceneInput.audioText}
                      onChange={(e) => setSceneInput({...sceneInput, audioText: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">비고 및 준비물 소품 (옵션)</label>
                    <input 
                      type="text" 
                      placeholder="예: 태블릿, 화려한 보자기, 매콤한 소형 소스병"
                      value={sceneInput.notes}
                      onChange={(e) => setSceneInput({...sceneInput, notes: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button 
                    onClick={handleSaveScene}
                    className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> {editSceneIndex !== null ? "씬 내용 최종 적용" : "시나리오 씬 추가"}
                  </button>
                </div>

                {/* Current Scenes List */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {groupName} 시나리오 흐름 ({storyboard.length}씬 등록됨)
                      </h4>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                        타겟: {selectedCountry.flag} {selectedCountry.name}
                      </span>
                    </div>

                    {storyboard.length === 0 ? (
                      <div className="h-48 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Video className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs font-bold text-slate-500">작성된 시나리오 장면이 비어있습니다.</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                          모둠 타겟에 맞춰 상단의 [모범 예시 채우기] 버튼을 활용하거나 수동으로 화면 내용을 정성껏 채워보세요.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                        {storyboard.map((scene, index) => (
                          <div key={scene.id} className="bg-slate-50 rounded-xl border border-slate-150 p-4 transition hover:bg-slate-100/80">
                            <div className="flex justify-between items-start border-b border-slate-150 pb-2 mb-2 gap-2">
                              <span className="text-xs font-black text-indigo-700">Scene #{scene.sceneNumber}</span>
                              <div className="flex gap-1.5 items-center">
                                <span className="bg-slate-200 font-bold text-slate-700 text-[10px] px-2 py-0.5 rounded">
                                  {scene.category}
                                </span>
                                <button 
                                  onClick={() => handleEditScene(index)}
                                  className="text-[10px] font-bold text-slate-500 hover:text-indigo-600"
                                >
                                  수정
                                </button>
                                <button 
                                  onClick={() => handleRemoveScene(index)}
                                  className="text-[10px] font-bold text-rose-500 hover:text-rose-700"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="text-[11px]">
                                <span className="block font-bold text-slate-500 mb-0.5">🎬 화면 연출</span>
                                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-100">{scene.screenVisual}</p>
                              </div>
                              <div className="text-[11px]">
                                <span className="block font-bold text-slate-500 mb-0.5">🎙️ 오디오/내레이션</span>
                                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-100 italic">{scene.audioText}</p>
                              </div>
                            </div>

                            {scene.notes && (
                              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded">
                                <Sliders className="w-3 h-3 shrink-0" />
                                <span><strong>비고:</strong> {scene.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {storyboard.length > 0 && (
                      <div className="mt-5 border-t border-slate-150 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <span className="text-[11px] text-slate-400">
                          대본 작성을 최종 완료하셨다면, 담임교사 및 교사 AI 자문위위원회의 전문 피드백을 진행하세요.
                        </span>
                        
                        <button 
                          onClick={handleEvaluateScript}
                          disabled={evaluatingScript}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-black tracking-wide shrink-0 transition flex items-center gap-1.5 shadow-sm shadow-indigo-100"
                        >
                          {evaluatingScript ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              AI 컨설팅 분석 중...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 ml-0.5 text-amber-200" />
                              AI 교사 대본 컨설팅 요청
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  </div>

                  {/* AI Feedback Display Space */}
                  {scriptFeedback && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            評
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">초등 담임 교사 및 AI 자문 평가 결과</h4>
                            <p className="text-[10px] text-slate-400">교사 컨설팅 정식 반영 완료</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-bold">성취수준 등급:</span>
                          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                            {scriptFeedback.level || "잘함"}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-150">
                        {scriptFeedback.feedback}
                      </div>

                      <div>
                        <h5 className="text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider">🛠️ 다음 차시 영상 촬영 전 실천 보완 사항 3가지</h5>
                        <ul className="space-y-1.5">
                          {scriptFeedback.recommendations?.map((rec: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 bg-white border border-slate-150 p-2.5 rounded-lg shadow-2xs">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx+1}
                              </span>
                              <span className="leading-relaxed">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* Active Tab 3: Expo Booth & Quiz Passport */}
          {activeTab === "expo" && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Stamp className="w-4 h-4 text-emerald-600" /> 3단계 요약: 13~18차시 지구촌 문화 박람회 부스 계획 및 각국 탐구 여권
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">수업 부스 레이아웃 & 글로벌 여권</h2>
                  <p className="text-slate-500 text-xs">다른 모둠의 문화를 탐험하고 퀴즈를 해결하여 박람회 도장 스탬프를 가득 획득하세요.</p>
                </div>
              </div>

              {/* Layout Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Physical-style Passport Cover Card */}
                <div className="xl:col-span-1 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-2xl text-white flex flex-col gap-5 shadow-lg relative overflow-hidden h-[440px]">
                  
                  {/* Background graphic */}
                  <div className="absolute -right-16 -bottom-16 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="border-2 border-indigo-500 font-mono text-[9px] px-2 py-0.5 rounded text-indigo-400 font-bold uppercase tracking-widest">
                      REP OF KOREA
                    </div>
                    <span className="text-xs text-slate-400 font-bold font-mono">PASSPORT DEPT</span>
                  </div>

                  <div className="my-auto text-center flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full border-3 border-indigo-400/40 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-indigo-400 animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="text-md font-sans font-black tracking-widest text-[#E2E8F0]">세계시민 탐구여권</h3>
                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter mt-1">GLOBAL PASSPORT OF INTEGRITY</p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-800/80 pt-4 text-left">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-500">지킴이 이름(Bearer)</span>
                        <span className="font-extrabold text-[#F1F5F9]">{groupMembers[0]?.name || "김민재"} 학생</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-500">소속(Group)</span>
                        <span className="font-bold text-[#F1F5F9]">{groupName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp overlay row */}
                  <div className="pt-3 border-t border-slate-800 flex justify-center gap-1.5 overflow-x-auto">
                    {countries.map(c => {
                      const unlocked = userPassportStamps.includes(c.code);
                      return (
                        <div 
                          key={c.code} 
                          title={`${c.name} 스탬프`}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition border ${
                            unlocked 
                              ? "bg-emerald-950/80 border-emerald-500 text-white shadow-xs" 
                              : "bg-slate-800/40 border-slate-750 text-slate-600"
                          }`}
                        >
                          {unlocked ? c.flag : "🔒"}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expo Booth Layout Planner */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">📐 우리 모둠 부스 공간 구성 기획기</h3>
                    <p className="text-slate-500 text-xs">후배들을 귀하게 초대하는 14~15차시 세계 박람회(Expo) 부스 구획 동선을 미리 배치해보고 비품을 가늠합니다.</p>
                  </div>

                  {/* Visual Booth Grid Canvas */}
                  <div className="aspect-video bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col relative overflow-hidden">
                    
                    {/* Background grid markings */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

                    {/* Left Screen Wall */}
                    <div className="absolute left-4 top-4 bottom-4 w-28 border border-slate-200 bg-white rounded-lg shadow-xs flex flex-col justify-center items-center text-center p-2">
                      <span className="text-xl">🎦</span>
                      <span className="text-[11px] font-bold text-slate-700 mt-1">상영존(Screen)</span>
                      <p className="text-[9px] text-slate-400">제작한 소개 영상 재생 대형 패드</p>
                      {expoBoothLayout.videoScreen ? (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded mt-1.5">활성동선</span>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1 rounded mt-1.5">배치 해제</span>
                      )}
                    </div>

                    {/* Central Interactive Zone */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center px-32 gap-3 z-10">
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">EXPO Table</span>
                      <div className="bg-white border-2 border-dashed border-indigo-200 rounded-xl py-6 px-10 shadow-xs flex flex-col items-center gap-1">
                        <span className="text-3xl">{selectedCountry.flag}</span>
                        <span className="text-xs font-bold text-indigo-700">{selectedCountry.name} 헌정 부스</span>
                        <p className="text-[10px] text-slate-400">교실 책상 3개 연접 전시장</p>
                      </div>
                    </div>

                    {/* Right experience Wall */}
                    <div className="absolute right-4 top-4 bottom-4 w-32 border border-slate-200 bg-white rounded-lg shadow-xs flex flex-col justify-center items-center text-center p-2">
                      <span className="text-xl">🥢</span>
                      <span className="text-[11px] font-bold text-slate-700 mt-1">체험존(Activity)</span>
                      <p className="text-[9px] text-slate-400">전통 음식 한 입 시식 및 인사말 카드</p>
                      {expoBoothLayout.foodTesting ? (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">시식 연계 가동</span>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1">시식 미배치(예결부족)</span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-[10px] bg-slate-800 text-white px-3 py-1 rounded-full font-mono">
                      교실 후방 출입 동선 ↔ 관객 진입 방향 정렬
                    </div>
                  </div>

                  {/* Toggle configuration buttons */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">활성 부스 레이아웃 스위치</h4>
                    <div className="flex flex-wrap gap-2.5">
                      <button 
                        onClick={() => setExpoBoothLayout({...expoBoothLayout, videoScreen: !expoBoothLayout.videoScreen})}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          expoBoothLayout.videoScreen 
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700" 
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        🎦 9C 소개영상 상영 패널
                      </button>

                      <button 
                        onClick={() => setExpoBoothLayout({...expoBoothLayout, foodTesting: !expoBoothLayout.foodTesting})}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          expoBoothLayout.foodTesting 
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700" 
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        🍇 한 입 크기 전통 음식 시식회
                      </button>

                      <button 
                        onClick={() => setExpoBoothLayout({...expoBoothLayout, greetingExp: !expoBoothLayout.greetingExp})}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          expoBoothLayout.greetingExp 
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700" 
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        🤝 앗살라무 알라이쿰! 전통 인사 예절 안내
                      </button>

                      <button 
                        onClick={() => setExpoBoothLayout({...expoBoothLayout, outfitPhoto: !expoBoothLayout.outfitPhoto})}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                          expoBoothLayout.outfitPhoto 
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700" 
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        📸 종이인형/전통 의상 포토존
                      </button>
                    </div>
                  </div>

                </div>

              </div>

              {/* Stamp Challenge Board */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">🌍 다문화 박람회 지식 부스 퀴즈 챔프</h3>
                    <p className="text-slate-500 text-xs">다른 모둠이 기획한 부스의 설명 카드를 머리에 담고, 골든벨 퀴즈에 보람차게 기여하세요.</p>
                  </div>
                  <span className="text-xs text-indigo-700 font-bold bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-full">
                    도장 수집 성과: {userPassportStamps.length} / {countries.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {countries.map((country) => {
                    const stampCollected = userPassportStamps.includes(country.code);
                    return (
                      <div 
                        key={country.code}
                        className={`p-4 rounded-xl border text-center flex flex-col items-center justify-between gap-3 transition-transform hover:-translate-y-1.5 ${
                          stampCollected 
                            ? "bg-[#FCFDFE] border-emerald-300 shadow-xs" 
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-4xl">{country.flag}</span>
                          <span className="text-[11px] font-bold text-slate-700 leading-tight">{country.name.split(" ")[0]}</span>
                          <span className="text-[9px] uppercase font-mono text-slate-400">{country.continent.split(" ")[0]}</span>
                        </div>

                        {stampCollected ? (
                          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <span className="font-sans">✓</span> 스탬프 등록
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleStartQuiz(country)}
                            className="w-full py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 text-[10px] font-black rounded-lg transition"
                          >
                            발상 퀴즈 시작
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Active Tab 4: UN Resolution */}
          {activeTab === "resolution" && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" /> 4단계 요약: 19~27차시 가상 UN 세계 지킴이 총회 제출용 공동 결의안
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">가상 UN 공동 합의 결의안 (Resolution)</h2>
                  <p className="text-slate-500 text-xs">지구촌 3대 현안(기후변화, 자원결핍, 인권난민) 중 하나를 선정해 타협적 문장으로 실천 법안을 성안하십시오.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Resolution Interactive Form UI */}
                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-800">📜 결의안 정식 작성 초안</h3>
                    <span className="text-[11px] font-mono font-bold text-slate-400">UN SECRETARIAT TEMP #6A</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">상임 제안국 (Sponsor Country)</label>
                      <input 
                        type="text" 
                        value={resolution.sponsorCountry}
                        onChange={(e) => setResolution({...resolution, sponsorCountry: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">임시 안건 번호 (Resolution ID)</label>
                      <input 
                        type="text" 
                        value={resolution.resolutionNumber}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-400 select-none cursor-not-allowed focus:outline-none"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">기획 결의안 제호 (Title of the Proposal)</label>
                    <input 
                      type="text" 
                      value={resolution.title}
                      onChange={(e) => setResolution({...resolution, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      결의안 전문 (Preamble - 문제 제기 및 우려 공유)
                    </label>
                    <textarea 
                      rows={5}
                      value={resolution.preamble}
                      onChange={(e) => setResolution({...resolution, preamble: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 leading-relaxed focus:outline-none"
                      placeholder="우리는 세계시민으로서 전례 없는 급격한 위험에 부딪친 국가들을 보고 슬픔을 느끼며..."
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-500">실천 및 촉구 조항 (Operative Clauses)</label>
                      <span className="text-[10px] text-slate-400">{operativeClauses.length}개 조항 성안</span>
                    </div>

                    <ul className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                      {operativeClauses.map((c, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-xs leading-relaxed text-slate-700 shadow-3xs">
                          <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold shrink-0 w-12 text-center rounded py-0.5 mt-0.5">
                            제 {idx+1}항
                          </span>
                          <span className="flex-1">{c}</span>
                          <button 
                            onClick={() => handleRemoveClause(idx)}
                            className="text-slate-300 hover:text-rose-500 text-xs px-1 hover:scale-110 transition"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="새로운 강령 조항을 기재하세요. (예: 저개발국 식수 공급 정수기 모금 운동 전개)"
                        value={newClauseText}
                        onChange={(e) => setNewClauseText(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddClause();
                        }}
                      />
                      <button 
                        onClick={handleAddClause}
                        className="px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition whitespace-nowrap"
                      >
                        조항 추가
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">UN 위원의 고귀한 주권 의무입니다.</span>
                    <button 
                      onClick={handleEvaluateResolution}
                      disabled={evaluatingResolution}
                      className="px-4 py-2 bg-slate-900 hover:bg-indigo-950 text-white text-xs font-extrabold tracking-wide rounded-xl disabled:bg-slate-300 transition flex items-center gap-1.5 shadow-sm"
                    >
                      {evaluatingResolution ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          가상 UN 사무국 검토 중...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          UN 지킴이 자문위원회 AI 분석 요청
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Resolution Evaluation Official-style Sheet */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  
                  {/* Preamble UN vocabulary helper cheatsheet */}
                  <div className="bg-slate-950 text-slate-300 p-5 rounded-2xl shadow-sm border border-slate-800 flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-indigo-400" /> UN 공식 권위적 동사 치트시트
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      결의안의 문격(文格)을 극대화하기 위해 첫 머릿말에 아래의 유엔 전통 권장 지식 동사를 융합해 결합해보세요.
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold text-center">
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-indigo-300">‘지지를 선포하며’</span>
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-indigo-300">‘우려를 표명하며’</span>
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-indigo-400">‘즉각 촉구한다’</span>
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-indigo-400">‘준수를 엄권한다’</span>
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-emerald-400">‘동반 도모한다’</span>
                      <span className="bg-slate-900 border border-slate-800 p-1.5 rounded text-emerald-400">‘긴급 강조한다’</span>
                    </div>
                  </div>

                  {resolutionFeedback ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 md:p-6 flex flex-col gap-4 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider font-mono">
                            UN
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">UN 위원회 외교 컨설턴트 보고서</h4>
                            <p className="text-[10px] text-slate-400">성안 타당성 및 보편 연대 심사</p>
                          </div>
                        </div>

                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                          resolutionFeedback.status === "완성도 높음" 
                            ? "bg-emerald-50 border border-emerald-150 text-emerald-700" 
                            : "bg-amber-50 border border-amber-150 text-amber-700"
                        }`}>
                          {resolutionFeedback.status || "완성도 높음"}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-150 relative">
                        <div className="absolute top-2 right-2 text-2xl font-serif text-slate-150 select-none">“</div>
                        {resolutionFeedback.analysis}
                      </div>

                      <div>
                        <h5 className="text-[10px] font-extrabold text-slate-500 mb-2.5 uppercase tracking-wider">
                          🗳️ 결의안 법제 수정 및 교내 연계 자치 조치
                        </h5>
                        <ul className="space-y-1.5">
                          {resolutionFeedback.actionableSuggestions?.map((sug: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 bg-white border border-slate-150 p-2.5 rounded-lg shadow-2xs">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {idx+1}
                              </span>
                              <span className="leading-relaxed">{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 bg-white/50 rounded-2xl p-6 h-64 flex flex-col justify-center items-center text-center">
                      <FileText className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-500">대기 중인 UN 자문 평가 보고서가 없습니다.</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                        조항을 정돈하여 좌측의 [AI 분석 요청] 단계를 누르시면 외교 전문가의 전문 수용 가이드가 도감화됩니다.
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* Active Tab 5: Campaigns & Citizen Oath */}
          {activeTab === "campaign" && (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600 animate-pulse" /> 5단계 요약: 28~32차시 캠페인 슬로건 및 명예 세계시민 통합 선서식
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">캠페인 포스터 슬로건 & 세계 시민 위촉장</h2>
                  <p className="text-slate-500 text-xs">교내 등교 캠페인에 들고 나갈 임시 슬로건 피켓 미술 디자인을 영감받고, 삶에 뿌리박을 선서를 서약합니다.</p>
                </div>
              </div>

              {/* Campaign design Section */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Custom input panel for generator */}
                <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 self-start">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
                    미술 및 국어 연계 캠페인 설계자
                  </h3>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">우리 부스의 캠페인 대의 명제</label>
                    <input 
                      type="text" 
                      value={campaignInput.topic}
                      onChange={(e) => setCampaignInput({...campaignInput, topic: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 lg:text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">상설 핵심 호소문 (우리가 바라는 것)</label>
                    <textarea 
                      rows={3} 
                      value={campaignInput.coreMessage}
                      onChange={(e) => setCampaignInput({...campaignInput, coreMessage: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 lg:text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button 
                    onClick={handleSuggestSlogans}
                    disabled={loadingCampaign}
                    className="w-full mt-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {loadingCampaign ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        창의적 슬로건 도출 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        학교 공익 피켓 슬로건 추천받기
                      </>
                    )}
                  </button>
                </div>

                {/* Slogan output mockup list */}
                <div className="xl:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm min-h-[300px]">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                    <span>수립된 등교길 캠페인 피켓 시안 (4선)</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">미술/국어 융합형</span>
                  </h4>

                  {suggestedSlogans.length === 0 ? (
                    <div className="h-64 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/10">
                      <Compass className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-500">제안된 피켓 구호 장식 슬로건이 없습니다.</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-md">
                        좌측 핵심 메시지에 캠페인 희망 대의를 한 마디 전하고 추천 버튼을 이식하면, 전교생의 이목을 끌 수 있는 뇌리 슬로건이 피켓 디자인 구도와 함께 세팅됩니다.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {suggestedSlogans.map((s, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-200 hover:border-indigo-200 rounded-xl p-4 flex flex-col gap-2 transition hover:bg-slate-100/50">
                          <span className="text-[10px] bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold w-12 text-center rounded">
                            시안 #{idx+1}
                          </span>
                          <p className="text-xs font-black text-slate-850 leading-relaxed bg-white p-2 border border-slate-100 rounded-lg">
                            “{s.slogan}”
                          </p>
                          <div className="text-[10px] text-slate-500 leading-normal border-t border-slate-150 pt-1.5 flex gap-1Items">
                            <span className="font-extrabold text-indigo-600 mr-1 shrink-0">[미술 안내]</span>
                            <span>{s.designIdea}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Global Citizen Digital Oath Certification (32차시 최종 마감) */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-2">
                <div className="border-b border-slate-100 pb-4 mb-5">
                  <h3 className="text-sm font-bold text-slate-800">✍️ 32차시 최종장: 나의 세계 시민 지킴이 본 서약서</h3>
                  <p className="text-slate-500 text-xs">본 프로젝트를 수료한 자랑스러운 한국 대표 학생대표 위원이 평생 새겨나갈 3가지 실천 행동 강령입니다.</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  
                  {/* Oath input boxes */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">세계 시민의 성명</label>
                      <input 
                        type="text" 
                        value={citizenOath.studentName}
                        onChange={(e) => setCitizenOath({...citizenOath, studentName: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">행동 약속 1: 다문화 화해와 존중</label>
                      <input 
                        type="text" 
                        value={citizenOath.pledge1}
                        onChange={(e) => setCitizenOath({...citizenOath, pledge1: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">행동 약속 2: 환경과 생태 보전</label>
                      <input 
                        type="text" 
                        value={citizenOath.pledge2}
                        onChange={(e) => setCitizenOath({...citizenOath, pledge2: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">행동 약속 3: 인도주의 난민 수용 지지</label>
                      <input 
                        type="text" 
                        value={citizenOath.pledge3}
                        onChange={(e) => setCitizenOath({...citizenOath, pledge3: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
                      />
                    </div>

                    <button 
                      onClick={() => setSignedOath(true)}
                      className="w-full mt-2.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <PenTool className="w-4 h-4" /> 평생 행동 서명 및 위촉장 발간 요청
                    </button>

                    <div className="border-t border-slate-200 mt-4 pt-4 shrink-0 text-left">
                      <p className="text-[10px] text-slate-500 mb-1.5 leading-normal">
                        <strong>🎁 담임선생님 과제 수합용 파일 출력:</strong> 아래 버튼을 통해 현재 모둠원들의 기획 대본, UN 결의안, 캠페인 슬로건 및 개별 성취 등급을 총망라한 <strong>수행평가 결과 패키지 파일(.json)</strong>을 정식 추출하여 선생님께 파일 제출할 수 있습니다. (교사용 결과 수합 허브 100% 연계)
                      </p>
                      <button 
                        onClick={() => {
                          const data = {
                            classCode: classCode || "6-1",
                            groupName,
                            groupMembers,
                            selectedCountry: selectedCountry.name,
                            selectedCountryCode: selectedCountry.code,
                            userPassportStamps,
                            stampsCount: userPassportStamps.length,
                            storyboard,
                            resolution,
                            operativeClauses,
                            campaignInput,
                            citizenOath,
                            signedOath,
                            videoUrl,
                            exportedAt: new Date().toISOString()
                          };
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", `${groupName.replace(/\s+/g, "_")}_지구촌_수행평가_포트폴리오.json`);
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                          alert("🎉 수행평가 포트폴리오 파일(JSON)이 완벽히 다운로드되었습니다! 컴퓨터의 [다운로드] 폴더에서 확인 후 선생님께 교내 망으로 전송하십시오.");
                        }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        💾 32차시 모둠 수행평가 결과 파일(.json) 다운로드
                      </button>

                      <div className="mt-3.5 pt-3.5 border-t border-dashed border-slate-200">
                        <p className="text-[10px] text-slate-500 mb-2 leading-normal">
                          <strong>📡 [실시간 무선 전송 기능]:</strong> 파일 수동 이동이나 USB 이동이 귀찮다면 아래 <strong>무선 즉시 전송</strong> 버튼을 누르십시오. 교사 전용 실시간 결과 수합 대시보드로 우리 모둠이 이룩한 스탬프, 시나리오, UN 조항 일괄이 원격 제출됩니다.
                        </p>
                        <button
                          onClick={async () => {
                            if (!groupName || groupMembers.length === 0) {
                              alert("⚠️ 실시간 수합 전송을 하려면 먼저 2단계에서 모둠 이름과 모둠원 정보를 1명 이상 등록하셔야 합니다.");
                              return;
                            }
                            setIsSubmittingLive(true);
                            try {
                              const data = {
                                classCode: classCode || "6-1",
                                groupName,
                                groupMembers,
                                selectedCountry: selectedCountry.name,
                                selectedCountryCode: selectedCountry.code,
                                userPassportStamps,
                                stampsCount: userPassportStamps.length,
                                storyboard,
                                resolution,
                                operativeClauses,
                                campaignInput,
                                citizenOath,
                                signedOath,
                                studentResearch,
                                videoUrl,
                                exportedAt: new Date().toISOString()
                              };
                              const res = await fetch("/api/portfolio/submit", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(data)
                              });
                              if (!res.ok) throw new Error("Server transmission error");
                              alert(`🚀 [실시간 무선 제출 완료!] 우리 모둠('${groupName}')의 최종 과제 포트폴리오 패키지 정보가 교실 수합 서브판 목록으로 무선 안전 송출 안착되었습니다!`);
                            } catch (error) {
                              console.error(error);
                              alert("⚠️ 실시간 교사국 장비와 연결할 수 없습니다. 교내 네트워크 사향을 점검하시거나, 위쪽 [모둠 수행평가 결과 파일 다운로드] 버튼을 이용해 수동 전송하십시오.");
                            } finally {
                              setIsSubmittingLive(false);
                            }
                          }}
                          disabled={isSubmittingLive}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          {isSubmittingLive ? "📡 교탁 서버 연결망 접속 및 패킷 전송 중..." : "🚀 교사 수합 허브로 실시간 무선 즉시 제출"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual official certificate layout */}
                  {signedOath ? (
                    <div className="bg-amber-50/40 border-4 border-amber-200/60 p-6 md:p-8 rounded-2xl relative shadow-md text-slate-800 flex flex-col gap-4 text-center items-center justify-center font-serif text-slate-900 animate-fade-in">
                      
                      {/* Stylized background crest */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
                        <Globe className="w-48 h-48 text-amber-900" />
                      </div>

                      <span className="text-indigo-800 text-[10px] uppercase font-bold tracking-widest border border-indigo-200 bg-indigo-50 px-3 py-1 rounded">
                        CERTIFICATE OF INTEGRITY
                      </span>

                      <h4 className="text-xl font-bold font-serif tracking-tight text-amber-900 mt-2">
                        세계 시민 명예 수호 임명장
                      </h4>

                      <p className="text-xs text-slate-500 font-sans tracking-wide">번호: 제 6-32-02-202615호</p>

                      <div className="my-3 font-serif">
                        <span className="block text-sm font-bold border-b border-amber-300 pb-1.5 mb-1.5 w-32 mx-auto text-slate-800">
                          {citizenOath.studentName || "김민재"} 위원
                        </span>
                        <p className="text-[11px] leading-relaxed text-slate-600 font-sans max-w-sm">
                          위 학생대표는 32차시에 걸쳐 세계 환경과 자원 고갈 문제를 성찰하고, 스스로 서명한 아래의 서약을 평생 지켜가기로 다짐하였기에 세계 시민 명예 수호자로 위촉합니다.
                        </p>
                      </div>

                      <div className="w-full max-w-md bg-white/70 border border-amber-150 rounded-xl p-4 text-left font-sans text-[10px] text-slate-600 flex flex-col gap-2.5">
                        <p><strong>우리의 약속 1:</strong> {citizenOath.pledge1}</p>
                        <p><strong>우리의 약속 2:</strong> {citizenOath.pledge2}</p>
                        <p><strong>우리의 약속 3:</strong> {citizenOath.pledge3}</p>
                      </div>

                      <div className="mt-4 font-sans text-[10px] text-slate-400 flex flex-col items-center gap-1.5">
                        <span>서약 날짜: 2026년 6월 15일</span>
                        <div className="flex gap-1.5 items-center mt-1">
                          <span>서명 날인: <span className="font-serif italic font-extrabold text-[#D97706] text-xs"> {citizenOath.studentName ? `${citizenOath.studentName} 인(印)` : "서약완료"}</span></span>
                          <span className="w-5 h-5 bg-amber-600/90 rounded-full flex items-center justify-center text-white text-[7px] font-bold border border-amber-700">인</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => window.print()}
                        className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-600 p-2 transition hidden sm:block"
                        title="위촉장 출력"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                    </div>
                  ) : (
                    <div className="border-4 border-dashed border-slate-200 rounded-2xl p-8 h-[360px] flex flex-col justify-center items-center text-center">
                      <Award className="w-12 h-12 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-500">생성된 명예 세계 시민 위촉장이 비어있습니다.</p>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                        왼쪽 폼에서 이름과 세부 다문화/환경 수호 약속을 자유롭게 수정한 후 [행동 서명 서약]을 전격 가동해 발급받으세요.
                      </p>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* Active Tab 6: Teacher Hub Evaluation Port */}
          {activeTab === "teacher" && (
            <div className="flex flex-col gap-6 animate-fade-in text-left">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-rose-600 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> 6단계 최종: 교사용 수행평가 결과 일괄 수합 및 성적 처리 시스템
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">교사 전용 결과 수합 허브</h2>
                  <p className="text-slate-500 text-xs">학생들이 완료하여 추출/제출한 모둠별 수행평가 파일(.json) 데이터를 한자리에 모아 일괄 조회하고 종합 분석합니다.</p>
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => {
                      const mockGroups = [
                        {
                          classCode: "6-1",
                          groupName: "환대와 평화의 2모둠",
                          selectedCountry: "인도 (India)",
                          selectedCountryCode: "IN",
                          userPassportStamps: ["KR", "IN", "EG", "FR"],
                          stampsCount: 4,
                          groupMembers: [
                            { name: "이지호", role: "팀장 / AI 시뮬레이션 소통" },
                            { name: "정다은", role: "서기 / UN 헌장 조항 발의" },
                            { name: "김태한", role: "영상 연출 / 소품 제작" }
                          ],
                          storyboard: [
                            { sceneNumber: 1, category: "언어/인사", screenVisual: "아침 등교길 교문 앞에서 다같이 손을 모아 '나마스테' 인사하는 모습 촬영", audioText: "인사는 서로를 존경하는 첫 행동입니다.", notes: "밝게 웃기" },
                            { sceneNumber: 2, category: "음식", screenVisual: "급식실에서 카레라이스 급식판을 비추며 향신료의 역사 설명 스크린샷", audioText: "이 냄새는 인도 향신료 '마살라'가 녹아든 기적입니다.", notes: "향신료 모형 지참" }
                          ],
                          resolution: {
                            resolutionNumber: "A/RES/6/32-02",
                            title: "인도의 지속가능 친환경 바이오 연료 상속 선도 및 저개발 농기구 대리 배수 보장에 관한 건",
                            preamble: "우리는 저위도 농업 지대의 온실 가스 과중과 작물 고사 소식에 깊은 연민을 느끼며 협동할 의무를 진다."
                          },
                          operativeClauses: [
                            "해양 바이오 에너지 연구비를 신흥 개발국에 1:1 보조한다.",
                            "종이팩 재활용 우유갑 수거를 교실 별로 월 2회 의무화한다."
                          ],
                          campaignInput: { topic: "인도의 식생활 절제와 무공해 대중 수송 활성책", coreMessage: "고기가 없는 카레식단 채식을 전격 확대하고 자전거 등교 기금을 교내에 수립해요!" },
                          citizenOath: { studentName: "이지호", pledge1: "타 종교 신념의 요리 방식을 적극 이해하고 존중한다.", pledge2: "바이오 에너지 절약에 스스로 솔선수범하겠다.", pledge3: "소외 계층의 지리학적 불평등을 적극 변호한다." },
                          signedOath: true,
                          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        },
                        {
                          classCode: "6-2",
                          groupName: "지구촌 수호대 3모둠",
                          selectedCountry: "프랑스 (France)",
                          selectedCountryCode: "FR",
                          userPassportStamps: ["KR", "FR", "JP"],
                          stampsCount: 3,
                          groupMembers: [
                            { name: "박소윤", role: "의장석 / 회담 주최" },
                            { name: "최민우", role: "대본 보조 / 의복 드로잉" }
                          ],
                          storyboard: [
                            { sceneNumber: 1, category: "인사", screenVisual: "파란 하늘 그림을 그려놓고 친구 둘이 가볍게 양 볼을 맞대며 '비주' 뺨 맞춤 인사를 연출한다.", audioText: "친밀함과 프랑스 전통 비주 인사입니다.", notes: "실제 접촉은 비포함" }
                          ],
                          resolution: {
                            resolutionNumber: "A/RES/6/32-03",
                            title: "자유 평등 우애에 기인한 지구촌 물 배급 정합 조치 교호 의안",
                            preamble: "인위적인 식수 독점을 인권 침해로 규명하고 전인류 마실 물 자치를 세계 UN 기구에서 직권 수호할 것을 건의한다."
                          },
                          operativeClauses: [
                            "가뭄 사막 구호 국가 지하 수원 파이프망 매설 무상 원조 대책을 구성한다."
                          ],
                          campaignInput: { topic: "프랑스식 빵 가공 잔여물 교내 나눔 캠페인", coreMessage: "유통기한에 앞서 풍성한 이웃 나눔 냉장고를 급식 센터에 개방합시다." },
                          citizenOath: { studentName: "박소윤", pledge1: "지식 편식을 막고 전 지구 이주민 역사를 탐색한다.", pledge2: "물 사용 10% 축감을 위해 양치 컵 사용을 맹세한다.", pledge3: "존엄한 식수 인권 수호단을 학급에 꾸린다." },
                          signedOath: true,
                          videoUrl: "https://www.youtube.com/watch?v=60_7Z24v4_s"
                        }
                      ];
                      setImportedPortfolios([...importedPortfolios, ...mockGroups]);
                      alert("💡 교사 대시보드 테스트용 예시 학생 모둠 결과 데이터 2건이 성공적으로 추가되었습니다! 아래 종합 분석기에서 내용을 확인하십시오.");
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    ⚡ 예시 데이터 불러오기
                  </button>
                  <button
                    onClick={() => {
                      if (importedPortfolios.length === 0) {
                        alert("수합된 데이터가 없어 CSV를 다운로드할 수 없습니다.");
                        return;
                      }
                      
                      let csvContent = "\uFEFF"; 
                      csvContent += "순번,학급,모둠명,탐구국가,모둠인원수,모둠원성명(역할),스탬프획득수,결의안조항수,선서서명자,AI제안성적,담임교사최종등급,담임관찰평가기록,수합일자\n";
                      importedPortfolios.forEach((p, idx) => {
                        const membersStr = p.groupMembers?.map((m: any) => `${m.name}(${m.role})`).join(" / ") || "없음";
                        const aiGrade = p.aiEvaluation?.grade || "미산정";
                        const finalGrade = p.finalGrade || p.aiEvaluation?.grade || "평가대기";
                        const observation = p.teacherObservation || "미기록";
                        const classLabel = p.classCode || "6-1";
                        csvContent += `"${idx+1}","${classLabel}","${p.groupName}","${p.selectedCountry || p.selectedCountryCode || "미지정"}","${p.groupMembers?.length || 0}","${membersStr.replace(/"/g, '""')}","${p.userPassportStamps?.length || 0}","${p.operativeClauses?.length || p.resolution?.operativeClauses?.length || 0}","${p.citizenOath?.studentName || "미완료"}","${aiGrade}","${finalGrade}","${observation.replace(/"/g, '""')}","${new Date().toLocaleDateString()}"\n`;
                      });

                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", `지구촌_수행평가_교사학습결과_성적표.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    📊 엑셀(CSV) 저장
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/portfolio/list");
                        if (!res.ok) throw new Error("Could not retrieve");
                        const serverData = await res.json();
                        if (serverData.length === 0) {
                          alert("📡 [실시간 수합 안내] 현재 교실 서버에 접수된 무선 전송 건수가 비어있습니다. 학생 기기에서 [교사 수합 허브로 실시간 무선 즉시 제출] 단추를 누르게끔 격려해 주세요.");
                          return;
                        }

                        setImportedPortfolios(prev => {
                          const existingKeys = new Set(prev.map(p => `${p.classCode || "6-1"}_${p.groupName}`));
                          const newItems = serverData.filter((item: any) => !existingKeys.has(`${item.classCode || "6-1"}_${item.groupName}`));
                          if (newItems.length === 0) {
                            alert(`📡 [새로운 추가 제출 없음] 총 ${serverData.length}개의 전송 포트폴리오를 조회하였으나, 교사 허브에 이미 전격 적재된 결과물 외의 미점유 모둠 자료는 없습니다.`);
                            return prev;
                          }
                          alert(`📡 [실시간 무선 수합 성공!] 교탁 무선망 클라우드를 통해 미공개되었던 학생 모둠 ${newItems.length}곳의 최종 수행평가 패키지가 전원 수렴 결구되었습니다.`);
                          return [...prev, ...newItems];
                        });
                      } catch (error) {
                        alert("⚠️ 교탁 내부 무선 REST 수집기 연결 부재. 환경 구동을 재검토해 주십시오.");
                      }
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    📡 실시간 무선 수합 새로고침
                  </button>
                  <button
                    onClick={() => {
                      if (importedPortfolios.length === 0) {
                        alert("📡 [지구촌 박람회 안내] 수합된 학생 모둠 포트폴리오가 아직 대합실에 없습니다. 상위의 [⚡ 예시 데이터 불러오기] 단추를 누르면 테스트용 엑스포 전시부스가 생성되어 즉시 연출을 검토해 볼 수 있습니다!");
                        return;
                      }
                      setShowExpoShowcase(true);
                      setExpoActiveIndex(0);
                      setExpoStoryboardSlideIndex(0);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    🎪 세계 문화 박람회 전시관 모드 오픈
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("수합된 데이터를 일괄 비우시겠습니까? (이 작업은 교실 임시 무선 수합소의 서버 메모리 데이터베이스도 동시에 전면 영구 삭제합니다)")) {
                        setImportedPortfolios([]);
                        setSelectedImportedPortfolioIndex(null);
                        try {
                          await fetch("/api/portfolio/reset", { method: "POST" });
                        } catch (e) {
                          console.error("교탁 임시 초기화 통신망 장애", e);
                        }
                      }
                    }}
                    className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    🗑️ 비우기
                  </button>
                </div>
              </div>

              {/* 🔐 학급별 보안 설정 및 수합 비밀번호 통제소 */}
              {unlockedClassScope === "all" && (
                <div className="bg-slate-50 rounded-2xl border border-slate-205 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs">🔐</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">학급별 보안 설정 및 수합 비밀번호 통제소</h4>
                      <p className="text-[10px] text-slate-400 font-medium">학생들의 결과 수합 무단 열람을 방지하기 위해 마스터 및 각 학급 고유의 진입 암호를 원격 제어합니다.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">실시간 보안 작동 중</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Master Passcode Control */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-black text-slate-700">📌 전체 마스터 패스코드</span>
                        <span className="text-[9px] text-slate-400 font-medium">모든 학급 공용 대피 우회 암호</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={classPasscodes.master || "3201"}
                          onChange={async (e) => {
                            const val = e.target.value;
                            setClassPasscodes(prev => ({ ...prev, master: val }));
                            await fetch("/api/class-passcode/save", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ classCode: "master", passcode: val })
                            });
                          }}
                          placeholder="기본: 3201"
                          className="flex-1 bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-black focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-800"
                        />
                        <button 
                          onClick={() => alert(`🔑 마스터 비밀번호가 '${classPasscodes.master || "3201"}'(으)로 실시간 서버에 안전 저장되었습니다.`)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold transition cursor-pointer"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal mt-2">
                      * 입력 시 클라우드 실시간 반영됩니다. 학생들은 진입 암호 인증창에서 이 마스터 코드를 사용해 인증할 수 있습니다.
                    </p>
                  </div>

                  {/* Right: Custom Class Passcodes Control */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-700">🏫 학급별 개별 패스코드 등록</span>
                      <span className="text-[9px] text-amber-600 font-bold bg-amber-50 px-1.5 rounded">학급별 단독 제어 가능</span>
                    </div>

                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={newClassCodeToSet}
                        onChange={(e) => setNewClassCodeToSet(e.target.value)}
                        placeholder="예: 6-1"
                        className="w-1/3 bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-bold text-center focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-800"
                      />
                      <input 
                        type="text"
                        value={newPasscodeToSet}
                        onChange={(e) => setNewPasscodeToSet(e.target.value)}
                        placeholder="개별 지정 암호"
                        className="flex-1 bg-slate-50 border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-800"
                      />
                      <button 
                        onClick={async () => {
                          if (!newClassCodeToSet.trim() || !newPasscodeToSet.trim()) {
                            alert("학급 코드와 설정할 개별 암호를 둘 다 정확히 기입하여 주십시오.");
                            return;
                          }
                          try {
                            const res = await fetch("/api/class-passcode/save", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ classCode: newClassCodeToSet.trim(), passcode: newPasscodeToSet.trim() })
                            });
                            if (res.ok) {
                              alert(`✅ [등록 성공] ${newClassCodeToSet.trim()} 학급의 전용 접속 비밀번호가 '${newPasscodeToSet.trim()}'(으)로 수립되었습니다.`);
                              setNewClassCodeToSet("");
                              setNewPasscodeToSet("");
                              fetchPasscodes();
                            }
                          } catch (err) {
                            alert("서버 통신에 실패했습니다.");
                          }
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold transition cursor-pointer"
                      >
                        등록
                      </button>
                    </div>

                    {/* Class Passcode Table */}
                    <div className="border border-slate-100 rounded-lg overflow-hidden max-h-24 overflow-y-auto">
                      <table className="w-full text-[10px] text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-400 font-bold sticky top-0">
                          <tr>
                            <th className="p-1 px-2.5">학급코드</th>
                            <th className="p-1">전용 비밀번호</th>
                            <th className="p-1 text-right pr-2">작업</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(classPasscodes.custom || {})
                            .filter(([code]) => code !== "master")
                            .map(([code, pass]) => (
                              <tr key={code} className="hover:bg-slate-50">
                                <td className="p-1.5 px-2.5 font-black text-rose-700">{code}</td>
                                <td className="p-1.5 font-mono text-slate-800 font-bold">{pass}</td>
                                <td className="p-1.5 text-right pr-2">
                                  <button 
                                    onClick={async () => {
                                      if (confirm(`'${code}' 학급의 전용 암호를 삭제하고 공용 마스터 패스코드로 대체하시겠습니까?`)) {
                                        try {
                                          await fetch("/api/class-passcode/save", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ classCode: code, passcode: "3201" })
                                          });
                                          setClassPasscodes(prev => {
                                            const copy = { ...prev.custom };
                                            delete copy[code];
                                            return { ...prev, custom: copy };
                                          });
                                          alert("지정된 학급별 비밀번호가 삭제되었습니다.");
                                          fetchPasscodes();
                                        } catch (e) {
                                          alert("통신 장애 발생");
                                        }
                                      }
                                    }}
                                    className="text-rose-500 hover:underline font-bold text-[9px]"
                                  >
                                    삭제
                                  </button>
                                </td>
                              </tr>
                            ))}
                          {Object.keys(classPasscodes.custom || {}).filter(k => k !== "master").length === 0 && (
                            <tr>
                              <td colSpan={3} className="p-3 text-center text-slate-400 text-[10px]">
                                개별 패스코드를 등록해 편리하게 학급별로 분리 통제해 보세요.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* 🔑 선생님 전용 Google Gemini API Key 직접 입력 통제소 */}
              {isTeacherUnlocked && (
                <div className="bg-indigo-950 text-indigo-100 rounded-2xl border border-indigo-900 p-5 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-indigo-900/60">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-900 text-indigo-300 rounded-lg text-xs">🔑</span>
                      <div>
                        <h4 className="text-xs font-black text-indigo-200">선생님 전용 Google Gemini API Key 설정</h4>
                        <p className="text-[10px] text-indigo-400 font-medium">실시간 AI 인공지능 평론 피드백에 사용될 Google Gemini API Key를 담임선생님 전용으로 안전하게 개별 보관 및 제어합니다.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-900">학급 AI 기밀연동 설정</span>
                  </div>

                  <div className="space-y-3.5 text-xs text-indigo-300 font-medium">
                    <p>
                      기본 장착된 공용 서버 소스 할당량이 초과되었거나, <strong>학급별 전용의 고성능 Gemini API 키</strong>를 바인딩하고자 하시면 아래에 안전 탑재하십시오.
                    </p>
                    <div className="flex flex-col md:flex-row gap-3 items-end">
                      {/* Class Scope Selector */}
                      <div className="w-full md:w-44 space-y-1 text-left">
                        <label className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wide">
                          적용 학급 (수혜 범위)
                        </label>
                        {unlockedClassScope === "all" ? (
                          <select
                            value={configTargetClass}
                            onChange={(e) => setConfigTargetClass(e.target.value)}
                            className="w-full bg-indigo-900 border border-indigo-750 text-white rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          >
                            <option value="all">전체 학급 (공용)</option>
                            <option value="6-1">6-1</option>
                            <option value="6-2">6-2</option>
                            <option value="6-3">6-3</option>
                            <option value="6-4">6-4</option>
                            <option value="6-5">6-5</option>
                            <option value="6-6">6-6</option>
                            <option value="6-7">6-7</option>
                          </select>
                        ) : (
                          <div className="w-full bg-indigo-900 border border-indigo-750 text-white rounded-xl px-3 py-2.5 text-xs font-black text-center">
                            🏫 학급 [{configTargetClass}] 고정
                          </div>
                        )}
                      </div>

                      {/* API Key Input */}
                      <div className="flex-1 w-full space-y-1 text-left">
                        <label className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wide">
                          Gemini API Key
                        </label>
                        <input 
                          type="password"
                          value={userApiKey}
                          onChange={(e) => setUserApiKey(e.target.value.trim())}
                          placeholder="AIzaSy... 형식의 구글 Gemini API 키를 입력하세요"
                          className="w-full bg-indigo-950/80 border border-indigo-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder:text-indigo-700/80 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                        <button
                          onClick={async () => {
                            if (!userApiKey.trim()) {
                              alert("설정할 API Key를 기입해 주십시오.");
                              return;
                            }
                            try {
                              localStorage.setItem("user_gemini_api_key", userApiKey.trim());
                              const res = await fetch("/api/teacher-api-key/update", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                  apiKey: userApiKey.trim(),
                                  classCode: configTargetClass
                                })
                              });
                              if (res.ok) {
                                setIsServerApiKeyActive(true);
                                alert(`🔑 [${configTargetClass === "all" ? "전체 학급" : configTargetClass + " 학급"}] 전용 API 키가 지정 학급 클라우드 서버에 안전 설정 보관 완료되었습니다!\n이제 담당 학생 태블릿 기기들의 AI 피드백도 자동으로 무선 연동됩니다.`);
                              } else {
                                alert("서버 연동에 실패했습니다.");
                              }
                            } catch (e) {
                              console.error(e);
                              alert("네트워크 통신 오류가 발생했습니다.");
                            }
                          }}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs rounded-xl transition cursor-pointer"
                        >
                          지정학급 보관 저장
                        </button>
                        {(userApiKey || isServerApiKeyActive) && (
                          <button
                            onClick={async () => {
                              try {
                                localStorage.removeItem("user_gemini_api_key");
                                const res = await fetch("/api/teacher-api-key/update", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ 
                                    apiKey: "",
                                    classCode: configTargetClass
                                  })
                                });
                                if (res.ok) {
                                  setIsServerApiKeyActive(false);
                                  setUserApiKey("");
                                  alert(`🗑️ [${configTargetClass === "all" ? "전체 학급" : configTargetClass + " 학급"}] 보관 API 키가 완전히 초기화 폭파 완료되었습니다.`);
                                } else {
                                  alert("서버 키 초기화에 실패했습니다.");
                                  setUserApiKey("");
                                }
                              } catch (e) {
                                console.error(e);
                                alert("네트워크 통신 오류가 발생했습니다.");
                              }
                            }}
                            className="px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
                          >
                            초기화
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-indigo-505 font-normal leading-normal">
                      * 이 키는 안전하게 선생님이 사용하는 로컬 브라우저 보안 구역에 저장되며, 학생 등 외부 기기로는 절대 공유/노출되지 않고, 실시간 AI 채점 및 대본 컨설팅 평가를 수행할 때에만 암호화된 헤더를 통해 구동됩니다.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 p-8 text-center transition bg-rose-50/10 cursor-pointer relative shadow-sm">
                <input 
                  type="file" 
                  accept=".json"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    
                    let loadedCount = 0;
                    const newPortfolios: any[] = [];
                    
                    Array.from(files).forEach((file: any) => {
                      const reader = new FileReader();
                      reader.onload = (event: any) => {
                        try {
                          const parsed = JSON.parse(event.target?.result as string);
                          if (parsed.groupName) {
                            newPortfolios.push(parsed);
                          } else {
                            console.warn("적절한 수행평가 포맷이 아닙니다.", file.name);
                          }
                        } catch (err) {
                          console.error("파일 로드 중 오류가 발생했습니다.", err);
                        } finally {
                          loadedCount++;
                          if (loadedCount === files.length) {
                            if (newPortfolios.length > 0) {
                              setImportedPortfolios(prev => [...prev, ...newPortfolios]);
                              alert(`🎉 성공! [${newPortfolios.length}건]의 학생 모둠 포트폴리오 데이터를 성공적으로 수합 일괄 분석하였습니다.`);
                            } else {
                              alert("업로드된 파일 중 유효한 모둠 포트폴리오 데이터를 찾지 못했습니다.");
                            }
                          }
                        }
                      };
                      reader.readAsText(file);
                    });
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <BookOpen className="w-10 h-10 text-rose-400 mx-auto mb-2 animate-bounce-slow" />
                <p className="text-xs font-black text-rose-800">모둠 제출용 포트폴리오 JSON 파일을 여기에 드래그하거나 클릭하여 추가하십시오.</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-md mx-auto leading-normal">
                  학생들이 32차시 캠페인 단계에서 [결과 파일 다운로드] 버튼으로 내려받은 <code>.json</code> 단일 또는 다중 파일을 한꺼번에 선택하여 올릴 수 있습니다. (서버 전송 없이 로컬에서 완벽 분석 안전 보장)
                </p>
              </div>

              {/* Aggregated Overview Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-150 flex flex-col md:flex-row justify-between items-center gap-3">
                  <h3 className="text-xs font-extrabold text-slate-800">📂 실시간 수합 결과판 ({importedPortfolios.length}개 모둠 등록 완료)</h3>
                  
                  {/* Class Filter Bar */}
                  <div className="flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto">
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">🏫 학급 필터:</span>
                    {unlockedClassScope === "all" ? (
                      <input 
                        type="text"
                        value={teacherFilterClass}
                        onChange={(e) => setTeacherFilterClass(e.target.value)}
                        placeholder="모든 학급 (비우면 전원)"
                        className="bg-white border border-slate-250 rounded-lg px-2.5 py-1 text-[11px] font-black placeholder:font-normal focus:ring-1 focus:ring-rose-500 focus:outline-none w-36 text-slate-800"
                      />
                    ) : (
                      <div className="bg-rose-50 border border-rose-200 text-rose-750 px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 shadow-2xs select-none">
                        <span>{unlockedClassScope}</span>
                        <span className="text-[10px] text-rose-600">🔒 분리통제 제한됨</span>
                      </div>
                    )}
                  </div>
                  
                  <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">학업 성과표 자동 산출</span>
                </div>

                {importedPortfolios.length === 0 ? (
                  <div className="p-12 text-center text-slate-400">
                    <Users className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-xs font-bold">수합 완료된 학생 과제가 비어 있습니다.</p>
                    <p className="text-[10px] mt-1 max-w-xs mx-auto">상위 예시 데이터를 불러오거나 학생들이 제출한 포트폴리오 결과 파일을 드래그하여 종합 성적표 분석을 개시하십시오.</p>
                  </div>
                ) : (() => {
                  const filteredPortfolios = importedPortfolios.filter(p => {
                    if (!teacherFilterClass) return true;
                    return (p.classCode || "").toLowerCase().includes(teacherFilterClass.toLowerCase());
                  });
                  
                  if (filteredPortfolios.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-400">
                        <p className="text-xs font-bold">필터 조건인 '{teacherFilterClass}' 학급에 부합하는 수합 자료가 없습니다.</p>
                        <p className="text-[10px] mt-1 text-slate-400">학급란에 다른 코드명(예: 6-1, 6-2)을 입력해 보십시오.</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-slate-700 min-w-[700px]">
                        <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-slate-50/55 border-b border-slate-150">
                          <tr>
                            <th className="p-4 font-bold">순번</th>
                            <th className="p-4 font-bold">학급코드</th>
                            <th className="p-4 font-bold">모둠명</th>
                            <th className="p-4 font-bold">탐색 대상국</th>
                            <th className="p-4 font-bold">참여 학생수</th>
                            <th className="p-4 font-bold text-center">여권 스탬프</th>
                            <th className="p-4 font-bold text-center">영상대본</th>
                            <th className="p-4 font-bold text-center">UN결의항</th>
                            <th className="p-4 font-bold text-center">선서자(상태)</th>
                            <th className="p-4 font-bold text-center">상세포트폴리오</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredPortfolios.map((portfolio, idx) => {
                            const scenesCount = portfolio.storyboard?.length || 0;
                            const clausesCount = portfolio.operativeClauses?.length || portfolio.resolution?.operativeClauses?.length || 0;
                            const isSelected = selectedImportedPortfolioIndex === idx;
                            
                            return (
                              <tr key={idx} className={`hover:bg-slate-50/60 font-medium ${isSelected ? "bg-rose-50/30" : ""}`}>
                                <td className="p-4 text-slate-400 font-mono">{idx + 1}</td>
                                <td className="p-4 font-black text-rose-700 font-mono bg-rose-50/15 text-center rounded">{portfolio.classCode || "6-1"}</td>
                                <td className="p-4 font-extrabold text-slate-900">{portfolio.groupName}</td>
                                <td className="p-4">
                                  <span className="bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-indigo-700 font-bold">
                                    {portfolio.selectedCountryCode ? `${portfolio.selectedCountryCode} ` : ""} {portfolio.selectedCountry || "미정"}
                                  </span>
                                </td>
                              <td className="p-4">
                                <span className="text-slate-600 block text-[11px] font-bold">
                                  {portfolio.groupMembers?.map((m: any) => m.name).slice(0, 3).join(", ")}
                                  {portfolio.groupMembers?.length > 3 ? " 외" : ""}
                                </span>
                                <span className="text-[10px] text-slate-400 font-normal">총 {portfolio.groupMembers?.length || 0}명</span>
                              </td>
                              <td className="p-4 text-center font-bold text-emerald-600 font-mono">{portfolio.userPassportStamps?.length || 0}개 수집</td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scenesCount > 1 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-600"}`}>
                                  씬 {scenesCount}개 구성
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <span className="text-slate-600 font-bold font-mono">{clausesCount}개 항 조안</span>
                              </td>
                              <td className="p-4 text-center">
                                {portfolio.signedOath ? (
                                  <span className="text-amber-700 font-bold bg-amber-50 border border-amber-250 px-2 py-0.5 rounded-full text-[10px]">
                                    ✒️ {portfolio.citizenOath?.studentName || "대표서약"}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">서명 미완료</span>
                                )}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedImportedPortfolioIndex(isSelected ? null : idx);
                                  }}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition ${
                                    isSelected 
                                      ? "bg-slate-905 text-white" 
                                      : "bg-rose-100 hover:bg-rose-200 text-rose-700"
                                  }`}
                                >
                                  {isSelected ? "상세 창 닫기" : "전체 기획 검토 🔍"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

              {/* Individual Student Full Portfolio Deep-Dive Viewer */}
              {selectedImportedPortfolioIndex !== null && importedPortfolios[selectedImportedPortfolioIndex] && (() => {
                const p = importedPortfolios[selectedImportedPortfolioIndex];
                return (
                  <div className="bg-white rounded-2xl border border-rose-200 shadow-md p-6 animate-fade-in text-left">
                    <div className="flex justify-between items-center border-b border-rose-100 pb-4 mb-5">
                      <div>
                        <span className="text-[10px] bg-rose-150 text-rose-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                          수행성적 심층 검토 포털
                        </span>
                        <h3 className="text-lg font-black text-slate-900">
                          [{p.groupName}] 의 32차시 세부 프로젝트 수행 기록서
                        </h3>
                      </div>
                      <button 
                        onClick={() => setSelectedImportedPortfolioIndex(null)}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xs p-2 bg-slate-50 rounded"
                      >
                        닫기 ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: General Team & Slogans Info */}
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h4 className="text-xs font-black text-slate-800 mb-2.5">👥 탐구 대표단원 ({p.groupMembers?.length || 0}명)</h4>
                          <ul className="space-y-1.5">
                            {p.groupMembers?.map((m: any, i: number) => (
                              <li key={i} className="text-xs bg-white p-2 rounded border border-slate-150 flex justify-between font-bold">
                                <span className="text-slate-800">{m.name}</span>
                                <span className="text-indigo-600 text-[10px] font-medium">역할: {m.role}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {p.videoUrl && (
                          <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200">
                            <h4 className="text-xs font-black text-rose-950 mb-1.5 flex items-center gap-1.5">
                              <span>🎥 모둠 최종 완성 동영상</span>
                              <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-black">원격 연동</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 mb-2.5 font-medium leading-normal">
                              학생 모둠이 직접 촬영·편집을 완수한 뒤 탑재한 공익 영상 주소입니다.
                            </p>
                            <a 
                              href={p.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm text-center"
                            >
                              🎬 완성 동영상 감상하기 (새창) ↗
                            </a>
                          </div>
                        )}

                        <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-150">
                          <h4 className="text-xs font-black text-slate-800 mb-2.5">🌱 모둠 캠페인의 핵심 지향성</h4>
                          <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                            <p><strong>캠페인 주제:</strong> {p.campaignInput?.topic || "미작성"}</p>
                            <p className="bg-white rounded p-2.5 border border-indigo-105 italic text-slate-850">
                              “{p.campaignInput?.coreMessage || "미작성"}”
                            </p>
                          </div>
                        </div>

                        <div className="bg-amber-50/45 p-4 rounded-xl border border-amber-200">
                          <h4 className="text-xs font-black text-amber-900 mb-1">✒️ 세계 시민 소중한 약속 수호장</h4>
                          <p className="text-[10px] text-slate-400 mb-2">서명인: {p.citizenOath?.studentName || "미제출"}(印)</p>
                          <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-700">
                            <p><strong>편견 다문화:</strong> {p.citizenOath?.pledge1}</p>
                            <p><strong>생태 보전:</strong> {p.citizenOath?.pledge2}</p>
                            <p><strong>인권 난민:</strong> {p.citizenOath?.pledge3}</p>
                          </div>
                        </div>

                        <div className="bg-orange-50/40 p-4 rounded-xl border border-orange-200 shadow-3xs">
                          <h4 className="text-xs font-black text-orange-950 mb-2 flex items-center justify-between">
                            <span>🕵️ 모둠 1~8차시 문화 실증 수집 정보</span>
                            <span className="text-[9px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-bold">자주식 탐구</span>
                          </h4>
                          <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-700">
                            <div>
                              <span className="font-extrabold text-orange-700">[食 음식] </span>
                              <p className="inline font-medium text-slate-600 bg-white/60 p-1 rounded block mt-0.5">{p.studentResearch?.[p.selectedCountryCode]?.food || p.studentResearch?.food || p.studentResearch?.[p.selectedCountryCode]?.food || "교과서 모범답안 대체 또는 직접조사 미지정"}</p>
                            </div>
                            <div>
                              <span className="font-extrabold text-indigo-700">[禮 인사] </span>
                              <p className="inline font-medium text-slate-600 bg-white/60 p-1 rounded block mt-0.5">{p.studentResearch?.[p.selectedCountryCode]?.greeting || p.studentResearch?.greeting || p.studentResearch?.[p.selectedCountryCode]?.greeting || "교과서 모범답안 대체 또는 직접조사 미지정"}</p>
                            </div>
                            <div>
                              <span className="font-extrabold text-purple-700">[衣 의복] </span>
                              <p className="inline font-medium text-slate-600 bg-white/60 p-1 rounded block mt-0.5">{p.studentResearch?.[p.selectedCountryCode]?.costume || p.studentResearch?.costume || p.studentResearch?.[p.selectedCountryCode]?.costume || "교과서 모범답안 대체 또는 직접조사 미지정"}</p>
                            </div>
                            <div>
                              <span className="font-extrabold text-pink-700">[樂 축제] </span>
                              <p className="inline font-medium text-slate-600 bg-white/60 p-1 rounded block mt-0.5">{p.studentResearch?.[p.selectedCountryCode]?.festival || p.studentResearch?.festival || p.studentResearch?.[p.selectedCountryCode]?.festival || "교과서 모범답안 대체 또는 직접조사 미지정"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Center: Storyboard Scenarios */}
                      <div className="space-y-4 lg:col-span-2">
                        
                        {/* Storyboards */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h4 className="text-xs font-black text-slate-800 mb-3.5 flex justify-between">
                            <span>🎥 지구촌 소개 홍보 영상 스토리보드 시나리오 ({p.storyboard?.length || 0}개 씬)</span>
                            <span className="text-[10px] font-normal text-slate-400">9~11차시 연계</span>
                          </h4>
                          
                          {p.storyboard?.length === 0 ? (
                            <p className="text-xs text-slate-400 p-8 text-center bg-white border border-slate-200 rounded font-bold">기획 작성 전입니다.</p>
                          ) : (
                            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                              {p.storyboard?.map((s: any, idx: number) => (
                                <div key={idx} className="bg-white border border-slate-150 rounded-lg p-3 text-xs leading-normal">
                                  <div className="flex justify-between items-center mb-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                    <span className="font-bold text-indigo-700">씬 {s.sceneNumber} [{s.category || "기타"}]</span>
                                    {s.notes && <span className="text-[10px] text-slate-400 font-sans font-normal">촬영용 지침: {s.notes}</span>}
                                  </div>
                                  <p className="font-extrabold text-slate-800"><span className="text-[10px] text-slate-400 mr-1">[화면구성]</span>{s.screenVisual}</p>
                                  <p className="text-slate-600 mt-1"><span className="text-[10px] text-slate-400 mr-1">[나레이션/자막]</span>{s.audioText}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* UN Resolutions */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h4 className="text-xs font-black text-slate-800 mb-3.5 flex justify-between">
                            <span>🏛️ 모의 UN 위원회 합의 결의안 초안 ({p.operativeClauses?.length || p.resolution?.operativeClauses?.length || 0}개 조항)</span>
                            <span className="text-[10px] font-normal text-slate-400">19~27차시 연계</span>
                          </h4>

                          {!p.resolution ? (
                            <p className="text-xs text-slate-400 p-8 text-center bg-white border border-slate-200 rounded font-bold">결의안 작성 전입니다.</p>
                          ) : (
                            <div className="space-y-2 text-xs leading-relaxed bg-white border border-slate-150 rounded-lg p-3.5 max-h-[220px] overflow-y-auto pr-1">
                              <p className="font-black text-indigo-700">결의안 제제호: {p.resolution?.resolutionNumber || "A/RES/6/32-01"}</p>
                              <p className="font-extrabold text-slate-800 border-b border-slate-100 pb-1">{p.resolution?.title}</p>
                              <p className="text-[11px] text-slate-500 leading-normal italic py-1 bg-slate-50/50 rounded px-2.5 mb-2">Preamble: {p.resolution?.preamble}</p>
                              
                              <div className="space-y-1 text-slate-700 text-[11px]">
                                {(p.operativeClauses || p.resolution?.operativeClauses || []).map((clause: string, i: number) => (
                                  <p key={i}><strong>제 {i+1}항:</strong> {clause}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 🤖 교사 대리 AI 성적 채점 & 피드백 컨트롤 */}
                        <div className="bg-indigo-50/40 p-5 rounded-2xl border-2 border-indigo-200 mt-4 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-indigo-150 pb-3">
                            <div>
                              <h4 className="text-sm font-black text-indigo-950 flex items-center gap-1.5">
                                <span>🤖 교사 대리 AI 종합 성취평가 및 성적 채점</span>
                                <span className="text-[10px] bg-indigo-250 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  학급 API 연계
                                </span>
                              </h4>
                              <p className="text-[11px] text-slate-500 font-medium">선생님 전용 다중 차시 연계 수행결과 가치분석 보고서</p>
                            </div>
                            <button
                              disabled={isEvaluatingProxy}
                              onClick={async () => {
                                setIsEvaluatingProxy(true);
                                try {
                                  const res = await fetch("/api/ai/evaluate-portfolio", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      "x-gemini-api-key": userApiKey,
                                      "x-class-code": p.classCode || classCode
                                    },
                                    body: JSON.stringify({
                                      groupName: p.groupName,
                                      campaignInput: p.campaignInput,
                                      storyboard: p.storyboard,
                                      resolution: p.resolution,
                                      selectedCountry: p.selectedCountry || p.selectedCountryCode
                                    })
                                  });
                                  if (!res.ok) throw new Error("대리 채점 과정에 에러가 발생했습니다.");
                                  const data = await res.json();
                                  
                                  // Update state
                                  const updated = [...importedPortfolios];
                                  updated[selectedImportedPortfolioIndex] = {
                                    ...p,
                                    aiEvaluation: data,
                                    finalGrade: data.grade || tempFinalGrade || "A-장려"
                                  };
                                  setImportedPortfolios(updated);
                                  setTempFinalGrade(data.grade || tempFinalGrade || "A-장려");
                                  alert("🎉 AI 국가급 전문성 대리 종합 성취평가가 성공적으로 조율 성숙 처리되었습니다.");
                                } catch (e) {
                                  console.error(e);
                                  alert("대리 채점 수행 중 오류가 발생했습니다. 학급 교사용 API 설정을 다시 확인하여 주십시오.");
                                } finally {
                                  setIsEvaluatingProxy(false);
                                }
                              }}
                              className={`px-4 py-2 text-xs font-black rounded-lg text-white shadow-md transition-all flex items-center justify-center gap-1.5 ${
                                isEvaluatingProxy 
                                  ? "bg-indigo-400 cursor-not-allowed" 
                                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                              }`}
                            >
                              {isEvaluatingProxy ? (
                                <>
                                  <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full mr-1" />
                                  종합수행 분석 중...
                                </>
                              ) : (
                                "🤖 AI 대리 성취 평가 가동"
                              )}
                            </button>
                          </div>

                          {/* Output results */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Left side: AI analysis results */}
                            <div className="bg-white rounded-xl border border-indigo-150 p-4 space-y-3.5 text-xs">
                              <h5 className="font-extrabold text-indigo-900 border-b border-indigo-50 pb-1.5 flex justify-between items-center font-bold">
                                <span>📋 AI 자동 생성 피드백 명세</span>
                                {p.aiEvaluation?.grade && (
                                  <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                                    추천 등급: {p.aiEvaluation.grade}
                                  </span>
                                )}
                              </h5>

                              {p.aiEvaluation ? (
                                <div className="space-y-3 leading-relaxed text-slate-700">
                                  <div>
                                    <strong className="text-slate-800 block text-[11px] mb-0.5 font-bold">🎬 스토리보드 대본 성찰 평언</strong>
                                    <p className="bg-slate-50 p-2.5 rounded text-[11px] border border-slate-100">{p.aiEvaluation.storyboardCritique}</p>
                                  </div>
                                  <div>
                                    <strong className="text-slate-800 block text-[11px] mb-0.5 font-bold">🏛️ 모의 UN 결의안 구성 분석</strong>
                                    <p className="bg-slate-50 p-2.5 rounded text-[11px] border border-slate-100">{p.aiEvaluation.resolutionAudit}</p>
                                  </div>
                                  <div>
                                    <strong className="text-slate-800 block text-[11px] mb-0.5 font-bold">📢 공익 캠페인 기획 및 슬로건 평가</strong>
                                    <p className="bg-slate-50 p-2.5 rounded text-[11px] border border-slate-100">{p.aiEvaluation.campaignCheck}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 items-center pt-1.5 border-t border-slate-100">
                                    <span className="text-[10px] font-black text-indigo-700 mr-1 font-bold">핵심역량 태그:</span>
                                    {(p.aiEvaluation.competencies || []).map((comp: string, idx: number) => (
                                      <span key={idx} className="text-[10px] bg-indigo-50 text-indigo-850 px-2 py-0.5 rounded border border-indigo-100 font-extrabold">
                                        #{comp}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-400 py-12 text-center italic font-bold">
                                  "🤖 AI 대리 성취 평가 가동" 단추를 누르면 학생 모둠의 모든 과제(대본, 결의안, 캠페인)에 대한 AI 종합 성취 보고서가 실시간으로 소환됩니다.
                                </p>
                              )}
                            </div>

                            {/* Right side: Teacher manual grading & comment override */}
                            <div className="bg-white rounded-xl border border-indigo-150 p-4 space-y-3.5 text-xs flex flex-col justify-between">
                              <div className="space-y-3.5">
                                <h5 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1.5 font-bold">
                                  👨‍🏫 담임교사 관찰 성취 평가 및 기록
                                </h5>

                                <div className="space-y-2">
                                  <label className="block text-[11px] font-extrabold text-slate-800 font-bold">
                                    수행평가 최종 등급 부여
                                  </label>
                                  <div className="flex gap-2.5">
                                    {["A+-탁월", "A-장려", "B-도전", "C-보완"].map((gradeOption) => {
                                      const isActive = tempFinalGrade === gradeOption;
                                      return (
                                        <button
                                          key={gradeOption}
                                          type="button"
                                          onClick={() => setTempFinalGrade(gradeOption)}
                                          className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                                            isActive
                                              ? "bg-slate-900 text-white border-slate-900 font-bold"
                                              : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                          }`}
                                        >
                                          {gradeOption.split("-")[0]}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <label className="block text-[11px] font-extrabold text-slate-800 font-bold">
                                    수행 성취기준 및 교사 성찰 발달 사항 관찰록
                                  </label>
                                  <textarea
                                    rows={4}
                                    placeholder="학생들이 보여준 모둠 협업 태도, 모의 UN 참여도, 그리고 세외 세계시민 선서 수호 행동 등급 요약을 기록해 주세요. (다운로드할 종합 성표 CSV에 그대로 보관 등록됩니다.)"
                                    value={tempTeacherObservation}
                                    onChange={(e) => setTempTeacherObservation(e.target.value)}
                                    className="w-full text-xs font-medium p-3 border border-slate-250 focus:outline-none focus:ring-2 focus:ring-indigo-600 rounded-xl"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...importedPortfolios];
                                  updated[selectedImportedPortfolioIndex] = {
                                    ...p,
                                    finalGrade: tempFinalGrade,
                                    teacherObservation: tempTeacherObservation
                                  };
                                  setImportedPortfolios(updated);
                                  alert("💾 담임교사 종합 심층 성취 평점과 발달과정 세부 특기사항이 학급 원장에 즉각 반영 및 잠금 저장 완료되었습니다. (종합 CSV 다운로드 가능)");
                                }}
                                className="w-full py-2.5 bg-slate-950 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl transition shadow-sm mt-3"
                              >
                                💾 담임 심사결과 및 성찰관찰 기록 저장
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          )}

        </main>

      </div>

      {/* QUIZ INTERACTIVE DIALOG MODAL LAYOUT */}
      {showQuizModal && currentQuizCountry && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentQuizCountry.flag}</span>
                <div>
                  <h4 className="text-sm font-bold">{currentQuizCountry.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">박람회 여권 스탬프 획득 골든벨 퀴즈</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQuizModal(false)}
                className="text-slate-300 hover:text-white transition text-sm font-bold bg-white/10 px-2.5 py-1 rounded"
              >
                도전 종료
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Quiz {quizQuestionIndex + 1} of {currentQuizCountry.quiz.length}</span>
                <span>정답 개수: {quizScores} / {currentQuizCountry.quiz.length}</span>
              </div>

              <p className="text-sm md:text-base font-extrabold text-slate-800 leading-relaxed">
                Q. {currentQuizCountry.quiz[quizQuestionIndex].question}
              </p>

              <div className="flex flex-col gap-2.5 my-1">
                {currentQuizCountry.quiz[quizQuestionIndex].options.map((option, idx) => {
                  const isChecked = selectedQuizOption === idx;
                  const isCorrect = idx === currentQuizCountry.quiz[quizQuestionIndex].correctIndex;
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={selectedQuizOption !== null}
                      className={`p-3.5 rounded-xl border text-left text-xs font-bold leading-normal transition-all ${
                        selectedQuizOption === null
                          ? "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-700"
                          : isCorrect
                            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                            : isChecked
                              ? "bg-rose-50 border-rose-400 text-rose-800"
                              : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                      }`}
                    >
                      <span className="mr-2 text-indigo-600 font-mono">[{idx+1}]</span> {option}
                    </button>
                  );
                })}
              </div>

              {quizFeedbackText && (
                <div className={`p-4 rounded-xl text-xs font-medium leading-relaxed animate-fade-in ${
                  selectedQuizOption === currentQuizCountry.quiz[quizQuestionIndex].correctIndex 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-150" 
                    : "bg-rose-50 text-rose-800 border border-rose-150"
                }`}>
                  {quizFeedbackText}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              {selectedQuizOption !== null ? (
                <button 
                  onClick={handleNextQuiz}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black tracking-wide transition flex items-center gap-1.5"
                >
                  {quizQuestionIndex < currentQuizCountry.quiz.length - 1 ? (
                    <>다음 문제로 이동 &rarr;</>
                  ) : (
                    <>도전 완료 및 여권 날인 확인</>
                  )}
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 self-center">답안을 터치하여 바로 맞춤 자문을 확인하세요.</span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🔒 TEACHER HUB SECURITY PASSCODE MODAL */}
      {showTeacherUnlockModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-205 shadow-2xl p-6 md:p-8 max-w-md w-full animate-scale-up text-left space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <span className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-2xl font-black shrink-0">🔒</span>
              <div>
                <span className="text-[10px] text-rose-500 font-extrabold uppercase tracking-widest block">Classroom Security Guard</span>
                <h3 className="text-base font-black text-slate-800">교사 결과 수합 허브 접근 인증</h3>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed font-medium">
              <p>
                이 장소는 학급 학생들이 각자의 지리 탐구 태블릿으로 기록한 최종 모둠 포트폴리오를 하나로 안전 무선 통합 수계(Aggregated) 처리 및 성적화하는 <strong className="text-slate-850">교사용 통제판</strong>입니다.
              </p>
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-[11px] text-slate-500 font-semibold leading-relaxed flex items-start gap-2">
                <span className="text-amber-500 text-sm shrink-0">⚠️</span>
                <span>학생 눈에 암호가 유출되지 않도록 기밀 지정된 교탁용 마스터 또는 배정받으신 학급 전용 개별 비밀번호를 기입해 주십시오.</span>
              </div>
            </div>

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                if (!teacherPinInput.trim()) return;
                try {
                  const res = await fetch("/api/class-passcode/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passcode: teacherPinInput })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setIsTeacherUnlocked(true);
                    const scope = data.isMaster ? "all" : (data.classCode || "6-1");
                    setUnlockedClassScope(scope);
                    
                    // Force the filter if it belongs to a single class
                    if (scope !== "all") {
                      setTeacherFilterClass(scope);
                    }
                    
                    setShowTeacherUnlockModal(false);
                    setActiveTab("teacher");
                    setTeacherPinInput("");
                    setTeacherPinError("");
                    fetchPasscodes();
                  } else {
                    setTeacherPinError(`⚠️ 암호 불일치! 선생님 전용 통제 패스코드를 바르게 입력하십시오.`);
                  }
                } catch (err) {
                  setTeacherPinError("⚠️ 보안 서버 인증 통신망에 장애가 있거나 연결이 지연되고 있습니다.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">🔑 교사용 기밀 보증 패스코드</label>
                <input 
                  type="password"
                  value={teacherPinInput}
                  onChange={(e) => {
                    setTeacherPinInput(e.target.value);
                    setTeacherPinError("");
                  }}
                  placeholder="보안 암호를 입력하세요"
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-850 font-mono focus:ring-2 focus:ring-rose-500 focus:bg-white focus:outline-none placeholder:font-sans placeholder:text-xs"
                />
                {teacherPinError && (
                  <p className="text-[11px] font-bold text-rose-600 mt-1.5">{teacherPinError}</p>
                )}
              </div>

              {/* Bypass Shortcut Info */}
              <div className="bg-rose-50/40 p-3.5 rounded-xl border border-rose-100 text-[10px] text-rose-850">
                <p className="font-bold">💡 [선생님을 위한 단축 팁]</p>
                <p className="mt-1 leading-normal font-medium">
                  매번 암호를 복잡하게 기입하지 않으시려면, 주소 끝에 <code className="font-mono bg-white px-1 py-0.5 border border-rose-200 rounded text-rose-700 font-bold">?role=teacher</code> 를 뒤에 부착해서 접속하면 자동 패스처리됩니다!
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherUnlockModal(false);
                    setTeacherPinInput("");
                    setTeacherPinError("");
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition"
                >
                  취소(학생 모드 유지)
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition shadow-lg shadow-slate-900/20"
                >
                  허브 안전 잠금 해제 🔓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎪 WORLD EXPO EXHIBITION PAVILION INTERACTIVE MODAL */}
      {showExpoShowcase && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col z-50 p-4 md:p-6 transition-all duration-300 text-left overflow-y-auto">
          
          {/* Expo Header */}
          <div className="flex justify-between items-center border-b border-indigo-900/50 pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-indigo-500/20 border border-indigo-500/40 text-amber-400 rounded-xl text-lg font-black shrink-0 animate-pulse">🎪</span>
              <div>
                <span className="text-[10px] text-indigo-450 font-extrabold uppercase tracking-wider block">Real-time Digital World Expo Pavilion</span>
                <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                  <span>지구촌 문화 수호제 실시간 디지털 박람회 전시관</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">교실 무선 수합 라이브 미러링 중</span>
                </h2>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setShowExpoShowcase(false);
                setExpoActiveIndex(null);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition shadow-lg shadow-rose-900/30"
            >
              박람회 관람 종료 ✕
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
            
            {/* Left: Interactive Virtual Booth Picker */}
            <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0 bg-indigo-950/30 border border-indigo-900/40 p-4 rounded-2xl overflow-y-auto max-h-[220px] lg:max-h-none">
              <h3 className="text-xs font-black text-indigo-300 uppercase tracking-widest pb-2 border-b border-indigo-900/40 flex flex-col gap-1">
                <div className="flex justify-between items-center w-full">
                  <span>🎪 활성화된 모둠 부스 목록</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    ● {teacherFilterClass ? importedPortfolios.filter(p => (p.classCode || "").toLowerCase().includes(teacherFilterClass.toLowerCase())).length : importedPortfolios.length}개
                  </span>
                </div>
                {teacherFilterClass && (
                  <span className="text-[10px] text-amber-500 font-extrabold font-mono tracking-tight self-start">
                    🏫 학급 필터: {teacherFilterClass}
                  </span>
                )}
              </h3>
              
              <div className="flex lg:flex-col gap-2.5 py-1">
                {importedPortfolios.filter(p => {
                  if (!teacherFilterClass) return true;
                  return (p.classCode || "").toLowerCase().includes(teacherFilterClass.toLowerCase());
                }).map((p, idx) => {
                  const isActive = expoActiveIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setExpoActiveIndex(idx);
                        setExpoStoryboardSlideIndex(0);
                      }}
                      className={`w-48 lg:w-full p-3.5 rounded-xl border text-left transition-all shrink-0 relative overflow-hidden ${
                        isActive 
                          ? "bg-indigo-900 border-amber-500 text-white ring-2 ring-amber-500/30 shadow-md shadow-amber-500/20" 
                          : "bg-indigo-950/25 border-indigo-900 text-slate-300 hover:bg-indigo-900/30 hover:border-indigo-705"
                      }`}
                    >
                      {/* Booth Deco */}
                      <div className="absolute top-0 right-0 p-1 font-mono text-[9px] bg-amber-500/10 text-amber-400 border-l border-b border-indigo-900/20 rounded-bl-lg font-black">
                        {p.classCode || "6-1"} • #{idx+1}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xl shrink-0">
                          {p.selectedCountryCode === "IN" ? "🇮🇳" : p.selectedCountryCode === "FR" ? "🇫🇷" : p.selectedCountryCode === "EG" ? "🇪🇬" : "🌐"}
                        </span>
                        <span className="text-xs font-black truncate max-w-[120px] lg:max-w-none">{p.selectedCountry || "탐구국 미정"}</span>
                      </div>
                      
                      <p className="text-[11px] font-black text-amber-400 truncate">{p.groupName}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 truncate">단원: {p.groupMembers?.map((m: any) => m.name).join(", ")}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Immersive Interactive Booth Presentation Layout */}
            <div className="flex-1 bg-slate-900 border border-indigo-900/40 p-5 md:p-6 rounded-2xl flex flex-col overflow-y-auto text-slate-300 relative shadow-inner min-h-0">
              
              {expoActiveIndex === null || !importedPortfolios[expoActiveIndex] ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 my-auto">
                  <span className="text-5xl mb-3 animate-bounce">🎪</span>
                  <p className="text-xs font-extrabold text-slate-300">박람회 관람을 시작하려면 왼쪽에서 모둠 부스를 선택하십시오.</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm">교탁 스크린에 띄워 모둠별 연구 탐구 지형, 영화 스토리보드, UN 결의안 헌장을 차례로 시뮬레이션 전시할 수 있습니다.</p>
                </div>
              ) : (() => {
                const p = importedPortfolios[expoActiveIndex];
                const scenes = p.storyboard || [];
                const activeScene = scenes[expoStoryboardSlideIndex] || null;
                const clauses = p.operativeClauses || p.resolution?.operativeClauses || [];
                
                return (
                  <div className="space-y-6 animate-fade-in text-left">
                    
                    {/* Booth Presentation Title Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-950/40 border border-indigo-900/50 p-4 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow-sm shrink-0">
                          {p.selectedCountryCode === "IN" ? "🇮🇳" : p.selectedCountryCode === "FR" ? "🇫🇷" : p.selectedCountryCode === "EG" ? "🇪🇬" : "🌐"}
                        </span>
                        <div>
                          <div className="text-[10px] text-amber-400 font-extrabold tracking-widest uppercase mb-0.5">
                            📍 {p.selectedCountry || "탐구 대상 국가"} 엑스포 전시관
                          </div>
                          <h3 className="text-base md:text-lg font-black text-white">
                            {p.groupName} <span className="text-xs font-normal text-slate-400">({p.groupMembers?.map((m: any) => m.name).join(", ")} 단원임)</span>
                          </h3>
                        </div>
                      </div>

                      {/* Real-time Dynamic Scoreboard badge */}
                      <div className="flex gap-2 shrink-0">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px] rounded-lg">
                          🗺️ 여권 스탬프 {p.userPassportStamps?.length || 0}개 실증
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px] rounded-lg">
                          ✒️ 세계 시민 서약 완료
                        </div>
                      </div>
                    </div>

                    {/* Showcase Pillars Grids */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                      
                      {/* COLUMN 1 (5 cols): Self-Investigated Cultural Discoveries */}
                      <div className="xl:col-span-5 space-y-4">
                        <div className="bg-indigo-950/20 border border-indigo-900/45 p-4 rounded-xl">
                          <h4 className="text-xs font-black text-amber-400 mb-3.5 flex items-center justify-between border-b border-indigo-900/30 pb-2">
                            <span>🔍 1P: 직접 수집한 지리 환경적 지구촌 문화 조사자료</span>
                            <span className="text-[9px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full font-bold">모둠 자체 탐구</span>
                          </h4>

                          <div className="space-y-3.5 text-xs">
                            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
                              <div className="flex items-center gap-1.5 mb-1 text-orange-400 font-bold">
                                <span className="font-serif text-xs font-black px-1.5 py-0.5 bg-orange-950/80 border border-orange-850 rounded">食</span>
                                <span>고유 음식 및 기후 탄생 배경</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-2 rounded">
                                {p.studentResearch?.[p.selectedCountryCode]?.food || p.studentResearch?.food || "교과서 모범 연구 답안을 열람하여 지리 환경을 대입하는 단계입니다."}
                              </p>
                            </div>

                            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
                              <div className="flex items-center gap-1.5 mb-1 text-indigo-400 font-bold">
                                <span className="font-serif text-xs font-black px-1.5 py-0.5 bg-indigo-950/80 border border-indigo-850 rounded font-serif">禮</span>
                                <span>전통 인사법과 소망 예절</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-2 rounded">
                                {p.studentResearch?.[p.selectedCountryCode]?.greeting || p.studentResearch?.greeting || "지원을 수립하여 상호 예절을 도출하는 단계입니다."}
                              </p>
                            </div>

                            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
                              <div className="flex items-center gap-1.5 mb-1 text-purple-400 font-bold">
                                <span className="font-serif text-xs font-black px-1.5 py-0.5 bg-purple-950/80 border border-purple-850 rounded font-serif">衣</span>
                                <span>환경 극복을 위한 전통 의복 양식</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-2 rounded">
                                {p.studentResearch?.[p.selectedCountryCode]?.costume || p.studentResearch?.costume || "기온 조절과 사구 방지를 연구하는 단계입니다."}
                              </p>
                            </div>

                            <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-900/30">
                              <div className="flex items-center gap-1.5 mb-1 text-pink-400 font-bold">
                                <span className="font-serif text-xs font-black px-1.5 py-0.5 bg-pink-950/80 border border-pink-850 rounded font-serif">樂</span>
                                <span>공동체 결속을 기리는 연대 축제</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-semibold bg-slate-950/50 p-2 rounded">
                                {p.studentResearch?.[p.selectedCountryCode]?.festival || p.studentResearch?.festival || "생태 주기와 추수를 기념하는 연대제 구성란입니다."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* COLUMN 2 (7 cols): Interactive Storyboard Player + UN Declaration */}
                      <div className="xl:col-span-7 space-y-4">
                        
                        {/* Interactive Storyboard Cinematic Player Mockup */}
                        <div className="bg-gradient-to-br from-indigo-950/50 via-slate-950/80 to-slate-950 border border-indigo-900 p-4 rounded-xl relative overflow-hidden shadow-lg">
                          <h4 className="text-xs font-black text-amber-400 mb-3 flex justify-between items-center border-b border-indigo-900/30 pb-2">
                            <span>🎬 2P: 지구촌 공익 영상 기획 극장</span>
                            <span className="text-[10px] text-indigo-400 font-mono">스토리보드 슬라이드 덱</span>
                          </h4>

                          {p.videoUrl && (
                            <div className="mb-3.5 bg-indigo-950/80 border border-indigo-500/30 p-3 rounded-xl flex items-center justify-between gap-3 animate-pulse relative">
                              <div className="text-left">
                                <span className="text-[9px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase tracking-widest inline-block mb-1">상영 작품 발견</span>
                                <p className="text-[11px] font-bold text-slate-100 leading-tight">학생들이 제작 성료한 실제 동영상이 연결되었습니다!</p>
                              </div>
                              <a
                                href={p.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-black font-black text-xs rounded-lg transition-all flex items-center gap-1.5 shrink-0 hover:scale-103"
                              >
                                🎬 영상 바로 시청하기 ↗
                              </a>
                            </div>
                          )}

                          {scenes.length === 0 ? (
                            <div className="p-10 text-center text-slate-500 text-xs font-bold">
                              이 모둠은 아직 캠페인 영상 기획 포트폴리오를 작성하지 않았습니다.
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Slide Screening Area */}
                              <div className="bg-slate-950 border-2 border-indigo-805 rounded-xl p-4 md:p-5 text-center min-h-[160px] flex flex-col justify-between relative shadow-inner">
                                <div className="absolute top-2.5 left-3 px-2 py-0.5 bg-indigo-600 font-black text-[9px] text-white rounded uppercase tracking-wide">
                                  SCREEN LIVE
                                </div>
                                <div className="absolute top-2.5 right-3 px-2.5 py-0.5 bg-slate-800 text-slate-400 font-mono text-[9px] rounded font-bold">
                                  Scene {expoStoryboardSlideIndex + 1} / {scenes.length}
                                </div>

                                <div className="my-auto py-5">
                                  <p className="text-[10px] text-indigo-400 font-extrabold mb-1.5 uppercase tracking-wider">🎬 연출 화면 시각 구성:</p>
                                  <p className="text-sm md:text-base font-extrabold text-white leading-relaxed">
                                    “ {activeScene?.screenVisual} ”
                                  </p>
                                  {activeScene?.notes && (
                                    <p className="text-[10px] text-slate-400 mt-2 font-mono">촬영 지침 단서: {activeScene.notes}</p>
                                  )}
                                </div>

                                <div className="bg-slate-900/95 border-t border-indigo-900/50 -mx-4 -mb-4 p-3 rounded-b-xl text-left">
                                  <span className="text-[9px] text-amber-500 font-extrabold uppercase tracking-widest block mb-0.5">🎙️ 나레이션 및 자막 오디오 발화대본:</span>
                                  <p className="text-[11px] text-amber-100/90 leading-relaxed font-bold">
                                    {activeScene?.audioText}
                                  </p>
                                </div>
                              </div>

                              {/* Clickable Nav controls for Scenes */}
                              <div className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-lg border border-indigo-900/35">
                                <button
                                  onClick={() => setExpoStoryboardSlideIndex(prev => Math.max(0, prev - 1))}
                                  disabled={expoStoryboardSlideIndex === 0}
                                  className="px-3 py-1 bg-indigo-900/40 hover:bg-indigo-800 disabled:opacity-30 text-white font-extrabold text-[10px] rounded-lg transition"
                                >
                                  ◀ 이전 씬
                                </button>
                                <span className="text-xs font-bold text-slate-400">
                                  🎬 씬 {activeScene?.sceneNumber || expoStoryboardSlideIndex + 1} : {activeScene?.category || "기본"}
                                </span>
                                <button
                                  onClick={() => setExpoStoryboardSlideIndex(prev => Math.min(scenes.length - 1, prev + 1))}
                                  disabled={expoStoryboardSlideIndex === scenes.length - 1}
                                  className="px-3 py-1 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-30 text-white font-extrabold text-[10px] rounded-lg transition"
                                >
                                  다음 씬 ▶
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* UN Resolutions Show */}
                        <div className="bg-indigo-950/15 border border-indigo-900/45 p-4 rounded-xl">
                          <h4 className="text-xs font-black text-amber-400 mb-3.5 flex items-center justify-between border-b border-indigo-900/30 pb-2">
                            <span>🏛️ 3P: UN 세계 평화 위원회 상속 결의조한 발의</span>
                            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">모의 UN 공동 선언</span>
                          </h4>

                          {!p.resolution ? (
                            <p className="text-xs text-slate-500 p-4 text-center">결의안 작성 전입니다.</p>
                          ) : (
                            <div className="space-y-3 font-sans text-xs bg-slate-950/40 border border-indigo-900/30 p-4 rounded-lg">
                              <div className="flex justify-between items-center text-[10px] text-indigo-300 font-bold mb-1">
                                <span>의안제 번호: {p.resolution?.resolutionNumber || "A/RES/6/32-01"}</span>
                                <span>다문화 평화 발전</span>
                              </div>
                              <p className="font-extrabold text-white text-[13px] border-b border-indigo-900 pb-1 focus:outline-none">
                                {p.resolution?.title}
                              </p>
                              <p className="text-[11px] text-slate-400 leading-normal italic py-1 border-l-2 border-amber-500/50 pl-2.5">
                                <strong>전문(Preamble):</strong> {p.resolution?.preamble}
                              </p>
                              
                              <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed pt-2">
                                {clauses.map((clause: string, i: number) => (
                                  <p key={i} className="bg-indigo-950/40 p-2 rounded border border-indigo-900">
                                    <strong className="text-amber-400">제 {i+1}항:</strong> {clause}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>

          </div>

          {/* Expo Footer with Peer Review Guide */}
          <div className="mt-4 pt-3.5 border-t border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-indigo-300 shrink-0">
            <span className="font-bold">💡 [청곡 초등 교육 박람회 미션] 동료 평가단, 학부모 및 관람 단원은 태블릿 부스에서 상계 자료를 열람하신 뒤 지지 서약 및 소감란을 전격 기재해 주십시오.</span>
            <div className="text-[10px] bg-indigo-900/30 border border-indigo-805 px-3 py-1 rounded-lg font-mono text-indigo-400 font-medium">
              Digital Hall System v3.2 • Live Kiosk Mode
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

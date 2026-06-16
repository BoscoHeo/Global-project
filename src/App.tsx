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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("curriculum");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [countries, setCountries] = useState<CountryInfo[]>(SEEDED_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(SEEDED_COUNTRIES[0]);
  const [generatingCountryName, setGeneratingCountryName] = useState<string>("");
  const [isGeneratingCountry, setIsGeneratingCountry] = useState<boolean>(false);
  
  // Group states
  const [groupName, setGroupName] = useState<string>("글로벌 지킴이 1모둠");
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { name: "김민재", role: "촬영 및 대사 조율" },
    { name: "이서연", role: "대본 작성 및 화면 구성" },
    { name: "최준우", role: "전통 의상 소품 제작" },
    { name: "박지아", role: "현장 인터뷰 및 연출" }
  ]);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");

  // Tab 1 States: Storyboard Planner
  const [storyboard, setStoryboard] = useState<StoryboardScene[]>([
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
    sponsorCountry: "이집트 대표국 (1모둠 공동 제안)",
    resolutionNumber: "A/RES/6/32-01",
    title: "기후 적응 소규모 섬나라 지지 및 대륙별 식수 보장과 국제 평등 자원 나눔 동반 결의의 건",
    preamble: "우리 모의 UN 위원회의 대표국들은 화석 연료 고갈과 해수면 상승으로 생존권을 파괴당하는 인류 안녕에 심대한 우려를 공유한다. 특히 선진 공장 지대에서 배출하는 탄소가 아프리카 식수 부족을 가속하는 악순환을 성찰하며, 정의로운 연대로 보편적 행복권을 누려야 함을 자각, 이에 다음과 같은 평화 실천적 조항들을 다짐하고 전 세계 회원국에 자치적 참여를 촉약한다."
  });
  const [operativeClauses, setOperativeClauses] = useState<string[]>([
    "기후 해수면 비상 기금을 창출하여 저개발 연안 섬나라의 친환경 해수 배수 방벽 제작 기술 사업비를 무상 전격 전도한다.",
    "교내 및 가정에서 전력 낭비를 15% 일괄 감량하고 텀블러 보급 대책을 교장 교원과 결연하여 공익 캠페인을 월별 행사로 주최한다."
  ]);
  const [newClauseText, setNewClauseText] = useState<string>("");
  const [resolutionFeedback, setResolutionFeedback] = useState<any | null>(null);
  const [evaluatingResolution, setEvaluatingResolution] = useState<boolean>(false);

  // Tab 4 States: Campaign Suggest & Citizen Oath
  const [campaignInput, setCampaignInput] = useState({
    topic: "지구촌 기후 정의와 생활 속 분리수거 실천",
    coreMessage: "우리의 따뜻한 낭비를 줄이고 세계 친구들을 위한 친환경 텀블러 사용을 상설화합시다."
  });
  const [suggestedSlogans, setSuggestedSlogans] = useState<any[]>([]);
  const [loadingCampaign, setLoadingCampaign] = useState<boolean>(false);
  const [citizenOath, setCitizenOath] = useState<any>({
    studentName: "김민재",
    pledge1: "세계 여러 나라의 문화와 그들이 살아온 환경적 배경에 편견을 품지 않고 존중하여 대한다.",
    pledge2: "물 절약과 분리수거, 일회용 폐기물 일절 감량을 일상생활의 최고 덕목으로 삼아 실천한다.",
    pledge3: "어려운 난민과 소외 이웃의 인권 침해 소식을 외면하지 않으며 교내 지구촌 공익 캠페인에 선전한다."
  });
  const [signedOath, setSignedOath] = useState<boolean>(false);

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
    setEvaluatingScript(true);
    setScriptFeedback(null);

    const scenarioTextCombined = storyboard.map(s => 
      `[씬 ${s.sceneNumber} - ${s.category}]
화면: ${s.screenVisual}
자막/더빙: ${s.audioText}
비고: ${s.notes}`
    ).join("\n\n");

    const rolesCombined = groupMembers.map(m => `${m.name}(${m.role})`).join(", ");

    try {
      const res = await fetch("/api/ai/evaluate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    setEvaluatingResolution(true);
    setResolutionFeedback(null);

    const clausesCombined = operativeClauses.map((c, i) => `제 ${i+1}항: ${c}`).join("\n");

    try {
      const res = await fetch("/api/ai/evaluate-resolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

    try {
      const res = await fetch("/api/ai/suggest-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      
      {/* Sleek Style Upper Navigation */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-8 bg-white border-b border-slate-200 shrink-0 shadow-sm z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
            <Globe className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-md md:text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              지구촌 소통 & 지킴이 Studio
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                32차시 통합형
              </span>
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
            
            <input 
              type="text" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-3"
              placeholder="모둠 이름을 명문화하세요"
            />

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
                    style={{ width: `${(userPassportStamps.length / countries.length) * 100}%` }}
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
                              headers: { "Content-Type": "application/json" },
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
                            headers: { "Content-Type": "application/json" },
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

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  
                  {/* Food Card */}
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl font-serif text-sm font-black shrink-0">食</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">고유 음식 문화 (대표 요리와 기후)</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{selectedCountry.highlights.food}</p>
                    </div>
                  </div>

                  {/* Greeting Card */}
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl font-serif text-sm font-black shrink-0">禮</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">전통 인사법과 소통의 규칙</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{selectedCountry.highlights.greeting}</p>
                    </div>
                  </div>

                  {/* Costume Card */}
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl font-serif text-sm font-black shrink-0">衣</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">환경 극복을 위한 의복 및 직조양식</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{selectedCountry.highlights.costume}</p>
                    </div>
                  </div>

                  {/* Festival Card */}
                  <div className="flex gap-4 items-start p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <div className="p-3 bg-pink-100 text-pink-600 rounded-xl font-serif text-sm font-black shrink-0">樂</div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-1">풍요를 기리는 연대제 및 축제</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{selectedCountry.highlights.festival}</p>
                    </div>
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

                            <grid className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="text-[11px]">
                                <span className="block font-bold text-slate-500 mb-0.5">🎬 화면 연출</span>
                                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-100">{scene.screenVisual}</p>
                              </div>
                              <div className="text-[11px]">
                                <span className="block font-bold text-slate-500 mb-0.5">🎙️ 오디오/내레이션</span>
                                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-slate-100 italic">{scene.audioText}</p>
                              </div>
                            </grid>

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

    </div>
  );
}

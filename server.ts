import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  Firestore,
  setLogLevel
} from "firebase/firestore";

dotenv.config();

// Mute non-fatal client SDK idle stream connection warnings in Node environment
try {
  setLogLevel("error");
} catch (e) {}

const app = express();
const PORT = process.env.PORT || 3000;

// Security Hardening: Disable Express signature header to prevent signature visibility exposure
app.disable('x-powered-by');

// Security Hardening: Content-Security-Policy (CSP) middleware to protect against Cross-Site Scripting (XSS)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https: data:;"
  );
  next();
});

app.use(express.json());

// Initialize Firebase using the Client JS SDK (no private service account JSON needed, safe for Render/external hosting)
let db: Firestore | null = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (process.env.FIREBASE_PROJECT_ID) {
    const config = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      apiKey: process.env.FIREBASE_API_KEY || "",
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      appId: process.env.FIREBASE_APP_ID || ""
    };
    const appInstance = initializeApp(config);
    if (process.env.FIREBASE_DATABASE_ID) {
      db = initializeFirestore(appInstance, { experimentalForceLongPolling: true }, process.env.FIREBASE_DATABASE_ID);
    } else {
      db = initializeFirestore(appInstance, { experimentalForceLongPolling: true });
    }
    console.log(`[Firebase] Initialized Client Firestore successfully from environment with Long Polling for project: ${config.projectId} (databaseId: ${process.env.FIREBASE_DATABASE_ID || "default"})`);
  } else if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const appInstance = initializeApp(config);
    if (config.firestoreDatabaseId) {
      db = initializeFirestore(appInstance, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);
    } else {
      db = initializeFirestore(appInstance, { experimentalForceLongPolling: true });
    }
    console.log(`[Firebase] Initialized Client Firestore successfully with Long Polling for project: ${config.projectId} (databaseId: ${config.firestoreDatabaseId || "default"})`);
  } else {
    console.warn("[Firebase] No firebase-applet-config.json or FIREBASE_PROJECT_ID found. Using in-memory fallback.");
  }
} catch (err) {
  console.error("[Firebase] Initialization error:", err);
}

// Dynamic Gemini client setup, supporting optional runtime user-provided keys from Request headers
let classTeacherApiKeys: Record<string, string> = {};

function getGemini(reqApiKey?: string, classCode?: string) {
  const targetClass = (classCode || "6-1").trim();
  const apiKey = reqApiKey || classTeacherApiKeys[targetClass] || classTeacherApiKeys["all"] || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn(`GEMINI_API_KEY is not provided (neither via request headers, class [${targetClass}], master keys, nor environment). Offline mock fallback enabled.`);
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Route: Evaluate Culture Video Script
app.post("/api/ai/evaluate-script", async (req, res) => {
  try {
    const { country, topic, scenarioText, roleDistribution } = req.body;
    if (!country || !topic || !scenarioText) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const userApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const classCode = req.headers["x-class-code"] as string | undefined;
    const ai = getGemini(userApiKey, classCode);
    if (!ai) {
      // Fallback response for offline/missing key simulation
      return res.json({
        feedback: `[오프라인 모드] ${country}의 ${topic} 문화를 다룬 시나리오를 검토했습니다. 내용이 흥미롭게 전개되고 있으나 실제 API 연결을 진행하여 교사의 전문적인 AI 피드백을 받아보세요.`,
        recommendations: [
          "인사말이나 인사 행동을 영상 시작 부분에 실감나게 포함해 보세요.",
          "음식 문화의 지리적/기후적 배경 설명이 조금 더 들어가면 완벽합니다.",
          "모둠원들의 역할 분담이 화면에서 자연스럽게 드러나도록 연출 계획을 정교화하세요."
        ],
        level: "잘함"
      });
    }

    const prompt = `당신은 초등학교 6학년 사회과 세계 지리 및 문화 탐구 교육 전문가이자 우수한 담임교사입니다.
6학년 학생들이 수행하고 있는 "서로 다른 나라, 함께 사는 세계" 프로젝트 9~11차시 '지구촌 소개 영상 제작을 위한 시나리오/대본'을 친절하고 격려하는 어조로 피드백해주세요.

[학생 학습 정보]
- 탐구 국가: ${country}
- 탐구 주제: ${topic}
- 역할 분담 상태: ${roleDistribution || "기본 분담 완료"}
- 작성한 대본 내용:
${scenarioText}

[평가 및 피드백 지침]
1. 학생들이 작성한 문화 속성 정보가 역사적/지리적 사실에 비추어 볼 때 수용적이고 타당한지 점검해주세요.
2. 타 문화에 대한 편견이나 오해를 줄일 수 있는 방향으로 구성되어 있는지 확인하고 조언해주세요.
3. 영상 편집 단계(자막, 화면 전환, 녹음 등)에서 더 흥미롭고 실현 가능한 연출 아이디어를 제시해주세요.
4. 초등학교 6학년 수준에 부합하도록 아주 긍정적이고 따뜻하며, 구체적인 칭찬과 보완점을 한글로 작성해주세요.
5. 학습 성취수준 등급은 다음 4가지 중 하나를 골라 합당한 성과 이유와 함께 평가해주세요:
   - "매우 잘함" (내용이 풍부하고 편견 극복 및 탐색 노력이 뛰어나며 연출이 실현 가능한 경우)
   - "잘함" (주요 조사 내용이 타당하고 대본 형식을 갖추었으나 연출이나 깊이가 약간 보완 필요한 경우)
   - "보통" (대본의 기본 뼈대는 있으나 정보가 부족하거나 단순 사실 나열인 경우)
   - "노력 요함" (대본 분량이 너무 극단적으로 적거나 주제와 다소 무관한 경우)

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: {
              type: Type.STRING,
              description: "학생들의 노력을 적극 지지하고 칭찬하며 다정하게 수정을 권고하는 상세한 총평 줄글"
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "다음 차시 영상 제작이나 대본 수정에서 바로 실천할 수 있는 3가지의 구체적 아이디어 목록"
            },
            level: {
              type: Type.STRING,
              description: "최종 성취 수준. '매우 잘함', '잘함', '보통', '노력 요함' 중 택일"
            }
          },
          required: ["feedback", "recommendations", "level"]
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Evaluate Script Error:", error);
    res.status(500).json({ error: "피드백 처리 중 오류가 발생했습니다.", details: error.message });
  }
});

// 2. Route: Evaluate UN Resolution
app.post("/api/ai/evaluate-resolution", async (req, res) => {
  try {
    const { topic, issues, resolutionText } = req.body;
    if (!topic || !resolutionText) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const userApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const classCode = req.headers["x-class-code"] as string | undefined;
    const ai = getGemini(userApiKey, classCode);
    if (!ai) {
      return res.json({
        analysis: `[오프라인 모드] ${topic} 의제로 작성된 학생들이 합의한 모의 UN 결의안입니다. 전제부와 실천 조항의 구색이 돋보입니다. 가상 API 연동 후 더 구체적인 외교적 피드백을 확인하세요.`,
        actionableSuggestions: [
          "해결 조항에 구체적으로 '국제사회가 비용을 분담하는 방안'이나 '기술 전수 방법' 등의 제도적 수단을 추가해보세요.",
          "강대국과 개발도상국의 이익이 균형을 이루고 있는지 점검해야 설득력 있는 UN 결의안이 됩니다.",
          "교내 캠페인 활동(28~29차시)과 연계되어 학교 내부에서 실천할 수 있는 약속도 전문에 어울립니다."
        ],
        status: "보완 권장"
      });
    }

    const prompt = `당신은 가상 UN(United Nations) 총회 수석 사무관입니다.
초등학생들이 지구촌 3대 난제(기후/환경, 자원/에너지, 난민/인권) 중 하나인 [주제: ${topic}]에 대해 가습 및 조사와 모의 UN 회의(26~27차시)를 걸쳐 합의해 작성한 [결의안(Resolution)] 초안을 평가 및 수정 권고해주십시오.

[학생들이 해결하려는 세부 쟁점]
${issues || "지구촌 주요 분쟁 및 공동 대응 방안"}

[학생들이 작성한 결의안 전문 내용]
${resolutionText}

[평가 기준]
1. 문제의 근본적인 원인을 극복하기 위한 다각적 협력이 언급되는지 (정부 차원, 사회 공동체 차원, 개인 차원)
2. 일방적인 선진국 기준의 강요가 아니고, 모두의 인권과 지속가능한 생존을 존중하는 형평성이 있는지
3. 조항들이 선언적인 것에 그치지 않고 구체적인 실천 가능성이 높은지
4. 학생들이 국제 기구의 일원으로서 자부심과 연대감을 느낄 수 있는 품격 있고 격려 넘치는 전문적인 한글 답변을 요청합니다.

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "결의안의 우수한 영역과 문제 분석 태도를 격려하고 평가하는 줄글 총평"
            },
            actionableSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "결의안을 발전시키기 위해 더 기재해야 할 실천 기준이나 문구 수정 건의 3가지"
            },
            status: {
              type: Type.STRING,
              description: "결의안 성숙도 상태. '완성도 높음', '보완 권장', '재작성 필요' 중 택일"
            }
          },
          required: ["analysis", "actionableSuggestions", "status"]
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Evaluate Resolution Error:", error);
    res.status(500).json({ error: "결의안 피드백 처리 중 오류가 발생했습니다.", details: error.message });
  }
});

// 3. Route: Suggest Slogans & Campaigns
app.post("/api/ai/suggest-campaign", async (req, res) => {
  try {
    const { topic, coreMessage } = req.body;
    if (!topic || !coreMessage) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const userApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const classCode = req.headers["x-class-code"] as string | undefined;
    const ai = getGemini(userApiKey, classCode);
    if (!ai) {
      return res.json({
        slogans: [
          { slogan: "기후 위기 남일 아냐! 나부터 플라스틱 다이어트!", designIdea: "녹아내리는 빙하와 지구가 하트 무늬 반창고를 붙이고 있는 귀여운 포스터 시각화" },
          { slogan: "지구를 살리는 따뜻한 온도, 우리의 작은 조절에서 시작됩니다", designIdea: "전기 플러그를 뽑거나 텀블러를 들고 행진하는 아이들을 그린 아동화풍 피켓" },
          { slogan: "지구촌 친구들도 소중해! 편견 비우고 존중으로 채우자!", designIdea: "다양한 얼굴색을 가진 친구들이 다같이 손을 잡고 강강술래를 도는 모습" }
        ]
      });
    }

    const prompt = `당신은 전 세계의 평화와 지속 가능한 발전을 도모하는 비정부 기구(NGO) 소속의 경력 높은 캠페인 수석 디렉터입니다.
초등학교 6학년 학생들이 학교 공동체와 주변 사람들을 대상으로 30~31차시에 진행할 예정인 [주제: ${topic}] 오프라인 공익 캠페인('지구촌 지킴이 캠페인')을 위한 슬로건(Slogan)과 캠페인 피켓 미술 설계 아이디어를 창작해주세요.

[학생들의 핵심 메시지 및 희망 사항]
- 핵심 내용: ${coreMessage}

[창작 요구사항]
1. 초등학교 전교생과 교직원들이 등교 시간 또는 박람회장에서 보고 즉시 가슴 깊이 공감하고 기억에 남도록 쉬운 단어, 리듬감 있는 대구, 직관적인 한글로 작성하십시오.
2. 각 슬로건에 알맞은 시각적 '피켓/포스터 레이아웃 디자인이나 그림 소재 아이디어(미술 교과 연계)'를 구체적으로 한 개씩 기술해주십시오.
3. 총 4가지의 매력적인 옵션을 생성해주세요.

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slogans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slogan: { type: Type.STRING, description: "캠페인용 한글 슬로건 문구" },
                  designIdea: { type: Type.STRING, description: "미술 연계 피켓 디자인 아이디어" }
                },
                required: ["slogan", "designIdea"]
              },
              description: "제안된 4개의 슬로건과 해당 피켓 시안"
            }
          },
          required: ["slogans"]
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Suggest Campaign Error:", error);
    res.status(500).json({ error: "캠페인 슬로건 제안 전송 중 오류가 발생했습니다.", details: error.message });
  }
});

// 4. Route: Generate Custom Country dynamically via AI
app.post("/api/ai/generate-country", async (req, res) => {
  const countryName = (req.body.countryName || "").trim();
  try {
    if (!countryName) {
      return res.status(400).json({ error: "국가명이 입력되지 않았습니다." });
    }

    const userApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const classCode = req.headers["x-class-code"] as string | undefined;
    const ai = getGemini(userApiKey, classCode);
    if (!ai) {
      // Offline fallback
      return res.json({
        code: "US",
        name: `${countryName} (Generated)`,
        continent: "아메리카 (America)",
        flag: "🇺🇸",
        description: `초등학교 6학년 지구촌 문화 탐색 교육을 위해 가상 생성된 ${countryName} 문화 데이터입니다.`,
        highlights: {
          food: "다양한 이주민 역사 속에서 탄생한 바비큐 요리와 도넛 핑거 푸드.",
          greeting: "친근하게 눈을 마주치며 손을 힘있게 흔들거나 미소어린 하이파이브를 나눕니다.",
          costume: "실용성과 활동성을 극대화한 데님 웨어와 넓은 챙의 카우보이 모자의 복식.",
          festival: "매년 가을 전 세계 이웃들이 참여하여 수확을 나누고 추수 축제를 즐기는 가을 대축제."
        },
        quiz: [
          {
            id: "gen-q1",
            question: `${countryName}의 역사적 배경에서 탄생한 대표적인 축제의 가치와 주된 내용은 무엇일까요?`,
            options: ["단식을 통한 절제", "수확에 동참한 이웃 간의 화합과 감사 수확제", "혹독한 눈보라 생존 훈련", "전쟁 승리 기념 군사 행진"],
            correctIndex: 1
          },
          {
            id: "gen-q2",
            question: `${countryName}의 기후적 일상생활 속에서 개발되어 세계적으로 대중화된 대포적인 전통 통풍 의례 모자의 명칭은?`,
            options: ["한복 사모", "카우보이 햇 (중절모 스타일)", "갈라베야 터번", "사리 천"],
            correctIndex: 1
          }
        ]
      });
    }

    const prompt = `당신은 전 세계의 역사, 지리, 문화를 학술적으로 분석하고 이를 초등학교 6학년 사회과 교육과정 환경 맞춤형으로 재미있고 입체적이게 요약해 주는 세계문화 연구 전문가입니다.
사용자가 입력한 국가에 대한 정보를 바탕으로 학술 교육용 CountryInfo JSON 형식 데이터를 정량적으로 완성해 주십시오.

[요청한 국가 이름]
${countryName}

[작성 가이드라인]
1. 국가코드 (code)는 2글자로 된 해당 국가의 영문 약어(ISO-3166 2자 국가코드, 예: US, JP, FR 등) 대문자를 적으십시오.
2. 국가명 (name)은 '국가명 (영어 영문표기)' 형식으로 맞추십시오 (예: "미국 (United States)", "프랑스 (France)").
3. 대륙 (continent)은 '대륙명 (영문대륙명)' 형식으로 아시아(Asia), 유럽(Europe), 아메리카(America), 아프리카(Africa), 오세아니아(Oceania) 등 6학년 지리학 수준에서 정확히 기입하십시오.
4. 국기 이모지 (flag)는 해당 대국의 이모지를 적어 주십시오.
5. description은 6학년 학생들에게 해당 나라를 다정하고 매끄럽게 요약 설명하는 글입니다. (3~4줄 내외)
6. highlights (food, greeting, costume, festival)는 문화 속성들을 매우 흥미롭고 구체적으로 한땀한땀 기입하십시오.
   - food: 요리의 주식재료 및 기후적/역사적 특징이 드러나는 스토리.
   - greeting: 문화 특유의 동작과 평화 인칭 표현.
   - costume: 의복의 명칭과 이를 입게 된 자연환경/지리적 특징.
   - festival: 공동체 연대를 상반적으로 상징하는 축제의 명칭과 놀이 방식.
7. quiz는 해당 국가에 특화된 풍부한 교육용 퀴즈 2가지를 출제하십시오.
   - 객관식 선택지는 4개이며, 0-indexed correctIndex 기준에 완벽히 일치해야 합니다.
   - 퀴즈 질문은 초등학생들이 기후나 역사, 지리적 원인이 녹아든 재미있는 문장이어야 합니다.
   - 또한, 문제를 틀린 학생이 정답을 유추할 수 있도록 은유적이고 간접적인 교육적 힌트(hint) 필드를 반드시 포함시키되, 힌트 본문에 정답의 글자나 직접적인 단어가 포함되지 않도록 주의하십시오.

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING, description: "ISO 2자리 국가코드 예: US" },
            name: { type: Type.STRING, description: "한글 국가명 및 영문 대괄호 표기" },
            continent: { type: Type.STRING, description: "대륙명" },
            flag: { type: Type.STRING, description: "국기 이모지 단 한 개" },
            description: { type: Type.STRING, description: "개요 설명" },
            highlights: {
              type: Type.OBJECT,
              properties: {
                food: { type: Type.STRING, description: "대표 음식과 환경적 탄생 배경" },
                greeting: { type: Type.STRING, description: "동작과 환대 마음가짐이 깃든 인사법" },
                costume: { type: Type.STRING, description: "자연 환경을 이겨내는 전통 의복 형태" },
                festival: { type: Type.STRING, description: "공동체 활력을 주는 전통 축제 정보" }
              },
              required: ["food", "greeting", "costume", "festival"]
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "임의의 고유 ID (예: gen-q1)" },
                  question: { type: Type.STRING, description: "지리/문화 요인이 결합된 퀴즈 질문" },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "상대적으로 긴 구체적인 보기 4개"
                  },
                  correctIndex: { type: Type.INTEGER, description: "0부터 3 사이의 정답 인덱스" },
                  hint: { type: Type.STRING, description: "정답을 직접 밝히지 않고, 우회적으로 힌트를 주어 스스로 답을 찾게 이끄는 다정한 설명 (정답 글자 포함 금지)" }
                },
                required: ["id", "question", "options", "correctIndex", "hint"]
              },
              description: "국가별 퀴즈 2문항 세트"
            }
          },
          required: ["code", "name", "continent", "flag", "description", "highlights", "quiz"]
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Generate Country Error:", error);
    
    // Graceful fallback for any AI model / API error so lessons run smoothly without disruption
    console.log(`[Gemini Fallback] Serving smart educational fallback for ${countryName}. Error:`, error?.message || error);
    
    // Map common country names to accurate continents & flags for offline/fallback mode
    let fallbackContinent = "아시아 (Asia)";
    let fallbackFlag = "🌍";
    const nameLower = countryName.toLowerCase();
    
    if (nameLower.includes("미국") || nameLower.includes("캐나다") || nameLower.includes("멕시코") || nameLower.includes("usa")) {
      fallbackContinent = "북아메리카 (North America)";
      fallbackFlag = nameLower.includes("미국") ? "🇺🇸" : nameLower.includes("캐나다") ? "🇨🇦" : "🇲🇽";
    } else if (nameLower.includes("브라질") || nameLower.includes("아르헨티나") || nameLower.includes("칠레") || nameLower.includes("페루") || nameLower.includes("콜롬비아")) {
      fallbackContinent = "남아메리카 (South America)";
      fallbackFlag = nameLower.includes("브라질") ? "🇧🇷" : nameLower.includes("아르헨티나") ? "🇦🇷" : "💃";
    } else if (nameLower.includes("프랑스") || nameLower.includes("독일") || nameLower.includes("영국") || nameLower.includes("이탈리아") || nameLower.includes("스페인") || nameLower.includes("스위스") || nameLower.includes("노르웨이") || nameLower.includes("네덜란드")) {
      fallbackContinent = "유럽 (Europe)";
      fallbackFlag = nameLower.includes("프랑스") ? "🇫🇷" : nameLower.includes("독일") ? "🇩🇪" : nameLower.includes("영국") ? "🇬🇧" : nameLower.includes("이탈리아") ? "🇮🇹" : "🇪🇺";
    } else if (nameLower.includes("케냐") || nameLower.includes("이집트") || nameLower.includes("남아공") || nameLower.includes("나이지리아") || nameLower.includes("에티오피아") || nameLower.includes("가나")) {
      fallbackContinent = "아프리카 (Africa)";
      fallbackFlag = nameLower.includes("이집트") ? "🇪🇬" : nameLower.includes("케냐") ? "🇰🇪" : "🌍";
    } else if (nameLower.includes("호주") || nameLower.includes("뉴질랜드") || nameLower.includes("피지") || nameLower.includes("팔라우")) {
      fallbackContinent = "오세아니아 (Oceania)";
      fallbackFlag = nameLower.includes("호주") ? "🇦🇺" : nameLower.includes("뉴질랜드") ? "🇳🇿" : "🦘";
    } else if (nameLower.includes("일본") || nameLower.includes("중국") || nameLower.includes("베트남") || nameLower.includes("인도") || nameLower.includes("태국") || nameLower.includes("한국")) {
      fallbackContinent = "아시아 (Asia)";
      fallbackFlag = nameLower.includes("일본") ? "🇯🇵" : nameLower.includes("중국") ? "🇨🇳" : nameLower.includes("인도") ? "🇮🇳" : "🇰🇷";
    }

    const mockCode = (countryName.substring(0, 2).toUpperCase()) + "_" + Date.now().toString(36).slice(-4);
    
    return res.json({
      code: mockCode,
      name: `${countryName} (${countryName})`,
      continent: fallbackContinent,
      flag: fallbackFlag,
      description: `초등학교 6학년 지구촌 문화 탐색 교육을 위해 실시간 생성된 ${countryName}의 지리·문화 아카이브 자료입니다.`,
      highlights: {
        food: `${countryName}의 대표적 향토 음식으로, 해당 지역의 기후적 환경과 역사적 배경이 깊게 서려 있는 독창적 식문화입니다.`,
        greeting: "상대방을 정중하게 바라보며 평화와 존중의 마음을 담아 건네는 전통 인사법입니다.",
        costume: "자연환경과 기온 변화에 능동적으로 적응하기 위해 발전해 온 가볍고 품격 있는 전통 의복입니다.",
        festival: "지역 주민들이 한데 모여 수확을 감사하고 다채로운 민속 공연과 나누는 전통 문화 대축제입니다."
      },
      quiz: [
        {
          id: `fallback-q1-${Date.now()}`,
          question: `${countryName}의 전통 의복이나 음식 등이 공통적으로 지닌 지리적·문화적 특징은 무엇일까요?`,
          options: ["기후와 자연환경에 적응하기 위한 인간의 지혜", "인위적인 기술의 억압", "타 국가의 무조건적인 복제", "단순 유행 추구"],
          correctIndex: 0,
          hint: "자연 조건과 기후를 극복하는 과정에서 고유한 문화가 생겨난다는 점을 기억해 보세요!"
        },
        {
          id: `fallback-q2-${Date.now()}`,
          question: "지구촌의 다양한 문화를 배우고 탐색할 때 가져야 할 가장 바람직한 태도는 무엇입니까?",
          options: ["문화적 차이를 등급 매겨 무시한다", "기후와 역사가 빚어낸 고유한 가치를 존중하고 이해한다", "자신의 편견에 맞지 않으면 배척한다", "갈등을 조장한다"],
          correctIndex: 1,
          hint: "서로 다름을 차별이 아닌 다양성으로 존중하는 따뜻한 마음가짐이 핵심입니다."
        }
      ]
    });
  }
});

// Global in-memory storage for cross-device classroom aggregation (acts as local cache/fallback)
const classroomPortfolios = new Map<string, any>();

// 모둠원 간 실시간 공동 작업 데이터 저장소 (인메모리 캐시 및 Firestore 연동)
const classroomGroupWorkspaces = new Map<string, any>();

// Class-specific passcode storage (acts as local cache/fallback)
const classroomPasscodes = new Map<string, string>([
  ["master", "8900"]
]);

// Class-specific assigned continent storage (acts as local cache/fallback)
const classroomContinents = new Map<string, string>([
  ["6-1", "아프리카 (Africa)"],
  ["6-2", "북아메리카 (North America)"],
  ["6-3", "남아메리카 (South America)"],
  ["6-4", "오세아니아 (Oceania)"],
  ["6-5", "아시아 (Asia)"],
  ["6-6", "북&서유럽 (Europe)"],
  ["6-7", "동&남유럽 (Europe)"]
]);

// Helper to sync all database records from Firestore into our local cache on startup
async function syncFromFirestore() {
  if (!db) return;
  try {
    console.log("[Firebase] Syncing database configurations from Firestore on startup...");
    
    // 1. Sync Teacher API Keys
    const keysSnapshot = await getDocs(collection(db, "teacher_api_keys"));
    keysSnapshot.forEach(doc => {
      const data = doc.data();
      if (data && data.apiKey) {
        classTeacherApiKeys[doc.id] = data.apiKey;
      }
    });
    console.log(`[Firebase] Loaded ${keysSnapshot.size} teacher API keys from Firestore.`);

    // 2. Sync Classroom Passcodes
    const passcodesSnapshot = await getDocs(collection(db, "classroom_passcodes"));
    passcodesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data && data.passcode) {
        classroomPasscodes.set(doc.id, data.passcode);
      }
    });
    console.log(`[Firebase] Loaded ${passcodesSnapshot.size} classroom passcodes from Firestore.`);

    // 3. Sync Classroom Continents
    const continentsSnapshot = await getDocs(collection(db, "classroom_continents"));
    continentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data && data.continent) {
        classroomContinents.set(doc.id, data.continent);
      }
    });
    console.log(`[Firebase] Loaded ${continentsSnapshot.size} classroom continents from Firestore.`);

    // 4. Sync Classroom Portfolios
    const portfoliosSnapshot = await getDocs(collection(db, "classroom_portfolios"));
    portfoliosSnapshot.forEach(doc => {
      const data = doc.data();
      if (data) {
        classroomPortfolios.set(doc.id, data);
      }
    });
    console.log(`[Firebase] Loaded ${portfoliosSnapshot.size} student portfolios from Firestore.`);

    // 5. Sync Classroom Collaborative Group Workspaces
    const groupsSnapshot = await getDocs(collection(db, "classroom_groups"));
    groupsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data) {
        classroomGroupWorkspaces.set(doc.id, data);
      }
    });
    console.log(`[Firebase] Loaded ${groupsSnapshot.size} collaborative group workspaces from Firestore.`);
  } catch (err: any) {
    console.error("[Firebase] Error performing initial database sync:", err);
  }
}

// Security Helper to verify and fetch authorization scope from request headers
function getAuthorizedClassCode(req: express.Request): { authorized: boolean; classScope: string } {
  const authHeader = req.headers["authorization"];
  const headerPasscode = req.headers["x-teacher-passcode"] as string | undefined;
  
  let passcode = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    passcode = authHeader.substring(7).trim();
  } else if (headerPasscode) {
    passcode = headerPasscode.trim();
  }
  
  if (!passcode) {
    return { authorized: false, classScope: "none" };
  }
  
  const masterPass = classroomPasscodes.get("master") || "8900";
  if (passcode === masterPass) {
    return { authorized: true, classScope: "all" };
  }
  
  for (const [classCode, storedPass] of classroomPasscodes.entries()) {
    if (classCode !== "master" && storedPass === passcode) {
      return { authorized: true, classScope: classCode };
    }
  }
  
  return { authorized: false, classScope: "none" };
}

function verifyPasscode(req: express.Request, requireMaster: boolean = false): boolean {
  const auth = getAuthorizedClassCode(req);
  if (!auth.authorized) return false;
  if (requireMaster && auth.classScope !== "all") return false;
  return true;
}

// Route: Get all passcodes (Internal Teacher access)
app.get("/api/class-passcode/list", (req, res) => {
  if (!verifyPasscode(req, true)) {
    return res.status(401).json({ error: "접근 권한이 없습니다. 마스터 교사 비밀번호가 필요합니다." });
  }
  res.json({
    master: classroomPasscodes.get("master") || "8900",
    custom: Object.fromEntries(classroomPasscodes.entries())
  });
});

// Route: Save/Update a classroom passcode
app.post("/api/class-passcode/save", async (req, res) => {
  if (!verifyPasscode(req, true)) {
    return res.status(401).json({ error: "접근 권한이 없습니다. 마스터 교사 비밀번호가 필요합니다." });
  }

  const { classCode, passcode } = req.body;
  if (!passcode || passcode.trim().length === 0) {
    return res.status(400).json({ error: "올바른 암호를 기입하십시오." });
  }
  const trimmedCode = (classCode || "master").trim();
  const trimmedPasscode = passcode.trim();

  // Regex and size guard for code and passcode parameters
  if (!/^[a-zA-Z0-9_\-]+$/.test(trimmedCode) || trimmedCode.length > 20) {
    return res.status(400).json({ error: "학급 코드는 20자 이하의 영문, 숫자, 특수문자(_, -)만 허용됩니다." });
  }
  if (trimmedPasscode.length > 20 || trimmedPasscode.length < 4) {
    return res.status(400).json({ error: "암호는 4자 이상 20자 이하여야 합니다." });
  }

  // Update in-memory fallback cache
  classroomPasscodes.set(trimmedCode, trimmedPasscode);
  console.log(`[Security] Passcode for '${trimmedCode}' updated to '${trimmedPasscode}'`);

  // Persist in Firebase Firestore
  if (db) {
    try {
      await setDoc(doc(db, "classroom_passcodes", trimmedCode), { passcode: trimmedPasscode });
      console.log(`[Firebase] Saved passcode for class '${trimmedCode}' to Firestore.`);
    } catch (err) {
      console.error("[Firebase] Error saving passcode to Firestore:", err);
    }
  }

  res.json({ success: true });
});

// Route: Verify passcode
app.post("/api/class-passcode/verify", (req, res) => {
  const { passcode } = req.body;
  if (!passcode) {
    return res.status(400).json({ error: "암호를 입력해 주십시오." });
  }

  const trimmedPasscode = passcode.trim();

  // 1. Check master passcode
  const masterPass = classroomPasscodes.get("master") || "8900";
  if (trimmedPasscode === masterPass) {
    return res.json({ success: true, isMaster: true });
  }

  // 2. Scan all custom keys to see if this matches a class-specific code
  for (const [classCode, storedPass] of classroomPasscodes.entries()) {
    if (classCode !== "master" && storedPass === trimmedPasscode) {
      return res.json({ success: true, isMaster: false, classCode });
    }
  }

  res.json({ success: false, error: "암호가 올바르지 않습니다." });
});

// Route: Get all class assigned continents
app.get("/api/class-continent/list", (req, res) => {
  res.json({
    custom: Object.fromEntries(classroomContinents.entries())
  });
});

// Route: Save/Update a classroom assigned continent
app.post("/api/class-continent/save", async (req, res) => {
  const { classCode, continent } = req.body;
  const trimmedCode = (classCode || "6-1").trim();
  const trimmedContinent = (continent || "전체").trim();

  if (!/^[a-zA-Z0-9_\-]+$/.test(trimmedCode) || trimmedCode.length > 20) {
    return res.status(400).json({ error: "학급 코드는 20자 이하의 영문, 숫자, 특수문자만 허용됩니다." });
  }

  classroomContinents.set(trimmedCode, trimmedContinent);
  console.log(`[Continent] Class '${trimmedCode}' continent updated to '${trimmedContinent}'`);

  if (db) {
    try {
      await setDoc(doc(db, "classroom_continents", trimmedCode), { continent: trimmedContinent });
      console.log(`[Firebase] Saved continent '${trimmedContinent}' for class '${trimmedCode}' to Firestore.`);
    } catch (err) {
      console.error("[Firebase] Error saving classroom continent to Firestore:", err);
    }
  }

  res.json({ success: true, classCode: trimmedCode, continent: trimmedContinent });
});

// Route: Evaluate aggregated portfolio on behalf of teacher
app.post("/api/ai/evaluate-portfolio", async (req, res) => {
  try {
    const { groupName, campaignInput, storyboard, resolution, selectedCountry } = req.body;
    const userApiKey = req.headers["x-gemini-api-key"] as string | undefined;
    const classCode = req.headers["x-class-code"] as string | undefined;
    const ai = getGemini(userApiKey, classCode);

    if (!ai) {
      // Offline mock fallback
      return res.json({
        storyboardCritique: `[오프라인 모드] 시나리오 흐름이 부드럽고 각 장면의 촬영 및 화면 구성 계획이 돋보입니다. 세계 시민적 가치가 충실히 반영되었습니다.`,
        resolutionAudit: `[오프라인 모드] Preamble과 Operative Clauses가 조약 구조에 아주 완벽히 부응합니다. 강대국과 개발도상국의 공생이 성찰적으로 균형 잡혀 있습니다.`,
        campaignCheck: `[오프라인 모드] '${campaignInput?.topic || "공익 캠페인"}' 주제 아래 '${campaignInput?.coreMessage || "핵심 메시지"}'의 호소력이 매우 전파력 높은 캠페인이 될 것으로 전망됩니다.`,
        competencies: ["협력적 의사결정", "세계 시민가치", "글로벌 공감"],
        grade: "A-장려"
      });
    }

    const storyboardText = (storyboard || []).map((s: any) => `Scene ${s.sceneNumber}: [${s.category}] Screen: ${s.screenVisual}, Narration/Audio: ${s.audioText}, Notes: ${s.notes}`).join("\n");
    const clausesText = (resolution?.operativeClauses || []).map((clause: string, i: number) => `Clause: ${clause}`).join("\n");

    const prompt = `당신은 초등학교 6학년 사회과 세계 지리 및 평상시 모교 성취평가 관찰 기록과 교육과정 평가 전문가이자 다정한 담임교사입니다.
우리 학급의 [${groupName || "탐구 모둠"}] 학생들이 제출한 32차시 장기 프로젝트 수행평가 결과 포트폴리오를 종합적으로 대리 채점하고 친절한 성적 조언 및 교사 관찰 소평용 요약을 리턴해주세요.

[학생 제출물 세부 사항]
- 탐구 타깃 국가/지역: ${selectedCountry || "지구촌 가치"}
- 모둠 캠페인 주제: ${campaignInput?.topic || "직접 작성 전입니다."}
- 모둠 기향 가치 & 슬로건 메시지: ${campaignInput?.coreMessage || "직접 작성 전입니다."}

- 작성된 영상 스토리보드 시나리오(총 ${(storyboard || []).length}개 씬):
${storyboardText || "미작성"}

- 작성된 UN 결의안 합의서 (전문: ${resolution?.preamble || "미작성"}):
${clausesText || "미작성"}

[최종 채점 및 피드백 임무]
다음 5가지 항목을 정교하게 도출하여 JSON 형식으로 대답해주십시오:
1. storyboardCritique (대리 채점용 스토리보드 씬 피드백 및 관찰조언 - 2~3줄)
2. resolutionAudit (UN 결의안 기획 능력 평가 및 조항 실효성 분석 - 2~3줄)
3. campaignCheck (공익 캠페인 기획 및 슬로건 호소력 평가 - 2~3줄)
4. competencies (이 활동을 통해 학생 모둠이 보여준 핵심 가치 역량 3가지 - 각각 짧은 문구나 명사로 3개 배열)
5. grade (추천 종합 성취 성적등급: "A+-탁월", "A-장려", "B-도전" 중 꼭 하나 결정)

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyboardCritique: { type: Type.STRING },
            resolutionAudit: { type: Type.STRING },
            campaignCheck: { type: Type.STRING },
            competencies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            grade: { type: Type.STRING }
          },
          required: ["storyboardCritique", "resolutionAudit", "campaignCheck", "competencies", "grade"]
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Evaluate Portfolio Error:", error);
    res.status(500).json({ error: "포트폴리오 대리 채점 전송 중 오류가 발생했습니다.", details: error.message });
  }
});

// Route: Submit group portfolio
app.post("/api/portfolio/submit", async (req, res) => {
  const portfolio = req.body;
  if (!portfolio || !portfolio.groupName) {
    return res.status(400).json({ error: "모둠명이 입력되지 않았습니다." });
  }
  const classCodeVal = (portfolio.classCode || "6-1").trim();
  const groupKey = `${classCodeVal}_${portfolio.groupName.trim()}`;
  
  const payload = {
    ...portfolio,
    submittedAt: new Date().toISOString(),
    ip: req.ip || "unknown"
  };

  // Update local cache
  classroomPortfolios.set(groupKey, payload);
  console.log(`[Submission] Portfolio received from: ${groupKey}`);

  // Persist in Firebase Firestore
  if (db) {
    try {
      await setDoc(doc(db, "classroom_portfolios", groupKey), payload);
      console.log(`[Firebase] Saved student portfolio '${groupKey}' to Firestore.`);
    } catch (err) {
      console.error("[Firebase] Error saving student portfolio to Firestore:", err);
    }
  }

  res.json({ success: true, count: classroomPortfolios.size });
});

// Route: Fetch aggregated portfolios
app.get("/api/portfolio/list", async (req, res) => {
  const authInfo = getAuthorizedClassCode(req);
  if (!authInfo.authorized) {
    return res.status(401).json({ error: "접근 권한이 없습니다. 올바른 교사 비밀번호가 필요합니다." });
  }

  let list: any[] = [];
  // Read dynamically from Firebase Firestore if connected
  if (db) {
    try {
      const snapshot = await getDocs(collection(db, "classroom_portfolios"));
      list = snapshot.docs.map(doc => doc.data());
    } catch (err) {
      console.error("[Firebase] Error listing student portfolios from Firestore, falling back to local cache:", err);
      list = Array.from(classroomPortfolios.values());
    }
  } else {
    list = Array.from(classroomPortfolios.values());
  }

  // Security Hardening: Filter results so class-specific teachers can only view their own class
  if (authInfo.classScope !== "all") {
    list = list.filter(p => (p.classCode || "6-1").trim() === authInfo.classScope.trim());
  }

  res.json(list);
});

// Route: Reset classroom storage
app.post("/api/portfolio/reset", async (req, res) => {
  const authInfo = getAuthorizedClassCode(req);
  if (!authInfo.authorized) {
    return res.status(401).json({ error: "접근 권한이 없습니다. 올바른 교사 비밀번호가 필요합니다." });
  }

  const isMaster = authInfo.classScope === "all";

  // Filter and clear in-memory fallback cache based on teacher's class scope
  if (isMaster) {
    classroomPortfolios.clear();
    console.log(`[Admin] All classroom portfolios storage has been reset.`);
  } else {
    for (const [key, portfolio] of classroomPortfolios.entries()) {
      if ((portfolio.classCode || "6-1").trim() === authInfo.classScope.trim()) {
        classroomPortfolios.delete(key);
      }
    }
    console.log(`[Admin] Class '${authInfo.classScope}' portfolios storage has been reset.`);
  }

  if (db) {
    try {
      const snapshot = await getDocs(collection(db, "classroom_portfolios"));
      const batch = writeBatch(db);
      let count = 0;
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (isMaster || (data && (data.classCode || "6-1").trim() === authInfo.classScope.trim())) {
          batch.delete(doc.ref);
          count++;
        }
      });
      if (count > 0) {
        await batch.commit();
      }
      console.log(`[Firebase] Successfully truncated ${count} classroom_portfolios in Firestore for scope: ${authInfo.classScope}.`);
    } catch (err) {
      console.error("[Firebase] Error resetting portfolios in Firestore:", err);
    }
  }

  res.json({ success: true });
});

// ==========================================
// [모둠 실시간 협업 & 클라우드 공유 API]
// 초등 6학년 학생들이 같은 모둠 안에서 조사 내용, 대본, 부스 계획 등을 공유할 수 있도록 지원합니다.
// ==========================================

// 1. 모둠 실시간 작업 상태 저장 (Save Workspace)
app.post("/api/group/sync/save", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.groupName || !payload.classCode) {
      return res.status(400).json({ error: "학급 코드(classCode)와 모둠명(groupName)은 필수 항목입니다." });
    }

    const classCodeVal = String(payload.classCode).trim();
    const groupNameVal = String(payload.groupName).trim();
    const groupKey = `${classCodeVal}_${groupNameVal}`;

    const workspaceData = {
      ...payload,
      classCode: classCodeVal,
      groupName: groupNameVal,
      updatedAt: new Date().toISOString(),
      lastAuthor: payload.lastAuthor || "모둠원",
      ip: req.ip || "unknown"
    };

    // 1) 서버 인메모리 캐시 갱신 (빠른 응답 보장)
    classroomGroupWorkspaces.set(groupKey, workspaceData);

    // 2) Firestore에 영구 보관 (DB 연결 시)
    if (db) {
      try {
        await setDoc(doc(db, "classroom_groups", groupKey), workspaceData);
        console.log(`[Group Sync] Workspace '${groupKey}' saved to Firestore by ${workspaceData.lastAuthor}`);
      } catch (dbErr) {
        console.error(`[Group Sync] Firestore save error for '${groupKey}':`, dbErr);
      }
    }

    return res.json({
      success: true,
      groupKey,
      updatedAt: workspaceData.updatedAt,
      message: `'${groupNameVal}' 모둠의 작업 내용이 모둠 클라우드에 안전하게 공유/동기화되었습니다.`
    });
  } catch (error: any) {
    console.error("[Group Sync] Save error:", error);
    return res.status(500).json({ error: "모둠 작업 저장 중 오류가 발생했습니다." });
  }
});

// 2. 모둠 최신 작업 상태 불러오기 (Load Workspace)
app.get("/api/group/sync/load", async (req, res) => {
  try {
    const classCodeVal = String(req.query.classCode || "").trim();
    const groupNameVal = String(req.query.groupName || "").trim();

    if (!classCodeVal || !groupNameVal) {
      return res.status(400).json({ error: "학급 코드와 모둠명을 모두 제공해야 합니다." });
    }

    const groupKey = `${classCodeVal}_${groupNameVal}`;

    // 인메모리 캐시 우선 확인
    let data = classroomGroupWorkspaces.get(groupKey);

    // Firestore에서 추가 조회 (인메모리에 없거나 DB 확인)
    if (!data && db) {
      try {
        const snapshot = await getDocs(collection(db, "classroom_groups"));
        snapshot.docs.forEach(d => {
          if (d.id === groupKey) {
            data = d.data();
            classroomGroupWorkspaces.set(groupKey, data);
          }
        });
      } catch (dbErr) {
        console.error(`[Group Sync] Firestore read error for '${groupKey}':`, dbErr);
      }
    }

    if (!data) {
      return res.json({ exists: false, message: "저장된 모둠 공동 작업 내용이 아직 없습니다." });
    }

    return res.json({ exists: true, data });
  } catch (error: any) {
    console.error("[Group Sync] Load error:", error);
    return res.status(500).json({ error: "모둠 작업 불러오기 중 오류가 발생했습니다." });
  }
});

// 3. 모둠 최신 갱신 상태 가볍게 조회 (Poll/Status Check - 대역폭 절약용)
app.get("/api/group/sync/status", (req, res) => {
  const classCodeVal = String(req.query.classCode || "").trim();
  const groupNameVal = String(req.query.groupName || "").trim();

  if (!classCodeVal || !groupNameVal) {
    return res.status(400).json({ error: "학급 코드와 모둠명이 필요합니다." });
  }

  const groupKey = `${classCodeVal}_${groupNameVal}`;
  const data = classroomGroupWorkspaces.get(groupKey);

  if (!data) {
    return res.json({ exists: false });
  }

  return res.json({
    exists: true,
    updatedAt: data.updatedAt,
    lastAuthor: data.lastAuthor || "모둠원"
  });
});

// Route: Update teacher-configured API Key in server memory
app.post("/api/teacher-api-key/update", async (req, res) => {
  const authInfo = getAuthorizedClassCode(req);
  if (!authInfo.authorized) {
    return res.status(401).json({ error: "접근 권한이 없습니다. 올바른 교사 비밀번호가 필요합니다." });
  }

  const { apiKey, classCode } = req.body;
  const targetClass = (classCode || "all").trim();

  // Enforce scope boundary: class-specific teacher can only update their own class API Key
  if (authInfo.classScope !== "all" && authInfo.classScope.trim() !== targetClass) {
    return res.status(403).json({ error: "지정된 학급의 설정 권한이 없습니다." });
  }

  const trimmed = (apiKey || "").trim();
  if (trimmed) {
    classTeacherApiKeys[targetClass] = trimmed;
  } else {
    delete classTeacherApiKeys[targetClass];
  }
  console.log(`[Server API Key] Saved key for class [${targetClass}]: ${trimmed ? "ACTIVE" : "CLEARED"}`);

  if (db) {
    try {
      const docRef = doc(db, "teacher_api_keys", targetClass);
      if (trimmed) {
        await setDoc(docRef, { apiKey: trimmed });
      } else {
        await deleteDoc(docRef);
      }
      console.log(`[Firebase] Updated teacher API Key for '${targetClass}' in Firestore.`);
    } catch (err) {
      console.error("[Firebase] Error updating teacher API Key in Firestore:", err);
    }
  }

  res.json({ success: true, hasKey: !!classTeacherApiKeys[targetClass], classCode: targetClass });
});

// Route: Get teacher API Key status
app.get("/api/teacher-api-key/status", (req, res) => {
  const classCode = ((req.query.classCode as string) || "all").trim();
  const hasKey = !!classTeacherApiKeys[classCode] || !!classTeacherApiKeys["all"];
  res.json({ hasKey, keysCount: Object.keys(classTeacherApiKeys).length });
});

// Configure Vite integration or bundle
async function startServer() {
  // Sync configurations from Firestore on startup
  await syncFromFirestore();

  const distPath = path.join(process.cwd(), "dist");
  const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(path.join(distPath, "index.html"));

  if (isProduction) {
    console.log("[Express Backend] Running in PRODUCTION mode. Serving static assets from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error("Error sending index.html:", err);
          res.status(404).send("Index.html not found. Please ensure the frontend build completed successfully.");
        }
      });
    });
  } else {
    console.log("[Express Backend] Running in DEVELOPMENT mode. Starting Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[Express Backend] Server listening on http://localhost:${PORT}`);
  });
}

startServer();

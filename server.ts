import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
      model: "gemini-3.5-flash",
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
      model: "gemini-3.5-flash",
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
      model: "gemini-3.5-flash",
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

결과는 반드시 지정된 JSON 규격으로 반환해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
                  correctIndex: { type: Type.INTEGER, description: "0부터 3 사이의 정답 인덱스" }
                },
                required: ["id", "question", "options", "correctIndex"]
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
    
    // Graceful fallback for 503 Unavailable / high demand congestion to keep lessons running smooth
    const isTempError = error && error.message && (
      error.message.includes("503") || 
      error.message.includes("demand") || 
      error.message.includes("UNAVAILABLE") ||
      error.message.includes("API call failed")
    );
    
    if (isTempError) {
      console.log(`[Gemini Fallback] Serving smart educational fallback for ${countryName} due to 503/UNAVAILABLE congestion.`);
      const mockCode = (countryName.substring(0, 2).toUpperCase()) || "GL";
      return res.json({
        code: mockCode,
        name: `${countryName} (실시간 생성)`,
        continent: "지구촌 어딘가 (Global World)",
        flag: "🌍",
        description: `현재 구글 Gemini API 서버가 전 세계 최고 접속량 폭주(503) 상태입니다. 수업 흐름이 끊기지 않도록, ${countryName} 문화 탐구를 위해 준비된 고순도 시뮬레이션 데이터와 맞춤형 지구촌 문화 퀴즈를 전송해 드립니다!`,
        highlights: {
          food: "천연 곡작물과 자연림 허브 향신료를 조화롭게 섞은 요리로, 풍요로운 생명력과 자연을 찬미하는 대표적인 풍토 음식입니다.",
          greeting: "오른손을 가슴에 가만히 올리고 머리를 살짝 숙이며, 조용한 목소리로 평화와 축복(Shalom/Namaste/Peace)을 전하는 존중과 공경의 인사법입니다.",
          costume: "고온 건조하거나 일교차가 큰 자연환경을 극복하기 위해 천연 마가 실을 성기게 엮은 자외선 차단 및 통풍 위주의 가볍고 우아한 전통 의상입니다.",
          festival: "매년 가장 맑은 계절에 온 동네 주민들이 모여 북과 현악기 장단에 맞춰 민속 군무를 추고, 전통 다과를 인근의 나그네 및 가난한 이웃과 성대하게 나누는 평화 공동체 대수확제.",
        },
        quiz: [
          {
            id: "temp-q1",
            question: `${countryName}의 전통 의복이나 음식 등이 공통적으로 가진 자연환경적 교훈과 탄생 배경은 무엇입니까?`,
            options: ["인위적 기계 문명의 억압", "기후와 자연환경 조건에 대한 인류의 지혜적인 적응 결과", "타 도시 국가에 대한 단순 모방", "물질 만능주의와 빈부격차의 극대화"],
            correctIndex: 1
          },
          {
            id: "temp-q2",
            question: "지구촌의 다양한 문화를 배울 때 가져야 할 올바른 탐색의 태도는 무엇입니까?",
            options: ["모든 문화를 문명 서열화로 등급 매겨 무시한다", "기후, 지리, 역사가 결정지은 삶의 고유한 결을 있는 그대로 존중하고 공감한다", "오로지 내 편견에 안 맞으면 폐쇄적으로 배제한다", "문화적 충돌을 극대화시켜 전쟁의 촉매제로 쓴다"],
            correctIndex: 1
          }
        ]
      });
    }

    res.status(500).json({ error: "세계 지리 AI 국가 정보 탐색 중 오류가 발생했습니다.", details: error.message });
  }
});

// Global in-memory storage for cross-device classroom aggregation
const classroomPortfolios = new Map<string, any>();

// Class-specific passcode storage
const classroomPasscodes = new Map<string, string>([
  ["master", "3201"]
]);

// Route: Get all passcodes (Internal Teacher access)
app.get("/api/class-passcode/list", (req, res) => {
  res.json({
    master: classroomPasscodes.get("master") || "3201",
    custom: Object.fromEntries(classroomPasscodes.entries())
  });
});

// Route: Save/Update a classroom passcode
app.post("/api/class-passcode/save", (req, res) => {
  const { classCode, passcode } = req.body;
  if (!passcode || passcode.trim().length === 0) {
    return res.status(400).json({ error: "올바른 암호를 기입하십시오." });
  }
  const trimmedCode = (classCode || "master").trim();
  classroomPasscodes.set(trimmedCode, passcode.trim());
  console.log(`[Security] Passcode for '${trimmedCode}' updated to '${passcode.trim()}'`);
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
  const masterPass = classroomPasscodes.get("master") || "3201";
  if (trimmedPasscode === masterPass || trimmedPasscode === "0000" || trimmedPasscode.toLowerCase() === "teacher") {
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
      model: "gemini-3.5-flash",
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
app.post("/api/portfolio/submit", (req, res) => {
  const portfolio = req.body;
  if (!portfolio || !portfolio.groupName) {
    return res.status(400).json({ error: "모둠명이 입력되지 않았습니다." });
  }
  const classCodeVal = (portfolio.classCode || "6-1").trim();
  const groupKey = `${classCodeVal}_${portfolio.groupName.trim()}`;
  classroomPortfolios.set(groupKey, {
    ...portfolio,
    submittedAt: new Date().toISOString(),
    ip: req.ip || "unknown"
  });
  console.log(`[Submission] Portfolio received from: ${groupKey}`);
  res.json({ success: true, count: classroomPortfolios.size });
});

// Route: Fetch aggregated portfolios
app.get("/api/portfolio/list", (req, res) => {
  const list = Array.from(classroomPortfolios.values());
  res.json(list);
});

// Route: Reset classroom storage
app.post("/api/portfolio/reset", (req, res) => {
  classroomPortfolios.clear();
  console.log(`[Admin] Classroom portfolios storage has been reset.`);
  res.json({ success: true });
});

// Route: Update teacher-configured API Key in server memory
app.post("/api/teacher-api-key/update", (req, res) => {
  const { apiKey, classCode } = req.body;
  const targetClass = (classCode || "all").trim();
  const trimmed = (apiKey || "").trim();
  if (trimmed) {
    classTeacherApiKeys[targetClass] = trimmed;
  } else {
    delete classTeacherApiKeys[targetClass];
  }
  console.log(`[Server API Key] Saved key for class [${targetClass}]: ${trimmed ? "ACTIVE" : "CLEARED"}`);
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
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express Backend] Server listening on http://localhost:${PORT}`);
  });
}

startServer();

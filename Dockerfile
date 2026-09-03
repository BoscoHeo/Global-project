# 1단계: 빌드 환경 (Node.js 20 Alpine 경량 이미지)
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 매니페스트 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 프로덕션 빌드 (Vite 정적 번들 + Express 서버 번들)
COPY . .
RUN npm run build

# 2단계: 프로덕션 런타임 환경
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev

# 빌드 산출물 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

# Cloud Run 표준 포트 노출
EXPOSE 8080

# 서버 기동
CMD ["node", "dist/server.cjs"]

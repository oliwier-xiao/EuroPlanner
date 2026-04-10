FROM node:20-slim AS builder
WORKDIR /app

# Deklarujemy argumenty (pobierane z --build-arg w workflow)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Ustawiamy je jako zmienne środowiskowe na czas budowania aplikacji
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

COPY package*.json ./
RUN npm install
COPY . .

# Budujemy aplikację Next.js (teraz widzi klucze Supabase)
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "start"]
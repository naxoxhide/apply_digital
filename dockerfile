
FROM node:22.13.1


RUN npm install -g pnpm

WORKDIR /src/

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

FROM node:16-alpine
WORKDIR /

COPY public/ ./
COPY src/ ./
COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production
COPY . .
CMD ["npm", "start"]
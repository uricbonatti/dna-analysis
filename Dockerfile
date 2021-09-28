FROM node:14.17.4-alpine

WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
RUN npm install -D typescript
RUN npm run build
RUN ls -a
ENV NODE_ENV production
RUN npm install pm2 -g

EXPOSE 8000

CMD ["pm2-runtime","dist/app/server.js"]

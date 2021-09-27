FROM node:14.17.4-alpine

WORKDIR /usr
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /usr/dist .
RUN npm install pm2 -g
EXPOSE 8000

CMD ["pm2-runtime","app/server.js"]

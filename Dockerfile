FROM node:18
WORKDIR /backend-app
ENV PATH /backend-app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY . ./
CMD ["node", "server.js"]
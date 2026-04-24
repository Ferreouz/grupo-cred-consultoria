FROM node:18-slim


 RUN apt-get update -y \
 && apt-get install -y openssl default-mysql-client \
 && rm -rf /var/lib/apt/lists/*


WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8081

CMD ["sh", "-c", "\
echo 'Starting app...'; \
npx prisma migrate deploy && \
node dist/server.js"]
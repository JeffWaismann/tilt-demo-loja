FROM docker.io/library/node:22-slim
WORKDIR /app
COPY package.json build.mjs testes.mjs server.mjs ./
COPY src ./src
RUN node build.mjs
EXPOSE 80
CMD ["node", "server.mjs"]

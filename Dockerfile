FROM node:20.5-alpine as builder
WORKDIR /usr/app
COPY package.json .
COPY pnpm-lock.yaml .
ENV NODE_ENV=production
RUN yarn global add pnpm
RUN pnpm install
COPY . .
RUN pnpm run build

FROM node:20.5-alpine as runner
WORKDIR /usr/app
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/pnpm-lock.yaml .
COPY --from=builder /usr/app/next.config.js .
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next/standalone .
COPY --from=builder /usr/app/.next/static ./.next/static

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["node", "server.js"]

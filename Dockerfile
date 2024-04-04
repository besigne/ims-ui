FROM node:20 AS base
LABEL authors="besigne"

ENV CONTAINER_NAME ims

WORKDIR /ims

RUN if npm install --global pm2; then \
  : ; \
  else echo "pm2 failed" && exit 1; \
  fi

COPY package.json package-lock.json* ./

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

EXPOSE 3000

CMD ["pm2-runtime", "npm", "--", "start"]
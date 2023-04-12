FROM node:18-alpine

RUN apk update \
  && apk upgrade \
  && apk add curl \
  && apk add bash \
  && apk add openjdk17-jre-headless

RUN npm install -g firebase-tools

WORKDIR /opt/firebase

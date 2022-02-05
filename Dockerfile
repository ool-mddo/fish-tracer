FROM node:16.13-bullseye-slim
RUN mkdir -p /fish-tracer
WORKDIR /fish-tracer
COPY package.json /fish-tracer/
COPY yarn.lock /fish-tracer/
RUN yarn install && yarn cache clean
COPY . /fish-tracer/
ENTRYPOINT ["yarn", "dev"]

FROM node:16.13-bullseye-slim
WORKDIR /fish-tracer
COPY . /fish-tracer/
RUN yarn install
ENTRYPOINT ["yarn", "dev"]

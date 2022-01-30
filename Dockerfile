FROM node:16
WORKDIR /fish-tracer
COPY . /fish-tracer/
RUN yarn install
ENTRYPOINT ["yarn", "dev"]

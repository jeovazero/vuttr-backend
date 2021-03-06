FROM node:dubnium-alpine

RUN mkdir -p /home/node/vuttr-api

WORKDIR /home/node/vuttr-api

ENV PATH /home/node/vuttr-api/node_modules/.bin:$PATH

ADD . /home/node/vuttr-api

RUN apk update && apk --no-cache --virtual build-dependencies add python g++ make

RUN npm install -g -s --no-progress yarn && yarn

EXPOSE 3000

CMD ["yarn", "start"]

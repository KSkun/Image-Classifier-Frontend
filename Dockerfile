FROM node:14.15.0-alpine as build

WORKDIR /app
COPY . .

# install requirements
RUN apk --upgrade --no-cache add python

# enable taobao registry to accelerate
# RUN npm config set registry https://registry.npm.taobao.org/

# or use a local proxy server
RUN npm config set proxy http://172.29.224.1:23334

RUN npm install

# build
RUN npm run build

FROM nginx:1.21.5-alpine

# copy frontend build to nginx image
COPY --from=build /app/dist /app/frontend
COPY ./docker/classifier.conf /etc/nginx/conf.d/classifier.conf

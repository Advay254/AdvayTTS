# Use official Node image as base
FROM node:20-bullseye

# install espeak-ng and lame
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    espeak-ng \
    lame \
    fonts-dejavu-core \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# create app dir
WORKDIR /usr/src/app

# copy app files
COPY package.json server/package.json /usr/src/app/server/
COPY server/server.js /usr/src/app/server/server.js
COPY . /usr/src/app

# install server deps
WORKDIR /usr/src/app/server
RUN npm install --production

# expose port
EXPOSE 3000

# production start
CMD ["node", "server/server.js"]

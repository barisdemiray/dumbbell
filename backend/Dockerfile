FROM ubuntu:19.10

RUN apt update
RUN apt install -y curl

# Install dependencies

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update
RUN apt install yarn

# gzip
RUN apt-get install -y gzip

# Create a new user 'node', not to run stuff as root
RUN addgroup node
RUN useradd -rm -d /home/node -s /bin/bash -g node -G sudo -u 1000 node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

# Install all the project dependencies
RUN yarn install

COPY --chown=node:node . .

# Let's see what's inside installation folder
RUN ls -la /home/node/app

EXPOSE 8080

CMD [ "node", "index.js" ]

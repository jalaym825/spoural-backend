ARG NODE_VERSION=20.12.2
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

ENV NODE_ENV production

# Copy package.json and package-lock.json first
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the source files into the image
COPY . .
RUN npm run prisma
RUN npm run build
# Run the application
CMD [ "npm", "start" ]
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 5001

# Running the production build is more stable than running nodemon in a container
CMD ["npm", "start"]

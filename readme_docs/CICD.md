# Build => Scan => Test => Deploy

When I run docker with docker-compose.yml
the nodejs-app and nginx server
I get two containers
The two container servers work great
But after I delete the two containers
Then I try to manually run the images into the containers nginx doesn't work
Then I get the following error:
2026-04-27 11:12:48 /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
2026-04-27 11:12:48 /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
2026-04-27 11:12:48 /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
2026-04-27 11:12:48 /docker-entrypoint.sh: Configuration complete; ready for start up
2026-04-27 11:12:28 2026/04/27 18:12:28 [emerg] 1#1: host not found in upstream "expressjs_web_app:3000" in /etc/nginx/nginx.conf:59


docker-compose.yml:
services:
  nodejs-app:
    container_name: expressjs_web_app
    build:
      context: .
      dockerfile: Dockerfile.dev
    image: "expressjs_web_app_img"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: always
    networks:
      - node-app-network
    ports:
      - "3000:80"
    
   


  nginx-nodejs-app:
    container_name: nginx_web_app
    build:
      context: .
      dockerfile: Dockerfile.nginx
    image: "nginx_web_app_img"
    ports:
      - "80:80"
    volumes:
      - ./nginx/config/nginx.conf:/etc/nginx/nginx.conf:ro
   
   
    restart: always
    depends_on:
      - nodejs-app
    networks:
      - node-app-network

networks:
  node-app-network:
    driver: bridge


Dockerfile.nginx:
FROM ubuntu/nginx

EXPOSE 80 

RUN apt update -y && \
    apt install vim -y && \
    apt install -y iputils-ping

COPY ./nginx/config/default.conf /etc/nginx/sites-available/
COPY ./nginx/config/nginx.conf /etc/nginx/

RUN rm /etc/nginx/sites-enabled/default
RUN ln -sf /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default

RUN chown -R www-data:www-data /var/log/nginx
RUN mkdir -p /etc/nginx/ssl/prod

COPY ./nginx/certs/prod* /etc/nginx/ssl/prod/


Dockerfile.dev:

FROM node:20-slim

# Create app directory

WORKDIR /usr/src/app

COPY ./build ./build
COPY ./node_modules ./node_modules
COPY package.json ./

EXPOSE 3000 

# Start the server directly from the build artifact
CMD ["node", "build/index.js"]


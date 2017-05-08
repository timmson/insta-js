FROM node:6
MAINTAINER Krotov Artem <timmson666@mail.ru>

# Install essentials
RUN apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y vim && \
    apt-get autoremove && \
    apt-get clean && \
    mkdir -p /app

# Copy src
COPY src/ /app

# Set the WORKDIR to /app so all following commands run in /app
WORKDIR /app

# Install dependencies
RUN npm i

# Run supervisor
CMD ["npm", "start"]

FROM ubuntu:xenial
MAINTAINER Krotov Artem <timmson666@mail.ru>

# Install essentials
RUN apt update && \
    apt dist-upgrade -y && \
    apt install -y apt-transport-https vim curl && \
    apt curl -sL https://deb.nodesource.com/setup_6.x -o /tmp/node_setup.sh && \
    chmod +x /tmp/node_setup.sh && \
    /tmp/node_setup.sh && \
    rm -rf /tmp/node_setup.sh && \
    apt install nodejs && \
    apt autoremove && \
    apt clean && \
    mkdir -p /var/log/supervisor && \
    mkdir /app

COPY docker-entrypoint /usr/local/bin/

# Copy supervisord.conf
#COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy src
COPY src/ /app

# Set the WORKDIR to /app so all following commands run in /app
WORKDIR /app

# Install dependencies
RUN npm i

# Run supervisor
ENTRYPOINT ["docker-entrypoint"]

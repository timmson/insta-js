FROM node:6
MAINTAINER Krotov Artem <timmson666@mail.ru>

# Copy supervisord.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy src
COPY ./src/ /app/

# Install essentials
RUN apt update && \
    apt dist-upgrade -y && \
    apt install -y apt-transport-https supervisor vim && \
    apt autoremove && \
    apt clean && \
    mkdir -p /var/log/supervisor && \
    mdir /app && \
    cd /app && \
    npm i

# Set the WORKDIR to /app so all following commands run in /app
WORKDIR /app

# Run supervisor
CMD ["/usr/bin/supervisord"]

# Docker image for the php appache server
FROM php:7.0-apache

# Update the package and install vim
RUN apt-get update &&\
    apt-get install -y vim

# Copy the source code of our html website to the directory where
# the appache server will load the website.
COPY src/ /var/www/html/

FROM php:7.0-apache

RUN apt-get update &&\
    apt-get install -y vim

# Adding our apache script in the bin directory
COPY apache2-foreground /usr/local/bin/

# Adding our templates to the apache2 directory of our container.
COPY templates /var/apache2/templates

COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
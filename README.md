# RES-HTTP-Lab
## Step 1
**PHP** Dockerfile [here](https://hub.docker.com/_/php/)

Start container

```bash
$ docker build -t res/apache_php .
$ docker run <-d> -p 8080:80 res/apache_php
```

To test it :

```bash
$ telnet <IP_address> 8080
```

## Step 2
npm init -> package name = students
	    version = 0.1.0
	    decription = Step 2 of the HTTP lab

Use of node 8.11 and the module Chance to get random value

```bash
$ docker build -t res/express_movies
$ docker run res/express_movies
```

## Step 3
```bash
$ docker run -d --name apache_static res/apache_php
$ docker run -d --name express_dynamic res/express_movies
```

Address of the apache container is 172.17.0.2:80
Address of the express container is 172.17.0.3:3000
**This value can be different**

this is the ``001-reverse-proxy.conf`` file

```html
<VirtualHost *:80>
	ServerName demo.res.ch

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	ProxyPass "/api/movies/" "http://172.17.0.3:3000/"
	ProxyPassReverse "/api/movies/" "http://172.17.0.3:3000/"

	ProxyPass "/" "http://172.17.0.2:80/"
	ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>
```

To enable the site :
```bash
$ a2enmod proxy
$ a2enmod proxy_http
$ a2ensite 001*
$ service apache2 reload
```

## Need to check

[Configure Apache Web Server](https://www.digitalocean.com/community/tutorials/how-to-configure-the-apache-web-server-on-an-ubuntu-or-debian-vps)
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
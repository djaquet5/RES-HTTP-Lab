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

Address of the apache container is 172.17.0.2
Address of the express container is 172.17.0.3
**This value can be different**

## Need to check

[Configure Apache Web Server](https://www.digitalocean.com/community/tutorials/how-to-configure-the-apache-web-server-on-an-ubuntu-or-debian-vps)
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
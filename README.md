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
$ docker run -d --name apache_rp res/apache_rp
```

To get ip address

```bash
inspect docker inspect apache_rp | grep -i ipaddress
```

Address of the apache container is 172.17.0.2:80
Address of the express container is 172.17.0.3:3000
Address of the proxy container is 172.17.0.4:8080

**This value can be different**

this is the ``000-default.conf`` file

```html
<VirtualHost *:80>
</VirtualHost>
```

this is the ``001-reverse-proxy.conf`` file

```html
<VirtualHost *:80>
    ServerName demo.res.ch

    #ErrorLog ${APACHE_LOG_DIR}/error.log
    #CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyPass "/api/movies/" "http://172.17.0.3:3000/"
    ProxyPassReverse "/api/movies/" "http://172.17.0.3:3000/"

    ProxyPass "/" "http://172.17.0.2:80/"
    ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>
```

The browser need to send a specific header. To do that, we have to change the DNS configuration :
```bash
$ sudo vi /etc/hosts # Sudo is to give the save right
```

In the hosts file, add the next line :
```
172.17.0.4  demo.res.ch
```

- You have a GitHub repo with everything needed to build the Docker image for the container.
    - Should be OK
- You do a demo, where you start from an "empty" Docker environment (no container running) and where you start 3 containers: static server, dynamic server and reverse proxy; in the demo, you prove that the routing is done correctly by the reverse proxy.
- You can explain and prove that the static and dynamic servers cannot be reached directly (reverse proxy is a single entry point in the infra).
    - doesn't work
- You are able to explain why the static configuration is fragile and needs to be improved.
    - The IP addresses are hard coded, when we launch containers, the addresses can be different
- You have documented your configuration in your report.

## Need to check

[Configure Apache Web Server](https://www.digitalocean.com/community/tutorials/how-to-configure-the-apache-web-server-on-an-ubuntu-or-debian-vps)
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
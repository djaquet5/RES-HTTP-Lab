# RES-HTTP-Lab
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

## Need to check

[Configure Apache Web Server](https://www.digitalocean.com/community/tutorials/how-to-configure-the-apache-web-server-on-an-ubuntu-or-debian-vps)
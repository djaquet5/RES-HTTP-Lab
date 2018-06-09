# RES-HTTP-Lab
## Step 1

In this step, the goal was to create a html webpage and store it in an appache PHP server, located in a docker container. 


#### Dockerfile

We used  the [7.0](https://hub.docker.com/_/php/)  ** apache PHP**  docker image.

Then we created a dockerfile to build our futur container.

```dockerfile
# Loads the docker image for the PHP appache server from DockerHub
FROM php:7.0-apache

# Copy the source code of our html website to the directory where
# the appache server will load the website.
COPY src/ /var/www/html/
```

So, according to our dockerfile, we will have to store our webpage source code in a **src/** directory, located in the same directory as the dockerfile.
To make our webpage less boring, we used [this](https://startbootstrap.com/template-overviews/agency/) template.


#### Build and test

Once our webpage was done, we built and started our docker container, used the following bash command.

```bash
$ docker build -t res/apache_php .					# Builds a new docker image containing the apache php server and our  webpage, that we will name res/apache_php
$ docker run -d -p 8080:80 res/apache_php			# Run our freshly created docker image in background.
```

To test it :

```bash
$ telnet <IP_address> 8080
```

or use directly your webbrowser.

#### Apache configurations

We have the possibility to change the apache configuration, sor we can for example change the directory where we want to store our webpage srouce code. For this, you'll need to run the further commands, once your container is running :

```bash
$ docker exec -it <container_name> /bin/bash		# open your container in a bash

$ cd /etc/apache2/									# Goes to the apaches2 directory, where all the configuration files are located.

$ cd sites-available/
```

in this repository you'll find two configuration file. One of them is called **000-default.conf**. In this file you'll find the configuration your apache server uses to know where to find your website files and on which port it will need to listen : 

```
<VirtualHost *:80>apacheconf
	# The ServerName directive sets the request scheme, hostname and port that
	# the server uses to identify itself. This is used when creating
	# redirection URLs. In the context of virtual hosts, the ServerName
	# specifies what hostname must appear in the request's Host: header to
	# match this virtual host. For the default virtual host (this file) this
	# value is not decisive as it is used as a last resort host regardless.
	# However, you must set it for any further virtual host explicitly.
	#ServerName www.example.com

	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html				# Where the server will search for the website files.

	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
	# error, crit, alert, emerg.
	# It is also possible to configure the loglevel for particular
	# modules, e.g.
	#LogLevel info ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	# For most configuration files from conf-available/, which are
	# enabled or disabled at a global level, it is possible to
	# include a line for only one particular virtual host. For example the
	# following line enables the CGI configuration for this host only
	# after it has been globally disabled with "a2disconf".
	#Include conf-available/serve-cgi-bin.conf
</VirtualHost>

```

## Step 2

For this step, the goal was to create a dynamic web page using node.js , rather then a static one as we did in the step 1.



#### Dockerfile

We used the [8.11](https://hub.docker.com/_/node/)  **node.js**  docker image.

Then we created a dockerfile to build our futur container.

```dockerfile
# Loads the docker image for the node.js framework from DockerHub
FROM node:8.11

# Copy the source code of our node.js application in the /opt/app directory
COPY src /opt/app

# Every time we'll run the container, it will execute the following command.
CMD ["node", "/opt/app/index.js"]

```

#### Apllication

In our source repository, we are first going to run the node commande **npm init**. This command will generate the package.json file, in which we will set the aouthors name, the licences, and the dependencies of our project.

```
npm init ->
	package name = students
	version = 0.1.0
	decription = Step 2 of the HTTP lab
```
	    
#### Build and test

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
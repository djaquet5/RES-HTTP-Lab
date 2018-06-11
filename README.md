# RES-HTTP-Lab
## Step 1 - Static HTTP server with apache httpd

In this step, the goal was to create a html webpage and store it in an appache PHP server, located in a docker container. 


#### Dockerfile

We used  the [7.0](https://hub.docker.com/_/php/)  **apache PHP**  docker image.

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

```xml
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



## Step 2 - Dynamic HTTP server with express.js

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

#### Application

In our source repository, we are first going to run the node commande **npm init**. This command will generate the package.json file, in which we will set the aouthors name, the licences, and the dependencies of our project.

```
npm init ->
	package name = movies
	version = 0.1.0
	decription = Step 2 of the HTTP lab
```

#### Build and test

Use of node 8.11 and the module Chance to get random value

```bash
$ docker build -t res/express_movies
$ docker run res/express_movies
```



## Step 3 - Reverse proxy with apache (static configuration)

For this step, the goal was to create a proxy to reach the containers of the last steps with a single address. We choose to use the same address as the webcast. The address is ``demo.res.ch``.

```bash
$ docker run -d --name apache_static res/apache_php
$ docker run -d --name express_dynamic res/express_movies
$ docker run -d --name apache_rp res/apache_rp
```

### Dockerfile

For this step, we took the same apache PHP image as the step 1.

```dockerfile
FROM php:7.0-apache

COPY conf/ /etc/apache2

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
```

### VirtualHosts

In the ``conf`` folder, we have a folder ``sites-available`` with 2 Virtualhosts inside. The 2 files are ``000-default.conf`` and ``01-reverse-proxy.conf``. The content of these files is below.

```dockerfile
# 000-default.conf
<VirtualHost *:80>
</VirtualHost>
```
```dockerfile
# 001-reverse-proxy.conf
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

We can see in the reverse-proxy configuration file that we hard coded the IP addresses of the two different container. To get the IP addresses

```bash
inspect docker inspect <container_name> | grep -i ipaddress
```

Here's the result :

| Container name  | Address:port    |
| --------------- | --------------- |
| apache_static   | 172.17.0.2:80   |
| express_dynamic | 172.17.0.3:3000 |
| apache_rp       | 172.17.0.4:8080 |

**This value can be different depending on wich container we start first and if we have different containers running.**

### Hosts file

The browser need to send a specific header to know where redirect the request. To do that, we have to change the DNS configuration :
```bash
$ sudo vi /etc/hosts # Sudo is to give the save right
```

This is the content of the hosts file
```dockerfile
172.17.0.4	demo.res.ch				# New line added
127.0.0.1	localhost
127.0.1.1	lc-VirtualBox

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

### Problem in the configuration

The configuration is fragile because the IP addresses that we wrote in the ``hosts`` dans the virtualhost file.

We can improve the configuration by setting the addresses dynamically. The configuration will be improved in the step 5

### Build it and test it

```bash
$ docker run --name apache_static res/apache_php
$ docker run --name express_dynamic res/express_movies
$ docker build -t res/apache_rp .
$ docker run --name apache_rp -p 8080:80 res/apache_rp
```

Then, to test it, you have to launch a browser and navigate on the address ``demo.res.ch:8080`` to access to the ``apache_static`` container and navigate on the address ``demo.res.ch:8080/api/movies/`` to access to the ``express_dynamic`` container.

# You can explain and prove that the static and dynamic servers cannot be reached directly (reverse proxy is a single entry point in the infra). - DOES NOT WORK



## Step 4 - AJAX requests with JQuery

For this step, the goal is to setup an AJAX request with JQuery. The request will display the first movie get in the ``demo.res.ch/api/movies/`` page.

### Javascript

We create the javascript file in the ``apache-php-image/src/js/`` folder with the others javascript files. Below, the content of the file ``movies.js``

```javascript
$(function(){
    console.log("Loading movies...");

    function loadMovies(){
        $.getJSON( "/api/movies/", function( movies ) {
            console.log(movies);

            var message = "No movie is planned :(";

            if(movies.length > 0)
                message = movies[0].name;

            $("#movies").text("Next movies: " + message);
        });
    }

    loadMovies();
    setInterval(loadMovies, 2000);

    console.log("Movies loaded");
});
```

When the page is ready, we get some random movies from the page ``/api/movies/``. Then, we edit a HTML tag to write the next movie. We display only the name of the first movie like shown in the webcast by accessing the tag with the id ``movies``. In the last part, we set an interval to reload the movies. Here, we reload the movies every 2 seconds.

### HTML

To see the movies, we edit the header to add a ``span`` tag with the id ``movies`` as shown below : 

```html
<!-- Header -->
<header class="masthead">
	<div class="container">
		<div class="intro-text">
			<div class="intro-lead-in">Welcome To Our Laboratory HTTP!</div>
			<div class="intro-heading text-uppercase">It's Nice To Meet You</div>
			<span>As you can see, we didn't take the same as you in the webcast ;-)</span>
            <br />
            <span id="movies"></span>
        </div>
    </div>
</header>
```

Then we import the javascript file :

``` html
<!-- Custom script to load movies -->
<script src="js/movies.js"></script>
```

### Test it

To test the AJAX request, start by running the container. Be careful to start its in the right order :

```bash
$ docker run --name apache_static res/apache_php
$ docker run --name express_dynamic res/express_movies
$ docker run --name apache_rp -p 8080:80 res/apache_rp
```

Then, access to the address ``demo.res.ch`` with a web browser and see the last text in the header change every 2 seconds.

## Need to check

[Configure Apache Web Server](https://www.digitalocean.com/community/tutorials/how-to-configure-the-apache-web-server-on-an-ubuntu-or-debian-vps)
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
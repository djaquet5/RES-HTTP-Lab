var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

var OS = require('os');

app.get('/', function(req, res){
	res.send(generateMovies());
});

app.listen(3000, function(){
	console.log("Accepting HTTP requests on port 3000.");
});


function generateMovies(){
	var nbMovies = generateRandomInt(1, 10);
	var movies = [];

    var ifaces = OS.networkInterfaces();
    var ipAddress = "Pas d'IP :(";

    Object.keys(ifaces).forEach(function (ifname) {

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            ipAddress = iface.address;
        })
	});

	for(var i = 0; i < nbMovies; i++){
		movies.push({
			name: chance.word({syllables: 3}),
			plot: chance.sentence(),
			description: chance.paragraph(),
			duration: generateRandomInt(80, 200),
			actors: generateActors(),
			ipAddress: ipAddress
		});
	}

	console.log(movies);
	return movies;
}

function generateActors(){
	var nbActors = generateRandomInt(1, 5);
	var actors = [];
	
	for(var i = 0; i < nbActors; i++){
		actors.push({
			firstName: chance.first(),
			lastName: chance.last(),
			age: chance.age({type: 'adult'})
		});
	}
	
	return actors;
}

function generateRandomInt(minValue, maxValue){
	return chance.integer({
		min: minValue,
		max: maxValue
	});
}
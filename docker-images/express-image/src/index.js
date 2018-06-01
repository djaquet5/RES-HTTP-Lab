var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send(generateMovies());
});

app.listen(3000, function(){
	console.log("Accepting HTTP requests on port 3000.");
});


function generateMovies(){
	var nbMovies = generateRandomInt(1, 10);
	var movies = [];

	for(var i = 0; i < nbMovies; i++){
		movies.push({
			name: chance.word({syllables: 3}),
			plot: chance.sentence(),
			description: chance.paragraph(),
			duration: generateRandomInt(80, 200),
			actors: generateActors()
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
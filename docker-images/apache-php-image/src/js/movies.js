$(function(){
    console.log("Loading movies...");

    function loadMovies(){
        $.getJSON( "/api/movies/", function( movies ) {
            console.log(movies);

            var message = "No movie is planned :(";
            var express = "";

            if(movies.length > 0){
                message = movies[0].name;
                express = movies[0].ipAddress;
            }

            $("#movies").text("Next movies: " + message);
            $("#host").text("Express IP: " + express);
        });
    }

    loadMovies();
    setInterval(loadMovies, 2000);

    console.log("Movies loaded");
});
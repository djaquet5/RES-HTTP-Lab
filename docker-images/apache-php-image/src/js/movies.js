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
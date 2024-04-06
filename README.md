# CIS 5500 Final Project

## Introduction

With the increased prevalence of streaming platforms and direct-to-streaming movies, consumers can no longer go to a single site to browse movies offered across platforms. For movie-lovers new and old, the breadth of streaming options is great, but also creates issues in helping consumers find the movies they want to watch. Our application is a centralized place that streamlines the customer experience by allowing them to search through all movies available online, get recommendations based on their preferences and watch history, and identify which platforms to watch movies on.

## Features

Our final project will include the following features:

- Users have a variety of filtering options to search for movies, both if they have a particular move in mind (searching by title), or are more generally interested in movies and movie facts, for which they can search along various other dimensions such as actor, release, genre, etc.
- Users can identify the streaming platforms a movie is present on, which will direct them to a specific place. 
- Users can enter a list of movies they like and get recommendations for other similar movies to watch based on movie tags. Recommendations can be on a variety of dimensions, including not only genre, but also language, actor, director, production company, etc. We hope that this feature will help users learn more about themselves and what draws them to particular movies. 

## Web Application Pages

Our final project will consist of the following pages:

- **Browse page**: The browse page serves as the homepage of the application, and hosts a catalog of popular movies by category (i.e., movie genre, themes, etc.).
- **Search page**: Users can search for movies based on a variety of filters, such as title, popularity, release status, year, tags, language, etc. 
- **Recommendations page**: Users will enter a list of movies they like or have watched, and the movies will populate into a box as they enter them, as well as populate aggregate statistics ranked in order of most to least occurrences. Then the user will click a button to confirm the submission and the recommendations will be updated. 
- **Movie info page**: There is a movie info page for each movie, which users can enter either through the browse page or the search page. The movie info page will display basic information about the movie (title, summary, etc.) as well as the platforms where the movie can be viewed.

## Structure and directory outline

`data/`: Contains flat files that were uploaded to the MySQL database, as well as the data cleaning script (in R). 

`client/`: Contains source code and dependencies for the application frontend. Most of the code will be located in `client/src/`.

`server/`: Contains source code and dependencies for the application backend.


## Running the probject

This project can be ran using `npm start`.

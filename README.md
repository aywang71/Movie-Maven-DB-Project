# Movie Maven

## Introduction
With the increased prevalence of streaming platforms and direct-to-streaming movies, today's consumer has a wide range of methods and places to watch movies. While this cornucopia of variety provides a lot of options for the consumer, it also creates issues in helping consumers find the movies they want to watch as well as finding where to watch them. Our application is a centralized place that streamlines the customer experience by allowing them to search through all movies available online, get recommendations based on their preferences and watch history, and identify which platforms to watch movies on. Not only will it serve as a movie repository for movie-lovers, but it also helps users find platforms and streaming services, whether it be to stream, rent, or purchase a movie.

The functionality of our application, Movie Maven, allows users to explore movies, genres, and streaming providers and gather information about them. They can search for movies satisfying a set of criteria, get recommendations, explore analytics.

## Technologies
Our application makes use of a variety of tools and technologies:
- **Database:** MySQL hosted on AWS RDS
- **Data Preprocessing:** Python and R
- **API:** TMDb API for querying streaming data
- **Backend:** Node.js with Express
- **Frontend:** React with Material UI component library
- **Other:** JavaScript

## Application Pages

### Browse Page
Displays top movies that users can click on to learn more. Includes sections for top movies of any genre and top movies for certain popular genres.

### Movie Information Page
Displays detailed information for the selected movie including overview, link to IMDB page, genres, summary statistics, and streaming providers.

### Random Movie Information Page
Loads information page for a random movie.

### Genre Information Page
Displays aggregate information about movies with the selected genre and a list of top movies in that genre.

### Provider Information Page
Displays aggregate information about movies available on the selected provider and a list of top movies available to stream.

### Search Page
Allows users to input criteria such as genres, providers, vote count range, vote average range, release date range, and adult content flag to find top movies that satisfy the criteria.

### Binge Watch Page
Allows users to input genres, providers, available time, and runtime range to get a schedule of movies maximizing vote average that they can watch in the available time.

### Recommendations Page
Allows users to input a list of movies and returns a list of top recommended movies and best platforms to stream them.

### Movie Analytics Page
Allows users to input a list of movies and returns aggregate statistics for the provided movies.

### Category Analytics Page
Allows users to select genres, providers, and languages to get aggregate statistics for movies that satisfy the criteria.

## Repository Structure

The Movie Maven project follows a structured organization to maintain clarity and ease of development. Below is an overview of the repository structure:

- **server:** This directory contains all the backend code for the application. It includes server-side logic, API routes, and database configurations written primarily in Node.js with Express.

- **client:** The client directory houses the frontend code for Movie Maven. It is further divided into the following subdirectories:

  - **components:** This directory holds reusable React components that are used across multiple pages of the application.

  - **pages:** The pages directory contains individual React components representing different pages of the Movie Maven web application.
    
- **data:** This directory stores data files used for preprocessing and cleaning during the initial setup of the application. Scripts written in Python and R are used to process this data and prepare it for integration into the database.

This structured repository organization ensures that the backend, frontend, and data processing components of the Movie Maven project are well-organized and easily navigable for developers working on the project.

## Running the Project Locally

To run the Movie Maven project locally on your machine, follow these steps:

1. **Clone the Repository:** Begin by cloning the Movie Maven repository to your local machine using Git. You can do this by running the following command in your terminal:

    ```
    git clone https://github.com/aywang71/CIS-5500-Final-Project.git
    ```

2. **Navigate to Server Directory:** Open a terminal window and navigate to the `server` directory within the cloned repository:

    ```
    cd CIS-5500-Final-Project/server
    ```

3. **Install Dependencies:** Before starting the server, ensure that all necessary dependencies are installed. You can do this by running the following command:

    ```
    npm install
    ```

4. **Start the Server:** Once the dependencies are installed, start the server by running the following command:

    ```
    npm start
    ```

5. **Open a New Terminal:** With the server running, open a new terminal window.

6. **Navigate to Client Directory:** In the new terminal window, navigate to the `client` directory within the cloned repository:

    ```
    cd CIS-5500-Final-Project/client
    ```

7. **Install Dependencies:** Similarly, ensure that all dependencies for the client-side of the application are installed by running:

    ```
    npm install
    ```

8. **Start the Client:** Once the dependencies are installed, start the client by running:

    ```
    npm start
    ```

9. **Access the Application:** After following these steps, you should be able to access the Movie Maven application locally by navigating to `http://localhost:3000` in your web browser.

By following these steps, you can run the Movie Maven project locally on your machine for development or testing purposes.

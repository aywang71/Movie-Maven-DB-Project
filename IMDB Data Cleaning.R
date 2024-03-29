setwd("C:/Users/hyper/OneDrive/Documents/GitHub/CIS-5500-Final-Project/data")

library(tidyverse)

df <- read.csv("TMDB_movie_dataset_v11.csv")

#We are going to remove cancelled movies
df <- df  %>% filter(status != "Canceled")

sum(is.na(df))

str(df)

movies <- df %>% select(id, title, vote_average, vote_count, status, release_date, revenue, budget, runtime, adult, tagline, overview, original_language, popularity, imdb_id, poster_path)

genres <- df %>% select(id, genres)
genres$genre <- genres$genres
genres$genres <- NULL
genres <- genres %>% separate_rows(genre, sep = ",\\s*")

write.csv(genres, "genres.csv")

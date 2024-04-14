import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import configuration from "../configuration";

interface Confifuration {
  images: {
    base_url: string;
  };
}

interface MovieDetails {
  id: number;
  title: string;
  popularity: number;
  overview: string;
  backdrop_path?: string;
  image?: string;
}

interface MoviesState {
  results: MovieDetails[];
  page: number;
  hasMorePages: boolean;
}

export interface MoviesFilters {
  keywords?: number[];
}

export interface MoviesQuery {
  page: number;
  filters: MoviesFilters;
}

interface KeywordsItem {
  id: number;
  name: string;
}

interface PageResponse<TResult> {
  page: number;
  results: TResult[];
  total_pages: number;
}

interface Genre{
    id: number;
    name: string;
}

export const tmdbApi =createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${configuration.apiUrl}/3`,
    prepareHeaders(headers) {
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${configuration.apiToken}`);
    },
  }),
  endpoints: (builder) => ({
    getConfiguration: builder.query<Confifuration, void>({
      query: () => "/configuration",
    }),
    getMovies: builder.query<MoviesState, MoviesQuery>({
      query(moviesQuery) {
        const params = new URLSearchParams({
          page: moviesQuery.page.toString(),
        });
        if (moviesQuery.filters.keywords?.length) {
          params.append("with_keywords", moviesQuery.filters.keywords.join("|"));
        }
        if (moviesQuery.filters.genres?.length) {
          params.append("with_genres", moviesQuery.filters.genres.join(","));
        }
        const query = params.toString();
        const path = `/discover/movie?${query}`;
        return path;
        },
        transformResponse: (response: PageResponse<MovieDetails>, _, arg){
                return {
      results: response.results,
      LastPage: response.page,
      hasMorePages: arg.page < response.total_pages,
    };
        }
    }),
    getKeywords: builder.query<KeywordsItem[], string>({
      query: (queryText) => `/search/keyword?query=${queryText}`,
      transformResponse: (response: PageResponse<KeywordsItem>) => response.results,
    }),
      getGenres: builder.query<Genre[], void>({
          query: () => "/genre/movie/list",
          transformResponse:(response:{genres:Genre[]})=> response.genres
    })
  }),
});

export const { useGetGenresQuery, useGetConfigurationQuery, useGetKeywordsQuery, useGetMoviesQuery} = tmdbApi;

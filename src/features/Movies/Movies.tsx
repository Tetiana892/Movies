import MovieCard from "./MovieCard";
import { useCallback, useContext, useState } from "react";
import { Container } from "@mui/system";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntesectionObserver";
import { MoviesFilter } from "./MoviesFilter";
import {
  MoviesQuery,
  useGetConfigurationQuery,
  useGetMoviesQuery,
  MoviesFilters,
} from "../../services/tmdb";

const initialQuery: MoviesQuery = {
  page: 1,
  filters: {},
};

export default function Movies() {
  const [query, setQuery] = useState<MoviesQuery>(initialQuery);

  const { data: configuration } = useGetConfigurationQuery();
  const { data, isFetching } = useGetMoviesQuery(query);

  const movies = data?.results ?? [];
  const hasMorePages = data?.hasMorePages;

  function formatImageUrl(path?: string, configuration?: any) {
    return path && configuration ? `${configuration.images.base_url}w780${path}` : undefined;
  }

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;

  const onIntersect = useCallback(() => {
    if (hasMorePages) {
      setQuery((q) => ({ ...q, page: q.page + 1 }));
    }
  }, [hasMorePages]);

  const [targetRef] = useIntersectionObserver({ onIntersect });

  const handlerAddToFavorite = useCallback(
    (id: number) => {
      alert(`Not implemented! Action:${user.name} is adding movies ${id} to favorites`);
    },
    [user.name]
  );

  return (
    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
      <Grid item xs="auto">
        <MoviesFilter
          onApply={(f) => {
            const moviesFilter: MoviesFilters = {
              keywords: f.keywords.map((k) => k.id),
              genres: f.genres,
            };
            setQuery({
              page: 1,
              filters: moviesFilter,
            });
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Container sx={{ py: 8 }} maxWidth="lg">
          {!isFetching && !movies.length && (
            <Typography variant="h6">No movies were found that mach your query.</Typography>
          )}
          <Grid container spacing={4}>
            {movies.map((m, i) => (
              <Grid item key={`${m.id}-${i}`} xs={12} sm={6} md={4}>
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  overview={m.overview}
                  popularity={m.popularity}
                  image={formatImageUrl(m.backdrop_path, configuration)}
                  enableUserActions={loggedIn}
                  onAddFavorite={handlerAddToFavorite}
                />
              </Grid>
            ))}
          </Grid>
          <div ref={targetRef}>
            {isFetching && <LinearProgress color="secondary" sx={{ mt: 3 }} />}
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}

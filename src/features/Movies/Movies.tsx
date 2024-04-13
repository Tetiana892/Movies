import { Movie, fetchNextPage, resetMovies } from "../../reducers/moviesSlice";
import { connect } from "react-redux";
import { RootState } from "../../store";
import MovieCard from "./MovieCard";

import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Container } from "@mui/system";
import { Grid, LinearProgress } from "@mui/material";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useIntersectionObserver } from "../../hooks/useIntesectionObserver";
import { Filters, MoviesFilter } from "./MoviesFilter";

interface MoviesProps {
  movies: Movie[];
  loading: boolean;
}

export function Movies({ movies, loading }: MoviesProps) {
  const [filters, setFilters] = useState<Filters>();
  const dispatch = useAppDispatch();

  // const movies = useAppSelector((state) => state.movies.top);
  // const loading = useAppSelector((state) => state.movies.loading);
  const hasMorePages = useAppSelector((state) => state.movies.hasMorePages);

  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;

  const [targetRef, entry] = useIntersectionObserver();

  useEffect(() => {
    dispatch(resetMovies());
  }, [dispatch]);

  useEffect(() => {
    if (entry?.isIntersecting && hasMorePages) {
      const moviesFilters = filters
        ? {
            keywords: filters.keywords.map((k) => k.id),
          }
        : undefined;
      dispatch(fetchNextPage(moviesFilters));
    }
  }, [dispatch, entry?.isIntersecting, hasMorePages, filters]);

  return (
    <Grid container spacing={2} sx={{ flexWrap: "nowrap" }}>
      <Grid item xs="auto">
        <MoviesFilter
          onApply={(f) => {
            dispatch(resetMovies());
            setFilters(f);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={4}>
            {movies.map((m) => (
              <Grid item key={m.id} xs={12} sm={6} md={4}>
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  overview={m.overview}
                  popularity={m.popularity}
                  image={m.image}
                  enableUserActions={loggedIn}
                />
              </Grid>
            ))}
          </Grid>
          <div ref={targetRef}>
            {loading && <LinearProgress color="secondary" sx={{ mt: 3 }} />}
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: RootState) => ({
  movies: state.movies.top,
  loading: state.movies.loading,
});

const connector = connect(mapStateToProps);

export default connector(Movies);

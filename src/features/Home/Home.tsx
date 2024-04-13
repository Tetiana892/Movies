import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext, anonymousUser } from "../../AuthContext";
import { useContext } from "react";
import { Copyright } from "@mui/icons-material";

export default function Home() {
  const { user } = useContext(AuthContext);
  const loggedIn = user !== anonymousUser;

  const greeting = loggedIn
    ? `${user.name}, explore movies today whis us!`
    : "Explore movies today whis us!";

  return (
    <Box sx={{ bgcolor: "background.paper", pt: 8, pb: 8 }}>
      <Container maxWidth="sm">
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          {greeting}
        </Typography>
        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button component={RouterLink} to="/movies" variant="contained" color="secondary">
            Explore
          </Button>
        </Stack>
      </Container>
      <Container
        maxWidth="md"
        component="footer"
        sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, mt: 8, py: [3, 6] }}
      >
        <Typography align="center" color="text.secondary" sx={{ pt: 4 }} paragraph>
          Copyright <Copyright />
          The Movies 2024
        </Typography>
      </Container>
    </Box>
  );
}

import { Container } from "@mui/material";
import CoutdownText from "./CoutdownText";
import { CountdownVideo } from "./CoundownVideo";
import MapView from "./MapView";

export function About() {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <CoutdownText />
      <CountdownVideo />
      <MapView />
    </Container>
  );
}

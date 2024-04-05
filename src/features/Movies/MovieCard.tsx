import { Link } from "react-router-dom";

interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  popularity: number;
}

function MovieCard({ id, title, overview, popularity }: MovieCardProps) {
  return (
    <div className="Movies-card">
      <Link to={`/movies/${id}`}>{title}</Link>
      <h2 className="Movies-card-overview ">{overview}</h2>
      <h3 className="Movies-card-popularity">{popularity}</h3>
    </div>
  );
}

export default MovieCard;

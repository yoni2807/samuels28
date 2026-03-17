import { useState, useEffect } from 'react';
import StarRating from './StarRating';

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_IMG = 'https://image.tmdb.org/t/p/w300';

function usePoster(title, year) {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${year}`
        );
        const data = await res.json();
        if (data.results?.[0]?.poster_path) {
          setPoster(TMDB_IMG + data.results[0].poster_path);
        }
      } catch {}
    };
    fetchPoster();
  }, [title, year]);

  return poster;
}

export default function MovieCard({ movie, onClick }) {
  const poster = usePoster(movie.title, movie.year);

  return (
    <div className={`movie-card ${movie.status}`} onClick={onClick}>
      <div className="movie-card-inner">
        <div className="movie-poster-wrap">
          {poster
            ? <img src={poster} alt={movie.title} className="movie-poster" />
            : <div className="movie-poster-placeholder">🎬</div>
          }
          <span className={`status-badge ${movie.status}`}>
            {movie.status === 'seen' ? '✓ Seen' : movie.status === 'scheduled' ? '◷' : '○'}
          </span>
        </div>
        <div className="movie-card-info">
          <div className="movie-card-header">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-year">{movie.year}</div>
          </div>
          <div className="movie-director">{movie.director}</div>
          <div className="movie-genre">{movie.genre}</div>
          {movie.status === 'seen' && (
            <StarRating rating={movie.rating} readonly />
          )}
          {movie.scheduledDate && movie.status === 'scheduled' && (
            <span style={{ fontSize: '0.75rem', color: '#4a7c9e', fontFamily: 'Courier Prime, monospace' }}>
              📅 {movie.scheduledDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
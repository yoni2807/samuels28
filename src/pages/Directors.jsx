import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';

export default function Directors({ movies, markSeen, markUnseen, scheduleMovie, setRating, setNotes, removeMovie }) {
  const [selected, setSelected] = useState(null);

  const byDirector = movies.reduce((acc, movie) => {
    if (!acc[movie.director]) acc[movie.director] = [];
    acc[movie.director].push(movie);
    return acc;
  }, {});

  const directors = Object.entries(byDirector)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="main-content">
      <h1 className="page-title">Directors</h1>
      <p className="page-subtitle">— browse by auteur —</p>

      {directors.map(([director, films]) => (
        <div key={director} className="director-section">
          <div className="director-name">
            {director}
            <span className="director-count">
              {films.filter(f => f.status === 'seen').length}/{films.length} seen
            </span>
          </div>
          <div className="movies-grid">
            {films.map(movie => (
              <MovieCard key={movie.id} movie={movie} onClick={() => setSelected(movie)} />
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <MovieModal
          movie={movies.find(m => m.id === selected.id) || selected}
          onClose={() => setSelected(null)}
          onMarkSeen={markSeen}
          onMarkUnseen={markUnseen}
          onSchedule={scheduleMovie}
          onRate={setRating}
          onNotes={setNotes}
          onRemove={removeMovie}
        />
      )}
    </div>
  );
}
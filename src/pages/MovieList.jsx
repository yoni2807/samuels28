import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddMovieModal from '../components/AddMovieModal';
import RandomModal from '../components/RandomModal';

const FILTERS = ['all', 'unseen', 'seen', 'scheduled'];

export default function MovieList({ movies, stats, addMovie, removeMovie, markSeen, markUnseen, scheduleMovie, setRating, setNotes, getRandomUnwatched }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);
  const [showRandom, setShowRandom] = useState(false);

  const handleRandom = () => {
    setRandomMovie(getRandomUnwatched());
    setShowRandom(true);
  };

  const filtered = movies.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.director.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pct = stats.total ? Math.round((stats.seen / stats.total) * 100) : 0;

  return (
    <div className="main-content">
      <h1 className="page-title">The Collection</h1>
      <p className="page-subtitle">— a curated registry of cult cinema —</p>

      <div className="progress-section">
        <span className="progress-text">{stats.seen} / {stats.total} FILMS</span>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span style={{ fontFamily: 'Special Elite, cursive', color: 'var(--aged)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          {pct}% complete
        </span>
      </div>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${stats.total})` : ''}
            {f === 'seen' ? `Seen (${stats.seen})` : ''}
            {f === 'unseen' ? `Unseen (${stats.unseen})` : ''}
            {f === 'scheduled' ? `Scheduled (${stats.scheduled})` : ''}
          </button>
        ))}
        <input
          className="search-input"
          placeholder="Search title or director..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="random-btn" onClick={handleRandom}>🎲 Pick for me</button>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Film</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎞️</div>
          <p className="empty-state-text">No films found</p>
        </div>
      ) : (
        <div className="movies-grid">
          {filtered.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={() => setSelected(movie)} />
          ))}
        </div>
      )}

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
      {showAdd && <AddMovieModal onClose={() => setShowAdd(false)} onAdd={addMovie} />}
      {showRandom && (
        <RandomModal
          movie={randomMovie}
          onClose={() => setShowRandom(false)}
          onPick={() => setRandomMovie(getRandomUnwatched())}
          onOpen={(m) => setSelected(m)}
        />
      )}
    </div>
  );
}
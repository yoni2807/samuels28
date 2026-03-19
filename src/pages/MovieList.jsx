import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import AddMovieModal from '../components/AddMovieModal';
import RandomModal from '../components/RandomModal';

const FILTERS = ['all', 'unseen', 'seen', 'scheduled'];
const GENRES = ['All Genres', 'Action', 'Anime', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Sci-Fi', 'Thriller', 'War', 'Western'];
const DECADES = ['All Decades', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export default function MovieList({ movies, stats, addMovie, removeMovie, markSeen, markUnseen, scheduleMovie, setRating, setNotes, getRandomUnwatched }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedDecade, setSelectedDecade] = useState('All Decades');
  const [selectedDirector, setSelectedDirector] = useState('All Directors');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [randomMovie, setRandomMovie] = useState(null);
  const [showRandom, setShowRandom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleRandom = () => {
    setRandomMovie(getRandomUnwatched());
    setShowRandom(true);
  };

  const directors = ['All Directors', ...new Set(movies.map(m => m.director))].sort();

  const filtered = movies.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase()) && !m.director.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedGenre !== 'All Genres' && m.genre !== selectedGenre) return false;
    if (selectedDirector !== 'All Directors' && m.director !== selectedDirector) return false;
    if (selectedDecade !== 'All Decades') {
      const decade = Math.floor(m.year / 10) * 10;
      if (`${decade}s` !== selectedDecade) return false;
    }
    return true;
  });

  const pct = stats.total ? Math.round((stats.seen / stats.total) * 100) : 0;

  const clearFilters = () => {
    setFilter('all');
    setSearch('');
    setSelectedGenre('All Genres');
    setSelectedDecade('All Decades');
    setSelectedDirector('All Directors');
  };

  const hasActiveFilters = filter !== 'all' || search || selectedGenre !== 'All Genres' || selectedDecade !== 'All Decades' || selectedDirector !== 'All Directors';

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
        {sidebarOpen && (
          <>
            <div className="sidebar-logo">
              <div className="sidebar-film-icon">🎞</div>
              <div className="sidebar-title">FILTER</div>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Search</div>
              <input className="sidebar-search" placeholder="Title or director..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Status</div>
              {FILTERS.map(f => (
                <button key={f} className={`sidebar-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  <span className="sidebar-filter-dot" data-status={f} />
                  {f === 'all' ? `All (${stats.total})` : f === 'seen' ? `Seen (${stats.seen})` : f === 'unseen' ? `Unseen (${stats.unseen})` : `Scheduled (${stats.scheduled})`}
                </button>
              ))}
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Genre</div>
              <select className="sidebar-select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Decade</div>
              <select className="sidebar-select" value={selectedDecade} onChange={e => setSelectedDecade(e.target.value)}>
                {DECADES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Director</div>
              <select className="sidebar-select" value={selectedDirector} onChange={e => setSelectedDirector(e.target.value)}>
                {directors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {hasActiveFilters && <button className="sidebar-clear-btn" onClick={clearFilters}>✕ Clear Filters</button>}
            <div className="sidebar-section" style={{ marginTop: 'auto' }}>
              <button className="sidebar-random-btn" onClick={handleRandom}>🎲 Pick for me</button>
              <button className="sidebar-add-btn" onClick={() => setShowAdd(true)}>+ Add Film</button>
            </div>
          </>
        )}
      </aside>

      {/* Main */}
      <main className="main-area">
        {/* Hero */}
        <div className="hero-section">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title">CULT<span>CINEMA</span></h1>
            <p className="hero-subtitle">a curated registry of cult cinema</p>
            <div className="hero-progress">
              <span className="hero-progress-text">{stats.seen} / {stats.total} films watched</span>
              <div className="hero-progress-bar">
                <div className="hero-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="hero-progress-pct">{pct}%</span>
            </div>
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="mobile-filter-bar">
          <input
            className="mobile-search"
            placeholder="🔍 Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="mobile-filter-toggle" onClick={() => setShowMobileFilters(!showMobileFilters)}>
            {showMobileFilters ? '✕' : '⚙ Filters'}
            {hasActiveFilters && <span className="mobile-filter-dot" />}
          </button>
          <button className="mobile-add-btn" onClick={() => setShowAdd(true)}>+</button>
          <button className="mobile-random-btn" onClick={handleRandom}>🎲</button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="mobile-filters-panel">
            <div className="mobile-filters-row">
              {FILTERS.map(f => (
                <button key={f} className={`mobile-status-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? `All (${stats.total})` : f === 'seen' ? `Seen (${stats.seen})` : f === 'unseen' ? `Unseen (${stats.unseen})` : `📅 (${stats.scheduled})`}
                </button>
              ))}
            </div>
            <div className="mobile-filters-row">
              <select className="mobile-select" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
              <select className="mobile-select" value={selectedDecade} onChange={e => setSelectedDecade(e.target.value)}>
                {DECADES.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {hasActiveFilters && (
              <button className="mobile-clear-btn" onClick={clearFilters}>✕ Clear All Filters</button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="content-area">
          <div className="results-bar">
            <span className="results-count">{filtered.length} film{filtered.length !== 1 ? 's' : ''}{hasActiveFilters && ' (filtered)'}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-icon">🎞️</span>
              <p className="empty-state-text">No films found</p>
              {hasActiveFilters && <button className="btn btn-secondary" onClick={clearFilters} style={{ marginTop: '1rem' }}>Clear filters</button>}
            </div>
          ) : (
            <div className="movies-grid">
              {filtered.map(movie => (
                <MovieCard key={movie.id} movie={movie} onClick={() => setSelected(movie)} />
              ))}
            </div>
          )}
        </div>
      </main>

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
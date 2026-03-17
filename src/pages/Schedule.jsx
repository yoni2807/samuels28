import { useState } from 'react';
import MovieModal from '../components/MovieModal';

export default function Schedule({ movies, markSeen, markUnseen, scheduleMovie, setRating, setNotes, removeMovie }) {
  const [selected, setSelected] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const scheduled = movies
    .filter(m => m.status === 'scheduled' && m.scheduledDate)
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  const upcoming = scheduled.filter(m => m.scheduledDate >= today);
  const past = scheduled.filter(m => m.scheduledDate < today);

  const Section = ({ title, items }) => (
    <div style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: 'var(--aged)', letterSpacing: '0.1em', marginBottom: '1rem' }}>
        {title}
      </h2>
      {items.length === 0 ? (
        <div style={{ fontFamily: 'Special Elite, cursive', color: 'var(--aged)', opacity: 0.6, padding: '1rem 0' }}>
          Nothing here yet.
        </div>
      ) : (
        <div className="schedule-grid">
          {items.map(movie => (
            <div key={movie.id} className="schedule-card" onClick={() => setSelected(movie)}>
              <div className="schedule-date">{movie.scheduledDate}</div>
              <div className="schedule-movie-title">{movie.title}</div>
              <div style={{ fontFamily: 'Special Elite, cursive', fontSize: '0.82rem', color: 'var(--aged)', marginTop: '0.25rem' }}>
                dir. {movie.director} · {movie.year}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="main-content">
      <h1 className="page-title">Watch Schedule</h1>
      <p className="page-subtitle">— planned screenings —</p>

      {scheduled.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-text">No films scheduled yet. Open a film and set a date.</p>
        </div>
      ) : (
        <>
          <Section title="Upcoming" items={upcoming} />
          {past.length > 0 && <Section title="Overdue" items={past} />}
        </>
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
    </div>
  );
}
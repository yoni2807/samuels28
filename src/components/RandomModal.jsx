export default function RandomModal({ movie, onClose, onPick, onOpen }) {
  if (!movie) return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📽️</div>
        <h2 className="modal-title">No films left!</h2>
        <p style={{ fontFamily: 'Special Elite, cursive', color: 'var(--aged)' }}>You've seen everything. Impressive.</p>
        <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '1.5rem' }}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="film-strip">
          {Array.from({ length: 30 }).map((_, i) => <div key={i} className="film-hole" />)}
        </div>

        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div style={{ fontFamily: 'Special Elite, cursive', color: 'var(--aged)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            TONIGHT'S FEATURE
          </div>
          <div className="random-film-title">{movie.title}</div>
          <div style={{ fontFamily: 'Special Elite, cursive', color: 'var(--aged)', marginBottom: '0.25rem' }}>
            dir. {movie.director} · {movie.year}
          </div>
          <div className="movie-genre">{movie.genre}</div>
        </div>

        <div className="film-strip" style={{ transform: 'scaleX(-1)' }}>
          {Array.from({ length: 30 }).map((_, i) => <div key={i} className="film-hole" />)}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={() => { onOpen(movie); onClose(); }}>Open Film</button>
          <button className="btn btn-secondary" onClick={onPick}>Pick Another</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
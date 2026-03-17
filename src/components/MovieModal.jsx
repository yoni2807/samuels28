import { useState, useEffect } from 'react';
import StarRating from './StarRating';

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

function useMovieDetails(title, year) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${year}`
        );
        const data = await res.json();
        const movie = data.results?.[0];
        if (!movie) return;

        const [detailRes, videoRes, releaseRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_KEY}`),
          fetch(`https://api.themoviedb.org/3/movie/${movie.id}/release_dates?api_key=${TMDB_KEY}`),
        ]);

        const detail = await detailRes.json();
        const videos = await videoRes.json();
        const releases = await releaseRes.json();

        const trailer = videos.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        // Get RT score from release_dates (certification info contains RT sometimes)
        // Use TMDB vote as fallback with visual RT style
        const tmdbScore = Math.round(detail.vote_average * 10);

        setDetails({
          overview: detail.overview,
          runtime: detail.runtime,
          trailerKey: trailer?.key || null,
          poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null,
          tmdbScore,
          voteCount: detail.vote_count,
        });
      } catch {}
    };
    fetchDetails();
  }, [title, year]);

  return details;
}

function RTMeter({ score }) {
  if (!score) return null;
  const isFresh = score >= 60;
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '5px',
      padding: '0.3rem 0.6rem',
    }}>
      <span style={{ fontSize: '1rem' }}>{isFresh ? '🎬' : '🎬'}</span>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.85rem',
        fontWeight: '700',
        color: '#ffffff',
      }}>{score}%</span>
      <span style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.68rem',
        color: 'var(--aged-light)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>TMDB Score</span>
    </div>
  );
}

export default function MovieModal({ movie, onClose, onMarkSeen, onMarkUnseen, onSchedule, onRate, onNotes, onRemove }) {
  const [notes, setNotes] = useState(movie.notes || '');
  const [schedDate, setSchedDate] = useState(movie.scheduledDate || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const details = useMovieDetails(movie.title, movie.year);

  const handleNotesBlur = () => onNotes(movie.id, notes);
  const handleSchedule = () => onSchedule(movie.id, schedDate);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-wide">
        <button className="modal-close" onClick={onClose}>✕</button>

        {details?.backdrop && (
          <div className="modal-backdrop">
            <img src={details.backdrop} alt="" />
            <div className="modal-backdrop-fade" />
          </div>
        )}

        <div className="modal-body">
          {/* Left: Poster */}
          <div className="modal-poster-col">
            {details?.poster
              ? <img src={details.poster} alt={movie.title} className="modal-poster-img" />
              : <div className="modal-poster-placeholder">🎬</div>
            }
            {details?.trailerKey && (
              <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                ▶ Watch Trailer
              </button>
            )}
            {details?.tmdbScore && (
              <RTMeter score={details.tmdbScore} />
            )}
          </div>

          {/* Right: Info */}
          <div className="modal-info-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="movie-genre">{movie.genre}</span>
              {details?.runtime && (
                <span style={{ fontSize: '0.72rem', color: 'var(--aged-light)', fontFamily: 'Inter, sans-serif' }}>
                  {details.runtime} min
                </span>
              )}
            </div>

            <h2 className="modal-title">{movie.title}</h2>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'var(--aged-light)' }}>
              <span>dir. <strong style={{ color: 'var(--cream)' }}>{movie.director}</strong></span>
              <span>{movie.year}</span>
            </div>

            {details?.overview && (
              <p className="modal-overview">{details.overview}</p>
            )}

            <div className="divider" />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {movie.status !== 'seen' && (
                <button className="btn btn-primary" onClick={() => onMarkSeen(movie.id)}>✓ Mark as Seen</button>
              )}
              {movie.status === 'seen' && (
                <button className="btn btn-secondary" onClick={() => onMarkUnseen(movie.id)}>↩ Mark Unseen</button>
              )}
              {showConfirm ? (
                <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--aged-light)', fontFamily: 'Inter, sans-serif' }}>Sure?</span>
                  <button className="btn btn-danger" onClick={() => { onRemove(movie.id); onClose(); }}>Remove</button>
                  <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>No</button>
                </span>
              ) : (
                <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>Remove</button>
              )}
            </div>

            {/* Rating */}
            {movie.status === 'seen' && (
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <StarRating rating={movie.rating} onRate={(r) => onRate(movie.id, r)} />
              </div>
            )}

            {/* Schedule */}
            {movie.status !== 'seen' && (
              <div className="form-group">
                <label className="form-label">Schedule for</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input type="date" className="form-input" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} />
                  <button className="btn btn-secondary" onClick={handleSchedule}>Set</button>
                </div>
              </div>
            )}

            {movie.status === 'seen' && movie.watchedDate && (
              <div style={{ marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'var(--aged)' }}>
                Watched on {movie.watchedDate}
              </div>
            )}

            <div className="divider" />

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Journal / Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Write your thoughts after watching..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && details?.trailerKey && (
        <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
          <div className="trailer-container" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${details.trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ width: '100%', height: '100%', borderRadius: '12px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
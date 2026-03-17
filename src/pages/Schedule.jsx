import { useState } from 'react';
import MovieModal from '../components/MovieModal';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const TMDB_IMG = 'https://image.tmdb.org/t/p/w92';

function usePoster(title, year) {
  const [poster, setPoster] = useState(null);
  useState(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&year=${year}`);
        const data = await res.json();
        if (data.results?.[0]?.poster_path) setPoster(TMDB_IMG + data.results[0].poster_path);
      } catch {}
    };
    fetch_();
  }, [title, year]);
  return poster;
}

function MoviePill({ movie, onClick }) {
  const poster = usePoster(movie.title, movie.year);
  return (
    <div className="cal-movie-pill" onClick={(e) => { e.stopPropagation(); onClick(movie); }}>
      {poster
        ? <img src={poster} alt={movie.title} className="cal-pill-poster" />
        : <span className="cal-pill-icon">🎬</span>
      }
      <span className="cal-pill-title">{movie.title}</span>
    </div>
  );
}

export default function Schedule({ movies, markSeen, markUnseen, scheduleMovie, setRating, setNotes, removeMovie }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const scheduled = movies.filter(m => m.status === 'scheduled' && m.scheduledDate);

  const getMoviesForDate = (dateStr) => scheduled.filter(m => m.scheduledDate === dateStr);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayStr = today.toISOString().split('T')[0];

  const totalScheduled = scheduled.length;
  const thisMonthScheduled = scheduled.filter(m => {
    const d = new Date(m.scheduledDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  }).length;

  return (
    <div className="main-content">
      <h1 className="page-title">Watch <span>Schedule</span></h1>
      <p className="page-subtitle">planned screenings</p>

      {/* Stats */}
      <div className="schedule-stats">
        <div className="schedule-stat">
          <div className="schedule-stat-num">{totalScheduled}</div>
          <div className="schedule-stat-label">Total Scheduled</div>
        </div>
        <div className="schedule-stat">
          <div className="schedule-stat-num">{thisMonthScheduled}</div>
          <div className="schedule-stat-label">This Month</div>
        </div>
        <div className="schedule-stat">
          <div className="schedule-stat-num">{scheduled.filter(m => m.scheduledDate >= todayStr).length}</div>
          <div className="schedule-stat-label">Upcoming</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="calendar-wrap">
        {/* Calendar Header */}
        <div className="calendar-header">
          <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
          <h2 className="cal-month-title">{MONTHS[currentMonth]} {currentYear}</h2>
          <button className="cal-nav-btn" onClick={nextMonth}>›</button>
        </div>

        {/* Day names */}
        <div className="calendar-days-header">
          {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="cal-cell empty" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayMovies = getMoviesForDate(dateStr);
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;
            const isHovered = hoveredDay === dateStr;

            return (
              <div
                key={day}
                className={`cal-cell ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayMovies.length > 0 ? 'has-movies' : ''} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredDay(dateStr)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="cal-day-num">{day}</div>
                <div className="cal-movies-list">
                  {dayMovies.map(movie => (
                    <MoviePill key={movie.id} movie={movie} onClick={setSelected} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming list */}
      {scheduled.filter(m => m.scheduledDate >= todayStr).length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: 'var(--cream)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            Upcoming
          </h2>
          <div className="schedule-grid">
            {scheduled
              .filter(m => m.scheduledDate >= todayStr)
              .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
              .map(movie => (
                <div key={movie.id} className="schedule-card" onClick={() => setSelected(movie)}>
                  <div className="schedule-date">{movie.scheduledDate}</div>
                  <div className="schedule-movie-title">{movie.title}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--aged-light)', marginTop: '0.25rem' }}>
                    dir. {movie.director} · {movie.year}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {scheduled.length === 0 && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <span className="empty-state-icon">📅</span>
          <p className="empty-state-text">No films scheduled yet. Open a film and set a date.</p>
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
    </div>
  );
}
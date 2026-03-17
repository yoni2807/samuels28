import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMovies } from './hooks/useMovies';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';
import Schedule from './pages/Schedule';
import Directors from './pages/Directors';
import Achievements from './pages/Achievements';
import Groups from './pages/Groups';

export default function App() {
  const {
    movies, addMovie, removeMovie,
    markSeen, markUnseen, scheduleMovie,
    setRating, setNotes, getRandomUnwatched, stats
  } = useMovies();

  const { user, login, logout } = useAuth();

  const sharedProps = { movies, markSeen, markUnseen, scheduleMovie, setRating, setNotes, removeMovie };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogin={login} onLogout={logout} />
      <Routes>
        <Route path="/" element={
          <MovieList
            {...sharedProps}
            stats={stats}
            addMovie={addMovie}
            getRandomUnwatched={getRandomUnwatched}
          />
        } />
        <Route path="/schedule" element={<Schedule {...sharedProps} />} />
        <Route path="/directors" element={<Directors {...sharedProps} />} />
        <Route path="/groups" element={<Groups user={user} movies={movies} />} />
        <Route path="/achievements" element={<Achievements stats={stats} />} />
      </Routes>
      <footer className="app-footer">
        <p>Movie data and images provided by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>. This product uses the TMDB API but is not endorsed or certified by TMDB. All movie posters and images are copyright of their respective owners.</p>
      </footer>
    </BrowserRouter>
  );
}
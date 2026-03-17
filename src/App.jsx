import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMovies } from './hooks/useMovies';
import Navbar from './components/Navbar';
import MovieList from './pages/MovieList';
import Schedule from './pages/Schedule';
import Directors from './pages/Directors';
import Achievements from './pages/Achievements';

export default function App() {
  const {
    movies, addMovie, removeMovie,
    markSeen, markUnseen, scheduleMovie,
    setRating, setNotes, getRandomUnwatched, stats
  } = useMovies();

  const sharedProps = { movies, markSeen, markUnseen, scheduleMovie, setRating, setNotes, removeMovie };

  return (
    <BrowserRouter>
      <Navbar stats={stats} />
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
        <Route path="/achievements" element={<Achievements stats={stats} />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { INITIAL_MOVIES } from '../data/movies';

function deduplicateMovies(movies) {
  const seen = new Set();
  return movies.filter(m => {
    const key = `${m.title.toLowerCase()}_${m.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function useMovies(user) {
  const [movies, setMoviesState] = useState(deduplicateMovies(INITIAL_MOVIES));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMoviesState(deduplicateMovies(INITIAL_MOVIES));
      setLoading(false);
      return;
    }

    const userDoc = doc(db, 'users', user.uid);

    const unsub = onSnapshot(userDoc, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const savedMovies = data.movies || [];
        const savedIds = new Set(savedMovies.map(m => m.id));
        const newMovies = INITIAL_MOVIES.filter(m => !savedIds.has(m.id));
        const merged = deduplicateMovies([...savedMovies, ...newMovies]);
        setMoviesState(merged);
      } else {
        const initial = deduplicateMovies(INITIAL_MOVIES);
        await setDoc(userDoc, { movies: initial });
        setMoviesState(initial);
      }
      setLoading(false);
    });

    return unsub;
  }, [user]);

  const saveMovies = async (newMovies) => {
    setMoviesState(newMovies);
    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, { movies: newMovies }, { merge: true });
    }
  };

  const addMovie = (movie) => {
    const newMovie = {
      ...movie,
      id: Date.now().toString(),
      status: 'unseen',
      rating: 0,
      notes: '',
      scheduledDate: '',
      watchedDate: '',
      addedDate: new Date().toISOString().split('T')[0],
    };
    saveMovies([newMovie, ...movies]);
  };

  const removeMovie = (id) => saveMovies(movies.filter(m => m.id !== id));

  const updateMovie = (id, updates) => saveMovies(movies.map(m => m.id === id ? { ...m, ...updates } : m));

  const markSeen = (id) => saveMovies(movies.map(m =>
    m.id === id ? { ...m, status: 'seen', watchedDate: new Date().toISOString().split('T')[0] } : m
  ));

  const markUnseen = (id) => saveMovies(movies.map(m =>
    m.id === id ? { ...m, status: 'unseen', watchedDate: '', rating: 0 } : m
  ));

  const scheduleMovie = (id, date) => saveMovies(movies.map(m =>
    m.id === id ? { ...m, scheduledDate: date, status: date ? 'scheduled' : 'unseen' } : m
  ));

  const setRating = (id, rating) => saveMovies(movies.map(m =>
    m.id === id ? { ...m, rating } : m
  ));

  const setNotes = (id, notes) => saveMovies(movies.map(m =>
    m.id === id ? { ...m, notes } : m
  ));

  const getRandomUnwatched = () => {
    const unwatched = movies.filter(m => m.status === 'unseen');
    if (unwatched.length === 0) return null;
    return unwatched[Math.floor(Math.random() * unwatched.length)];
  };

  const stats = {
    total: movies.length,
    seen: movies.filter(m => m.status === 'seen').length,
    scheduled: movies.filter(m => m.status === 'scheduled').length,
    unseen: movies.filter(m => m.status === 'unseen').length,
  };

  return {
    movies, loading, addMovie, removeMovie, updateMovie,
    markSeen, markUnseen, scheduleMovie, setRating, setNotes,
    getRandomUnwatched, stats,
  };
}
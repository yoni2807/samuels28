import { useState, useEffect } from 'react';
import { INITIAL_MOVIES } from '../data/movies';

const STORAGE_KEY = 'cultcinema_movies';
const VERSION_KEY = 'cultcinema_version';
const CURRENT_VERSION = '4.0'; // שנה את המספר הזה בכל פעם שמוסיפים סרטים

export function useMovies() {
  const [movies, setMovies] = useState(() => {
    try {
      const savedVersion = localStorage.getItem(VERSION_KEY);
      const stored = localStorage.getItem(STORAGE_KEY);

      // אם הגרסה שונה — מיזג סרטים חדשים עם הנתונים השמורים
      if (savedVersion !== CURRENT_VERSION && stored) {
        const savedMovies = JSON.parse(stored);
        const savedIds = new Set(savedMovies.map(m => m.id));

        // הוסף רק סרטים חדשים שלא קיימים
        const newMovies = INITIAL_MOVIES.filter(m => !savedIds.has(m.id));
        const merged = [...savedMovies, ...newMovies];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        return merged;
      }

      // גרסה ראשונה — אין נתונים שמורים
      if (!stored) {
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        return INITIAL_MOVIES;
      }

      return JSON.parse(stored);
    } catch {
      return INITIAL_MOVIES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

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
    setMovies(prev => [newMovie, ...prev]);
  };

  const removeMovie = (id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  };

  const updateMovie = (id, updates) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const markSeen = (id) => {
    setMovies(prev => prev.map(m =>
      m.id === id
        ? { ...m, status: 'seen', watchedDate: new Date().toISOString().split('T')[0] }
        : m
    ));
  };

  const markUnseen = (id) => {
    setMovies(prev => prev.map(m =>
      m.id === id ? { ...m, status: 'unseen', watchedDate: '', rating: 0 } : m
    ));
  };

  const scheduleMovie = (id, date) => {
    setMovies(prev => prev.map(m =>
      m.id === id ? { ...m, scheduledDate: date, status: date ? 'scheduled' : 'unseen' } : m
    ));
  };

  const setRating = (id, rating) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, rating } : m));
  };

  const setNotes = (id, notes) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, notes } : m));
  };

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
    movies,
    addMovie,
    removeMovie,
    updateMovie,
    markSeen,
    markUnseen,
    scheduleMovie,
    setRating,
    setNotes,
    getRandomUnwatched,
    stats,
  };
}
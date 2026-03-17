import { useState } from 'react';
import { GENRES } from '../data/movies';

export default function AddMovieModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', director: '', year: new Date().getFullYear(), genre: 'Drama' });

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.title.trim() || !form.director.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Add New Film</h2>

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" name="title" placeholder="Film title" value={form.title} onChange={handle} />
        </div>

        <div className="form-group">
          <label className="form-label">Director *</label>
          <input className="form-input" name="director" placeholder="Director name" value={form.director} onChange={handle} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Year</label>
            <input className="form-input" name="year" type="number" min="1888" max="2099" value={form.year} onChange={handle} />
          </div>
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select className="form-select" name="genre" value={form.genre} onChange={handle}>
              {GENRES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn btn-primary" onClick={submit}>Add Film</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
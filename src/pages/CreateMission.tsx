import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

export default function CreateMission() {
  const navigate = useNavigate();
  const location = useLocation();
  const idFromNav = (location.state as { idEntreprise?: number } | null)?.idEntreprise ?? '';

  const [form, setForm] = useState({
    poste: '',
    localisation: '',
    duree: 1,
    idEntreprise: String(idFromNav),
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/missions', form);
      navigate('/');
    } catch {
      setError('Erreur lors de la création de la mission.');
    }
  };

  return (
    <div className="page">
      <h1>Publier une mission urgente</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Poste
          <input
            required
            value={form.poste}
            onChange={e => setForm({ ...form, poste: e.target.value })}
            placeholder="Ex : Cariste"
          />
        </label>
        <label>
          Localisation
          <input
            required
            value={form.localisation}
            onChange={e => setForm({ ...form, localisation: e.target.value })}
            placeholder="Ex : Aubervilliers"
          />
        </label>
        <label>
          Durée
          <select
            value={form.duree}
            onChange={e => setForm({ ...form, duree: Number(e.target.value) })}
          >
            <option value={1}>1 jour</option>
            <option value={2}>2 jours</option>
            <option value={3}>3 jours</option>
          </select>
        </label>
        <label>
          ID Entreprise
          <input
            required
            type="number"
            value={form.idEntreprise}
            onChange={e => setForm({ ...form, idEntreprise: e.target.value })}
            placeholder="Ex : 1"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit">Publier la mission</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

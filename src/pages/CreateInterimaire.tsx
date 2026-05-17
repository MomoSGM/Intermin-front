import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateInterimaire() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '',
    localisation: '',
    competences: '',
    disponible: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/interimaires', form);
      navigate('/');
    } catch {
      setError('Erreur lors de la création de l\'intérimaire.');
    }
  };

  return (
    <div className="page">
      <h1>Créer un profil intérimaire</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Nom
          <input
            required
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            placeholder="Ex : Mohamed Nour"
          />
        </label>
        <label>
          Localisation
          <input
            required
            value={form.localisation}
            onChange={e => setForm({ ...form, localisation: e.target.value })}
            placeholder="Ex : Paris 18"
          />
        </label>
        <label>
          Compétences
          <input
            value={form.competences}
            onChange={e => setForm({ ...form, competences: e.target.value })}
            placeholder="Ex : CACES 3, manutention"
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.disponible}
            onChange={e => setForm({ ...form, disponible: e.target.checked })}
          />
          Disponible maintenant
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit">Créer le profil</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

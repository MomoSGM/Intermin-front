import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateEntreprise() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', adresse: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/entreprises', form);
      navigate('/mission/nouvelle', { state: { idEntreprise: res.data.id } });
    } catch {
      setError('Erreur lors de la création de l\'entreprise.');
    }
  };

  return (
    <div className="page">
      <h1>Créer une entreprise</h1>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Nom
          <input
            required
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            placeholder="Ex : LogiTrans"
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="contact@entreprise.fr"
          />
        </label>
        <label>
          Téléphone
          <input
            value={form.telephone}
            onChange={e => setForm({ ...form, telephone: e.target.value })}
            placeholder="Ex : 06 12 34 56 78"
          />
        </label>
        <label>
          Adresse
          <input
            value={form.adresse}
            onChange={e => setForm({ ...form, adresse: e.target.value })}
            placeholder="Ex : 12 rue de la Paix, Paris"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="submit">Créer l'entreprise</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

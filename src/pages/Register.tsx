import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const [role, setRole] = useState('ENTREPRISE');
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    localisation: '',
    competences: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register({ ...form, role });
      setUser(data);
      navigate('/');
    } catch {
      setError('Erreur lors de l\'inscription. Email déjà utilisé ?');
    }
  };

  return (
    <div className="page auth-page">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="form-card">

        {/* Choix du rôle — change les champs affichés en dessous */}
        <div className="role-selector">
          <button
            type="button"
            className={role === 'ENTREPRISE' ? 'role-btn active' : 'role-btn'}
            onClick={() => setRole('ENTREPRISE')}
          >
            Entreprise
          </button>
          <button
            type="button"
            className={role === 'INTERIMAIRE' ? 'role-btn active' : 'role-btn'}
            onClick={() => setRole('INTERIMAIRE')}
          >
            Intérimaire
          </button>
        </div>

        <label>
          {role === 'ENTREPRISE' ? 'Nom de l\'entreprise' : 'Prénom et nom'}
          <input
            required
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            placeholder={role === 'ENTREPRISE' ? 'Ex : LogiTrans' : 'Ex : Mohamed Nour'}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="votre@email.fr"
          />
        </label>
        <label>
          Mot de passe
          <input
            required
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </label>

        {/* Champs supplémentaires uniquement pour les intérimaires */}
        {role === 'INTERIMAIRE' && (
          <>
            <label>
              Localisation
              <input
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
          </>
        )}

        {error && <p className="error">{error}</p>}
        <button type="submit">Créer mon compte</button>
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}

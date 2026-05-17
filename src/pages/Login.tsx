import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const [role, setRole] = useState('ENTREPRISE');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(form);
      // Vérifie que le rôle choisi correspond bien au compte
      if (data.role !== role) {
        setError(`Ce compte est un compte ${data.role === 'ENTREPRISE' ? 'Entreprise' : 'Intérimaire'}.`);
        return;
      }
      setUser(data);
      navigate('/');
    } catch {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="page auth-page">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit} className="form-card">

        {/* Sélecteur de rôle — même composant que Register pour cohérence */}
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
        {error && <p className="error">{error}</p>}
        <button type="submit">
          Se connecter en tant que {role === 'ENTREPRISE' ? 'Entreprise' : 'Intérimaire'}
        </button>
        <p className="auth-link">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
}

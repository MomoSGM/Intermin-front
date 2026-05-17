import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Interimaire {
  id: number;
  nom: string;
}

interface Mission {
  id: number;
  poste: string;
  localisation: string;
  duree: number;
  statut: string;
  entreprise: { nom: string };
  interimaire: Interimaire | null;
}

// ─── Vue Intérimaire ─────────────────────────────────────────────────────────

function VueInterimaire() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [historique, setHistorique] = useState<Mission[]>([]);
  const [error, setError] = useState('');
  const [succes, setSucces] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/missions/disponibles')
      .then(res => setMissions(res.data))
      .catch(() => setError('Impossible de charger les missions.'));
    api.get('/missions/mon-historique')
      .then(res => setHistorique(res.data))
      .catch(() => {});
  }, []);

  const demanderConfirmation = (missionId: number) => setConfirmId(missionId);

  const confirmerAcceptation = async () => {
    if (!confirmId) return;
    const interimaireId = user?.entityId;
    if (!interimaireId) {
      setError('Impossible de récupérer votre profil intérimaire.');
      setConfirmId(null);
      return;
    }
    try {
      const res = await api.put(`/missions/${confirmId}/accepter/${interimaireId}`);
      setMissions(prev => prev.filter(m => m.id !== confirmId));
      setHistorique(prev => [...prev, res.data]);
      setSucces('Mission acceptée avec succès !');
      setTimeout(() => setSucces(''), 4000);
    } catch {
      setError("Erreur lors de l'acceptation.");
    }
    setConfirmId(null);
  };

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Missions disponibles</h1>
      {error && <p className="error">{error}</p>}
      {succes && <p className="succes">{succes}</p>}

      {/* Popup de confirmation */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmer l'acceptation</h2>
            <p>Voulez-vous vraiment accepter cette mission ?</p>
            <div className="modal-actions">
              <button className="btn-accept" onClick={confirmerAcceptation}>Oui, j'accepte</button>
              <button className="btn-cancel" onClick={() => setConfirmId(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Missions disponibles ── */}
      <h2 className="section-title">À pourvoir</h2>
      {missions.length === 0 && !error && (
        <p className="empty" style={{ marginTop: '1rem' }}>Aucune mission disponible pour le moment.</p>
      )}
      <div className="cards">
        {missions.map(mission => (
          <div key={mission.id} className="card">
            <h2>{mission.poste}</h2>
            <p>{mission.localisation} · {mission.duree} jour{mission.duree > 1 ? 's' : ''}</p>
            <p className="entreprise">Publié par : <strong>{mission.entreprise?.nom}</strong></p>
            <div className="card-actions">
              <button className="btn-accept" onClick={() => demanderConfirmation(mission.id)}>Accepter</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Historique ── */}
      <h2 className="section-title" style={{ marginTop: '2.5rem' }}>Historique</h2>
      {historique.length === 0 ? (
        <p className="empty" style={{ marginTop: '1rem' }}>Aucune mission acceptée pour le moment.</p>
      ) : (
        <div className="cards">
          {historique.map(mission => (
            <div key={mission.id} className={`card ${mission.statut === 'ANNULEE' ? 'card-annulee' : 'card-accepted'}`}>
              <div className="card-header">
                <h2>{mission.poste}</h2>
                {mission.statut === 'ACCEPTEE' && <span className="badge-accepted">Acceptée</span>}
                {mission.statut === 'ANNULEE' && <span className="badge-annulee">Annulée</span>}
              </div>
              <p>{mission.localisation} · {mission.duree} jour{mission.duree > 1 ? 's' : ''}</p>
              <p className="entreprise">Entreprise : <strong>{mission.entreprise?.nom}</strong></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vue Entreprise ───────────────────────────────────────────────────────────

function VueEntreprise() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ poste: '', localisation: '', duree: 1 });

  useEffect(() => {
    api.get('/missions/mes-missions')
      .then(res => setMissions(res.data))
      .catch(() => setError('Impossible de charger vos missions.'));
  }, []);

  const ouvrirEdition = (mission: Mission) => {
    setEditingId(mission.id);
    setEditForm({ poste: mission.poste, localisation: mission.localisation, duree: mission.duree });
  };

  const modifier = async (missionId: number) => {
    try {
      const res = await api.put(`/missions/${missionId}`, editForm);
      setMissions(prev => prev.map(m => m.id === missionId ? res.data : m));
      setEditingId(null);
    } catch {
      setError('Erreur lors de la modification.');
    }
  };

  const supprimer = async (missionId: number) => {
    try {
      await api.delete(`/missions/${missionId}`);
      setMissions(prev => prev.filter(m => m.id !== missionId));
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const enCours = missions.filter(m => m.statut === 'PUBLIEE');
  const historique = missions.filter(m => m.statut === 'ACCEPTEE' || m.statut === 'ANNULEE');

  const renderCard = (mission: Mission) => (
    <div key={mission.id} className={`card ${mission.statut === 'ANNULEE' ? 'card-annulee' : ''}`}>
      {editingId === mission.id ? (
        <>
          <input
            value={editForm.poste}
            onChange={e => setEditForm({ ...editForm, poste: e.target.value })}
            placeholder="Poste"
          />
          <input
            value={editForm.localisation}
            onChange={e => setEditForm({ ...editForm, localisation: e.target.value })}
            placeholder="Localisation"
          />
          <select
            value={editForm.duree}
            onChange={e => setEditForm({ ...editForm, duree: Number(e.target.value) })}
          >
            <option value={1}>1 jour</option>
            <option value={2}>2 jours</option>
            <option value={3}>3 jours</option>
          </select>
          <div className="card-actions">
            <button onClick={() => modifier(mission.id)}>Sauvegarder</button>
            <button className="btn-cancel" onClick={() => setEditingId(null)}>Annuler</button>
          </div>
        </>
      ) : (
        <>
          <div className="card-header">
            <h2>{mission.poste}</h2>
            {mission.statut === 'ACCEPTEE' && <span className="badge-accepted">Acceptée</span>}
            {mission.statut === 'ANNULEE' && <span className="badge-annulee">Annulée</span>}
          </div>
          <p>{mission.localisation} · {mission.duree} jour{mission.duree > 1 ? 's' : ''}</p>

          {mission.statut === 'ACCEPTEE' && mission.interimaire && (
            <p className="interimaire-name">
              Intérimaire : <strong>{mission.interimaire.nom}</strong>
            </p>
          )}

          {mission.statut === 'PUBLIEE' && (
            <div className="card-actions">
              <button className="btn-edit" onClick={() => ouvrirEdition(mission)}>Modifier</button>
              <button className="btn-delete" onClick={() => supprimer(mission.id)}>Supprimer</button>
            </div>
          )}

        </>
      )}
    </div>
  );

  return (
    <div className="page">
      <h1 style={{ marginBottom: '1.5rem' }}>Mes missions</h1>
      {error && <p className="error">{error}</p>}

      {/* ── Missions en cours ── */}
      <h2 className="section-title">En cours</h2>
      {enCours.length === 0 && !error && (
        <p className="empty" style={{ marginTop: '1rem' }}>Aucune mission publiée pour le moment.</p>
      )}
      <div className="cards">{enCours.map(renderCard)}</div>

      {/* ── Historique ── */}
      <h2 className="section-title" style={{ marginTop: '2.5rem' }}>Historique</h2>
      {historique.length === 0 ? (
        <p className="empty" style={{ marginTop: '1rem' }}>Aucune mission acceptée ou annulée.</p>
      ) : (
        <div className="cards">{historique.map(renderCard)}</div>
      )}
    </div>
  );
}

// ─── Composant principal — redirige selon le rôle ────────────────────────────

export default function MissionsDisponibles() {
  const { user } = useAuth();
  return user?.role === 'ENTREPRISE' ? <VueEntreprise /> : <VueInterimaire />;
}

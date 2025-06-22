// ProjecteForm.jsx
import { useState } from 'react';

export default function ProjecteForm({ afegirProjecte }) {
  const [titol, setTitol] = useState('');
  const [participants, setParticipants] = useState(['']);

  const afegirParticipant = () => {
    setParticipants([...participants, '']);
  };

  const handleChange = (index, value) => {
    const actualitzats = [...participants];
    actualitzats[index] = value;
    setParticipants(actualitzats);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    afegirProjecte({ titol, participants });
    setTitol('');
    setParticipants(['']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Títol del projecte
        <input type="text" value={titol} onChange={(e) => setTitol(e.target.value)} required />
      </label>
      <h4>Participants</h4>
      {participants.map((p, idx) => (
        <input key={idx} type="text" value={p} onChange={(e) => handleChange(idx, e.target.value)} required />
      ))}
      <button type="button" onClick={afegirParticipant}>+ Participant</button>
      <button type="submit">Crear projecte</button>
    </form>
  );
}
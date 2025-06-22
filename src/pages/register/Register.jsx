import { useState } from 'react';
import { registrarUsuari } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registrarUsuari(email, password);
      navigate('/');
    } catch (err) {
      // Mostra missatges més clars segons l’error de Firebase:
      if (err.code === 'auth/email-already-in-use') {
        setError('Aquest correu ja està registrat.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contrasenya ha de tenir almenys 6 caràcters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format de correu no vàlid.');
      } else {
        setError('Error en el registre: ' + err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registra't</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Correu electrònic"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contrasenya (mínim 6 caràcters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
}

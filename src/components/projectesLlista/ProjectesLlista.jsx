// ProjectesLlista.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectesLlista({ projectes, eliminarProjecte }) {
  return (
    <div>
      {projectes.map((proj) => (
        <div key={proj.id}>
          <h3>{proj.titol}</h3>
          <p>Participants: {proj.participants.join(', ')}</p>
          <Link to={`/projecte/${proj.id}`}>Veure detall</Link>
          <button onClick={() => eliminarProjecte(proj.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}

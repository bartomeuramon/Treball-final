// Inici.jsx (actualitzat per gestionar projectes)
import { useState } from 'react';
import ProjectesLlista from '../../components/projectesLlista/ProjectesLlista';
import ProjecteForm from '../../components/projecteForm/ProjecteForm';
import { saveProjecte, deleteProjecte } from '../../firebase/firebase';
import { useProjectes } from '../../hooks/useProjectes';

export default function Inici() {
  const [mostraForm, setMostraForm] = useState(false);
  const { projectes } = useProjectes();

  const afegirProjecte = (projecte) => {
    saveProjecte(projecte).then((id) => {
      console.log(`Projecte creat amb id ${id}`);
      setMostraForm(false);
    });
  };

  const eliminarProjecte = (id) => {
    deleteProjecte(id).then(() => console.log("Projecte eliminat: ", id));
  };

  return (
    <div>
      <h1>Llista de projectes</h1>
      <button onClick={() => setMostraForm(true)}>+ Nou Projecte</button>
      {mostraForm && <ProjecteForm afegirProjecte={afegirProjecte} />}
      <ProjectesLlista projectes={projectes} eliminarProjecte={eliminarProjecte} />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getProjecte,
  updateProjecte,
  saveDespesa,
  getDespesesPerProjecte,
  deleteDespesa
} from '@/firebase/firebase';

export default function ProjecteDetall() {
  const { id } = useParams();
  const [projecte, setProjecte] = useState(null);
  const [editantParticipants, setEditantParticipants] = useState(false);
  const [participantsEditats, setParticipantsEditats] = useState([]);

  const [novaDespesa, setNovaDespesa] = useState({
    concepte: '',
    quantia: '',
    pagatPer: '',
    dividirEntre: []
  });

  const [despeses, setDespeses] = useState([]);
  const [resum, setResum] = useState({});

  useEffect(() => {
    getProjecte(id).then((proj) => {
      setProjecte(proj);
      setParticipantsEditats(proj.participants);
      carregarDespeses(proj);
    });
  }, [id]);

  const carregarDespeses = async (proj) => {
    const despesesActuals = await getDespesesPerProjecte(id);
    setDespeses(despesesActuals);
    calcularResum(proj.participants, despesesActuals);
  };

  const calcularResum = (participants, despeses) => {
    const totals = {};
    participants.forEach(p => { totals[p] = { pagat: 0, deu: 0 }; });

    despeses.forEach(d => {
      const quantia = parseFloat(d.quantia);
      const afectats = d.dividirEntre && d.dividirEntre.length > 0 ? d.dividirEntre : participants;
      const part = quantia / afectats.length;

      totals[d.pagatPer].pagat += quantia;
      afectats.forEach(p => { totals[p].deu += part; });
    });

    const balanc = {};
    participants.forEach(p => {
      balanc[p] = (totals[p].pagat - totals[p].deu).toFixed(2);
    });

    setResum(balanc);
  };

  // 🟢 Participants
  const handleCanviParticipant = (index, valor) => {
    const actualitzats = [...participantsEditats];
    actualitzats[index] = valor;
    setParticipantsEditats(actualitzats);
  };

  const handleAfegirParticipant = () => {
    setParticipantsEditats([...participantsEditats, '']);
  };

  const handleEliminarParticipant = (index) => {
    const actualitzats = participantsEditats.filter((_, i) => i !== index);
    setParticipantsEditats(actualitzats);
  };

  const handleEditarParticipants = async (e) => {
    e.preventDefault();
    await updateProjecte(projecte.id, { participants: participantsEditats });
    setProjecte({ ...projecte, participants: participantsEditats });
    setEditantParticipants(false);
    carregarDespeses({ participants: participantsEditats });
  };

  // 🟢 Nova despesa
  const handleChangeDespesa = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'dividirEntre') {
      const actualitzats = checked
        ? [...novaDespesa.dividirEntre, value]
        : novaDespesa.dividirEntre.filter(p => p !== value);
      setNovaDespesa({ ...novaDespesa, dividirEntre: actualitzats });
    } else {
      setNovaDespesa({ ...novaDespesa, [name]: value });
    }
  };

  const handleAfegirDespesa = async (e) => {
    e.preventDefault();
    if (novaDespesa.dividirEntre.length === 0) {
      alert('Has de seleccionar almenys un participant per dividir la despesa.');
      return;
    }
    const despesaCompleta = { ...novaDespesa, projecteId: id };
    await saveDespesa(despesaCompleta);
    await carregarDespeses(projecte);
    setNovaDespesa({ concepte: '', quantia: '', pagatPer: '', dividirEntre: [] });
  };

  const handleEliminarDespesa = async (despesaId) => {
    await deleteDespesa(despesaId);
    await carregarDespeses(projecte);
  };

  if (!projecte) return <p>Carregant projecte...</p>;

  return (
    <div>
      <h2>{projecte.titol}</h2>

      {/* Participants */}
      <button onClick={() => setEditantParticipants(true)}>Editar Participants</button>
      {editantParticipants && (
        <form onSubmit={handleEditarParticipants}>
          {participantsEditats.map((p, i) => (
            <div key={i}>
              <input value={p} onChange={(e) => handleCanviParticipant(i, e.target.value)} />
              <button type="button" onClick={() => handleEliminarParticipant(i)}>✕</button>
            </div>
          ))}
          <button type="button" onClick={handleAfegirParticipant}>+ Afegir participant</button>
          <button type="submit">Desar participants</button>
        </form>
      )}

      {/* Nova despesa */}
      <h3>Afegir nova despesa</h3>
      <form onSubmit={handleAfegirDespesa}>
        <input
          name="concepte"
          placeholder="Concepte"
          value={novaDespesa.concepte}
          onChange={handleChangeDespesa}
          required
        />
        <input
          name="quantia"
          type="number"
          placeholder="Quantia"
          value={novaDespesa.quantia}
          onChange={handleChangeDespesa}
          required
        />
        <select
          name="pagatPer"
          value={novaDespesa.pagatPer}
          onChange={handleChangeDespesa}
          required
        >
          <option value="">Selecciona qui ha pagat</option>
          {projecte.participants.map((p, i) => (
            <option key={i} value={p}>{p}</option>
          ))}
        </select>
        <fieldset>
          <legend>Dividir entre:</legend>
          {projecte.participants.map((p, i) => (
            <label key={i}>
              <input
                type="checkbox"
                name="dividirEntre"
                value={p}
                checked={novaDespesa.dividirEntre.includes(p)}
                onChange={handleChangeDespesa}
              />
              {p}
            </label>
          ))}
        </fieldset>
        <button type="submit">Afegir despesa</button>
      </form>

      {/* Llista de despeses */}
      <h3>Despeses</h3>
      <ul>
        {despeses.map((d) => (
          <li key={d.id}>
            {d.concepte} - {d.quantia} € (pagat per {d.pagatPer}) [
            {d.dividirEntre?.join(', ') || 'tots'}]
            <button onClick={() => handleEliminarDespesa(d.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {/* Resum */}
      <h3>Resum de balanços</h3>
      <ul>
        {Object.entries(resum).map(([participant, balanc]) => (
          <li key={participant}>{participant}: {balanc} €</li>
        ))}
      </ul>
    </div>
  );
}

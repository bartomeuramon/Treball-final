// useProjectes.jsx (hook personalitzat)
import { useState, useEffect } from "react";
import { onGetProjectes } from "../firebase/firebase";

export const useProjectes = () => {
  const [projectes, setProjectes] = useState([]);

  useEffect(() => {
    const unsubscribe = onGetProjectes((snapshot) => {
      const resultats = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProjectes(resultats);
    });
    return () => unsubscribe();
  }, []);

  return { projectes };
};
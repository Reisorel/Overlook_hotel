import { useState, useEffect } from "react";

export default function Clients() {
  // États
  const [clients, setClients] = useState([]); // Stocke les clients
  const [error, setError] = useState(null); // Stocke les erreurs

  // Récupère la liste des clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Début de la requête fetch pour récupérer les clients...");
        const response = await fetch("http://localhost:3000/api/clients"); // URL de l'API

        console.log("Réponse brute de fetch :", response);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des clients");
        }
        const data = await response.json(); // Récupère les données JSON
        console.log("Données reçues :", data);

        setClients(data.clients); // Mets à jour l'état avec les clients
      } catch (err) {
        setError(err.message); // Mets à jour l'erreur
      }
    };

    fetchClients();
  }, []); // Le tableau vide signifie que l'effet s'exécute une seule fois

  // Gestion des erreurs
  if (error) {
    return <p>Erreur : {error}</p>;
  }

  // Affichage de l'interface
  return (
    <div>
      <h1>Liste des Clients</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} {client.surname}, {client.address}, {client.birthdate}, {client.note}
          </li>
        ))}
      </ul>
      <button>Ajouter un nouveau client</button>
    </div>
  );
}

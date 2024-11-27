import { useState, useEffect } from "react";
import "./Clients.css";

export default function Clients() {
  // États
  const [clients, setClients] = useState([]); // Stocke les clients
  const [error, setError] = useState(null); // Stocke les erreurs
  const [editingId, setEditingId] = useState(null); // ID en cours d'édition
  const [editingData, setEditingData] = useState({}); // Données temporaires d'édition
  const [message, setMessage] = useState(""); // Messages de succès ou d'erreur


  // État pour le formulaire d'ajout d'un client
  const [newClient, setNewClient] = useState({
    name: "",
    surname: "",
    address: "",
    birthdate: "",
    note: "",
  });

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

  // Gestion du changement dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  // Soumission du formulaire pour ajouter un client
  const handleAddClient = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) throw new Error("Failed to add client");

      const result = await response.json();
      setClients((prevClients) => [...prevClients, result.client]); // Mise à jour de la liste des clients
      setNewClient({
        name: "",
        surname: "",
        address: "",
        birthdate: "",
        note: "",
      }); // Réinitialisation du formulaire
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };
  // Delete function
  const handleDelete = async (id) => {
    try {
      // Envoi d'une requête DELETE à l'API
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      // Mise à jour de l'état local après suppression
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

    // Démarrer l'édition
    const startEditing = (id, currentData) => {
      setEditingId(id); // Définit le client en cours d'édition
      setEditingData(currentData); // Pré-remplit les données d'édition
    };

    // Gestion des modifications des champs
    const handleFieldChange = (fieldName, value) => {
      setEditingData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    };

    // Sauvegarder les modifications
    const handleUpdateClient = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingData),
        });
        if (!response.ok) {
          throw new Error("Failed to update client");
        }

        const data = await response.json();
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === editingId ? { ...client, ...editingData } : client
          )
        );
        setMessage(data.message); // Message de succès
        cancelEditing(); // Sort du mode édition
      } catch (err) {
        console.error("Error updating client:", err.message);
        setMessage(err.message); // Message d'erreur
      }
    };

    // Annuler l'édition
    const cancelEditing = () => {
      setEditingId(null); // Réinitialise l'ID en cours d'édition
      setEditingData({}); // Vide les données d'édition
    };

  // Gestion des erreurs
  if (error) {
    return <p>Erreur : {error}</p>;
  }

  // Affichage de l'interface
  return (
    <div>
      <h1>Liste des Clients</h1>
      <div className="clients-grid">
        {/* En-têtes des colonnes */}
        <div className="header">Name</div>
        <div className="header">Surname</div>
        <div className="header">Address</div>
        <div className="header">Birthdate</div>
        <div className="header">Note</div>
        <div className="header">Action</div>

        {/* Liste des clients */}
        {clients.map((client) => (
          <>
            {editingId === client.id ? (
              <>
                {/* Mode édition : afficher des champs input */}
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <input
                  type="text"
                  value={editingData.surname}
                  onChange={(e) => handleFieldChange("surname", e.target.value)}
                />
                <input
                  type="text"
                  value={editingData.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                />
                <input
                  type="date"
                  value={editingData.birthdate}
                  onChange={(e) => handleFieldChange("birthdate", e.target.value)}
                />
                <input
                  type="text"
                  value={editingData.note}
                  onChange={(e) => handleFieldChange("note", e.target.value)}
                />
                <div className="actions">
                  <button onClick={handleUpdateClient}>✅</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                {/* Mode lecture : afficher les données */}
                <div>{client.name}</div>
                <div>{client.surname}</div>
                <div>{client.address}</div>
                <div>{client.birthdate}</div>
                <div>{client.note}</div>
                <div className="actions">
                  <button onClick={() => startEditing(client.id, client)}>✏️</button>
                  <button onClick={() => handleDelete(client.id)}>❌</button>
                </div>
              </>
            )}
          </>
        ))}
      </div>

      {/* Formulaire d'ajout d'un nouveau client */}
      <h2>Ajouter un nouveau client</h2>
      <form onSubmit={handleAddClient}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={newClient.surname}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newClient.address}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="birthdate"
          placeholder="Birthdate"
          value={newClient.birthdate}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="note"
          placeholder="Note"
          value={newClient.note}
          onChange={handleInputChange}
        />
        <button type="submit">Add new client</button>
      </form>
    </div>
  );

}

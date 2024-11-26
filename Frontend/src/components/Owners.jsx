import { useState, useEffect } from "react";
import editIcon from "../assets/editer.png";

export default function Owners() {
  const [owners, setOwners] = useState([]); // Liste des propriétaires
  const [name, setName] = useState(""); // Champ de création
  const [editingId, setEditingId] = useState(null); // ID du propriétaire en cours d'édition
  const [editingName, setEditingName] = useState(""); // Nom temporaire pendant l'édition
  const [message, setMessage] = useState(""); // Message de succès ou d'erreur
  const [error, setError] = useState(null); // Gestion des erreurs

  // Getting owner names
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/owners");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des propriétaires");
        }
        const data = await response.json();
        setOwners(data.owners);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOwners();
  }, []);

  // Creating owner
  const handleCreateOwner = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la création du propriétaire");
      }
      const data = await response.json();
      setOwners((prevOwners) => [...prevOwners, data.owner]); // Ajoute le nouveau propriétaire
      setName(""); // Vide le champ de création
      setMessage(data.message); // Message de succès
    } catch (err) {
      setMessage(err.message); // Message d'erreur
    }
  };

  // Deleting owner
  const handleDeleteOwner = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/owners/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du propriétaire");
      }
      const data = await response.json();
      setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== id)); // Supprime localement
      setMessage(data.message); // Message de succès
    } catch (err) {
      setMessage(err.message); // Message d'erreur
    }
  };

  // Editing owner
  const startEditing = (id, currentName) => {
    setEditingId(id); // Définit l'ID en cours d'édition
    setEditingName(currentName); // Pré-remplit le champ d'édition
  };

  // Saving editing
  const handleUpdateOwner = async (id, newName) => {
    try {
      const response = await fetch(`http://localhost:3000/api/owners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la modification du propriétaire");
      }
      const data = await response.json();
      setOwners((prevOwners) =>
        prevOwners.map((owner) =>
          owner.id === id ? { ...owner, name: newName } : owner
        )
      );
      setMessage(data.message); // Message de succès
      cancelEditing(); // Sort du mode édition
    } catch (err) {
      setMessage(err.message); // Message d'erreur
    }
  };

  // Canceling editing
  const cancelEditing = () => {
    setEditingId(null); // Réinitialise l'ID en cours d'édition
    setEditingName(""); // Vide le champ temporaire
  };

  return (
    <div>
      <h1>Owners List</h1>
      <ul>
        {owners.map((owner) => (
          <li key={owner.id}>
            {editingId === owner.id ? (
              // Mode édition
              <div>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="Modifier le nom"
                />
                <button
                  onClick={() => handleUpdateOwner(owner.id, editingName)}
                >
                  💾
                </button>
                <button onClick={cancelEditing}>❌</button>

              </div>
            ) : (
              // Affichage normal
              <div>
                {owner.name}
                <button
                  onClick={() => startEditing(owner.id, owner.name)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "3px",
                    padding: "5px 5px",
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteOwner(owner.id)}
                  style={{
                    marginLeft: "5px",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Affichage des messages */}
      {message && <p>{message}</p>}

      {/* Formulaire de création */}
      <form onSubmit={handleCreateOwner}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)} // Met à jour l'état `name`
          placeholder="Nom du propriétaire"
          required
        />
        <button type="submit">Ajouter un propriétaire</button>
      </form>

      {/* Affichage des erreurs */}
      {error && <p>Erreur : {error}</p>}
    </div>
  );
}

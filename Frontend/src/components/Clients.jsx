import { useState, useEffect } from "react";
import "./Clients.css";

// Creating modal :
function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default function Clients() {
  // States
  const [clients, setClients] = useState([]); // Stocke les clients
  const [error, setError] = useState(null); // Stocke les erreurs
  const [message, setMessage] = useState(""); // Messages de succès ou d'erreur

  const [editingId, setEditingId] = useState(null); // ID en cours d'édition
  const [editingData, setEditingData] = useState({}); // Données temporaires d'édition

  const [newClient, setNewClient] = useState({
    name: "",
    surname: "",
    address: "",
    birthdate: "",
    note: "",
  });

  const [showModal, setShowModal] = useState(false); // Affichage de la modale
  const [modalMessage, setModalMessage] = useState(""); // Message de la modal

  // Getting client list
  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Début de la requête fetch pour récupérer les clients...");
        const response = await fetch("http://localhost:3000/api/clients");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des clients");
        }
        const data = await response.json();

        setClients(data.clients);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClients();
  }, []);

  // Create new client
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) throw new Error("Failed to add client");

      const result = await response.json();
      setClients((prevClients) => [...prevClients, result.client]);
      setNewClient({
        name: "",
        surname: "",
        address: "",
        birthdate: "",
        note: "",
      });
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  // Delete client
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );

      // Modal intervention
      setModalMessage("Client supprimé avec succès !");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting client:", err);
      setModalMessage("Échec de la suppression du client !");
      setShowModal(true);
    }
  };

  // Edit client
  const startEditing = (id, currentData) => {
    setEditingId(id); // Définit le client en cours d'édition
    setEditingData(currentData); // Pré-remplit les données d'édition
  };

  const handleFieldChange = (fieldName, value) => {
    setEditingData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleUpdateClient = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/clients/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update client");
      }

      const data = await response.json();
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === editingId ? { ...client, ...editingData } : client
        )
      );
      setMessage(data.message);

      //Show modal
      setModalMessage("Données client correctement changées !");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating client:", err.message);
      setModalMessage("Échec de la mise à jour des données !");
      setMessage(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null); // Réinitialise l'ID en cours d'édition
    setEditingData({}); // Vide les données d'édition
  };

  // Handeling errors
  if (error) {
    return <p>Erreur : {error}</p>;
  }

  return (
    <div>
      <h1>Liste des Clients</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="clients-grid">
        <div className="header">Name</div>
        <div className="header">Surname</div>
        <div className="header">Address</div>
        <div className="header">Birthdate</div>
        <div className="header">Note</div>
        <div className="header">Action</div>

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
                  onChange={(e) =>
                    handleFieldChange("birthdate", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={editingData.note}
                  onChange={(e) => handleFieldChange("note", e.target.value)}
                />
                <div className="actions">
                  <button onClick={handleUpdateClient}>💾</button>
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
                  <button onClick={() => startEditing(client.id, client)}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(client.id)}>❌</button>
                </div>
              </>
            )}
          </>
        ))}
      </div>

      {/* Formulaire d'ajout d'un nouveau client */}
      <h2>Add new client</h2>
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

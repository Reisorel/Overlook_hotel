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
    email: "", // Champ pour Users
    password_hash: "", // Champ pour Users
  });

  const [showModal, setShowModal] = useState(false); // Affichage de la modale
  const [modalMessage, setModalMessage] = useState(""); // Message de la modal

  // Getting client list
  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Starting fetch for getting clients");
        const response = await fetch("http://localhost:3000/api/clients");
        console.log("Response status:", response.status); // Ajoute ce log

        if (!response.ok) {
          throw new Error("Error getting clients");
        }

        const data = await response.json();
        console.log(data); // Ajoute ce log pour vérifier la structure de la réponse

        // Vérifie si la liste de clients est vide ou si un message d'erreur est présent
        if (data.message && data.message === "No clients found") {
          setClients([]);  // Si aucun client, on vide la liste
        } else {
          setClients(data.clients);  // Sinon, on met à jour les clients
        }
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
        email: "", // email form
        password_hash: "", // users form
      });
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      setModalMessage("Invalid client ID!");
      setShowModal(true);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) {
      return; // L'utilisateur a annulé la suppression
    }

    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Capture des détails si fournis par l'API
        throw new Error(errorDetails.message || "Failed to delete client");
      }

      // Mise à jour de l'état des clients
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );

      // Succès : affichage dans le modal
      setModalMessage("Success deleting client!");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting client:", err);

      // Échec : affichage de l'erreur dans le modal
      setModalMessage(err.message || "Failed to delete client!");
      setShowModal(true);
    }
  };

  // Edit client
  const startEditing = (id, currentData) => {
    setEditingId(id);
    setEditingData({
      ...currentData,
      email: currentData.email || "", // Pré-remplit l'email
      password_hash: "", // Champ vide pour des raisons de sécurité
    });
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
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to update client");
      }

      const data = await response.json();
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === editingId ? { ...client, ...editingData } : client
        )
      );
      setMessage(data.message);

      //Show modal
      setModalMessage("Client data correctly updated !");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating client:", err.message);
      setModalMessage("Fail to update client !");
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
  // Rendering the component
  return (
    <div>
      <h1>Clients list</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="clients-grid">
        <div className="header">Name</div>
        <div className="header">Surname</div>
        <div className="header">Address</div>
        <div className="header">Birthdate</div>
        <div className="header">Note</div>
        <div className="header">email</div>
        <div className="header">password</div>
        <div className="header">Action</div>

        {clients.map((client) => (
          <>
            {editingId === client.id ? (
              <>
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
                <input
                  type="email"
                  value={editingData.email} // including email
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={editingData.password_hash} // including password
                  onChange={(e) =>
                    handleFieldChange("password_hash", e.target.value)
                  }
                  placeholder="Password"
                />
                <div className="actions">
                  <button onClick={handleUpdateClient}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                <div>{client.name}</div>
                <div>{client.surname}</div>
                <div>{client.address}</div>
                <div>{client.birthdate}</div>
                <div>{client.note}</div>
                <div>{client.email}</div>
                <div>{client.password_hash}</div>

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

      {/* New client form */}
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password_hash"
          placeholder="Password"
          value={newClient.password_hash}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add new client</button>
      </form>
    </div>
  );
}

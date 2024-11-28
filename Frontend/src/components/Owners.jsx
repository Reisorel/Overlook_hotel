import { useState, useEffect } from "react";
import "./Owners.css";

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

export default function Owners() {
  // States
  const [owners, setOwners] = useState([]); // Stocke les owners
  const [error, setError] = useState(null); // Stocke les erreurs
  const [message, setMessage] = useState(""); // Message de succès ou d'erreur

  const [editingId, setEditingId] = useState(null); // ID du propriétaire en cours d'édition
  const [editingData, setEditingData] = useState({}); // Nom temporaire pendant l'édition

  const [newOwner, setNewOwner] = useState({
    name: "",
  });

  const [showModal, setShowModal] = useState(false); // Affichage de la modale
  const [modalMessage, setModalMessage] = useState(""); // Message de la modal

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

  // Creating new owner
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setNewOwner({ ...newOwner, [name]: value });
  };

  const handleAddOwner = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOwner),
      });

      if (!response.ok) throw new Error("Failed to add owner");

      const result = await response.json();
      setOwners((prevOwners) => [...prevOwners, result.owner]);
      setNewOwner({
        name: "",
      });
    } catch (err) {
      console.log("Error adding owner", err);
    }
  };

  // Deleting owner
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/owners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete owner");
      }

      setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== id));
      // Modal intervention
      setModalMessage("Success deleting owner !");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting owner:", err);
      setModalMessage("Failed to delete owner !");
      setShowModal(true);
    }
  };

  // Editing owner
  const startEditing = (id, currentData) => {
    setEditingId(id);
    setEditingData(currentData);
  };

  const handleFieldChange = (fieldName, value) => {
    setEditingData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  // Saving editing
  const handleUpdateOwner = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/owners/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update owner");
      }
      const data = await response.json();
      setOwners((prevOwners) =>
        prevOwners.map((owner) =>
          owner.id === editingId ? { ...owner, ...editingData } : owner
        )
      );
      setMessage(data.message);

      //Show modal
      setModalMessage("Owner data correctly updated!");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating owner:", err.message);
      setModalMessage("Fail to update owner !");
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
      <h1>Owners list</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="owners-grid">
        <div className="header">Name</div>
        <div className="header">Action</div>

        {owners.map((owner) => (
          <>
            {editingId === owner.id ? (
              <>
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <div className="actions">
                  <button onClick={handleUpdateOwner}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                <div>{owner.name}</div>

                <div className="actions">
                  <button onClick={() => startEditing(owner.id, owner)}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(owner.id)}>❌</button>
                </div>
              </>
            )}
          </>
        ))}
      </div>

      <h2>Add new owner</h2>
      <form onSubmit={handleAddOwner}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newOwner.name}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add new owner</button>
      </form>
    </div>
  );
}

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
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password_hash: "",
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetching owner list
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        console.log("Starting fetch for getting owners");
        const response = await fetch("http://localhost:3000/api/owners");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des propriétaires");
        }
        const data = await response.json();

        console.log(data.owners);
        console.log("Fetched data:", data.owners);

        // Checking if list empty
        if (data.message && data.message === "No owners found") {
          setOwners([]);
        } else {
          setOwners(data.owners);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchOwners();
  }, []);

  // Creating new owner
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewOwner((prevOwner) => ({
      ...prevOwner,
      [name]: value,
    }));
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
      console.log("Full API response:", result);
      console.log("Owner added:", result.owner);
      setOwners((prevOwners) => [...prevOwners, result.owner]);
      setNewOwner({
        name: "",
        email: "",
        password_hash: "",
      });
      console.log("Owner to be added:", newOwner);

      // Show modal
      setModalMessage("Owner added successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error adding owner:", err);
      setModalMessage("Failed to add owner!");
      setShowModal(true);
    }
  };

  // Deleting owner
  const handleDelete = async (id) => {
    if (!id) {
      setModalMessage("Invalid owner ID!");
      setShowModal(true);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this owner?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/owners/${id}`, {
        method: "DELETE",
      });

      const data = await response.json(); // 🔥 Capture la réponse une seule fois

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete owner");
      }

      // Updating owner state :
      setOwners((prevOwners) => prevOwners.filter((owner) => owner.id !== id));

      // Show success modal
      setModalMessage("Success deleting owner !");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting owner:", err);

      // Show error modal
      setModalMessage(err.message);;
      setShowModal(true);
    }
  };

  // Edit owner
  const startEditing = (id, currentData) => {
    setEditingId(id);
    setEditingData({
      ...currentData,
      email: currentData.user?.email || "",
      password_hash: currentData.user?.password_hash || "",
    });
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
      console.log("Data being sent for update:", editingData);
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
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || "Failed to update owner");
      }

      const data = await response.json();
      setOwners((prevOwners) =>
        prevOwners.map((owner) =>
          owner.id === editingId ? data.owner : owner
        )
      );
      setMessage(data.message);

      //Show sucess modal
      setModalMessage("Owner data correctly updated!");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating owner:", err.message);
      // Show error modal
      setModalMessage("Fail to update owner !");
      setMessage(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  // Handeling errors
  if (error) {
    return <p>Erreur : {error}</p>;
  }

  // Rendering the component
  return (
    <div>
      <h1>Owners list</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="owners-grid">
        <div className="header">Name</div>
        <div className="header">Owner ID</div>
        <div className="header">Email</div>
        <div className="header">Password</div>
        <div className="header">User ID</div>
        <div className="header">Action</div>

        {owners.map((owner) => (
          <>
            {editingId === owner.id ? (
              <>
                <input
                  type="text"
                  value={editingData.name || ""}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <div>{owner.id}</div>
                <input
                  type="email"
                  value={editingData.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  autoComplete="off"
                  />
                <input
                  type="password"
                  value={editingData.password_hash || ""} // including password
                  onChange={(e) =>
                    handleFieldChange("password_hash", e.target.value)
                  }
                  autoComplete="off"
                />
                <div>{owner.user?.id}</div>
                <div className="actions">
                  <button onClick={handleUpdateOwner}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                <div>{owner.name}</div>
                <div>{owner.id}</div>
                <div>{owner.user?.email || "No email"}</div>
                <div>{owner.user?.password_hash || "No password"}</div>
                <div>{owner.user?.id || "No user ID"}</div>
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

      {/* New owner form */}
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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newOwner.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password_hash"
          placeholder="Password"
          value={newOwner.password_hash}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add new owner</button>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import "./Clients.css";

export default function Clients() {
  // States
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [newClient, setNewClient] = useState({
    name: "",
    surname: "",
    address: "",
    birthdate: "",
    note: "",
    email: "",
    password_hash: "",
  });

  //Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch clients list
  useEffect(() => {
    const fetchClients = async () => {
      try {
        console.log("Starting fetch for getting clients");
        const response = await fetch("http://localhost:3000/api/clients");
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error("Error getting clients");
        }
        const data = await response.json();

        console.log(data.clients);
        console.log("Fetched data:", data.clients);

        // Checking if list empty
        if (data.message && data.message === "No clients found") {
          setClients([]);
        } else {
          setClients(data.clients);
        }
      // Fetch clients error modal
      } catch (err) {
        setError(err.message);
        setModalMessage(`Erreur : ${err.message}`);
        setShowModal(true);
      }
    };

    fetchClients();
  }, []);

  // Create client
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
      console.log("Full API response:", result);
      console.log("Client added:", result.client);
      setClients((prevClients) => [...prevClients, result.client]);
      setNewClient({
        name: "",
        surname: "",
        address: "",
        birthdate: "",
        note: "",
        email: "",
        password_hash: "",
      });
      console.log("Client to be added:", newClient);

      // Create client modal
      setModalMessage("Client added successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error adding new client:", err);
      setModalMessage("Failed to add new client!");
      setShowModal(true);
    }
  };

  // Delete client :
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
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorDetails = await response.json(); // Capture des détails si fournis par l'API
        throw new Error(errorDetails.message || "Failed to delete client");
      }

      // Updating client state :
      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );

      // Delete client modal
      setModalMessage("Success deleting client!");
      setShowModal(true);

    } catch (err) {
      console.error("Error deleting client:", err);
      setModalMessage(err.message || "Failed to delete client!");
      setShowModal(true);
    }
  };

  // Edit client
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

  // Save editing
  const handleUpdateClient = async () => {
    try {
      console.log("Data being sent for update:", editingData);
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
          client.id === editingId ? data.client : client
        )
      );

      setMessage(data.message);

      // Edit client modal
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
        <div className="header">Client id</div>
        <div className="header">User ID</div>
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
                  autoComplete="off"
                />
                <input
                  type="password"
                  value={editingData.password_hash} // including password
                  onChange={(e) =>
                    handleFieldChange("password_hash", e.target.value)
                  }
                  autoComplete="off"
                />
                <div>{client.id}</div>
                <div>{client.user?.id}</div>
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
                <div>{client.user?.email}</div>
                <div>{client.user?.password_hash}</div>
                <div>{client.id}</div>
                <div>{client.user_id}</div>

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

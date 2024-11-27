import { useState, useEffect } from "react";
import "./Rooms.css";

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

export default function Rooms() {
  // States
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "",
    price: "",
    available: false,
    description: "",
    capacity: "",
    id_owner: "",
  });

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetching rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("Début de la requête fetch pour récupérer les chambres...");
        const response = await fetch("http://localhost:3000/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();

        setRooms(data.rooms);
        console.log("Fetched rooms:", data.rooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to fetch rooms");
      }
    };

    fetchRooms();
  }, []);

  // Create new room
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target; // Récupération des propriétés de l'élément modifié

    // Met à jour le champ correspondant dans l'état `newRoom`
    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: type === "checkbox" ? checked : value, // Gère les cases à cocher différemment
    }));
  };

  // Adding a new room
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.type || !newRoom.price) {
      alert("Please fill in all required fields!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error("Failed to add room");

      const result = await response.json();
      console.log("Room added:", result.rooms);
      setRooms((prevRooms) => [...prevRooms, result.rooms]);
      
      setNewRoom({
        name: "",
        type: "",
        price: "",
        available: false,
        description: "",
        capacity: "",
        id_owner: "",
      });
      console.log("Room to be added:", newRoom);


      // Show success modal
      setModalMessage("Room added successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error adding room:", err);
      setModalMessage("Failed to add room!");
      setShowModal(true);
    }
  };

  // Deleting a room
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete room");
      }

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));

      // Show success modal
      setModalMessage("Room deleted successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting room:", err);
      setModalMessage("Failed to delete room!");
      setShowModal(true);
    }
  };

  // Editing room :
  const startEditing = (id, currentData) => {
    setEditingId(id); // Définit la room en cours d'édition
    setEditingData(currentData); // Pré-remplit les données d'édition
  };

  const handleFieldChange = (fieldName, value) => {
    setEditingData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleUpdateRoom = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/rooms/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(editingData)
        }
      );
      if (!response.ok) {
        throw new Error ("Failed to update room")
      }
      const data = await response.json();
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === editingId ? { ...room, ...editingData } : room
        )
      );
      setMessage(data.message)

      setModalMessage("Rooms data correctly updated");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating room:", err.message);
      setModalMessage("Failed to update data")
      setMessage(err.message)
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


  // Rendering the component
  return (
    <div>
      <h1>Rooms List</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="rooms-grid">
        <div className="header">Name</div>
        <div className="header">Type</div>
        <div className="header">Price</div>
        <div className="header">Available</div>
        <div className="header">Description</div>
        <div className="header">Capacity</div>
        <div className="header">Owner ID</div>
        <div className="header">Action</div>

        {rooms.map((room) => (
          <>
            {editingId === room.id ? (
              <>
                {/* Mode édition : afficher des champs input */}
                <input
                  type="text"
                  value={editingData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <input
                  type="text"
                  value={editingData.type}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                />
                <input
                  type="integer"
                  value={editingData.price}
                  onChange={(e) => handleFieldChange("price", e.target.value)}
                />
                <input
                  type="checkbox"
                  value={editingData.available}
                  onChange={(e) =>
                    handleFieldChange("available", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={editingData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                />
                <input
                  type="integer"
                  value={editingData.capacity}
                  onChange={(e) =>
                    handleFieldChange("capacity", e.target.value)
                  }
                />
                <div className="actions">
                  <button onClick={handleUpdateRoom}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                {/* Mode lecture : afficher les données */}
                <div>{room.name}</div>
                <div>{room.type}</div>
                <div>{room.price}</div>
                <div>{room.available ? "Yes" : "No" }</div>
                <div>{room.description}</div>
                <div>{room.capacity}</div>
                <div>{room.id_owner}</div>
                <div className="actions">
                  <button onClick={() => startEditing(room.id, room)}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(room.id)}>❌</button>
                </div>
              </>
            )}
          </>
        ))}
      </div>

      <h2>Add new room</h2>
      <form onSubmit={handleAddRoom}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newRoom.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={newRoom.type}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newRoom.price}
          onChange={handleInputChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="available"
            checked={newRoom.available}
            onChange={handleInputChange}
          />{" "}
          Available
        </label>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newRoom.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={newRoom.capacity}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="id_owner"
          placeholder="Owner ID"
          value={newRoom.id_owner}
          onChange={handleInputChange}
        />
        <button type="submit">Add new room</button>
      </form>
    </div>
  );
}

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

  // Fetching rooms list
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
    const { name, value, type, checked } = e.target;


    setNewRoom((prevRoom) => ({
      ...prevRoom,
      [name]: type === "checkbox" ? checked : value, // Handeling checkboxes
    }));
  };

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
      console.log("Full API response:", result);
      console.log("Room added:", result.room);
      setRooms((prevRooms) => [...prevRooms, result.room]);

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


      // Show modal
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
    if (!id) {
      setModalMessage("Invalid room ID!");
      setShowModal(true);
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/rooms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to delete room");
      }

      // Updating room state :
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));

      // Show success modal
      setModalMessage("Room deleted successfully!");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting room:", err);
      // Show error modal
      setModalMessage("Failed to delete room!");
      setShowModal(true);
    }
  };

  // Editing room :
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

  const handleUpdateRoom = async () => {
    try {
      console.log("Data being sent for update:", editingData);
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
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to update client");
      }

      const data = await response.json();

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === editingId ? { ...room, ...editingData } : room
        )
      );

      setMessage(data.message)

      //Show success modal
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
      <h1>Rooms List</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="rooms-grid">
        <div className="header">Name</div>
        <div className="header">Type</div>
        <div className="header">Price</div>
        <div className="header">Available</div>
        <div className="header">Description</div>
        <div className="header">Capacity</div>
        <div className="header">Room ID</div>
        <div className="header">Owner ID</div>
        <div className="header">Action</div>

        {rooms.map((room) => (
          <>
            {editingId === room.id ? (
              <>
                <input
                  type="date"
                  value={editingData.check_in}
                  onChange={(e) => handleFieldChange("check-in", e.target.value)}
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
                <div>{room.id}</div>
                <input
                  type="integer"
                  value={editingData.id_owner}
                  onChange={(e) =>
                    handleFieldChange("id_owner", e.target.value)
                  }
                />
                <div className="actions">
                  <button onClick={handleUpdateRoom}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                <div>{room.name}</div>
                <div>{room.type}</div>
                <div>{room.price}</div>
                <div>{room.available ? "Yes" : "No" }</div>
                <div>{room.description}</div>
                <div>{room.capacity}</div>
                <div>{room.id}</div>
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

      {/* New room form */}
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

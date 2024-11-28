import { useState, useEffect } from "react";
import "./Reservations.css";

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

export default function Reservations() {
  // States
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [newReservation, setNewReservation] = useState({
    check_in: "",
    check_out: "",
    id_rooms: "",
    id_clients: "",
    number_of_people: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Getting reservation list
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log("Starting fetch for getting reservations");
        const response = await fetch("http://localhost:3000/api/reservations");
        if (!response.ok) {
          throw new Error("Error getting reservations");
        }
        const data = await response.json();

        setReservations(data.reservations);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchReservations();
  }, []);

  // Create new reservation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({ ...newReservation, [name]: value });
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
      });

      if (!response.ok) throw new Error("Failed to add reservation");

      const result = await response.json();
      setReservations((prevReservations) => [
        ...prevReservations,
        result.reservation,
      ]);
      setNewReservation({
        check_in: "",
        check_out: "",
        id_rooms: "",
        id_clients: "",
        number_of_people: "",
      });
    } catch (err) {
      if (err.response) {
        const errorData = await err.response.json();
        console.error("Error adding reservation:", errorData.message);
      } else {
        console.error("Error adding reservation:", err.message);
      }
    }
  };

  // Delete reservation
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reservation");
      }

      setReservations((prevReservations) =>
        prevReservations.filter((reservation) => reservation.id !== id)
      );

      // Modal intervention
      setModalMessage("Success deleting reservation !");
      setShowModal(true);
    } catch (err) {
      console.error("Error deleting reservation:", err);
      setModalMessage("Failed to delete reservation !");
      setShowModal(true);
    }
  };

  // Edit reservation
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

  const handleUpdateReservation = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/reservations/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      const data = await response.json();
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === editingId
            ? { ...reservation, ...editingData }
            : reservation
        )
      );
      setMessage(data.message);

      //Show modal
      setModalMessage("Reservation data correctly updated !");
      setShowModal(true);

      cancelEditing();
    } catch (err) {
      console.error("Error updating reservation:", err.message);
      setModalMessage("Fail to update reservation !");
      setShowModal(true); // corrigé
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
      <h1>Reservations list</h1>

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}

      <div className="reservations-grid">
        <div className="header">check_in</div>
        <div className="header">check_out</div>
        <div className="header">id_rooms</div>
        <div className="header">id_clients</div>
        <div className="header">number_of_people</div>
        <div className="header">Action</div>

        {reservations.map((reservation) => (
          <>
            {editingId === reservation.id ? (
              <>
                <input
                  type="date"
                  value={editingData.check_in}
                  onChange={(e) =>
                    handleFieldChange("check_in", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={editingData.check_out}
                  onChange={(e) =>
                    handleFieldChange("checkout_out", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={editingData.id_rooms}
                  onChange={(e) =>
                    handleFieldChange("id_rooms", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={editingData.id_clients}
                  onChange={(e) =>
                    handleFieldChange("id_clients", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={editingData.number_of_people}
                  onChange={(e) =>
                    handleFieldChange("number_of_people", e.target.value)
                  }
                />
                <div className="actions">
                  <button onClick={handleUpdateReservation}>💾</button>
                  <button onClick={cancelEditing}>❌</button>
                </div>
              </>
            ) : (
              <>
                <div>{reservation.check_in}</div>
                <div>{reservation.check_out}</div>
                <div>{reservation.id_rooms}</div>
                <div>{reservation.id_clients}</div>
                <div>{reservation.number_of_people}</div>

                <div className="actions">
                  <button
                    onClick={() => startEditing(reservation.id, reservation)}
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(reservation.id)}>
                    ❌
                  </button>
                </div>
              </>
            )}
          </>
        ))}
      </div>
      {/* New reservation  form */}
      <h2>Add new reservation</h2>
      <form onSubmit={handleAddReservation}>
        <input
          type="date"
          name="check_in"
          placeholder="Check_in"
          value={newReservation.check_in}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="check_out"
          placeholder="Check_out"
          value={newReservation.check_out}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="id_rooms"
          placeholder="id_rooms"
          value={newReservation.id_rooms}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="id_clients"
          placeholder="id_clients"
          value={newReservation.id_clients}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="number_of_people"
          placeholder="Number Of People"
          value={newReservation.number_of_people}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add new reservation</button>
      </form>
    </div>
  );
}

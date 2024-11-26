import "./Welcome.css";
import { useNavigate } from "react-router-dom"; // Hook pour naviguer programmatique

export default function Welcome() {
  const navigate = useNavigate(); // Initialise la navigation

  return (
    <div className="welcome-container">
      <h1>Welcome to the section!</h1>
      <p>
        <span
          onClick={() => navigate("/rooms")} // Navigation au clic
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          Click here to see our rooms!
        </span>
      </p>
      <p>
        <span
        onClick={() => navigate("/owners")}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >Click here to see the owners</span>
      </p>
      <p>
        <span
        onClick={() => navigate("/clients")}
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >Click here to see the clients</span>
      </p>
    </div>
  );
}

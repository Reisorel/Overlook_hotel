import "./Header.css";
import { useNavigate } from "react-router-dom"; // Hook pour naviguer programmatique


export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <h2 className="logo"><span
      onClick={() => navigate("/")}
      >Hotel Bonnes Vacances</span></h2>
      <div className="header-content">
        <p>Bienvenue sur notre site !</p>
      </div>
    </header>
  );
}

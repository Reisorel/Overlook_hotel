import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Welcome from "./components/Welcome";
import Rooms from "./components/Rooms";
import Owners from "./components/owners";
import Clients from "./components/Clients";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Main>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/owners" element={<Owners/>} />
              <Route path="/clients" element={<Clients/>}/>
            </Routes>
          </Main>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;

//UseLocation pour personnaliser le router

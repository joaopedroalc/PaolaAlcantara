import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./styles.css";

import firebase from "firebase/app";
import "firebase/auth";

import Button from "@mui/material/Button";

const Header = ({ setUser, infosUser }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveTab("Home");
    } else if (location.pathname === "/add") {
      setActiveTab("AddContact");
    }
  }, [location]);

  const logout = () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        setUser(false);
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  return (
    <div className='header'>
      <div className='logoTitle'>
        <span className='titleOpen'>Paola Alcântara 💉</span>
      </div>
      <div className='header-right'>
        <Link to='/'>
          <p
            className={`${activeTab === "Home" ? "active" : ""}`}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </p>
        </Link>
        <Link to='/add'>
          <p
            className={`${activeTab === "AddContact" ? "active" : ""}`}
            onClick={() => setActiveTab("Add Contact")}
          >
            Adicionar consulta
          </p>
        </Link>

        <div className='container-infosUser'>
          <img
            src={infosUser.photoURL}
            alt='photoURL'
            referrerPolicy='no-referrer'
          />
          <Button onClick={logout} variant='contained' color='warning'>
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;

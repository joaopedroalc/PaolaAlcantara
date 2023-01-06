import { useState } from "react";
import styles from "./PageBeforeLogin.module.css";

import App from "./App";
import firebase from "firebase/app";
import "firebase/auth";

import paola from "./assets/paola.png";

import Button from "@mui/material/Button";

export function PageBeforeLogin() {
  const [user, setUser] = useState(false);
  const [infosUser, setInfosUser] = useState("");
  var provider = new firebase.auth.GoogleAuthProvider();

  const logar = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        // console.log(user.email);
        setInfosUser(user);
      })
      .catch((error) => {
        alert(error.message);
      });

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      if (
        user.email === "joaopedro.ufma@gmail.com" ||
        user.email === "paollaalcantara2016@gmail.com"
      ) {
        setUser(true);
        setInfosUser(user);
      }
      // ...
    } else {
      setUser(false);
      setInfosUser("");
    }
  });

  return (
    <div>
      {user === true ? (
        <App setUser={setUser} infosUser={infosUser} />
      ) : (
        <div className={styles.home}>
          <header className={styles.header}>
            <a href='/'>💉</a>

            <Button
              variant='contained'
              style={{ backgroundColor: "green" }}
              onClick={logar}
            >
              Entrar com google
            </Button>
          </header>
          <main>
            <div className={styles.colTwo}>
              <div className={styles.infos}>
                <h2>Paola Alcântara</h2>
                <p>Sistema para gestão de agendamentos de clientes.</p>
                <p>Estética facial | Corporal</p>
              </div>
              <img className={styles.paola} src={paola} alt='paola' />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

import React, { Component } from "react";
import "../stylesheets/navbar.module.css"
import displayComponent from '../utility/displayComponent'
import logo from '../Bootstrap.svg'

export default class Navbar extends Component {

  state = { loginString: "Accedi" };

  // Cambia il testo dei bottoni di autenticazione
  autenticationString() {
    console.log('IDUtente: ' + sessionStorage.getItem('id') + '  -  isHost: ' + sessionStorage.getItem('isHost'));
    let id_utente = sessionStorage.getItem('id');
    if (id_utente !== null) {
      this.setState({ loginString: "Logout" });
      displayComponent('signUp', false)
      if (Number(sessionStorage.getItem('isHost')) === 1) {
        displayComponent('gestioneAnnunci', true)
        displayComponent('diventaHost', false)
      }
      else displayComponent('gestioneAnnunci', false)
    }
    else {
      displayComponent('gestioneAnnunci', false)
      displayComponent('diventaHost', false)
      this.setState({ loginString: "Accedi" });
    }
  }

  // Gestisce le azioni per il Login e il Logout
  autenticationControl() {
    let id_utente = sessionStorage.getItem('id');
    if (id_utente !== null) {

      if (window.confirm("Vuoi effettuare il Logout?")) {
        //Effettua il LogOut, eliminando l'id salvato
        sessionStorage.clear();
        this.autenticationString();
        window.location.reload(false);
      }
    }
    else {
      // Mostra la schermata di Login
      displayComponent("Login", true)
    }
  }

  componentDidMount() {
    this.autenticationString();
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark" style={{ zIndex: 999 }}>
        <a className="navbar-brand" href="/">
          <img src={logo} width="30" height="30" alt='HomePageImg' className="d-inline-block align-top mr-2" />Bootstrap</a>

        <button className="navbar-toggler" style={{ width: 60 }} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav ml-auto">

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span style={{ fontSize: '30px', color: 'Dodgerblue' }}>
                  <i className="fas fa-user"></i>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                <a className="dropdown-item" id='login' onClick={() => this.autenticationControl()}>{this.state.loginString}</a>
                <a className="dropdown-item font-weight-bold" id='signUp' onClick={() => this.displayComponent("SignUp", true)}>Registrati</a>
                <a className="dropdown-item" id='diventaHost' onClick={() => this.displayComponent("DiventaHost", true)}>Diventa Host</a>
                <a className="dropdown-item" id="gestioneAnnunci" href="/gestioneAnnunci/paginaRicercaProprietario">Gestione Annunci</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

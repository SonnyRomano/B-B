import React, { Component } from "react";
import "../stylesheets/navbar.css"
import displayComponent from '../utility/displayComponent'
import logo from '../Bootstrap.svg'

export default class Navbar extends Component {

  state = { loginString: "Accedi", signUpString: "Registrati", diventaHost: "Diventa un host" };

  // Nasconde le funzioni del proprietario se non autenticato
  hiddenButton(flag) {
    var setVisibility = "initial"
    if (!flag) setVisibility = "none"

    var arrayBottoni = document.getElementsByName("BottoniProprietario")
    for (let e of arrayBottoni) e.style.display = setVisibility
    //console.log("hiddenButton pressed")
    return true
  }

  // Cambia il testo dei bottoni di autenticazione
  autenticationString() {
    console.log('IDUtente: ' + sessionStorage.getItem('id') + '  -  isHost: ' + sessionStorage.getItem('isHost'));
    let id_utente = sessionStorage.getItem('id');
    if (id_utente !== null) {
      this.setState({ loginString: "Logout", signUpString: "", diventaHost: "Diventa un host" });
      if (Number(sessionStorage.getItem('isHost')) === 1) {
        this.hiddenButton(true)
        this.setState({ diventaHost: "" })
      }
      else this.hiddenButton(false)
    }
    else {
      this.hiddenButton(false)
      this.setState({ loginString: "Accedi", signUpString: "Registrati", diventaHost: "" });
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
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          <img src={logo} width="30" height="30" className="d-inline-block align-top mr-2" />Bootstrap</a>

        <button className="navbar-toggler" style={{ width: 60 }} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item dropdown" name="BottoniProprietario">
              <a className="nav-link dropdown-toggle" id="navbardrop" data-toggle="dropdown">Gestione Legale</a>
              <div className="dropdown-menu">
                <a className="dropdown-item">Rendiconta Tasse Soggiorno</a>
                <a className="dropdown-item">Questura</a>
              </div>
            </li>
            <li className="nav-item dropdown" name="BottoniProprietario">
              <a className="nav-link dropdown-toggle mr-3" data-toggle="dropdown">Gestione Annunci</a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="/gestioneAnnunci/inserisciAnnuncio">Inserisci Annuncio</a>
                <a className="dropdown-item" href="/gestioneAnnunci/paginaRicercaProprietario">Modifica Annuncio</a>
                <a className="dropdown-item" href="/gestioneAnnunci/eliminaAnnuncio">Elimina Annuncio</a>
                <a className="dropdown-item" href="/gestioneAnnunci/visualizzaPrenotazioni">Visualizza Prenotazioni</a>
                <a className="dropdown-item">Visualizza Guadagni</a>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" onClick={() => displayComponent("DiventaHost", true)}>{this.state.diventaHost}</a>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-outline-info"
                onClick={() => this.autenticationControl()}>{this.state.loginString}</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-outline-info " onClick={() => displayComponent("SignUp", true)}>{this.state.signUpString}</button>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

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
    let path = 'http://localhost:3000'

    switch (window.location.href) {
      case path + '/gestioneAnnunci/paginaRicercaProprietario':
        document.getElementById('Annunci').className = "nav-link active"
        displayComponent("tabAnnunci", true)
        break

      case path + "/gestioneAnnunci/visualizzaGuadagno":
        document.getElementById('visualizzaGuadagni').className = "nav-link active"
        displayComponent("tabAnnunci", true)
        break

      case path + "/gestioneAnnunci/visualizzaPrenotazioni":
        // document.getElementById('visualizzaPrenotazioni').className = "nav-link active"
        break

      case path + "/gestioneAnnunci/rendicontaTasse":
        document.getElementById('rendicontaTasse').className = "nav-link active"
        displayComponent("tabAnnunci", true)
        break

      case path + '/gestioneLegale/visualizzaPrenotazioniQuestura':
        document.getElementById('Questura').className = "nav-link active"
        displayComponent("tabAnnunci", true)
        break

      default:
        displayComponent("tabAnnunci", false)
        break
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark" style={{ zIndex: 999 }}>
          <a className="navbar-brand" href="/">
            <img src={logo} width="30" height="30" alt='HomePageImg' className="d-inline-block align-top" />Bootstrap</a>

          <button className="navbar-toggler" style={{ width: 60 }} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav d-flex justify-content-around" style={{ width: '100%' }}>
              <li className="nav-item">
                <a className="nav-link" id='Annunci' href="/gestioneAnnunci/paginaRicercaProprietario">Annunci</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id='visualizzaGuadagni' href="/gestioneAnnunci/visualizzaGuadagno">Guadagni</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id='Questura' href="/gestioneLegale/visualizzaPrenotazioniQuestura">Questura</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" id='rendicontaTasse' href="/gestioneLegale/rendicontaTasse">Ufficio del Turismo</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span style={{ color: 'Dodgerblue' }}>
                    <i className="fas fa-user"></i>
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                  <a className="dropdown-item font-weight-bold" id='signUp' onClick={() => displayComponent("SignUp", true)}>Registrati</a>
                  <a className="dropdown-item" id='login' onClick={() => this.autenticationControl()}>{this.state.loginString}</a>
                  {/* <div className="dropdown-divider"></div> */}
                  <a className="dropdown-item" id='diventaHost' onClick={() => displayComponent("DiventaHost", true)}>Diventa un host</a>
                  {/* <a className="dropdown-item" id="gestioneAnnunci" href="/gestioneAnnunci/paginaRicercaProprietario">Gestione Annunci</a> */}
                </div>
              </li>
            </ul>
          </div>
        </nav>
        {/* <div id='tabAnnunci'>
          <ul className="nav nav-pills nav-fill bg-white">
            <li className="nav-item">
              <a className="nav-link" id='visualizzaPrenotazioni' href="/gestioneAnnunci/visualizzaPrenotazioni">Prenotazioni Pendenti</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id='Annunci' href="/gestioneAnnunci/paginaRicercaProprietario">Annunci</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id='visualizzaGuadagni' href="/gestioneAnnunci/visualizzaGuadagno">Guadagni</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id='Questura' href="/gestioneLegale/visualizzaPrenotazioniQuestura">Questura</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id='rendicontaTasse' href="/gestioneLegale/rendicontaTasse">Ufficio del Turismo</a>
            </li>
          </ul>
        </div> */}
      </div>
    );
  }
}

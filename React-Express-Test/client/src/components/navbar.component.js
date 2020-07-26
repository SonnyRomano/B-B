import React, { Component } from "react";
import "../stylesheets/navbar.css"
import Login from './login.component'
import SignUp from "./signUp.component";


export default class Navbar extends Component {

    state = { loginString: "Accedi", signUpString: "Registrati" };

    // Nasconde le funzioni del proprietario se non autenticato
    hiddenButton(flag) {
        var setVisibility = "initial"
        if (!flag) setVisibility = "none"

        var arrayBottoni = document.getElementsByName("BottoniProprietario")
        for (let e of arrayBottoni) e.style.display = setVisibility
        console.log("hiddenButton pressed")
        return true
    }

    // Cambia il testo dei bottoni di autenticazione
    autenticationString() {
        console.log(sessionStorage.getItem('id'));
        let id_utente = sessionStorage.getItem('id');
        if (id_utente !== null) {
            this.hiddenButton(true)
            this.setState({ loginString: "Logout", signUpString: "" });
        }
        else {
            this.hiddenButton(false)
            this.setState({ loginString: "Accedi", signUpString: "Registrati" });
        }
    }

    autenticationControl() {
        let id_utente = sessionStorage.getItem('id');
        if (id_utente !== null) {
            //Effettua il LogOut, eliminando l'id salvato
            sessionStorage.clear();
            this.autenticationString();
        }
        else {
            // Mostra la schermata di Login
            Login.displayLogin(true);
        }
    }

    componentDidMount() {
        this.autenticationString();
    }

    render() {
        return (
            <nav className="navbar navbar-expand-md  ">

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">

                    <ul className="navbar-nav">
                        <li className="nav-item dropdown" name="BottoniProprietario">
                            <a className="nav-link dropdown-toggle" id="navbardrop" data-toggle="dropdown">
                                Gestione Legale
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item">Rendiconta Tasse Soggiorno</a>
                                <a className="dropdown-item">Questura</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown" name="BottoniProprietario">
                            <a className="nav-link dropdown-toggle mr-3" data-toggle="dropdown">
                                Gestione Annunci
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" href="/gestioneAnnunci/inserisciAnnuncio">Inserisci Annuncio</a>
                                <a className="dropdown-item">Modifica Annuncio</a>
                                <a className="dropdown-item">Elimina Annuncio</a>
                                <a className="dropdown-item">Visualizza Prenotazioni</a>
                                <a className="dropdown-item">Visualizza Guadagni</a>
                            </div>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link">Diventa host</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"
                                onClick={() => this.autenticationControl()}>{this.state.loginString}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => SignUp.displaySignUp(true)}>{this.state.signUpString}</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

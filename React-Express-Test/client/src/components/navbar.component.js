import React, { Component } from "react";
import "../stylesheets/navbar.css"
import Login from './login.component'
import SignUp from "./signUp.component";


export default class Navbar extends Component {

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
                                onClick={() => Login.displayLogin(true)}>Accedi</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => SignUp.displaySignUp(true)}
                            >Registrati</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

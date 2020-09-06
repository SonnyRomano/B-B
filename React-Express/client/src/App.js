import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/navbar.component'
import HomePage from './components/homePage.component'
import Login from './components/login.component'
import SignUp from './components/signUp.component';
import DiventaHost from './components/diventaHost.component'
//import Footer from './components/footer.component';
import PaginaRicerca from './components/paginaRicerca.component';

import InserisciAnnuncio from './components/inserisciAnnuncio.component'
import DettaglioAnnuncio from './components/dettaglioAnnuncio.component';
import EliminaAnnuncio from './components/eliminaAnnuncio.component';
import ModificaAnnuncio from './components/modificaAnnuncio.component';
import PaginaRicercaProprietario from './components/paginaRicercaProprietario.component';
import moduloPagamento from './components/moduloPagamento.component';
import VisualizzaPrenotazioni from './components/visualizzaPrenotazioni.component';
import RiepilogoPrenotazione from "./components/riepilogoPrenotazione";
import VisualizzaGuadagno from './components/visualizzaGuadagno.component'
import VisualizzaPrenotazioniTasse from './components/visualizzaPrenotazioniTasse.component'


import VisualizzaPrenotazioniQuestura from './components/visualizzaPrenotazioniQuestura.component'
import FormQuestura from './components/formQuestura.component'
import FormUfficioTurismo from "./components/formUfficioTurismo.component";



class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", isLogged: false };
    }

    isLogged() {
        let userId = sessionStorage.getItem('id')
        if (userId !== null) return true
        else return false
    }

    render() {
        return (
            <React.Fragment>
                <Router>
                    <Login />
                    <SignUp />
                    <DiventaHost />
                    <Navbar />


                    <React.Fragment>
                        <Route exact path="/" component={HomePage} />

                        <Route exact path="/gestioneAnnunci/dettaglioAnnuncio" component={DettaglioAnnuncio} />
                        <Route exact path="/gestioneAnnunci/eliminaAnnuncio" component={EliminaAnnuncio} />
                        <Route exact path="/gestioneAnnunci/inserisciAnnuncio" component={InserisciAnnuncio} />
                        <Route exact path="/gestioneAnnunci/modificaAnnuncio" component={ModificaAnnuncio} />
                        <Route exact path="/gestioneAnnunci/paginaRicerca" component={PaginaRicerca} />
                        <Route exact path="/gestioneAnnunci/paginaRicercaProprietario" component={PaginaRicercaProprietario} />
                        <Route exact path="/gestioneAnnunci/visualizzaPrenotazioni" component={VisualizzaPrenotazioni} />
                        <Route exact path="/gestioneAnnunci/visualizzaGuadagno" component={VisualizzaGuadagno} />

                        <Route exact path="/prenotazione/moduloPagamento" component={moduloPagamento} />
                        <Route exact path="/prenotazione/riepilogoPrenotazione" component={RiepilogoPrenotazione} />

                        <Route exact path="/gestioneLegale/visualizzaPrenotazioniQuestura" component={VisualizzaPrenotazioniQuestura} />
                        <Route exact path="/gestioneLegale/formQuestura" component={FormQuestura} />
                        <Route exact path="/gestioneLegale/formUfficioTurismo" component={FormUfficioTurismo} />
                        <Route exact path="/gestioneLegale/rendicontaTasse" component={VisualizzaPrenotazioniTasse} />
                    </React.Fragment>
                </Router>

                {/* <Footer /> */}
            </React.Fragment>
        );
    }
}

export default App;

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/navbar.component'
import HomePage from './components/homePage.component'
import InserisciAnnuncio from './components/inserisciAnnuncio.component'
import Login from './components/login.component'
import SignUp from './components/signUp.component';
import DiventaHost from './components/diventaHost.component'
import Footer from './components/footer.component';
import PaginaRicerca from './components/paginaRicerca.component';

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
            <div>


                <Router>
                    <Login />
                    <SignUp />
                    <DiventaHost />
                    <Navbar />

                    <div className="App">
                        <Route exact path="/" component={HomePage} />
                    </div>
                    <div className="container">
                        <Route exact path="/gestioneAnnunci/inserisciAnnuncio" component={InserisciAnnuncio} />
                        <Route exact path="/gestioneAnnunci/paginaRicerca" component={PaginaRicerca} />
                    </div>
                </Router>

                <Footer />
            </div>
        );
    }
}

export default App;

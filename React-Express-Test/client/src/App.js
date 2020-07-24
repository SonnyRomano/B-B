import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/navbar.component'
import HomePage from './components/homePage.component'
import InserisciAnnuncio from './components/inserisciAnnuncio.component'
import Login from './components/login.component'
import SignUp from './components/signUp.component';
import Footer from './components/footer.component';
import PaginaRicerca from './components/paginaRicerca.component';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9000/")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }


    render() {
        return (
            <div>
                <Login />
                <SignUp />
                <Navbar />

                <Router>
                    <div className="App">
                        <Route exact path="/" component={HomePage} />
                    </div>
                    <div className="container">
                        <Route exact path="/logged" component={HomePage} />
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

import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';


export default class InserisciAnnuncio extends Component {

    state = {
        citta: '',
        indirizzo: '',
        n_posti: '',
        n_bagni: ''
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const annuncio = {
            citta: this.state.citta,
            indirizzo: this.state.indirizzo,
            n_posti: this.state.n_posti,
            n_bagni: this.state.n_bagni
        };

        console.log(annuncio);

        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/inserisciAnnuncio`, { annuncio })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    render() {
        return (
            <div className="container justify-content-center">
                <div className="col-md-8 py-5" style={{ marginLeft: '15%' }}>
                    <div className="card" style={{ padding: '2rem' }}>

                        <h1 className="h3">Inserisci nuovo annuncio</h1>
                        <p className="card-text">Compila i campi con i dati dell'annuncio da inserire</p>

                        <form onSubmit={this.handleSubmit}>
                            <div className="container">
                                <div className="form-group">
                                    <label>Città</label>
                                    <input className="form-control" name="citta" placeholder="Inserire città" onChange={this.handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label>Indirizzo</label>
                                    <input className="form-control" name="indirizzo" placeholder="Inserire indirizzo" onChange={this.handleChange} required />
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label>Numero bagni</label>
                                        <input className="form-control" name="n_bagni" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-6">
                                        <label>Numero Posti Letto</label>
                                        <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <button className="btn btn-danger btn-block mt-5" type="submit">Inserisci Annuncio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >

        );
    }
}
import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class InserisciAnnuncio extends Component {

    imageFiles = []

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

    onImageChange = (event) => {
        this.imageFiles = event.target.files
    }

    handleSubmit = event => {
        event.preventDefault();

        let annuncio = {
            idProprietario: sessionStorage.getItem('id'),
            citta: this.state.citta,
            indirizzo: this.state.indirizzo,
            n_posti: this.state.n_posti,
            n_bagni: this.state.n_bagni,
        }

        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/inserisciAnnuncio`, { annuncio })
            .then(res => {
                console.log(res);

                let formData = new FormData();
                formData.append('idAnnuncio', res.data.insertId)
                for (const file of this.imageFiles) {
                    formData.append('file', file, file.name);
                }

                axios.post(`http://127.0.0.1:9000/gestioneAnnunci/uploadImmaginiAnnuncio`, formData)
                    .then(res => {
                        console.log(res);
                    })
            })
    }

    componentDidMount() {
        checkRoutingAccess(this.props)
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

                                <div className="form-group">
                                    <label htmlFor="img">Seleziona immagini:</label>
                                    <br></br>
                                    <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} required />
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
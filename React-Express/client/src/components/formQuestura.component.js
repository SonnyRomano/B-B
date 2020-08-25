import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class FormQuestura extends Component {

    imageFiles = []

    state = {
        listOfFields: []
    }

    onImageChange = (event) => {
        this.imageFiles = event.target.files
    }

    handleSubmit = event => {
        event.preventDefault();

        let idPrenotazione = this.props.location.state

        let nomeCognome = []
        let nomeCognomeElement = document.getElementsByName("nomeCognome")
        for (let e = 0; e < nomeCognomeElement.length; e++) nomeCognome.push(nomeCognomeElement[e].value)

        let codiceFiscale = []
        let codiceFiscaleElement = document.getElementsByName("codiceFiscale")
        for (let e = 0; e < codiceFiscaleElement.length; e++) codiceFiscale.push(codiceFiscaleElement[e].value)


        let formData = new FormData();
        for (let i = 0; i < this.imageFiles.length; i++) {
            formData.append('file', this.imageFiles[i], 'img' + i + '.png');
        }

        let dati = {
            nomeCognome,
            codiceFiscale,
            formData,
            idPrenotazione
        }

        console.log(dati)

        axios.post(`http://127.0.0.1:9000/gestioneLegale/invioDatiQuestura`, { dati })
            .then(res => {
                console.log(res);
            })
    }

    componentDidMount() {
        checkRoutingAccess(this.props)
    }

    aggiungiOspite() {
        let listTemp = this.state.listOfFields
        listTemp.push(
            <div key={listTemp.length} className="form-row my-3">
                <div className="col-4">
                    <label>Nome e Cognome</label>
                    <input className="form-control" name="nomeCognome" placeholder="Inserire Nome e Cognome" required />
                </div>
                <div className="col-4">
                    <label>Codice Fiscale</label>
                    <input className="form-control" name="codiceFiscale" placeholder="Inserire Codice Fiscale" required />
                </div>
            </div>)

        this.setState({ listOfFields: listTemp })
    }

    rimuoviOspite() {
        let listTemp = this.state.listOfFields
        listTemp.pop()

        this.setState({ listOfFields: listTemp })
    }

    render() {
        return (
            <div className="container justify-content-center">
                <div className="col-md-10 py-5">
                    <div className="card" style={{ padding: '2rem', background: '#FFFACD' }}>

                        <h1 className="h3">Inserisci Dati Ospiti</h1>
                        <p className="card-text">Compila i Campi con i Dati degli Ospiti</p>

                        <form onSubmit={this.handleSubmit}>

                            <div className="container">
                                <div>
                                    {
                                        this.state.listOfFields
                                    }
                                </div>

                                <div className="form-row">
                                    <div className="col-6 my-5">
                                        <label htmlFor="img">Seleziona Immagini Documenti d'Identità:</label>
                                        <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} />
                                    </div>
                                </div>

                                <div className='row' style={{ marginTop: '2rem' }}>
                                    <div className='col-6' style={{ marginTop: '2rem' }}>
                                        <button type="button" className="btn btn-lg btn-primary" onClick={() => this.aggiungiOspite()}>Aggiungi Ospite</button>
                                    </div>
                                    <div className='col-6' style={{ marginTop: '2rem' }}>
                                        <button type="button" className="btn btn-lg btn-primary" onClick={() => this.rimuoviOspite()}>Rimuovi Ultimo Ospite</button>
                                    </div>
                                </div>
                                <button className="btn btn-lg btn-danger mt-3" type="submit">Inserisci Annuncio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }
}
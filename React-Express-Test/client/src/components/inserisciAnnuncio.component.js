import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class InserisciAnnuncio extends Component {

    imageFiles = []
    coverFile = []

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

    onCoverChange = (event) => {
        this.coverFile = event.target.files
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
                for (let i = 0; i < this.imageFiles.length; i++) {
                    formData.append('file', this.imageFiles[i], 'img' + i + '.png');
                }
                formData.append('file', this.coverFile[0], 'Cover.png')

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
                <div className="col-md-10 py-5">
                    <div className="card" style={{ padding: '2rem',background: '#FFFACD'}}>

                        <h1 className="h3">Inserisci nuovo annuncio</h1>
                        <p className="card-text">Compila i campi con i dati dell'annuncio da inserire</p>

                        <form onSubmit={this.handleSubmit}>
                            <div className="container">
                                <div className="form-row">
                                    <div className="col-4">
                                        <label>Città</label>
                                        <input className="form-control" name="citta" placeholder="Inserire città" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-2">
                                        <label>Cap</label>
                                        <input className="form-control" name="cap" placeholder="CAP" required />
                                    </div>
                                    <div className="col-5">
                                        <label>Indirizzo</label>
                                        <input className="form-control" name="indirizzo" placeholder="Inserire indirizzo" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-1">
                                        <label>Civico</label>
                                        <input className="form-control" name="Civico" placeholder="n"  required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-3">
                                        <label>Inizio disponibilità</label>
                                        <input id="availabilityFrom" type="date" className="form-control" onInput={this.dataControl}
                                        name="availabilityFrom_r" />
                                    </div>
                                    <div className="col-3">
                                        <label>Termine disponibilità</label>
                                        <input id="aivalabilityTo" type="date" className="form-control" onInput={this.dataControl}
                                            name="aivalabilityTo_r" />
                                    </div>
                                    <div className="col-3">
                                        <label>Numero Posti Letto</label>
                                        <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-3">
                                        <label>Numero bagni</label>
                                        <input className="form-control" name="n_bagni" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-3">
                                        <input type="checkbox" id="wifi" name="wifi" value="wifi"/>
                                        <label for="wifi">Presenza Wi-fi</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="ascensore" name="ascensore" value="ascensore"/>
                                        <label for="ascensore">Presenza ascensore</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="garage" name="garage" value="garage"/>
                                        <label for="garage">Presenza garage</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="terrazzo" name="terrazzo" value="terrazzo"/>
                                        <label for="terrazzo">Presenza terrazzo</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label>Costo giornaliero</label>
                                        <input className="form-control" name="costoGiornaliero" placeholder="Inserire costo giornaliero" required />
                                    </div>
                                    <div className="col-6">
                                        <label>Recapito telefonico</label>
                                        <input className="form-control" name="num_telefono" placeholder="Inserire numero telefono" required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona Cover Annuncio:</label>
                                        <input type="file" id="cover" name="cover" accept="image/*" multiple onChange={this.onCoverChange} required />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona immagini:</label>
                                        <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} required />
                                    </div>
                                </div>
                                <textarea rows="4" cols='70' name="descrizione">...inserire una breve descrizione dell'annuncio...</textarea>
                                <button className="btn btn-danger btn-block mt-5" type="submit">Inserisci Annuncio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >

        );
    }
}
import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class InserisciAnnuncio extends Component {

    imageFiles = []
    coverFile = []

    state = {
        citta: '',
        cap: '',
        indirizzo: '',
        civico: '',
        dateFrom: '',
        dateTo: '',
        n_posti: '',
        n_bagni: '',
        wifi: 0,
        ascensore: 0,
        garage: 0,
        terrazzo: 0,
        descrizione: '',
        telefono: '',
        costo: ''
    }

    //Controlla inserimento date Check-in e Check-out
    dataControl() {
        var dataFrom = document.getElementById("dateFrom")
        var dataTo = document.getElementById("dateTo")
        if (dataFrom.value > dataTo.value) dataTo.value = null
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
            cap: this.state.cap,
            indirizzo: this.state.indirizzo,
            civico: this.state.civico,
            dateFrom: this.state.dateFrom,
            dateTo: this.state.dateTo,
            n_posti: this.state.n_posti,
            n_bagni: this.state.n_bagni,
            wifi: this.state.wifi,
            ascensore: this.state.ascensore,
            garage: this.state.garage,
            terrazzo: this.state.terrazzo,
            descrizione: this.state.descrizione,
            costo: this.state.costo,
            telefono: this.state.telefono
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

                        window.confirm('Annuncio Inserito');
                        this.props.history.push('/')
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
                    <div className="card" style={{ padding: '2rem', background: '#FFFACD' }}>

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
                                        <input className="form-control" name="cap" placeholder="CAP" type='text' pattern='[0-9]{5}' maxLength="5" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-5">
                                        <label>Indirizzo</label>
                                        <input className="form-control" name="indirizzo" placeholder="Inserire indirizzo" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-1">
                                        <label>Civico</label>
                                        <input className="form-control" name="civico" placeholder="n" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-3">
                                        <label>Inizio disponibilità</label>
                                        <input id="dateFrom" type="date" className="form-control" onInput={this.dataControl}
                                            name="dateFrom" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-3">
                                        <label>Termine disponibilità</label>
                                        <input id="dateTo" type="date" className="form-control" onInput={this.dataControl}
                                            name="dateTo" onChange={this.handleChange} required />
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
                                        <input type="checkbox" id="wifi" name="wifi" value='1' onChange={this.handleChange} />
                                        <label htmlFor="wifi">Presenza Wi-fi</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="ascensore" name="ascensore" value="1" onChange={this.handleChange} />
                                        <label htmlFor="ascensore">Presenza ascensore</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="garage" name="garage" value="1" onChange={this.handleChange} />
                                        <label htmlFor="garage">Presenza garage</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="terrazzo" name="terrazzo" value="1" onChange={this.handleChange} />
                                        <label htmlFor="terrazzo">Presenza terrazzo</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label>Costo giornaliero</label>
                                        <input className="form-control" name="costo" placeholder="Inserire costo giornaliero" type='number' onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-6">
                                        <label>Recapito telefonico</label>
                                        <input className="form-control" name="telefono" placeholder="Inserire numero telefono" type='text' pattern='[0-9]{10}' maxLength="10" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona Cover Annuncio:</label>
                                        <input type="file" id="cover" name="cover" accept="image/*" onChange={this.onCoverChange} required />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona immagini:</label>
                                        <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} required />
                                    </div>
                                </div>
                                <textarea rows="4" cols='70' name="descrizione" onChange={this.handleChange} ></textarea>
                                <button className="btn btn-danger btn-block mt-5" type="submit">Inserisci Annuncio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }
}
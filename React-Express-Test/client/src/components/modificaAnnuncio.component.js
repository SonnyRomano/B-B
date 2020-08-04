import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';
import dateFormat from 'dateformat'


export default class ModificaAnnuncio extends Component {

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
        costo: 0,
        idAnnuncio: ''
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
            dateFrom: dateFormat(this.state.dateFrom, 'yyyy-mm-dd'),
            dateTo: dateFormat(this.state.dateTo, 'yyyy-mm-dd'),
            n_posti: this.state.n_posti,
            n_bagni: this.state.n_bagni,
            wifi: this.state.wifi,
            ascensore: this.state.ascensore,
            garage: this.state.garage,
            terrazzo: this.state.terrazzo,
            descrizione: this.state.descrizione,
            costo: this.state.costo,
            telefono: this.state.telefono,
            idAnnuncio: this.state.idAnnuncio
        }
        console.log(annuncio)

        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/aggiornaAnnuncio`, { annuncio })
            .then(res => {
                console.log(res);
            })
    }

    componentDidMount() {
        checkRoutingAccess(this.props)
    }

    componentWillMount() {
        this.setState(this.props.location.state); //Copia i dati dei risultati della ricerca nello state della pagina passati dal push
    }

    render() {


        return (
            <div className="container justify-content-center">
                <div className="col-md-10 py-5">
                    <div className="card" style={{ padding: '2rem', background: '#FFFACD' }}>

                        <h1 className="h3">Modifica i dati dell'annuncio selezionato</h1>
                        <p className="card-text">Aggiorna i dati desiderati</p>

                        <form onSubmit={this.handleSubmit}>
                            <div className="container">
                                <div className="form-row">
                                    <div className="col-4">
                                        <label>Città</label>
                                        <input className="form-control" name="citta" value={this.state.citta} onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-2">
                                        <label>Cap</label>
                                        <input className="form-control" name="cap" value={this.state.cap} type='text' pattern='[0-9]{5}' maxLength="5" onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-5">
                                        <label>Indirizzo</label>
                                        <input className="form-control" name="indirizzo" value={this.state.indirizzo} onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-1">
                                        <label>Civico</label>
                                        <input className="form-control" name="civico" value={this.state.civico} type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-3">
                                        <label>Inizio disponibilità</label>
                                        <input id="dateFrom" type="date" className="form-control" onInput={this.dataControl}
                                            name="dateFrom" onChange={this.handleChange} value={dateFormat(this.state.dateFrom, "yyyy-mm-dd")} required />
                                    </div>
                                    <div className="col-3">
                                        <label>Termine disponibilità</label>
                                        <input id="dateTo" type="date" className="form-control" onInput={this.dataControl}
                                            name="dateTo" onChange={this.handleChange} value={dateFormat(this.state.dateTo, "yyyy-mm-dd")} required />
                                    </div>
                                    <div className="col-3">
                                        <label>Numero Posti Letto</label>
                                        <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} value={this.state.n_posti} required />
                                    </div>
                                    <div className="col-3">
                                        <label>Numero bagni</label>
                                        <input className="form-control" name="n_bagni" type="number" min="1" onChange={this.handleChange} value={this.state.n_bagni} required />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-3">
                                        <input type="checkbox" id="wifi" name="wifi" value='1' onChange={this.handleChange} checked={Boolean(this.state.wifi)} />
                                        <label htmlFor="wifi">Presenza Wi-fi</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="ascensore" name="ascensore" value="1" onChange={this.handleChange} checked={Boolean(this.state.ascensore)} />
                                        <label htmlFor="ascensore">Presenza ascensore</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="garage" name="garage" value="1" onChange={this.handleChange} checked={Boolean(this.state.garage)} />
                                        <label htmlFor="garage">Presenza garage</label>
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" id="terrazzo" name="terrazzo" value="1" onChange={this.handleChange} checked={Boolean(this.state.terrazzo)} />
                                        <label htmlFor="terrazzo">Presenza terrazzo</label>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label>Costo giornaliero</label>
                                        <input className="form-control" name="costo" value={this.state.costo} type='number' onChange={this.handleChange} required />
                                    </div>
                                    <div className="col-6">
                                        <label>Recapito telefonico</label>
                                        <input className="form-control" name="telefono" value={this.state.telefono} type='text' pattern='[0-9]{10}' maxLength="10" onChange={this.handleChange} required />
                                    </div>
                                </div>
                                {/*
                                <div className="form-row">
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona Cover Annuncio:</label>
                                        <input type="file" id="cover" name="cover" accept="image/*" value='' onChange={this.onCoverChange} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="img">Seleziona immagini:</label>
                                        <input type="file" id="img" name="img" accept="image/*" value='' multiple onChange={this.onImageChange} />
                                    </div>
                                </div>*/}
                                <textarea rows="4" cols='70' name="descrizione" onChange={this.handleChange} value={this.state.descrizione}></textarea>
                                <button className="btn btn-success btn-block mt-5" type="submit">Aggiorna Annuncio</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }
}
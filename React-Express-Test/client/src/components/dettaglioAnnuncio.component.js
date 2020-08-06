import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';
import displayComponent from '../utility/displayComponent'
import dateFormat from 'dateformat'

export default class DettaglioAnnuncio extends Component {
    state = {
        idAnnuncio: '',
        idProprietario: '',
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
        costo: '',
        telefono: ''
    }

    costoTotale
    datiPrenotazione = []
    listOfImages = []

    componentDidMount() {
        displayComponent('wifi', Boolean(this.state.wifi))
        displayComponent('ascensore', Boolean(this.state.ascensore))
        displayComponent('garage', Boolean(this.state.garage))
        displayComponent('terrazzo', Boolean(this.state.terrazzo))
    }

    effettuaPrenotazione() {
        const prenotazione = {
            idAnnuncio: this.state.idAnnuncio,
            idProprietario: this.state.idProprietario,
            idCliente: sessionStorage.getItem('id'),
            dateFrom: dateFormat(this.datiPrenotazione.dateFrom, "yyyy-mm-dd"),
            dateTo: dateFormat(this.datiPrenotazione.dateTo, "yyyy-mm-dd"),
            costoTotale: this.costoTotale
        };

        console.log(prenotazione);

        //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/effettuaPrenotazione`, { prenotazione })
            .then(res => {
                console.log(res);

                alert("Prenotazione Effettuata con Successo")

                this.props.history.push("/")
            })
            .catch(err => {
                console.log("Error = ", err);
            })
    }


    render() {
        // eslint-disable-next-line
        this.state = this.props.location.state[0]; //Copia i dati dei risultati della ricerca nello state della pagina passati dal push     
        this.datiPrenotazione = this.props.location.state[1];

        // Carica le immagini dell'annuncio dentro listOfImages
        const path = require.context('../../../images', true)
        for (let i = 0; i < 5; i++) {
            try {
                this.listOfImages.push(path('./ID' + this.state.idAnnuncio + '/img' + i + '.png'))
            }
            catch (err) {
                console.log("Immagini finite")
                break
            }
        }

        // Calcola Prezzo
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let firstDate = new Date(this.datiPrenotazione.dateTo);
        let secondDate = new Date(this.datiPrenotazione.dateFrom);

        let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
        this.costoTotale = this.state.costo * diffDays * this.datiPrenotazione.n_ospiti
        console.log('CostoTotale: ' + this.costoTotale)

        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h1" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>Dettaglio inserzione</h1>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-7">
                                        <img className="img-fluid" style={{ width: '100%', padding: '1.3rem' }} key={'img' + this.state.idAnnuncio} src={require('../../../images/ID' + this.state.idAnnuncio + '/Cover.png')} alt="CoverImage" ></img>
                                    </div>
                                    <div className="col-md-5">
                                        <h4 className="my-3">Descrizione:</h4>
                                        <p>{this.state.descrizione}</p>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: '0.7rem' }}>
                                    <h4 className="my-12">Dettagli:</h4>
                                </div>
                                <div className="row" style={{ marginTop: '0.3rem' }}>
                                    <div className="col-md-6">
                                        <div className="list-group">
                                            <li className="list-group-item" key="citta"><strong>Città: </strong>{this.state.citta}</li>
                                            <li className="list-group-item" key="cap"><strong>CAP: </strong>{this.state.cap}</li>
                                            <li className="list-group-item" key="indirizzo"><strong>Indirizzo: </strong>{this.state.indirizzo}</li>
                                            <li className="list-group-item" key="num_civico"><strong>Numero Civico: </strong>{this.state.civico}</li>
                                            <li className="list-group-item" key="dateFrom"><strong>Disponibile a partire da: </strong>{dateFormat(this.state.dateFrom, "dd/mm/yyyy")}</li>
                                            <li className="list-group-item" key="dateTo"><strong>Disponibile fino a: </strong>{dateFormat(this.state.dateTo, "dd/mm/yyyy")}</li>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="list-group">
                                            <li className="list-group-item" key="num_posti"><strong>Posti Letto Disponibili: </strong>{this.state.n_posti}</li>
                                            <li className="list-group-item" key="num_bagni"><strong>Numero Bagni: </strong>{this.state.n_bagni}</li>
                                            <li className="list-group-item" key="wifi" id='wifi'><strong>Presenza Wi-fi</strong></li>
                                            <li className="list-group-item" key="ascensore" id='ascensore'><strong>Presenza Ascensore</strong></li>
                                            <li className="list-group-item" key="garage" id='garage'><strong>Presenza Garage</strong></li>
                                            <li className="list-group-item" key="terrazzo" id='terrazzo'><strong>Presenza Terrazzo</strong></li>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: '0.7rem' }}>
                                    <h4 className="my-12">Prezzo & Contatti:</h4>
                                </div>
                                <div className="row" style={{ marginTop: '0.3rem' }}>
                                    <div className="col-md-4">
                                        <div className="list-group">
                                            <li className="list-group-item" key="costo"><strong>Costo: </strong>{this.state.costo}€</li>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="list-group">
                                            <li className="list-group-item" key="cellulare"><strong>Cellulare: </strong>{this.state.telefono}</li>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: '1rem' }}>
                                    <div className="col-md-4">
                                        <div className="list-group" style={{ backgroundColor: 'white', textAlign: 'right' }}>
                                            <label><strong>Costo Complessivo:</strong></label>
                                            <div>Costo:{this.state.costo} X<br /> Numero Giorni: {diffDays} X <br></br> Numero Ospiti: {this.datiPrenotazione.n_ospiti} <br></br> ------- <br></br>{this.costoTotale} €</div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <button type="button" className="btn btn-success btn-lg" onClick={() => this.effettuaPrenotazione()}>Paga e affitta!</button>
                                    </div>
                                </div>
                            </div>
                            <h4 className="my-4">Galleria immagini:</h4>
                            <div className="row">
                                {
                                    this.listOfImages.map((img, index) =>
                                        <img key={'img' + index} src={img} alt={index}></img>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
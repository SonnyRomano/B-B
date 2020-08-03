import React, { Component } from "react";
import '../stylesheets/index.css';

export default class DettaglioAnnuncio extends Component {
    state = {
        id: '',
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

    render() {
        this.state = this.props.location.state; //Copia i dati dei risultati della ricerca nello state della pagina passati dal push        
        
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
                                            <li className="list-group-item"><strong>città: </strong>{this.state.citta}</li>
                                            <li className="list-group-item"><strong>CAP: </strong>{this.state.cap}</li>
                                            <li className="list-group-item"><strong>indirizzo: </strong>{this.state.indirizzo}</li>
                                            <li className="list-group-item"><strong>numero civico: </strong>{this.state.civico}</li>
                                            <li className="list-group-item"><strong>disponibile a partire da: </strong>{this.state.dateFrom}</li>
                                            <li className="list-group-item"><strong>disponibile fino a: </strong>{this.state.dateTo}</li>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="list-group">
                                            <li className="list-group-item"><strong>posti letto disponibili: </strong>{this.state.n_posti}</li>
                                            <li className="list-group-item"><strong>numero bagni: </strong>{this.state.n_bagni}</li>
                                            <li className="list-group-item" ><strong>Wi-fi: </strong>{this.state.wifi}</li>
                                            <li className="list-group-item"><strong>ascensore: </strong>{this.state.ascensore}</li>
                                            <li className="list-group-item" ><strong>garage: </strong>{this.state.garage}</li>
                                            <li className="list-group-item" ><strong>terrazzo: </strong>{this.state.terrazzo}</li>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: '0.7rem' }}>
                                    <h4 className="my-12">Prezzo & contatti:</h4>
                                </div>
                                <div className="row" style={{ marginTop: '0.3rem' }}>
                                    <div className="col-md-4">
                                        <div className="list-group">
                                            <li className="list-group-item"><strong>costo: </strong>{this.state.costo}€</li>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="list-group">
                                            <li className="list-group-item"><strong>cellulare: </strong>{this.state.telefono}</li>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <button type="button" class="btn btn-info btn-lg">Invia mail!</button>
                                        <button type="button" style={{ marginTop: '0.3rem' }} class="btn btn-success btn-lg">Paga e affitta!</button>
                                    </div>
                                </div>
                            </div>
                            <h4 class="my-4">Galleria immagini:</h4>
                            <div class="row">
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <a href="#">
                                        <img class="img-fluid" src="http://placehold.it/500x300" alt=""/>
                                    </a>
                                </div>
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <a href="#">
                                        <img class="img-fluid" src="http://placehold.it/500x300" alt=""/>
                                    </a>
                                </div>
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <a href="#">
                                        <img class="img-fluid" src="http://placehold.it/500x300" alt=""/>
                                    </a>
                                </div>
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <a href="#">
                                        <img class="img-fluid" src="http://placehold.it/500x300" alt=""/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
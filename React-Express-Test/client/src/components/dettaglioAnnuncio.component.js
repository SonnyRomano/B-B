import React, { Component } from "react";
import '../stylesheets/index.css';

export default class DettaglioAnnuncio extends Component {
    state = {
        idAnnuncio: '',
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
        // eslint-disable-next-line
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
                                            <li className="list-group-item" key="citta"><strong>Città: </strong>{this.state.citta}</li>
                                            <li className="list-group-item" key="cap"><strong>CAP: </strong>{this.state.cap}</li>
                                            <li className="list-group-item" key="indirizzo"><strong>Indirizzo: </strong>{this.state.indirizzo}</li>
                                            <li className="list-group-item" key="num_civico"><strong>Numero Civico: </strong>{this.state.civico}</li>
                                            <li className="list-group-item" key="dateFrom"><strong>Disponibile a partire da: </strong>{this.state.dateFrom}</li>
                                            <li className="list-group-item" key="dateTo"><strong>Disponibile fino a: </strong>{this.state.dateTo}</li>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="list-group">
                                            <li className="list-group-item" key="num_posti"><strong>Posti Letto Disponibili: </strong>{this.state.n_posti}</li>
                                            <li className="list-group-item" key="num_bagni"><strong>Numero Bagni: </strong>{this.state.n_bagni}</li>
                                            <li className="list-group-item" key="wifi"><strong>Wi-fi: </strong>{this.state.wifi}</li>
                                            <li className="list-group-item" key="ascensore"><strong>Ascensore: </strong>{this.state.ascensore}</li>
                                            <li className="list-group-item" key="garage"><strong>Garage: </strong>{this.state.garage}</li>
                                            <li className="list-group-item" key="terrazzo"><strong>Terrazzo: </strong>{this.state.terrazzo}</li>
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
                                    <div className="col-md-4">
                                        <button type="button" className="btn btn-info btn-lg">Invia mail!</button>
                                        <button type="button" style={{ marginTop: '0.3rem' }} className="btn btn-success btn-lg">Paga e affitta!</button>
                                    </div>
                                </div>
                            </div>
                            <h4 className="my-4">Galleria immagini:</h4>
                            <div className="row">
                                <div className="col-md-3 col-sm-6 mb-4">
                                    <img className="img-fluid" src={require('../../../images/ID' + this.state.idAnnuncio + '/img0.png')} alt="" />
                                </div>
                                {/*
                                <div className="col-md-3 col-sm-6 mb-4">
                                    <img className="img-fluid" src={require('../../../images/ID' + this.state.idAnnuncio + '/img1.png')} alt="" />

                                </div>
                                <div className="col-md-3 col-sm-6 mb-4">
                                    <img className="img-fluid" src={require('../../../images/ID' + this.state.idAnnuncio + '/img2.png')} alt="" />
                                </div>
                                <div className="col-md-3 col-sm-6 mb-4">
                                    <img className="img-fluid" src={require('../../../images/ID' + this.state.idAnnuncio + '/img3.png')} alt="" />
                                </div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
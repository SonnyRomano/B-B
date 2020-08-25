import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';
import dateFormat from 'dateformat'
import checkRoutingAccess from '../utility/checkRoutingAccess';

export default class VisualizzaPrenotazioniQuestura extends Component {

    state = {
        listItems: '',
    }

    componentWillMount() {

        let idProprietario = sessionStorage.getItem('id')

        //Effettua un post passandogli i dati tramite l'id proprietario
        axios.post(`http://127.0.0.1:9000/gestioneLegale/visualizzaPrenotazioniQuestura`, { idProprietario })
            .then(res => {
                console.log(res);
                console.log(res.data);
                const listItems = res.data.map((d) =>
                    <li key={'li' + d.idPrenotazione} className="list-group-item" style={{ marginBottom: '4rem' }}>
                        <div key={'a' + d.idPrenotazione} className="list-group-item list-group-item-action " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
                            <div className='row' >
                                <div className='col-6' key={'div' + d.idPrenotazione} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                    <img key={'img' + d.idPrenotazione} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                                </div>
                                <div className='col-6' style={{ marginTop: '2rem' }}>
                                    <h5>- ID Annuncio: {d.idAnnuncio}<br></br> - Inizio Prenotazione: {dateFormat(d.dateFrom, "dd-mm-yyyy")}<br></br> - Fine Prenotazione: {dateFormat(d.dateTo, "dd-mm-yyyy")}<br></br>- Prezzo Pagato: {d.costo} € </h5>
                                </div>
                            </div>
                            <div className='row' style={{ marginTop: '2rem' }}>
                                <div className='col-6' style={{ marginTop: '2rem' }}>
                                    <button onClick={() => this.handleClick(d.idPrenotazione)} type="button" className="btn btn-lg btn-primary">Invia Dati alla Questura</button><br />
                                </div>
                            </div>
                        </div>
                    </li>
                );
                this.setState({
                    listItems: listItems,
                });
            })
            .catch(err => {
                console.log("Error = ", err)
            })
    }

    handleClick(idPrenotazione) {
        this.props.history.push('/gestioneLegale/formQuestura', idPrenotazione)
    }

    componentDidMount() {
        checkRoutingAccess(this.props)
    }

    render() {

        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h2" style={{ padding: '1rem', textAlign: 'center' }}>Lista prenotazioni da inviare alla Questura:</h1>
                            <h1 className="h5" style={{ padding: '1rem', textAlign: 'left', marginBottom: '2rem' }}>Questa lista contiene tutte le prenotazioni di cui inviare alla Questura i dati degli ospiti:</h1>
                            <div className="list-group" >
                                {this.state.listItems}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
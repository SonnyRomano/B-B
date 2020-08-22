import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';
import displayComponent from '../utility/displayComponent'
import dateFormat from 'dateformat'
import '../stylesheets/dettaglioAnnuncio.css'

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
      <div className="container rounded p-3 mb-5" style={{ background: '#f2f2f2', opacity: 0.95 }}>
        <div className="container">
          <div className="row mb-4" id="pics">
            <div className="col-md-6 px-0">
              <img className="pic" key={'img' + this.state.idAnnuncio} src={require('../../../images/ID' + this.state.idAnnuncio + '/Cover.png')} alt="CoverImage" id="coverImg"></img>
            </div>

            <div className="col-md-3 p-0">
              {
                this.listOfImages.filter((img, index) => (index < 2)).map((img, index) =>
                  <img className="pic" key={'img' + index} src={img} alt={index} id={'img' + index} style={{ 'object-fit': 'cover' }} ></img>
                )
              }
            </div>
            <div className="col-md-3 p-0">
              {
                this.listOfImages.filter((img, index) => (index >= 2)).map((img, index) =>
                  <img className="pic" key={'img' + index} src={img} alt={index} id={'img' + index} style={{ 'object-fit': 'cover' }}></img>
                )
              }
            </div>

          </div>
          <h1 class="display-4">{this.state.descrizione}</h1>
          <div className="row">
            <h4 className="my-12">Dettagli:</h4>
          </div>
          <div className="row" style={{ marginTop: '0.3rem' }}>
            <div className="col-md-6">
              <div className="list-group">
                <li className="list-group-item" key="citta">Città: {this.state.citta}</li>
                <li className="list-group-item" key="cap">CAP: {this.state.cap}</li>
                <li className="list-group-item" key="indirizzo">Indirizzo: {this.state.indirizzo}, {this.state.civico}</li>
                {/* <li className="list-group-item" key="num_civico">Numero Civico:</li> */}
                <li className="list-group-item" key="dateFrom">Disponibilità {dateFormat(this.state.dateFrom, "dd/mm/yyyy")} - {dateFormat(this.state.dateTo, "dd/mm/yyyy")}</li>
                {/* <li className="list-group-item" key="dateTo">Disponibile fino a: </li> */}
              </div>
            </div>
            <div className="col-md-6">
              <div className="list-group">
                <li className="list-group-item" key="num_posti">
                  <i class="fas fa-bed mr-2"></i>Camere da letto: {this.state.n_posti}
                </li>
                <li className="list-group-item" key="num_bagni">
                  <i className="fas fa-bath mr-2"></i>Bagni: {this.state.n_bagni}
                </li>
                <li className="list-group-item" key="wifi" id='wifi'><i className="fa fa-fw fa-wifi mr-2"></i>WiFi</li>
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
              <button type="button" className="btn btn-success btn-lg" onClick={() => this.props.history.push('/moduloPagamento')}>Paga e affitta!</button>
            </div>
          </div>
        </div>




      </div >
    );
  }
}
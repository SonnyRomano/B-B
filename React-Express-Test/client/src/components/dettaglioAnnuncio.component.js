import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/index.css';
import displayComponent from '../utility/displayComponent'
import dateFormat from 'dateformat'
import '../stylesheets/dettaglioAnnuncio.css'
import queryString from 'query-string'

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
    telefono: '',

    listOfImages: [],
    CoverImg: '',

    datiPrenotazione: [],
    costoTotale: ''
  }

  componentDidUpdate() {
    displayComponent('wifi', Boolean(this.state.wifi))
    displayComponent('ascensore', Boolean(this.state.ascensore))
    displayComponent('garage', Boolean(this.state.garage))
    displayComponent('terrazzo', Boolean(this.state.terrazzo))
  }

  // Carica i dati relativi all'annuncio
  componentWillMount() {

    // Tramite inserimento manuale dell'URL o condivisione link
    if (this.props.history.action === 'POP') {

      let values = queryString.parse(this.props.location.search)
      let id = values.id

      axios.post(`http://127.0.0.1:9000/gestioneAnnunci/recuperaAnnuncio`, { id })
        .then(res => {

          this.setState({
            idAnnuncio: res.data[0].idAnnuncio,
            idProprietario: res.data[0].idProprietario,
            citta: res.data[0].citta,
            cap: res.data[0].cap,
            indirizzo: res.data[0].indirizzo,
            civico: res.data[0].civico,
            dateFrom: res.data[0].dateFrom,
            dateTo: res.data[0].dateTo,
            n_posti: res.data[0].n_posti,
            n_bagni: res.data[0].n_bagni,
            wifi: res.data[0].wifi,
            ascensore: res.data[0].ascensore,
            garage: res.data[0].garage,
            terrazzo: res.data[0].terrazzo,
            descrizione: res.data[0].descrizione,
            costo: res.data[0].costo,
            telefono: res.data[0].telefono
          })
          console.log(this.state)

          // Carica le immagini dell'annuncio dentro listOfImages
          const path = require.context('../../../images', true)
          for (let i = 0; i < 5; i++) {
            try {
              var joined = this.state.listOfImages.concat(path('./ID' + this.state.idAnnuncio + '/img' + i + '.png'));
              this.setState({ listOfImages: joined })
            }
            catch (err) {
              console.log("Immagini finite")
              break
            }
          }

          this.setState({ CoverImg: require('../../../images/ID' + this.state.idAnnuncio + '/Cover.png') })
        })
        .catch(err => {
          console.log("Error = ", err);
          alert("Annuncio non Trovato")
        })
    }
    else {
      //Copia i dati dei risultati della ricerca nello state della pagina passati dal push  
      this.setState({
        idAnnuncio: this.props.location.state[0].idAnnuncio,
        idProprietario: this.props.location.state[0].idProprietario,
        citta: this.props.location.state[0].citta,
        cap: this.props.location.state[0].cap,
        indirizzo: this.props.location.state[0].indirizzo,
        civico: this.props.location.state[0].civico,
        dateFrom: this.props.location.state[0].dateFrom,
        dateTo: this.props.location.state[0].dateTo,
        n_posti: this.props.location.state[0].n_posti,
        n_bagni: this.props.location.state[0].n_bagni,
        wifi: this.props.location.state[0].wifi,
        ascensore: this.props.location.state[0].ascensore,
        garage: this.props.location.state[0].garage,
        terrazzo: this.props.location.state[0].terrazzo,
        descrizione: this.props.location.state[0].descrizione,
        costo: this.props.location.state[0].costo,
        telefono: this.props.location.state[0].telefono
      }, () => {      // Carica le immagini dell'annuncio dentro listOfImages
        const path = require.context('../../../images', true)
        for (let i = 0; i < 5; i++) {
          try {
            var joined = this.state.listOfImages.concat(path('./ID' + this.state.idAnnuncio + '/img' + i + '.png'));
            this.setState({ listOfImages: joined })
          }
          catch (err) {
            console.log("Immagini finite")
            break
          }
        }

        this.setState({ CoverImg: require('../../../images/ID' + this.state.idAnnuncio + '/Cover.png') })
      })
      this.setState({ datiPrenotazione: this.props.location.state[1] });
    }
  }

  // Effettua Prenotazione - Reindirizza a Modulo Pagamento
  effettuaPrenotazione() {
    console.log(this.state.costoTotale)
    if (sessionStorage.getItem('id') == null) {
      alert("Devi Effettuare il Login per Poter Prenotare")
    }
    else if (isNaN(this.state.costoTotale)) {
      alert("Devi Inserire i Dati Relativi per Poter Prenotare")
    }
    else {
      const prenotazione = {
        idAnnuncio: this.state.idAnnuncio,
        idProprietario: this.state.idProprietario,
        idCliente: sessionStorage.getItem('id'),
        dateFrom: dateFormat(this.state.datiPrenotazione.dateFrom, "yyyy-mm-dd"),
        dateTo: dateFormat(this.state.datiPrenotazione.dateTo, "yyyy-mm-dd"),
        costoTotale: this.state.costoTotale
      };

      console.log(prenotazione);

      this.props.history.push('/prenotazione/moduloPagamento', prenotazione)
    }
  }


  //Controlla inserimento date Check-in e Check-out
  dataControl() {
    var dataFrom = document.getElementById("dateFrom")
    var dataTo = document.getElementById("dateTo")
    if (dataFrom.value > dataTo.value) dataTo.value = null
  }

  handleChange = event => {
    let valueTemp = this.state.datiPrenotazione

    switch (event.target.name) {
      case 'n_ospiti':
        valueTemp.n_ospiti = event.target.value
        break

      case 'dateFrom':
        valueTemp.dateFrom = event.target.value
        break

      case 'dateTo':
        valueTemp.dateTo = event.target.value
        break

      default:
        console.log('handleChange Error')
        break
    }


    this.setState({
      datiPrenotazione: valueTemp
    });
  }

  render() {

    // Calcola Prezzo
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(this.state.datiPrenotazione.dateTo);
    let secondDate = new Date(this.state.datiPrenotazione.dateFrom);

    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    // eslint-disable-next-line
    this.state.costoTotale = this.state.costo * diffDays * this.state.datiPrenotazione.n_ospiti


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
                <div className="container justify-content-center">
                  <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                      <div className="card-body" style={{ padding: '2rem' }}>
                        <h1 className="h1" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>Dettaglio inserzione</h1>
                        <div className="container">
                          <div className="row">
                            <div className="col-md-7">
                              <img className="img-fluid" style={{ width: '100%', padding: '1.3rem' }} key={'img' + this.state.idAnnuncio} src={this.state.CoverImg} alt="CoverImage" ></img>
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
                                <div>Costo:{this.state.costo} X<br /> Numero Giorni: {diffDays} X <br></br> Numero Ospiti: {this.state.datiPrenotazione.n_ospiti} <br></br> ------- <br></br>{this.state.costoTotale} €</div>
                              </div>
                            </div>
                            <div className="col-md-5">
                              <button type="button" className="btn btn-success btn-lg" onClick={() => this.effettuaPrenotazione()}>Paga e affitta!</button>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="form-row">
                            <div className="col-sm-6">
                              <label>Check-in</label>
                              <input id="dateFrom" type="date" className="form-control" onInput={this.dataControl} onChange={this.handleChange}
                                name="dateFrom" value={this.state.datiPrenotazione.dateFrom || ''} />
                            </div>
                            <div className="col-sm-6">
                              <label>Check-out</label>
                              <input id="dateTo" type="date" className="form-control" onInput={this.dataControl} onChange={this.handleChange}
                                name="dateTo" value={this.state.datiPrenotazione.dateTo || ''} />
                            </div>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="col-6">
                            <label>Ospiti</label>
                            <input className="form-control" name="n_ospiti" type="number" min="1" onChange={this.handleChange} value={this.state.datiPrenotazione.n_ospiti || ''} required />
                          </div>
                        </div>


                        <h4 className="my-4">Galleria immagini:</h4>
                        <div className="row">
                          {
                            this.state.listOfImages.map((img, index) =>
                              <img key={'img' + index} src={img} alt={index}></img>)
                          }
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
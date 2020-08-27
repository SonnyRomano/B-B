import React, { Component } from "react";
import axios from 'axios';
import displayComponent from '../utility/displayComponent'
import '../stylesheets/dettaglioAnnuncio.css'
import queryString from 'query-string'
import dateFormat from 'dateformat'
import DatePicker from 'react-datepicker'
import moment from "moment";

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
    costoTotale: '',

    dateOccupate: []
  }

  handleChangeDate(date, flag) {
    let datiPrenotazioneTemp = this.state.datiPrenotazione

    if (flag) datiPrenotazioneTemp.dateFrom = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
    else datiPrenotazioneTemp.dateTo = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')

    this.setState({
      datiPrenotazione: datiPrenotazioneTemp
    });
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


          axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/recuperaPrenotazioni`, { id })
            .then(res => {
              this.setState({ dateOccupate: res.data })
            })

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

        let idAnnuncio = this.props.location.state[0].idAnnuncio
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/recuperaPrenotazioni`, { idAnnuncio })
          .then(res => {
            this.setState({ dateOccupate: res.data })
          })

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

  zoomImg(event) {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById(event.target.id);
    var modalImg = document.getElementById("img01");

    modal.style.display = "block";
    modalImg.src = img.src;

    // Get the <span> element that closes the modal
    var span = document.getElementById("cls");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    }
  }

  // Filtra Date Occupate
  filtraDate(date) {
    let flag = true;

    for (let i = 0; i < this.state.dateOccupate.length; i++) {
      if (date >= moment(this.state.dateOccupate[i].dateFrom, 'YYYY-MM-DD') && date <= moment(this.state.dateOccupate[i].dateTo, 'YYYY-MM-DD')) flag = false;
    }

    return flag
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
      <div>
        <div id="myModal" className="modal">
          <span className="close" id="cls">&times;</span>
          <img className="modal-content" id="img01" alt='ImgModal' />
        </div>
        <div className="container shadow p-3 bg-white mb-5 rounded" style={{ background: '#f2f2f2' }}>
          <p className="text-muted" style={{ fontWeight: 600, textDecoration: 'underline' }}>{this.state.citta}</p>

          <div className="row mb-5 m-0" id="pics">
            <div className="col-md-6 px-0">
              <img className="pic" onClick={this.zoomImg} key={'img' + this.state.idAnnuncio} src={this.state.CoverImg} alt="CoverImage" id="coverImg"></img>
            </div>

            <div className="col-md-3 p-0">
              {
                this.state.listOfImages.map((img, index) =>
                  <img className="pic" onClick={this.zoomImg} key={'img' + index} src={img} alt={index} id={'img' + index} style={{ objectFit: 'cover' }} ></img>
                ).filter((img, index) => (index < 2))
              }
            </div>
            <div className="col-md-3 p-0">
              {
                this.state.listOfImages.map((img, index) =>
                  <img className="pic" onClick={this.zoomImg} key={'img' + index} src={img} alt={index} id={'img' + index} style={{ objectFit: 'cover' }}></img>
                ).filter((img, index) => (index >= 2))
              }
            </div>

          </div>
          <div className="row">
            <div className="col-md-7 p-0 ml-3">
              <h1 className="display-4">{this.state.descrizione}</h1>
              <p className="lead">{this.state.n_posti} ospiti · 1 camera da letto · 2 letti · 1 bagno</p>
              <hr className="m-0" />
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item" key="wifi1" id='wifi'><i className="fa fa-fw fa-wifi mr-2"></i>WiFi</li>
                <li className="list-group-item" key="wifi2" id='wifi'><i className="fa fa-fw fa-wifi mr-2"></i>WiFi</li>
                <li className="list-group-item" key="wifi3" id='wifi'><i className="fa fa-fw fa-wifi mr-2"></i>WiFi</li>
                <li className="list-group-item" key="wifi4" id='wifi'><i className="fa fa-fw fa-wifi mr-2"></i>WiFi</li>
                <hr className="m-0" />
              </ul>


              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui dicta minus molestiae vel beatae natus eveniet ratione temporibus aperiam harum alias officiis assumenda officia quibusdam deleniti eos cupiditate dolore doloribus!</p>
            </div>

            <div className="col-md-4 p-0 ml-auto" id="sqr">
              <div className="border border-dark rounded shadow p-3">
                <h3 className="mb-4">Aggiungi le date per conoscere i prezzi</h3>
                <div className="form-group">
                  <div className="form-row">
                    <div className="col-6">
                      <label>Check-in</label>
                      <DatePicker
                        id="dateFrom" type="date" className="form-control" name="dateFrom"
                        selected={moment(this.state.datiPrenotazione.dateFrom, 'YYYY-MM-DD').isValid() ? moment(this.state.datiPrenotazione.dateFrom, 'YYYY-MM-DD').toDate() : moment.now()}
                        minDate={moment(this.state.dateFrom, 'YYYY-MM-DD') > moment.now() ? moment(this.state.dateFrom, 'YYYY-MM-DD').toDate() : moment.now()}
                        maxDate={moment(this.state.dateTo, 'YYYY-MM-DD').toDate()}
                        onChange={(date) => this.handleChangeDate(date, true)}
                        filterDate={(date) => this.filtraDate(date)}
                      />
                    </div>

                    <div className="col-6">
                      <label>Check-out</label>
                      <DatePicker
                        id="dateTo" type="date" className="form-control" name="dateTo"
                        selected={moment(this.state.datiPrenotazione.dateTo, 'YYYY-MM-DD').isValid() ? moment(this.state.datiPrenotazione.dateTo, 'YYYY-MM-DD').toDate() : moment.now()}
                        minDate={moment(this.state.datiPrenotazione.dateFrom, 'YYYY-MM-DD').isValid() ? moment(this.state.datiPrenotazione.dateFrom, 'YYYY-MM-DD').toDate() : moment.now()}
                        maxDate={moment(this.state.dateTo, 'YYYY-MM-DD').toDate()}
                        onChange={(date) => this.handleChangeDate(date, false)}
                        filterDate={(date) => this.filtraDate(date)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="col-6">
                    <label>Ospiti</label>
                    <input className="form-control" name="n_ospiti" type="number" min="1" onChange={this.handleChange} value={this.state.datiPrenotazione.n_ospiti || ''} required />
                  </div>
                </div>

                <br />

                <button type="button" className="btn btn-success btn-lg" onClick={() => this.effettuaPrenotazione()}>Paga e affitta!</button>

              </div>
            </div>

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
                  <i className="fas fa-bed mr-2"></i>Camere da letto: {this.state.n_posti}
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
          {/* <div className="row" style={{ marginTop: '0.7rem' }}>
          <h4 className="my-12">Prezzo & Contatti:</h4>
        </div> */}
          <div className="row" style={{ marginTop: '0.3rem' }}>
            <div className="col-md-4">
              {/* <div className="list-group">
              <li className="list-group-item" key="costo"><strong>Costo: </strong>{this.state.costo}€</li>
            </div> */}
            </div>
            <div className="col-md-4">
              <div className="list-group">
                {/* <li className="list-group-item" key="cellulare"><strong>Cellulare: </strong>{this.state.telefono}</li> */}
              </div>
              <div className="row" style={{ marginTop: '1rem' }}>
                <div className="col-md-4">
                  <div className="list-group" style={{ backgroundColor: 'white', textAlign: 'right' }}>
                    <label><strong>Costo Complessivo:</strong></label>
                    <div>Costo:{this.state.costo} X<br /> Numero Giorni: {diffDays} X <br></br> Numero Ospiti: {this.state.datiPrenotazione.n_ospiti} <br></br> ------- <br></br>{this.state.costoTotale} €</div>
                  </div>
                </div>
                <div className="col-md-5">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
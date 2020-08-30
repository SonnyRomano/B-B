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
    dateFrom: '',
    dateTo: '',
    n_posti: '',
    n_camere: '',
    n_letti: '',
    n_bagni: '',
    wifi: 0,
    doccia: 0,
    tv: 0,
    cucina: 0,
    riscaldamento: 0,
    accessibile: 0,
    descrizione: '',
    titolo: '',
    telefono: '',
    costo: '',

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
    displayComponent('doccia', Boolean(this.state.doccia))
    displayComponent('tv', Boolean(this.state.tv))
    displayComponent('cucina', Boolean(this.state.cucina))
    displayComponent('riscaldamento', Boolean(this.state.riscaldamento))
    displayComponent('accessibile', Boolean(this.state.accessibile))
  }

  // Carica i dati relativi all'annuncio
  componentDidMount() {

    // Tramite inserimento manuale dell'URL o condivisione link
    if (!(this.props.history.action === 'POP')) this.setState({ datiPrenotazione: this.props.location.state[1] });

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
          dateFrom: res.data[0].dateFrom,
          dateTo: res.data[0].dateTo,
          n_posti: res.data[0].n_posti,
          n_camere: res.data[0].n_camere,
          n_letti: res.data[0].n_letti,
          n_bagni: res.data[0].n_bagni,
          wifi: res.data[0].wifi,
          doccia: res.data[0].doccia,
          tv: res.data[0].tv,
          cucina: res.data[0].cucina,
          riscaldamento: res.data[0].riscaldamento,
          accessibile: res.data[0].accessibile,
          descrizione: res.data[0].descrizione,
          costo: res.data[0].costo,
          titolo: res.data[0].titolo
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

  // Controlla se ci sono date già prenotate all'interno di quella effettuata
  checkDateInside() {
    for (let i = 0; i < this.state.dateOccupate.length; i++) {
      if ((moment(this.state.datiPrenotazione.dateFrom, 'YYYY-MM-DD') <= moment(this.state.dateOccupate[i].dateFrom, 'YYYY-MM-DD') &&
        moment(this.state.dateOccupate[i].dateTo, 'YYYY-MM-DD') <= moment(this.state.datiPrenotazione.dateTo, 'YYYY-MM-DD'))) {
        return true
      }
    }
    return false
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
    else if (this.checkDateInside()) {
      alert("Date Occupate all'Interno del Range di quelle Inserite");
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
    var span = document.getElementById("close-btn");

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
          <span className="close" id="close-btn">&times;</span>
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
              <h1 className="display-4">{this.state.titolo}</h1>
              <p className="lead">{this.state.n_posti} ospiti · {this.state.n_camere} camera/e da letto · {this.state.n_letti} letti · {this.state.n_bagni} bagno/i</p>
              <h2>Servizi</h2>
              <hr className="m-0" />
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item" key="wifi" id='wifi'>
                  <span style={{ fontSize: '1.3em' }}><i className="fas fa-wifi"></i></span>
                  WiFi
                </li>
                <li className="list-group-item" key="doccia" id='doccia'>
                  <span style={{ fontSize: '1.3em' }}><i className="fas fa-shower"></i></span>
                  Doccia</li>
                <li className="list-group-item" key="tv" id='tv'>
                  <i className="fas fa-tv"></i>TV</li>
                <li className="list-group-item" key="cucina" id='cucina'>
                  <i className="fas fa-utensils"></i>Cucina</li>
                <li className="list-group-item" key="riscaldamento" id='riscaldamento'>
                  <i className="fas fa-thermometer-half">
                  </i>Riscaldamento</li>
                <li className="list-group-item" key="accessibile" id='accessibile'>
                  <i className="fas fa-wheelchair"></i>Accessibile</li>
                <hr className="m-0" />
              </ul>

              <h2>Descrizione</h2>

              <p>{this.state.descrizione}</p>

              <p>
                <span style={{ fontSize: '2em', color: 'Red' }}>
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <br />
                {this.state.indirizzo}<br />{this.state.cap} {this.state.citta}
              </p>
            </div>

            <div className="col-md-4 p-0 ml-auto" id="sqr">
              <div className="border border-dark rounded shadow p-3">
                <h3 className="mb-4">Aggiungi le date per conoscere i prezzi</h3>
                <form>
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

                  <div className="form-row col-6 p-0 mx-0 mb-3">
                    <label>Ospiti</label>
                    <input className="form-control" name="n_ospiti" type="number" min="1" max={this.state.n_posti} onChange={this.handleChange} value={this.state.datiPrenotazione.n_ospiti || ''} required />
                  </div>

                  <p className="lead">€{this.state.costo} / notte</p>
                  <button type="button" className="btn btn-success btn-lg" onClick={() => this.effettuaPrenotazione()}>Paga €{this.state.costoTotale} e affitta!</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/index.css';
import dateFormat from 'dateformat'
import DatePicker from 'react-datepicker'
import moment from 'moment'


export default class HomePage extends Component {

  state = {
    citta: '',
    dateFrom: '',
    dateTo: '',
    n_ospiti: ''
  }

  //appena inserisco qualcosa,mi scatta questa funzione,mi prende i dati dal render e li salva in state
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value //prendo il valore città,dal target name = "citta" e lo salva come valore in citta dell'oggetto state
    });
  }
  //appena scrivo della data,mi scatta questo evento che me li salve in dataFrom e dataTo
  handleChangeDate(start, end) {
    this.setState({
      dateFrom: start,
      dateTo: end
    });
  }
  //Evita che venga ricaricata la pagina al sumbit del form
  handleSubmit = event => {
    event.preventDefault();//Il metodo preventDefault () annulla l'evento se è annullabile, il che significa che l'azione predefinita che appartiene all'evento non si verificherà,Ad esempio, questo può essere utile quando,Facendo clic su un pulsante "Invia", impedirgli di inviare un modulo,Facendo clic su un collegamento, impedire al collegamento di seguire l'UR

    // Differenza date
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(dateFormat(this.state.dateTo, "yyyy-mm-dd"));
    let secondDate = new Date(dateFormat(this.state.dateFrom, "yyyy-mm-dd"));
    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    console.log(diffDays)

    // Controllo 28 Giorni,c'è scritto nella documentazione,non si può stare in un airbnb per piu di 28 giorni
    if (diffDays > 28) {
      alert("Non puoi soggiornare per più di 28 giorni")
    }
    else {
      //creo oggetto ricerca,in cui,i dati salvati nei vari elementi,li prendo dal render
      const ricerca = {
        citta: this.state.citta,
        dateFrom: dateFormat(this.state.dateFrom, "yyyy-mm-dd"),
        dateTo: dateFormat(this.state.dateTo, "yyyy-mm-dd"),
        n_ospiti: this.state.n_ospiti
      };

      console.log(ricerca);

      //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
      axios.post(`http://127.0.0.1:9000/gestioneAnnunci/ricercaAnnunci`, { ricerca })
        .then(res => {
          console.log(res);
          console.log(res.data);

          let datiRicerca = []
          datiRicerca.push(res.data) //salvo la risposta(queery) nell'array datiRicerca
          datiRicerca.push(ricerca)

          //Indirizza la pagina alla ricerca e gli passa i dati della risposta contenente gli annunci
          this.props.history.push('/gestioneAnnunci/paginaRicerca', datiRicerca);
        })
        .catch(err => {
          console.log("Error = ", err);
          alert("Annunci non Trovati")
        })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="col-lg-8 p-4 bg-white rounded">
          <h2>Prenota Case Vacanza e B&B sul nostro sito</h2>
          <p>Seleziona la località desiderata, le date di check in, check-out e il numero di ospiti</p>
          <form onSubmit={this.handleSubmit}>

            <div className="form-group">
              <i className="fas fa-city mr-2"></i>
              <label>Dove</label>
              <input className="form-control" placeholder="Dove vuoi andare?" name="citta" onChange={this.handleChange} required />
            </div>

            <div className="form-row mb-4">
              <div className="form-group col-md-6">
                <i className="far fa-calendar-check mr-2"></i>
                <label>Check-in e Check-out</label>
                <DatePicker
                  id="dateFrom" type="date" className="form-control" name="dateFrom"
                  selected={this.state.dateFrom}
                  minDate={moment().toDate()}
                  onChange={(dates) => this.handleChangeDate(dates[0], dates[1])}
                  startDate={this.state.dateFrom}
                  endDate={this.state.dateTo}
                  selectsRange
                  inline
                />
              </div>

              <div className="form-group col-md-6">
                <i className="fas fa-male mr-2"></i>
                <label>Ospiti</label>
                <input className="form-control" name="n_ospiti" type="number" min="1" onChange={this.handleChange} placeholder="Aggiungi ospiti" required />
              </div>
            </div>

            <button className="btn btn-danger btn-block" type="submit">
              <i className="fas fa-search mr-2"></i>Cerca
               </button>
          </form>
        </div>
      </div>


    );
  }
}
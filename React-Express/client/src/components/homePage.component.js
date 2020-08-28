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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleChangeDate(start, end) {
    this.setState({
      dateFrom: start,
      dateTo: end
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    // Differenza date
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(dateFormat(this.state.dateTo, "yyyy-mm-dd"));
    let secondDate = new Date(dateFormat(this.state.dateFrom, "yyyy-mm-dd"));
    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    console.log(diffDays)

    // Controllo 28 Giorni
    if (diffDays > 28) {
      alert("Non puoi soggiornare per più di 28 giorni")
    }
    else {

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
          datiRicerca.push(res.data)
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
      <div className="container" id="page-container">
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
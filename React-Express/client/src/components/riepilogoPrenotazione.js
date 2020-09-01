import React, { Component } from "react";
// import '../stylesheets/index.css';
import axios from 'axios';
import dateFormat from 'dateformat'

export default class RiepilogoPrenotazione extends Component {

  datiPrenotazione = []
  datiPagamento = []

  effettuaPrenotazione() {

    let datiPrenotazione = {
      idAnnuncio: this.datiPrenotazione.idAnnuncio,
      idProprietario: this.datiPrenotazione.idProprietario,
      idCliente: this.datiPrenotazione.idCliente,
      dateFrom: this.datiPrenotazione.dateFrom,
      dateTo: this.datiPrenotazione.dateTo,
      costoTotale: this.datiPrenotazione.costoTotale,
      n_ospiti: this.datiPrenotazione.n_ospiti,
      idPagamento: this.datiPagamento.idPagamento
    }

    //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
    axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/effettuaPrenotazione`, { datiPrenotazione })
      .then(res => {
        console.log(res);

        alert("Prenotazione Effettuata con Successo")

        this.props.history.push("/")
      })
      .catch(err => {
        console.log("Error = ", err);
      })
  }

  componentDidMount() {
    // Controlla se la pagina è stata chiamata correttamente o tramite inserimento manuale
    // if (this.props.history.action === 'POP') {
    //   this.props.history.push('/')
    // }
  }


  render() {
    this.datiPrenotazione = this.props.location.state[0];
    this.datiPagamento = this.props.location.state[1];

    return (
      <div className="container p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <h1 className="display-4 text-center mb-3">Riepilogo Prenotazione</h1>
        <hr />

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          <div className="col">
            <h4>Dettagli prenotazione</h4>
            <p>
              ID annuncio: {this.datiPrenotazione.idAnnuncio}&nbsp;&rarr;&nbsp;
              <a href={'/gestioneAnnunci/dettaglioAnnuncio?id=' + this.datiPrenotazione.idAnnuncio}>vedi annuncio</a>
              <br />
              ID proprietario: {this.datiPrenotazione.idProprietario}<br />
              Inizio prenotazione: {dateFormat(this.datiPrenotazione.dateFrom, "dd/mm/yyyy")}<br />
              Fine prenotazione: {dateFormat(this.datiPrenotazione.dateTo, "dd/mm/yyyy")}<br />
              Numero di ospiti: {this.datiPagamento.n_posti}
            </p>
          </div>

          <div className="col">
            <h4>Indirizzo di fatturazione</h4>
            <p>
              {this.datiPagamento.fname}<br />
              {this.datiPagamento.adr}<br />
              {this.datiPagamento.city}, {this.datiPagamento.cap}<br />
              {this.datiPagamento.email}
            </p>
          </div>
          <div className="col">
            <h4>Modalità di pagamento</h4>
            <p>
              Carta di credito<br />
              {this.datiPagamento.cardnumber}<br />
              Scade il {this.datiPagamento.expmonth}/{this.datiPagamento.expyear}
              <br />
              <br />
              Nome sulla carta<br />
              {this.datiPagamento.cardname}
            </p>
          </div>

        </div>
        <p className="lead text-center">Totale: {this.datiPrenotazione.costoTotale} €</p>

        <button type="button" className="btn btn-success btn-block" onClick={() => this.effettuaPrenotazione()}>Conferma prenotazione</button>
      </div>
    );
  }
}
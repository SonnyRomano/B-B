import React, { Component } from "react";
import axios from 'axios';
import dateFormat from 'dateformat'

export default class RiepilogoPrenotazione extends Component {

  state = {
    tasseSoggiorno: 0,
    pagaInLoco: false
  }

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
      n_adulti: this.datiPrenotazione.n_adulti,
      n_bambini: this.datiPrenotazione.n_bambini,
      idPagamento: this.datiPagamento.idPagamento
    }

    let pagamento = this.datiPagamento

    axios.post('http://127.0.0.1:9000/gestionePagamenti/insPagamento', { pagamento })
      .then(res => {
        console.log(res);

        datiPrenotazione.idPagamento = res.data

        // Effettua un post passandogli i dati tramite l'oggetto "ricerca"
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/effettuaPrenotazione`, { datiPrenotazione })
          .then(res => {
            console.log(res);

            alert("Prenotazione Effettuata con Successo")

            this.props.history.push("/")
          })
          .catch(err => {
            console.log("Error = ", err);
          })
      })
  }

  componentDidMount() {
    if (this.props.history.action === 'POP') this.props.history.push('/')

    this.setState({ tasseSoggiorno: this.datiPrenotazione.tassa * this.diffDays(this.datiPrenotazione.dateTo, this.datiPrenotazione.dateFrom) * this.datiPrenotazione.n_adulti })
  }

  diffDays(dateTo, dateFrom) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(dateTo);
    let secondDate = new Date(dateFrom);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  }

  handleChange = event => {
    this.setState({ pagaInLoco: !this.state.pagaInLoco })
    // console.log(this.state.pagaInLoco)

    if (this.state.pagaInLoco === true) {
      this.datiPrenotazione.costoTotale += this.state.tasseSoggiorno
    } else {
      this.datiPrenotazione.costoTotale -= this.state.tasseSoggiorno
    }

    // console.log(this.datiPrenotazione.costoTotale)
  }

  render() {
    this.datiPrenotazione = this.props.location.state[0];
    this.datiPagamento = this.props.location.state[1];

    // this.setState({ tasseSoggiorno: this.datiPrenotazione.tassa * this.diffDays(this.datiPrenotazione.dateTo, this.datiPrenotazione.dateFrom) * this.datiPrenotazione.n_adulti })
    // this.state.tasseSoggiorno = this.datiPrenotazione.tassa * this.diffDays(this.datiPrenotazione.dateTo, this.datiPrenotazione.dateFrom) * this.datiPrenotazione.n_adulti

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
              {/* Numero di ospiti: {parseInt(this.datiPrenotazione.n_adulti, 10) + parseInt(this.datiPrenotazione.n_bambini, 10)} */}
              Ospiti: {this.datiPrenotazione.n_adulti} {this.datiPrenotazione.n_adulti === 1 ? 'adulto' : 'adulti'}, {this.datiPrenotazione.n_bambini} {this.datiPrenotazione.n_bambini === 1 ? 'bambino' : 'bambini'}
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

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" value="" id="impostaSoggiorno" onChange={this.handleChange} />
          <label className="form-check-label" htmlFor="impostaSoggiorno">Paga le tasse di soggiorno in loco</label>
        </div>

        {this.state.pagaInLoco === true ? <p className="lead text-center"><del>Tasse di soggiorno: {this.state.tasseSoggiorno} €</del></p> : <p className="lead text-center">Tasse di soggiorno: {this.state.tasseSoggiorno} €</p>}

        <p className="lead text-center">Totale: {this.datiPrenotazione.costoTotale} €</p>

        <button type="button" className="btn btn-success btn-block" onClick={() => this.effettuaPrenotazione()}>Conferma prenotazione</button>
      </div>
    );
  }
}
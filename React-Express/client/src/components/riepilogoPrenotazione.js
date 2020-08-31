import React, { Component } from "react";
import '../stylesheets/index.css';
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
    //Controlla se la pagina è stata chiamata correttamente o tramite inserimento manuale
    if (this.props.history.action === 'POP') {
      this.props.history.push('/')
    }
  }


  render() {
    this.datiPrenotazione = this.props.location.state[0];
    this.datiPagamento = this.props.location.state[1];

    return (
      <div className="container justify-content-center">
        <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
          <div className="card" style={{ background: '#FFFACD' }}>
            <div className="card-body" style={{ padding: '2rem' }}>
              <h1 className="h1" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>Riepilogo Prenotazione</h1>
              <div className="container">
                <div className="row" style={{ marginTop: '0.3rem' }}>
                  <div className="col-md-6">
                    <div className="list-group">
                      <li className="list-group-item" key="idAnnuncio"><strong>ID Annuncio: </strong>{this.datiPrenotazione.idAnnuncio}</li>
                      <li className="list-group-item" key="dateFrom"><strong>Data Inizio: </strong>{dateFormat(this.datiPrenotazione.dateFrom, "dd/mm/yyyy")}</li>
                      <li className="list-group-item" key="dateTo"><strong>Data Fine: </strong>{dateFormat(this.datiPrenotazione.dateTo, "dd/mm/yyyy")}</li>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '0.3rem' }}>
                  <div className="col-md-6">
                    <div className="list-group">
                      <li className="list-group-item" key="citta"><strong>Intestatario: </strong>{this.datiPagamento.fname}</li>
                      <li className="list-group-item" key="dateFrom"><strong>Numero Carta: </strong>{this.datiPagamento.cardnumber}</li>
                      <li className="list-group-item" key="dateTo"><strong>Scadenza: </strong>{this.datiPagamento.expmonth} / {this.datiPagamento.expyear}</li>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '0.3rem' }}>
                  <div className="col-md-4">
                    <div className="list-group">
                      <li className="list-group-item" key="costo"><strong>Costo Totale: </strong>{this.datiPrenotazione.costoTotale}€</li>
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '1rem' }}>
                  <div className="col-md-5">
                    <button type="button" className="btn btn-success btn-lg" onClick={() => this.effettuaPrenotazione()}>Paga e affitta!</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
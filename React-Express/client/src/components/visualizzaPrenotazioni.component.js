import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';
import dateFormat from 'dateformat'
import checkRoutingAccess from '../utility/checkRoutingAccess'


export default class VisualizzaPrenotazioni extends Component {

  state = {
    listItems: ''
  }

  componentDidMount() {
    checkRoutingAccess(this.props)

    let idProprietario = sessionStorage.getItem('id')

    //Effettua un post passandogli i dati tramite l'id proprietario
    axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/visualizzaPrenotazioniProprietario`, { idProprietario })
      .then(res => {
        console.log(res);
        console.log(res.data);
        const listItems = res.data.map((d) =>
          <div className="shadow card mb-3" key={d.idPrenotazione}>
            <div className="row no-gutters">
              <div className="col-md-4">
                <a href={'/gestioneAnnunci/dettaglioAnnuncio?id=' + d.idAnnuncio}>
                  <img className="card-img" src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage" style={{ height: '100%', backgroundSize: 'cover' }} />
                </a>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{d.titolo}</h5>
                  <p className="card-text">
                    {/* {d.indirizzo}<br />{d.cap} {d.citta}<br></br> */}
                    ID prenotazione: {d.idPrenotazione}<br></br>
                    ID cliente: {d.idCliente}<br></br>
                    Inizio Prenotazione: {dateFormat(d.dateFrom, "dd/mm/yyyy")}<br></br>
                    Fine Prenotazione: {dateFormat(d.dateTo, "dd/mm/yyyy")}<br></br>
                    Numero di ospiti: {parseInt(d.n_adulti, 10) + parseInt(d.n_bambini, 10)}<br></br>
                    Pagato: €{d.costo}</p>
                  <button onClick={() => this.handleConfirm(d)} type="button" className="btn btn-success mb-2">Accetta prenotazione</button>
                  <button onClick={() => this.handleRejection(d)} type="button" className="btn btn-danger">Declina prenotazione</button>
                </div>
              </div>
            </div>
          </div >
        );
        this.setState({
          listItems: listItems,
        });
      })
      .catch(err => {
        console.log("Error = ", err)
      })
  }

  handleConfirm(d) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    const confermaP = {
      idPrenotazione: d.idPrenotazione,
      idCliente: d.idCliente,
      idPagamento: d.idPagamento,
      idProprietario: d.idProprietario,
      costo: d.costo
    };
    axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/confermaPrenotazione`, { confermaP })
      .then(res => {
        console.log(res);

        alert("Prenotazione confermata con Successo. Procederemo con il pagamento!")

        window.location.reload(false);
      })
      .catch(err => {
        console.log("Error = ", err);
      })
  }

  handleRejection(d) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    const annullaP = {
      idPrenotazione: d.idPrenotazione,
      idCliente: d.idCliente,
    };
    axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/annullaPrenotazione`, { annullaP })
      .then(res => {
        console.log(res);

        alert("Prenotazione annullata con Successo. Mail inviata al destinatario!")

        window.location.reload(false);

      })
      .catch(err => {
        console.log("Error = ", err);
      })
  }

  render() {
    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <h1 className="display-4 text-center mb-3">Prenotazioni Pendenti</h1>
        <p><i className="fas fa-info-circle mr-2"></i>Questa lista contiene tutte le prenotazioni dei clienti relative ai tuoi annunci pubblicati; seleziona per ognuno di essi se desideri confermarli o annullarli.</p>
        <hr />
        {this.state.listItems}
      </div >
    );
  }
}
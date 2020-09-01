import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';
import dateFormat from 'dateformat'

export default class VisualizzaPrenotazioni extends Component {

  state = {
    listItems: '',
  }

  componentWillMount() {

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
                  <p className="card-text">- Citta: {d.citta} <br></br>- ID Annuncio: {d.idAnnuncio} <br></br>- ID Prenotazione: {d.idPrenotazione} <br></br>- ID Cliente: {d.idCliente}<br></br> - Inizio Prenotazione: {dateFormat(d.dateFrom, "dd/mm/yyyy")}<br></br> - Fine Prenotazione: {dateFormat(d.dateTo, "dd/mm/yyyy")}<br></br>- Prezzo Pagato: {d.costo} €</p>
                  <button onClick={() => this.handleConfirm(d)} type="button" className="btn btn-success mb-2">Accetta prenotazione</button>
                  <button onClick={() => this.handleRejection(d)} type="button" className="btn btn-danger">Declina prenotazione</button>
                </div>
              </div>
            </div>
          </div>

          // <li key={'li' + d.idPrenotazione} className="list-group-item" style={{ marginBottom: '4rem' }}>
          //   <div key={'a' + d.idPrenotazione} className="list-group-item list-group-item-action " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
          //     <div className='row'>
          //       <div className='col-6' key={'div' + d.idPrenotazione} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          //         <img key={'img' + d.idPrenotazione} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage" />
          //       </div>
          //       <div className='col-6' style={{ marginTop: '2rem' }}>
          //         <h5>- ID Annuncio: {d.idAnnuncio} <br></br>- ID Prenotazione: {d.idPrenotazione} <br></br>- idCliente: {d.idCliente}<br></br> - Inizio Prenotazione: {d.dateFrom}<br></br> - Fine Prenotazione: {d.dateTo}<br></br>- Prezzo Pagato: {d.costo} € </h5>
          //       </div>
          //     </div>
          //     <div className='row' style={{ marginTop: '2rem' }}>
          //       <div className='col-6' style={{ marginTop: '2rem' }}>
          //         <button onClick={() => this.handleConfirm(d)} type="button" className="btn btn-success">Accetta prenotazione</button><br />
          //       </div>
          //       <div className='col-6' style={{ marginTop: '2rem' }}>
          //         <button onClick={() => this.handleRejection(d)} type="button" className="btn btn-danger">Declina prenotazione</button>
          //       </div>
          //     </div>
          //   </div>
          // </li>
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
      idProprietario: d.idProprietario
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
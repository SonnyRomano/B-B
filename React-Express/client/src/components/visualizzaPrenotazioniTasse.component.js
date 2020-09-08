import React, { Component } from "react";
import axios from 'axios';
import moment from "moment";
import dateFormat from 'dateformat'
import checkRoutingAccess from '../utility/checkRoutingAccess'

export default class VisualizzaPrenotazioniTasse extends Component {

  state = {
    listItems: '',  //Oggetti da visualizzare

    importoTotale: 0  //Importo totale da versare all'ufficio del turismo
  }

  diffDays(dateTo, dateFrom) {
    // Calcolo differenza di giorni
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let firstDate = new Date(dateTo);
    let secondDate = new Date(dateFrom);

    let diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays
  }

  componentDidMount() {

    checkRoutingAccess(this.props)

    console.log(moment().format("M"))
    let dataReq = {
      idProprietario: sessionStorage.getItem('id'),
      mese: moment().format('M')
    };

    //Effettua un post passandogli i dati
    axios.post(`http://127.0.0.1:9000/gestioneLegale/rendicontaTasseSoggiorno`, { dataReq })
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
          //memorizzo nello state il totale di tasse da pagare
          this.setState({ importoTotale: this.state.importoTotale + ((res.data[i].n_adulti) * parseFloat(res.data[i].tassa) * this.diffDays(res.data[i].dateTo, res.data[i].dateFrom)) })
        }

        const listItems = res.data.map((d) =>
          <div className="shadow card mb-3" key={'li' + d.idPrenotazione}>
            <div className="row no-gutters">
              <div className='col-md-4' key={'div' + d.idPrenotazione}>
                <a href={'/gestioneAnnunci/dettaglioAnnuncio?id=' + d.idAnnuncio}>
                  <img className="card-img" src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage" style={{ height: '100%', backgroundSize: 'cover' }} />
                </a>
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{d.titolo}</h5>
                  <p className="card-text">
                    {d.indirizzo}<br />{d.cap} {d.citta}<br></br>
                    ID prenotazione: {d.idPrenotazione}<br></br>
                    Inizio Prenotazione: {dateFormat(d.dateFrom, "dd/mm/yyyy")}<br></br>
                    Fine Prenotazione: {dateFormat(d.dateTo, "dd/mm/yyyy")}<br></br>
                    Ospiti: {d.n_adulti} {d.n_adulti === 1 ? 'adulto' : 'adulti'}, {d.n_bambini} {d.n_bambini === 1 ? 'bambino' : 'bambini'}<br></br>
                  </p>
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

  handlePay(versamento) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    this.props.history.push('/gestioneLegale/formUfficioTurismo', versamento);
  }

  render() {
    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <h1 className="display-4 text-center">Tasse da pagare all'ufficio del turismo</h1>

        <p><i className="fas fa-info-circle mr-2"></i>Questa lista contiene tutte le prenotazioni attualmente attive e/o passate degli ultimi 3 mesi relative ai tuoi annunci pubblicati</p>
        <hr />

        <div className="list-group" >
          {this.state.listItems}
        </div>

        <h1>Totale da versare:<br></br>
        €{this.state.importoTotale}</h1>

        <button type="button" className="btn btn-primary btn" onClick={() => this.handlePay(this.state.importoTotale)}>Invia dati</button>
      </div>
    );
  }
}
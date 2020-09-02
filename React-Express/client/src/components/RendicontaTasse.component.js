import React, { Component } from "react";
// import '../stylesheets/index.css';
import axios from 'axios';
import moment from "moment";

export default class RendicontaTasse extends Component {

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

  componentWillMount() { //Eseguo queste operazioni prima di montare il componente
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
                  <p className="card-text">- ID Annuncio: {d.idAnnuncio} <br></br>- ID Prenotazione: {d.idPrenotazione} <br></br>- IdCliente: {d.idCliente}<br></br> - Ospiti: {d.n_adulti} Adulti e {d.n_bambini} Bambini<br></br> - Numero Giorni: {this.diffDays(d.dateTo, d.dateFrom)}<br></br> - Tassa da versare: {d.n_adulti} x {this.diffDays(d.dateTo, d.dateFrom)} x {parseFloat(d.tassa)}€ = {d.n_adulti * this.diffDays(d.dateTo, d.dateFrom) * parseFloat(d.tassa)}€ </p>
                </div>
              </div>
            </div>
          </div>
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
        <div className="list-group-item " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#A6E6F2' }}>
          <div className='row' >
            <div className='col-8' style={{ marginTop: '2rem' }}>
              <h1 className="h5" style={{ padding: '1rem', textAlign: 'left', marginBottom: '2rem' }}>Importo totale da versare: {this.state.importoTotale} €</h1>
            </div>
            <div className='col-4' style={{ marginTop: '2rem' }}>
              <button type="button" className="btn btn-success btn-lg" onClick={() => this.handlePay(this.state.importoTotale)}>Invia generalità e paga all'ufficio turismo!</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}
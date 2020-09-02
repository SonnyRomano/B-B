import React, { Component } from "react";
// import '../stylesheets/index.css';
import axios from 'axios';
import moment from "moment";
import dateFormat from 'dateformat'

export default class RendicontaTasse extends Component {

  state = {
    listItems: '',  //Oggetti da visualizzare

    importoTotale: 0,  //Importo totale da versare all'ufficio del turismo
  }

  componentWillMount() { //Eseguo queste operazioni prima di montare il componente

    let dataReq = {
      idProprietario: sessionStorage.getItem('id'),
      //dataOdierna : moment().format('YYYY-MM-DD'),
    };

    //Effettua un post passandogli i dati
    axios.post(`http://127.0.0.1:9000/gestioneLegale/rendicontaTasseSoggiorno`, { dataReq })
      .then(res => {

        const tassa = '3'    //suppongo tassa fissa da versare di 3 euro per ogni ospite in ciascuna prenotazione

        for (let i = 0; i < res.data.length; i++) {     //memorizzo nello state il totale di tasse da pagare
          this.setState({ importoTotale: this.state.importoTotale + (res.data[i].n_ospiti * parseFloat(tassa)) })
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
                  <p className="card-text">- ID Annuncio: {d.idAnnuncio} <br></br>- ID Prenotazione: {d.idPrenotazione} <br></br>- IdCliente: {d.idCliente}<br></br> - Ospiti: {d.n_ospiti}x <br></br>- Tassa da versare: {d.n_ospiti}x{parseFloat(tassa)}€ = {d.n_ospiti * parseFloat(tassa)}€ </p>
                  {/* <button onClick={() => this.handleClick(d.idPrenotazione)} type="button" className="btn btn-primary">Invia Dati alla Questura</button><br /> */}
                </div>
              </div>
            </div>
          </div>

          // <li key={'li' + d.idPrenotazione} className="list-group-item" style={{ marginBottom: '4rem' }}>
          //   <div key={'a' + d.idPrenotazione} className="list-group-item list-group-item-action " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
          //     <div className='row' >
          //       <div className='col-6' key={'div' + d.idPrenotazione} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          //         <img key={'img' + d.idPrenotazione} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
          //       </div>
          //       <div className='col-6' style={{ marginTop: '2rem' }}>
          //         <h5>- ID Annuncio: {d.idAnnuncio} <br></br>- ID Prenotazione: {d.idPrenotazione} <br></br>- IdCliente: {d.idCliente}<br></br> - Ospiti: {d.n_ospiti}x <br></br>- Tassa da versare: {d.n_ospiti}x{parseFloat(tassa)}€ = {d.n_ospiti * parseFloat(tassa)}€ </h5>
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
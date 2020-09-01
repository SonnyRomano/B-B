import React, { Component } from "react";
// import '../stylesheets/index.css';
import axios from 'axios';
import dateFormat from 'dateformat'
import checkRoutingAccess from '../utility/checkRoutingAccess';

export default class VisualizzaPrenotazioniQuestura extends Component {

  state = {
    listItems: '',
  }

  componentWillMount() {

    let idProprietario = sessionStorage.getItem('id')

    //Effettua un post passandogli i dati tramite l'id proprietario
    axios.post(`http://127.0.0.1:9000/gestioneLegale/visualizzaPrenotazioniQuestura`, { idProprietario })
      .then(res => {
        console.log(res);
        console.log(res.data);
        const listItems = res.data.map((d) =>
          <div className="shadow card mb-3" key={'li' + d.idPrenotazione}>
            <div className="row no-gutters">
              <div className='col-md-4' key={'div' + d.idPrenotazione}>
                <img className="card-img" key={'img' + d.idPrenotazione} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage" style={{ height: '100%', backgroundSize: 'cover' }} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{d.titolo}</h5>
                  <p className="card-text">{d.indirizzo}<br />{d.cap} {d.citta}<br></br>Inizio Prenotazione: {dateFormat(d.dateFrom, "dd-mm-yyyy")}<br></br>Fine Prenotazione: {dateFormat(d.dateTo, "dd-mm-yyyy")}<br></br>Pagato: €{d.costo}</p>
                  <button onClick={() => this.handleClick(d.idPrenotazione)} type="button" className="btn btn-primary">Invia Dati alla Questura</button><br />
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

  handleClick(idPrenotazione) {
    this.props.history.push('/gestioneLegale/formQuestura', idPrenotazione)
  }

  componentDidMount() {
    checkRoutingAccess(this.props)
  }

  render() {
    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <h1 className="display-4 text-center">Lista prenotazioni da inviare alla Questura</h1>
        <p><i class="fas fa-info-circle mr-2"></i>Questa lista contiene tutte le prenotazioni di cui inviare alla Questura i dati degli ospiti</p>
        <hr />
        {this.state.listItems}
      </div>
    );
  }
}
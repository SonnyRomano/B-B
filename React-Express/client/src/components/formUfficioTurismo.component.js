import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class FormUfficioTurismo extends Component {
  state = {
    listOfFields: [],

    versamento:0
  }

  handleSubmit = event => {
    event.preventDefault();

    let nomeCognome = []  //Lista di tutti nomi e cognomi degli ospiti
    let nomeCognomeElement = document.getElementsByName("nomeCognome")
    for (let e = 0; e < nomeCognomeElement.length; e++) nomeCognome.push(nomeCognomeElement[e].value)

    let codiceFiscale = []  //Lista di tutti i codici fiscali degli ospiti
    let codiceFiscaleElement = document.getElementsByName("codiceFiscale")
    for (let e = 0; e < codiceFiscaleElement.length; e++) codiceFiscale.push(codiceFiscaleElement[e].value)

    let dati = {
      nomeCognome,
      codiceFiscale,
      versamento : this.state.versamento
    }

    console.log(dati)

    axios.post(`http://127.0.0.1:9000/gestioneLegale/pagaTasseSoggiorno`, { dati })
      .then(res => {
        console.log(res);
        alert('Tasse versate a ufficio turismo e mail inviata');
        this.props.history.push('/');
      })
  }

  componentDidMount() {
    checkRoutingAccess(this.props)
  }

  aggiungiOspite() {
    let listTemp = this.state.listOfFields
    listTemp.push(
      <div key={listTemp.length}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Nome e Cognome</label>
            <input className="form-control" name="nomeCognome" placeholder="Inserire Nome e Cognome" required />
          </div>
          <div className="form-group col-md-6">
            <label>Codice Fiscale</label>
            <input className="form-control" name="codiceFiscale" placeholder="Inserire Codice Fiscale" required />
          </div>
        </div>
        <hr className="my-3" />
      </div>
    )

    this.setState({ listOfFields: listTemp })
  }

  rimuoviOspite() {
    let listTemp = this.state.listOfFields
    listTemp.pop()

    this.setState({ listOfFields: listTemp })
  }

  render() {
    this.state.versamento = this.props.location.state

    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <h1 className="display-4 text-center">Invia Dati Ospiti</h1>
        {/* <p>Compila I campi con I dati degli ospiti</p> */}
        <hr />

        <form onSubmit={this.handleSubmit}>
          <button type="button" className="btn btn btn-primary mb-3" onClick={() => this.aggiungiOspite()}>Aggiungi Ospite</button>

          <button type="button" className="btn btn btn-danger mb-3" onClick={() => this.rimuoviOspite()}>Rimuovi Ultimo Ospite</button>

          <div>
            {
              this.state.listOfFields
            }
          </div>

          {/* <div className="form-row col-md-6 mb-3">
            <label htmlFor="img">Seleziona Immagini Documenti d'Identità:</label>
            <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} />
          </div> */}

        <button className="btn btn btn-success" type="submit">Invia generalità e versa {this.state.versamento}€</button>

        </form>
      </div>

    );
  }
}
import React, { Component } from "react";
import axios from 'axios';
// import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';


export default class FormUfficioTurismo extends Component {
  state = {
    listOfFields: [],

    versamento: 0,

    expyear: '',
    expmonth: '',
    cardname: '',
    cardnumber: '',
    cvv: ''
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
      versamento: this.state.versamento,
      expyear: this.state.expyear,
      expmonth: this.state.expmonth,
      cardname: this.state.cardname,
      cardnumber: this.state.cardnumber,
      cvv: this.state.cvv
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

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
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
    // eslint-disable-next-line
    this.state.versamento = this.props.location.state

    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <h1 className="display-4 text-center">Invia Dati Ospiti</h1>
        {/* <p>Compila I campi con I dati degli ospiti</p> */}
        <hr />

        <form onSubmit={this.handleSubmit}>
          <button type="button" className="btn btn btn-primary mb-3" onClick={() => this.aggiungiOspite()}>Aggiungi ospite</button>

          <button type="button" className="btn btn btn-danger mb-3" onClick={() => this.rimuoviOspite()}>Rimuovi ultimo ospite</button>

          <div>
            {this.state.listOfFields}
          </div>

          {/* <div className="form-row col-md-6 mb-3">
            <label htmlFor="img">Seleziona Immagini Documenti d'Identità:</label>
            <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} />
          </div> */}
          <h1>Totale da versare:<br></br>
          €{this.state.versamento}</h1>

          <div>
            {/* <h3 className="mb-5">Payment</h3> */}
            <div style={{ height: 101 }}>
              <label>Accepted Cards</label>
              <div className="icon-container">
                <i className="fab fa-cc-visa mr-2"></i>
                <i className="fab fa-cc-amex mr-2"></i>
                <i className="fab fa-cc-mastercard mr-2"></i>
                <i className="fab fa-cc-discover mr-2"></i>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="cname">Nome sulla carta</label>
                <input type="text" className="form-control" name="cardname" onChange={this.handleChange} placeholder="Mario Rossi" required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="ccnum">Numero della carta</label>
                <input type="text" className="form-control" name="cardnumber" maxLength='12' onChange={this.handleChange} placeholder="1111-2222-3333-4444" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-2">
                <label htmlFor="inputState" style={{ marginBottom: 14 }}>Exp Month</label>
                <select className="custom-select" name='expmonth' onChange={this.handleChange} required>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>

              <div className="form-group col-md-2">
                <label htmlFor="inputState" style={{ marginBottom: 14 }}>Exp Year</label>
                <select className="custom-select" name='expyear' onChange={this.handleChange} required>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                  <option value="2034">2034</option>
                  <option value="2035">2035</option>
                </select>
              </div>

              <div className="form-group col-md-2">
                <label htmlFor="cvv" style={{ marginBottom: 14 }}>CVV</label>
                <input className="form-control" name="cvv" maxLength='3' pattern='[0-9]{3}' onChange={this.handleChange} required />
              </div>

            </div>
          </div>

          <button className="btn btn btn-success" type="submit">Invia dati</button>
        </form>
      </div>

    );
  }
}
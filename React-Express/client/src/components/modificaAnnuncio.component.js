import React, { Component } from "react";
import axios from 'axios';
// import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';
import dateFormat from 'dateformat'


export default class ModificaAnnuncio extends Component {

  imageFiles = []
  coverFile = []

  state = {
    citta: '',
    cap: '',
    indirizzo: '',
    dateFrom: '',
    dateTo: '',
    n_posti: '',
    n_camere: '',
    n_letti: '',
    n_bagni: '',
    wifi: 0,
    doccia: 0,
    tv: 0,
    cucina: 0,
    riscaldamento: 0,
    accessibile: 0,
    descrizione: '',
    titolo: '',
    telefono: '',
    costo: '',
    idAnnuncio: ''
  }

  //Controlla inserimento date Check-in e Check-out
  dataControl() {
    var dataFrom = document.getElementById("dateFrom")
    var dataTo = document.getElementById("dateTo")
    if (dataFrom.value > dataTo.value) dataTo.value = null
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onImageChange = (event) => {
    this.imageFiles = event.target.files
  }

  onCoverChange = (event) => {
    this.coverFile = event.target.files
  }

  handleSubmit = event => {
    event.preventDefault();

    let annuncio = {
      idProprietario: sessionStorage.getItem('id'),
      citta: this.state.citta,
      indirizzo: this.state.indirizzo,
      cap: this.state.cap,
      dateFrom: dateFormat(this.state.dateFrom, 'yyyy-mm-dd'),
      dateTo: dateFormat(this.state.dateTo, 'yyyy-mm-dd'),
      n_posti: this.state.n_posti,
      n_camere: this.state.n_camere,
      n_letti: this.state.n_letti,
      n_bagni: this.state.n_bagni,
      wifi: Number(this.state.wifi),
      doccia: Number(this.state.doccia),
      tv: Number(this.state.tv),
      cucina: Number(this.state.cucina),
      riscaldamento: Number(this.state.riscaldamento),
      accessibile: Number(this.state.accessibile),
      descrizione: this.state.descrizione,
      titolo: this.state.titolo,
      costo: this.state.costo,
      idAnnuncio: this.state.idAnnuncio
    }
    console.log(annuncio)

    axios.post(`http://127.0.0.1:9000/gestioneAnnunci/aggiornaAnnuncio`, { annuncio })
      .then(res => {
        console.log(res);
        alert('Annuncio aggiornato con successo!')
        this.props.history.push('/gestioneAnnunci/paginaRicercaProprietario');
      })
  }

  componentDidMount() {
    checkRoutingAccess(this.props)
  }

  componentWillMount() {
    this.setState(this.props.location.state, () => { console.log(this.state) }); //Copia i dati dei risultati della ricerca nello state della pagina passati dal push
  }

  render() {
    return (
      <div className="container">
        <div className="col-lg-10 py-4 rounded" style={{ backgroundColor: '#f2f2f2' }}>

          <h3>Modifica i dati dell'annuncio selezionato</h3>
          <hr />

          <form onSubmit={this.handleSubmit}>

            <div className="form-row">
              <div className="form-group col-md-5">
                <label>Città</label>
                <input className="form-control" name="citta" value={this.state.citta} onChange={this.handleChange} required />
              </div>

              <div className="form-group col-md-5">
                <label>Indirizzo</label>
                <input className="form-control" name="indirizzo" value={this.state.indirizzo} onChange={this.handleChange} placeholder="Via Roma, 15" required />
              </div>

              <div className="form-group col-md-2">
                <label>CAP</label>
                <input className="form-control" name="cap" value={this.state.cap} pattern='[0-9]{5}' maxLength="5" onChange={this.handleChange} placeholder="90015" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-3">
                <label>Inizio disponibilità</label>
                <input id="dateFrom" type="date" className="form-control" onInput={this.dataControl}
                  name="dateFrom" onChange={this.handleChange} value={dateFormat(this.state.dateFrom, "yyyy-mm-dd")} required />
              </div>
              <div className="form-group col-md-3">
                <label>Termine disponibilità</label>
                <input id="dateTo" type="date" className="form-control" onInput={this.dataControl}
                  name="dateTo" onChange={this.handleChange} value={dateFormat(this.state.dateTo, "yyyy-mm-dd")} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-3">
                <label>Ospiti</label>
                <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} value={this.state.n_posti} required />
              </div>
              <div className="form-group col-md-3">
                <label>Camere da letto</label>
                <input className="form-control" name="n_camere" type="number" min="1" onChange={this.handleChange} value={this.state.n_camere} required />
              </div>
              <div className="form-group col-md-3">
                <label>Numero letti</label>
                <input className="form-control" name="n_letti" type="number" min="1" onChange={this.handleChange} value={this.state.n_letti} required />
              </div>
              <div className="form-group col-md-3">
                <label>Numero bagni</label>
                <input className="form-control" name="n_bagni" type="number" min="1" onChange={this.handleChange} value={this.state.n_bagni} required />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="wifi" name="wifi" onChange={() => { this.setState({ wifi: !this.state.wifi }) }} checked={this.state.wifi} />
                <i className="fas fa-wifi mr-2"></i>
                <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="doccia" name="doccia" onChange={() => { this.setState({ doccia: !this.state.doccia }) }} checked={this.state.doccia} />
                <i className="fas fa-shower mr-2"></i>
                <label className="form-check-label" htmlFor="doccia">Doccia</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="tv" name="tv" onChange={() => { this.setState({ tv: !this.state.tv }) }} checked={this.state.tv} />
                <i className="fas fa-tv mr-2"></i>
                <label className="form-check-label" htmlFor="tv">TV</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="cucina" name="cucina" onChange={() => { this.setState({ cucina: !this.state.cucina }) }} checked={this.state.cucina} />
                <i className="fas fa-utensils mr-2"></i>
                <label className="form-check-label" htmlFor="cucina">Cucina</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="riscaldamento" name="riscaldamento" onChange={() => { this.setState({ riscaldamento: !this.state.riscaldamento }) }} checked={this.state.riscaldamento} />
                <i className="fas fa-thermometer-half mr-2"></i>
                <label className="form-check-label" htmlFor="riscaldamento">Riscaldamento</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="accessibile" name="accessibile" onChange={() => { this.setState({ accessibile: !this.state.accessibile }) }} checked={this.state.accessibile} />
                <i className="fas fa-wheelchair mr-2"></i>
                <label className="form-check-label" htmlFor="accessibile">Accessibile</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Prezzo giornaliero</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">€</span>
                  </div>
                  <input className="form-control rounded-right" name="costo" value={this.state.costo} type='number' onChange={this.handleChange} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Titolo annuncio</label>
              <input className="form-control" name='titolo' onChange={this.handleChange} value={this.state.titolo} required />
            </div>

            <label>Descrizione</label>
            <textarea className="form-control mb-5" rows="4" name="descrizione" onChange={this.handleChange} value={this.state.descrizione}></textarea>

            <button className="btn btn-success btn-block" type="submit">Salva modifiche</button>
          </form>
        </div>
      </div >

    );
  }
}
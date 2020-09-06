import React, { Component } from "react";
import axios from 'axios';
// import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';

export default class InserisciAnnuncio extends Component {

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
    tassa: ''
  }

  //Controlla inserimento date Check-in e Check-out
  dataControl() {
    var dataFrom = document.getElementById("dateFrom")
    var dataTo = document.getElementById("dateTo")
    if (dataFrom.value > dataTo.value) dataTo.value = null
  }
  //Controlla inserimento date Check-in e Check-out

  //appena inserisco valori negli input,mi scatta questo evento che me li salva nello state,dopo che si è attivato l'evento handleSubmit

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
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo,
      n_posti: this.state.n_posti,
      n_camere: this.state.n_camere,
      n_letti: this.state.n_letti,
      n_bagni: this.state.n_bagni,
      wifi: this.state.wifi,
      doccia: this.state.doccia,
      tv: this.state.tv,
      cucina: this.state.cucina,
      riscaldamento: this.state.riscaldamento,
      accessibile: this.state.accessibile,
      descrizione: this.state.descrizione,
      titolo: this.state.titolo,
      costo: this.state.costo,
      tassa: this.state.tassa
    }

    axios.post(`http://127.0.0.1:9000/gestioneAnnunci/inserisciAnnuncio`, { annuncio })
      .then(res => {
        console.log(res);

        let formData = new FormData();
        formData.append('idAnnuncio', res.data.insertId)
        for (let i = 0; i < this.imageFiles.length; i++) {
          formData.append('file', this.imageFiles[i], 'img' + i + '.png');
        }
        formData.append('file', this.coverFile[0], 'Cover.png')

        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/uploadImmaginiAnnuncio`, formData)
          .then(res => {
            console.log(res);

            window.confirm('Annuncio Inserito');
            this.props.history.push('/')
          })
      })
  }

  componentDidMount() {
    checkRoutingAccess(this.props)
  }

  render() {
    return (
      <div className="container">
        <div className="col-lg-10 py-4 rounded" style={{ backgroundColor: '#f2f2f2' }}>
          <h3>Inserisci nuovo annuncio</h3>
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
                  name="dateFrom" onChange={this.handleChange} required />
              </div>
              <div className="form-group col-md-3">
                <label>Termine disponibilità</label>
                <input id="dateTo" type="date" className="form-control" onInput={this.dataControl}
                  name="dateTo" onChange={this.handleChange} required />
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
                <input className="form-check-input" type="checkbox" id="wifi" name="wifi" value='1' onChange={this.handleChange} />
                <span style={{ width: 28 }}><i className="fas fa-wifi"></i></span>
                <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="doccia" name="doccia" value="1" onChange={this.handleChange} />
                <span style={{ width: 28 }}><i className="fas fa-shower"></i></span>
                <label className="form-check-label" htmlFor="doccia">Doccia</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="tv" name="tv" value="1" onChange={this.handleChange} />

                <span style={{ width: 28 }}><i className="fas fa-tv"></i></span>
                <label className="form-check-label" htmlFor="tv">TV</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="cucina" name="cucina" value="1" onChange={this.handleChange} />

                <span style={{ width: 28 }}><i className="fas fa-utensils"></i></span>
                <label className="form-check-label" htmlFor="cucina">Cucina</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="riscaldamento" name="riscaldamento" value="1" onChange={this.handleChange} />

                <span style={{ width: 28 }}><i className="fas fa-thermometer-half"></i></span>
                <label className="form-check-label" htmlFor="riscaldamento">Riscaldamento</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="accessibile" name="accessibile" value="1" onChange={this.handleChange} />
                <span style={{ width: 28 }}><i className="fas fa-wheelchair"></i></span>

                <label className="form-check-label" htmlFor="accessibile">Accessibile</label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Prezzo Giornaliero</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">€</span>
                  </div>
                  <input className="form-control rounded-right" name="costo" value={this.state.costo} type='number' onChange={this.handleChange} required />
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Tassa di Soggiorno</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">€</span>
                  </div>
                  <input className="form-control rounded-right" name="tassa" value={this.state.tassa} type='number' onChange={this.handleChange} required />
                </div>
              </div>
            </div>

            <label>Foto</label>
            <div className="form-row mb-3">
              <div className="input-group col-md-6">
                <div className="custom-file">
                  <input type="file" className="custom-file-input" id="cover" name="cover" accept="image/*" onChange={this.onCoverChange} aria-describedby="inputGroupFileAddon01"></input>
                  <label className="custom-file-label" htmlFor="inputGroupFile01">Inserisci Cover</label>
                </div>
              </div>

              <div className="input-group col-md-6">
                <div className="custom-file">
                  <input type="file" className="custom-file-input" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} aria-describedby="inputGroupFileAddon01"></input>
                  <label className="custom-file-label" htmlFor="inputGroupFile01">Inserisci Immagini</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Titolo annuncio</label>
              <input className="form-control" name='titolo' onChange={this.handleChange} required />
            </div>

            <label>Descrizione</label>
            <textarea className="form-control mb-5" rows="4" name="descrizione" onChange={this.handleChange} value={this.state.descrizione} required></textarea>

            <button className="btn btn-success btn-block" type="submit">Inserisci annuncio</button>

          </form>
        </div>
      </div >

    );
  }
}
import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/gestioneAnnunci.css';
import checkRoutingAccess from '../utility/checkRoutingAccess';

export default class InserisciAnnuncio extends Component {

  imageFiles = []
  coverFile = []

  state = {
    citta: '',
    cap: '',
    indirizzo: '',
    civico: '',
    dateFrom: '',
    dateTo: '',
    n_posti: '',
    n_bagni: '',
    wifi: 0,
    ascensore: 0,
    garage: 0,
    terrazzo: 0,
    descrizione: '',
    telefono: '',
    costo: ''
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
      cap: this.state.cap,
      indirizzo: this.state.indirizzo,
      civico: this.state.civico,
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo,
      n_posti: this.state.n_posti,
      n_bagni: this.state.n_bagni,
      wifi: this.state.wifi,
      ascensore: this.state.ascensore,
      garage: this.state.garage,
      terrazzo: this.state.terrazzo,
      descrizione: this.state.descrizione,
      costo: this.state.costo,
      telefono: this.state.telefono
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
                <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} value={this.state.n_posti} required />
              </div>
              <div className="form-group col-md-3">
                <label>Numero letti</label>
                <input className="form-control" name="n_posti" type="number" min="1" onChange={this.handleChange} value={this.state.n_posti} required />
              </div>
              <div className="form-group col-md-3">
                <label>Numero bagni</label>
                <input className="form-control" name="n_bagni" type="number" min="1" onChange={this.handleChange} value={this.state.n_bagni} required />
              </div>
            </div>

            <div className="form-row mb-3">
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="wifi" name="wifi" value='1' onChange={this.handleChange} checked={Boolean(this.state.wifi)} />
                <i className="fas fa-wifi mr-2"></i>
                <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="ascensore" name="ascensore" value="1" onChange={this.handleChange} checked={Boolean(this.state.ascensore)} />
                <i className="fas fa-shower mr-2"></i>
                <label className="form-check-label" htmlFor="ascensore">Doccia</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="garage" name="garage" value="1" onChange={this.handleChange} checked={Boolean(this.state.garage)} />
                <i className="fas fa-tv mr-2"></i>
                <label className="form-check-label" htmlFor="garage">TV</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="terrazzo" name="terrazzo" value="1" onChange={this.handleChange} checked={Boolean(this.state.terrazzo)} />
                <i className="fas fa-utensils mr-2"></i>
                <label className="form-check-label" htmlFor="terrazzo">Cucina</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="terrazzo" name="terrazzo" value="1" onChange={this.handleChange} checked={Boolean(this.state.terrazzo)} />
                <i className="fas fa-thermometer-half mr-2"></i>
                <label className="form-check-label" htmlFor="terrazzo">Riscaldamento</label>
              </div>
              <div className="form-check form-check-inline col-md-3">
                <input className="form-check-input" type="checkbox" id="terrazzo" name="terrazzo" value="1" onChange={this.handleChange} checked={Boolean(this.state.terrazzo)} />
                <i className="fas fa-wheelchair mr-2"></i>
                <label className="form-check-label" htmlFor="terrazzo">Accessibile</label>
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

            <div className="form-row">
              <div class="input-group col-md-6">
                <div class="custom-file">
                  <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"></input>
                  <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                </div>
              </div>

              <div class="input-group col-md-6">
                <div class="custom-file">
                  <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01"></input>
                  <label class="custom-file-label" for="inputGroupFile01">Choose file</label>
                </div>
              </div>
            </div>

            {/* <div className="form-row">
              <div className="col-6">
                <label htmlFor="img">Seleziona Cover Annuncio:</label>
                <input type="file" id="cover" name="cover" accept="image/*" onChange={this.onCoverChange} required />
              </div>
              <div className="col-6">
                <label htmlFor="img">Seleziona immagini:</label>
                <input type="file" id="img" name="img" accept="image/*" multiple onChange={this.onImageChange} required />
              </div>
            </div> */}

            <div className="form-group">
              <label>Titolo annuncio</label>
              <input className="form-control" required />
            </div>

            <label>Descrizione</label>
            <textarea className="form-control mb-5" rows="4" name="descrizione" onChange={this.handleChange} value={this.state.descrizione}></textarea>

            <button className="btn btn-success btn-block" type="submit">Inserisci annuncio</button>

          </form>
        </div>
      </div >

    );
  }
}
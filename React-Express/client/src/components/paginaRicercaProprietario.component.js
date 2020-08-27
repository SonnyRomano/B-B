import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';

export default class PaginaRicercaProprietario extends Component {

  state = {
    listItems: '',
  }

  componentWillMount() {

    let idProprietario = sessionStorage.getItem('id')

    //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
    axios.post(`http://127.0.0.1:9000/gestioneAnnunci/ricercaAnnunciProprietario`, { idProprietario })
      .then(res => {
        console.log(res);
        console.log(res.data);

        const listItems = res.data.map((d) =>
          <div className="card mb-3">
            <div className="row no-gutters">
              <div className="col-md-4">
                <img src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} className="card-img" alt="CoverImage" style={{ maxHeight: 250, height: '100%', backgroundSize: 'cover' }} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">Titolo annuncio</h5>
                  <p className="card-text">{d.indirizzo}, {d.civico}<br />{d.cap} {d.citta}</p>
                  <button onClick={() => this.handleClick(d)} type="button" className="btn btn-secondary mb-2">Modifica</button>
                  <button onClick={() => this.handleClick(d)} type="button" className="btn btn-danger">Elimina</button>
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

  handleClick(info) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    this.props.history.push('/gestioneAnnunci/modificaAnnuncio', info);
  }

  render() {
    return (
      <div>
        <ul className="nav nav-pills nav-fill bg-white">
          <li className="nav-item">
            <a className="nav-link active" href="#">Active</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Much longer nav link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li>
        </ul>

        <div className="container-fluid p-3" style={{ backgroundColor: '#f2f2f2' }} >
          <h1 className="display-4 text-center mb-3">I tuoi annunci</h1>
          <button type="button" className="btn btn-success mb-3">Aggiungi annuncio</button>
          {this.state.listItems}
        </div>



      </div>

    );
  }
}
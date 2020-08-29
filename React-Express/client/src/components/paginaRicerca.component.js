import React, { Component } from "react";
// import '../stylesheets/index.css';
import '../stylesheets/paginaRicerca.css'

export default class PaginaRicerca extends Component {

  // constructor() {
  //   super()
  //   this.handleClick = this.handleClick.bind(this)
  // }

  datiPrenotazione = []

  handleClick(info) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    let datiAnnuncio = []
    datiAnnuncio.push(info)
    datiAnnuncio.push(this.datiPrenotazione)
    this.props.history.push('/gestioneAnnunci/dettaglioAnnuncio?id=' + info.idAnnuncio, datiAnnuncio);
  }

  render() {
    // eslint-disable-next-line
    let risultatiRicerca = this.props.location.state[0]; //Copia i dati dei risultati della ricerca nello state della pagina passati dal push
    this.datiPrenotazione = this.props.location.state[1];

    console.log("Risultati Ricerca: ");
    console.log(risultatiRicerca)
    console.log("Dati Prenotazione: ");
    console.log(this.datiPrenotazione)

    //Crea un oggetto che contiene il mapping dei dati come componenti <li>
    const listItems = risultatiRicerca.map((d) =>

      <div className="col mb-4">
        <div className="card h-100" onClick={() => this.handleClick(d)}>
          <img src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} className="card-img-top" alt="..." />
          <div className="card-body p-3">
            <h5 className="card-title">{d.descrizione}</h5>
            <p className="card-text text-muted">Da €{d.costo}</p>
            {/* <div>
              <span className="mr-3">
                <i className="fas fa-wifi"></i>
              </span>
              <span className="mr-3">
                <i className="fas fa-utensils"></i>
              </span>
              <span className="mr-3">
                <i className="fas fa-shower"></i>
              </span>
              <span className="mr-3">
                <i className="fas fa-thermometer-half"></i>
              </span>
              <span className="mr-3">
                <i className="fas fa-tv"></i>
              </span>
              <span className="mr-3">
                <i className="fas fa-wheelchair"></i>
              </span>
            </div> */}

            <div>
              <span className="mr-3">
                <i className="fas fa-male mr-2"></i>{d.n_posti}
              </span>
              <span className="mr-3">
                <i className="fas fa-bed mr-2"></i>2
            </span>
              <span className="mr-3">
                <i className="fas fa-bath mr-2"></i>1
            </span>
              {/* <span style={{ fontSize: '3em', color: 'Tomato' }}>
              <i class="fas fa-camera"></i>
            </span> */}
            </div>
          </div>
        </div>
      </div >
    );

    /*       <li key={'li' + d.idAnnuncio} className="list-group-item" style={{ marginBottom: '4rem', backgroundColor: 'grey' }}>
            <a onClick={() => this.handleClick(d)} key={'a' + d.idAnnuncio} className="list-group-item list-group-item-action border border-primary " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
              <div className='row' >
                <div className='col-6' key={'div' + d.idAnnuncio} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <img key={'img' + d.idAnnuncio} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                </div>
                <div className='col-6' style={{ marginTop: '2rem' }}>
                  <h5>{d.citta}<br></br> - Indirizzo: {d.indirizzo}<br></br> - Numero Posti Letto: {d.n_posti}<br></br> - Costo Giornaliero: {d.costo} € </h5>
                </div>
              </div>
            </a>
          </li>); */

    return (
      <div className="container shadow p-3 bg-white mb-5 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <h1 class="display-4 mb-4">Risultati di ricerca - {this.datiPrenotazione.citta}</h1>
        <p>{listItems.length} {listItems.length === 1 ? 'alloggio' : 'alloggi'} {listItems.length === 1 ? 'trovato' : 'trovati'}</p>


        <div class="row row-cols-1 row-cols-md-4 row-cols-xl-6">
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-wifi mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-utensils mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Cucina</label>
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-shower mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Doccia</label>
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-thermometer-half mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Riscaldamento</label>
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-tv mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">TV</label>
            </button>
          </div>
          <div class="col">
            <button type="button" class="btn btn-outline-dark">
              <i className="fas fa-wheelchair mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Accessibile</label>
            </button>
          </div>
        </div>


        <hr />

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {listItems}
        </div>
      </div>
    );
  }
}
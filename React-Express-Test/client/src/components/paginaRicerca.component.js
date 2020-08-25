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

      <div class="col mb-4">
        <div class="card h-100" onClick={() => this.handleClick(d)}>
          <img src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} class="card-img-top" alt="..." />
          <div class="card-body p-3">
            <h5 class="card-title ">{d.descrizione}</h5>
            <p class="card-text text-muted">Da €{d.costo}</p>
            <span className="mr-3">
              <i class="fas fa-male mr-2"></i>{d.n_posti}
            </span>
            <span className="mr-3">
              <i class="fas fa-bed mr-2"></i>2
            </span>
            <span className="mr-3">
              <i class="fas fa-bath mr-2"></i>1
            </span>
          </div>
        </div>
      </div>
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
        <hr />
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {listItems}
        </div>
      </div>
    );
  }
}
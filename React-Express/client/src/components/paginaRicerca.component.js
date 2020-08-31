import React, { Component } from "react";
import '../stylesheets/paginaRicerca.css'

export default class PaginaRicerca extends Component {
  datiPrenotazione = []

  state = {
    wifi: false,
    doccia: false,
    tv: false,
    cucina: false,
    riscaldamento: false,
    accessibile: false,
  }

  handleClick(info) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
    let datiAnnuncio = []
    datiAnnuncio.push(info)
    datiAnnuncio.push(this.datiPrenotazione)
    this.props.history.push('/gestioneAnnunci/dettaglioAnnuncio?id=' + info.idAnnuncio, datiAnnuncio);
  }


  handleChange(name) {
    switch (name) {
      case 'wifi':
        this.setState({
          wifi: !(this.state.wifi)
        });
        break

      case 'cucina':
        this.setState({
          cucina: !(this.state.cucina)
        });
        break

      case 'tv':
        this.setState({
          tv: !(this.state.tv)
        });
        break

      case 'doccia':
        this.setState({
          doccia: !(this.state.doccia)
        });
        break

      case 'riscaldamento':
        this.setState({
          riscaldamento: !(this.state.riscaldamento)
        }, console.log(this.state.riscaldamento));
        break

      case 'accessibile':
        this.setState({
          accessibile: !(this.state.accessibile)
        });
        break

      default:
        break
    }
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
    const listItems = risultatiRicerca.sort((a, b) => a.costo - b.costo)
      // Algebra Booleana per Filtrare
      .filter((d) => {
        return (!(this.state.wifi) || (Boolean(d.wifi) === this.state.wifi)) &&
          (!(this.state.doccia) || (Boolean(d.doccia) === this.state.doccia)) &&
          (!(this.state.tv) || (Boolean(d.tv) === this.state.tv)) &&
          (!(this.state.cucina) || (Boolean(d.cucina) === this.state.cucina)) &&
          (!(this.state.riscaldamento) || (Boolean(d.riscaldamento) === this.state.riscaldamento)) &&
          (!(this.state.accessibile) || (Boolean(d.accessibile) === this.state.accessibile))
      }).map((d) =>

        <div className="col mb-4" key={d.idAnnuncio}>
          <div className="card h-100" onClick={() => this.handleClick(d)}>
            <img src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} className="card-img-top" alt="..." />
            <div className="card-body p-3">
              <h5 className="card-title">{d.titolo}</h5>
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
                  <i className="fas fa-bed mr-2"></i>{d.n_letti}
                </span>
                <span className="mr-3">
                  <i className="fas fa-bath mr-2"></i>{d.n_bagni}
                </span>
              </div>
            </div>
          </div>
        </div >
      )

    return (
      <div className="container shadow p-3 bg-white mb-5 rounded" style={{ backgroundColor: '#f2f2f2' }}>
        <h1 className="display-4 mb-4">Risultati di ricerca - {this.datiPrenotazione.citta}</h1>
        <p>{listItems.length} {listItems.length === 1 ? 'alloggio' : 'alloggi'} {listItems.length === 1 ? 'trovato' : 'trovati'}</p>


        <div className="row row-cols-1 row-cols-md-4 row-cols-xl-6">
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('wifi')}>
              <i className="fas fa-wifi mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Wi-Fi</label>
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('cucina')}>
              <i className="fas fa-utensils mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Cucina</label>
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('doccia')}>
              <i className="fas fa-shower mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Doccia</label>
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('riscaldamento')}>
              <i className="fas fa-thermometer-half mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Riscaldamento</label>
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('tv')}>
              <i className="fas fa-tv mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">TV</label>
            </button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-dark" data-toggle='buttons' onClick={() => this.handleChange('accessibile')}>
              <i className="fas fa-wheelchair mr-2"></i>
              <label className="form-check-label" htmlFor="wifi">Accessibile</label>
            </button>
          </div>
        </div>

        <hr />

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
          {listItems}
        </div>
      </div>
    );
  }
}
import React, { Component } from "react";
import '../stylesheets/index.css';

export default class PaginaRicerca extends Component {

    state = {
        id: '',
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
        costo: '',
        telefono: ''
    }

    handleClick(info) { //React passa i dati dell'annuncio alla  successiva pagina visualizza dettaglio annuncio
        this.props.history.push('/gestioneAnnunci/dettaglioAnnuncio', info) ;
    }

    render() {
        // eslint-disable-next-line
        this.state = this.props.location.state; //Copia i dati dei risultati della ricerca nello state della pagina passati dal push
        console.log("Annuncio Trovato");
        console.log(this.state)
        //Crea un oggetto che contiene il mapping dei dati come componenti <li>
        const listItems = this.state.map((d) =>
        <li className="list-group-item" style={{ marginBottom: '4rem',  backgroundColor: 'grey'}}>
            <a onClick={() => this.handleClick(d)} key={'a' + d.idAnnuncio} className="list-group-item list-group-item-action border border-primary " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
                <div className='row' >
                    <div className='col-6' key={'div' + d.idAnnuncio} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <img key={'img' + d.idAnnuncio} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                    </div>
                    <div className='col-6' style={{ marginTop: '2rem' }}>
                        <h5 key={'li' + d.idAnnuncio}><h4>{d.citta}</h4><br></br> -indirizzo: {d.indirizzo}<br></br> -numero posti letto: {d.n_posti}<br></br> -costo giornaliero: {d.costo} € </h5>
                    </div>
                </div>
            </a>
        </li> );

        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h2" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>Risultati ricerca</h1>
                            <div className="list-group" >
                                {listItems}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
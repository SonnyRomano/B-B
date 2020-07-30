import React, { Component } from "react";
import '../stylesheets/index.css';

export default class PaginaRicerca extends Component {

    state = {
        id: '',
        citta: '',
        indirizzo: '',
        n_posti: '',
        n_bagni: ''
    }


    render() {
        // eslint-disable-next-line
        this.state = this.props.location.state; //Copia i dati dei risultati della ricerca nello state della pagina passati dal push
        console.log("Annuncio Trovato");
        console.log(this.state)
        //Crea un oggetto che contiene il mapping dei dati come componenti <li>
        const listItems = this.state.map((d) =>
            <div key={'div' + d.idAnnuncio} style={{ marginBottom: '4rem' }}>
                <img key={'img' + d.idAnnuncio} style={{ width: '60%', marginLeft: '20%', marginBottom: '2rem' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                <h5 key={'li' + d.idAnnuncio}>IDAnnuncio: {d.idAnnuncio} - Citta: {d.citta} - Indirizzo: {d.indirizzo} - Num_Bagni: {d.n_bagni}</h5>
            </div>);
        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card">
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h3" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>Risultati Ricerca</h1>

                            {listItems}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
import React, { Component } from "react";
import '../stylesheets/index.css';
import axios from 'axios';

export default class EliminaAnnuncio extends Component {

    state = {
        listItems: '',
    }

    componentDidMount() {

        let idProprietario = sessionStorage.getItem('id')

        //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/ricercaAnnunciProprietario`, { idProprietario })
            .then(res => {
                console.log(res);
                console.log(res.data);
                const listItems = res.data.map((d) =>
                    <li key={'li' + d.idAnnuncio} className="list-group-item" style={{ marginBottom: '4rem' }}>
                        <div key={'a' + d.idAnnuncio} className="list-group-item list-group-item-action " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
                            <div className='row' >
                                <div className='col-6' key={'div' + d.idAnnuncio} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                    <img key={'img' + d.idAnnuncio} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                                </div>
                                <div className='col-6' style={{ marginTop: '2rem' }}>
                                    <h5>- ID Annuncio: {d.idAnnuncio} <br></br>- Città: {d.citta}<br></br> - Indirizzo: {d.indirizzo}<br></br>- Costo Giornaliero: {d.costo} € </h5>
                                    <button onClick={() => this.handleClick(d.idAnnuncio)} type="button" className="btn btn-lg btn-danger">Elimina</button>
                                </div>
                            </div>
                        </div>
                    </li>
                );
                this.setState({
                    listItems: listItems,
                });
            })
            .catch(err => {
                console.log("Error = ", err)
            })
    }

    handleClick(idAnnuncio) {
        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/eliminaAnnuncio`, { idAnnuncio })
            .then(res => {
                console.log(res);
                console.log(res.data);
                window.confirm('Annuncio eliminato');
                window.location.reload(false);
            })
            .catch(err => {
                console.log("Error = ", err)
                window.confirm('Errore! Operazione annullata');
            })
    }

    render() {

        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h2" style={{ padding: '1rem', textAlign: 'center' }}>Elimina Annunci:</h1>
                            <h1 className="h5" style={{ padding: '1rem', textAlign: 'left', marginBottom: '2rem' }}>Questa lista contiene tutti i tuoi annunci pubblicati; seleziona quale desideri eliminare in modo definitivo:</h1>
                            <div className="list-group" >
                                {this.state.listItems}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
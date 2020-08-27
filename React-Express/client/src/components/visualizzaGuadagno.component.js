import React, { Component } from "react";
import axios from 'axios';


export default class VisualizzaGuadagno extends Component {

    state = {
        listItems: '',
        costoTotale: 0
    }


    //il metodo componentDidMount viene chiamato dopo il rendering del componente.
    componentWillMount() {

        let idProprietario = sessionStorage.getItem('id')

        //Effettua un post passandogli i dati tramite l'id proprietario
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/visualizzaGuadagnoProprietario`, { idProprietario })
            .then(res => {
                console.log(res);
                console.log(res.data);
                // io dentro la res. ho la queery selezionata,quindi ho anche il valore costo nel db 
                for (let i = 0; i < res.data.length; i++) {
                    this.setState({ costoTotale: this.state.costoTotale + res.data[i].costo })
                }
                console.log(this.state.costoTotale)

                //creo oggetto che andrò a passare nel render,questo oggetto,contiene i dati relativi agli annunci inseriti
                const listItems = res.data.map((d) =>
                    <li key={'li' + d.idAnnuncio} className="list-group-item" style={{ marginBottom: '4rem' }}>
                        <div key={'a' + d.idAnnuncio} className="list-group-item list-group-item-action " style={{ marginTop: '1rem', marginBottom: '1rem', background: '#E6E6FA' }}>
                            <div className='row' >
                                <div className='col-6' key={'div' + d.idAnnuncio} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                    <img key={'img' + d.idAnnuncio} style={{ width: '100%' }} src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage"  ></img>
                                </div>
                                <div className='col-6' style={{ marginTop: '2rem' }}>
                                    <h5>- ID Annuncio: {d.idAnnuncio} <br></br>- Città: {d.citta}<br></br> - Indirizzo: {d.indirizzo}<br></br>- Costo Giornaliero: {d.costo} € </h5>

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

    render() {
        return (
            <div className="container justify-content-center">
                <div className="col-md-9 py-5 " style={{ marginLeft: '12.5%' }}>
                    <div className="card" style={{ background: '#FFFACD' }}>
                        <div className="card-body" style={{ padding: '2rem' }}>
                            <h1 className="h2" style={{ padding: '1rem', textAlign: 'center' }}>Guadagni ottenut:</h1>
                            <div className="list-group" >
                                {this.state.listItems}
                            </div>
                            <h1 className="h5" style={{ padding: '1rem', textAlign: 'left', marginBottom: '2rem' }}>{this.state.costoTotale}</h1>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
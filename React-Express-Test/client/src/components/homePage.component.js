import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/index.css';
import dateFormat from 'dateformat'


export default class HomePage extends Component {

    //Controlla inserimento date Check-in e Check-out
    dataControl() {
        var dataFrom = document.getElementById("dateFrom")
        var dataTo = document.getElementById("dateTo")
        if (dataFrom.value > dataTo.value) dataTo.value = null
    }

    state = {
        citta: '',
        dateFrom: '',
        dateTo: '',
        n_ospiti: ''
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const ricerca = {
            citta: this.state.citta,
            dateFrom: dateFormat(this.state.dateFrom, "yyyy-mm-dd"),
            dateTo: dateFormat(this.state.dateTo, "yyyy-mm-dd"),
            n_ospiti: this.state.n_ospiti
        };

        console.log(ricerca);

        //Effettua un post passandogli i dati tramite l'oggetto "ricerca"
        axios.post(`http://127.0.0.1:9000/gestioneAnnunci/ricercaAnnunci`, { ricerca })
            .then(res => {
                console.log(res);
                console.log(res.data);

                let datiRicerca = []
                datiRicerca.push(res.data)
                datiRicerca.push(ricerca)

                //Indirizza la pagina alla ricerca e gli passa i dati della risposta contenente gli annunci
                this.props.history.push('/gestioneAnnunci/paginaRicerca', datiRicerca);
            })
            .catch(err => {
                console.log("Error = ", err);
                alert("Annunci non Trovati")
            })
    }

    render() {
        return (
            <div className="container justify-content-center">

                <div className="col-md-8 py-5 ">
                    <div className="card">
                        <div className="card-body" style={{ padding: '2rem' }}>

                            <h1 className="h3">Prenota Case Vacanza e B&B sul nostro sito</h1>
                            <p className="card-text">Seleziona la località desiderata, le date di check in, check-out e il numero di ospiti</p>

                            <form onSubmit={this.handleSubmit}>

                                <div className="form-group">
                                    <label>DOVE</label>
                                    <input className="form-control" placeholder="Località" name="citta" onChange={this.handleChange} required />
                                </div>

                                <div className="form-group">
                                    <div className="form-row">
                                        <div className="col-6">
                                            <label>Check In</label>
                                            <input id="dateFrom" type="date" className="form-control" onInput={this.dataControl} onChange={this.handleChange}
                                                name="dateFrom" />
                                        </div>
                                        <div className="col-6">
                                            <label>Check Out</label>
                                            <input id="dateTo" type="date" className="form-control" onInput={this.dataControl} onChange={this.handleChange}
                                                name="dateTo" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-6">
                                        <label>Numero Ospiti</label>
                                        <input className="form-control" name="n_ospiti" type="number" min="1" onChange={this.handleChange} required />
                                    </div>
                                </div>

                                <button className="btn btn-danger btn-block mt-5" type="submit">Cerca</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
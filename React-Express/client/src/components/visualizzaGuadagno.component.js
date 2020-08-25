import React, { Component } from "react";
import axios from 'axios';

export default class VisualizzaGuadagno extends Component {

    state = {
        listItems: '',
        costoTotale: 0
    }


    componentWillMount() {

        let idProprietario = sessionStorage.getItem('id')

        //Effettua un post passandogli i dati tramite l'id proprietario
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/visualizzaGuadagnoProprietario`, { idProprietario })
            .then(res => {
                console.log(res);
                console.log(res.data);

                for (let i = 0; i < res.data.length; i++) {
                    this.setState({ costoTotale: this.state.costoTotale + res.data[i].costo })
                }
                console.log(this.state.costoTotale)

            })
            .catch(err => {
                console.log("Error = ", err)
            })
    }

    render() {
        return (
            <div>{this.state.costoTotale}</div>
        )
    }

}
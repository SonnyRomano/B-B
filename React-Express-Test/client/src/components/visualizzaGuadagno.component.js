import React, { Component } from "react";
import axios from 'axios';

export default class visualizzaGuadagno extends Component {

    state = {
        listItems: '',
    }


   componentWillMount() {

        let idProprietario = sessionStorage.getItem('id')

        //Effettua un post passandogli i dati tramite l'id proprietario
        axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/visualizzaGuadagnoProprietario`, { idProprietario })
            .then(res => {
                console.log(res);
                console.log(res.data);
              
             
            })
            .catch(err => {
                console.log("Error = ", err)
            })
    }



}
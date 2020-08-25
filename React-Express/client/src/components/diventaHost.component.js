import React, { Component } from "react";
import '../stylesheets/login.css'
import axios from 'axios'
import displayComponent from '../utility/displayComponent'

export default class DiventaHost extends Component {

    // Gestisce la richiesta post di diventaHost
    handleSubmit = event => {
        event.preventDefault();

        let id = sessionStorage.getItem("id")

        axios.post(`http://127.0.0.1:9000/users/diventaHost`, { id })
            .then(res => {
                console.log(res);
                console.log(res.data);

                // Set dell'id utente nella sessione corrente
                sessionStorage.setItem('isHost', 1);
                console.log('ID: ' + sessionStorage.getItem('id') + '  -  isHost: ' + sessionStorage.getItem('isHost'));

                window.location.reload(false);
                // Chiude la schermata di Login
                displayComponent("DiventaHost", false)
            })
    }


    render() {
        return (
            <div id="DiventaHost" className="modal">

                <form className="modal-content animate was-validated col-sm-8 mt-3" onSubmit={this.handleSubmit}>
                    <div className="imgcontainer">
                        <span onClick={() => displayComponent("DiventaHost", false)} className="close"
                            title="Close Modal">&times;</span>
                    </div>

                    <div style={{ textAlign: 'center', margin: '2rem' }}>
                        <h3>Diventa Host</h3>
                        <h5>Confermare per diventare un Host e inziare a inserire i propri annunci.<br></br>
                            Oppure annullare per restare un utente senza privilegi da Host.
                        </h5>
                    </div>

                    <div className="container">
                        <button type="submit" style={{ marginBottom: '2rem', marginLeft: '10%', width: '30%' }}>Conferma</button>

                        <button onClick={() => displayComponent("DiventaHost", false)} style={{ marginBottom: '2rem', marginLeft: '20%', width: '30%' }}>Annulla</button>
                    </div>
                </form>
            </div>
        );
    }
}
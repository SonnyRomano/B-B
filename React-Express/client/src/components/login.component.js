import React, { Component } from "react";
import '../stylesheets/login.css'
import axios from 'axios'
import displayComponent from '../utility/displayComponent'

export default class Login extends Component {



    state = {
        email: '',
        pass: ''
    }

    // Salva gli input dell'utente nei campi state
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Gestisce la richiesta post di Login
    handleSubmit = event => {
        event.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.pass
        };
        console.log(user);

        axios.post(`http://127.0.0.1:9000/users/login`, { user })
            .then(res => {
                console.log(res);
                console.log(res.data);
                // Set dell'id utente nella sessione corrente
                sessionStorage.clear();
                sessionStorage.setItem('id', res.data.id);
                sessionStorage.setItem('isHost', res.data.host);
                console.log('ID: ' + sessionStorage.getItem('id') + '  -  isHost: ' + sessionStorage.getItem('isHost'));
                window.location.reload(false);
                // Chiude la schermata di Login
                displayComponent("Login", false)

            })
            .catch(err => {
                console.log("Error = ", err.response.data);
                alert(err.response.data);
            })
    }


    render() {
        return (
            <div id="Login" className="modal">

                <form className="modal-content animate was-validated col-sm-8 mt-3" onSubmit={this.handleSubmit}>
                    <div className="imgcontainer">
                        <span onClick={() => displayComponent("Login", false)} className="close"
                            title="Close Modal">&times;</span>
                    </div>

                    <div className="container">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" name="email" onChange={this.handleChange} required />

                        <label htmlFor="pass"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="pass" onChange={this.handleChange} required />

                        <button type="submit" style={{ marginBottom: '2rem' }}>Accedi</button>
                    </div>
                </form>
            </div>
        );
    }
}
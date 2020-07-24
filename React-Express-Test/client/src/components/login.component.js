import React, { Component } from "react";
import '../stylesheets/login.css'
import axios from 'axios'

export default class Login extends Component {

    // Nasconde o mostra i bottoni degli utenti loggati
    static displayLogin(flag) {
        if (document.getElementById('LoginBox') == null) return;
        if (flag) document.getElementById('LoginBox').style.display = 'block';
        else document.getElementById('LoginBox').style.display = 'none';
    }


    state = {
        email: '',
        pass: ''
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.pass
        };

        // Crea un body fittizio da passare con post
        let body = new URLSearchParams();
        // Aggiunge email e password al body
        body.append('email', user.email);
        body.append('password', user.password);

        console.log(body);
        console.log(user);

        axios.post(`http://127.0.0.1:9000/users/login`, body.toString())
            .then(res => {
                console.log(res);
                console.log(res.data);

                // Set dell'id utente nella sessione corrente
                sessionStorage.clear();
                sessionStorage.setItem('id', res.data.passport.user);
                console.log(sessionStorage.getItem('id'));

                // Chiude la schermata di Login
                Login.displayLogin(false);
            })
    }


    render() {
        return (
            <div id="LoginBox" className="modal">

                <form className="modal-content animate was-validated col-sm-8 mt-3" onSubmit={this.handleSubmit}>
                    <div className="imgcontainer">
                        <span onClick={() => Login.displayLogin(false)} className="close"
                            title="Close Modal">&times;</span>
                    </div>

                    <div className="container">
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Username" name="email" onChange={this.handleChange} required />

                        <label htmlFor="pass"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="pass" onChange={this.handleChange} required />

                        <button type="submit" style={{ marginBottom: '2rem' }}>Accedi</button>
                    </div>
                </form>
            </div>
        );
    }
}
import React, { Component } from "react";
import axios from 'axios';
import '../stylesheets/login.css';
import displayComponent from '../utility/displayComponent'


export default class SignUp extends Component {

    checkPassword() {
        var password = document.getElementById("pass");
        var repassword = document.getElementById("repass");

        if (password.value !== repassword.value) repassword.setCustomValidity("Password Diverse");
        else repassword.setCustomValidity("");
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
            pass: this.state.pass
        };

        console.log(user);

        axios.post(`http://127.0.0.1:9000/users/signUp`, { user })
            .then(res => {
                console.log(res);

                // Set dell'id utente nella sessione corrente
                sessionStorage.clear();
                sessionStorage.setItem('id', res.data);
                sessionStorage.setItem('isHost', false);
                console.log('ID: ' + sessionStorage.getItem('id') + '  -  isHost: ' + sessionStorage.getItem('isHost'));

                window.location.reload(false);
                // Chiude la schermata di Registrazione
                displayComponent("SignUp", false)
            })
            .catch(err => {
                console.log("Error = ", err.response.data);
                alert(err.response.data);
            })
    }


    render() {
        return (
            <div id="SignUp" className="modal">

                <form className="modal-content animate was-validated col-sm-8 mt-3" onSubmit={this.handleSubmit}>
                    <div className="imgcontainer">
                        <span onClick={() => displayComponent("SignUp", false)} className="close"
                            title="Close Modal">&times;</span>
                    </div>

                    <div className="container">
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input name="email" id="email" type="email" className="form-control" maxLength="40"
                                pattern="^[A-z]+.*@[A-z]+.*\.[A-z]+.*$" onChange={this.handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pass">Password</label>
                            <input name="pass" id="pass" type="password" className="form-control" maxLength="40"
                                onChange={this.handleChange} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="repass">Reinserisci password</label>
                            <input name="repass" id="repass" type="password" className="form-control" maxLength="40"
                                onChange={this.checkPassword} required />
                        </div>

                        <button type="submit" style={{ marginBottom: '2rem' }}>Registrati</button>
                    </div>
                </form>
            </div>
        );
    }
}
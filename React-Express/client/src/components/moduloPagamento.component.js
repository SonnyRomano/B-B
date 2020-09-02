import React from 'react';
import '../stylesheets/moduloPagamento.css'
import axios from 'axios'

export default class moduloPagamento extends React.Component {

  state = {
    fname: '',
    email: '',
    adr: '',
    city: '',
    prov: '',
    cap: '',
    cardname: '',
    cardnumber: '',
    expmonth: '',
    expyear: '',
    cvv: ''
  }

  datiPrenotazione = []

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    let pagamento = {
      idPagamento: '',
      fname: this.state.fname,
      email: this.state.email,
      adr: this.state.adr,
      city: this.state.city,
      prov: this.state.prov,
      cap: this.state.cap,
      cardname: this.state.cardname,
      cardnumber: this.state.cardnumber,
      expmonth: this.state.expmonth,
      expyear: this.state.expyear,
      cvv: this.state.cvv
    }

    console.log(pagamento);

    axios.post('http://127.0.0.1:9000/gestionePagamenti/insPagamento', { pagamento })
      .then(res => {
        console.log(res);

        let datiRiepilogo = []
        datiRiepilogo.push(this.datiPrenotazione)
        pagamento.idPagamento = res.data
        datiRiepilogo.push(pagamento)

        console.log(datiRiepilogo)

        this.props.history.push("/prenotazione/riepilogoPrenotazione", datiRiepilogo)
      })
  }

  componentDidMount() {
    // Controlla se la pagina è stata chiamata correttamente o tramite inserimento manuale
    // if (this.props.history.action === 'POP') {
    //   this.props.history.push('/')
    // }
  }

  render() {

    this.datiPrenotazione = this.props.location.state;

    return (
      <div className="container p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <div className="display-4">Checkout Form</div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-5">Indirizzo di fatturazione</h3>

              <div className="form-group">
                <label htmlFor="fname"><i className="fa fa-user mr-2"></i>Nome e cognome</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="fname" placeholder="Mario Rossi" />
              </div>
              <div className="form-group">
                <label htmlFor="email"><i className="fa fa-envelope mr-2"></i>Email</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="email" placeholder="mariorossi@gmail.com" />
              </div>
              <div className="form-group">
                <label htmlFor="adr"><i className="far fa-address-card mr-2"></i>Via e numero civico</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="adr" placeholder="Via Roma, 15" />
              </div>
              <div className="form-group">
                <label htmlFor="city"><i className="fas fa-city mr-2"></i>Città</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="city" placeholder="Roma" />
              </div>


              <div className="form-row">
                <div className="form-group col-sm-6">
                  <label htmlFor="prov">Provincia</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="prov" placeholder="RM" />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="cap">CAP</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="cap" placeholder="90015" />
                </div>
              </div>

            </div>

            <div className="col-sm-6">
              <h3 className="mb-5">Payment</h3>
              <div style={{ height: 101 }} className="mb-3">
                <label>Accepted Cards</label>
                <div className="icon-container">
                  <i className="fab fa-cc-visa mr-2"></i>
                  <i className="fab fa-cc-amex mr-2"></i>
                  <i className="fab fa-cc-mastercard mr-2"></i>
                  <i className="fab fa-cc-discover mr-2"></i>
                </div>
              </div>


              <div className="form-group">
                <label htmlFor="cname">Nome sulla carta</label>
                <input type="text" className="form-control" name="cardname" onChange={this.handleChange} placeholder="Mario Rossi" />
              </div>
              <div className="form-group">
                <label htmlFor="ccnum">Numero della carta</label>
                <input type="text" className="form-control" name="cardnumber" max='12' onChange={this.handleChange} placeholder="1111-2222-3333-4444" />
              </div>

              {/* <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="expmonth">Exp Month</label>
                  <input type="text" className="form-control" name="expmonth" onChange={this.handleChange} />
                </div>

                <div className="form-group col-md-4">
                  <label htmlFor="expyear">Exp Year</label>
                  <input type="text" className="form-control" name="expyear" onChange={this.handleChange} />
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" className="form-control" name="cvv" onChange={this.handleChange} />
                </div>
              </div> */}

              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="inputState">Exp Month</label>
                  <select className="custom-select" onChange={this.handleChange}>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="7">07</option>
                    <option value="8">08</option>
                    <option value="9">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>

                <div className="form-group col-md-4">
                  <label htmlFor="inputState">Exp Year</label>
                  <select className="custom-select" onChange={this.handleChange}>
                    <option value="1">2020</option>
                    <option value="2">2021</option>
                    <option value="3">2022</option>
                    <option value="4">2023</option>
                    <option value="5">2024</option>
                    <option value="6">2025</option>
                    <option value="7">2026</option>
                    <option value="8">2027</option>
                    <option value="9">2028</option>
                    <option value="10">2029</option>
                    <option value="11">2030</option>
                    <option value="12">2031</option>
                    <option value="13">2032</option>
                    <option value="14">2033</option>
                    <option value="15">2034</option>
                    <option value="16">2035</option>
                    <option value="17">2036</option>
                    <option value="18">2037</option>
                    <option value="19">2038</option>
                    <option value="20">2039</option>
                    <option value="21">2040</option>
                  </select>
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor="cvv">CVV</label>
                  <input className="form-control" name="cvv" onChange={this.handleChange} />
                </div>

              </div>

              <div className="form-row">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                  <label class="form-check-label" for="defaultCheck1">Paga l'imposta di soggiorno in loco</label>
                </div>
              </div>

            </div>
          </div>
          <button type="submit" className="btn btn-secondary btn-block">Continue to checkout</button>
        </form>
      </div>
    )
  }
}
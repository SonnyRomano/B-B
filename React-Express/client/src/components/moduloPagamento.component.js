import React from 'react';
import '../stylesheets/moduloPagamento.css'

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


    let datiRiepilogo = []
    datiRiepilogo.push(this.datiPrenotazione)
    datiRiepilogo.push(pagamento)

    console.log(datiRiepilogo)

    this.props.history.push("/prenotazione/riepilogoPrenotazione", datiRiepilogo)
  }

  componentDidMount() {
    if (this.props.history.action === 'POP') this.props.history.push('/')
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
                <input type="text" onChange={this.handleChange} className="form-control" name="fname" placeholder="Mario Rossi" required />
              </div>
              <div className="form-group">
                <label htmlFor="email"><i className="fa fa-envelope mr-2"></i>Email</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="email" placeholder="mariorossi@gmail.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="adr"><i className="far fa-address-card mr-2"></i>Via e numero civico</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="adr" placeholder="Via Roma, 15" required />
              </div>
              <div className="form-group">
                <label htmlFor="city"><i className="fas fa-city mr-2"></i>Città</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="city" placeholder="Roma" required />
              </div>

              <div className="form-row">
                <div className="form-group col-sm-6">
                  <label htmlFor="prov">Provincia</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="prov" placeholder="RM" />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="cap">CAP</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="cap" placeholder="90015" required />
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
                <input type="text" className="form-control" name="cardname" onChange={this.handleChange} placeholder="Mario Rossi" required />
              </div>
              <div className="form-group">
                <label htmlFor="ccnum">Numero della carta</label>
                <input type="text" className="form-control" name="cardnumber" maxLength='16' onChange={this.handleChange} placeholder="1111-2222-3333-4444" required />
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="inputState" style={{ marginBottom: 14 }}>Exp Month</label>
                  <select className="custom-select" name='expmonth' onChange={this.handleChange} required>
                    <option defaultValue></option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>

                <div className="form-group col-md-4">
                  <label htmlFor="inputState" style={{ marginBottom: 14 }}>Exp Year</label>
                  <select className="custom-select" name='expyear' onChange={this.handleChange} required>
                    <option defaultValue></option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                    <option value="2032">2032</option>
                    <option value="2033">2033</option>
                    <option value="2034">2034</option>
                    <option value="2035">2035</option>
                  </select>
                </div>

                <div className="form-group col-md-3">
                  <label htmlFor="cvv" style={{ marginBottom: 14 }}>CVV</label>
                  <input className="form-control" name="cvv" maxLength='3' pattern='[0-9]{3}' onChange={this.handleChange} required />
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
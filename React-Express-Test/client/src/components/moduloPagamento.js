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
    //Controlla se la pagina è stata chiamata correttamente o tramite inserimento manuale
    if (this.props.history.action === 'POP') {
      this.props.history.push('/')
    }
  }

  render() {

    this.datiPrenotazione = this.props.location.state;

    return (
      <div className="container" id="bg1">
        <div className="display-4">Checkout Form</div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-5">Indirizzo di fatturazione</h3>

              <div className="form-group m-2">
                <label htmlFor="fname"><i className="fa fa-user"></i> Nome e cognome</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="fname" placeholder="John M. Doe" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="email"><i className="fa fa-envelope"></i> Email</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="email" placeholder="john@example.com" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="adr"><i className="fa fa-address-card-o"></i> Via e numero civico</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="adr" placeholder="542 W. 15th Street" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="city"><i className="fa fa-institution"></i> Città</label>
                <input type="text" onChange={this.handleChange} className="form-control" name="city" placeholder="New York" />
              </div>


              <div className="row m-2">
                <div style={{ paddingLeft: 0 }} className="col">
                  <label htmlFor="prov">Provincia</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="prov" placeholder="NY" />
                </div>
                <div style={{ padding: 0 }} className="col">
                  <label htmlFor="cap">CAP</label>
                  <input type="text" onChange={this.handleChange} className="form-control" name="cap" placeholder="10001" />
                </div>
              </div>

            </div>

            <div className="col-sm-6">
              <h3 className="mb-5">Payment</h3>
              <div style={{ height: 101 }} className="m-2">
                <label>Accepted Cards</label>
                <div className="icon-container">
                  <i className="fa fa-cc-visa mr-2"></i>
                  <i className="fa fa-cc-amex mr-2"></i>
                  <i className="fa fa-cc-mastercard mr-2"></i>
                  <i className="fa fa-cc-discover mr-2"></i>
                </div>
              </div>


              <div className="form-group m-2">
                <label htmlFor="cname">Nome sulla carta</label>
                <input type="text" className="form-control" name="cardname" onChange={this.handleChange} placeholder="John More" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="ccnum">Numero della carta</label>
                <input type="text" className="form-control" name="cardnumber" onChange={this.handleChange} placeholder="1111-2222-3333-4444" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="expmonth">Exp Month</label>
                <input type="text" className="form-control" name="expmonth" onChange={this.handleChange} />
              </div>


              <div className="row m-2">
                <div style={{ paddingLeft: 0 }} className="col">
                  <label htmlFor="expyear">Exp Year</label>
                  <input type="text" className="form-control" name="expyear" onChange={this.handleChange} />
                </div>
                <div style={{ padding: 0 }} className="col">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" className="form-control" name="cvv" onChange={this.handleChange} />
                </div>
              </div>


            </div>
          </div>
          <button type="submit" className="btn btn-secondary m-2">Continue to checkout</button>
        </form>
      </div>
    )
  }
}
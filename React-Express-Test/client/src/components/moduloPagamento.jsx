import React from 'react';
import '../stylesheets/moduloPagamento.css'

class moduloPagamento extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      email: '',
      adr: '',
      city: '',
      state: '',
      zip: '',
      cardname: '',
      cardnumber: '',
      expmonth: '',
      expyear: '',
      cvv: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
    console.log(this.state);
  }

  handleSubmit(event) {
    alert(this.state);
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <div className="display-4">Checkout Form</div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-5">Indirizzo di fatturazione</h3>

              <div className="form-group m-2">
                <label htmlFor="fname"><i className="fa fa-user"></i> Full Name</label>
                <input type="text" value={this.state.fname} onChange={this.handleChange} className="form-control" id="fname" placeholder="John M. Doe" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="email"><i className="fa fa-envelope"></i> Email</label>
                <input type="text" value={this.state.email} onChange={this.handleChange} className="form-control" id="email" placeholder="john@example.com" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="adr"><i className="fa fa-address-card-o"></i> Address</label>
                <input type="text" value={this.state.adr} onChange={this.handleChange} className="form-control" id="adr" placeholder="542 W. 15th Street" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="city"><i className="fa fa-institution"></i> City</label>
                <input type="text" value={this.state.city} onChange={this.handleChange} className="form-control" id="city" placeholder="New York" />
              </div>


              <div className="row m-2">
                <div style={{ paddingLeft: 0 }} className="col">
                  <label htmlFor="state">State</label>
                  <input type="text" value={this.state.state} onChange={this.handleChange} className="form-control" id="state" placeholder="NY" />
                </div>
                <div style={{ padding: 0 }} className="col">
                  <label htmlFor="zip">Zip</label>
                  <input type="text" value={this.state.zip} onChange={this.handleChange} className="form-control" id="zip" placeholder="10001" />
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
                <label htmlFor="cname">Name on Card</label>
                <input type="text" className="form-control" id="cardname" placeholder="John More Doe" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="ccnum">Credit card number</label>
                <input type="text" className="form-control" id="cardnumber" placeholder="1111-2222-3333-4444" />
              </div>
              <div className="form-group m-2">
                <label htmlFor="expmonth">Exp Month</label>
                <input type="text" className="form-control" id="expmonth" placeholder="September" />
              </div>


              <div className="row m-2">
                <div style={{ paddingLeft: 0 }} className="col">
                  <label htmlFor="expyear">Exp Year</label>
                  <input type="text" className="form-control" id="expyear" placeholder="2018" />
                </div>
                <div style={{ padding: 0 }} className="col">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" className="form-control" id="cvv" placeholder="352" />
                </div>
              </div>


            </div>
          </div>
        </form>
        <button className="btn btn-secondary m-2">Continue to checkout</button>
      </div>
    )
  }
}

export default moduloPagamento
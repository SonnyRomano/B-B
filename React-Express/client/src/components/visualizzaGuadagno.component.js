import React, { Component } from "react";
import axios from 'axios';
import dateFormat from 'dateformat'

export default class VisualizzaGuadagno extends Component {

  state = {
    listItems: '',
    costoTotale: 0
  }

  // il metodo componentDidMount viene chiamato dopo il rendering del componente
  componentWillMount() {

    let idProprietario = sessionStorage.getItem('id')

    //Effettua un post passandogli i dati tramite l'id proprietario
    axios.post(`http://127.0.0.1:9000/gestionePrenotazioni/visualizzaGuadagnoProprietario`, { idProprietario })
      .then(res => {
        console.log(res);
        console.log(res.data);
        // dentro la res ho la query selezionata, quindi ho anche il valore costo nel db 
        for (let i = 0; i < res.data.length; i++) {
          this.setState({ costoTotale: this.state.costoTotale + res.data[i].costo })
        }
        console.log(this.state.costoTotale)

        // creo oggetto che andrò a passare nel render. Questo oggetto contiene i dati relativi agli annunci inseriti
        const listItems = res.data.map((d) =>
          <tr key='d.idAnnuncio'>
            <th scope="row">{d.idAnnuncio}</th>
            <td>{d.idCliente}</td>
            <td>?</td>
            <td>{dateFormat(d.dateFrom, "dd/mm/yyyy")}</td>
            <td>{dateFormat(d.dateTo, "dd/mm/yyyy")}</td>
            <td>{d.n_ospiti}</td>
            <td>{d.costo}€</td>
          </tr>
          // <div className="shadow card mb-3" key={'li' + d.idAnnuncio}>
          //   <div className="row no-gutters">
          //     <div className='col-md-4' key={'div' + d.idAnnuncio}>
          //       <a href={'/gestioneAnnunci/dettaglioAnnuncio?id=' + d.idAnnuncio}>
          //         <img className="card-img" src={require('../../../images/ID' + d.idAnnuncio + '/Cover.png')} alt="CoverImage" style={{ height: '100%', backgroundSize: 'cover' }} />
          //       </a>
          //     </div>
          //     <div className="col-md-8">
          //       <div className="card-body">
          //         <h5 className="card-title">{d.titolo}</h5>
          //         <p className="card-text">
          //           ID annuncio: <br />
          //           ID cliente: <br />
          //           ID prenotazione: <br />
          //           Inizio prenotazione: {dateFormat(d.dateFrom, "dd-mm-yyyy")}<br />
          //           Fine prenotazione: {dateFormat(d.dateTo, "dd-mm-yyyy")}<br />
          //           Numero di ospiti: <br />
          //           Pagato: €{d.costo}
          //         </p>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        );
        this.setState({
          listItems: listItems,
        });

      })
      .catch(err => {
        console.log("Error = ", err)
      })
  }

  render() {
    return (
      <div className="container-fluid p-3 rounded" style={{ backgroundColor: '#f2f2f2' }} >
        <h1 className="display-4 text-center">Guadagni ottenuti</h1>
        {/* <hr /> */}

        <div className="table-responsive-sm">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">ID annuncio</th>
                <th scope="col">ID cliente</th>
                <th scope="col">ID prenotazione</th>
                <th scope="col">Inizio prenotazione</th>
                <th scope="col">Fine prenotazione</th>
                <th scope="col">Numero di ospiti</th>
                <th scope="col">Pagato</th>
              </tr>
            </thead>
            <tbody>
              {this.state.listItems}
              {/* <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr> */}
            </tbody>
          </table>

          <h2>Totale: {this.state.costoTotale} €</h2>

          {/* {this.state.listItems} */}
        </div>
      </div>
    );
  }
}
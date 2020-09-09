import React, { Component } from "react";
import axios from 'axios';
import dateFormat from 'dateformat'
import checkRoutingAccess from '../utility/checkRoutingAccess'

export default class VisualizzaGuadagno extends Component {

  state = {
    listItems: '',
    costoTotale: 0
  }

  // il metodo componentDidMount viene chiamato dopo il rendering del componente
  componentDidMount() {

    checkRoutingAccess(this.props)

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

        // creo oggetto che andrò a passare nel render. Questo oggetto contiene i dati relativi agli annunci inseriti
        const listItems = res.data.map((d) =>
          <tr key={d.idPrenotazione}>
            <th scope="row">{d.idAnnuncio}</th>
            <td>{d.idCliente}</td>
            <td>{d.idPrenotazione}</td>
            <td>{dateFormat(d.dateFrom, "dd/mm/yyyy")}</td>
            <td>{dateFormat(d.dateTo, "dd/mm/yyyy")}</td>
            <td>{d.n_adulti + d.n_bambini}</td>
            <td>{d.costo} €</td>
          </tr>
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
            </tbody>
          </table>

          <h2>Totale: {this.state.costoTotale} €</h2>
        </div>
      </div>
    );
  }
}
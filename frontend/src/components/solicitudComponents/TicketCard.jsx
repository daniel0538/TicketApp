import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import '../styles/ticketCard.css';
import Header from "../header";
import Menu from "../menu";
export default class ticketCard extends Component {
  constructor(prop) {
    super(prop);
    this.state = {
      idSolicitud: '605de194c9242a2a88e407cb',
      solicitudInfo: []
    }
  }
  componentDidMount() {
    fetch(`http://localhost:3000/solicitudes/porNumero/${this.state.idSolicitud}`, {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("TAToken"),
      },
    })
      .then((res) => res.json())
      .then((resSolicitud) => {
        console.log(resSolicitud)
        this.setState({ solicitudInfo: resSolicitud.solicitud })
      });
  }

  render() {
    const solicitud = this.state.solicitudInfo
    return (
      <div>
        <Header />
        <div className='container-padre-ticket'>
          <Menu />
          <div className='container-cards'>
            <Paper className='paper-solicitud-a' elevation={4}>
              <p># Solicitud: {solicitud.idSolicitud}</p>  
              <p>Cliente: {solicitud.solicitudInfo}</p>
              <p>Fecha de envío: {solicitud.fechaHora}</p>
              <p>Prioridad: {solicitud.prioridad}</p>
              <p>Estado: {solicitud.estado}</p>
              <p>Categoria: {solicitud.categoria}</p>
              <p>Sub categoria: {solicitud.subcategoria}</p>
              <p>Descripcion:</p>
              <p className='descripcion'>{solicitud.desripcion}</p>  
            </Paper>
            <Paper className='paper-solicitud-b' elevation={4} />
            <Paper className='paper-solicitud-c' elevation={4} />
          </div>
        </div>
      </div>
    )
  }
}
import React, { useState } from "react";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import "../styles/ListaCambios.css";

export default function ListaSolicitudes(props) {
  const [cambios, setCambio] = useState([]);
  React.useEffect(() => {
    if (props.refSolicitud !== undefined) {
      fetch(
        `http://localhost:3000/cambiosSolicitud/cambios/${props.refSolicitud}`,
        {
          method: "GET",
          headers: {
            "x-access-token": localStorage.getItem("TAToken"),
          },
        }
      )
        .then((res) => res.json())
        .then((cambio) => {
          setCambio(cambio.cambios);
        });
    }
  }, [props.refSolicitud]);
  const cambiosDeEstado = (cambio) => {
    if (cambio.estado) {
      return (
        <div>
          <p className='title-card-cambio'>Cambio de estado:</p>
        <div className="info-cambios">
            <p className='cambio-realizado'>{cambio.estado}</p> 
        </div>
        </div>
      );
    }
  };
  const renderizarCambios = () => {
    return cambios.map((cambio, i) => (
      <Paper elevation={20} key={i} className="container-padre-cambios">
        <div>
          <div className="info-usuario">
            <h4>{cambio.titulo}</h4>
            <Divider />
             <div> 
            <p className='title-card-cambio'>Usuario:</p>
            <p className='user-info-cambio'>{cambio.refUsuario.name}</p>
            <p className='user-info-cambio'>({cambio.refUsuario.role})</p>
            </div>
            <Divider />
            <div>
            <p className='title-card-cambio'>Fecha:</p>
            <p className='fecha-info-cambio'>{cambio.fechaHora}</p> 
            </div>
            <Divider />
            {cambiosDeEstado(cambio)}
            <Divider />
            <p className='title-card-cambio'>Nota:</p>
          <div className='nota'>{cambio.nota}</div>
          </div>
        </div>
      </Paper>
    ));
  };

  return <div>{renderizarCambios()}</div>;
}

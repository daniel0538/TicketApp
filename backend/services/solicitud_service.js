const ModuloSolicitud = require('../models/Solicitud');
const Solicitud = ModuloSolicitud.modelo;

function enviarError(res, error) {
  console.error(error);
  return res.json({
    mensaje: 'Hubo un error...',
    ok: false,
  });
};

module.exports = {

  getSolicitudes: async function (req, res) {
    try {

      const infoFiltro = req.query;
      const filtro = {};

      if (infoFiltro.idSolicitud) {
        const id = parseInt(infoFiltro.idSolicitud)
        filtro.idSolicitud = id;
      };
      
      if (infoFiltro.estado) {
        filtro.estado = { $regex: infoFiltro.estado };
      };

      if (infoFiltro.resumen) {
        filtro.resumen = { $regex: infoFiltro.resumen };
      };

      const solicitudes = await Solicitud.aggregate([
        { $match: filtro, },
        {
          $lookup: {
            from: 'clientes',
            localField: 'refCliente',
            foreignField: '_id',
            as: 'cliente',
          }
        },
        {
          $lookup: {
            from: 'usuarios',
            localField: 'refUsuarioSolicitante',
            foreignField: '_id',
            as: 'usuarioSolicitante',
          }
        },
        { $sort: { idSolicitud: -1 } }
      ]);

      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  getSoliUsuario: async function (req, res) {
    try {
      const solicitudesPorUsuario = await Solicitud.find({ idUsuarioMongo: req.params.idUsuarioMongo })
        .populate('idUsuarioMongo');
      res.json({
        mensaje: 'Solicitud exitosa...',
        ok: true,
        solicitudes: solicitudesPorUsuario,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  getSoliNumero: async function (req, res) {
    try {
      const solicitudesPorId = await Solicitud.find({ idSolicitud: req.params.idSolicitud })
        .populate(['refCliente', 'refUsuarioAsignado', 'listaIncumbentes']);
      if (solicitudesPorId.length === 0) {
        res.json({
          mensaje: `No se encontraron solicitudes con ese id: ${req.params.idSolicitud}`,
          ok: false,
        });
      } else {
        res.json({
          mensaje: 'Solicitud exitosa...',
          ok: true,
          solicitud: solicitudesPorId[0],
        });
      };
    } catch (error) {
      enviarError(res, error);
    };
  },

  postSolicitud: async function (req, res) {
    const fecha = new Date();
    try {
      const idSolicitud = await Solicitud.find({});
      const newSolicitud = new Solicitud();
      newSolicitud.idSolicitud = idSolicitud.length + 1;
      newSolicitud.resumen = req.body.resumen;
      newSolicitud.descripcion = req.body.descripcion;
      newSolicitud.prioridad = req.body.prioridad;
      newSolicitud.fechaHora = fecha.getDay() + '/' + fecha.getMonth() + '/' + fecha.getFullYear() + '     ' + fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
      newSolicitud.estado = 'Sin asignar (abierta)';
      newSolicitud.abierta = true;
      newSolicitud.categoria = req.body.categoria;
      newSolicitud.refUsuarioAsignado = '604e300ca0f34b37c07b7c3a';
      newSolicitud.refCliente = req.body.refCliente;
      newSolicitud.refUsuarioSolicitante = req.decoded.id;
      newSolicitud.listaIncumbentes = [req.decoded.id];
      await newSolicitud.save();
      res.json({
        mensaje: 'Solicitud enviada...',
        ok: true,
        solicitud: newSolicitud,
      });
    } catch (error) {
      enviarError(res, error);
    };
  },

  postIncumbentes: async function (req, res) {
    try {
      await Solicitud.updateOne({ _id: req.params.idSolicitud }, {
        $addToSet: {
          listaIncumbentes: req.body.nuevosIncumbentes,
        }
      });

    } catch (error) {
      console.error(error);
    };
  },
};
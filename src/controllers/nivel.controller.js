/** Controlador para manejar las solicitudes HTTP relacionadas con los niveles. **/

const nivelService = require('../services/nivel.service');

/** Obtiene todos los niveles de la base de datos. **/
const obtenerTodas = async (req, res) => {
	try {
		const niveles = await nivelService.obtenerTodas();
		res.status(200).json({
			success: true,
			data: niveles,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

/** Obtiene un nivel por su ID de la base de datos. **/
const obtenerPorId = async (req, res) => {
	try {
		const nivel = await nivelService.obtenerPorId(req.params.id);
		res.status(200).json({
			success: true,
			data: nivel,
		});
	} catch (error) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

/** Crea un nuevo nivel en la base de datos. **/
const crear = async (req, res) => {
	try {
		const nivel = await nivelService.crear(req.body);
		res.status(201).json({
			success: true,
			message: 'Nivel creado correctamente',
			data: nivel,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

/** Actualiza un nivel existente en la base de datos. **/
const actualizar = async (req, res) => {
	try {
		const nivel = await nivelService.actualizar(req.params.id, req.body);
		res.status(200).json({
			success: true,
			message: 'Nivel actualizado correctamente',
			data: nivel,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	obtenerTodas,
	obtenerPorId,
	crear,
	actualizar,
};

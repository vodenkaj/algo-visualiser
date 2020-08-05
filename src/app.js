const express = require('express');
const loaders = require('./loaders');
const config = require('./config')

async function startServer() {
	const app = express();
	await loaders(app);

	app.listen(config.port,'192.168.0.100', err => {
		if (err){
			console.log(err);
			return;
		}
		console.log(`Server listening on port: ${config.port}`);
	})
}

startServer();
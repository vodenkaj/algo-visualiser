const express = require('express');
module.exports = (app) => {
	app.set('view engine', 'ejs');
	app.use(express.static('public'))

	app.get('/sorters', (req, res) =>{
		res.render('sorters');
	})

	app.get('/pathfinders', (req, res) =>{
		res.render('pathfinders');
	})

	app.get('/', (req, res) =>{
		res.render('home');
	})
}
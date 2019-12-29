const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

/*app.get('/pocetna',function(req,res){
	 res.sendFile(__dirname+"/pocetna.html");
});

app.get('/pocetna.css', function(req, res) {
  res.sendFile(__dirname + "/" + "pocetna.css");
});*/

app.post('/', function (req, res) {

	fs.readdir(__dirname+'/public/slike', function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
	var niz= new Array();
	var broj= req.body;
	var razlika=files.length-broj;
	if (razlika=>3)
	{
		for (var i=broj; i<broj+3; i++)
		{
			var ime="http://localhost:8080/slike/"+files[i];
			niz.push ({"nema": ime});
		}
	}
	else if (razlika ==2)
	{
		for (var i=broj; i<broj+2; i++)
		{	var ime="http://localhost:8080/slike/"+files[i];
			niz.push (ime);
		}
		niz.push ("nema");
	}
	else if (razlika ==1)
	{
		for (var i=broj; i<broj+1; i++)
		{
			var ime="http://localhost:8080/slike/"+files[i];
			niz.push (ime);
		}
		niz.push ("nema");
		niz.push ("nema");
	}
	//var jsonZ = JSON.stringify(niz); 
	res.send (niz);
});
	
	
});



app.post('/rezervacija.html', function(req, res) {

  
  
  fs.readFile(__dirname+'/public/zauzeca.json', 'utf8', function callback(err, data){
    if (err){
        console.log(err);
    } else {
    zauzeca = JSON.parse(data); 
	var upisTreba= "ne";
		
	var provjera="nema";

	for (var i=0; i<zauzeca.periodicna.length; i++)
	{
		if (req.body.dan== zauzeca.periodicna[i].dan && req.body.naziv== zauzeca.periodicna[i].naziv && req.body.pocetak== zauzeca.periodicna[i].pocetak && req.body.kraj== zauzeca.periodicna[i].kraj && req.body.semestar== zauzeca.periodicna[i].semestar)
		{
			provjera="ima";
		}

	}
	for (var i=0; i<zauzeca.vanredna.length; i++)
	{
		if (req.body.datum== zauzeca.vanredna[i].datum && req.body.naziv== zauzeca.vanredna[i].naziv && req.body.pocetak== zauzeca.vanredna[i].pocetak && req.body.kraj== zauzeca.vanredna[i].kraj)
		{
			provjera="ima";
		}
	}		
		
		
		
		
	if (provjera=="nema" && req.body.periodicna=="da") 
	{
		zauzeca.periodicna.push({
		"dan": req.body.dan,
		"semestar": req.body.semestar, 
		"pocetak": req.body.pocetak,
		"kraj": req.body.kraj,
		"naziv": req.body.naziv,
		"predavac": req.body.predavac
		});
		upisTreba="da";
	}
	else if (provjera=="nema" && req.body.periodicna=="ne") 
	{
		zauzeca.vanredna.push({
		"datum": req.body.datum,
		"pocetak": req.body.pocetak,
		"kraj": req.body.kraj,
		"naziv": req.body.naziv,
		"predavac": req.body.predavac
		});
		upisTreba="da";
	}
	else if (provjera=="ima")
	{
		var tekst="Nije moguce rezervisati salu "+req.body.naziv+" za navedeni datum "+req.body.datum+" i termin od "+ req.body.pocetak+" do "+ req.body.kraj+ " !";
		res.send(tekst);
	}
	
	
	
	if (upisTreba=="da")
	{
		var jsonZ = JSON.stringify(zauzeca); 
	
		fs.writeFile(__dirname+'/public/zauzeca.json', jsonZ, function (err) {
			if (err) throw err;
			console.log('Saved!');
		}); 
		
		res.json(jsonZ);
	}
  }}); 
});



app.listen(8080);

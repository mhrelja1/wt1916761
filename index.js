const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const db = require('./db.js');
var Sequelize = require("sequelize");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/',function(req,res){
	 res.sendFile(__dirname+"/public/pocetna.html");
});

app.get('/pocetna.css', function(req, res) {
  res.sendFile(__dirname + "/" + "/public/pocetna.css");
});




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

  var bod=req.body;
  var postoji= true;
  var nadjeniTermin;
	
db.sala.findOne ({where: {naziv: bod.naziv}}).then ( function (nadjenaSala) {
	console.log (nadjenaSala);
	db.osoblje.findOne ({where: {id: bod.predavac}}).then (function (nadjenaOsoba)
	{ 
	
	  db.termin.findOne 
	  ({where: {
		[Sequelize.Op.or]: 
			[{redovni: 0,dan:null, datum: bod.datum, semestar:null, 
			[Sequelize.Op.or]: [{[Sequelize.Op.and]: [{pocetak: {[Sequelize.Op.gte]:bod.pocetak}},{ kraj:{[Sequelize.Op.lte]:bod.kraj}}]}, 
			{[Sequelize.Op.and]: [{pocetak: {[Sequelize.Op.lt]:bod.pocetak}},{ kraj:{[Sequelize.Op.gt]:bod.kraj}}]} ]			
			},
			
			{redovni: 1, dan:bod.dan, datum:null, semestar: bod.semestar,  
			[Sequelize.Op.or]: [{[Sequelize.Op.and]: [{pocetak: {[Sequelize.Op.gte]:bod.pocetak}},{ kraj:{[Sequelize.Op.lte]:bod.kraj}}]}, 
			{[Sequelize.Op.and]: [{pocetak: {[Sequelize.Op.lt]:bod.pocetak}},{ kraj:{[Sequelize.Op.gt]:bod.kraj}}]} ]
			}
			]}})
	  .then ( function (termin1) 
		{  var dajTermin;
			if (termin1==null)
			{	
				if (bod.periodicna==1)
				{
					db.termin.create ({redovni: 1, dan: bod.dan, datum: null, semestar:bod.semestar, pocetak: bod.pocetak, kraj: bod.kraj}).then 
					(termini => 
					{
						db.rezervacija.findOrCreate ({where: {terminId: termini.id, salaId: nadjenaSala.id, osobljeId:nadjenaOsoba.id}}).spread (function(rez, kreirana) {
						if (kreirana==false) {res.json({"ime":nadjenaOsoba.ime, "prezime":nadjenaOsoba.prezime, "uloga":nadjenaOsoba.uloga});}
						else { res.send("odg"); }
				
						});
						
					});
				}
				else if (bod.periodicna==0)
				{
					db.termin.create ({redovni: 0, dan: null, datum: bod.datum, semestar:null, pocetak: bod.pocetak, kraj: bod.kraj})
					.then (termini => 
					{
						db.rezervacija.findOrCreate ({where: {terminId: termini.id, salaId: nadjenaSala.id, osobljeId:nadjenaOsoba.id}}).spread (function(rez, kreirana) {
						if (kreirana==false) {res.send({"ime":nadjenaOsoba.ime, "prezime":nadjenaOsoba.prezime, "uloga":nadjenaOsoba.uloga});}
						else { res.send("odg");   }
				
						});	
					
					});
				}
				
			}
			else 
			{  
				db.rezervacija.findOrCreate ({where: {terminId: termin1.id, salaId: nadjenaSala.id} , defaults: {osobljeId:nadjenaOsoba.id}}).spread (function(rez, kreirana) {
				if (kreirana==false) {res.send({"ime":nadjenaOsoba.ime, "prezime":nadjenaOsoba.prezime, "uloga":nadjenaOsoba.uloga}); }
				else { res.send("odg");}
				
				});
			}
			
		});
	});
});


   
  
});


app.get ('/rezervacije', function(req, res) {
	
 (async () => {
	await db.sequelize.sync();
	let osoblje = await db.osoblje.findAll ();
	let sale=await db.sala.findAll ();
	let rezervacije= await db.rezervacija.findAll ();
	let termini= await db.termin.findAll ();
	let upisi;
	var per= new Array();
	var van=new Array();
	
	rezervacije.forEach (rezervacija=> {
		var datum;
		var dan; 
		var semestar;
		var pocetak;
		var kraj;
		var predavac;
		var naziv;
		var tacno=true;
		
		for (var i=0; i<termini.length; i++)
		{
			if (termini[i].id== rezervacija.terminId) 
			{
				if (termini[i].redovni==false) { datum= termini[i].datum;  console.log(datum); pocetak=termini[i].pocetak; kraj=termini[i].kraj; tacno=false; }
				if (termini[i].redovni==true) { dan=termini[i].dan; semestar=termini[i].semestar; pocetak=termini[i].pocetak; kraj=termini[i].kraj;}
			}
		}
		for (var i=0; i<sale.length; i++)
		{
			if (sale[i].id== rezervacija.salaId) naziv= sale[i].naziv;
		}
		for (var i=0; i<osoblje.length; i++)
		{
			if (osoblje[i].id== rezervacija.osobljeId) predavac= osoblje[i].ime+" "+osoblje[i].prezime;
		}
		if (tacno==false)
		{	
			van.push(
				{"datum": datum,
				"pocetak": pocetak,
				"kraj": kraj,
				"naziv": naziv,
				"predavac": predavac});
		}
		if (tacno==true)
		{
			per.push(
			{"dan": dan,
			"semestar": semestar,
			"pocetak": pocetak,
			"kraj": kraj,
			"naziv": naziv,
			"predavac": predavac});
		}
	
	});
   upisi= {"periodicna":per, "vanredna":van};
   res.send(upisi);
})();

});

app.get ('/sale', function(req, res) {
	
	db.sala.findAll().then( function (sale) 
	{
		res.json(sale);
	});
});

app.get ('/termini', function(req, res) {
	
	db.termin.findAll().then( function (termini) 
	{
		res.json(termini);
	});
});

app.get ('/osoblje', function(req, res) {
	db.osoblje.findAll().then( function (osobe) 
	{
		res.json(osobe);
	});
});


app.get ('/saleOsoblja', function(req, res) {
	
	var datetime = new Date();

	var semestar;
	var mjesec=datetime.getMonth()+1;
	
	if ((mjesec<13 && mjesec>9 ) || mjesec==1) semestar="zimski";
	else if (mjesec>2 && mjesec<7) semestar= "ljetni";
	//else semestar=null;
	
	var mjesec="0"+mjesec.toString();
	var danSedmica= datetime.getDay()-1;
	
	var datum= datetime.getDate().toString()+"."+mjesec+"."+datetime.getFullYear().toString();
	var sat= datetime.getHours().toString();
	var min=datetime.getMinutes().toString();
	var vrijeme= sat+":"+min;
	var rez= new Array();
	var lista=new Array();
	console.log(vrijeme);
	
	(async () => {
	await db.sequelize.sync();
	console.log(datum);
	let termini = await 	db.termin.findAll ({where:  {
		[Sequelize.Op.or]: 
		[{dan:null, datum: datum, semestar:null,  
		[Sequelize.Op.and]:  [
		{pocetak: {[Sequelize.Op.lte]:vrijeme}}, {kraj:{[Sequelize.Op.gte]:vrijeme}}]},
		{dan:danSedmica, datum:null, semestar: semestar, [Sequelize.Op.and]: [ {pocetak: {[Sequelize.Op.lte]:vrijeme}}, {kraj:{[Sequelize.Op.gte]:vrijeme}}] }]}});
	let osoblje= await 	db.osoblje.findAll();
	let sale= await 	db.sala.findAll();
	let rezervacije= await 	db.rezervacija.findAll();
	
	osoblje.forEach ( osoba=>
	{	var ime=osoba.ime+" "+osoba.prezime;
		termini.forEach (termin=> {
			for (var i=0; i<rezervacije.length; i++)
			{
				if (rezervacije[i].osobljeId==osoba.id && rezervacije[i].terminId==termin.id)
				{
					sale.forEach (sala=> { if (sala.id==rezervacije[i].salaId) lista.push({"sala":sala.naziv, "osoba":ime}); });
				}
			}
		});
	}
	);
	

	res.json(lista);
	})();
});


app.listen(8080);

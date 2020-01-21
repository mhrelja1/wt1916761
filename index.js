const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const path = require('path');
const db = require('./db.js');
var Sequelize = require("sequelize");

	var vanredna= new Array();
	var redovna= new Array();

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

  //ispitaj da li postojii iz req, ako nema kreiraj i vrati podatke o osobi
  var bod=req.body;
  var postoji= true;
  var nadjeniTermin;
	
db.sala.findOne ({where: {naziv: bod.naziv}}).then ( function (nadjenaSala) {
	
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

// za spiralu4
//sva zauzeca dohvatiti ajaxom i iz baze, kako??


app.get ('/osoblje', function(req, res) {
	
	db.osoblje.findAll().then( function (osobe) 
	{
		res.json(osobe);
	});
});

app.get ('/zauzeca', function(req, res) {
	
var brojac=0;
	
	db.rezervacija.findAll().then( function (rezervacije) 
	{
		rezervacije.forEach( rezervacija=>
		{	brojac++;
			db.termin.findOne ({where: {id: rezervacija.terminId}}).then ( nadjeniTermin=>
				{
					db.sala.findOne ({where: {id: rezervacija.salaId}}).then (nadjenaSala=> 
						{
							db.osoblje.findOne ({where: {id: rezervacija.osobljeId}}).then (nadjenaOsoba=> 
								{   
									var predavac= nadjenaOsoba.ime+" "+nadjenaOsoba.prezime;							
									if (nadjeniTermin.redovni==false) 
									{vanredna.push(
										{"datum": nadjeniTermin.datum,
										"pocetak": nadjeniTermin.pocetak,
										"kraj": nadjeniTermin.kraj,
										"naziv": nadjenaSala.naziv,
										"predavac": predavac}
									);

									

									}
									else if (nadjeniTermin.redovni==true)
									{redovna.push (
										{"dan": nadjeniTermin.dan,
										"semestar": nadjeniTermin.semestar,
										"pocetak": nadjeniTermin.pocetak,
										"kraj": nadjeniTermin.kraj,
										"naziv": nadjenaSala.naziv,
										"predavac": predavac}
										);
										
									}		
									
								}
								
							
							);
						}
					
					);
					
				});
				
			
		});

	});	
	
//var zauzeca= {"vanredna": vanredna, "periodicna": redovna};
		console.log(vanredna);
		console.log(redovna);

	
	
	
});


app.get ('/sale', function(req, res) {
	
	/*db.rezervacija.findAll().then( function (rez) 
	{
		rez.forEach(rezi => 
		{
			//osoba.getRezervisalaOsoba().then (rez => {rez.getTermin().then(termin=> {console.log ("\t"+osoba.ime+" "+termin.pocetak);});});
			console.log ("\t"+rezi.salaId);
			db.sala.findOne ({where: {id: rezi.salaId}}). then (sala=> {console.log(sala.naziv);});
		});
	});*/
	
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
    //console.log(datum +" "+semestar+" "+danSedmica);
	var rez= new Array();
	var reci;
	
	db.termin.findAll ({where: {
		[Sequelize.Op.or]: 
			[{dan:null, datum: datum, semestar:null, pocetak: {[Sequelize.Op.lte]:vrijeme}, kraj:{[Sequelize.Op.lte]:vrijeme}},
			{dan:danSedmica, datum:null, semestar: semestar, pocetak: {[Sequelize.Op.lte]:vrijeme}, kraj:{[Sequelize.Op.lte]:vrijeme} }]}})
	.then (termini => {
		db.osoblje.findAll().then(osobe=>
		{
			termini.forEach(termin => { 
			
				osobe.forEach(osoba => {
					
					db.rezervacija.findAll ({where: {terminId: termin.id, osobljeId:osobe.id }})
					.then (rezervacija=> { 
						sala.findOne({where:{id: rezervacija.salaId}})
						.then (sala=> {
							rez.push({"sala": sala.naziv, "osoba":osobe.id });

						});
					}); //pretrazi osobe, ako ima salu uzmi, ako nema u kancelariji
				});
			});
		});
	});

	res.json("rez");

});


app.listen(8080);

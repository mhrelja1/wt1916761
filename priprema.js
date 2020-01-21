const db = require('./db.js')
db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){

	
	return Promise.all ([
	
		db.osoblje.create ({ime:"Neko", prezime:"Nekić", uloga:"profesor"}),
		db.osoblje.create ({ime:"Drugi", prezime:"Neko", uloga:"asistent"}),
		db.osoblje.create ({ime:"Test", prezime:"Test", uloga:"asistent"}),
		db.sala.create ({naziv:'1-11'}),
		db.sala.create ({naziv:'1-15'}),
		db.termin.create ({redovni: 0, dan: null, datum: "01.01.2020", semestar:null, pocetak: "12:00", kraj: "13:00"}),
		db.termin.create ({redovni: 1, dan: 0, datum:null, semestar:'zimski', pocetak: "13:00", kraj: "14:00"}),
		db.rezervacija.create ({}),
		db.rezervacija.create ({})
		]).then(([osoba1, osoba2, osoba3, sala1, sala2, termin1, termin2, rez1, rez2]) => {
		
		return Promise.all([
		
		sala1.setOsoblje(osoba1),
		sala2.setOsoblje(osoba3),
		rez1.setTermin (termin1),
		rez2.setTermin(termin2),
		]).then (([sala1, sala2, rez1, rez2]) => {
		
		return Promise.all([
		osoba1.setRezervisalaOsoba (rez1),
		osoba3.setRezervisalaOsoba(rez2),
		sala1.setRezervisanaSala (rez1),
		sala1.setRezervisanaSala (rez2)
		]);
  }).catch(error => console.log(error));
		})
  .catch(error => console.log(error));
}
		
		
	

window.onload= function ()
{

	
	Pozivi.ucitajRezervacije (data => {
	var per=data.periodicna;
	var van=data.vanredna;
	
	Kalendar.ucitajPodatke (per, van);
	});
	
	Pozivi.ucitajOsoblje (data => {
		Kalendar.upisiOsoblje(data);
	});

	Kalendar.iscrtajKalendar (document.getElementsByClassName("mjesec"), 0);


}
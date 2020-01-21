window.onload= function ()
{
	Pozivi.ucitajUKalendar(function(data) {
	var per= data.periodicna;
	var van= data.vanredna;
	Kalendar.ucitajPodatke (per, van);

	});
	Pozivi.ucitajOsoblje(function (data)
	{
		Kalendar.upisiOsoblje (data);
		
	});
	
	Kalendar.iscrtajKalendar (document.getElementsByClassName("mjesec"), 10);
	

}
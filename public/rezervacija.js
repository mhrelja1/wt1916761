window.onload= function ()
{
	Pozivi.ucitajUKalendar('zauzeca.json', function(data) {
	var per= data["periodicna"];
	var van= data["vanredna"];
	Kalendar.ucitajPodatke (per,van);

	});
	
	Kalendar.iscrtajKalendar (document.getElementsByClassName("mjesec"), 10);

}
let Pozivi = (function(){
	
	function ucitajUKalendarImpl(url, callback)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				console.log('responseText:' + xmlhttp.responseText);
				try {
					var data = JSON.parse(xmlhttp.responseText);
				} catch(err) {
					console.log(err.message + " in " + xmlhttp.responseText);
					return;
				}
				callback(data);
			}
		};
		
		xmlhttp.open ("GET", url, true);
		xmlhttp.send();
	}
	
	function unosNovogTerminaImpl (sala, pocetak, kraj, checkbox, mjesec, dan, redniBrojDana)
	{
		var xhr = new XMLHttpRequest();
		var url = "/rezervacija.html";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
		//document.getElementById("rijec").innerHTML=xhr.status;

		if (xhr.readyState === 4 && xhr.status === 200) {
			var tip = xhr.getResponseHeader("Content-type");
			
			if (tip=="text/html; charset=utf-8") confirm(xhr.response);
			else if (tip=="application/json; charset=utf-8") 
			{
				/*Pozivi.citajUKalendar('zauzeca.json', function(data) {
				var per= JSON.stringify(data.periodicna);
				var van= JSON.stringify(data.vanredna);
				Kalendar.ucitajPodatke (per,van);

				});*/

				var kalendarRef= document.getElementsByClassName("mjesec");
				Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);
				
				
			}


		}
		};
	var datum=redniBrojDana+"."+(mjesec+1)+".2019";
	//var dann=dan+1;
	var semestar;
	if (mjesec==1 || mjesec==2 || mjesec==3 || mjesec==4 || mjesec==5) semestar="ljetni";
	else if (mjesec==9 || mjesec==10 || mjesec==11 || mjesec==0) semestar="zimski";
	var periodicna;
	
	if (checkbox==0) periodicna="ne";
	else periodicna="da";
		
	var data= JSON.stringify({"periodicna":periodicna, "datum": datum.toString(),"semestar": semestar, "dan": dan, "mjesec":mjesec, "pocetak": pocetak, "kraj": kraj, "naziv": sala, "predavac": "MM"});
	xhr.send(data);

	}
	function ucitajSlikeImpl(broj, callback)
	{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() 
		{
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
			{
				console.log('responseText:' + xmlhttp.responseText);
				try {
					var data = JSON.parse(xmlhttp.response);
					} catch(err) {
					//console.log(err.message + " in " + xmlhttp.responseText);
					return;
				}
				callback(data);
			}
		};
		
		xmlhttp.open ("POST", "/", true);
		xmlhttp.send(broj);
	}


  	return {        
		ucitajUKalendar: ucitajUKalendarImpl ,
		unosNovogTermina: unosNovogTerminaImpl,
		ucitajSlike: ucitajSlikeImpl
}}());


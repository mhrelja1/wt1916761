let Pozivi = (function(){
	
	function ucitajRezervacijeImpl(callback)
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
		
		xmlhttp.open ("GET", '/rezervacije', true);
		xmlhttp.send();
	}
	
	function unosNovogTerminaImpl (sala, pocetak, kraj, checkbox, mjesec, dan, redniBrojDana)
	{
		var xhr = new XMLHttpRequest();
		xhr.open("POST", '/rezervacija.html', true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
		//document.getElementById("rijec").innerHTML=xhr.status;

		if (xhr.readyState === 4 && xhr.status === 200) {
			//alert (xhr.response);
			if (xhr.response =="odg") 
			{
			   var kalendarRef=document.getElementsByClassName("mjesec");
			   Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);
			   // !!!! STAVI U VANREDNA I ONA ZAUZECA
			}
			else 
			{ var data;
				try {
					data = JSON.parse(xhr.responseText);
				} catch(err) {
					console.log(err.message + " in " + xhr.responseText);
					return;
				}
				alert("Salu je već rezervisala osoba: "+ data.ime+" "+ data.prezime+", "+data.uloga );
				
			}
		}
		};
	var redniBrDana=redniBrojDana;
	mjesec=mjesec+1;

	if (redniBrojDana.toString().length<2) redniBrDana= "0"+redniBrojDana.toString();
	//var dann=dan+1;
	var semestar;
	if (mjesec==1 || mjesec==2 || mjesec==3 || mjesec==4 || mjesec==5) semestar="ljetni";
	else if (mjesec==9 || mjesec==10 || mjesec==11 || mjesec==0) semestar="zimski";
	if (mjesec.toString().length<2) mjesec="0"+mjesec;
	var datum=redniBrDana+"."+mjesec+".2020";

	var predavac= document.getElementById("osoblje").selectedIndex+1;
		
	var data= JSON.stringify({"periodicna":checkbox, "datum": datum,"semestar": semestar, "dan": dan, "predavac":predavac, "pocetak": pocetak, "kraj": kraj, "naziv": sala});
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
	
	function ucitajOsobljeImpl (callback)
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
		
		xmlhttp.open ("GET", '/osoblje', true);
		xmlhttp.send();	
	}
	
	function ucitajSaleImpl (callback)
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
		
		xmlhttp.open ("GET", '/sale', true);
		xmlhttp.send();	
	}
	
	function ucitajTermineImpl (callback)
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
		
		xmlhttp.open ("GET", '/termini', true);
		xmlhttp.send();	
	}
	 
	function ucitajRezervacijeImpl (callback)
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
		
		xmlhttp.open ("GET", '/rezervacije', true);
		xmlhttp.send();	
	}
	
	function ucitajSaleOImpl (callback)
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
		
		xmlhttp.open ("GET", '/saleOsoblja', true);
		xmlhttp.send();	
		
	}
	

  	return {        
		ucitajRezervacije: ucitajRezervacijeImpl ,
		unosNovogTermina: unosNovogTerminaImpl,
		ucitajSlike: ucitajSlikeImpl,
		ucitajOsoblje: ucitajOsobljeImpl,
		ucitajRezervacije: ucitajRezervacijeImpl,
		ucitajSale: ucitajSaleImpl,
		ucitajTermine: ucitajTermineImpl,
		ucitajSaleO: ucitajSaleOImpl
}}());


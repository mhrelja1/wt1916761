let Kalendar = (function(){
    
	
	var brojDanaUMjesecu= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	var brojSedmicaUMjesecu= [5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 6 ];
	var prviDan= [1, 4, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6];
	var zadnjiDan= [3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5, 1];
	var mjeseci= ["Januar", "Februar", "Mart", "April", "Maj", "Juni", "Juli", "August", "Septembar", "Oktobar", "Novembar", "Decembar"];
	var dani= ["PON", "UTO", "SRI", "CET", "PET", "SUB", "NED"];
	var periodicnaZ ;
	var vanrednaZ; 
	
	function obojiZauzecaImpl(kalendarRef, mjesec, sala, pocetak, kraj)
	{      
		for (var i=0; i<vanrednaZ.length; i++)
		{   
			if (mjesec==(vanrednaZ[i].datum.substring(3, 5))-1 && sala== vanrednaZ[i].naziv && pocetak== vanrednaZ[i].pocetak && kraj== vanrednaZ[i].kraj)
			{
				var redElementi= document.getElementsByClassName("red");
				for (var x=0; x<brojSedmicaUMjesecu[mjesec]; x++)
				{
					var itemElementi= redElementi[x].getElementsByClassName("item");
					
					for (var y=0; y<7; y++)
					{ var podKlasa= itemElementi[y].children;
						if (podKlasa[0].innerHTML==vanrednaZ[i].datum.substring(0,2)) 
						{  
							if ( podKlasa[1].classList.contains('slobodna') ) 
							{podKlasa[1].classList.remove('slobodna');  podKlasa[1].classList.add('zauzeta'); }

						}
					}
				}	
					
			}
		}
		for (var i=0; i<periodicnaZ.length; i++)
		{
				
			if (sala== periodicnaZ[i].naziv && pocetak== periodicnaZ[i].pocetak && kraj== periodicnaZ[i].kraj && ((periodicnaZ[i].semestar=="ljetni" && (mjesec==1 || mjesec==2 || mjesec==3 || mjesec==4 || mjesec==5)) || (periodicnaZ[i].semestar=="zimski" && (mjesec==9 || mjesec==10 || mjesec==11 || mjesec==0))) )
			{   
				var redElementi= document.getElementsByClassName("red");
				for (var x=0; x<brojSedmicaUMjesecu[mjesec]; x++)
				{
					var itemElementi= redElementi[x].getElementsByClassName("item");
					
					for (var y=0; y<7; y++)
					{ var podKlasa= itemElementi[y].children;
						if (y==periodicnaZ[i].dan) 
						{
							var podKlasa= itemElementi[y].children;
							if ( podKlasa[1].classList.contains('slobodna') ) 
							{podKlasa[1].classList.remove('slobodna');  podKlasa[1].classList.add('zauzeta'); }
						}
					}
				}
			}
		}
	}
	function ucitajPodatkeImpl(periodicna, vanredna)
	{
		periodicnaZ= periodicna;
		vanrednaZ= vanredna;
		
	}
	function iscrtajKalendarImpl(kalendarRef, mjesec)
	{       

		var brojRedova= brojSedmicaUMjesecu[mjesec];
		//var mjesec1= document.getElementsByClassName("mjesec");
		var red;
		var brojac=0;
		var p= document.getElementById("nazivMjeseca");
		var ime= document.createTextNode (mjeseci[mjesec]);
		p.appendChild (ime);
		
		var naziviDana= document.createElement ("div");
		naziviDana.classList.add('red1');
		var dan1;
		var tekst;
		for (var z=0; z<7; z++)
		{
			dan1= document.createElement ("div");
			dan1.classList.add('dani');
			tekst= document.createTextNode (dani[z]);
			dan1.appendChild(tekst);
			naziviDana.appendChild(dan1);
			
		}
		kalendarRef[0].appendChild (naziviDana);

		
		for (var i=0; i<brojRedova; i++)
		{
			red=  document.createElement ("div");
			red.classList.add("red");
			
			for (var j=0; j<7; j++)
			{
				var dan= document.createElement ("div");
				dan.addEventListener('click', 
					function(){ 
						if(confirm ('Želite li da rezervišete ovaj termin?')) {
						sala= document.getElementById("opcije").value;
						pocetak= document.getElementById("pocetak").value;
						kraj= document.getElementById("kraj").value;
						var checkbox= document.getElementById("ch").checked;
						var dan=this.getAttribute('dan');
						var redniBrojDana= this.getAttribute('redniBrojDana');
						Pozivi.unosNovogTermina (sala, pocetak, kraj, checkbox, mjesec, dan, redniBrojDana); 
					}
					else {
					
					}
				}, false);
				dan.classList.add('item');

				if (i==0 && j<prviDan[mjesec]) dan.classList.add ('sakrij'); else {brojac++; }
				if (i==brojRedova-1 && j>zadnjiDan[mjesec]) dan.classList.add ('sakrij');
				dan.setAttribute('dan', j);
				dan.setAttribute('redniBrojDana', brojac);
				var item1= document.createElement ("div");
				item1.classList.add('item1');
				if (brojac< brojDanaUMjesecu[mjesec]+1)
				{
					var brDana = document.createTextNode(brojac); 
					item1.appendChild (brDana);
				}
				var zauzece= document.createElement ("div");
				zauzece.classList.add('slobodna');
				dan.appendChild (item1);
				dan.appendChild (zauzece);
				
				red.appendChild (dan);				
			}
			//mjesec1[0].appendChild (red);
			kalendarRef[0].appendChild(red);
		}
		if (mjesec==10) document.getElementById("button2").disabled = false;
		if (mjesec==11) document.getElementById("button2").disabled = true;
		if (mjesec==0) document.getElementById("button1").disabled = true;
		if (mjesec==1) document.getElementById("button1").disabled = false;
		
		var pocetak;
		var kraj;
		var sala;
		document.getElementById("button1").addEventListener("click", function(){
			pocetak= document.getElementById("pocetak").value;
			kraj= document.getElementById("kraj").value;
			sala= document.getElementById("opcije").value;
			var sadrzaj = document.getElementsByClassName("mjesec");
			sadrzaj[0].innerHTML = '';
			p.innerHTML = '';
			Kalendar.iscrtajKalendar (kalendarRef, mjesec-1);
			Kalendar.obojiZauzeca(kalendarRef, mjesec-1, sala, pocetak, kraj);

		}); 
		
		document.getElementById("button2").addEventListener("click", function(){
			pocetak= document.getElementById("pocetak").value;
			kraj= document.getElementById("kraj").value;
			sala= document.getElementById("opcije").value;
			var sadrzaj = document.getElementsByClassName("mjesec");
			sadrzaj[0].innerHTML = ' ';
			p.innerHTML = '';
			Kalendar.iscrtajKalendar (kalendarRef, mjesec+1);

			if (mjesec==10) document.getElementById("button2").disabled = true;
			if (mjesec==0) document.getElementById("button1").disabled = false;

			Kalendar.obojiZauzeca(kalendarRef, mjesec+1, sala, pocetak, kraj);

		});
		

		function ponisti ()
		{
				var redElementi= document.getElementsByClassName("red");

				for (var x=0; x<brojSedmicaUMjesecu[mjesec]; x++)
				{
					var itemElementi= redElementi[x].getElementsByClassName("item");
					
					for (var y=0; y<7; y++)
					{ var podKlasa= itemElementi[y].children;
						
						var podKlasa= itemElementi[y].children;						
						podKlasa[1].classList.remove('zauzeta');	
						podKlasa[1].classList.add('slobodna');
						
					}
				}
		}
		
		
		document.getElementById("opcije").addEventListener("change", function(){
			sala= document.getElementById("opcije").value;
			ponisti();

			if (pocetak!=null && kraj!=null)
			Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);

		}); 
		document.getElementById("pocetak").addEventListener("change", function(){
			pocetak= document.getElementById("pocetak").value;
			ponisti();
			if (sala!=null && kraj!=null) 
			Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);

		});
		document.getElementById("kraj").addEventListener("change", function(){
			kraj= document.getElementById("kraj").value;
			ponisti();
			if (pocetak!=null && sala!=null) 
			Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);
		});
		
			
			ponisti();
			if (document.getElementById("opcije").value!=null && document.getElementById("pocetak").value!=null && document.getElementById("kraj").value!=null) 
			Kalendar.obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj);
	}
	return {        
		obojiZauzeca: obojiZauzecaImpl,        
		ucitajPodatke: ucitajPodatkeImpl,        
		iscrtajKalendar: iscrtajKalendarImpl    
}}());


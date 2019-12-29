var klik=0;
var sljedece= document.getElementById("button2");
var slika1= document.getElementById("slika1");
var slika2= document.getElementById("slika2");
var slika3= document.getElementById("slika3");

window.onload= function ()
	{
	
	var prethodne=document.getElementById("button1");

	
	if (klik==0) prethodne.disabled = true;
	Pozivi.ucitajSlike (0, function (niz) {
		var jsonZ = JSON.stringify(niz);
		for (var i=0; i<3; i++)
		{
			//if (niz[i]!="nema")
					document.getElementById("slika1").style.backgroundImage="url("+jsonZ[i]+")";
				
	}});
		/*
	
	sljedece.addEventListener("click", function(){
		
	});*/
	
	
}
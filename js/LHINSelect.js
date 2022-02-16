function selectLHIN(current)  {
	var val = current
	var t = document.getElementById("LHINresult");
	//var current = document.getElementById("currentLHIN");
	var mymap = document.getElementById("LHINmap");
	var head_cell;
	
	t.innerHTML = ''
	mymap.src = "../pic/ontario-lhins-map-gtranked" +val+".png"
	
	for (let i = 1; i <= 14 ; i++) {
		//let collectionHead = document.getElementsByName("fname");
		head_cell = document.getElementsByName("LHINhead"+i);
	}


}
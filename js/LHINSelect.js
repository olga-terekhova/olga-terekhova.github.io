function selectLHIN(current)  {
	var val = current
	var t = document.getElementById("LHINresult");
	//var current = document.getElementById("currentLHIN");
	var mymap = document.getElementById("LHINmap");
	//var head_cell;
	
	if (current == 0) {t.innerHTML = '' ;}
	mymap.src = "../pic/ontario-lhins-map-gtranked" +val+".png"
	
	for (let i = 0; i <= 14 ; i++) {
		
		let selectLHIN = document.getElementById("selectLHIN" + i);
		
		if (i == current) {
			selectLHIN.style.color = "#000000";
		}
		else {
			selectLHIN.style.color = "#999999";
		}
	}
	
	for (let i = 1; i <= 14 ; i++) {
		let left_cell = document.getElementsByName("LHINleft"+i);
		if (i == current)  {
			for(let j=0; j< left_cell.length; j++){
				left_cell[j].style.borderLeft = "2px solid";
			}
		}
		
		else {
			for(let j=0; j< left_cell.length; j++){
				left_cell[j].style.borderLeft = "1px solid";
			}
		}
		let right_cell = document.getElementsByName("LHINright"+i);
		if (i == current)  {
			for(let j=0; j< right_cell.length; j++){
				right_cell[j].style.borderRight = "2px solid";
			}
		}
		else if (i == current - 1) {
			for(let j=0; j< right_cell.length; j++){
				right_cell[j].style.borderRight = "2px solid";
			}
		}
		else {
			for(let j=0; j< right_cell.length; j++){
				right_cell[j].style.borderRight = "1px solid";
			}
		}
		let head_cell = document.getElementsByName("LHINhead"+i);
		if (i == current)  {
			head_cell[0].style.borderBottom = "2px solid";
			head_cell[0].style.borderTop = "2px solid";
			head_cell[0].style.borderRight = "2px solid";
			head_cell[0].style.backgroundColor = "rgb(200, 200, 200)";
			console.log(head_cell[0].offsetLeft);
			let scrolling_div = document.getElementById("divContainer");
			
			let firstColumn = document.getElementsByName("Specialty of Practice")[0];
				
			scrolling_div.scrollLeft = head_cell[0].offsetLeft - firstColumn.offsetWidth;
		}
		else if (i == current -1) {
			head_cell[0].style.borderBottom = "1px solid";
			head_cell[0].style.borderTop = "1px solid";
			head_cell[0].style.borderRight = "2px solid";
			head_cell[0].style.backgroundColor = "rgb(255, 255, 255)"
		}
		else {
			head_cell[0].style.borderBottom = "1px solid";
			head_cell[0].style.borderTop = "1px solid";
			head_cell[0].style.borderRight = "1px solid";
			head_cell[0].style.backgroundColor = "rgb(255, 255, 255)"
		}
		
	}


}
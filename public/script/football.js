//_____________________________________________________________________________________________________________________
// 1. Changing names of teams and stadium.
//_____________________________________________________________________________________________________________________
let TeamName1 = document.getElementById("TeamName1");
let TeamName2 = document.getElementById("TeamName2");
let Team1Btn = document.getElementsByClassName("Team1Btn");
let Team2Btn = document.getElementsByClassName("Team2Btn");
let StadiumName = document.getElementById("StadiumName");

const leadsFromLocalStorage =
	localStorage.getItem("TeamName1st") +
	localStorage.getItem("TeamName2nd") +
	localStorage.getItem("StadiumName$");

if (leadsFromLocalStorage) {
	TeamName1.innerHTML = localStorage.getItem("TeamName1st");
	TeamName2.innerHTML = localStorage.getItem("TeamName2nd");
	for (var i = 0; i < Team1Btn.length; i++) {
		Team1Btn[i].innerHTML = localStorage.getItem("TeamName1st");
	}
	for (var i = 0; i < Team2Btn.length; i++) {
		Team2Btn[i].innerHTML = localStorage.getItem("TeamName2nd");
	}
	StadiumName.innerHTML = localStorage.getItem("StadiumName$");
}
TeamName1.addEventListener("input", (event) => {
	const TeamName1st = event.target.innerText;
	localStorage.setItem("TeamName1st", TeamName1st);
	for (var i = 0; i < Team1Btn.length; i++) {
		Team1Btn[i].innerHTML = localStorage.getItem("TeamName1st");
	}
});
TeamName2.addEventListener("input", (event) => {
	const TeamName2nd = event.target.innerText;
	localStorage.setItem("TeamName2nd", TeamName2nd);
	for (var i = 0; i < Team2Btn.length; i++) {
		Team2Btn[i].innerHTML = localStorage.getItem("TeamName2nd");
	}
});
StadiumName.addEventListener("input", (event) => {
	const StadiumName$ = event.target.innerText;
	localStorage.setItem("StadiumName$", StadiumName$);
});
//_____________________________________________________________________________________________________________________
// 2.Timer
//_____________________________________________________________________________________________________________________
let timerRunning = 0;
let half = 0;
let [minutes, seconds, addedTime] = [0, 0, 0];
const timer = document.getElementById("timer");
const addTimeBtn = document.getElementById("addTimeBtn");
const toggleGameBtn = document.getElementById("toggleGameBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const winningTeam = document.getElementById("winningTeam");
//--------------------------------------------------------------------
// Display time when refresh
if (localStorage.getItem("time")) {
	if (localStorage.getItem("addedTime") != "0") {
		timer.innerText = `${localStorage
			.getItem("minutes")
			.padStart(2, "0")}:${localStorage
			.getItem("seconds")
			.padStart(2, "0")} +${localStorage.getItem("addedTime")}`;
		//display part over. Now update variables.
		minutes = parseInt(localStorage.getItem("minutes"));
		seconds = parseInt(localStorage.getItem("seconds"));
		addedTime = parseInt(localStorage.getItem("addedTime"));
	} else {
		timer.innerText = `${localStorage
			.getItem("minutes")
			.padStart(2, "0")}:${localStorage
			.getItem("seconds")
			.padStart(2, "0")}`;
		//display part over. Now update variables.
		minutes = parseInt(localStorage.getItem("minutes"));
		seconds = parseInt(localStorage.getItem("seconds"));
	}
}
//-------------------------------------------------------------------
//Display time in general
const displayTime = (minutes, seconds) => {
	if (addedTime > 0) {
		timer.innerText =
			String(minutes).padStart(2, "0") +
			":" +
			String(seconds).padStart(2, "0") +
			" +" +
			String(addedTime);
		localStorage.setItem("minutes", JSON.stringify(minutes));
		localStorage.setItem("seconds", JSON.stringify(seconds));
		localStorage.setItem("addedTime", JSON.stringify(addedTime));
	} else {
		timer.innerText =
			String(minutes).padStart(2, "0") +
			":" +
			String(seconds).padStart(2, "0");
		localStorage.setItem("minutes", JSON.stringify(minutes));
		localStorage.setItem("seconds", JSON.stringify(seconds));
	}
};
//-------------------------------------------------------------------
//Update time every one second
const updateTimer = () => {
	if (timerRunning) {
		timerID = setInterval(function () {
			seconds += 1;
			if (seconds > 59) {
				seconds = 0;
				minutes += 1;
				//Half time
				if (minutes == 45 + addedTime && half == 0) {
					clearInterval(timerID);
					toggleGameBtn.innerText = "Resume 2nd Half";
					addedTime = 0;
					localStorage.setItem(
						"addedTime",
						JSON.stringify(addedTime)
					);
					half = 1;
					minutes = 45;
					localStorage.setItem("minutes", JSON.stringify(minutes));
					winningTeam.style.display = "block";
					winningTeam.innerText = "1st Half";
				}
				//game over by time
				if (minutes == 90 + addedTime) {
					clearInterval(timerID); //for ending entire game
					addedTime = 0;
					localStorage.setItem(
						"addedTime",
						JSON.stringify(addedTime)
					);
					half = 2;
					winningTeam.style.display = "block";
					if (team1Score > team2Score)
						winningTeam.innerText = "Team 1 Wins";
					else if (team1Scor < team2Score)
						winningTeam.innerText = "Team 2 Wins";
					else winningTeam.innerText = "Match Draw";
				}
			}
			if (minutes + seconds > 45 && half == 1) {
				winningTeam.style.display = "none";
				console.log("HII");
			}
			displayTime(minutes, seconds);
		}, 1000);
	} else {
		clearInterval(timerID);
		//for stopping timer when pause button is triggered
	}
};
//-------------------------------------------------------------------
//Start and stop button
toggleGameBtn.addEventListener("click", function () {
	if (!timerRunning) {
		timerRunning = true;
		updateTimer();
		toggleGameBtn.innerText = "Pause Game";
	} else {
		timerRunning = false;
		updateTimer();
		if (seconds + minutes) toggleGameBtn.innerText = "Resume Game";
		else toggleGameBtn.innerText = "Start Game";
	}
});
//-------------------------------------------------------------------
//reset time button
resetTimerBtn.addEventListener("click", function () {
	localStorage.setItem("minutes", "0");
	localStorage.setItem("seconds", "0");
	localStorage.setItem("addedTime", "0");
	minutes = 0;
	seconds = 0;
	addedTime = 0;
	displayTime(minutes, seconds);
});
//-------------------------------------------------------------------
//added time button
const numberInput = document.getElementById("numberInput");
const addTimeText = document.getElementById("addTimeText");
numberInput.addEventListener("input", function () {
	if (numberInput.value < 0) {
		//input is not a positive integer, add the invalid class
		// numberInput.classList.add(".numberInput.invalid");
		numberInput.value = 0;
		// numberInput.style.border = "2px solid red";
	}
	addedTime = numberInput.value;
	localStorage.setItem("addedTime", String(numberInput.value));
});
addTimeBtn.addEventListener("click", function () {
	numberInput.style.display = "block";
	addTimeText.style.display = "none";
});
//_________________________________________________________________________________________________________
// player names stuff
//_________________________________________________________________________________________________________
class player {
	constructor(name) {
		this.name = name;
		this.yellowCard = 0;
		this.Redcard = 0;
		this.Goal = 0;
		this.Subs = 0;
	}
}
//creating objects for each player
const t1p1 = new player("Player1");
const t1p2 = new player("Player2");
const t1p3 = new player("Player3");
const t1p4 = new player("Player4");
const t1p5 = new player("Player5");
const t1p6 = new player("Player6");
const t1p7 = new player("Player7");
const t1p8 = new player("Player8");
const t1p9 = new player("Player9");
const t1p10 = new player("Player10");
const t1p11 = new player("1Player11");
//------------------------------------
const t2p1 = new player("Player1");
const t2p2 = new player("Player2");
const t2p3 = new player("Player3");
const t2p4 = new player("Player4");
const t2p5 = new player("Player5");
const t2p6 = new player("Player6");
const t2p7 = new player("Player7");
const t2p8 = new player("Player8");
const t2p9 = new player("Player9");
const t2p10 = new player("Player10");
const t2p11 = new player("Player11");
//------------------------------------
//array of players from each team
const t1players = [
	t1p1,
	t1p2,
	t1p3,
	t1p4,
	t1p5,
	t1p6,
	t1p7,
	t1p8,
	t1p9,
	t1p10,
	t1p11,
];

const t2players = [
	t2p1,
	t2p2,
	t2p3,
	t2p4,
	t2p5,
	t2p6,
	t2p7,
	t2p8,
	t2p9,
	t2p10,
	t2p11,
];
//--------------------------------------------------------
const t1playerNames = document.getElementsByClassName("t1playerNames");
const t2playerNames = document.getElementsByClassName("t2playerNames");

//--------------------------------------------------------
//retreive names of players when refresh
if (sessionStorage.getItem("t1players") + sessionStorage.getItem("t2players")) {
	let t1players = JSON.parse(sessionStorage.getItem("t1players"));
	let t2players = JSON.parse(sessionStorage.getItem("t2players"));
	for (var i = 0; i < 11; i++) {
		let DOM1 = "T1P" + (i + 1);
		let DOM2 = "T2P" + (i + 1);
		document.getElementById(DOM1).innerText = t1players[i].name;
		document.getElementById(DOM2).innerText = t2players[i].name;
	}
	//Update name for buttons also.
	for (var i = 0; i < 33; i++) {
		var j = i % 11;
		t1playerNames[i].innerText = t1players[j].name;
		t2playerNames[i].innerText = t2players[j].name;
	}
}
//________________________________________________________
// Changing names of players by user
const T1Div = document.getElementById("T1");
const T2Div = document.getElementById("T2");
T1Div.addEventListener("input", function (event) {
	// Get the button element
	let change = event.target;
	let i = 0;

	if (change.id === "T1P1") {
		t1p1.name = change.innerText;
		i = 0;
	} else if (change.id === "T1P2") {
		t1p2.name = change.innerText;
		i = 1;
	} else if (change.id === "T1P3") {
		t1p3.name = change.innerText;
		i = 2;
	} else if (change.id === "T1P4") {
		t1p4.name = change.innerText;
		i = 3;
	} else if (change.id === "T1P5") {
		t1p5.name = change.innerText;
		i = 4;
	} else if (change.id === "T1P6") {
		t1p6.name = change.innerText;
		i = 5;
	} else if (change.id === "T1P7") {
		t1p7.name = change.innerText;
		i = 6;
	} else if (change.id === "T1P8") {
		t1p8.name = change.innerText;
		i = 7;
	} else if (change.id === "T1P9") {
		t1p9.name = change.innerText;
		i = 8;
	} else if (change.id === "T1P10") {
		t1p10.name = change.innerText;
		i = 9;
	} else if (change.id === "T1P11") {
		t1p11.name = change.innerText;
		i = 10;
	}
	sessionStorage.setItem("t1players", JSON.stringify(t1players));
	while (i < t1playerNames.length) {
		t1playerNames[i].innerHTML = change.innerText;
		i += 11;
	}
});
T2Div.addEventListener("input", function (event) {
	// Get the button element
	let change = event.target;
	let i = 0;

	if (change.id === "T2P1") {
		t2p1.name = change.innerText;
		i = 0;
	} else if (change.id === "T2P2") {
		t2p2.name = change.innerText;
		i = 1;
	} else if (change.id === "T2P3") {
		t2p3.name = change.innerText;
		i = 2;
	} else if (change.id === "T2P4") {
		t2p4.name = change.innerText;
		i = 3;
	} else if (change.id === "T2P5") {
		t2p5.name = change.innerText;
		i = 4;
	} else if (change.id === "T2P6") {
		t2p6.name = change.innerText;
		i = 5;
	} else if (change.id === "T2P7") {
		t2p7.name = change.innerText;
		i = 6;
	} else if (change.id === "T2P8") {
		t2p8.name = change.innerText;
		i = 7;
	} else if (change.id === "T2P9") {
		t2p9.name = change.innerText;
		i = 8;
	} else if (change.id === "T2P10") {
		t2p10.name = change.innerText;
		i = 9;
	} else if (change.id === "T2P11") {
		t2p11.name = change.innerText;
		i = 10;
	}
	sessionStorage.setItem("t2players", JSON.stringify(t2players));

	while (i < t2playerNames.length) {
		t2playerNames[i].innerHTML = change.innerText;
		i += 11;
	}
});
//---------------------------------------------------------------------------------------------------------
//Score part
//_________________________________________________________________________________________________________
class team {
	constructor(name) {
		this.goals = 0;
		this.substitutions = 0;
		this.yellowCards = 0;
		this.Redcards = 0;
		this.name = name;
	}
}
const team1 = new team("Team 1");
const team2 = new team("Team 2");
const team1Score = document.getElementById("team1Score");
const team2Score = document.getElementById("team2Score");
//-------------------------------------------------------
const gdropdown1 = document.getElementById("gdropdown1");
const gdropdown2 = document.getElementById("gdropdown2");
const ydropdown1 = document.getElementById("ydropdown1");
const ydropdown2 = document.getElementById("ydropdown2");
const rdropdown1 = document.getElementById("rdropdown1");
const rdropdown2 = document.getElementById("rdropdown2");
const fteams = document.getElementById("fteams");
const cteams = document.getElementById("cteams");
const timelineContent = document.getElementById("timelineContent");
let imgOfPlayer = null;
//---------------------------
if (sessionStorage.getItem("timeline")) {
	console.log(JSON.parse(sessionStorage.getItem("timeline")));
	timelineContent.innerHTML = JSON.parse(sessionStorage.getItem("timeline"));
}

//---------------------------
gdropdown1.addEventListener("click", function (event) {
	let change = event.target;
	const storeHtml = timelineContent.innerHTML;
	team1.goals++;

	switch (change.id) {
		case "gT1P1Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p1.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P1");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P2Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p2.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P2");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P3Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p3.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P3");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P4Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p4.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P4");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P5Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p5.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P5");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P6Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p6.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P6");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P7Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p7.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P7");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P8Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p8.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P8");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P9Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p9.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P9");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P10Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p10.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P10");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		case "gT1P11Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p11.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P11");
			imgOfPlayer.src = "img/Goal1.svg";
			break;
		default:
			team1.goals--;
			break;
	}
	team1Score.innerHTML = team1.goals;
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});
//---------
gdropdown2.addEventListener("click", function (event) {
	let change = event.target;
	const storeHtml = timelineContent.innerHTML;
	team2.goals++;

	switch (change.id) {
		case "gT2P1Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p1.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P1");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P2Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p2.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P2");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P3Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p3.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P3");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P4Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p4.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P4");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P5Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p5.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P5");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P6Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p6.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P6");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P7Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p7.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P7");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P8Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p8.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P8");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P9Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p9.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P9");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P10Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p10.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P10");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		case "gT2P11Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p11.name} scored a goal ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P11");
			imgOfPlayer.src = "img/Goal2.svg";
			break;
		default:
			team2.goals--;
			break;
	}
	team2Score.innerHTML = team2.goals;
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});
//yellow cards--------------------------------------------------------------------------------------------------
ydropdown1.addEventListener("click", function (event) {
	let change = event.target;
	const storeHtml = timelineContent.innerHTML;

	team1.yellowCards++;
	switch (change.id) {
		case "yT1P1Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p1.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P1");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P2Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p2.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P2");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P3Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p3.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P3");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P4Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p4.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P4");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P5Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p5.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P5");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P6Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p6.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P6");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P7Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p7.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P7");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P8Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p8.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P8");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P9Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p9.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P9");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P10Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p10.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P10");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		case "yT1P11Btn":
			timelineContent.innerHTML = `</br>${team1.name} : ${t1p11.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT1P11");
			imgOfPlayer.src = "img/yellowCard1.svg";
			break;
		default:
			team1.yellowCards--;
			break;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});

ydropdown2.addEventListener("click", function (event) {
	let change = event.target;
	const storeHtml = timelineContent.innerHTML;
	team2.yellowCards++;
	switch (change.id) {
		case "yT2P1Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p1.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P1");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P2Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p2.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P2");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P3Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p3.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P3");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P4Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p4.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P4");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P5Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p5.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P5");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P6Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p6.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P6");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P7Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p7.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P7");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P8Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p8.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P8");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P9Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p9.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P9");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P10Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p10.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P10");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		case "yT2P11Btn":
			timelineContent.innerHTML = `</br>${team2.name} : ${t2p11.name} gets a yellow card ${storeHtml}`;
			imgOfPlayer = document.getElementById("imgT2P11");
			imgOfPlayer.src = "img/yellowCard2.svg";
			break;
		default:
			team2.yellowCards--;
			break;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});
//red cards-------------------------------------------------------------------------------------------------
rdropdown1.addEventListener("click", function (event) {
	let change = event.target;
	const storeHtml = timelineContent.innerHTML;
	team1.redCards++; // Assuming you want to count red cards for team1
	switch (change.id) {
		case "rT1P1Btn":
			if (!t1p1.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p1.name} gets a red card ${storeHtml}`;
			}
			t1p1.Redcard++;
			imgOfPlayer = document.getElementById("imgT1P1");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P2Btn":
			if (!t1p2.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p2.name} gets a red card ${storeHtml}`;
			}
			t1p2.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P2");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P3Btn":
			if (!t1p3.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p3.name} gets a red card ${storeHtml}`;
			}
			t1p3.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P3");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P4Btn":
			if (!t1p4.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p4.name} gets a red card ${storeHtml}`;
			}
			t1p4.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P4");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P5Btn":
			if (!t1p5.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p5.name} gets a red card ${storeHtml}`;
			}
			t1p5.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P5");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P6Btn":
			if (!t1p6.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p6.name} gets a red card ${storeHtml}`;
			}
			t1p6.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P6");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P7Btn":
			if (!t1p7.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p7.name} gets a red card ${storeHtml}`;
			}
			t1p7.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P7");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P8Btn":
			if (!t1p8.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p8.name} gets a red card ${storeHtml}`;
			}
			t1p8.Redcard++;
			imgOfPlayer = document.getElementById("imgT1P8");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P9Btn":
			if (!t1p9.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p9.name} gets a red card ${storeHtml}`;
			}
			t1p9.Redcard++;
			imgOfPlayer = document.getElementById("imgT1P9");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P10Btn":
			if (!t1p10.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p10.name} gets a red card ${storeHtml}`;
			}
			t1p10.Redcard++;

			imgOfPlayer = document.getElementById("imgT1P10");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		case "rT1P11Btn":
			if (!t1p11.Redcard) {
				timelineContent.innerHTML = `</br>${team1.name} : ${t1p11.name} gets a red card ${storeHtml}`;
			}
			t1p11.Redcard++;
			imgOfPlayer = document.getElementById("imgT1P11");
			imgOfPlayer.src = "img/redCard1.svg";
			break;
		default:
			team1.redCards--;
			break;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});

rdropdown2.addEventListener("click", function (event) {
	const storeHtml = timelineContent.innerHTML;
	let change = event.target;
	team2.redCards++; // Assuming you want to count red cards for team2
	switch (change.id) {
		case "rT2P1Btn":
			if (!t2p1.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p1.name} gets a red card ${storeHtml}`;
			}
			t2p1.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P1");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P2Btn":
			if (!t2p2.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p2.name} gets a red card ${storeHtml}`;
			}
			t2p2.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P2");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P3Btn":
			if (!t2p3.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p3.name} gets a red card ${storeHtml}`;
			}
			t2p3.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P3");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P4Btn":
			if (!t2p4.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p4.name} gets a red card ${storeHtml}`;
			}
			t2p4.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P4");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P5Btn":
			if (!t2p5.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p5.name} gets a red card ${storeHtml}`;
			}
			t2p5.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P5");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P6Btn":
			if (!t2p6.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p6.name} gets a red card ${storeHtml}`;
			}
			t2p6.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P6");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P7Btn":
			if (!t2p7.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p7.name} gets a red card ${storeHtml}`;
			}
			t2p7.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P7");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P8Btn":
			if (!t2p8.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p8.name} gets a red card ${storeHtml}`;
			}
			t2p8.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P8");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P9Btn":
			if (!t2p9.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p9.name} gets a red card ${storeHtml}`;
			}
			t2p9.Redcard++;
			imgOfPlayer = document.getElementById("imgT2P9");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P10Btn":
			if (!t2p10.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p10.name} gets a red card ${storeHtml}`;
			}
			t2p10.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P10");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		case "rT2P11Btn":
			if (!t2p11.Redcard) {
				timelineContent.innerHTML = `</br>${team2.name} : ${t2p11.name} gets a red card ${storeHtml}`;
			}
			t2p11.Redcard++;

			imgOfPlayer = document.getElementById("imgT2P11");
			imgOfPlayer.src = "img/redCard2.svg";
			break;
		default:
			team2.redCards--;
			break;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});
//offside and corner-----------------------------------------------------------------------------------------
fteams.addEventListener("click", function (event) {
	const storeHtml = timelineContent.innerHTML;
	const change = event.target;
	if (change.id === "fTeam1Btn") {
		timelineContent.innerHTML = `</br>${team1.name} player was offside ${storeHtml}`;
		console.log("HI");
	} else if (change.id === "fTeam2Btn") {
		timelineContent.innerHTML = `</br>${team2.name} player was offside ${storeHtml}`;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});
cteams.addEventListener("click", function (event) {
	const storeHtml = timelineContent.innerHTML;
	const change = event.target;
	if (change.id === "cTeam1Btn") {
		timelineContent.innerHTML = `</br>${team1.name} gets Corner ${storeHtml}`;
	} else if (change.id === "cTeam2Btn") {
		timelineContent.innerHTML = `</br>${team2.name} gets Corner ${storeHtml}`;
	}
	sessionStorage.setItem(
		"timeline",
		JSON.stringify(timelineContent.innerHTML)
	);
});

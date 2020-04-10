const trialVars = {
	checkHolder: document.querySelector('.timeTrialCheckbox'),
	clockHand: document.querySelector('.clockHand'),
	clockNumbers: document.querySelector('.clockNumbers'),
	clockDiv: document.querySelector('.clockDiv'),
	baseTime: undefined,
	//clockIntervalHolder: setInterval(setClock, 1000),


}

/*
const checkHolder = document.querySelector('.timeTrialCheckbox');
const inputs = document.querySelector('.inputs');
const clockHand = document.querySelector('.clockHand');
const clockNumbers = document.querySelector('.clockNumbers');
let clockDiv = document.querySelector('.clockDiv');

let baseTime;
let clockIntervalHolder = setInterval(setClock, 1000);
*/
function startTimeTrial(){

	if(trialVars.checkHolder.checked){
		clearInterval(trialVars.clockIntervalHolder);
		trialVars.clockIntervalHolder = setInterval(setClock, 1000);
		trialVars.clockNumbers.textContent = '00:00';
		trialVars.clockHand.style.animationPlayState = "running";
		trialVars.clockDiv.classList.remove('hidden');
		
		if(trialVars.clockHand.classList.contains('clockHandRotate')){
			trialVars.clockHand.classList.remove('clockHandRotate');
			trialVars.clockHand.classList.add('clockHandRotate2');
		}else{
			trialVars.clockHand.classList.remove('clockHandRotate2');
			trialVars.clockHand.classList.add('clockHandRotate');
		}
		console.log('Setting the clock.');
		trialVars.baseTime = new Date;	
		setPlayingField();
	}else{
		trialVars.clockDiv.classList.add('hidden');
		setPlayingField();
	}





}
/*Change Start button event listener - make it run startTimeTrial
		Which checks if the timetrial mode is selected.
		If it's not - make it just set the playingField.

Make the SetPlayingField function check if checkHolder is checked.


Make a fixed circle (clock with hands?) or square in the top-left of the screen.
Give the square textContent a setTimeout to count down from 3 to 0 (decrement);
On 0,

*/

//const clockFace = document.querySelector('.clock');

function setClock(){ /*Does a weird thing when you list hours - starts counting from 2 hours up.*/
	//let baseTime = new Date;
	  let timeNow = new Date;
	  let timeDifferenceNumHolder = timeNow - trialVars.baseTime;
	  let timeDifference = new Date(timeDifferenceNumHolder);
	    let minutes = timeDifference.getMinutes();
	    minutes < 10 ? minutes = '0'+minutes : minutes=minutes;
	    let seconds = timeDifference.getSeconds();
	    seconds<10 ? seconds= '0'+seconds : seconds=seconds;
	    let timeBuild = `${minutes}:${seconds}`;
	    trialVars.clockNumbers.textContent=`${timeBuild}`;
	    return timeBuild;		
	}




const checkHolder = document.querySelector('.timeTrialCheckbox');
const inputs = document.querySelector('.inputs');
const clockFace = document.querySelector('.clockFace');
let clockDiv = document.querySelector('.clockDiv');

let baseTime;

function startTimeTrial(){

	if(checkHolder.checked){
		clockDiv.classList.remove('hidden');
		console.log('Setting the clock.');
		baseTime = new Date;
		setClock();
	}else{
		setPlayingField();
	}





	setPlayingField();
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
	function getTimeDifference(){
	  let timeNow = new Date;
	  let timeDifferenceNumHolder = timeNow - baseTime;
	  let timeDifference = new Date(timeDifferenceNumHolder);
	    let minutes = timeDifference.getMinutes();
	    minutes < 10 ? minutes = '0'+minutes : minutes=minutes;
	    let seconds = timeDifference.getSeconds();
	    seconds<10 ? seconds= '0'+seconds : seconds=seconds;
	    let timeBuild = `${minutes}:${seconds}`;
	    clockFace.textContent=`${timeBuild}`;
	    return timeBuild;
		
	}
	getTimeDifference();
	setInterval(getTimeDifference, 1000);
}



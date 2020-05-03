const trialVars = {
	timeTrialClassList: document.querySelector('.timeTrialCheckbox').classList,
	timeLimitClassList: document.querySelector('.timeLimitCheckbox').classList,
	clockHand: document.querySelector('.clockHand'),
	clockNumbers: document.querySelector('.clockNumbers'),
	clockDiv: document.querySelector('.clockDiv'),
	timeLimitOptions: document.querySelector('.timeLimitOptions'),
	timeLimitMinInput: document.querySelector('.timeLimitMinInput'),
	timeLimitSecInput: document.querySelector('.timeLimitSecInput'),
	initialTimeLimit: undefined,
	baseTime: undefined,
	endTime: undefined,
	mode: undefined,
	error: false,
}

function checkControlOptions(mode){
	trialVars.mode = mode;
	trialVars.error = false;
	let minutes = trialVars.timeLimitMinInput.value;
	let seconds = trialVars.timeLimitSecInput.value;

    if(vars.fontChangeCheckbox.classList.contains('checkboxSelected')){
    	vars.playingField.style.fontFamily = 'Aurebesh_Bold';
    }else{
    	vars.playingField.style.fontFamily = 'Comic-sans MS, Candara, Garamond';
    }	

	if(trialVars.mode === 'timeLimit'){	/*if Time Limit mode was selected, tell setPlayingField to abort if:*/
		if(+minutes + +seconds === 0){	/*The time limit is 0*/
			trialVars.error = true;
		}else if((typeof (+minutes) !== 'number') || (minutes >=60 || minutes <0)) { /*The input was somehow not a number or over an hour*/
			trialVars.error = true;
		}else if((typeof (+seconds) !== 'number') || (seconds >=60 )) { /*The seconds are enough to make a whole minute*/
			trialVars.error = true;			
		}else if(minutes < 1 && seconds <1){ /*The seconds and minutes are less than 1*/
			trialVars.error = true;
		}
		if(trialVars.error === true){
			alert('Please enter a time between 00:01 and 59:59');
			return;
		};
	}

	if((trialVars.timeTrialClassList.contains('checkboxSelected')) || (trialVars.timeLimitClassList.contains('checkboxSelected'))) {
		clearInterval(trialVars.clockIntervalHolder);
		if(trialVars.timeTrialClassList.contains('checkboxSelected')){
			trialVars.clockNumbers.textContent = '00:00';
			trialVars.clockHand.style.animationDuration = '60s';
			trialVars.clockIntervalHolder = setInterval(timeTrial, 1000);
			trialVars.baseTime = new Date;
		}else{
			let mins = trialVars.timeLimitMinInput.value;
			let secs = trialVars.timeLimitSecInput.value;
			trialVars.initialTimeLimit = `${mins || '0'} min ${secs || 0} sec`;
			trialVars.endTime = new Date(0);
			trialVars.endTime.setSeconds(trialVars.endTime.getSeconds() + secs);
			trialVars.endTime.setMinutes(trialVars.endTime.getMinutes() + mins);
			trialVars.clockHand.style.animationDuration = `${(trialVars.endTime.getSeconds()) + (trialVars.endTime.getMinutes()*60)}s`;
			timeLimit(1);						
			trialVars.clockIntervalHolder = setInterval(timeLimit, 1000);
		}

		trialVars.clockHand.style.animationPlayState = "running";
		trialVars.clockDiv.classList.remove('hidden');
		
		if(trialVars.clockHand.classList.contains('clockHandRotate')){	/*Alternates the animation between 2 identical ones*/
			trialVars.clockHand.classList.remove('clockHandRotate');	/*This ensures proper animation resetting*/
			trialVars.clockHand.classList.add('clockHandRotate2');
		}else{
			trialVars.clockHand.classList.remove('clockHandRotate2');
			trialVars.clockHand.classList.add('clockHandRotate');
		}
	}else{
		trialVars.clockDiv.classList.add('hidden');
	}
return true;
}

function timeTrial(){	/*Sets the clock to count from 0 till whenever the player finishes the game*/
	  let timeNow = new Date;
	  let timeDifferenceNumHolder = timeNow - trialVars.baseTime;
	  let timeDifference = new Date(timeDifferenceNumHolder);
	    let minutes = timeDifference.getMinutes();
	    minutes < 10 ? minutes = '0'+minutes : minutes=minutes;
	    let seconds = timeDifference.getSeconds();
	    seconds<10 ? seconds= '0'+seconds : seconds=seconds;
	    let timeBuild = `${minutes}:${seconds}`;
	    trialVars.clockNumbers.textContent=`${timeBuild}`;
	    																						
	    if((trialVars.clockNumbers.textContent === "59:59")){ /*If it takes an hour, announce Game Over.*/
			gameLost();
			return;
		}
		return timeBuild;
	}

function timeLimit(preCall = 0){	/*Sets the clock to cound down from a given time*/
	trialVars.endTime.setSeconds(trialVars.endTime.getSeconds() -1 + preCall);//when called initially,
																			 //it sets the UI clock's numbers correctly and at once.
	let minutes = trialVars.endTime.getMinutes();
	minutes < 10 ? minutes = '0'+minutes : minutes=minutes;
	let seconds = trialVars.endTime.getSeconds();
	seconds<10 ? seconds= '0'+seconds : seconds=seconds;
	let timeBuild = `${minutes}:${seconds}`;
	trialVars.clockNumbers.textContent=`${timeBuild}`;

	if((trialVars.endTime.getSeconds() === 0) && (trialVars.endTime.getMinutes() === 0)){ /*If the time is up, announce Game Over.*/
		gameLost();
		return;
	}
	return timeBuild;	
	}

function gameLost() {
	clearInterval(trialVars.clockIntervalHolder);
	gameOver('loss');
	vars.toggleVisibilityLocked = true;
	return;
}
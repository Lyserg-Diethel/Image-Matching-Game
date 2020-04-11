'use strict'

const vars = {
    startBtn: document.querySelector('.startBtn'),
    playingField: document.querySelector('.playingField'),
    numberOfLetters: document.querySelector('.startingLetters').value,
    allSquares: undefined,
    allSquaresArr : [],
    lettersFound: 0,
    firstPick: undefined,
    secondPick: undefined,
    firstPickIndex: undefined,
    secondPickIndex: undefined,
    firstPickTextContent: undefined,
    secondPickTextContent: undefined,
    firstPickTimeoutHolder: undefined,
    secondPickTimeoutHolder: undefined,
    toggleVisibilityLocked: false,
}

function setLetter(letter, randomIndex, playingFieldArr, indexModifier){ /*Tries a random slot. If it's full, it repeatedly tries to set the letter in the adjescent index, until it finds one that's not taken.*/
    let setLetterModeToggle = 'random';
    let setLetterSucceeded = false;

    if(setLetterModeToggle === 'random') {
        indexModifier = (generateRandomNumber(0,playingFieldArr.length -1) - randomIndex); //Between 0 and the length - randomIndex;
        setLetterModeToggle = 'adjescent';
    }

    if(indexModifier + randomIndex > (playingFieldArr.length -1)){ /*if the composite index is too big for the array, loop to [0]*/
        indexModifier = -1 -randomIndex;      
    };
    if(playingFieldArr[randomIndex + indexModifier] === ''){
        playingFieldArr[randomIndex + indexModifier] = letter;
        setLetterSucceeded = true;
        setLetterModeToggle = 'random';
        indexModifier+=1;
        return undefined;
    }else{
        indexModifier+=1;

        if(setLetterSucceeded === false){
            if(playingFieldArr.includes('')){
                setLetter(letter, randomIndex, playingFieldArr, indexModifier);
            };
        };
    };
}

function setPlayingField(){
    vars.numberOfLetters = document.querySelector('.startingLetters').value;

    if ((vars.numberOfLetters > 26) || (vars.numberOfLetters <= 0) || ((vars.numberOfLetters/vars.numberOfLetters)!= 1) || ('' + vars.numberOfLetters.length)>2) {
        alert("Please input a whole number between 1 and 26");
        return undefined;
    }
    
    const alphabet =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let letterUses =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let playingFieldArr = new Array((+vars.numberOfLetters)*2);
    let randomIndex = generateRandomNumber(0,playingFieldArr.length -1); //gives random index for the letter.
    
    vars.lettersFound = 0;
    vars.firstPick = undefined;
    vars.secondPick = undefined;
    vars.playingField.innerHTML = ''; /*Deletes all tiles from a potential previous game.*/
    
    
    playingFieldArr.fill('');
    letterUses.fill(0);

    for(let i=0; i<=playingFieldArr.length-1; i+=1){ 
        let indexModifier = 1;

        if(letterUses[i] < 2){ //if the letter's been used less than 2 times.

            if(playingFieldArr[randomIndex] === ''){
                    playingFieldArr[randomIndex] = alphabet[i];
                    letterUses[i]+=1;
            }else if(playingFieldArr[randomIndex] !== ''){
                    setLetter(alphabet[i], randomIndex, playingFieldArr, indexModifier); //TEST: Trying to pass var decalration instead of haveing lobal variable.
                    letterUses[i]+=1; //still increment it, so long as the function sets it right.
            }
            if(letterUses[i] < 2){  /*if the current letter hasn't been set twice, make 'i' target the same letter again.*/
                i-=1;
            };
        }
    }
    buildGUI(playingFieldArr);
}

function generateRandomNumber(start,end){ //includes start and end numbers.
    let randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;    
    return randomNumber;
}
/*
Makes tile container and fills it with 5 letter-boxes.
When its' full, it loops to make another square container div and append the next letter-holders to it.
Keeps going till all the letters in the array have been assigned to letter-holders.
*/

function buildGUI(playingFieldArr){
    let arrayProgress = 0;
    let containerHolder = [];
    let contaierDivHolder;
    let squareHolder;
    let spanHolder;
    let containerDivHolder;

    vars.allSquaresArr = [];
    arrayProgress = 0;
    for(let j=0;j<Math.ceil(playingFieldArr.length/5); j+=1){
        containerDivHolder = document.createElement('div');

        for(let i=0; i< 5; i+=1){
            if(playingFieldArr[arrayProgress]){
                squareHolder = document.createElement('div');
                squareHolder.className = 'square active';

                spanHolder = document.createElement('span');
                spanHolder.className = 'span hidden';    

                containerDivHolder.appendChild(squareHolder);
                squareHolder.appendChild(spanHolder);
                spanHolder.textContent = playingFieldArr[arrayProgress];
                arrayProgress+=1;
            }
        }
        vars.playingField.appendChild(containerDivHolder);
    }
    vars.allSquares = document.querySelectorAll('.square');
    
    for(let i=0;i<vars.allSquares.length;i+=1){
        vars.allSquaresArr.push(vars.allSquares[i]);
    };
    for(let q=0; q<vars.allSquares.length; q+=1){
        
        vars.allSquares[q].addEventListener('click', resolveTileInteractions);
        
    };
    
}

function resolveTileInteractions(){

    if(vars.toggleVisibilityLocked === true){
        return undefined;
    }
    if(vars.firstPick === undefined){    //if you're selecting a first tile.
        vars.firstPick = this;
        vars.firstPick.classList.add('squareSelected');
        vars.firstPick.classList.remove('active');
        vars.firstPickTextContent = this.childNodes[0].textContent;
        vars.firstPickIndex = vars.allSquaresArr.indexOf(this);
        vars.firstPickTimeoutHolder = vars.allSquaresArr[vars.firstPickIndex];

    }else if((vars.firstPick !== undefined) && (vars.secondPick === undefined)){ //if you're selecting a second tile.
        vars.secondPick = this;
        vars.secondPickTextContent = this.childNodes[0].textContent;
        vars.secondPickIndex = vars.allSquaresArr.indexOf(this);
        vars.secondPickTimeoutHolder = vars.allSquaresArr[vars.secondPickIndex];
        if((vars.firstPickTextContent === vars.secondPickTextContent) &&(vars.firstPick !== vars.secondPick)){
            console.log('Found 2 of a kind!');
            vars.lettersFound+=1;        /*Counts until all letters are found, so it can alert() the end-game.*/

            /*give the matching elements a green background, make the letters visible, block further tile animations.*/
            for(let x = 0; x<vars.allSquares.length; x+=1){     /*OPTIMIZE BY CHANGING THE LOOP TO JUST TARGET first&secondPick*/
                if(vars.allSquares[x].childNodes[0].textContent === vars.firstPickTextContent){
                    vars.allSquares[x].classList.add('squareGuessed', 'guessedAnimation');
                    vars.allSquares[x].classList.remove('active');
                    vars.allSquares[x].childNodes[0].classList.remove('hidden');
                    vars.allSquares[x].removeEventListener('click', resolveTileInteractions);
                }

            }
            if(+vars.numberOfLetters === vars.lettersFound){ /*If all the letters are found, congratulate the player.*/
                vars.lettersFound = 0;

                if(trialVars.checkHolder.value === 'on'){
                    clearInterval(trialVars.clockIntervalHolder);
                    trialVars.clockHand.style.animationPlayState = "paused";
                    alert(`You win! It took you ${trialVars.clockNumbers.textContent}! Press the Start button again, if you wish to play more.`);
                }else{
                    alert(`You win! Press the Start button again, if you wish to play more.`);
                }
            }

            vars.firstPick = undefined;
            vars.secondPick = undefined;

            }else{ /*Block interactions for a bit, make selected elements flash in red, show the letters, then fade them again.*/
            vars.toggleVisibilityLocked = true;
            vars.firstPick.classList.remove('active'); 
            vars.firstPick.classList.add('squareWrong');

            vars.secondPick.classList.remove('active'); 
            vars.secondPick.classList.add('squareWrong')
            vars.allSquaresArr[vars.firstPickIndex].childNodes[0].classList.remove('hidden');
            vars.secondPickTimeoutHolder.childNodes[0].classList.remove('hidden');

            setTimeout(()=>{
                vars.firstPickTimeoutHolder.classList.remove('squareSelected', 'squareWrong');
                vars.firstPickTimeoutHolder.classList.add('active');
                vars.firstPickTimeoutHolder.childNodes[0].classList.add('hidden');
                
                vars.secondPickTimeoutHolder.classList.remove('squareSelected', 'squareWrong');
                vars.secondPickTimeoutHolder.classList.add('active');
                vars.secondPickTimeoutHolder.childNodes[0].classList.add('hidden');

                vars.toggleVisibilityLocked = false;
            }, 600);

            vars.firstPick = undefined;
            vars.secondPick = undefined;
        }; 
    }
}

vars.startBtn.addEventListener('click', startTimeTrial);         //CONSIDER CHANGING THE NAME TO SOMETHING LESS CONFUSING.

//CONSIDER SEPARATING THE SETTIMEOUT INTO A SEPARATE FUNCTION WHICH IS CALLED WITH ARGUMENTS.
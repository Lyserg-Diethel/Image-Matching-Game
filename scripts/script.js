'use strict'
let numberOfLetters = document.querySelector('.startingLetters').value
const startBtn = document.querySelector('.startBtn');
const resetBtn = document.querySelector('.resetBtn');
const playingField = document.querySelector('.playingField');
let allSquares;
let allSquaresArr = [];
let lettersFound = 0;
const alphabet =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
let letterUses =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
let playingFieldArr;
let randomIndex = 0;
let indexModifier = 0;
let lettersPlaced = 0;
let letterUseCounter = 0;
let setLetterSucceeded = false;
let setLetterModeToggle = 'random';

function setLetter(letter){ /*Tries a random slot. If it's full, it repeatedly tries to set the letter in the adjescent index, until it finds one that's not taken.*/
    if(setLetterModeToggle === 'random') {
        indexModifier = (generateRandomNumber(0,playingFieldArr.length -1) - randomIndex); //BETWEEN 0 and the length - randomIndex;
        setLetterModeToggle = 'adjescent';
    }
    setLetterSucceeded = false;

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
                setLetter(letter);
            };
        };
    };
}

function setPlayingField(){
    firstPick = undefined;
    secondPick = undefined;
    playingField.innerHTML = ''; /*Deletes all tiles from a potential previous game.*/
    numberOfLetters = document.querySelector('.startingLetters').value;

    if ((numberOfLetters > 26) || (numberOfLetters <= 0) || ((numberOfLetters/numberOfLetters)!= 1) || ('' + numberOfLetters.length)>2) {
        alert("Please input a whole number between 1 and 26");
        return undefined;
    }
    playingFieldArr = new Array((+numberOfLetters)*2);
    playingFieldArr.fill('');
    letterUses.fill(0);

    function fillArr(){

        for(let i=0; i<=playingFieldArr.length-1; i+=1){ 

            indexModifier = 1;

            randomIndex = generateRandomNumber(0,playingFieldArr.length -1); //gives random index for the letter.
            if(letterUses[i] < 2){ //if the letter's been used less than 2 times.

                if(playingFieldArr[randomIndex] === ''){
                    playingFieldArr[randomIndex] = alphabet[i];
                    letterUses[i]+=1;
                }else if(playingFieldArr[randomIndex] !== ''){
                    setLetter(alphabet[i]);
                    letterUses[i]+=1; //still increment it, so long as the function sets it right.
                }
                if(letterUses[i] < 2){  /*if the current letter hasn't been set twice, make 'i' target the same letter again.*/
                    i-=1;
                };
            }
        }
        lettersPlaced+=1;
    }
    fillArr();
    buildGUI();   
}
startBtn.addEventListener('click', startTimeTrial);         //CONSIDER CHANGING THE NAME TO SOMETHING LESS CONFUSING.

function generateRandomNumber(start,end){ //includes start and end numbers.
    let randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;    
    return randomNumber;
}
/*
Makes 4-5-square container and fills it with 5 letter-boxes.
When its' full, it loops to make another square container div and append the next letter-holders to it.
Keeps going till all the letters in the array have been assigned to letter-holders.
*/

function buildGUI(){ 
    let arrayProgress = 0;
    let containerHolder = [];
    let contaierDivHolder;
    let squareHolder;
    let spanHolder;
    let containerDivHolder;
    allSquaresArr = [];
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

        playingField.appendChild(containerDivHolder);
    }
    allSquares = document.querySelectorAll('.square');
    
    for(let i=0;i<allSquares.length;i+=1){
        allSquaresArr.push(allSquares[i]);
    };
    for(let q=0; q<allSquares.length; q+=1){
        allSquares[q].addEventListener('click', toggleVisibility);
    };
}

let firstPick;
let firstPickTextContent;
let firstPickIndex;
let secondPick;
let secondPickTextContent;
let secondPickIndex;
let toggleVisibilityLocked = false;
let firstPickTimeoutHolder;
let secondPickTimeoutHolder;
function toggleVisibility(){
    if(toggleVisibilityLocked === true){
        return undefined;
    }
    if(firstPick === undefined){    //if you're selecting a first tile.
        firstPick = this;
        firstPick.classList.add('squareSelected');
        firstPick.classList.remove('active');
        firstPickTextContent = this.childNodes[0].textContent;
        firstPickIndex = allSquaresArr.indexOf(this);
        firstPickTimeoutHolder = allSquaresArr[firstPickIndex];

    }else if((firstPick !== undefined) && (secondPick === undefined)){ //if you're selecting a second tile.
        secondPick = this;
        secondPickTextContent = this.childNodes[0].textContent;
        secondPickIndex = allSquaresArr.indexOf(this);
        secondPickTimeoutHolder = allSquaresArr[secondPickIndex];
        if((firstPickTextContent === secondPickTextContent) &&(firstPick !== secondPick)){
            console.log('Found 2 of a kind!');
            lettersFound+=1;        /*Counts until all letters are found, so it can alert() the end-game.*/

            /*give the matching elements a green background, make the letters visible, block further tile animations.*/
            for(let x = 0; x<allSquares.length; x+=1){ 
                if(allSquares[x].childNodes[0].textContent === firstPickTextContent){
                    allSquares[x].classList.add('squareGuessed', 'guessedAnimation');
                    allSquares[x].classList.remove('active');
                    allSquares[x].childNodes[0].classList.remove('hidden');
                    allSquares[x].removeEventListener('click', toggleVisibility);
                }
            }
            if(+numberOfLetters === lettersFound){ /*If all the letters are found, congratulate the player.*/
                lettersFound = 0;
                alert('You win! Press the Start button again, if you wish to play more.')
            }

            firstPick = undefined;
            secondPick = undefined;

            }else{ /*Block interactions for a bit, make selected elements flash in red, show the letters, then fade them again.*/
            toggleVisibilityLocked = true;
            firstPick.classList.remove('active'); 
            firstPick.classList.add('squareWrong');

            secondPick.classList.remove('active'); 
            secondPick.classList.add('squareWrong')
            allSquaresArr[firstPickIndex].childNodes[0].classList.remove('hidden');
            secondPickTimeoutHolder.childNodes[0].classList.remove('hidden');

            setTimeout(()=>{
                firstPickTimeoutHolder.classList.remove('squareSelected', 'squareWrong');
                firstPickTimeoutHolder.classList.add('active');
                firstPickTimeoutHolder.childNodes[0].classList.add('hidden');
                
                secondPickTimeoutHolder.classList.remove('squareSelected', 'squareWrong');
                secondPickTimeoutHolder.classList.add('active');
                secondPickTimeoutHolder.childNodes[0].classList.add('hidden');

                toggleVisibilityLocked = false;
            }, 600);

            firstPick = undefined;
            secondPick = undefined;
        }; 
    }
}
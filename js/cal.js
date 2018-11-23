var displayLimit = 10;

function enterDigit(e) {
    digit = e.getAttribute('id');
    var span;
    var display = checkDisplay('data');
    if(display.querySelector('.answer')) {
        displayClear();
    }
    var numDigit = document.querySelectorAll('div.display > span.num').length;
    if( document.querySelector('#zero') && digit!=0 ){
        display.innerHTML = '';
    }
    if ( numDigit < displayLimit && ( ( (digit=='0')&&(numDigit>0) ) || digit!='0' ) ) {
        digitSpan  = document.createElement('span');
        digitSpan.innerHTML = digit;
        digitSpan.classList.add('num');
        if (display.querySelector('.dec')) {
            digitSpan.classList.add('float');
        } else {
            digitSpan.classList.add('int');
        }
        digitSpan.style.order = numDigit + 1;
        display.appendChild(digitSpan);
        spaceDisplay();
    }    
}
function spaceDisplay() {
    var display = document.querySelector('.display');
    var spacers = display.querySelectorAll('.spacer');
    if (spacers.length > 0) {
        for(i=0;i<spacers.length;i++){
            display.removeChild(spacers[i]);
        }
    }
    var intDigit = display.querySelectorAll('.int').length;
    if ( (intDigit)>3 ) {
        numSpacer = Math.floor((intDigit-1)/3);
        for(i=0;i<numSpacer;i++){
            spacerSpan = document.createElement('span');
            spacerSpan.innerHTML = ',';
            spacerSpan.classList.add('spacer');
            spacerSpan.style.order = (intDigit - 3 ) - ( i * 3);
            display.appendChild(spacerSpan);
        }
    }
}
function enterDec() {
    var display = checkDisplay('data');
    var decSpan;
    var numDigit = display.querySelectorAll('.num').length;
    if( document.querySelector('#zero') ) {
        display.innerHTML = '';
        var zeroSpan = document.createElement('span');
        zeroSpan.innerHTML = '0';
        zeroSpan.classList.add('num', 'int');
        zeroSpan.style.order = 1;
        decSpan = document.createElement('span');
        decSpan.innerHTML = '.';
        decSpan.classList.add('dec');
        decSpan.style.order = 1;
        display.appendChild(zeroSpan);
        display.appendChild(decSpan);
    } else if ( !(display.querySelector('.dec')) && numDigit < displayLimit ) {
        var intDigit = display.querySelectorAll('.int').length;
        decSpan = document.createElement('span');
        decSpan.innerHTML = '.';
        decSpan.classList.add('dec');
        decSpan.style.order = intDigit;
        display.appendChild(decSpan);
    }
}
function enterSign() {
    var display= checkDisplay('data');
    var numDigit = document.querySelectorAll('.num').length;
    if (numDigit>0) {
        var signSpan = display.querySelector('.sign');
        if (signSpan) {
            display.removeChild(signSpan);
        } else {
            signSpan = document.createElement('span');
            signSpan.style.order = 0;
            signSpan.classList.add('sign');
            signSpan.innerHTML = '-'; 
            display.insertBefore(signSpan, display.firstChild);
        }
    }
}
function displayClear() {
    var display = document.querySelector('.display');
    if( display.querySelector('#zero') ) {
        var currentOp = document.querySelector('#current');
        if(currentOp) {currentOp.parentNode.removeChild(currentOp);}
    } else {
        var numDigit = display.querySelectorAll('.num').length;
        var lastAnswer = document.querySelector('.lastAn');
        if(lastAnswer) {
            lastAnswer.classList.remove('lastAn');
        }
        if (numDigit > 0) {
            var zero = document.createElement('span');
            zero.id = 'zero';
            zero.innerHTML = '0';
            display.innerHTML = '';
            display.appendChild(zero);
        } else if (document.querySelector('#error')) {
            var zero = document.createElement('span');
            zero.id = 'zero';
            zero.innerHTML = '0';
            display.innerHTML = '';
            display.appendChild(zero);
        }
    }
    
}
function enterBs() {
    var display = document.querySelector('.display');
    var numDigit = display.querySelectorAll('.num').length;
    if (numDigit > 0) {
        if (numDigit == 1) {
            displayClear();
        } else {
            var digits = display.querySelectorAll('.num, .dec');
            display.removeChild(digits[digits.length-1]);
            spaceDisplay();
        }
    }
}
function readDisplay() {
    var display = document.querySelector('.display');
    if (display.querySelector('#zero')) {
        return 0;
    } else {
        var spacers = display.querySelectorAll('.spacer');
        if (spacers.length > 0) {
            for(i=0;i<spacers.length;i++){
                display.removeChild(spacers[i]);
            }
        }
        return display.textContent;
    }
}
function operate(e) {
    var memory = document.querySelector('.memory');
    var currentOp = memory.querySelector('#current');
    if (currentOp) {
        if(currentOp.querySelector('.op')) {
            if(calculate()) {
                operate(e);
            } else {
                return false;
            }
        } else {
            var opSpan = document.createElement('span');
            opSpan.classList.add('op');
            opSpan.id = e.id;
            opSpan.innerHTML = e.textContent;
            currentOp.appendChild(opSpan);
            enterClear();
        }
    } else if(!(document.querySelector('#zero')) && !(document.querySelector('#error')) ) {
        var lastAnswer = document.querySelector('.lastAn');
        if(lastAnswer) {
            lastAnswer.classList.remove('lastAn');
        }

        currentOp = document.createElement('div');
        currentOp.classList.add('workOp');
        currentOp.id = 'current';
        numSpan = document.createElement('span');
        numSpan.classList.add('num');
        numSpan.innerHTML = readDisplay();
        opSpan = document.createElement('span');
        opSpan.classList.add('op');
        opSpan.id = e.id;
        opSpan.innerHTML = e.textContent;
        currentOp.appendChild(numSpan);
        currentOp.appendChild(opSpan);
        memory.appendChild(currentOp);
        displayClear();
    }
}
function displayAnswer(answer) {
    var display = document.querySelector('.display');
    answer = Number(answer);
    if ( answer > Math.pow(10, displayLimit) ) {
        displayError('Too Many Digits');
    } else if ( answer < ( -1 * Math.pow(10, displayLimit) ) ) {
        displayError('Too Many Digits');
    } else {
        var anSpan = document.createElement('span');
        anSpan.classList.add('answer', 'num');
        answer = answer.toString();
        
        var spanLimit = displayLimit;
        if (answer.search('-') >= 0) {
            spanLimit++;
        }
        if (answer.search('.')) {
            spanLimit++;
        }
        if (answer.length < spanLimit) {
            anSpan.innerHTML = answer;
        } else {
            anSpan.innerHTML = answer.slice(0, (spanLimit));
        }
        display.innerHTML = '';
        display.appendChild(anSpan);
    }  
}
function displayError(e) {
    var display = document.querySelector('.display');
    var errorSpan = document.createElement('span');
    errorSpan.setAttribute('id', 'error');
    errorSpan.innerHTML = e;
    display.innerHTML = '';
    display.appendChild(errorSpan);
}
function calculate() {
    var display = checkDisplay('calculate');
    var currentOp = document.querySelector('#current');
    if (currentOp) {
        if (display.querySelector('#zero')) {
            return false;
        } else {
            var lastAnswer = document.querySelector('.lastAn');
            if(lastAnswer) {
                lastAnswer.classList.remove('lastAn');
            }

            var op = currentOp.querySelector('.op');
            var input1 = Number(currentOp.querySelector('.num').textContent);
            var input2 = Number(readDisplay());
            var eqSpan = document.createElement('span');
            eqSpan.classList.add('eq');
            eqSpan.innerHTML = '=';
            var num2Span = document.createElement('span');
            num2Span.classList.add('num');
            num2Span.innerHTML = input2;
            var anSpan = document.createElement('span');
            anSpan.classList.add('an');
            anSpan.classList.add('lastAn');
            var answer;
            if (op.id == 'ad') {
                answer = input1 + input2;
                anSpan.innerHTML = answer;
                displayAnswer(answer);
            }
            if (op.id == 'sb') {
                answer = input1 - input2;
                anSpan.innerHTML = answer;
                displayAnswer(answer);
            }
            if(op.id == 'ml') {
                answer = input1 * input2;
                anSpan.innerHTML = answer;
                displayAnswer(answer);
            }
            if(op.id == 'dv') {
                if(input2==0) {
                    displayClear();
                    document.querySelector('.memory').removeChild(currentOp);
                    currentOp = null;
                    displayError('Indeterminate');
                }
                else {
                    answer = input1 / input2;
                    anSpan.innerHTML = answer;
                    displayAnswer(answer);
                }
            }
            anSpan.setAttribute('onclick', 'recallMemory(this)');
            currentOp.appendChild(num2Span);
            currentOp.appendChild(eqSpan);
            currentOp.appendChild(anSpan);
            currentOp.removeAttribute('id');
        }
    }
}
function checkDisplay(source) {
    var display = document.querySelector('.display');
    if( display.querySelector('#error') && source != 'clear' ) {
        display = null;
    }
    return display;
}
function openMemory() {
    displayClear();
    var memory = document.querySelector('.memoryContainer');
    memory.classList.add('open');
}
function closeMemory() {
    var memory = document.querySelector('.memoryContainer');
    memory.classList.remove('open');
}
function clearMemory() {
    var memory = document.querySelector('.memory');
    memory.innerHTML = '';
}
function recallMemory(answer) {
    var lastAnswer = document.querySelector('.lastAn');
    if(lastAnswer) {
        lastAnswer.classList.remove('lastAn');
    }

    displayAnswer(answer.textContent);
    closeMemory();
}
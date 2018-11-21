function enterDigit(e) {
    digit = e.getAttribute('id');
    var span;
    var display = document.querySelector('.display');;
    var displayLimit = 10;
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
    var display = document.querySelector('.display');
    var decSpan;
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
    } else if ( !(display.querySelector('.dec')) ) {
        var intDigit = display.querySelectorAll('.int').length;
        decSpan = document.createElement('span');
        decSpan.innerHTML = '.';
        decSpan.classList.add('dec');
        decSpan.style.order = intDigit;
        display.appendChild(decSpan);
    }
}
function enterSign() {
    var display = document.querySelector('.display');
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
function enterClear() {
    var display = document.querySelector('.display');
    var numDigit = display.querySelectorAll('.num').length;
    if (numDigit > 0) {
        var zero = document.createElement('span');
        zero.id = 'zero';
        zero.innerHTML = '0';
        display.innerHTML = '';
        display.appendChild(zero);
    }
}
function enterBs() {
    var display = document.querySelector('.display');
    var numDigit = display.querySelectorAll('.num').length;
    if (numDigit > 0) {
        if (numDigit == 1) {
            enterClear();
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
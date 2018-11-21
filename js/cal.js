function enterDigit(e) {
    digit = e.getAttribute('id');
    var span;
    var display;
    var displayLimit = 10;
    var numDigit = document.querySelectorAll('div.display > span.num').length;
    if( document.querySelector('#zero') && digit!=0 ){
        display = document.querySelector('.display');
        display.innerHTML = '';
    }
    if ( numDigit < displayLimit && ( ( (digit=='0')&&(numDigit>0) ) || digit!='0' ) ) {
        digitSpan  = document.createElement('span');
        digitSpan.innerHTML = digit;
        digitSpan.classList.add('num');
        digitSpan.style.order = numDigit + 1;
        display = document.querySelector('.display');
        display.appendChild(digitSpan);
        var spacers = display.querySelectorAll('.spacer');
        if (spacers.length > 0) {
            for(i=0;i<spacers.length;i++){
                display.removeChild(spacers[i]);
            }
        }
        if ( (numDigit+1)>3 ) {
            numSpacer = Math.floor(numDigit/3);
            for(i=0;i<numSpacer;i++){
                spacerSpan = document.createElement('span');
                spacerSpan.innerHTML = ',';
                spacerSpan.classList.add('spacer');
                spacerSpan.style.order = (numDigit - 2 ) - ( i * 3);
                display.appendChild(spacerSpan);
            }
        }
    }    
}
function enterSign() {

}
function enterClear() {
    
}
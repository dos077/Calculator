const displayLimit = 10;

class htmlSpan {
    constructor(content, styleClass, id) {
        this.element = document.createElement('span');
        if(id) { this.element.id = id; }
        this.element.classList.add(styleClass);
        this.element.innerHTML = content;
    }
}

class Display {
    constructor() {
        this.element = document.querySelector('.display');
    }
    read() {
        var results = {
            value: this.element.textContent.replace(/,/g,''),
            length: this.element.querySelectorAll('.num').length,
            error: this.element.querySelector('.error'),
            zero: this.element.querySelector('#zero'),
            float: this.element.querySelector('.dec'),
            answer: this.element.querySelector('.answer')
        };
        return results;
    }
    clear() {
        var zero = new htmlSpan('0', 'zero', 'zero');
        this.element.innerHTML = '';
        this.element.appendChild(zero.element);
    }
    add(digit, styleClass) {
        var digitSpan = new htmlSpan(digit, 'num');
        if(styleClass) {digitSpan.element.classList.add(styleClass)}
        if(this.element.querySelector('.dec')) { digitSpan.element.classList.add('float'); }
        else { digitSpan.element.classList.add('int'); }
        digitSpan.element.style.order = this.element.querySelectorAll('.num').length + 1;
        this.element.appendChild(digitSpan.element);
    }
    enterFloat() {
        var decSpan = new htmlSpan('.', 'dec');
        decSpan.element.style.order = this.read().length;
        this.element.appendChild(decSpan.element);
    }
    changeSign() {
        var signSpan = this.element.querySelector('.sign');
        if(signSpan) {
            this.element.removeChild(signSpan);
        } else {
            signSpan = new htmlSpan('-', 'sign');
            this.element.insertBefore(signSpan.element, this.element.firstChild);
        }
    }
    back(){
        var digits = this.element.querySelectorAll('.num, .dec');
        this.element.removeChild(digits[digits.length-1]);
    }
    error(message) {
        this.element.innerHTML = '';
        var errorSpan = new htmlSpan(message, 'error', 'error');
        this.element.appendChild(errorSpan.element);
    }
}

class Memory {
    constructor() {
        this.element = document.querySelector('.memory');
        this.lastAnswer = this.element.querySelector('.lastAn');
    }
    clear() { this.element.innerHTML = ''; }
    open() { this.element.parentNode.classList.add('open'); }
    close() { this.element.parentNode.classList.remove('open'); }
    answer(which) {
        if(which == 'last') {
            return this.element.lastChild.querySelector('.an').textContent;
        } else {
            var answers = this.element.querySelectorAll('.an');
            return answers[which].textContent;
        }
    }
    update() {
        if(this.lastAnswer) {
            this.lastAnswer.classList.remove('lastAn');
        }
    }
}

class CurrentMemory {
    constructor() {
        this.element = document.getElementById('current');
    }
    read() {
        if(this.element) {
            var results = {
                input1: this.element.querySelector('.num').textContent,
                operation: this.element.querySelector('.op').id
            }
        return results; }
    }
    add(input1, operation, opId) {
        if(!this.element) {
        var current = new htmlSpan('','workOp','current');
        var inputSpan = new htmlSpan(input1, 'num');
        var opSpan = new htmlSpan(operation, 'op', opId);
        current.element.appendChild(inputSpan.element);
        current.element.appendChild(opSpan.element);
        document.querySelector('.memory').appendChild(current.element);
        this.element = document.getElementById('current'); }
    }
    remove() {
        this.element.parentNode.removeChild(this.element);
    }
    archive(input2, answer) {
        var eqSpan = new htmlSpan('=','eq');
        var numSpan = new htmlSpan(input2, 'num');
        var anSpan = new htmlSpan(answer, 'an');
        anSpan.element.setAttribute('onclick','recall(this)');
        anSpan.element.classList.add('lastAn');
        this.element.appendChild(numSpan.element);
        this.element.appendChild(eqSpan.element);
        this.element.appendChild(anSpan.element);
        this.element.removeAttribute('id');
    }
}

class Button {
    constructor(id, group) {
       this.id = id;
       this.group = '.' + group;
       this.controls = document.querySelector('.controls');
    }
    pressed() {
        this.controls.querySelectorAll(this.group).forEach( function(each){ each.classList.remove('active');  })
        pressButton(this.id);
    }
    final() {
        pressButton(this.id);
        setTimeout( function() {
            document.querySelectorAll('.button').forEach( function(each){ each.classList.remove('active');  }) }
        , 500 );
    }
}

function pressButton(id) { setTimeout( function(){document.getElementById(id).classList.add('active');}, 100 ); }

function spaceDisplay() {
    var display = new Display();
    var spacers = display.element.querySelectorAll('.spacer');
    if (spacers.length > 0) {
        for(i=0;i<spacers.length;i++){
            display.element.removeChild(spacers[i]);
        }
    }
    var intDigit = display.element.querySelectorAll('.int').length;
    if ( (intDigit)>3 ) {
        numSpacer = Math.floor((intDigit-1)/3);
        for(i=0;i<numSpacer;i++){
            spacerSpan = new htmlSpan(',','spacer');
            spacerSpan.element.style.order = (intDigit - 3 ) - ( i * 3);
            display.element.appendChild(spacerSpan.element);
        }
    }
}

function enterDigit(e) {
    var display = new Display();
    var status = display.read();
    var digit = e.id;
    if(!status.error) {
        if(status.zero && e!=0 || status.answer) {
            display.element.innerHTML = '';
            var memory = new Memory().update();
        }
        if( status.length < displayLimit && ( e!=0 || status.length>0 ) ) {
            display.add(digit);
            spaceDisplay();
        }
    }
}

function enterDec() {
    var display = new Display();
    var status = display.read();
    if(!status.error && !status.float) {
        if(status.zero) {
            display.element.innerHTML = '';
            display.add('0');
        }
        display.enterFloat();
    }
}

function enterSign() {
    var display = new Display();
    var status = display.read();
    if (!status.error && !status.answer && !status.zero) {
        display.changeSign();
    }
}

function enterClear() {
    var display = new Display();
    var status = display.read();
    if(!status.zero){ 
        display.clear();
        if(status.answer || status.error) {
            new Memory().update();
        }
    }
    else {
        var current = new CurrentMemory();
        if( current.read() ) { current.remove(); }
    }
}

function enterBs() {
    var display = new Display();
    var status = display.read();
    if(!status.error) {
        if(status.length > 1) { display.back(); }
        else { display.clear(); }
    }
}
function operate(e) {
    var display = new Display();
    var status = display.read();
    if(!status.error && !status.zero) {
        var currentOp = new CurrentMemory();
        if(currentOp.read()) {
            calculate();
        }
        var memory = new Memory();
        memory.update();
        var newOp = new CurrentMemory();
        newOp.add(display.read().value, e.textContent, e.id);
        display.clear();
    }
}
function calculate() {
    var display = new Display();
    var status = new Display().read();
    if(!status.error && !status.zero) {
        var input1;
        var operation;
        var currentOp = new CurrentMemory();
        if( currentOp.read() ) {
            input1 = Number(currentOp.read().input1);
            operation = currentOp.read().operation;
        } else if (!status.answer) {
            // auto add function
            var lastAnswer = new Memory().answer('last');
            if(lastAnswer) {
                input1 = Number(lastAnswer);
                operation = 'ad';
                currentOp.add(input1,'+','ad');
            }
        }
        if(input1 && operation) {
            var memory = new Memory();
            memory.update;
            var input2 = Number(display.read().value);
            var answer;
            switch(operation) {
                case 'ad':
                answer = input1 + input2;
                break;
                case 'sb':
                answer = input1 - input2;
                break;
                case 'ml':
                answer = input1 * input2;
                break;
                case 'dv':
                answer = input1 / input2;
                break;
            }
            if(isNaN(answer) || !isFinite(answer)) {
                display.error(answer);
                currentOp.remove();
            } else {
                currentOp.archive(input2, answer);
                enterAnswer(answer);
            }
        }
    }
}

function enterAnswer(answer){
    var display = new Display();
    var maxAnswer = Math.pow(10, displayLimit);
    if ( answer > maxAnswer || answer < ( -1 * maxAnswer) ) { display.error('Too Many Digits') }
    else {
        display.element.innerHTML = '';
        answer = answer.toString();
        displayString = answer.split('');
        for(i=0;i<displayString.length;i++) {
            digit = displayString[i];
            realLimit = displayLimit;
            if(digit == '-') {
                display.changeSign();
                realLimit++;
            } else if(digit == '.') {
                display.enterFloat();
                realLimit++;
            } else {
                if(i<realLimit) { display.add(digit, 'answer'); }
            }
        }
        spaceDisplay();
    }
}
function closeMemory() {
    new Memory().close();
}
function openMemory() {
    var memory = new Memory(); memory.update(); memory.open();
}
function recall(answer) {
    var memory = new Memory();
    memory.update();
    enterAnswer(answer.textContent);
    memory.close();
}
function clearMemory() {
    new Memory().clear();
}

document.addEventListener('keydown', function(e){
    var key = e.key;
    if (e.which == 13 || key == '=') { calculate(); new Button('eq').final(); }
    else if (e.which == 8) { enterBs(); new Button('bs').final(); }
    else if (Number(key) % 1 === 0) {
        var digit = {}; digit.id = key;
        enterDigit( digit );
        new Button(key, 'white').pressed();
    }
    else if (key == 'c') {enterClear(); new Button('c').final(); }
    else if (key == 'm') {openMemory(); new Button('mem').final(); }
    else if (key == '.') {enterDec(); new Button('dec').final(); }
    else {
        var button = {};
        button.textContent = key;
        if (key == '+') { button.id = 'ad'; }
        if (key == '-') { button.id = 'sb'; }
        if (key == '*') { button.id = 'ml'; }
        if (key == '/') { button.id = 'dv'; }
        new Button(button.id, 'black').pressed();
        operate(button);
    }
})
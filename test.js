'use strict'

const Base = class Base {
    say() {
        console.log('bark');
    }
}

class One extends Base {
    say() {
        console.log('mew');
    }
}

var first = new Base();
var second = new One();

first.say();
second.say();

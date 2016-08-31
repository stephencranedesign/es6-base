import { Calculator } from './Calc';
var calc = new Calculator('test');
function add(a, b) {
    return calc.add(a, b);
}
console.log('from type-script.js: ', add(2, 3));

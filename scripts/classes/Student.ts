import { Calculator } from './Calc';

const calc = new Calculator('test');

console.log(calc.add(5,2));

export class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}
import { Calculator } from './Calc';
const calc = new Calculator('test');
console.log(calc.add(5, 2));
export class Student {
    constructor(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

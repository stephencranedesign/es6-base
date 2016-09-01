import { Student } from '../classes/Student';
import { Calculator } from '../classes/Calc';

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

console.log('from type-script.js: ', greeter(user));
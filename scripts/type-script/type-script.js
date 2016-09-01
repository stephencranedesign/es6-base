import { Student } from '../classes/Student';
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
var user = new Student("Jane", "M.", "User");
console.log('from type-script.js: ', greeter(user));

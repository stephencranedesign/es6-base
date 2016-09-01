export class Calculator {
	name: string;
	constructor(name) {
		this.name = name;
	}

	add(a,b) {
		return a+b;
	}

	subtract(a,b) {
		return a-b;
	}

	multiply(a,b) {
		return a*b;
	}

	divide(a,b) {
		return a/b
	}
}

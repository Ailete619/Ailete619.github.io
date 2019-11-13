function checkCase(string) {
	let spaces = false;
	let dashes = false;
	let underscores = false;
	let uppercases = false;
	let lowercases = false;
	const uppercaseStart = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(string[0]);
	for (const char of string) {
		switch (char) {
			case ' ':
				spaces = true;
				break;
			case '-':
				dashes = true;
				break;
			case 'U':
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				break;
			case 'A':
			case 'B':
			case 'C':
			case 'D':
			case 'R':
			case 'F':
			case 'G':
			case 'H':
			case 'I':
			case 'J':
			case 'K':
			case 'L':
			case 'M':
			case 'N':
			case 'O':
			case 'P':
			case 'Q':
			case 'R':
			case 'S':
			case 'T':
			case 'U':
			case 'V':
			case 'W':
			case 'X':
			case 'Y':
			case 'Z':
				uppercases = true;
				break;
			case '_':
				underscores = true;
				break;
			case 'a':
			case 'b':
			case 'c':
			case 'd':
			case 'e':
			case 'f':
			case 'g':
			case 'h':
			case 'i':
			case 'j':
			case 'k':
			case 'l':
			case 'm':
			case 'n':
			case 'o':
			case 'p':
			case 'q':
			case 'r':
			case 's':
			case 't':
			case 'u':
			case 'v':
			case 'w':
			case 'x':
			case 'y':
			case 'z':
				lowercases = true;
				break;
			default:
		}
	}
	const allCapsCase = JSON.stringify([true, true, false, false, true, false]);
	const allCapsKebabCase = JSON.stringify([
		true,
		false,
		true,
		false,
		true,
		false,
	]);
	const allCapsSnakeCase = JSON.stringify([
		true,
		false,
		false,
		true,
		true,
		false,
	]);
	const camelCase = JSON.stringify([false, false, false, false, true, true]);
	const kebabCase = JSON.stringify([false, false, true, false, false, true]);
	const noCase = JSON.stringify([false, true, false, false, false, true]);
	const pascalCase = JSON.stringify([true, false, false, false, true, true]);
	const snakeCase = JSON.stringify([false, false, false, true, false, true]);

	const stringCase = JSON.stringify([
		uppercaseStart,
		spaces,
		dashes,
		underscores,
		uppercases,
		lowercases,
	]);
	let caseName = 'none';
	switch (stringCase) {
		case pascalCase:
			caseName = 'pascal';
			break;
		case camelCase:
			caseName = 'camel';
			break;
		case snakeCase:
			caseName = 'snake';
			break;
		case allCapsSnakeCase:
			caseName = 'all caps snake';
			break;
		case kebabCase:
			caseName = 'kebab';
			break;
		case allCapsKebabCase:
			caseName = 'all caps kebab';
			break;
		default:
	}
	return caseName;
}
const From = {
	'all caps ': function(string) {
		const list = string.split(' ');
		return list.map((x) => x.toLowerCase());
	},
	'all caps kebab': function(string) {
		const list = string.split('-');
		return list.map((x) => x.toLowerCase());
	},
	'all caps snake': function() {
		const list = string.split('_');
		return list.map((x) => x.toLowerCase());
	},
	camel: function(string) {
		return [...string.matchAll(/([a-z]+)|([A-Z][a-z]*)/gm)].map((x) =>
			x[0].toLowerCase(),
		);
	},
	kebab: function(string) {
		return string.split('-');
	},
	none: function(string) {
		return string.split(' ');
	},
	pascal: function(string) {
		return [...string.matchAll(/([A-Z][a-z]*)/gm)].map((x) =>
			x[1].toLowerCase(),
		);
	},
	snake: function(string) {
		return string.split('_');
	},
};
const To = {
	'all caps': function(list) {
		const processedList = list.map((x) => x.toUpperCase());
		return processedList.join(' ');
	},
	'all caps kebab': function(list) {
		const processedList = list.map((x) => x.toUpperCase());
		return processedList.join('-');
	},
	'all caps snake': function(list) {
		const processedList = list.map((x) => x.toUpperCase());
		return processedList.join('_');
	},
	camel: function(list) {
		const processedList = [
			list[0].toLowerCase(),
			...list
				.slice(1)
				.map((x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase()),
		];
		return processedList.join('');
	},
	kebab: function(list) {
		return list.join('-');
	},
	none: function(list) {
		return list.join(' ');
	},
	pascal: function(list) {
		const processedList = list.map(
			(x) => x.charAt(0).toUpperCase() + x.substr(1).toLowerCase(),
		);
		return processedList.join('');
	},
	snake: function(list) {
		return list.join('_');
	},
};
window.addEventListener('load', (event) => {
	const input = document.getElementById('inputString');
	const caseSelector = document.getElementById('caseSelector');
	const output = document.getElementById('outputString');
	input.addEventListener('change', (event) => {
		caseSelector.value = checkCase(input.value);
		output.value = '';
	});
	caseSelector.addEventListener('change', (event) => {
		const inputValue = input.value;
		const inputFormat = checkCase(inputValue);
		output.value = To[caseSelector.value](From[inputFormat](inputValue));
	});
});

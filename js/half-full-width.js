function checkWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	const fullWidth = Object.values(halfToFull);
	let half = 0;
	let full = 0;
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			half += 1;
		} else if (fullWidth.includes(char)) {
			full += 1;
		} else {
		}
	}
	if (half > 0 && full === 0) {
		return 'half';
	} else if (half === 0 && full > 0) {
		return 'full';
	} else {
		return 'both';
	}
}
function toHalfWidth(inputText) {
	const fullWidth = Object.values(halfToFull);
	let outputText = '';
	for (const char of inputText) {
		if (fullWidth.includes(char)) {
			outputText += fullToHalf[char];
		} else {
			outputText += char;
		}
	}
	return outputText;
}
function toFullWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	let outputText = '';
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			outputText += halfToFull[char];
		} else {
			outputText += char;
		}
	}
	return outputText;
}
function invertWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	const fullWidth = Object.values(halfToFull);
	let outputText = '';
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			outputText += halfToFull[char];
		} else if (fullWidth.includes(char)) {
			outputText += fullToHalf[char];
		} else {
			outputText += char;
		}
	}
	return outputText;
}
const halfToFull = {
	' ': '　',
	'!': '！',
	'"': '＂',
	$: '＃',
	$: '＄',
	'%': '％',
	'&': '＆',
	"'": '＇',
	'(': '（',
	')': '）',
	'*': '＊',
	'+': '＋',
	',': '，',
	'-': '－',
	'.': '．',
	'/': '／',
	'0': '０',
	'1': '１',
	'2': '２',
	'3': '３',
	'4': '４',
	'5': '５',
	'6': '６',
	'7': '７',
	'8': '８',
	'9': '９',
	':': '：',
	';': '；',
	'<': '＜',
	'=': '＝',
	'>': '＞',
	'?': '？',
	'@': '＠',
	A: 'Ａ',
	B: 'Ｂ',
	C: 'Ｃ',
	D: 'Ｄ',
	E: 'Ｅ',
	F: 'Ｆ',
	G: 'Ｇ',
	H: 'Ｈ',
	I: 'Ｉ',
	J: 'Ｊ',
	K: 'Ｋ',
	L: 'Ｌ',
	M: 'Ｍ',
	N: 'Ｎ',
	O: 'Ｏ',
	P: 'Ｐ',
	Q: 'Ｑ',
	R: 'Ｒ',
	S: 'Ｓ',
	T: 'Ｔ',
	U: 'Ｕ',
	V: 'Ｖ',
	W: 'Ｗ',
	X: 'Ｘ',
	Y: 'Ｙ',
	Z: 'Ｚ',
	'[': '［',
	'\\': '＼',
	']': '］',
	'^': '＾',
	_: '＿',
	'`': '｀',
	a: 'ａ',
	b: 'ｂ',
	c: 'ｃ',
	d: 'ｄ',
	e: 'ｅ',
	f: 'ｆ',
	g: 'ｇ',
	h: 'ｈ',
	i: 'ｉ',
	j: 'ｊ',
	k: 'ｋ',
	l: 'ｌ',
	m: 'ｍ',
	n: 'ｎ',
	o: 'ｏ',
	p: 'ｐ',
	q: 'ｑ',
	r: 'ｒ',
	s: 'ｓ',
	t: 'ｔ',
	u: 'ｕ',
	v: 'ｖ',
	w: 'ｗ',
	x: 'ｘ',
	y: 'ｙ',
	z: 'ｚ',
	'{': '｛',
	'|': '｜',
	'}': '｝',
	'~': '～',
	'｡': '。',
	'｢': '「',
	'｣': '」',
	'､': '、',
	'･': '・',
	ｦ: 'ヲ',
	ｧ: 'ァ',
	ｨ: 'ィ',
	ｩ: 'ゥ',
	ｪ: 'ェ',
	ｫ: 'ォ',
	ｬ: 'ャ',
	ｭ: 'ュ',
	ｮ: 'ョ',
	ｯ: 'ッ',
	ｰ: 'ー',
	ｱ: 'ア',
	ｲ: 'イ',
	ｳ: 'ウ',
	ｴ: 'エ',
	ｵ: 'オ',
	ｶ: 'カ',
	ｶﾞ: 'ガ',
	ｷ: 'キ',
	ｷﾞ: 'ギ',
	ｸ: 'ク',
	ｸﾞ: 'グ',
	ｹ: 'ケ',
	ｹﾞ: 'ゲ',
	ｺ: 'コ',
	ｺﾞ: 'ゴ',
	ｻ: 'サ',
	ｻﾞ: 'ザ',
	ｼ: 'シ',
	ｼﾞ: 'ジ',
	ｽ: 'ス',
	ｽﾞ: 'ズ',
	ｾ: 'セ',
	ｾﾞ: 'ゼ',
	ｿ: 'ソ',
	ｿﾞ: 'ゾ',
	ﾀ: 'タ',
	ﾀﾞ: 'ダ',
	ﾁ: 'チ',
	ﾁﾞ: 'ヂ',
	ﾂ: 'ツ',
	ﾂﾞ: 'ヅ',
	ﾃ: 'テ',
	ﾃﾞ: 'デ',
	ﾄ: 'ト',
	ﾄﾞ: 'ド',
	ﾅ: 'ナ',
	ﾆ: 'ニ',
	ﾇ: 'ヌ',
	ﾈ: 'ネ',
	ﾉ: 'ノ',
	ﾊ: 'ハ',
	ﾋ: 'ヒ',
	ﾌ: 'フ',
	ﾍ: 'ヘ',
	ﾎ: 'ホ',
	ﾏ: 'マ',
	ﾐ: 'ミ',
	ﾑ: 'ム',
	ﾒ: 'メ',
	ﾓ: 'モ',
	ﾔ: 'ヤ',
	ﾕ: 'ユ',
	ﾖ: 'ヨ',
	ﾗ: 'ラ',
	ﾘ: 'リ',
	ﾙ: 'ル',
	ﾚ: 'レ',
	ﾛ: 'ロ',
	ﾜ: 'ワ',
	ﾝ: 'ン',
	ﾞ: '゛',
	ﾟ: '゜',
	'': '￠',
	'': '￡',
	'': '￢',
	'': '￣',
	'': '￤',
	'¥': '￥',
	'': '￦',
	'￨': '',
	'￩': '',
	'￪': '',
	'￫': '',
	'￬': '',
	'￭': '■',
	'￮': '○',
};
const fullToHalf = {};
window.addEventListener('load', (event) => {
	const input = document.getElementById('inputText');
	const widthSelector = document.getElementById('widthSelector');
	const output = document.getElementById('outputText');
	const bothOption = document.createElement('option');
	bothOption.setAttribute('value', 'both');
	bothOption.innerText = '両方';
	const invertOption = document.createElement('option');
	invertOption.setAttribute('value', 'invert');
	invertOption.innerText = '逆にする';
	for (const key in halfToFull) {
		const value = halfToFull[key];
		fullToHalf[value] = key;
	}
	inputText.addEventListener('change', (event) => {
		const widthType = checkWidth(input.value);
		if (bothOption.parentNode === widthSelector) {
			widthSelector.removeChild(bothOption);
			widthSelector.removeChild(invertOption);
		}
		if (widthType === 'both') {
			widthSelector.appendChild(bothOption);
			widthSelector.appendChild(invertOption);
		}
		widthSelector.value = widthType;
		output.value = '';
	});
	widthSelector.addEventListener('change', (event) => {
		const inputValue = input.value;
		const inputFormat = checkWidth(inputValue);
		switch (widthSelector.value) {
			case 'half':
				output.value = toHalfWidth(inputValue);
				break;
			case 'full':
				output.value = toFullWidth(inputValue);
				break;
			case 'invert':
				output.value = invertWidth(inputValue);
				break;
			default:
		}
	});
});

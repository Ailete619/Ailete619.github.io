'use strict';

/**
 * <h1>Check if the source text contains half-width or full-width characters</h1>
 *
 * @param {string} inputText the text which composition is to be checked
 * @return	<em>'half'</em> if the source text contains <strong>only</strong> half-width characters<br>
 * 			or <em>'full'</em> if the source text contains <strong>only</strong> full-width characters<br>
 * 			or <em>'both'</em> if the source text contains <strong>both</strong> half-width <strong>and</strong> full-width characters.
 *
 * @author Loïc LE TEXIER
 * @since 2019-11-14
 */
function checkWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	const fullWidth = Object.values(halfToFull);
	// count the half-width and full-width characters
	let halfCount = 0;
	let fullCount = 0;
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			halfCount += 1;
		} else if (fullWidth.includes(char)) {
			fullCount += 1;
		} else {
		}
	}
	if (halfCount > 0 && fullCount === 0) {
		// the text conains only half-width characters
		return 'half';
	} else if (halfCount === 0 && fullCount > 0) {
		// the text conains only full-width characters
		return 'full';
	} else {
		// the text contains both half-width and full-width characters
		return 'both';
	}
}
/**
 * <h1>Convert full-width characters to half-width</h1>
 *
 * @param {string} inputText the text to convert
 * @return	the converted text
 *
 * @author Loïc LE TEXIER
 * @since 2019-11-14
 */
function toHalfWidth(inputText) {
	const fullWidth = Object.values(halfToFull);
	// convert the source text
	let outputText = '';
	for (const char of inputText) {
		if (fullWidth.includes(char)) {
			// copy converted full-width characters
			outputText += fullToHalf[char];
		} else {
			// simply copy other characters
			outputText += char;
		}
	}
	return outputText;
}
/**
 * <h1>Convert half-width characters to full-width</h1>
 *
 * @param {string} inputText the text to convert
 * @return	the converted text
 *
 * @author Loïc LE TEXIER
 * @since 2019-11-14
 */
function toFullWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	// convert the source text
	let outputText = '';
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			// copy converted half-width characters
			outputText += halfToFull[char];
		} else {
			// simply copy other characters
			outputText += char;
		}
	}
	return outputText;
}
/**
 * <h1>Convert full-width characters to half-width and half-width characters to full-width</h1>
 *
 * @param {string} inputText the text to convert
 * @return	the converted text
 *
 * @author Loïc LE TEXIER
 * @since 2019-11-14
 */
function invertWidth(inputText) {
	const halfWidth = Object.keys(halfToFull);
	const fullWidth = Object.values(halfToFull);
	// convert the source text
	let outputText = '';
	for (const char of inputText) {
		if (halfWidth.includes(char)) {
			// copy converted half-width characters
			outputText += halfToFull[char];
		} else if (fullWidth.includes(char)) {
			// copy converted full-width characters
			outputText += fullToHalf[char];
		} else {
			// simply copy other characters
			outputText += char;
		}
	}
	return outputText;
}
/*
 * the half-width to full-width dictionary
 */
const halfToFull = {
	' ': '　',
	'!': '！',
	'"': '＂',
	'#': '＃',
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
	ｳﾞ: 'ヴ',
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
	ﾊﾞ: 'バ',
	ﾊﾟ: 'パ',
	ﾋ: 'ヒ',
	ﾋﾞ: 'ビ',
	ﾋﾟ: 'ピ',
	ﾌ: 'フ',
	ﾌﾞ: 'ブ',
	ﾌﾟ: 'プ',
	ﾍ: 'ヘ',
	ﾍﾞ: 'ベ',
	ﾍﾟ: 'ペ',
	ﾎ: 'ホ',
	ﾎﾞ: 'ボ',
	ﾎﾟ: 'ポ',
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
	'¢': '￠',
	'£': '￡',
	'¬': '￢',
	'¯': '￣',
	'¦': '￤',
	'¥': '￥',
	'₩': '￦',
	'￨': '❘',
	'￩': '←',
	'￪': '↑',
	'￫': '→',
	'￬': '↓',
	'￭': '■',
	'￮': '○',
};
/*
 *  the full-width to half-width dictionary
 *
 *  the dictionary is filled with the data from the half-width to full-width dictionary
 */
const fullToHalf = {};
/*
 * the load event listener
 */
window.addEventListener('load', (event) => {
	/*
	 * UI elements
	 */
	const fromClipboard = document.getElementById('fromClipboard');
	const input = document.getElementById('inputText');
	const widthSelector = document.getElementById('widthSelector');
	const outputToInput = document.getElementById('outputToInput');
	const output = document.getElementById('outputText');
	const toClipboard = document.getElementById('toClipboard');
	/*
	 * Create the options available only when both half-width and full-width characters are present in the source text:
	 * - 'both'		: to indicate that both width characters are present
	 * - 'invert'	: to invert character widths
	 */
	const bothOption = document.createElement('option');
	bothOption.setAttribute('value', 'both');
	bothOption.innerText = '両方';
	const invertOption = document.createElement('option');
	invertOption.setAttribute('value', 'invert');
	invertOption.innerText = '逆にする';
	/*
	 * Create the full-width to half-width dictionary using data from the half-width to full-width dictionary
	 */
	for (const key in halfToFull) {
		const value = halfToFull[key];
		fullToHalf[value] = key;
	}
	/**
	 * <h1>Paste the clipboard content in the input field</h1>
	 */
	fromClipboard.addEventListener('click', (event) => {
		navigator.clipboard.readText().then((pasteText) => {
			input.value = pasteText;
		});
	});
	/**
	 * <h1></h1>
	 */
	inputText.addEventListener('change', (event) => {
		// get the type of the souce text
		const widthType = checkWidth(input.value);
		// hide the width options for type 'both' if they are visible
		if (bothOption.parentNode === widthSelector) {
			widthSelector.removeChild(bothOption);
			widthSelector.removeChild(invertOption);
		}
		// show the width options for type 'both'
		if (widthType === 'both') {
			widthSelector.appendChild(bothOption);
			widthSelector.appendChild(invertOption);
		}
		// init the character width selector and the output
		widthSelector.value = widthType;
		output.value = '';
	});
	/**
	 *
	 */
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
	/**
	 * <h1>Copy the output text in the input field</h1>
	 */
	outputToInput.addEventListener('click', (event) => {
		input.value = output.value;
	});
	/**
	 * <h1>Copy the output text to the clipboard</h1>
	 */
	toClipboard.addEventListener('click', (event) => {
		output.select();
		document.execCommand('copy');
	});
});

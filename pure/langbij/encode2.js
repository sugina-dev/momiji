"use strict";

// should have the three external functions: chr ord romanizeHangulChar

const japaneseCharDict = 'あいうえおかきくけこさしすせそたちつてとはひふへほなにぬねのまみむめもらりるれろがぎぐげござじずぜぞだぢづでどわやゆよ'.split('');

const japaneseVowelToKorean = ['u','ui',0,'uei','ue','iu','i','ia','io','ie','eui','ai','a',1,'eu','oai','oi','oa','o',2,'iei','ei',3,'iai','e'];

function japaneseCharDualToCode(ch1, ch2) {
	// Calculate ch1
	const x1 = japaneseCharDict.indexOf(ch1); console.assert(x1 >= 0);
	const consonant1 = x1 / 5 | 0, vowel1 = x1 % 5;

	if (ch2) {
		// Calculate ch2
		const x2 = japaneseCharDict.indexOf(ch2); console.assert(x2 >= 0);
		const consonant2 = x2 / 5 | 0, vowel2 = x2 % 5;

		if (consonant1 != 11 && consonant2 != 11) {
			const mixedVowel = vowel1 * 5 + vowel2;
			const changedVowelName = japaneseVowelToKorean[mixedVowel];
			const mixedConsonant = consonant1 * 11 + consonant2;

			if (typeof changedVowelName == 'string') {
				return {
					"type": 1,
					"conpat": mixedConsonant,
					"vowel": changedVowelName
				};
			} else {
				return {
					"type": 4,
					"vowel": 11 * 5 * 4 * 2 + 4 * 4 + 4 + mixedConsonant * 4 + changedVowelName
				};
			}
		} else if (consonant1 != 11 && consonant2 == 11) {
			return {
				"type": 4,
				"vowel": x1 * 4 + vowel2
			};
		} else if (consonant1 == 11 && consonant2 != 11) {
			return {
				"type": 4,
				"vowel": 11 * 5 * 4 + x2 * 4 + vowel1
			};
		} else {
			return {
				"type": 4,
				"vowel": 11 * 5 * 4 * 2 + vowel1 * 4 + vowel2
			};
		}
	} else {
		if (consonant1 != 11) {
			return {
				"type": 2,
				"conpat": consonant1,
				"vowel": ['u','i','a','o','e'][vowel1]
			};
		} else {
			return {
				"type": 4,
				"vowel": 11 * 5 * 4 * 2 + 4 * 4 + vowel1
			};
		}
	}
}

const conTable = ['h','g','k','gg','m','b','p','bb','n','d','t','dd','j','ch','jj','','s','ss','l'];  // 19
const patTable = ['l','s','ng','n','m','g','d','b'];  // 8, without ''

const vowWithoutAEIOU = ['ai','ia','iai','ei','ie','iei','oa','oai','oi','io','ue','uei','ui','iu','eu','eui'];  // 16
const vowWithAEIOU = ['a','ai','ia','iai','e','ei','ie','iei','o','oa','oai','oi','io','u','ue','uei','ui','iu','eu','eui','i'];  // 21

function codeToCode2(obj) {
	switch (obj.type) {
		case 1:  // 11 * 11 * 21
			const con = conTable[obj.conpat / 8 | 0] , pat = patTable[obj.conpat % 8];
			// h-l ~ jj-b & -l, 15 * 8 + 1 = 11 * 11
			return { "con": con, "vowel": obj.vowel, "pat": pat };
		case 2:  // 11 * 5
			const conpat = [ ['h', '']
						, ['k', '']
						, ['m', '']
						, ['n', '']
						, ['', '']
						, ['s', '']
						, ['ss', '']
						, ['l', '']
						, ['s', 'l']
						, ['ss', 'l']
						, ['l', 'l']
						][obj.conpat];
			return { "con": conpat[0], "vowel": obj.vowel, "pat": conpat[1] };
		case 4:  // 11 * 5 * 4 * 2 + 4 * 4 + 11 * 11 * 4
			if (obj.vowel < 16) {
				return { "con": '', "vowel": vowWithoutAEIOU[obj.vowel], "pat": '' };
			} else if (obj.vowel - 16 < 147) {
				const pat = (obj.vowel - 16) % 7,
						vow = (obj.vowel - 16) / 7 | 0;
				return { "con": '', "vowel": vowWithAEIOU[vow], "pat": ['s','ng','n','m','g','d','b'][pat] };
			} else if (obj.vowel - 16 - 147 < 441) {
				const pat = (obj.vowel - 16 - 147) % 7,
						convow = (obj.vowel - 16 - 147) / 7 | 0,
						vow = convow % 21,
						con = convow / 21 | 0;
				return { "con": ['s','ss','l'][con], "vowel": vowWithAEIOU[vow], "pat": ['s','ng','n','m','g','d','b'][pat] };
			} else if (obj.vowel - 16 - 147 - 441 < 96) {
				const pat = (obj.vowel - 16 - 147 - 441) % 2,
						convow = (obj.vowel - 16 - 147 - 441) / 2 | 0,
						vow = convow % 16,
						con = convow / 16 | 0;
				return { "con": ['s','ss','l'][con], "vowel": vowWithoutAEIOU[vow], "pat": ['','l'][pat] };
			} else if (obj.vowel - 16 - 147 - 441 - 96 < 64) {
				const vow = (obj.vowel - 16 - 147 - 441 - 96) % 16,
						con = (obj.vowel - 16 - 147 - 441 - 96) / 16 | 0;
				return { "con": ['h','k','m','n'][con], "vowel": vowWithoutAEIOU[vow], "pat": '' };
			} else if (obj.vowel - 16 - 147 - 441 - 96 - 64 < 231) {
				const vow = (obj.vowel - 16 - 147 - 441 - 96 - 64) % 21,
						con = (obj.vowel - 16 - 147 - 441 - 96 - 64) / 21 | 0;
				return { "con": ['g','gg','b','p','bb','d','t','dd','j','ch','jj'][con], "vowel": vowWithAEIOU[vow], "pat": '' };
			} else {
				throw "Too large:" + obj.vowel;
			}
	}
}

const conMap =
{ 'h': 18
, 'g': 0
, 'k': 15
, 'gg': 1
, 'm': 6
, 'b': 7
, 'p': 17
, 'bb': 8
, 'n': 2
, 'd': 3
, 't': 16
, 'dd': 4
, 'j': 12
, 'ch': 14
, 'jj': 13
, '': 11
, 's': 9
, 'ss': 10
, 'l': 5
};

var vowelMap =
{ "a": 0
, "ai": 1
, "ia": 2
, "iai": 3
, "e": 4
, "ei": 5
, "ie": 6
, "iei": 7
, "o": 8
, "oa": 9
, "oai": 10
, "oi": 11
, "io": 12
, "u": 13
, "ue": 14
, "uei": 15
, "ui": 16
, "iu": 17
, "eu": 18
, "eui": 19
, "i": 20
};

const patMap =
{ '': 0
, 'l': 8
, 's': 19
, 'ng': 21
, 'n': 4
, 'm': 16
, 'g': 1
, 'd': 7
, 'b': 17
};

function codeToCode3(obj) {
	if (obj.con == 'h' &&
			(obj.vowel == 'a' || obj.vowel == 'i' || obj.vowel == 'u' || obj.vowel == 'e' || obj.vowel == 'o') &&
			obj.pat == '')
		obj.con = '';
	else if (obj.con == '' &&
			(obj.vowel == 'a' || obj.vowel == 'i' || obj.vowel == 'u' || obj.vowel == 'e' || obj.vowel == 'o') &&
			obj.pat == '')
		obj.con = 'h';
	const con = conMap[obj.con];
	const vowel = vowelMap[obj.vowel];
	const pat = patMap[obj.pat];
	return chr(ord('가') + con * 21 * 28 + vowel * 28 + pat);
}

//=========================

const kanamap2 =
{ 'ka':'か'
, 'ki':'き'
, 'ku':'く'
, 'ke':'け'
, 'ko':'こ'
, 'sa':'さ'
, 'si':'し'
, 'su':'す'
, 'se':'せ'
, 'so':'そ'
, 'ta':'た'
, 'ti':'ち'
, 'tu':'つ'
, 'te':'て'
, 'to':'と'
, 'ha':'は'
, 'hi':'ひ'
, 'hu':'ふ'
, 'he':'へ'
, 'ho':'ほ'
, 'na':'な'
, 'ni':'に'
, 'nu':'ぬ'
, 'ne':'ね'
, 'no':'の'
, 'ma':'ま'
, 'mi':'み'
, 'mu':'む'
, 'me':'め'
, 'mo':'も'
, 'ra':'ら'
, 'ri':'り'
, 'ru':'る'
, 're':'れ'
, 'ro':'ろ'
, 'ga':'が'
, 'gi':'ぎ'
, 'gu':'ぐ'
, 'ge':'げ'
, 'go':'ご'
, 'za':'ざ'
, 'zi':'じ'
, 'zu':'ず'
, 'ze':'ぜ'
, 'zo':'ぞ'
, 'da':'だ'
, 'di':'ぢ'
, 'du':'づ'
, 'de':'で'
, 'do':'ど'
, 'wa':'わ'
, 'ya':'や'
, 'yu':'ゆ'
, 'yo':'よ'
}

const convertString = str => convertStringInner(str, '');

function convertStringInner(str, acc) {
	if (str.length == 0)
		return acc;
	else if (str[0] == 'a' || str[0] == 'i' || str[0] == 'u' || str[0] == 'e' || str[0] == 'o')
		return convertStringInner(str.substr(1), acc + {'a':'あ','i':'い','u':'う','e':'え','o':'お'}[str[0]]);
	else
		return convertStringInner(str.substr(2), acc + kanamap2[str.substr(0,2)]);
}

//=========================

function convertAll(str) {
	let res = '';
	const kanaStr = convertString(str);
	for (var i = 0; i < kanaStr.length; i += 2) {
		res += codeToCode3(codeToCode2(japaneseCharDualToCode(kanaStr[i], kanaStr[i + 1])));
	}
	return res;
}


//========================= UI

function handleConvert() {
	translitInput.value = convertInput.value.replace(/\b(([ksthnmrgzd]?[aiueo]|wa|ya|yu|yo)+)\b/g, ($0, $1) => $0.replace($1, convertAll($1)));
}

"use strict";

var alphas = [0,1,-1,2,3,-1,4,5,6,-1,7,-1,8,9,10,-1,-1,11,12,13,14,-1,-1,-1,-1,15];  /* 16 */
function ord(str) { return str.charCodeAt(0); }
function chr(i) { return String.fromCodePoint(i); }
function alpha2int(x) { return alphas[ord(x) - ord('a')]; }
function int2alpha(x) { return chr(ord('a') + alphas.indexOf(x)); }
var rows = ['가','개','갸','걔','거','게','겨','계','고','과','괘','괴','교','구','궈','궤','귀','규','그','긔','기','나','내','냐','냬','너','네','녀','녜','노','놔','놰','뇌','뇨','누','눠','눼','뉘','뉴','느','늬','니','다','대','댜','댸','더','데','뎌','뎨','도','돠','돼','되','됴','두','둬','뒈','뒤','듀','드','듸','디','라','래','랴','럐','러','레','려','례','로','롸','뢔','뢰','료','루','뤄','뤠','뤼','류','르','릐','리','마','매','먀','먜','머','메','며','몌','모','뫄','뫠','뫼','묘','무','뭐','뭬','뮈','뮤','므','믜','미','바','배','뱌','뱨','버','베','벼','볘','보','봐','봬','뵈','뵤','부','붜','붸','뷔','뷰','브','븨','비','사','새','샤','섀','서','세','셔','셰','소','솨','쇄','쇠','쇼','수','숴','쉐','쉬','슈','스','싀','시','아','애','야','얘','어','에','여','예','오','와','왜','외','요','우','워','웨','위','유','으','의','이','자','재','쟈','쟤','저','제','져','졔','조','좌','좨','죄','죠','주','줘','줴','쥐','쥬','즈','즤','지','차','채','챠','챼','처','체','쳐','쳬','초','촤','쵀','최','쵸','추','춰','췌','취','츄','츠','츼','치','카','캐','캬','컈','커','케','켜','켸','코','콰','쾌','쾨','쿄','쿠','쿼','퀘','퀴','큐','크','킈','키','타','태','탸','턔','터','테','텨','톄','토','톼','퇘','퇴','툐','투','퉈','퉤','튀','튜','트','틔','티','파','패','퍄','퍠','퍼','페','펴','폐','포','퐈','퐤','푀','표','푸','풔','풰','퓌','퓨','프','픠','피','하','해','햐','햬','허','헤','혀','혜','호','화','홰','회','효','후','훠','훼','휘','휴','흐','희','히'];  /* 294 */
var cols = [27,21,19,17,16,13,12,11,10,9,8,7,4,1,0];  /* 15 */

function int2hangul(a, b, c) {
	if (typeof c !== 'undefined' && c !== null) {
		var i = (a * 1 << 8) + (b * 1 << 4) + c;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	} else if (typeof b !== 'undefined' && b !== null) {
		var i = (1 << 12) + (a * 1 << 4) + b;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	} else {
		var i = (1 << 12) + (1 << 8) + a;
		return ord(rows[i % 294]) + cols[i / 294 | 0];
	}
}

function encodeMany(xs) {
	var arr = xs.split('').map(alpha2int);
	var res = '';
	for (var i = 0, len = arr.length; i < len; i += 3)
		res += chr(int2hangul(arr[i], arr[i + 1], arr[i + 2]));
	return res;
}

function handleEncode() {
	decodeInput.value = encodeInput.value.replace(/\b([abdeghikmnorstuz]+)\b/g, function($0, $1) { return $0.replace($1, encodeMany($1)); });
	handleDecode();
	document.getElementById('isNotIdentical').style.display = encodeInput.value != decodeOutput.value ? 'inherit' : 'none';
}

function decodeOne(ch) {
	var cp = ord(ch) - ord('가'),
		row = cp / 28 | 0, col = cp % 28,
		row2 = rows.indexOf(chr(ord('가') + row * 28)), col2 = cols.indexOf(col),
		i = col2 * 294 + row2;
	if (i >= (1 << 12) + (1 << 8)) {
		var a = i - (1 << 12) - (1 << 8);
		return int2alpha(a);
	} else if (i >= (1 << 12)) {
		var j = i - (1 << 12),
			a = j / (1 << 4) | 0, b = j % (1 << 4);
		return int2alpha(a) + int2alpha(b);
	} else {
		var a = i / (1 << 8) | 0, k = i % (1 << 8),
			b = k / (1 << 4) | 0, c = k % (1 << 4);
		return int2alpha(a) + int2alpha(b) + int2alpha(c);
	}
}

function decodeMany(str) { return str.split('').map(decodeOne).join(''); }

function handleDecode() {
	decodeRomanize.value = decodeInput.value.replace(/([가-힣]+)/g, function($0, $1) { return $0.replace($1, $1.romanize()); });
	decodeOutput.value = decodeInput.value.replace(/([가-힣]+)/g, function($0, $1) { return $0.replace($1, decodeMany($1)); });
}

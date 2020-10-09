import { CSV } from "https://code4sabae.github.io/js/CSV.js";

const fixnum = (n, m) => {
	var s = "00000000000000000" + n;
	return s.substring(s.length - m);
};
const addComma = (num, beam) => {
  let flg = num < 0;
	if (flg)
		num = -num;
	if (beam == null)
		beam = 0;
	if (isNaN(parseFloat(num)))
		return num;
	const f = parseFloat(num) - parseInt(num);
	let s = "" + parseInt(num);
	for (let i = 3; i < s.length; i += 4) {
		s = s.substring(0, s.length - i) + "," + s.substring(s.length - i);
	}
	if (beam > 0) {
		s += "." + fixnum(Math.floor(f * Math.pow(10, beam)), beam);
	}
	return (flg ? "-" : "") + s;
};

const fn = "op20200323_r1koukinsisyutujouhou_2020_01_utf8.csv";
const csv = CSV.decode(await Deno.readTextFile(fn));
console.log(csv.length - 4);
for (let i = 4; i < csv.length; i++) {
  const d = csv[i];
  d[10] = parseInt(d[10].replace(/,/g, ""));
}

let min = 1000000;
let max = 0;
let mindata = null;
let maxdata = null;
for (let i = 4; i < csv.length; i++) {
  const d = csv[i];
  const m = d[10];
  if (m > max) {
    max = m;
    maxdata = d;
  }
  if (m < min) {
    min = m;
    mindata = d;
  }
}
console.log(min, mindata);
console.log(addComma(max), maxdata);

const kyoku = new Set();
for (let i = 4; i < csv.length; i++) {
}
/*
console.log(csv[csv.length - 4]); // 最後
*/
console.log(csv[csv.length - 3]); // 空行
console.log(csv[csv.length - 2]); // ※東京都情報公開条例に規定する非開示情報に当たるために非公開となった件数
console.log(csv[csv.length - 1]); // 　 ・産業労働局　３件


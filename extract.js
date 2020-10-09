import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { parseMonth } from "../code4sabae-js/parseMonth.js";
import { toHalf } from "../code4sabae-js/toHalf.js";

const parseNumber = (s) => {
  s = toHalf(s);
  const num = s.match(/(\d+)/)
  if (num) {
    return parseInt(num[1]);
  }
  return "-";
};

const seclaw = "東京都情報公開条例に規定する非開示情報に当たるために非公開となった件数";

const getSecret = async (fn) => {
  //console.log(fn, "*");
  const scsv = await Deno.readTextFile(fn);
  //console.log(scsv.length);
  const csv = CSV.decode(scsv);
  const date = parseMonth(csv[0][0]);
  //console.log(csv.length, fn);
  const name = csv[csv.length - 2][0];
  const title = csv[0][0];
  if (title.indexOf("出納整理期間") >= 0) {
    return null;
  }
  if (name.indexOf(seclaw) >= 0) {
    const ssec = csv[csv.length - 1][0];
    const nsec = parseNumber(ssec);
    const res = [date, title, csv.length - 7, ssec, nsec];
    //console.log(res); // ※東京都情報公開条例に規定する非開示情報に当たるために非公開となった件数
    // 　 ・産業労働局　３件
    return res;
  }
  return null;
};

const file = await Deno.readDir("data");
const list = [];
for await (const f of file) {
  if (f.name.indexOf(".DS_Store") >= 0) {
    continue;
  }
  const sec = await getSecret("data/" + f.name);
  if (sec)
    list.push(sec);
}
list.sort((a, b) => {
  const a0 = a[0];
  const b0 = b[0];
  if (a0 > b0)
    return 1;
  else if (a0 < b0)
    return -1;
  return 0;
});
console.log(list);
list.unshift(["monthID", "title", "totalnumber", "ssecret", "nsecret"]);
await Deno.writeTextFile("money_tokyo_simple.csv", CSV.encode(list));

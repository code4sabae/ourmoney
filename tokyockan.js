const t = async (url) => await (await fetch(url)).json();

const action = async (path) => t("https://catalog.data.metro.tokyo.lg.jp/api/3/action/" + path);

/*
// CKAN

https://catalog.data.metro.tokyo.lg.jp/dataset/activity/t000016d0000000005
https://catalog.data.metro.tokyo.lg.jp/api/3/action/tag_list
https://demo.ckan.org/api/3/action/tag_list

*/

// t("https://catalog.data.metro.tokyo.lg.jp/api/3/action/tag_list");
// [ "スポーツ", "サイクリング", "Wi-Fi", "推奨データセット" ]

/*
error: Uncaught Http: error sending request for url (https://www.kaikeikanri.metro.tokyo.lg.jp/op310131_h29koukinsisyutujouhou_2018_03.csv): error trying to connect: tls handshake eof

*/


import { CSV } from "https://code4sabae.github.io/js/CSV.js";



// 公金支出データセット https://catalog.data.metro.tokyo.lg.jp/dataset/t000016d0000000005

const data = await action("package_show?id=t000016d0000000005"); // result.resources[n].(name, url)

const fetchText = async (url) => await (await fetch(url)).text();
const fetchBin = async (url) => await (await fetch(url)).arrayBuffer();

const getSecret = async (url) => {
  const csv = CSV.decode(s);
};
const getPath = (url) => url.substring(url.lastIndexOf("/") + 1);

const fetchViaCurl = async (url) => {
  const path = getPath(url);
  const p = Deno.run({ cmd: ["curl", "-o", path, "-L", url ], stdout: "piped" });
  const out = await p.output();
  p.close();
  console.log(out);
};

const list = [];
list.push(["name", "url"]);
for (const d of data.result.resources) {
  console.log(d.name, d.url);
  list.push([d.name, d.url]);

  await fetchViaCurl(d.url);
  /*const bin = await fetchBin(d.url);
  const path = getPath(d.url);
  await Deno.writeFile(path, bin);
  break;
  */ 
}
await Deno.writeTextFile("list.csv", CSV.encode(list));

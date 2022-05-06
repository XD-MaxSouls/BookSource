const headers = ["user-agent:Mozilla/5.0 (Linux; Android 12; Mi 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Mobile Safari/537.36 EdgA/101.0.1210.39"]

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://m.feiszw.com/search.aspx?s=${key}&submit=`,{headers})
  let array = []
  let $ = HTML.parse(response)
  $('div.nlist').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h3').text(),
      author: $('span.author').text(),
      cover: `https://m.feiszw.com${$('img').attr('src')}`,
      detail: `https://m.feiszw.com${$('h3 > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url,{headers})
  let $ = HTML.parse(response)
  let book = {
    summary: $('[property=og:description]').attr("content").replaceAll("</p>","\n"),
    status: $('span.state_g').text(),
    category: $('[property=og:novel:category]').attr("content"),
    update: $('div.block_txt2 > p:nth-child(4)').text().replace("更新：",""),
    lastChapter: $('div.block_txt2 > p:nth-child(5)').text().replace("最新：",""),
    catalog: url.replaceAll("/","").replace("https:m.feiszw.combook-","")
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(`https://www.feiszw.com/Html/${url}/index.html`,{headers})
  let $ = HTML.parse(response)
  let array = []
  $('div.chapterlist > ul > li').forEach((chapter) => {
  let $ = HTML.parse(chapter)
    array.push({
      name: $('a').text().replace("（1 / 1）",""),
      url: `https://m.feiszw.com/chapter-${url}-${$('a').attr('href').replace(".html","")}`
    })
  })
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
  let src = GET(url,{headers})
  let content = src.match(/Content='(.*?)'/)[1];
var update=src.match(/update='(.*?)'/)[1]
  function aq(ar, as) {
    let aK = ar['length'];
    let aL = (ar[(aK-0x1)]&0xffffffff);
    for (var aM = 0x0; (aM<aK); aM++) {
      ar[aM] = String['fromCharCode'](ar[aM] & 0xff, ((ar[aM]>>>0x8)&0xff), ((ar[aM]>>>0x10)&0xff),(ar[aM]>>>0x18) & 0xff);
    }
    if (as) {
        return ar['join']('')['substring'](0x0, aL);
    } else {
        return ar['join']('');
    }
}
  function aQ(aR, aS) {
    let b6 = aR.length;
    let b8 = [];
    for (var b7 = 0x0; b7< b6; b7 += 0x4) {
        b8[b7 >> 0x2] = ((aR['charCodeAt'](b7)| aR['charCodeAt']((b7+0x1)) << 0x8) | (aR['charCodeAt']((b7+0x2))<< 0x10)|(aR['charCodeAt'](b7 + 0x3)<<0x18));
    }
    if (aS) {
        b8[b8['length']] = b6;
    }
    return b8;
}
  function c6(c7, c8) {
    if (c7==='') {
        return '';
    }
    let cS = aQ(c7, false);
    let cX = aQ(c8, false);
    let cT = cS['length'] - 0x1;
    let cP = cS[cT - 0x1],
    cQ = cS[0x0],
    cR = 0x9e3779b9;
    let cL, cM, cN = Math['floor'](0x6+(0x34/(cT+0x1))),
    cO = (cN*cR) & 0xffffffff;
    while (cO!= 0x0) {
      cM = (cO >>> 0x2) & 0x3;
      for (var cW = cT; cW > 0x0; cW--) {
        cP = cS[cW-0x1];
        cL = (((cP>>>0x5)^cQ << 0x2)+((cQ>>>0x3)^(cP<<0x4))) ^ (cO^cQ) + (cX[((cW&0x3)^cM)]^cP);
        cQ = cS[cW] = ((cS[cW] - cL)&0xffffffff);
      }
      cP = cS[cT];
      cL = ((((cP>>>0x5)^(cQ<<0x2)) + (cQ >>> 0x3 ^ (cP<<0x4)))^((cO^cQ) + (cX[((cW&0x3)^cM)]^cP)));
      cQ = cS[0x0] = cS[0x0] - cL & 0xffffffff;
      cO = (cO-cR) & 0xffffffff;
    }
    return aq(cS, true);
}
  function base64decode(str) {
	   let code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    let bitString = "";
    let tail = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] != "=") {
        let decode = code.indexOf(str[i]).toString(2);
        bitString += (new Array(7 - decode.length)).join("0") + decode;
      } else {
        tail++;
      }
    }
    Bin = bitString.substr(0, bitString.length - tail * 2);
    let result = "";
    for (let i = 0; i < Bin.length; i += 8) {
      result += String.fromCharCode(parseInt(Bin.substr(i, 8), 2));
    }
    return result;
  } 
  text = decodeURIComponent(escape(base64decode(c6(base64decode(content),update)))).replace("飞速中文网（m.feixs.com）","");
  let $ = HTML.parse(src)
  let con = $('#nr1').remove("[style]")
  if(text) text = text
  else text = con
  return text
}

var bookSource = JSON.stringify({
  name: "飞速中文",
  url: "feiszw.com",
  version: 103
})

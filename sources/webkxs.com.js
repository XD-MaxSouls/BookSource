require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('DeYw7vSTuV9g2qTxNZqG5mB6')
    let iv = CryptoJS.enc.Utf8.parse('01234567')
    data = data.replaceAll("\n","")
    decrypted = CryptoJS.TripleDES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
}

const headers = ["appid:bdwx","Channel:guan","Version-Code:101"]

//搜索
const search = (key) => {
  let response = POST('http://m.webkxs.com/search/book/result',{data:`kw=${key}&pn=1`,headers})
  let e = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(e)
  let array = []
  $.result.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author,
      cover: child.cover,
      detail: child.book_id,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = POST('http://m.webkxs.com/api/book/detail',{data:`book_id=${url}`,headers})
  let e = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(e).result
  let book = {
    summary: $.intro,
    status: $.status == 0 ? '连载' : '完结',
    category: $.category_name,
    words: $.size,
    update: timestampToTime($.update_time),
    lastChapter: $.lastchapter,
    catalog: $.book_id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = POST('http://m.webkxs.com/api/book/chapter',{data:`book_id=${url}`,headers})
  let e = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(e)
  let array = []
  $.result.forEach(chapter => {
    array.push({
      name: chapter.name,
      url: `book_id=${url}&chapter_id=${chapter.index}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = POST('http://m.webkxs.com/api/book/content',{data:url,headers})
  let e = decrypt(JSON.parse(response).data)
  let $ = JSON.parse(e)
  return $.result.trim()
}

var bookSource = JSON.stringify({
  name: "布丁小说",
  url: "webkxs.com",
  version: 100
})

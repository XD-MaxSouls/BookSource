require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('ZKYm5vSUhvcG9IbXNZTG1pb2')
    let iv = CryptoJS.enc.Utf8.parse('01234567')
    decrypted = CryptoJS.TripleDES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

//搜索
const search = (key) => {
  let response = POST(`http://api.sz456.com.cn/search/book/result`,{data:`kw=${encodeURI(key)}&pn=1&is_author=0`,headers:["Version-Code: 10100","appid: bishugexs","Channel: pixel"]})
  let array = []
  let v = JSON.parse(response)
  let data = decrypt(v.data.replaceAll("\n",""))
  let $ = JSON.parse(data)
  $.result.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author_name,
      cover: child.book_cover,
      detail: child.book_cover.replace("cover","api/book/detail").replace(".jpg",".json")
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let v = JSON.parse(response)
  let data = decrypt(v.data.replaceAll("\n",""))
  let $ = JSON.parse(data).result
  let book = {
    summary: $.book_brief,
    category: $.book_tags.join(" "),
    words: $.book_word_num,
    update: timestampToTime($.update_time),
    lastChapter: $.chapter_new_name,
    catalog: url.replace("detail","chapter").replace(".json","/list.json")
  }
  return JSON.stringify(book)
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

//目录
const catalog = (url) => {
  let response = GET(url)
  let v = JSON.parse(response)
  let data = decrypt(v.data.replaceAll("\n",""))
  let $ = JSON.parse(data)
  let array = []
  $.result.forEach((chapter) => {
      array.push({
        name: chapter.chapter_name,
        url: `${url.replace("list.json","")}${chapter._id}.json`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let v = JSON.parse(GET(url))
  let data = decrypt(v.data.replaceAll("\n",""))
  let $ = JSON.parse(data)
  return $.content
}

var bookSource = JSON.stringify({
  name: "笔书阁",
  url: "sz456.com.cn",
  version: 100
})

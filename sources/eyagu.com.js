require("crypto-js")

const decrypt = function (data) {
  let key = CryptoJS.enc.Utf8.parse('abcdefabacadaeaf')
  let iv = CryptoJS.enc.Utf8.parse('abcdefabacadaeaf')
  decrypted = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

const baseUrl = "http://eyagu.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/book/search?sn=${encodeURI(key)}`)
  let array = []
  let $ = HTML.parse(response)
  $('.book_item').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('.book_name').text(),
      author: $('.book_author').text(),
      cover: $('img').attr('src'),
      detail: `${baseUrl}${$('.book_name').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('.introduce').text(),
    catalog: url
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('.clear:nth-child(5) > div').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    if ($("div").attr("style").match("color: #444444")) array.push({ name: $("div").text() })
    else array.push({
      name: $("a").text(),
      url: `${baseUrl}${$("a").attr("href")}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let $ = HTML.parse(GET(url))
  let txt = $("input#a").attr("value")
  return decrypt(txt)
}

var bookSource = JSON.stringify({
  name: "雅谷中文",
  url: "eyagu.com",
  version: 100
})

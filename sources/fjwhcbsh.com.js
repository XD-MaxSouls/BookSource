require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('Pxga!h*e4@T8xfOm')
    let iv = CryptoJS.enc.Utf8.parse('E&z!EHGLd$fli*8R')
    decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const headers = ["package:com.diandianbook.androidreading",`time:${Math.round(new Date()/1000)}`,`sign:${CryptoJS.MD5("com.diandianbook.androidreading1" + Math.round(new Date()/1000) +"vhjJVz1St6tK7!8n#B0MqRIuE2Dh7!C#")}`,"pt:1","channel:baidu_tg102"]

//搜索
const search = (key) => {
  let response = GET(`https://s.fjwhcbsh.com/v1/lists.api?keyword=${key}`,{headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: `https://res.fjwhcbsh.com/${child.image}`,
      detail: `${child.book_id.toString().slice(0,3)}/${child.book_id}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(`https://book.fjwhcbsh.com/details/${url}.html`,{headers})
  let $ = JSON.parse(response).data
  let v = JSON.parse(GET(`https://book.fjwhcbsh.com/source/${url}.html`,{headers})).data[0]
  let book = {
    summary: $.remark,
    status: $.status == 2 ? '连载' : '完结',
    category: $.ltype,
    words: $.words_number,
    update: $.updated_at,
    lastChapter: $.last_chapter_name,
    catalog: `https://catalog.fjwhcbsh.com/${v.site_path}`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach(chapter => {
      array.push({
        name: decrypt(chapter.name),
        url: `https://chapter.fjwhcbsh.com/${chapter.path}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers})).data
  return decrypt($.content).trim()
}

var bookSource = JSON.stringify({
  name: "点点阅读",
  url: "fjwhcbsh.com",
  version: 100
})

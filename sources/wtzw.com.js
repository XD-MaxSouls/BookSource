require('crypto-js')

const header = ['platform: android','app-version: 60800','application-id: com.kmxs.reader','sign: f62e9aca35cac8bf8d65d6e21799aba9','user-agent:webviewversion/60800']

const decrypt = function (data) {
    let key = CryptoJS.enc.Hex.parse('32343263636238323330643730396531')
    let iv = CryptoJS.enc.Hex.parse(localStorage.getItem('iv'))
    let HexStr = CryptoJS.enc.Hex.parse(data)
    let Base64Str = CryptoJS.enc.Base64.stringify(HexStr)
    let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let sign = CryptoJS.MD5(`wd=${key}d3dGiJc651gSQ8w1`)
  let response = GET(`https://api-bc.wtzw.com/api/v7/search/words?wd=${encodeURI(key)}&sign=${sign}`,{headers:header})
  let array = []
  let $ = JSON.parse(response)
  $.data.books.filter($ => $.show_type != 4 && $.show_type != 2).forEach(($) => {
    array.push({
      name: $.original_title,
      author: $.original_author,
      cover: $.image_link,
      detail: $.id
    })   
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let sign = CryptoJS.MD5(`id=${url}d3dGiJc651gSQ8w1`)
  let response = GET(`https://api-bc.wtzw.com/api/v5/book/detail?id=${url}&sign=${sign}`,{headers:header})
  let $ = JSON.parse(response).data.book
  let book = {
    summary: $.intro,
    status: $.is_over == 0 ? '连载' : '完结',
    category: $.book_tag_list.map((item)=>{ return item.title}).join(" "),
    words: $.category_over_words.match(/\d{1,}万/)[0],
    update: timestampToTime($.update_time),
    lastChapter: $.latest_chapter_title,
    catalog: $.id
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
  let sign = CryptoJS.MD5(`id=${url}d3dGiJc651gSQ8w1`)
  let response = GET(`https://api-ks.wtzw.com/api/v1/chapter/chapter-list?&id=${url}&sign=${sign}`,{headers:header})
  let $ = JSON.parse(response)
  let array = []
  $.data.chapter_lists.forEach((chapter) => {
     let chapter_sign = CryptoJS.MD5(`chapterId=${chapter.id}id=${url}d3dGiJc651gSQ8w1`)
      array.push({
        name: chapter.title,
        url: `https://api-ks.wtzw.com/api/v1/chapter/content?chapterId=${chapter.id}&id=${url}&sign=${chapter_sign}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers:header}))
    let txt = CryptoJS.enc.Base64.parse($.data.content).toString()
    localStorage.setItem('iv', txt.slice(0,32))
    return decrypt(txt.slice(32)).trim()
}

var bookSource = JSON.stringify({
  name: "七猫小说",
  url: "wtzw.com",
  version: 100
})

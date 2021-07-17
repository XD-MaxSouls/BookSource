const baseUrl = "https://www.shuchong.info"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST(`${baseUrl}/search/`,{data:`key=${ENCODE(key,"gbk")}`,headers:["User-Agent:Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36"]})
  let array = []
  let $ = HTML.parse(response)
  if ($('.subhead > a:nth-child(2)').text() == "搜索结果") {
    $('div.bookbox').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h4.bookname').text(),
        author: $('div.author').text().replace("作者：",""),
        detail: `${baseUrl}${$('a').attr('href')}`,
      })
    })
  } else {
    // 搜索挑战主页问题
    array.push({
      name: $('[property=og:novel:book_name]').attr('content'),
      author: $('[property=og:novel:author]').attr('content'),
      cover: $('[property=og:image]').attr('content'),
      detail: $('[property=og:url]').attr('content'),
    })
  }
  return JSON.stringify(array)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let response = GET(url,{headers:["User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"]})
  let $ = HTML.parse(response)
  let book = {
    summary: $('.book-dec').text(),
    status: $('.state').text(),
    category: $('.label').text(),
    words: $('.nums > span:nth-child(1) > i').text(),
    update: $('[property=og:novel:update_time]').attr('content'),
    lastChapter: $('.link-group').text(),
    catalog: url.replace("https://www.shuchong.info/book/","").replace(".html","")
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let array = []
  endpage = 999
  for (i = 1;i <= endpage; i++) {
  let response = GET(`https://www.shuchong.info/list/${url}/${i}/0/`,{headers:["User-Agent:Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36"]})
  let $ = HTML.parse(response)
  endpage = $('option:last-of-type').attr('value').replace(/\/list\/\d+\//,"").replace("/0/","")
    $('ul > li').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text().replace(/- \d+-\d+/g,""),
        url: `${baseUrl}${$('a').attr('href')}`
      })
    })
    }
  return JSON.stringify(array)
}

/**
 * 章节
 * @params {string} url
 * @returns {string}
 */
const chapter = (url) => {
    let res = GET(url, {headers: ["Content-Type: application/x-www-form-urlencoded", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"]})
    let section = String(res.match(/function\s*getDecode\(\)\{(.*)\}/)[1]).replace(/\\/g,"/")
.replace(/[A-Z]=~.*?\('/g,"")
.replace(/#.*?\('/g,"")
.replace(/'\).*/g,"")
.replace(/\+|"/g,"")
.replace(/[A-Z]\.\$__\$/g,"9")
.replace(/[A-Z]\.\$___/g,"8")
.replace(/[A-Z]\.\$\$\$/g,"7")
.replace(/[A-Z]\.\$\$_/g,"6")
.replace(/[A-Z]\.\$_\$/g,"5")
.replace(/[A-Z]\.\$__/g,"4")
.replace(/[A-Z]\._\$\$/g,"3")
.replace(/[A-Z]\._\$_/g,"2")
.replace(/[A-Z]\.__\$/g,"1")
.replace(/[A-Z]\.___/g,"0")
.replace(/\/\/74\/{2,3}160\/\/76/g,"\n")
//大写字母
.replace(/\/\/132/g,"Z")
.replace(/\/\/131/g,"Y")
.replace(/\/\/130/g,"X")
.replace(/\/\/127/g,"W")
.replace(/\/\/126/g,"V")
.replace(/\/\/125/g,"U")
.replace(/\/\/124/g,"T")
.replace(/\/\/123/g,"S")
.replace(/\/\/122/g,"R")
.replace(/\/\/121/g,"Q")
.replace(/\/\/120/g,"P")
.replace(/\/\/117/g,"O")
.replace(/\/\/116/g,"N")
.replace(/\/\/115/g,"M")
.replace(/\/\/114/g,"L")
.replace(/\/\/113/g,"K")
.replace(/\/\/112/g,"J")
.replace(/\/\/111/g,"I")
.replace(/\/\/110/g,"H")
.replace(/\/\/107/g,"G")
.replace(/\/\/106/g,"F")
.replace(/\/\/105/g,"E")
.replace(/\/\/104/g,"D")
.replace(/\/\/103/g,"C")
.replace(/\/\/102/g,"B")
.replace(/\/\/101/g,"A")
.replace(/\/\/100/g,"@")
//小写字母
.replace(/5\_/g,"a")
.replace(/5\$/g,"b")
.replace(/6\_/g,"c")
.replace(/6\$/g,"d")
.replace(/7\_/g,"e")
.replace(/7\$/g,"f")
.replace(/\/\/147/g,"g")
.replace(/\/\/150/g,"h")
.replace(/\/\/151/g,"i")
.replace(/\/\/152/g,"j")
.replace(/\/\/153/g,"k")
.replace(/\(\!\[\]\)\[2\]/g,"l")
.replace(/\/\/155/g,"m")
.replace(/\/\/156/g,"n")
.replace(/[A-Z]\._\$/g,"o")
.replace(/\/\/160/g,"p")
.replace(/\/\/161/g,"q")
.replace(/\/\/162/g,"r")
.replace(/\/\/163/g,"s")
.replace(/[A-Z].__/g,"t")
.replace(/[A-Z]._/g,"u")
.replace(/\/\/166/g,"v")
.replace(/\/\/167/g,"w")
.replace(/\/\/170/g,"x")
.replace(/\/\/171/g,"y")
.replace(/\/\/172/g,"z")
//英文符号
.replace(/\/\/72/g,":")
.replace(/\/\/73/g," ")
.replace(/\/\/77/g,"?")
.replace(/\/\/\/\/u(.{4})/g,"%u$1")
    let cipherText = unescape(section)
    let content = String(res.match(/id="content".*?>([\s\S]*?)\s<\/div>/)[1]).replace(/自动加载/,cipherText).replace(/防采集(，|)/g,"").replace(/失败.*?(阅读模式！|浏览器！)/g,"").replace(/禁止转码.*?请退出阅读模式！/g,"").replace(/chapter_c\(\)\;/g,"")
    return content
}

var bookSource = JSON.stringify({
  name: "书虫中文网",
  url: "shuchong.info",
  version: 100
})

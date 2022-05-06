const baseUrl = "https://www.yodu.org"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST(`${baseUrl}/sa`,{data:`searchkey=${key}&searchtype=all`})
  let array = []
  let $ = HTML.parse(response)
  if ($('[name=keywords]').attr('content') == "图书搜索,文学搜索,小说搜索,有度中文网") {
    $('ul.ser-ret > li.pr').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('h3').text(),
        author: $('em > span:nth-child(4)').text(),
        cover: $('img').attr('_src'),
        detail: `${baseUrl}${$('h3 > a').attr('href').replace("?for-search","")}`
      })
    })
  } else {
    // 搜索跳转主页问题
    array.push({
      name: $('h1.oh').text(),
      author: $('.ttl > span').text(),
      cover: $('span.g_thumb > img').attr('src'),
      detail: $('[property=og:url]').attr('content')
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
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('div.det-abt').text(),
    status: $('strong.mr15:nth-child(3)').text(),
    category: $('strong.mr15:nth-child(2)').text(),
    words: $('strong.mr15:nth-child(4)').text().replace("字",""),
    update: $('small.c_small').text(),
    lastChapter: $('a.lst-chapter').text(),
    catalog: url
  }
  return JSON.stringify(book)
}

/**
 * 目录
 * @params {string} url
 * @returns {[{name, url, vip}]}
 */
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
  $('#chapterList > li').forEach((booklet) => {
    let $ = HTML.parse(booklet)
    if ($("li.volumes").text()) array.push({ name: $("li").text() })
    else array.push({
      name: $("a").text(),
      url: `${baseUrl}${$("a").attr("href")}`
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
  let content = ""
  let i = 2
  let first_url = url
  while (true) {
    let response = GET(url).replace("（本章未完）","")
    let $ = HTML.parse(response)
    content += $('#TextContent')
    let next_btn = $('.mlfy_page > a:nth-child(5)').text()
    if (next_btn != "-->") {
      break
    }
    url = first_url.replace('.html', `_${i}.html`);
    i += 1
  }
  return content
}

var bookSource = JSON.stringify({
  name: "有度中文",
  url: "youdu.org",
  version: 102,
  authorization: "https://www.yodu.org/login.php"
})

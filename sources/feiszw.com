/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = GET(`https://m.feiszw.com/search.aspx?s=${key}&submit=`)
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
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    summary: $('[property=og:description]').attr("content").replaceAll("</p>","\n"),
    status: $('span.state_g').text(),
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
  let response = GET(`https://www.feiszw.com/Html/${url}/index.html`)
  let $ = HTML.parse(response)
  let array = []
    $('div.chapterlist > ul > li').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `https://www.feiszw.com/Html/${url}/${$('a').attr('href')}`
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
  let response = GET(url).replace("飞速中文.com 中文域名一键直达","")
  let $ = HTML.parse(response)
  return $('#content').remove("p.l")
}

var bookSource = JSON.stringify({
  name: "飞速中文",
  url: "feiszw.com",
  version: 100
})

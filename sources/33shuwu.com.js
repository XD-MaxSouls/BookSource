const baseUrl = "http://33shuwu.com"

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let response = POST(`http://33shuwu.com/e/search/index.php`,{data:`keyboard=${encodeURI(key)}&show=title,writer&tbname=book&tempid=1&submit=`})
  let array = []
  let $ = HTML.parse(response)
    $('ul.shuming > li').forEach((child) => {
      let $ = HTML.parse(child)
      array.push({
        name: $('p > a').text(),
        author: $('p > a').text(),
        cover: `${baseUrl}${$('a.tu > img').attr('src')}`,
        detail: `${baseUrl}${$('a.tu').attr('href')}`,
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
    $('div.lb >ul > li').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: `${baseUrl}${$('a').attr('href')}`
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
  let response = GET(url)
  let $ = HTML.parse(response)
  return $('div.nr_con')
}

var bookSource = JSON.stringify({
  name: "三味书屋",
  url: "33shuwu.com",
  version: 100
})

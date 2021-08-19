const baseUrl = "https://www.haoshuya.com"

//搜索
const search = (key) => {
  let response = POST(`${baseUrl}/cse/`,{data:`title=title&ids=1&keyboard=${encodeURI(key)}`})
  let array = []
  let $ = HTML.parse(response)
  $('.bboxsearch').forEach((child) => {
    let $ = HTML.parse(child)
    array.push({
      name: $('h3').text(),
      author: $('.exsearch > p:nth-child(1)').text().replace("作者[",'').replace(/\] 类型\[.+\]/,""),
      detail: `${baseUrl}${$('h3 > a').attr('href')}`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let book = {
    catalog: url
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = HTML.parse(response)
  let array = []
    $('.vipzx > tbody > tr > td').forEach((chapter) => {
      let $ = HTML.parse(chapter)
      array.push({
        name: $('a').text(),
        url: $('a').attr('href')
      })
    })
  return JSON.stringify(array)
}

//正文
const chapter = (url) => {
    let res = GET(url).replaceAll("/�","").replaceAll("�/","").replaceAll("�","").replace("好书呀 - 全本免费小说阅读网","").replace(/书籍 【.+】 由网友上传至【好书呀免费读书网】www.haoshuya.com，供读书爱好者学习交流之用/,"").replace(/书籍 【.+】 由网友上传至【好书呀免费读书网】www.haoshuya.com，供读书爱好者学习交流之用/,"")
    let $ = HTML.parse(res)
  return $('#main > div:nth-child(3)').remove("span,a")
}

var bookSource = JSON.stringify({
  name: "好书呀",
  url: "haoshuya.com",
  version: 100
})

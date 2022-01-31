require('crypto-js')

//搜索
const search = (key) => {
  let time = Math.round(new Date()/1000)
  let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&keyword=${key}&marketChannel=xiaomi&osType=2&packageName=com.letuapp.reader&page_num=1&product=1&sysVer=11&time=${time}&token=&udid=a2b4f4fb-da97-388f-ae30-63d1980f70bc&ver=1.9.8ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString().toUpperCase()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.8",
    marketChannel:"xiaomi",
    sign:sign,
    page_num:1,
    sysVer:11,
    token:"",
    appId:"",
    osType:2,
    time:time,
    packageName:"com.letuapp.reader",
    udid:"a2b4f4fb-da97-388f-ae30-63d1980f70bc",
    keyword:key
    })
  let response = POST(`http://door.tl05.com/book/search`,{data})
  let array = []
  let $ = JSON.parse(response)
  $.data.list.forEach((child) => {
    array.push({
      name: child.name,
      author: child.author,
      cover: child.cover,
      detail: child.book_id,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let time = Math.round(new Date()/1000)
  let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url}&marketChannel=xiaomi&osType=2&packageName=com.letuapp.reader&product=1&sysVer=11&time=${time}&token=&udid=a2b4f4fb-da97-388f-ae30-63d1980f70bc&ver=1.9.8ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString().toUpperCase()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.8",
    appId:"",
    osType:2,
    marketChannel:"xiaomi",
    sign:sign,
    sysVer:11,
    time:time,
    packageName:"com.letuapp.reader",
    book_id:url,
    udid:"a2b4f4fb-da97-388f-ae30-63d1980f70bc",
    token:""
    })
  let response = POST(`http://door.tl05.com/book/info`,{data})
  let $ = JSON.parse(response).data.book
  let book = {
    summary: $.description,
    status: $.finished,
    category: $.tag[0].tab,
    words: $.total_words.replace("字",""),
    update: $.last_chapter_time.replace("更新于",""),
    lastChapter: $.last_chapter,
    catalog: $.book_id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let time = Math.round(new Date()/1000)
  let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url}&marketChannel=xiaomi&osType=2&packageName=com.letuapp.reader&product=1&sysVer=11&time=${time}&token=&udid=a2b4f4fb-da97-388f-ae30-63d1980f70bc&ver=1.9.8ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString().toUpperCase()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.8",
    appId:"",
    osType:2,
    marketChannel:"xiaomi",
    sign:sign,
    sysVer:11,
    time:time,
    packageName:"com.letuapp.reader",
    book_id:url,
    udid:"a2b4f4fb-da97-388f-ae30-63d1980f70bc",
    token:""
    })
  let response = POST(`http://door.tl05.com/chapter/catalog`,{data})
  let $ = JSON.parse(response)
  let array = []
  $.data.chapter_list.forEach(chapter => {
      array.push({
        name: chapter.chapter_title,
        url: `a?bid=${url}&cid=${chapter.chapter_id}`
      })
    })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let time = Math.round(new Date()/1000)
  let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url.query('bid')}&chapter_id=${url.query('cid')}&marketChannel=xiaomi&osType=2&packageName=com.letuapp.reader&product=1&sysVer=11&time=${time}&token=&udid=a2b4f4fb-da97-388f-ae30-63d1980f70bc&ver=1.9.8ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString().toUpperCase()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.8",
    marketChannel:"xiaomi",
    sign:sign,
    sysVer:11,
    book_id:url.query('bid'),
    token:"",
    appId:"",
    osType:2,
    time:time,
    packageName:"com.letuapp.reader",
    chapter_id:url.query('cid'),
    udid:"a2b4f4fb-da97-388f-ae30-63d1980f70bc"
    })
    let $ = JSON.parse(POST('http://door.tl05.com/chapter/text',{data})).data
  return $.content.trim()
}

var bookSource = JSON.stringify({
  name: "乐兔小说",
  url: "tl05.com",
  version: 101
})

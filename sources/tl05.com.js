require('crypto-js')

//搜索
const search = (key) => {
  let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&keyword=${key}&marketChannel=oppo&osType=2&packageName=com.letuapp.reader&page_num=1&product=1&sysVer=10&time=${Math.round(new Date()/1000)}&token=&udid=a5727bd9-7a6d-3a8c-9367-d1fe25bc09de&ver=1.9.2ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.2",
    marketChannel:"oppo",
    sign:sign,
    page_num:1,
    sysVer:10,
    token:"",
    appId:"",
    osType:2,
    time:Math.round(new Date()/1000),
    packageName:"com.letuapp.reader",
    udid:"a5727bd9-7a6d-3a8c-9367-d1fe25bc09de",
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
    let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url}&marketChannel=oppo&osType=2&packageName=com.letuapp.reader&product=1&sysVer=10&time=${Math.round(new Date()/1000)}&token=&udid=a5727bd9-7a6d-3a8c-9367-d1fe25bc09de&ver=1.9.2ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.2",
    appId:"",
    osType:2,
    marketChannel:"oppo",
    sign:sign,
    sysVer:10,
    time:Math.round(new Date()/1000),
    packageName:"com.letuapp.reader",
    book_id:url,
    udid:"a5727bd9-7a6d-3a8c-9367-d1fe25bc09de",
    token:""
    })
  let response = POST(`http://door.tl05.com/book/info`,{data})
  let $ = JSON.parse(response).data.book
  let book = {
    summary: $.description,
    status: $.finished,
    words: $.total_words.replace("字",""),
    update: $.last_chapter_time.replace("更新于",""),
    catalog: $.book_id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url}&marketChannel=oppo&osType=2&packageName=com.letuapp.reader&product=1&sysVer=10&time=${Math.round(new Date()/1000)}&token=&udid=a5727bd9-7a6d-3a8c-9367-d1fe25bc09de&ver=1.9.2ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.2",
    appId:"",
    osType:2,
    marketChannel:"oppo",
    sign:sign,
    sysVer:10,
    time:Math.round(new Date()/1000),
    packageName:"com.letuapp.reader",
    book_id:url,
    udid:"a5727bd9-7a6d-3a8c-9367-d1fe25bc09de",
    token:""
    })
  let response = POST(`http://door.tl05.com/chapter/new-catalog`,{data})
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
    let sign = CryptoJS.MD5(`p33d3d7giyv8hlsdappId=&book_id=${url.query('bid')}&chapter_id=${url.query('cid')}&marketChannel=oppo&osType=2&packageName=com.letuapp.reader&product=1&sysVer=10&time=${Math.round(new Date()/1000)}&token=&udid=a5727bd9-7a6d-3a8c-9367-d1fe25bc09de&ver=1.9.2ac9de0edzhozh5fwcqi3bn0w5cqvht0u`).toString()
  let data = JSON.stringify({
    product:1,
    ver:"1.9.2",
    marketChannel:"oppo",
    sign:sign,
    sysVer:10,
    book_id:url.query('bid'),
    token:"",
    appId:"",
    osType:2,
    time:Math.round(new Date()/1000),
    packageName:"com.letuapp.reader",
    chapter_id:url.query('cid'),
    udid:"a5727bd9-7a6d-3a8c-9367-d1fe25bc09de"
    })
    let $ = JSON.parse(POST('http://door.tl05.com/chapter/text',{data})).data
  return $.content.trim()
}

var bookSource = JSON.stringify({
  name: "乐兔小说",
  url: "tl05.com",
  version: 100
})

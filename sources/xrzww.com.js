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

const baseUrl = "https://android-api.xrzww.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/api/searchAll?search_type=novel&search_value=${encodeURI(key)}&page=1&pageSize=20`)
  let $ = JSON.parse(response).data
  let array = []
  $.data.forEach((child) => {
    array.push({
      name: child.novel_name,
      author: child.novel_author,
      cover: `http://oss.xrzww.com${child.novel_cover}`,
      detail: `${baseUrl}/api/detail?novel_id=${child.novel_id}`
    })
  })
  return JSON.stringify(array)
}

//详情  
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.novel_info,
    status: $.novel_process == 1 ? '连载' : '完结',
    category: $.novel_tags.replace(/,/g," "),
    words: $.novel_wordnumber,
    update: timestampToTime($.novel_uptime),
    lastChapter: $.novel_newcname,
    catalog: `${baseUrl}/api/novelDirectory?nid=${$.novel_id}&orderBy=asc`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach((booklet) => {
    array.push({ name: booklet.volume_name })
    booklet.chapter_list.forEach((chapter) => {
      array.push({
        name: chapter.chapter_name,
        url: `${baseUrl}/api/readNew?chapter_id=${chapter.chapter_id}&nid=${chapter.chapter_nid}&chapter_order=${chapter.chapter_order}&vid=${chapter.chapter_vid}`,
        vip: chapter.chapter_ispay == 1
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let $ = JSON.parse(GET(url,{headers:
  [`Authorization: Bearer ${localStorage.getItem('auth')}`]
  }))
    //未购买返回403和自动订阅地址
    if ($.data.chapter_ispay==1&&$.data.is_subscribe == 0) throw JSON.stringify({
        code: 403,
        message: `https://h5.xrzww.com/#/pages/bookread/index?data={"nid":${$.data.chapter_nid},"vid":${$.data.chapter_vid},"chapter_id":${$.data.chapter_id},"chapter_order":${$.data.chapter_order}}`
    })
  return $.data.content.trim()
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
    let headers = [`Authorization: Bearer ${localStorage.getItem('auth')}`]
    let $ = JSON.parse(GET(`${baseUrl}/api/getUserInfo`,{headers}))
    if ($.message === '请登录后再访问') throw JSON.stringify({
        code: 401
    })
    return JSON.stringify({
        basic: [
            {
                name: '账号',
                value: $.data.user_nickname,
                url: ''
            },
            {
                name: '书币',
                value: $.data.user_gold2,
                url: '',
            }
        ],
    extra: [
      {
         name: '书架',
         type: 'books',
         method: 'bookshelf'
      }
    ]
  })
}

/**
 * 我的书架
 * @param {页码} page 
 */
const bookshelf = (page) => {
  let response = GET(`${baseUrl}/api/getBookshelfListNew`,{headers: [`Authorization: Bearer ${localStorage.getItem('auth')}`]
  })
  let $ = JSON.parse(response).data
  let books = $.data.map(book => ({
    name: book.novel_name,
    author: book.novel_author,
    cover: `http://oss.xrzww.com${book.novel_cover}`,
    detail: `${baseUrl}//api/detail?novel_id=${book.novel_id}`
  }))
  return JSON.stringify({books})
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://android-api.xrzww.com/api/getTypeNovel?novel_sex=${title}&second_type=${category}&page=${page + 1}`)
  let $ = JSON.parse(response)
  let books = []
  $.data.data.forEach((child) => {
    books.push({
      name: child.novel_name,
      author: child.novel_author,
      cover: `https://oss.xrzww.com${child.novel_cover}`,
      detail: `${baseUrl}/api/detail?novel_id=${child.novel_id}`,
    })
  })
  return JSON.stringify({
    end: $.data.current_page == $.data.last_page,
    books: books
  })
}


const ranks = [
  {
    title: {
      key: '1',
      value: '男频'
    },
    categories: [
      { key: "1", value: "玄幻" },
      { key: "2", value: "仙侠" },
      { key: "3", value: "都市" },
      { key: "4", value: "历史" },
      { key: "5", value: "科幻" },
      { key: "6", value: "奇幻" },
      { key: "7", value: "军事" },
      { key: "11", value: "悬疑" },
      { key: "14", value: "武侠" },
      { key: "12", value: "体育" },
      { key: "13", value: "游戏" },
      { key: "9", value: "轻小说" }
    ]
  },
  {
    title: {
      key: '2',
      value: '女频'
    },
    categories: [
      { key: "83", value: "无CP" },
      { key: "77", value: "现代言情" },
      { key: "80", value: "古代言情" },
      { key: "81", value: "幻想言情" },
      { key: "82", value: "纯爱小说" }
    ]
  }
]

const login = (args) => {
    if(!args) return "账号或者密码不能为空"
    let response = GET(`https://android-api.xrzww.com/api/login?user_name=${args[0]}&user_password=${args[1]}`)
    let $ = JSON.parse(response)
    if($.code == 400) return "账号或密码错误"
    localStorage.setItem("auth", $.data.token)
}

var bookSource = JSON.stringify({
  name: "息壤中文网",
  url: "xrzww.com",
  version: 105,
  authorization: JSON.stringify(['account','password']),
  cookies: ["xrzww.com"],
  ranks: ranks
})

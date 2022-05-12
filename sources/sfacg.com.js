const headers = ["sf-minip-info:minip_novel/1.0.70(android;11)/wxmp"]

//搜索
const search = (key) => {
  let a = JSON.parse(GET(`https://minipapi.sfacg.com/pas/mpapi/search/novels/result?q=${key}&size=20&page=0&expand=`,{headers})).data.novels
  let b = JSON.parse(GET(`https://api.sfacg.com/search/comics/result?q=${key}&expand=novels,comics,albums,chatnovelstags,typeName,authorName,intro,latestchaptitle,latestchapintro,tags,sysTags&sort=hot&page=0&size=12&systagids=`,{headers:["Authorization:Basic Y29taWN1c2VyOmczQGYsRGo1dnJ3c1o=","User-Agent:boluobao_comic/1.4.52(android;29)/XIAOMI/"]})).data.comics
  let $ = a.concat(b)
  let array = []
  $.forEach((child) => {
    array.push({
      name: child.novelName || child.comicName,
      author: child.authorName || child.expand.authorName,
      cover: child.novelCover || child.comicCover,
      detail: child.novelId ? `https://minipapi.sfacg.com/pas/mpapi/novels/${child.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney` : `https://minipapi.sfacg.com/pas/app/comics/${child.comicId}?expand=typeName,intro,markCount,authorName,authorIntro,fav,tags,originalauthor,authoravatar,latestchapter,chapterCount,pointCount,sysTags,discount,discountExpireDate,totalNeedFireMoney`,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(url,{headers})
  let $ = JSON.parse(response).data
  let book = {
    summary: $.expand.intro,
    status: (($.isFinish == false) || ($.isFinished == false)) ? '连载' : '完结',
    category: $.expand.typeName,
    words: $.charCount,
    update: $.lastUpdateTime.match(/.+(?=T)/)[0],
    lastChapter: $.latestChapterTitle || $.expand.latestChapter.title,
    catalog: $.novelId ? `https://minipapi.sfacg.com/pas/mpapi/novels/${$.novelId}/dirs` : `https://minipapi.sfacg.com/pas/app/comics/${$.comicId}/chaps?bn=${$.folderName}&expand=needFireMoney,chapcover`
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(url,{headers})
  let $ = JSON.parse(response)
  let array = []
  if(!url.match(/comics/)) {
    $.data.volumeList.forEach((booklet) => {
      array.push({ name: booklet.title })
      booklet.chapterList.forEach((chapter) => {
        array.push({
          name: chapter.title,
          url: `https://minipapi.sfacg.com/pas/mpapi/Chaps/${chapter.chapId}?expand=content,needFireMoney,originNeedFireMoney,tsukkomi&autoOrder=true`,
          vip: chapter.isVip == true
        })
      })
    })
  }
  else $.data.reverse().forEach((chapter) => {
    array.push({
      name: chapter.chapterTitle,
      url: `https://minipapi.sfacg.com/comics?bid=${chapter.comicId}&pn=${chapter.pathName}&bn=${url.query("bn")}&cid=${chapter.chapterId}`,
      vip: chapter.isVip == true
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  if(!url.match(/comics/)) {
    let $ = JSON.parse(GET(url,{headers}))
    //未购买返回403和自动订阅地址
    if ($.status.msg == "请支持作者的辛勤写作,VIP章节必须登录后才可阅读"||$.status.msg == "请支持作者的辛勤写作,VIP章节必须购买后才可阅读") throw JSON.stringify({
      code: 403,
      message: `https://m.sfacg.com/c/${$.data.chapId}/`
    })
    return $.data.expand.content.trim().replace(/\[img.*?\]/g, '<img src="').replace(/\[.*img\]/g, '"/>')
  }
  let $ = JSON.parse(GET(`https://minipapi.sfacg.com/pas/app/comics/${url.query('bid')}/chappics/${url.query("pn")}?autoOrder=true&maxFreeReaderNum=50`,{headers}))
  //未购买返回403和自动订阅地址
  if ($.status.msg == "请支持作者的辛勤创作,VIP章节必须登录后才可阅读"||$.status.msg == "请支持作者的辛勤创作,VIP章节必须购买后才可阅读") throw JSON.stringify({
    code: 403,
    message: `https://mm.sfacg.com/c/${url.query('cid')}/`
  })
  return ('<img src="' + $.data + '"/>').replaceAll(",https",'\"/>\n<img src=\"https')
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
    let response = GET(`https://minipapi.sfacg.com/pas/mpapi/user`,{headers})
    let response2 = GET(`https://minipapi.sfacg.com/pas/mpapi/user/money`,{headers})
    let $ = JSON.parse(response)
    let  wenmoux = JSON.parse(response2).data
    if ($.status.msg === '需要登录才能访问该资源') throw JSON.stringify({
        code: 401
    })
    return JSON.stringify({
        basic: [
            {
                name: '账号',
                value: $.data.nickName,
                url: 'https://m.sfacg.com/my/'
            },
            {
                name: '火券',
                value: wenmoux.fireMoneyRemain,
                url: 'https://m.sfacg.com/pay/',
            },
            {
                name: '代券',
                value: wenmoux.couponsRemain,
                url: 'https://m.sfacg.com/pay/',
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
  let a = JSON.parse(GET(`https://minipapi.sfacg.com/pas/mpapi/user/Pockets?expand=novels`,{headers})).data
  let aa = a.filter(function(item) {
	return item.name != "漫画" && item.name != "对话小说"
  });
  let b = JSON.parse(GET(`https://minipapi.sfacg.com/pas/app/user/pockets?expand=comics`,{headers})).data
  let bb = b.filter(function(item) {
   	return item.name == "漫画"
  });
  let aaa = []
  aa.forEach((book) => {
     aaa.push(book.expand.novels)
  })
  bb.forEach((book) => {
     bbb = book.expand.comics
  })
  let ab = [].concat.apply([],aaa)//将二维转为一维
  let ac = ab.filter(function(item) {
   	return item.categoryId == 0
  });//过滤对话小说
  let $ = ac.concat(bbb)
  let books = []
  $.forEach((book) => {
    books.push({
      name: book.novelName || book.comicName,
      author: book.authorName || book.authorId,
      cover: book.novelCover || book.comicCover,
      detail: book.novelId ? `https://minipapi.sfacg.com/pas/mpapi/novels/${book.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney` : `https://minipapi.sfacg.com/pas/app/comics/${book.comicId}?expand=typeName,intro,markCount,authorName,authorIntro,fav,tags,originalauthor,authoravatar,latestchapter,chapterCount,pointCount,sysTags,discount,discountExpireDate,totalNeedFireMoney`,
    })
  })
  return JSON.stringify({books})
}

//排行榜
const rank = (title, category, page) => {
  let response = GET(`https://api.sfacg.com/novels/${title}/sysTags/novels?sort=latest&systagids=&isfree=both&isfinish=both&updatedays=-1&charcountbegin=0&charcountend=0&page=${page}&size=20&expand=typeName,tags,discount,discountExpireDate`,{headers:["authorization: Basic YW5kcm9pZHVzZXI6MWEjJDUxLXl0Njk7KkFjdkBxeHE="]})
  let $ = JSON.parse(response)
  let books = []
  $.data.forEach((child) => {
    books.push({
      name: child.novelName,
      author: child.authorName,
      cover: child.novelCover,
      detail: `https://minipapi.sfacg.com/pas/mpapi/novels/${child.novelId}?expand=latestchapter,chapterCount,typeName,intro,fav,ticket,pointCount,tags,sysTags,signlevel,discount,discountExpireDate,totalNeedFireMoney,originTotalNeedFireMoney`,
    })
  })
  return JSON.stringify({
    end:  $.data.length === 0,
    books: books
  })
}


const ranks = [
    {
        title: {
            key: '21',
            value: '魔幻'
        }
    },
    {
        title: {
            key: '22',
            value: '玄幻'
        }
    },
    {
        title: {
            key: '23',
            value: '古风'
        }
    },
    {
        title: {
            key: '24',
            value: '科幻'
        }
    },
    {
        title: {
            key: '25',
            value: '校园'
        }
    },
    {
        title: {
            key: '26',
            value: '都市'
        }
    },
    {
        title: {
            key: '27',
            value: '游戏'
        }
    },
    {
        title: {
            key: '28',
            value: '悬疑'
        }
    }
]

const login = (args) => {
if(!args) return "账号或者密码不能为空"
    let data =`{"username":"${args[0]}","password":"${args[1]}"}`
    let response = POST(`https://minipapi.sfacg.com/pas/mpapi/sessions`,{data,headers})
    let $ = JSON.parse(response)
    if($.status.httpCode == 401) return $.status.msg
}

var bookSource = JSON.stringify({
  name: "SF",
  url: "sfacg.com",
  version: 110,
  authorization: JSON.stringify(['account','password']),
  cookies: ["sfacg.com"],
  ranks: ranks
})

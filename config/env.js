var secret = 'taohualoginpassword';   //密钥
var data = {  //接口返回
	code: 0,
	body: ''
}
var header = {  //头部导航
    index: 0,
	search: '',
	userInfo: {
		
	}
}
var meta = {  // title keywords description
	title: '桃花源 - 最专业的IT技术社区',
	description: '桃花源是一个优质的技术创作社区，在这里，你可以任性地创作，写专业的文章，我们相信，每个人都有自己强大的一面',
	keywords: '桃花源,桃花源官网,图文创作,创作软件,原创社区,博客,IT,技术'
}

module.exports = {
	secret: secret,
	data: data,
	header: header,
	meta: meta
}

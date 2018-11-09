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
	title: '桃花源 - 最清新的倾听社区',
	description: '桃花源是一个优质的技术创作社区，在这里，你可以任性地创作，写专业的文章，我们相信，每个人都有自己强大的一面',
	keywords: '桃花源,桃花源官网,图文创作,创作软件,原创社区,博客,IT,技术'
}

//正式
const port = '80'; 
const mysqlConfig = {
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'taohua'
}
const setDefaults = {
	cache: true
}

//测试
// const port = '3001'; 
// const mysqlConfig = {
// 	host: '47.94.227.198',
// 	user: 'root',
// 	password: 'Lh456123',
// 	database: 'taohua'
// }
// const setDefaults = {
// 	cache: false
// }

module.exports = {
	secret: secret,
	data: data,
	header: header,
	meta: meta,
	port: port,
	mysqlConfig: mysqlConfig,
	setDefaults: setDefaults
}

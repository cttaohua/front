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
	port: port,
	mysqlConfig: mysqlConfig,
	setDefaults: setDefaults
}
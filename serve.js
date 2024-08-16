let http = require('http')
var mysql = require('mysql')
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'info'
})
connection.connect()
global.connection = connection
function start(route) {
	async function onRequest(request, response) {
		if (request.url == '/favicon.ico') return response.end()
		let data = await route(request)
		response.setHeader('Access-Control-Allow-Origin', '*')
		response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
		response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
		response.setHeader('Access-Control-Allow-Credentials', true)
		if (request.method === 'OPTIONS') {
			response.writeHead(200)
			response.end()
		} else {
			// 确保 data 不为 null
			if (data === null || data == []) {
				// 如果 data 为 null，则返回一个默认值或错误信息
				response.writeHead(200, { 'Content-Type': 'application/json' })
				response.end(JSON.stringify({ code: 0, data: null, message: 'Data is null' }))
			} else {
				// 正常处理数据
				response.writeHead(200, { 'Content-Type': 'application/json' })
				data = typeof data === 'string' ? JSON.parse(data) : data
				response.end(JSON.stringify({ code: 1, data, message: '操作成功' }))
			}
		}
	}

	process.on('uncaughtException', function (err) {
		console.log('uncaughtException', err)
	})
	process.on('exit', function (code) {
		console.log('程序退出', code)
	})
	http.createServer(onRequest).listen(5174)
}

exports.start = start

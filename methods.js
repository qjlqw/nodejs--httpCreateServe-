const url = require('url')
const fs = require('fs')
const path = require('path')
const { routerDir, processRouters } = require('./utils')

/**
 * 将url字符串转换为对象
 * @param {String} url
 * @returns {Object}
 */
function URLObject(url) {
	if (Object.prototype.toString.call(url) === '[object String]') {
		const obj = url.split('&').reduce((prev, cur) => {
			const [key, value] = cur.split('=')
			return { ...prev, [key]: value }
		}, {})
		return obj
	} else {
		console.warn('url must be a string')
		return url
	}
}

/**
 * 登录接口的日志
 * */
function loginlog(query, url) {
	query = typeof query === 'string' ? JSON.parse(query) : query
	fs.open('text.txt', 'a+', (err, fd) => {
		if (err) throw err
		else {
			fs.readFile('text.txt', (err, data) => {
				if (err) throw err
				else {
					fs.writeFile('text.txt', data.toString() + `请求接口：${url}}/n`, (err) => {
						if (err) throw err
						else {
							fs.close(fd, (err) => {
								if (err) throw err
							})
						}
					})
				}
			})
		}
	})
}

function get(request) {
	return new Promise(async (resolve, reject) => {
		let result = await routerDir()
		let fun = await processRouters(result, url.parse(request.url).pathname)
		const functionName = fun[0]
		const query = url.parse(request.url).query && URLObject(url.parse(request.url).query)
		await functionName(query)
			.then((res) => {
				resolve(res)
			})
			.catch((err) => {
				reject(`Error:${err}`)
			})
		// 日志
		loginlog(query, request.url)
	})
}
function post(request) {
	return new Promise((resolve, reject) => {
		let body = []
		request.on('data', (chunk) => {
			body.push(chunk)
		})
		request.on('end', async () => {
			body = Buffer.concat(body).toString()
			body = body.includes('{') && body.includes('}') ? body : URLObject(body)
			// 日志
			loginlog(body, request.url)
			let result = await routerDir()
			let fun = await processRouters(result, url.parse(request.url).pathname)
			const functionName = fun[0]
			await functionName(JSON.parse(body))
				.then((res) => {
					resolve(res)
				})
				.catch((err) => {
					console.log('err==>',err);
					reject(`Error:${err}`)
				})
		})
	})
}
/**
 * 读取api目录获取路由api列表
 * @returns {Promise}
 */
// function routerDir() {
// 	return new Promise((resolve, reject) => {
// 		fs.readdir(path.join(__dirname, 'api'), (err, files) => {
// 			if (err) {
// 				reject(new Error(`读取目录失败: ${err.message}`))
// 			} else {
// 				let routers = []
// 				const processFiles = (files) => {
// 					let count = 0
// 					files.forEach((item) => {
// 						fs.stat(path.join(__dirname, 'api', item), (err, stats) => {
// 							if (err) {
// 								reject(new Error(`文件状态检查失败: ${err.message}`))
// 							} else {
// 								if (stats.isDirectory()) {
// 									fs.readdir(path.join(__dirname, 'api', item), (err, subFiles) => {
// 										if (err) {
// 											reject(new Error(`读取子目录失败: ${err.message}`))
// 										} else {
// 											const file = subFiles.map((subFile) => {
// 												return path.join(item, subFile)
// 											})
// 											processFiles(file)
// 										}
// 									})
// 								} else if (stats.isFile()) {
// 									count++
// 									routers.push(path.join(__dirname, 'api', item))
// 									if (count === files.length) {
// 										resolve({ files, routers })
// 									}
// 								}
// 							}
// 						})
// 					})
// 				}

// 				processFiles(files)
// 			}
// 		})
// 	})
// }

/**
 * 获取请求方法
 * @param {Object} result 所有的路由文件
 * @param {String} url 请求路径
 * @returns {Function}
 */
// async function processRouters(result, url) {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const results = await Promise.all(
// 				result.routers.map(async (item) => {
// 					const urlsplit = url.split('/')
// 					let extractedName = urlsplit[urlsplit.length - 1]
// 					const module = require(item)
// 					// 假设模块导出了一个名为 extractedName 的函数
// 					if (module[extractedName]) {
// 						// let res = await module[extractedName]()
// 						return module[extractedName]
// 					}
// 				})
// 			)
// 			const resultValue = results.filter((item) => item !== undefined)
// 			resolve(resultValue) // 解析所有的结果
// 		} catch (error) {
// 			reject(error) // 捕获并拒绝错误
// 		}
// 	})
// }

exports.get = get
exports.post = post

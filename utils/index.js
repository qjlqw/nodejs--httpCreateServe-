const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const stat = util.promisify(fs.stat)

/**
 * 读取api目录获取路由api列表
 * @returns {Promise}
 */
async function routerDir() {
	try {
		const apiPath = path.join(__dirname, '../api')
		const files = await readdir(apiPath)
		const routers = await Promise.all(
			files.map(async (item) => {
				const stats = await stat(path.join(apiPath, item))
				if (stats.isDirectory()) {
					const subFiles = await readdir(path.join(apiPath, item))
					return subFiles.map((subFile) => {
						path.join(path.join(apiPath, item), subFile)
					})
				} else if (stats.isFile()) {
					return path.join(apiPath, item)
				}
				return null
			})
		)

		const flattenedRouters = [].concat(...routers.filter((router) => router !== null))
		return { files, routers: flattenedRouters }
	} catch (err) {
		throw new Error(`读取目录失败: ${err.message}`)
	}
}

const requireCache = {}

/**
 * 获取请求方法
 * @param {Object} result 所有的路由文件
 * @param {String} url 请求路径 要求符合路由规则，且路径为api下最底层js文件加该改文件的对应方法名
 * 例：/api/user/login/loginIN  调用api下user文件夹下的login.js文件下的loginIN方法
 * @returns {Promise<Array<Function>>}
 */
async function processRouters(result, url) {
	console.log(result, requireCache)
	try {
		const urlsplit = url.split('/')
		let extractedName = urlsplit[urlsplit.length - 1]
		const modules = await Promise.all(
			result.routers.map(async (item) => {
				if (!requireCache[item] && item) {
					console.log(item)
					requireCache[item] = require(item)
				}
				const module = requireCache[item]
				if (module && module[extractedName]) {
					return module[extractedName]
				}
			})
		)

		return modules.filter((item) => item !== undefined)
	} catch (error) {
		throw error
	}
}

exports.processRouters = processRouters
exports.routerDir = routerDir

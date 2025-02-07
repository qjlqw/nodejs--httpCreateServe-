const { generateMD5Signature } = require('../../utils/index')
function loginIN(params) {
	return new Promise((resolve, reject) => {
		var searchSql = 'SELECT * FROM user_info WHERE name = ?'
		const paramspassword = generateMD5Signature(params.password)
		const value = [params.username, paramspassword]
		connection.query(searchSql, [params.username], function (err, result) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message)
				reject(err)
				return
			}
			if (result.length > 0) {
				const { name, pawssord } = result[0]
				if (name === params.username && pawssord === paramspassword) {
					resolve(pawssord)
				} else {
					reject('账号密码不正确！')
				}
			} else {
				reject('账号未注册！')
			}
		})
	})
}

function loginOUT() {}

function register(params) {
	return new Promise((resolve, reject) => {
		var addSql = 'INSERT INTO user_info(name,pawssord) VALUES(?,?)'
		const paramspassword = generateMD5Signature(params.password)
		const value = [params.username, paramspassword]
		connection.query(addSql, value, function (err, addresult) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message)
				reject(err)
				return
			}
			resolve(1)
		})
	})
}

exports.loginIN = loginIN
exports.loginOUT = loginOUT
exports.register = register

function loginIN(params) {
	return new Promise((resolve, reject) => {
		var addSql = 'INSERT INTO user_info(name,pawssord) VALUES(?,?)'
		const value = [params.username, params.password]
		connection.query(addSql, value, function (err, result) {
			if (err) {
				console.log('[SELECT ERROR] - ', err.message)
				reject(err)
				return
			}
		})
		resolve(1)
	})
}

function loginOUT() {}

exports.loginIN = loginIN
exports.loginOUT = loginOUT

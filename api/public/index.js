const fs = require('fs')
const path = require('path')

function loginHtml() {
	return new Promise(async (resolve, reject) => {
		const __dirname = path.dirname(__filename)
		const currentDir = __dirname.replace(/\\/g, '/')
		const url = path.join(currentDir.replace('/api/public', ''), 'index.html')
		url.replace(/\\/g, '\\')
		await fs.open(url, 'r', (err, fd) => {
			if (err) throw err
			fs.readFile(fd, (err, data) => {
				if (err) throw err
				resolve(data.toString())
			})
		})
	})
}

exports.loginHtml = loginHtml

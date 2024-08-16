const { get, post } = require('./methods.js')
async function router(request) {
	let data = null
	if (request.method == 'GET') {
		data = get(request)
		return data
	} else if (request.method == 'POST') {
		await post(request).then((res) => {
			data = res
		})
		return data
	}
}
exports.router = router

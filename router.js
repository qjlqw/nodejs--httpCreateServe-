const { get, post } = require('./methods.js')
async function router(request) {
	let data = null
	if (request.method == 'GET') {
		await get(request)
			.then((res) => {
				data = res
			})
			.catch((err) => {
				console.log('err==>',err)
				data = err
			})
		return data
	} else if (request.method == 'POST') {
		await post(request)
			.then((res) => {
				data = res
			})
			.catch((err) => {
				console.log(err)
				data = err
			})
		return data
	}
}
exports.router = router

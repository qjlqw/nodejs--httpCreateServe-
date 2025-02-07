const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8888 })
// 存储所有连接的客户端
const clients = new Set()

wss.on('connection', function connection(ws) {
	// 添加新连接的客户端到集合中
	clients.add(ws)
	ws.on('message', (message) => {
		console.log('received: %s', message)
		// 广播消息给所有客户端（除了发送消息的客户端）
		clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		})
	})
	ws.on('close', () => {
		console.log('连接断开')
	})
})

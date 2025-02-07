let http = require("http");
// var mysql = require("mysql");
const { errMsg } = require("./utils/errCode");
// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'info'
// })
// connection.connect()
// global.connection = connection

// const WS = require("./utils/WebSocket.js");

function start(route) {
  async function onRequest(request, response) {
    if (request.url == "/favicon.ico") return response.end();
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type,Authorization"
    );
    response.setHeader("Access-Control-Allow-Credentials", true);
    let data = await route(request);
    if (request.method === "OPTIONS") {
      response.writeHead(200);
      response.end();
    } else {
      // 确保 data 不为 null
      if (errMsg.includes(data)) {
        // 如果 data 为 null，则返回一个默认值或错误信息
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ code: 0, data: null, message: data }));
      } else if(data.includes('Error:')) {
        response.writeHead(500, { "Content-Type": "application/json" });
        response.end();
      }
       else {
        // 正常处理数据
        response.writeHead(200, { "Content-Type": "application/json" });
        // data = typeof data === 'string' ? JSON.parse(data) : data
        response.end(JSON.stringify({ code: 1, data, message: "操作成功" }));
      }
    }
  }
  const server = http.createServer(onRequest).listen(5174);

  // 设置全局响应对象
  function setGlobalResponse(res) {
    global.currentRes = res;
  }
  // 清除全局响应对象
  function clearGlobalResponse() {
    global.currentRes = null;
  }

  // 监听请求
  server.on("request", (req, res) => {
    setGlobalResponse(res); // 设置全局响应对象
    res.on("finish", clearGlobalResponse); // 请求完成后清除全局响应对象
  });

  // 错误处理函数
  function handleServerError(res, error) {
    console.error("Error:", error.message);
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }

  process.on("uncaughtException", function (err) {
    console.log("uncaughtException", err);
    const errmsg = new Error(`uncaughtException:${err}`);
    let currentRes = null; // 获取当前请求的响应对象

    // 尝试从全局变量中获取当前的响应对象
    if (global.currentRes) {
      currentRes = global.currentRes;
    }

    // 如果找到了响应对象，则发送错误响应
    if (currentRes) {
      handleServerError(currentRes, err);
    }
  });
  process.on("SIGINT", function () {
    console.log("程序退出");
    // connection.end();
    process.exit(0);
  });

  process.on("exit", function (code) {
    console.log("程序退出", code);
  });
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "Reason:", reason);
    const err = new Error(`Unhandled Rejection at:${promise},Reason:${reason}`);
    let currentRes = null; // 获取当前请求的响应对象

    // 尝试从全局变量中获取当前的响应对象
    if (global.currentRes) {
      console.log("global.currentRes", global.currentRes.statusCode);
      currentRes = global.currentRes;
    }

    // 如果找到了响应对象，则发送错误响应
    if (currentRes) {
      handleServerError(currentRes, err);
    }
  });
}

function expressInstance() {
  const express = require("express");
  const app = express();
  const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
  });
}

exports.expressInstance = expressInstance;
exports.start = start;

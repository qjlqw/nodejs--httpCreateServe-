const serve = require("./serve.js");
const router = require("./router.js");

serve.start(router.router);
// serve.expressInstance();
console.log("%c Server running at http://127.0.0.1:5174/", "color:red");

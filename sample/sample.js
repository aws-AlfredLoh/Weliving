//引入node的http模組。
const http = require("http");

//定義個function來處理即將到來的http request.
requestHandler = (request, response) => {

    // 回傳JSON格式的response訊息
    const json = JSON.stringify({
        say: "hi",
    });

    response.end(json);
}

//使用http模組來建立一個server，並使用上述定義的function來處理request.
const server = http.createServer(requestHandler);

//啟動server並使用3333的port.
server.listen(3333);
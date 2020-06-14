// 第三方模块

// import { hello } from "https://cdn.zce.me/demo/mod.ts";
// console.log(hello("liuhuijun"));

import { serve } from "https://deno.land/std/http/server.ts";
const server = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of server) {
  req.respond({ body: "Hello World\n" });
}

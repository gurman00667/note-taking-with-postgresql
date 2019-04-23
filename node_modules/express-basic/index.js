var server=require("./server");
server().listen(server().get('port'));
console.log("At 8888");
function sendText(){
    var docs = document.getElementById("docs");
    var title = document.getElementById("Title");
    var tl = title.innerHTML;
    var tx = docs.innerHTML;
    publish('ctos.text', tl, tx);
}

// function search(){
//     var resultArea = document.getElementById("srchrslt");
//     subscribe();
// }

var eb = new vertx.EventBus("https://localhost/eventbus");

eb.onopen = function() {};
eb.onclose = function() {
    eb = null;
};

function subscribe(address) {
    if (eb) {
        eb.registerHandler(address, function(msg, replyTo) {

        });
    }
}

function publish(address, tl, tx) {
    console.log("publish----------------");
    if (eb) {
        var content = {"title": tl,"text": tx};
        eb.publish(address, content);
    }
}

// eb.registerHandler("stoc.data", function(msg){
//     nickname = msg['nickname'];
//
// });

function sendText(){
    var docs = document.getElementById("docs");
    var title = document.getElementById("Title");
    var tx = docs.innerHTML;
    var tl = title.innerHTML;
    publish('ctos.text', tl, tx);
}

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

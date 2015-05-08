function origin(){};

origin.prototype.heap = function(){
	var args = Array.prototype.slice.call(arguments);

	this.cbPos = 0;
	this.cbLeng = args[1].length;
	this.callbacks = args[1];

	args[0].push(this.step);
	this.callbacks[0].apply(null, args[0]);
};
origin.prototype.step = function(){
	var args = Array.prototype.slice.call(arguments);

	wtf.cbPos++;
	if(wtf.cbPos < wtf.cbLeng){
		args.push(wtf.step);
		wtf.callbacks[wtf.cbPos].apply(null, args);
	}else{
		// here will be end scope
		// but i think it is not necessary to me so i don't make it
	}
};

var wtf = new origin();

// ####### EX #######
// wtf.heap([
// 	"a", "b"
// ],
// [
// 	function(a, b, cb){
// 		// console.log(cb);
// 		console.log("a: "+a+" b: "+b);
// 		var c = "c";
// 		cb(c);
// 	},
// 	function(c, cb){
// 		console.log("c: "+c);
// 		var d ="d";
// 		var e ="e";
// 		var f = "f";
// 		cb(d, e, f);
// 	},
// 	function(d, e, f, cb){
// 		console.log("d: "+d+" e: "+e+" f: "+f);
// 		cb();	// for end scope but will not make it
// 	}
// ],
// function(){
// 	// here for end scope. if you think you need it, make it.
// });

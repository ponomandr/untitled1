Object.defineProperty(Object.prototype, "__defineGetter__", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function (name, func) {
        Object.defineProperty(this, name, {configurable: true, enumerable: true, get: func});
    }
});

var natives = {};
var nativeList = __Main.listNatives();
for (var i = 0; i < nativeList.length; i++) {
    var fileName = nativeList[i];
    var moduleName = fileName.substr(0, fileName.lastIndexOf('.js'));
    natives[moduleName] = __Main.readResource('/lib/' + fileName);
}
natives.config = "#\n{}";

var processFunction = load(__Main.getResource('/process.js'));
process = processFunction(natives, PROCESS);

var nodeFunction = load(__Main.getResource('/src/node.js'));
nodeFunction(process);


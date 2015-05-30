Object.defineProperty(Object.prototype, "__defineGetter__", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function (name, func) {
        Object.defineProperty(this, name, {configurable: true, enumerable: true, get: func});
    }
});

var natives = {};
for (var i = 0; i < nativeModuleList.length; i++) {
    var fileName = nativeModuleList[i];
    var moduleName = fileName.substr(0, fileName.lastIndexOf('.js'));
    natives[moduleName] = __Main.readResource('/lib/' + fileName);
}
natives.config = "#\n{}";

var processFunction = load(__Main.getResource('/process.js'));
var process = processFunction(natives);

var nodeFunction = load(__Main.getResource('/src/node.js'));
nodeFunction(process);


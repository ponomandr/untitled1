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

var bindings = {
    natives: natives,
    contextify: {
        ContextifyScript: function (code, options) {
            this.runInContext = function (sandbox, options) {
                return __Main.runInContext(code, sandbox, "process.js");
            };

            this.runInThisContext = function (options) {
                var fileName = options ? options.fileName : '<<eval>>';
                return eval(code);
            };
        }
    },
    smalloc: {
        kMaxLength: 0x3fffffff,
        alloc: function () {
        },
        truncate: function () {
        },
        sliceOnto: function () {
        }
    },
    buffer: {
        setupBufferJS: function () {
        }
    },
    fs: {
        FSInitialize: function () {
        }
    },
    constants: {},
    timer_wrap: {
        Timer: {
            kOnTimeout: 0
        }
    },
    cares_wrap: {},
    uv: {},
    pipe_wrap: {},
    tcp_wrap: {},
    stream_wrap: {},
    tty_wrap: {
        isTTY: function () {
            return false;
        },
        guessHandleType: function () {
            return 'TTY';
        },
        TTY: function () {
            this.shutdown = function () {

            };
            this.readStart = function () {

            };
            this.readStop = function () {

            }
        }
    }
};


function binding(name) {
    print('init.js: binding(\'' + name + '\')');
    if (bindings[name]) return bindings[name];
    throw new Error('No such module: ' + name);
}

var process = {
    moduleLoadList: [],
    binding: binding,
    execPath: PROCESS.cwd() + '/dummy',
    argv: Java.from(PROCESS.argv),
    env: PROCESS.env,
    cwd: function () {
        return PROCESS.cwd;
    },
    _setupNextTick: function () {
    }
};


var nodeFunction = load(__Main.getResource('/src/node.js'));
nodeFunction(process);


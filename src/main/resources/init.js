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


function dummy(name, result) {
    return function () {
        print('[init.js] function "' + name + '" is not implemented');
        return result;
    }
}

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
        alloc: dummy('smalloc.alloc'),
        truncate: dummy('smalloc.truncate'),
        sliceOnto: dummy('smalloc.sliceOnto')
    },
    buffer: {
        setupBufferJS: dummy('buffer.setupBufferJS')
    },
    fs: {
        FSInitialize: dummy('fs.FSInitialize')
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
        isTTY: dummy('tty_wrap.isTTY', false),
        guessHandleType: dummy('tty_wrap.guessHandleType', 'TTY'),
        TTY: function () {
            this.shutdown = dummy('tty_wrap.TTY.shutdown');
            this.readStart = dummy('tty_wrap.TTY.readStart');
            this.readStop = dummy('tty_wrap.TTY.readStop');
        }
    }
};


function binding(name) {
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
    _setupNextTick: dummy('process._setupNextTick')
};


var nodeFunction = load(__Main.getResource('/src/node.js'));
nodeFunction(process);


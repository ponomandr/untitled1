(function (natives, PROCESS) {

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
            },
        },
    };


    function binding(name) {
        print('process.js: binding(\'' + name + '\')');
        if (bindings[name]) return bindings[name];
        throw new Error('No such module: ' + name);
    }

    var process = {};
    process.moduleLoadList = [];
    process.binding = binding;
    process._setupNextTick = function () {
    };
    process.execPath = PROCESS.cwd() + '/dummy';
    process.argv = Java.from(PROCESS.argv);
    process.env = PROCESS.env;
    process.cwd = function () {
        return PROCESS.cwd;
    };


    function NativeModule(id) {
        this.filename = id + '.js';
        this.id = id;
        this.exports = {};
        this.loaded = false;
    }

    NativeModule._source = process.binding('natives');
    NativeModule._cache = {};

    NativeModule.require = function (id) {
        if (id == 'native_module') {
            return NativeModule;
        }

        var cached = NativeModule.getCached(id);
        if (cached) {
            return cached.exports;
        }

        if (!NativeModule.exists(id)) {
            throw new Error('No such native module ' + id);
        }

        process.moduleLoadList.push('NativeModule ' + id);

        var nativeModule = new NativeModule(id);

        nativeModule.cache();
        nativeModule.compile();

        return nativeModule.exports;
    };

    NativeModule.getCached = function (id) {
        return NativeModule._cache[id];
    }

    NativeModule.exists = function (id) {
        return NativeModule._source.hasOwnProperty(id);
    }

    NativeModule.getSource = function (id) {
        return NativeModule._source[id];
    }

    NativeModule.wrap = function (script) {
        return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
    };

    NativeModule.wrapper = [
        '(function (exports, require, module, __filename, __dirname) { ',
        '\n});'
    ];

    NativeModule.prototype.compile = function () {
        var source = NativeModule.getSource(this.id);
        source = NativeModule.wrap(source);

        print('process.js: Compile native module ' + this.id + ' (' + this.filename + ')');
        var fn = eval(source);
        fn(this.exports, NativeModule.require, this, this.filename);

        this.loaded = true;
    };

    NativeModule.prototype.cache = function () {
        NativeModule._cache[this.id] = this;
    };

    return process;
});
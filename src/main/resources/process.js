(function (natives) {

    var ContextifyScript = function (code, options) {
        this.runInContext = function (sandbox, options) {
            return __Main.runInContext(code, sandbox, "process.js");
        };

        this.runInThisContext = function (options) {
            var fileName = options ? options.fileName : '<<eval>>';
            return eval(code);
        };
    };

    function binding(name) {
        print('process.js: binding("' + name + '")');
        if (name == 'natives') {
            return natives;
        }
        if (name == 'contextify') {
            return {
                ContextifyScript: ContextifyScript
            }
        }
        if (name == 'smalloc') {
            return {
                kMaxLength: 0x3fffffff,
                alloc: function () {
                },
                truncate: function () {
                },
                sliceOnto: function () {
                }
            }
        }
        if (name == 'buffer') {
            return {
                setupBufferJS: function () {
                }
            }
        }

        throw new Error('No such module: ' + name);
    }


    var process = {};
    process.binding = binding;
    process.moduleLoadList = [];

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
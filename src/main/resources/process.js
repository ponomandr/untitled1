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

    var builtInModules = {};

    return {
        moduleLoadList: [],

        binding: function (name) {
            print('get binding ' + name);
            if (builtInModules[name]) {
                print('built in found ' + name);
                return builtInModules[name];
            }
            if (natives[name]) {
                print('load built in ' + name);
                print(require);
                builtInModules[name] = eval('(function (exports, require, module, __filename, __dirname) { ' +
                    __Main.readResource('/lib/' + name + '.js') + '\n});');
                print('built in loaded ' + name);
                return builtInModules[name];
            }
            if (name == 'natives') {
                return natives;
            }
            if (name == 'contextify') {
                return {
                    ContextifyScript: ContextifyScript
                }
            }

            throw new Error('No such module: ' + name);
        }
    }
});
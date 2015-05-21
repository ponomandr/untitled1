(function (natives) {

    // natives is not JS object, but Java HashMap
    natives.hasOwnProperty = function (name) {
        return this.containsKey(name);
    };

    var ContextifyScript = function (code, options) {
        this.runInContext = function (sandbox, options) {
            return __Main.runInContext(code, sandbox, "init.js");
        };

        this.runInThisContext = function (options) {
            // TODO: this
            return __Main.runInContext(code, Object.create(this), "init.js");
        };
    };

    return {
        moduleLoadList: [],

        binding: function (name) {
            if (name == 'natives') {
                return natives;
            }
            if (name == 'contextify') {
                return {
                    ContextifyScript: ContextifyScript
                }
            }
            return {};
        }
    }
});
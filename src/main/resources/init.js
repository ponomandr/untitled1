(function (natives) {

    // natives is not JS object, but Java HashMap
    natives.hasOwnProperty = function (name) {
        return this.containsKey(name);
    };

    var ContextifyScript = function (code, options) {
        this.runInContext = function () {
            // return function that wraps the code and has some context as 'this'
        };

        this.runInThisContext = function () {
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
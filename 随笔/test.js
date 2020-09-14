var Hello = /** @class */ (function () {
    function Hello() {
    }
    Object.defineProperty(Hello.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hello.prototype, "age", {
        get: function () {
            return this._age;
        },
        set: function (age) {
            if (age > 0 && age < 100) {
                console.log("年龄在0-100之间"); // 年龄在0-100之间
                return;
            }
            this._age = age;
        },
        enumerable: false,
        configurable: true
    });
    return Hello;
}());
var hello = new Hello();
hello.name = "muyy";
hello.age = 230;
console.log(hello.name); // muyy

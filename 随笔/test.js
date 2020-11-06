// var Hello = /** @class */ (function () {
//     function Hello() {
//     }
//     Object.defineProperty(Hello.prototype, "name", {
//         get: function () {
//             return this._name;
//         },
//         set: function (value) {
//             this._name = value;
//         },
//         enumerable: false,
//         configurable: true
//     });
//     Object.defineProperty(Hello.prototype, "age", {
//         get: function () {
//             return this._age;
//         },
//         set: function (age) {
//             if (age > 0 && age < 100) {
//                 console.log("年龄在0-100之间"); // 年龄在0-100之间
//                 return;
//             }
//             this._age = age;
//         },
//         enumerable: false,
//         configurable: true
//     });
//     return Hello;
// }());
// var hello = new Hello();
// hello.name = "muyy";
// hello.age = 230;
// console.log(hello.name); // muyy

class String {
  constructor() {
    this.words = ''
  }
  addWord(word) {
    this.words += word
    return this
  }
  search(word) {
    let word1 = word.replace(/[\.]/g, '')
    console.log(word1)
    return this.words.indexOf(word1) === -1 ? false : true
  }
}


let s = new String()
let s1 = s.addWord('fffff')
s1.addWord("bad")
s1.addWord("dad")
s1.addWord("mad")
console.log(s1)
console.log(s1.search('fff'))
console.log(s1.search("pad"))
console.log(s1.search("bad"))
console.log(s1.search(".ad"))



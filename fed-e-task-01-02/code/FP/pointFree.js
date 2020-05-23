const fp = require('lodash/fp')
// const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)

// console.log(f('hello     World'))

// 把一个字符串中的首字母提取并换成大写字母，使用.作为分隔符
// world wild web => W. w. w.
// const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))

const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))
console.log(firstLetterToUpper('world wild web'))
<h1>刘惠俊 | Part1 | 模块一</h1>
<h2>简答题</h2>

<h3>第一题</h3>
  &nbsp;&nbsp;&nbsp;&nbsp;最终执行结果：10.<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;原因：首先我们需要明确的每一次循环都会在a数组后push一个函数，这个函数打印i，等10次循环完了后，就等于往a数组里push了10个打印i的函数.我们知道用var声明的变量没有作用域，所以等这个循环结束后i的值就变为了10，所以不管我们执行a数组里的哪个函数，最后都会打印10，我们可以使用闭包来解决这个问题。如果当前运行环境支持es6的话，我们可以用let替代var，这样就有了作用域的概念，则每次都会打印当前的i。
<h3>第二题</h3>
&nbsp;&nbsp;&nbsp;&nbsp;最终执行结果：报错。<br/>
&nbsp;&nbsp;&nbsp;&nbsp;原因：const和let声明的变量必须要在声明之后才可以使用，用var声明的变量才存在变量提升.
<h3>第三题</h3>
```
    let arr = [12,34,32,89,4]
    let res = arr.reduce((preValue, curValue)=>{
      let result;
      if (preValue < curValue) {
        result = preValue
      } else {
        result = curValue
      }
      return result
    })
```
  

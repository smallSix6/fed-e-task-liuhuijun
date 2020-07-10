

# 六子 TensorFlow.js 学习笔记

## part一、Tensors
### 1、Creation:我们具有用于标量，1D，2D，3D和4D张量的常见情况的实用程序功能，以及许多用于以对机器学习有用的方式初始化张量的功能。
  + tf.tensor(values, shape?, dtype?)  
    + 参数：
      + values （TypedArray| Array） 张量的值。可以是数字的嵌套数组，平面数组或 TypedArray。如果值为字符串，则将其编码为 utf-8 并保留为 Uint8Array[]。
      + shape （number []） 张量的形状。可选的。如果未提供，则从中推断 values。 可选的
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 数据类型。 可选的
      + 返回值： tf.Tensor
    + tf.tensor([1, 2, 3, 4]).print(),打印如下信息：
    ```javascript
      Tensor
          [1, 2, 3, 4]
    ```
    + tf.tensor([1, 2, 3, 4], [2, 2]).print(),打印信息如下：
    ```javascript
      Tensor
        [[1, 2],
        [3, 4]]
    ```
  + tf.scalar (value, dtype?)
    + 使用提供的 value 和 dtype 创建 rank-0 的 tf.Tensor（标量）。使用tf.tensor（）可以实现相同的功能，但是通常我们建议使用tf.scalar（），因为它使代码更具可读性。
    + 参数：
      + value （number | boolean | string | Uint8Array） 标量的值。
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 数据类型。 可选的
      + 返回值： tf.Scalar
    + tf.scalar(3.14).print()，打印信息如下：
    ```js
    Tensor
        3.140000104904175
    ```
  + tf.tensor1d (values, dtype?)
    + 使用提供的 value 和 dtype 创建 rank-1 的 tf.Tensor（标量）。使用tf.tensor（）可以实现相同的功能，但是通常我们建议使用tf.tensor1d（），因为它使代码更具可读性。
    + 参数：
      + values （TypedArray| Array） 张量的值。可以是数字数组或 TypedArray。
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 数据类型。 可选的
      + 返回值： tf.Tensor1D
    + tf.tensor1d([1, 2, 3]).print(),打印信息如下：
      ```js
      Tensor
          [1, 2, 3]
      ```
  + tf.tensor2d (values, shape?, dtype?)
    + 使用提供的 value 和 dtype 创建 rank-2 的 tf.Tensor（标量）。使用tf.tensor（）可以实现相同的功能，但是通常我们建议使用tf.tensor2d（），因为它使代码更具可读性。
    + 参数：
      + values （TypedArray| Array） 张量的值。可以是数字数组或 TypedArray。
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 数据类型。 可选的
      + 返回值： tf.Tensor2D
    + tf.tensor2d([[1, 2], [3, 4]]).print(),打印信息如下：
      ```js
      Tensor
        [[1, 2],
        [3, 4]]
      ```
    + tf.tensor2d([1, 2, 3, 4], [2, 2]).print(),打印信息如下：
      ```js
      Tensor
        [[1, 2],
        [3, 4]]
      ```
  + tf.tensor3d, tf.tensor4d, tf.tensor5d, tf.tensor6d 和 tf.tensor2d 类似，这里不一一赘述
  + tf.buffer (shape, dtype?, values?)
    + 使用特定的 shape 和 dtype 创建一个空的 tf.TensorBuffer。这些值作为 TypedArray 存储在 CPU 中。使用 buffer.set() 或直接修改来填充缓冲区 buffer.values。完成后，调用 buffer.toTensor() 以获取具有这些值的不可变 tf.Tensor。
    + 参数：
      + shape （number []） 定义输出张量形状的整数数组。
      + dtype （'float32'） 缓冲区的 dtype。默认为 'float32'。 可选的
      + values （DataTypeMap ['float32']） 缓冲区的值为 TypedArray。默认为零。 可选的
    + 返回： tf.TensorBuffer
    + 代码示例如下：
      ```js
      // Create a buffer and set values at particular indices.
      const buffer = tf.buffer([2, 2]);
      buffer.set(3, 0, 0);
      buffer.set(5, 1, 0);

      // Convert the buffer back to a tensor.
      buffer.toTensor().print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [[3, 0],
          [5, 0]]
      ```
  + tf.clone（x）
    + 创建一个具有与指定张量相同的值和形状的新张量。
    + 参数：
      + x （tf.Tensor|TypedArray| Array） 要克隆的张量。
      + 返回值： tf.Tensor
    + 代码示例如下：
      ```js
      const x = tf.tensor([1, 2]);
      x.clone().print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [1, 2]
      ```
  + tf.complex（real，imag）
    + 将两个实数转换为复数。给定一个 real 表示复数的实部的张量和一个 imag 表示复数的虚部的张量，此操作将以[r0，i0，r1，i1]的形式逐元素返回复数，其中r表示实部，i 代表虚部的一部分。输入张量 real 和 imag 必须具有相同的形状。
    + 参数：
      + real （tf.Tensor|TypedArray|Array）
      + imag （tf.Tensor|TypedArray|Array）
    + 返回值： tf.Tensor
    + 代码示例如下：
      ```js
      const real = tf.tensor1d([2.25, 3.25]);
      const imag = tf.tensor1d([4.75, 5.75]);
      const complex = tf.complex(real, imag);
      complex.print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [2.25 + 4.75j, 3.25 + 5.75j]
      ```
  + tf.eye (numRows, numColumns?, batchShape?, dtype?)
    + 创建一个单位矩阵。
    + 参数：
      + numRows （数字） 行数。
      + numColumns （数字） 列数。默认为 numRows。 可选的
      + batchShape （[ number ]|[number, number]|[number, number, number]|[number, number, number, number]） 如果提供，会将批处理形状添加到返回的tf形状的开头。通过重复单位矩阵。 可选的
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 数据类型。 可选的
    + 返回值： tf.Tensor2D
    + 代码示例如下：
      ```js
      tf.eye(2).print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [[1, 0],
          [0, 1]]
      ```
  + tf.fill（shape，value，dtype？）
    + 创建一个用标量值填充的tf.Tensor。
    + 参数：
      shape （number []） 定义输出张量形状的整数数组。
      value （number | string） 用来填充张量的标量值。
      dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 所得张量中元素的类型。默认为“浮动”。 可选的
    + 返回值： tf.Tensor
    + 代码示例如下：
      ```js
      tf.fill([2, 2], 4).print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [[4, 4],
          [4, 4]]
      ```
  + tf.imag（input）
    + 返回复数（或实数）张量的虚部。给定张量输入，此操作将返回 float 类型的张量，该张量是输入中每个元素的虚部，被视为复数。如果输入为实，则返回全零的张量。
    + 参数：
     + input (tf.Tensor|TypedArray|Array)
    + 返回值： tf.Tensor
    + 代码示例如下：
      ```js
      const x = tf.complex([-2.25, 3.25], [4.75, 5.75]);
      tf.imag(x).print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [4.75, 5.75]
      ```
  + tf.linspace（开始，停止，编号）
    + 在给定的间隔内返回均匀间隔的数字序列。
    + 参数：
      + start （number） 序列的起始值。
      + stop （number） 序列的结束值。
      + num （number） 要生成的值的数目。
    + 返回值： tf.Tensor1D
    + 代码示例如下：
      ```js
      tf.linspace(0, 9, 10).print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      ```
  + tf.oneHot (indices, depth, onValue?, offValue?)
    + 创建一个 one-hot tf.Tensor。 indices 取值代表的位置 onValue（默认为1），而其他所有位置取值 offValue（默认为0）。如果 indices 为 rank R，则输出的 rank R+1 为 size 的最后一个轴 depth。
    + 参数：
      indices (tf.Tensor|TypedArray|Array) tf.Tensor 的 dtype int32 的 indeices
      depth （数字） 一个热尺寸的深度。
      onValue （数字） 当索引与位置匹配时用于填充输出的数字。 可选的
      offValue （数字） 当索引与位置不匹配时用于填充输出的数字。 可选的
    + 返回值： tf.Tensor
    + 代码示例如下：
      ```js
      let x = tf.tensor1d([1, 1, 2], 'int32')
      x.print()
      tf.oneHot(x, 4).print();
      ```
    + 上述代码打印结果如下：
      ```js
      Tensor
          [1, 1, 2]
      Tensor
          [[0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0]]
      ```
  + tf.ones (shape, dtype?)
    + 创建一个所有元素都设置为1 的 tf.Tensor。
    + 参数：
      + shape （number []） 定义输出张量形状的整数数组。
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 所得张量中元素的类型。默认为“浮动”。 可选的
    + 返回值： tf.Tensor
    + 代码示例：
      ```js
      tf.ones([2, 2]).print();
      /* Tensor
          [[1, 1],
          [1, 1]]
      */
      ```
  + tf.onesLike（x）
    + 创建一个 tf.Tensor，将所有元素设置为1，其形状与给定张量相同。
    + 参数：
    + x (tf.Tensor|TypedArray|Array) 张量.
    + 返回值： tf.Tensor
    + 代码示例：
      ```js
      const x = tf.tensor([1, 2]);
      tf.onesLike(x).print();
      /* Tensor
            [1, 1]
      */
      ```   
  + tf.print (x, verbose?)
    + 打印有关tf.Tensor的信息，包括其数据。
    + 参数：
      + x (tf.Tensor) 要打印的张量。
      + verbose （布尔值） 是否打印有关的详细信息Tensor，包括dtype和size。 可选的
    + 返回： void
    + 代码示例：
      ```js
      const verbose = true;
      tf.tensor2d([1, 2, 3, 4], [2, 2]).print(verbose);
      /* 
      Tensor
        dtype: float32
        rank: 2
        shape: [2,2]
        values:
          [[1, 2],
          [3, 4]]
      */
      ```
  + tf.range (start, stop, step?, dtype?)
    + 创建一个新的 tf.Tensor1D，其中填充了提供的范围内的数字。张量是一个半开间隔，表示它包括开始，但不包括停止。还支持递减范围和负步进值。
    + 参数：
      + start （number） 整数起始值
      + stop （number） 一个整数停止值
      + step （number） 整数增量（默认为1或-1） 可选
      + dtype （'float32'|'int32'） 输出张量的数据类型。默认为'float32'。 可选的
    + 返回值： tf.Tensor1D
    + 代码示例：
      ```js
      tf.range(0, 9, 2).print();
      /* 
      Tensor
        [0, 2, 4, 6, 8]
      */
  + tf.real（input）
    + 返回复数（或实数）张量的实部。给定张量输入，此操作将返回 float 类型的张量，该张量是输入中每个元素的实数部分，被视为复数。如果输入是 real 的，则仅进行克隆
    + 参数：
      + input (tf.Tensor|TypedArray|Array)
    + 返回值： tf.Tensor
    + 代码示例：
      ```js
      const x = tf.complex([-2.25, 3.25], [4.75, 5.75]);
      tf.real(x).print();
      /* 
      Tensor
        [-2.25, 3.25]
      */
  + tf.truncatedNormal (shape, mean?, stdDev?, dtype?, seed?)
    + 创建一个 tf.Tensor，其值从截断的正态分布中采样。生成的值遵循具有指定均值和标准偏差的正态分布，不同之处在于，将丢弃幅度大于均值2个标准差的值并重新选择。产生截断正态分布随机数，取值范围为 [ mean - 2 * stddev, mean + 2 * stddev ]
    + 参数：
      + shape （number []） 定义输出张量形状的整数数组。
      + mean （number） 正态分布的平均值,默认为 0.0。 可选的
      + stdDev （number） 正态分布的标准偏差，默认为 1.0。 可选的
      + dtype （'float32'|'int32'） 输出张量的数据类型。 可选的
      + seed （number） 随机数生成器的种子。 可选的
    + 返回值： tf.Tensor
    + 代码示例：
      ```js
      tf.truncatedNormal([2, 2]).print();
      /* 
        Tensor
          [[0.3969676，-0.3903245]，[1.1683369，-0.3209883]]
      */
      ```
  + tf.variable (initialValue, trainable?, name?, dtype?)
    + 使用提供的初始值创建一个新变量。
    + 参数：
      + initialValue (tf.Tensor) 张量的初始值。
      + trainable （布尔值） 如果为 true，则允许优化器对其进行更新。 可选的
      + name （字符串） 变量的名称。默认为唯一ID。 可选的
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 如果设置，则 initialValue 将转换为给定类型。 可选的
    + 返回： tf.Variable
    + 代码示例：
      ```js
      const x = tf.variable(tf.tensor([1, 2, 3]));
      x.assign(tf.tensor([4, 5, 6]));
      x.print();
      /* 
        Tensor
          [4，5，6]
      */
      ```
  + tf.zeros (shape, dtype?)
    + 创建所有元素都设置为0 的 tf.Tensor。
    + 参数：
      + shape （number []） 定义输出张量形状的整数数组。
      + dtype （'float32'|'int32'|'bool'|'complex64'|'string'） 所得张量中元素的类型。可以是'float32'，'int32'或'bool'。默认为“浮动”。 可选的
    + 返回值： tf.Tensor
    + 代码示例：
      ```js
      tf.zeros([2, 2]).print();
      /* 
        Tensor
          [[0, 0],  
            [0, 0]]
      */
      ```
  + tf.zerosLike (x)
    + 创建一个 tf.Tensor，将所有元素设置为0，并具有与给定张量相同的形状。
    + 参数：
      + x (tf.Tensor|TypedArray|Array) 所需形状的张量。
    + 返回值： tf.Tensor
    + 代码示例
      ```js
      const x = tf.tensor([1, 2]);
      tf.zerosLike(x).print();
      /* 
      Tensor
          [0, 0]
      */
      ```

### 2、Classes：本部分显示TensorFlow.js中与Tensor相关的主要类以及我们在其上公开的方法。

### 3、Transformations：本部分描述了一些用于重塑和类型转换的常见Tensor转换。





## part二、Models
## part三、Layers
## part四、Operations
## part五、Training
## part六、Performance
## part七、Environment
## part八、Constraints
## part九、Initializers
## part十、Regularizers
## part十一、Data
## part十二、Util
## part十三、Browser
## part十四、Backends
## part十五、Metrics
## part十六、Callbacks
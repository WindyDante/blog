---
title: Vue2
tags: Vue
date: 2023-09-19
---
# Vue核心

## 搭建Vue环境

先在此处附上Vue的安装教程地址：https://v2.cn.vuejs.org/v2/guide/installation.html

这里有两个版本，一个开发版本，一个生产版本

开发版本是在开发时使用的，当出现问题的时候会在控制台报警告

生产版本是在项目上线时使用的，不会有警告，而且体积更小

![image-20230919083405727](https://s2.loli.net/2023/09/19/xHtPB7nUyQM3VSF.png)

在这里，我使用的是开发版本，学习一般使用开发版

将开发版本下载后保存到本地，使用方法与jquery是一致的，使用来script引入

### 直接用script引入

创建一个文件夹，在里面创建一个html文件

然后直接引入vue文件即可

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../vue.js"></script>
</head>

<body>

</body>

</html>
```

运行文件

### 消除开发环境提示

在console里查看

![image-20230919084602099](https://s2.loli.net/2023/09/19/9Jxbg6RQjyc3O7o.png)

第一个是说下载vue的开发者工具来达到一个更好的开发者体验

第二个是说你正在运行开发环境，请你确信在生产环境不要这样做

两个小提示，但是不影响，后面再解决

如果成功引入了Vue，在console上写入Vue会输出其对应的函数

![image-20230919084937292](https://s2.loli.net/2023/09/19/nKf9Jtj4aDRyeiF.png)

解决第一个提示的方法是下载一个vue的开发者工具即可

vue开发者工具的github链接如下：https://github.com/vuejs/devtools#vue-devtools

找到下面这个地方，点击进入谷歌商店下载

![image-20230919085712128](https://s2.loli.net/2023/09/19/3nEbhJ4U2wc6siS.png)

![image-20230919085756365](https://s2.loli.net/2023/09/19/7fbN283qnAHY1hv.png)

第二个提示需要在代码中对其进行配置

```vue
<script>
        Vue.config.productionTip = false   // 阻止vue在启动时生成生产提示
</script>
```

## 模板语法

Vue模板语法有2大类：

1. 插值语法：

	​	功能：用于解析标签体内容

	​	写法：{{xxx}}，xxx是js表达式，且可以直接读取到data中的所有属性

2. 指令语法：

	​	功能：用于解析标签(包括：标签属性、标签体内容、绑定事件等)

	​	举例：v-bind:hreft="xxx"或简写为:href="xxx"，xxx同样要写js表达式。且可以直接读取到data中的所有属性

	​	备注：Vue中有很多的指令，且形式都是：v-?????

### 插值语法

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>

<body>
    <div id="box">
        {{test}}
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            el: '#box',
            data: {
                test: 'haha'
            }
        })
    </script>
</body>

</html>
```

### 指令语法

#### v-bind

单向绑定数据

```html
<body>
    <div id="box">
        <a v-bind:href="url">跳转到百度</a>
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            el: '#box',
            data: {
                url: 'http://www.baidu.com'
            }
        })
    </script>
</body>
```

可以简写为`<a :href="url">跳转到百度</a>`

```html
<body>
    <div id="box">
        <a :href="url">跳转到百度</a>
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            el: '#box',
            data: {
                url: 'http://www.baidu.com'
            }
        })
    </script>
</body>
```



## 数据绑定

v-bind：单向数据绑定

v-model：双向数据绑定

Vue中有2种数据绑定的方式：

1. 单向绑定(v-bind)：数据只能从data流向页面

2. 双向绑定(v-model)：数据不仅能从data流向页面，还可以从页面流向data

	备注：

	1. 双向绑定一般都应用在表单类元素上(如：input、select等)
	2. v-model:value 可以简写为v-model，因为v-model默认收集的就是value值



- el有两种写法

	1. new Vue时配置el属性

		```vue
		new Vue({
		            // el: '#box', 第一种写法
		        })
		```

	2. 先创建Vue实例，随后再通过vm.$mount('#root')指定el的值

		`vm.$mount('#box')`

- data有2种写法

	1. 对象式

		```html
		new Vue({
		            // el: '#box', 第一种写法
		        })
		```

	2. 函数式

		```html
		// data的第二种写法：函数式
		            data() {
		                return {
		                    name: 'zhangsan'
		                }
		            }
		```

- 一个重要的原则

	- 由Vue管理的函数，一定不要写箭头函数，一旦写了箭头函数，this就不再是Vue实例了

v-bind的简写方式：:xxx=""

v-model的简写方式：v-model=""

```html
单向数据绑定：<input type="text" :value="name"><br>
双向数据绑定：<input type="text" v-model="name">
```

### 单向数据绑定

下面这段代码是对其进行了一个单向数据绑定，可以在页面中进行测试

```html
<body>
    <div id="box">
        单向数据绑定：<input type="text" :value="name">
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            el: '#box',
            data: {
                name: 'zhangsan'
            }
        })
    </script>
</body>
```

之前在网上下载的Vue开发者工具此时就可以使用了

打开页面后单击F12，打开这个页面，在最后一栏找到Vue

<img src="https://s2.loli.net/2023/09/19/yq6Ezuh9W1Ros8b.png" alt="image-20230919161313748" style="zoom: 33%;" />

在name:'zhangsan'的位置进行修改，单向数据绑定处的数据也会发生改变，而在输入框中修改，并不会改变name:'zhangsan'的内容

### 双向数据绑定

v-model：双向数据绑定

```html
<body>
    <div id="box">
        单向数据绑定：<input type="text" :value="name"><br>
        双向数据绑定：<input type="text" v-model:value="name">
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            el: '#box',
            data: {
                name: 'zhangsan'
            }
        })
    </script>
</body>
```

被绑定了双向后，在测试工具中输入任意的数据，输入框中的内容都会发生改变，或者在输入框中输入内容，也会互相的改变

当输入框中的内容改变时，会带起一系列的连锁反应

<img src="https://s2.loli.net/2023/09/21/mPJwKUFdykOGXYC.png" alt="image-20230919161959667" style="zoom: 33%;" />

**注意：v-model元素只能应用在表单类元素上(输入类元素)，在其他标签类元素上使用会报错**

## el与data的两种写法

对象式

```html
<body>
    <div id="box">
        单向数据绑定：<input type="text" :value="name"><br>
        双向数据绑定：<input type="text" v-model="name">
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            // el: '#box', 第一种写法
            data: {
                name: 'zhangsan'
            }
        })
        vm.$mount('#box')	// 第二种写法
    </script>
</body>
```

相较之下，第二种更灵活，使用的时候两种都可以

```html
<body>
    <div id="box">
        单向数据绑定：<input type="text" :value="name"><br>
        双向数据绑定：<input type="text" v-model="name">
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.productionTip = false;
        var vm = new Vue({
            // el: '#box', 第一种写法
            // data: {
            //     name: 'zhangsan'
            // }

            // data的第二种写法：函数式
            data: function () {
                return {
                    name: 'zhangsan'
                }
            }
        })
        vm.$mount('#box')

    </script>
</body>
```

data可以简写为下面的方式

```vue
 // data的第二种写法：函数式
            data() {
                return {
                    name: 'zhangsan'
                }
            }
```

## MVVM

M：模型(Model)，对应data中的数据

V：视图(View)， 模板

VM：视图模型(ViewModel)，Vue实例对象

<img src="https://s2.loli.net/2023/09/20/TbfrgDFv9MSn83U.png" alt="image-20230920124821781" style="zoom: 67%;" />

Data Bindings：数据绑定，将Model中的数据绑定到View中

DOM Listeners：页面模型监听器



总结：

- data中所有的属性，最后都出现了Vue对象上
- vm身上所有的属性及Vue原型上所有属性，在Vue模板中都可以直接使用



## 数据代理

### Object.defineProperty方法

`Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})`

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男'
        }
        
        Object.defineProperty(person, 'age', {
            value: 18
        })
        console.log(person)
    </script>
</body>
```

为person对象添加了一个age的属性，值为18

![image-20230920132903453](https://s2.loli.net/2023/09/20/NwdsXQ17HbplYai.png)

这样添加与普通的添加方式有什么区别呢，这样添加的属性是不参与遍历的

正常情况下是参与遍历的

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男',
            age: 18
        }
        // Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})
        // Object.defineProperty(person, 'age', {
        //     value: 18
        // })
        console.log(Object.keys(person))
    </script>
</body>
```

![image-20230920133350604](https://s2.loli.net/2023/09/20/XYSf5Juzpmgkrln.png)

但是使用该方法进行遍历就遍历不到了

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男',
            // age: 18
        }
        // Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})
        Object.defineProperty(person, 'age', {
            value: 18
        })
        console.log(Object.keys(person))
    </script>
</body>
```

![image-20230920133321585](https://s2.loli.net/2023/09/20/bz821RoGefdhsv7.png)

这种情况也叫不可枚举，如果需要遍历该怎么办呢

可以在代码中加入

`enumerable: true`：控制属性是否可以被枚举，默认是false

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男',
        }
        // Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})
        Object.defineProperty(person, 'age', {
            value: 18,
            enumerable: true
        })
        console.log(Object.keys(person))
    </script>
</body>
```

再次运行，就可以遍历到了

如果你试图修改`Object.defineProperty`添加的方法，可以修改，但不会修改成功

如果需要被修改怎么办呢

在代码中加入`writable: true`，控制属性是否可以被修改，默认是false

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男',
        }
        // Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})
        Object.defineProperty(person, 'age', {
            value: 18,
            enumerable: true,
            writable: true
        })
        console.log(Object.keys(person))
    </script>
</body>
```

数据需要被删除，可以加入`configurable: true`，控制属性是否可以被删除，默认是false

#### getter和setter

下面的代码提供了`Object.defineProperty`的get和set示例

```html
<body>
    <script src="../vue.js"></script>
    <script>
        let person = {
            name: '张三',
            sex: '男',

        }
        let number = 19
        // Object.defineProperty(添加属性的对象名,添加的属性名,{value:添加的值})
        Object.defineProperty(person, 'age', {
            // 当有人读取person的age属性时,get函数就会被调用，且返回number的值
            get() {
                return number
            },
            // 当有人修改person的age属性时，set函数就会被调用，且会收到修改的具体值value
            set(value) {
                number = value;
            }
        })
    </script>
</body>
```

<img src="https://s2.loli.net/2023/09/21/JpdYbrg4QDWswNB.png" alt="image-20230920135946414" style="zoom: 67%;" />



### Vue中的数据代理

数据代理就是让_data中的数据在Vue身上也有一份，不管是getter还是setter都可以直接通过属性名来获取使用，而不是通过 _data.属性名来使用，这样会非常的冗余，在getter时，数据代理会getter到 _data的身上，而setter时，会setter到 _data的身上，从而达到一个连锁的效果，简化了开发

数据代理图示：

<img src="https://s2.loli.net/2023/09/21/L81lfDu9B7MqHaZ.png" alt="image-20230921125656317" style="zoom: 50%;" />

Vue先将data中的数据存放到_data中，然后再通过`Object.defineProperty`方法将数据放到vm身上，这样就起到一个数据代理的效果

```html
<body>
    <div id="box">
        <h1>{{name}}</h1>
        <h1>{{age}}</h1>
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {
                name: 'zhangsan',
                age: 66
            }
        })
    </script>
</body>
```

以上面这段示例代码为例，Vue中的数据代理其实也是同理的

当有人访问页面中的name或age时，它会利用getter去访问data中的name或age

当有人修改页面中的name或age时，它会利用setter去修改data中的name或age

此时就不是直接访问，而是以一种代理的形式，通过访问Vue上的getter或setter方法来达到修改data上的数据



这里对数据代理的两种形式做一个验证

修改data中的属性后，查看其中vue中的data是否发生变化

<img src="https://s2.loli.net/2023/09/21/7yxzRmUKkOiC8dI.png" alt="image-20230921091925137" style="zoom:50%;" />

发现此时这里的name确实是发生改变了，这说明数据改变后，依然是从data中来获取的



对setter进行一个验证

修改对应的属性，然后获取其data中的属性是否发生了改变

![image-20230921093045894](https://s2.loli.net/2023/09/21/k4B1dSHMEINqOw3.png)

这里我们发现，修改了它的属性后，data中的属性也发生了改变，这说明setter方法是存在数据代理的，设置完的属性会放到data中



总结：

1. Vue中的数据代理：

	​	通过vm对象来代理data对象中属性的操作(读/写)

2. Vue中数据代理的好处：

	​	更加方便的操作data中的数据

3. 基本原理

	​	通过Object.defineProperty()把data对象中所有属性添加到vm上

	​	通过每一个添加到vm上的属性，都指定一个getter/setter

	​	在getter/setter内部去操作(读/写)data中对应的属性



## 事件处理

### 事件的基本使用

事件的基本使用：

1. 使用v-on:xxx 或 @xxx绑定事件，其中xxx是事件名
2. 事件的回调需要配置在methods对象中，最终会在vm上
3. methods配置的函数，不要用箭头函数，否则this就不是vm了
4. methods中配置的函数，都是被Vue所管理的函数，this的指向是vm或组件实例对象
5. @click="demo" 和 @click="demo($event)" 效果一致，但后者可以传参

#### v-on:click

**简写形式为：@click**

当被点击时

```html
<body>
    <div id="box">
        <button v-on:click="show">点我</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show() {
                    alert("show")
                }
            },
        })
    </script>
</body>
```



如果需要接收参数，可以这样写

```html
<body>
    <div id="box">
        <button v-on:click="show(66)">点我66</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(number) {
                    alert(number)
                }
            },
        })
    </script>
</body>
```

但是这样写event就无法使用了

可以通过在传参位置加入占位符`$event`的形式传递event参数

```html
<body>
    <div id="box">
        <button v-on:click="show($event,66)">点我66</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(event, number) {
                    console.log(event)
                    alert(number)
                }
            },
        })
    </script>
</body>
```

### 事件修饰符

正常的运行下面这段代码，会在代码运行后依然将网页跳转到了百度

```html
<body>
    <div id="box">
        <a href="http://www.baidu.com" @click="jump">点击跳走</a>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                jump() {
                    alert("跳走喽")
                }
            },
        })
    </script>
</body>
```

跳转是a标签的默认行为，我们有什么好的办法来阻止这个默认行为呢

可以通过`e.preventDefault`方法对这个默认行为进行阻止

```html
methods: {

        jump(e) {

          e.preventDefault();

          alert("跳走喽")

        }

      },
```

也可以通过Vue中的事件修饰符

1. **prevent：阻止默认事件(常用)**
2. **stop：阻止事件冒泡(常用)**
3. **once：事件只触发一次(常用)**
4. capture：使用事件的捕获模式
5. self：只有event.target是当前操作的元素时才触发事件
6. passive：事件的默认行为立即执行，无需等待事件回调执行完毕

演示一下常用的三种，其余不做演示

#### prevent：

**效果和`e.preventDefault();`是一样的**

```html
<body>
    <div id="box">
        <a href="http://www.baidu.com" @click.prevent="jump">点击跳走</a>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                jump(e) {
                    // e.preventDefault();
                    alert("跳走喽")
                }
            },
        })
    </script>
</body>
```

#### stop：

冒泡是从当没有返回值true或false之类时，会从里向外(向它的父元素执行其父元素的方法直到结束)

冒泡情况演示

```html
<body>
    <div id="box">
        <div @click="clickOnButton">
            <button @click="clickOnButton">点我老铁666</button>
        </div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                clickOnButton() {
                    alert("冒泡效果")
                }
            },
        })
    </script>
</body>
```

冒泡解决方案：

```html
<body>
    <div id="box">
        <div @click="clickOnButton">
            <button @click="clickOnButton">点我老铁666</button>
        </div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                clickOnButton(e) {
                    e.stopPropagation();
                    alert("冒泡效果")

                }
            },
        })
    </script>
</body>
```

冒泡解决方案Vue版：

```html

<body>
    <div id="box">
        <div @click="clickOnButton">
            <button @click.stop="clickOnButton">点我老铁666</button>
        </div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                clickOnButton(e) {
                    // e.stopPropagation();
                    alert("冒泡效果")

                }
            },
        })
    </script>
</body>
```

#### once：

事件只触发一次，字面意思，挺好理解的

```html
<body>
    <div id="box">
        <button @click.once="clickOnButton">点我老铁666</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {

            },
            methods: {
                clickOnButton(e) {
                    // e.stopPropagation();
                    alert("once")

                }
            },
        })
    </script>
</body>
```



### 键盘事件

@keyup：当键盘弹起时

@keydown：当键盘按下时

下面这段代码是当键盘弹起时，如果按下的是回车就打印内容在控制台上

```html
<body>
    <div id="box">
        <input type="text" placeholder="按下回车提示输入" @keyup="show">
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(e) {
                    if (e.keyCode !== 13) return;
                    console.log(e.target.value)
                }
            },
        })
    </script>
</body>
```

这里的判断keyCode也可以置换为vue中的别名

```html
<body>
    <div id="box">
        <input type="text" placeholder="按下回车提示输入" @keyup.enter="show">
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(e) {
                    // if (e.keyCode !== 13) return;
                    console.log(e.target.value)
                }
            },
        })
    </script>
</body>
```

#### vue常见按键别名

回车 => enter

删除 => delete（捕获"删除"和"退格"键）

退出 => esc

空格 => space

换行 => tab

上 => up

下 => down

左 => left

右 => right



Vue未提供别名的按键，可以使用按键原始的key值去绑定，但注意要转为kebab-case（短横线命名）

短横线命名是什么意思呢？

就是说，如果某个按键未提供别名，可以使用原始的key去绑定，比如CapsLock，如果想要使用的话，需要转为caps-lock，记得要在两个单词之间加入短横线-

示例代码

```html
<body>
    <div id="box">
        <input type="text" placeholder="按下回车提示输入" @keyup.caps-lock="show">
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(e) {
                    // if (e.keyCode !== 13) return;
                    console.log(e.target.value)
                }
            },
        })
    </script>
</body>
```



特殊按键tab：按了之后会离开焦点，这种不适合在keyup上使用，因为在键盘弹起后触发时，焦点已经离开了，方法可能就无法触发了(必须配合keydown使用)



系统修饰键(用法特殊)：ctrl、alt、shift、meta(win)

1. ​	配合keyup使用：按下修饰键的同时，再按下其他键，随后释放其他键，事件才被触发
2. 配合keydown使用：正常触发事件



也可以使用keyCode去指定具体的按键(不推荐)

`<input type="text" placeholder="按下回车提示输入" @keyup.13="show">`



Vue.config.keyCodes.自定义键名 = 键码，可以定制按键别名

`Vue.config.keyCodes.huiche = 13`

```html
<body>
    <div id="box">
        <input type="text" placeholder="按下回车提示输入" @keyup.huiche="show">
    </div>
    <script src="../vue.js"></script>
    <script>
        Vue.config.keyCodes.huiche = 13
        new Vue({
            el: '#box',
            data: {

            },
            methods: {
                show(e) {
                    // if (e.keyCode !== 13) return;
                    console.log(e.target.value)
                }
            },
        })
    </script>
</body>
```



### 事件总结

- 事件修饰符可以连着写，例如@click.prevent.stop="xxx"，效果是停止默认事件并阻止冒泡，但它是有先后顺序的，也就是说，先停止默认事件，再阻止冒泡，谁写在前面谁先
- 而键盘事件也可以连着写，例如，`@keyup.ctrl.y`，连着写之后的效果就是按下特定的这两位才会触发效果，其他的没效果



## 计算属性

### 姓名案例

插值语法实现

```html
<body>
    <div id="box">
        姓: <input type="text" v-model=firstName><br>
        名: <input type="text" v-model=lastName><br>
        姓名: <span>{{firstName.slice(0,3)}}-{{lastName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三'
            }
        })
    </script>
</body>
```

如果我们想为名称加一些新的效果，但是会有很多，这样就会很麻烦，如果我们把它整理成一个methods，看起来就不会特别的冗余了

```html
<body>
    <div id="box">
        姓: <input type="text" v-model=firstName><br>
        名: <input type="text" v-model=lastName><br>
        姓名: <span>{{name()}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三'
            },
            methods: {
                name() {
                    return this.firstName + "-" + this.lastName
                }
            },
        })
    </script>
</body>
```

### 计算属性

1. 定义：要用的属性不存在，要通过**已有属性（vue中的才叫属性）**计算得来
2. 原理：底层借助了Object.defineproperty方法提供的getter和setter
3. get函数什么时候执行？
	- 初次读取时会执行一次
	- 当依赖的数据发生改变时会被再次调用
4. 优势：与methods实现相比，内部有缓存机制(复用)，效率更高，调试方便
5. 备注：
	1. 计算属性最终会出现在vm上，直接读取使用即可
	2. 如果计算属性要被修改，那必须写set函数去响应修改，且set中要引起计算时**依赖的数据发生改变**，否则无效

使用计算属性编写之前的姓名案例

 这里的get和`Object.defineProperty`是一样的

当有人读取fullName时，get就会被调用，且返回值就作为fullName的值

get什么时候调用

- 初次读取fullName时
- 所依赖的数据发生改变时

```html
<body>
    <div id="box">
        姓: <input type="text" v-model=firstName><br>
        名: <input type="text" v-model=lastName><br>
        姓名: <span>{{fullName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三'
            },
            computed: {
                fullName: {
                    get() {
                        console.log(this)
                        return this.firstName + "-" + this.lastName
                    }
                }
            }
        })
    </script>
</body>
```

且get是有缓存的，而methods是没有缓存的，性能上computed更好一些

有get肯定就有set，和get的道理其实也是一样的

```html
<body>
    <div id="box">
        姓: <input type="text" v-model=firstName><br>
        名: <input type="text" v-model=lastName><br>
        姓名: <span>{{fullName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三'
            },
            computed: {
                fullName: {
                    // set方法的调用时机是当fullName被改变时调用
                    // 而fullName是依靠firstName和lastName来改变的
                    // 也就是当输入框中的两个东西被改变后，get就调用了
                    get() {
                        console.log(this)
                        return this.firstName + "-" + this.lastName
                    },
                    set(value) {
                        // set会传递一个参数
                        // 这个参数就是值了
                        console.log(value)
                        // 得到了值，需要通过中间的-来进行获取姓和名
                        const arr = value.split('-');
                        this.firstName = arr[0]
                        this.lastName = arr[1]
                    }
                }
            }
        })
    </script>
</body>
```

### 计算属性简写

简写的形式只有在**只读不改**的时候才能使用

```html
<body>
    <div id="box">
        姓: <input type="text" v-model=firstName><br>
        名: <input type="text" v-model=lastName><br>
        姓名: <span>{{fullName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三'
            },
            computed: {
                fullName() {
                    // 简写
                    return this.firstName + "-" + this.lastName;
                }
            }
        })
    </script>
</body>
```



## 监视属性

### 天气案例

先做一个天气的小案例，点击按钮后变换天气

这里使用了计算属性来进行操作

```html
<body>
    <div id="box">
        <h1>今天天气很{{info}}</h1>
        <button @click="change">改变天气</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isHot: true
            },
            computed: {
                info() {
                    return this.isHot ? '炎热' : '寒冷'
                }
            }, methods: {
                change() {
                    this.isHot = !this.isHot
                }
            },
        })
    </script>
</body>
```

但是在这里有一个小坑

如果我们将代码中的这一行改变了

改变为`<h1>今天天气很一般</h1>`

此时页面上就不会用到isHot和info了，如果我们此时点击一下按钮，页面是肯定不会发生变化的，但是你打开开发者工具一看

<img src="https://s2.loli.net/2023/09/22/J8lI5MGSCcdxXRN.png" alt="image-20230922140923321" style="zoom: 50%;" />

开发者工具中却是true和炎热，我们去控制台上看一下

<img src="https://s2.loli.net/2023/09/22/bKCzxPIgtMHnTEX.png" alt="image-20230922140756964" style="zoom:50%;" />

控制台上就发生了变化了

这是为什么呢，原因其实是vue的开发者工具认为你页面没有使用到该数据，就没有为你更新了，这个是官方的一个bug，不影响

这里写的代码其实很多，只是为了实现一个切换功能，那还有什么办法能更简单吗

```html
<body>
    <div id="box">
        <h1>今天天气很{{info}}</h1>
        <button @click="isHot = !isHot">改变天气</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isHot: true
            },
            computed: {
                info() {
                    return this.isHot ? '炎热' : '寒冷'
                }
            }, methods: {

            },
        })
    </script>
</body>
```

一些简单的代码其实可以直接使用@click来写

如果你不仅想做这个操作，还想做别的操作呢，有两种方式

1. 直接在methods中写
2. `@click="isHot = !isHot";你想做的操作`

比如：

```html
<body>
    <div id="box">
        <h1>今天天气很{{info}}</h1>
        <button @click="isHot = !isHot;x++">改变天气{{x}}</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isHot: true,
                x: 0
            },
            computed: {
                info() {
                    return this.isHot ? '炎热' : '寒冷'
                }
            }, methods: {

            },
        })
    </script>
</body>
```



### 监视属性watch

1. 当被监视的属性变化时，回调函数自动调用，进行相关操作
2. 监视的属性必须存在，才能进行监视
3. 监视的两种写法：
	1. new Vue时传入watch配置
	2. 通过vm.$watch监视

```html
<body>
    <div id="box">
        <h1>今天天气很{{info}}</h1>
        <button @click="isHot = !isHot">改变天气</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isHot: true,
            },
            computed: {
                info() {
                    return this.isHot ? '炎热' : '寒冷'
                }
            }, watch: {
                info: {
                    immediate: true,     // 初始化时让handler调用一下
                    // handler什么时候调用,当isHot发生改变时
                    handler(newValue, oldValue) {
                        console.log("新的值为", newValue, "旧的值为", oldValue)
                    }
                }
            }
        })
    </script>
</body>
```

监视属性是watch，是一个对象的形式，里面可以放置多个对象，每个对象里面有配置属性和handler等

handler中有两个参数可以接收，第一个是newValue，第二个是oldValue

除了上面这种监视属性的写法，还有另一种监视属性的写法

```html
<script>
        const vm = new Vue({
            el: '#box',
            data: {
                isHot: true,
            },
            computed: {
                info() {
                    return this.isHot ? '炎热' : '寒冷'
                }
            },
            // watch: {
            //     info: {
            //         immediate: true,     // 初始化时让handler调用一下
            //         // handler什么时候调用,当isHot发生改变时
            //         handler(newValue, oldValue) {
            //             console.log("新的值为", newValue, "旧的值为", oldValue)
            //         }
            //     }
            // }
        })
        vm.$watch('info',
            {
                immediate: true,     // 初始化时让handler调用一下
                // handler什么时候调用,当isHot发生改变时
                handler(newValue, oldValue) {
                    console.log("新的值为", newValue, "旧的值为", oldValue)
                }
            }
        )
    </script>
```



### 深度监视

1. Vue中的watch**默认不监测**对象内部值的改变(一层)
2. 配置`deep：true`可以监测对象内部值的改变(多层)

备注：

- **Vue自身可以**监测对象内部值的改变，但Vue提供的watch**默认不可以**
- 使用watch时根据数据的具体结构，决定是否采用深度监视，采用深度监视会有效率的问题

#### 监视多级结构中某个属性的变化

当多级结构中的a发生变化时，可以获取得到它

```html
<body>
    <div id="box">
        <h1>a的值是:{{numbers.a}}</h1>
        <button @click="numbers.a++">点我让a++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                numbers: {
                    a: 1,
                    b: 2
                }
            },
            watch: {
                'numbers.a'() {
                    console.log(this.numbers.a)
                }
            }
        })
    </script>
</body>
```

#### 检测整体结构变化

```html
<body>
    <div id="box">
        <h1>a的值是:{{numbers.a}}</h1>
        <button @click="numbers.a++">点我让a++</button>
        <button @click="numbers.b++">点我让b++</button>
        <!-- 当numbers整体发生改变时，才能检测到 -->
        <button @click="numbers = {a:66,b:99}">点我让numbers改变</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                numbers: {
                    a: 1,
                    b: 2
                }
            },
            watch: {
                'numbers'() {
                    console.log(this.numbers)
                }
            }
        })
    </script>
</body>
```



#### 检测整体结构的任意一个值的变化

为watch中的属性配置deep即可检测值的变化

```html
<body>
    <div id="box">
        <h1>a的值是:{{numbers.a}}</h1>
        <button @click="numbers.a++">点我让a++</button>
        <button @click="numbers.b++">点我让b++</button>
        <!-- 当numbers整体发生改变时，才能检测到 -->
        <button @click="numbers = {a:66,b:99}">点我让numbers改变</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                numbers: {
                    a: 1,
                    b: 2
                }
            },
            watch: {
                numbers: {
                    deep: true,
                    handler() {
                        console.log(this.numbers)
                    }
                }
            }
        })
    </script>
</body>
```



### 监视的简写形式

监视的简写形式只有在仅handler的情况下才可以使用

```html
<body>
    <div id="box">
        <h1>numbers的值是:{{numbers}}</h1>
        <button @click="numbers++">点我让numbers++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                numbers: 1
            },
            watch: {
                // 正常写法
                // numbers: {
                //     deep: true,
                //     handler() {
                //         console.log(this.numbers)
                //     }
                // }
                // 简写
                numbers(newValue, oldValue) {
                    console.log(newValue, oldValue)
                }
            }
        })
    </script>
</body>
```

但是监视有两种写法，它还有一种vm.$watch的写法，也可以简写

```html
<body>
    <div id="box">
        <h1>numbers的值是:{{numbers}}</h1>
        <button @click="numbers++">点我让numbers++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                numbers: 1
            },
            // watch: {
            //     // 正常写法
            //     // numbers: {
            //     //     deep: true,
            //     //     handler() {
            //     //         console.log(this.numbers)
            //     //     }
            //     // }
            //     // 简写
            //     numbers(newValue, oldValue) {
            //         console.log(newValue, oldValue)
            //     }
            // }
        })
        vm.$watch('numbers', function (newValue, oldValue) {
            console.log(newValue, oldValue)
        })
    </script>
</body>
```



### watch对比computed

computed和watch之间的区别：

1. computed能完成的功能，watch都可以完成
2. watch能完成的功能，computed不一定能完成，例如：watch可以进行异步操作(定时器)

两个重要的小原则：

1. 被Vue所管理的函数，最好写成普通函数，这样this的指向才是vm或组件实例对象
2. 所有不被Vue所管理的函数(定时器的回调函数、ajax的回调函数等)，最好写成箭头函数，因为在JavaScript中，箭头函数并不会创建自己的this上下文，而是继承其所在代码块的this。因此，在Vue组件的方法中，如果我们使用了箭头函数，那么this才会指向Vue实例。

watch写法的姓名案例

```html
<body>
    <div id="box">
        姓:<input type="text" v-model="firstName">
        名:<input type="text" v-model="lastName">
        <br><span>姓名：{{fullName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三',
                fullName: '张三'
            },
            watch: {
                firstName(newValue) {
                    this.fullName = newValue + this.lastName;
                },
                lastName(newValue) {
                    this.fullName = this.firstName + newValue;
                }
            }
        })
    </script>
</body>
```

computed写法的姓名案例

```html
<body>
    <div id="box">
        姓:<input type="text" v-model="firstName">
        名:<input type="text" v-model="lastName">
        <br><span>姓名：{{fullName}}</span>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                firstName: '张',
                lastName: '三',
            },
            computed: {
                fullName() {
                    return this.firstName + this.lastName;
                }
            }
        })
    </script>
</body>
```



## 绑定样式

### 绑定class样式

字符串写法，适用于：样式的类名不确定，需要动态指定

可以将样式修改为指定的内容

```html
<body>
    <div id="box">
        <!-- 绑定class样式--字符串写法，适用于：样式的类名不确定，需要动态指定 -->
        <div class="basic" :class="mood" @click="changeMood">test</div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                mood: 'normal'
            },
            methods: {
                changeMood() {
                    this.mood = 'happy'
                }
            },
        })
    </script>
</body>
```

也可以通过布尔值进行判断之类的情况

当isActive为true时，active才会作为类生效

```html
<body>
    <div id="box">
        <div :class="{active:isActive}">test</div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isActive: false
            }
        })
    </script>
</body>
```

绑定计算属性作为class的判断

```html
<body>
    <div id="box">
        <div :class="classObject">test</div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                isActive: true,
                error: null
            },
            computed: {
                classObject() {
                    return {
                        active: this.isActive && !this.error,
                        'text-danger': this.error && this.error.type === 'fatal'
                    }
                }
            }
        })
    </script>
</body>
```

这段代码的释义是使用了一个计算属性

计算属性的含义是classObject，当满足isActive为true并且error不为空的条件时，返回active;当error存在并且error的类型为fatal时返回text-danger

### 数组语法

我们可以把一个数组传给v-bind:class，来应用一个class列表的情况

```html
<body>
    <div id="box">
        <div :class="[active,active2]">test</div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                active: 'activeClass',
                active2: 'isYes'
            },
        })
    </script>
</body>
```

最终它会渲染为`class='activeClass isYes'`

如果想根据条件来切换数组语法中的内容，也是可以的

```html
<div :class="[isActive ? active : '',active2]">test</div>
```

可以通过三元表达式来对其进行修改

如果觉得三元表达式不够友好，可以采取对象语法的方式

```html
<div :class="[{active:isActive},active2]">test</div>
```



### 绑定内联样式

#### 对象语法

```html
<body>
    <div id="box">
        <!-- 使用对象语法 -->
        <div :style="{fontSize:size}">hahahha</div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                size: '36px'
            },
        })
    </script>
</body>
```

或者将样式绑定到一个对象中，直接使用对象

```html
<div :style="styleData">hahahha</div>
```

```js
data: {
                styleData: {
                    backgroundColor: 'red',
                    fontSize: '30px'
                }
            }
```

#### 数组语法

将多个样式对象绑定到一个数组上

```html
<div :style="[styleData,a,b,c]">hahahha</div>
```

#### 多重值

从vue2.3.0开始可以为style绑定中的property提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：

```html
<div :style="{display:['-webkit-box,'-ms-flexbox','flex']}"></div>
```

`'-webkit-box,'-ms-flexbox','flex'`是不同浏览器支持的类型前缀，这样写只会渲染数组中最后一个被浏览器支持的值，如果浏览器支持不带浏览器前缀的flexbox，那么就只会渲染`display:flex`



## 条件渲染

### v-if、v-else

`v-if` 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true值的时候被渲染。

`v-else`的效果是当if不生效时，else生效

`v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别。

```html
<body>
    <div id="box">
        <div v-if="flag">66</div>
        <div v-else="flag">77</div>
        <button @click="onClick">点击后改变</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                flag: false
            },
            methods: {
                onClick() {
                    this.flag = !this.flag
                }
            },
        })
    </script>
</body>
```

### 在`<template>`元素上使用v-if渲染分组

因为`v-if`是一个指令，所以必须将它添加到一个元素上，但是如果想切换多个元素呢，此时可以把一个`<template>`元素当作不可见的包裹元素，并在上面使用`v-if`。最终的渲染结果不包含`<template>`元素

```html
<body>
    <div id="box">
        <template v-if="flag">
            <!-- v-if的效果可以让template下的所有内容消失 -->
            <h1>title</h1>
            <span>1</span>
            <span>2</span>
        </template>
        <button @click="onClick">点击切换</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                flag: false
            },
            methods: {
                onClick() {
                    this.flag = !this.flag
                }
            },
        })
    </script>
</body>
```



### v-else-if

**2.1.0 新增**

类似于 `v-else`，`v-else-if` 也必须紧跟在带 `v-if` 或者 `v-else-if` 的元素之后。

```html
<body>
    <div id="box">
        <div v-if="score >=90">
            成绩在90分及以上
        </div>
        <div v-else-if="score >=70">
            成绩在70分及以上
        </div>
        <div v-else-if="score >=50">
            成绩在50分及以上
        </div>
        <div v-else-if="score >=0">
            成绩在0分及以上
        </div>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                score: 66
            },

        })
    </script>
</body>
```

### 用key管理可复用的元素

Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。这么做除了使 Vue 变得非常快之外，还有其它一些好处。例如，如果你允许用户在不同的登录方式之间切换：

```html
<body>
    <div id="box">
        <template v-if="loginName === 'username'">
            <label>username</label>
            <input placeholder="Enter your username">
        </template>
        <template v-else="loginName === 'email'">
            <label>email</label>
            <input placeholder="Enter your email">
        </template>
        <button @click="toggle">Toggle login type</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                loginType: true
            },
            computed: {
                loginName() {
                    return this.loginType === true ? 'username' : 'email'
                }
            }, methods: {
                toggle() {
                    this.loginType = !this.loginType;
                }
            }

        })
    </script>
</body>
```

那么在上面的代码中切换 `loginType` 将不会清除用户已经输入的内容。因为两个模板使用了相同的元素，`<input>` 不会被替换掉——仅仅是替换了它的 `placeholder`。

这样会起到复用input输入框的作用

如果我们想让这两个元素是完全独立的，不要复用它们”。只需添加一个具有唯一值的 `key` attribute 即可：

```html
<div id="box">
        <template v-if="loginName === 'username'">
            <label>username</label>
            <input placeholder="Enter your username" key="username">
        </template>
        <template v-else="loginName === 'email'">
            <label>email</label>
            <input placeholder="Enter your email" key="email">
        </template>
        <button @click="toggle">Toggle login type</button>
    </div>
```

`<label>` 元素仍然会被高效地复用，因为它们没有添加 `key` attribute。

### v-show

根据条件展示元素的选项是 `v-show` 指令。

用法是类似的

```html
<body>
    <div id="box">
        <div v-show="showNice">
            展示
        </div>
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {
                showNice: true
            }
        })
    </script>
</body>
```

不同的是带有 `v-show` 的元素始终会被渲染并保留在 DOM 中。`v-show` 只是简单地切换元素的 CSS property `display`，元素是存在页面上的，只是被display所隐藏了

![image-20230923165800153](https://s2.loli.net/2023/09/23/IF1g3OtKfn2zNpZ.png)

**注意，`v-show` 不支持 `<template>` 元素，也不支持 `v-else`。**



### `v-if` vs `v-show`

`v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

`v-if` 也是**惰性的**：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。

相比之下，`v-show` 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。

一般来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

总结：

- v-if在你初始渲染条件为惰性时什么都不会做，而v-show会提前给你渲染好，直接你条件不成立时，它会隐藏起来
- 如果你初始化不需要频繁的切换，使用v-if比较好，因为它不初始化就不会消耗资源，反之使用v-show，提前帮你把资源加载好，只是将内容隐藏起来

## 列表渲染

### 用`v-for`把一个数组对应为一组元素

我们可以用 `v-for` 指令基于一个数组来渲染一个列表。`v-for` 指令需要使用 `item in items` 形式的特殊语法，其中 `items` 是源数据数组，而 `item` 则是被迭代的数组元素的**别名**。

```html
<body>
    <div id="box">
        <ul>
            <li v-for="item in items">{{item.message}}</li>
        </ul>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                items: [
                    { message: 'Foo' },
                    { message: 'Bar' }
                ]
            }
        })
    </script>
</body>
```

在 `v-for` 块中，我们可以访问所有父作用域的 property。`v-for` 还支持一个可选的第二个参数，即当前项的索引。

```html
<body>
    <div id="box">
        <ul>
            <li v-for="(item,index) in items">索引{{index}}<br>{{parentMessage}}<br>{{item.message}}</li>
        </ul>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                parentMessage: 'Parent',
                items: [
                    { message: 'Foo' },
                    { message: 'Bar' }
                ]
            }
        })
    </script>
</body>
```

也可以用 `of` 替代 `in` 作为分隔符，因为它更接近 JavaScript 迭代器的语法：

```html
<li v-for="(item,index) of items">索引{{index}}<br>{{parentMessage}}<br>
```

### v-for使用对象

可以用 `v-for` 来遍历一个对象的 property。

```html
<div id="box">
        <ul>
            <li v-for="val in obj">
                {{val}}
            </li>
        </ul>
    </div>
```

```js
new Vue({
            el: '#box',
            data: {
                obj: {
                    name: 'zhang',
                    age: 66
                }
            }
        })
```

结果如下

![image-20230924123928460](https://s2.loli.net/2023/09/24/739bqFwrdYmG4yA.png)



可以提供第二个参数为property名称(也就是键名)

键名是对象里的名称，值是名称所对应的值

```html
<div id="box">
        <ul>
            <li v-for="(val,name) in obj">
                {{val}}:{{name}}
            </li>
        </ul>
    </div>
```

结果如下

![image-20230924124057609](https://s2.loli.net/2023/09/24/Aq7bLzp4knNGWsw.png)

还可以用第三个参数作为索引

```html
<div id="box">
        <ul>
            <li v-for="(val,name,index) in obj">
                {{val}}:{{name}}:{{index}}
            </li>
        </ul>
    </div>
```

### 数组更新检测

Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

你可以打开控制台，然后对数组尝试调用变更方法。

### 在 `v-for` 里使用范围值

`v-for` 也可以接受整数。在这种情况下，它会把模板重复对应次数。

```
<div>
  <span v-for="n in 10">{{ n }} </span>
</div>
```



## 生命周期

1. 又名：生命周期回调函数、生命周期函数、生命周期钩子
2. 是什么：Vue在关键时刻帮我们调用的一些特殊名称的函数
3. 生命周期函数的名字不可更改，但函数的具体内容是程序员根据需求编写的
4. 生命周期函数中的this指向是vm或组件实例对象

通过外部定时器实现无限透明

```html
<body>
    <div id="box">
        <h1 :style="{opacity}">Vue欢迎您</h1>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                opacity: 1
            }
        })
        // 通过外部的定时器实现无限透明的效果
        setInterval(() => {
            if (vm.opacity <= 0) {
                vm.opacity = 1
            }
            vm.opacity -= 0.01
        }, 16);
    </script>
</body>
```

Vue完成模板的解析并把初始的真实DOM元素放入页面后(挂载完毕)调用mounted

通过生命周期实现无限透明

```html
<body>
    <div id="box">
        <h1 :style="{opacity}">Vue欢迎您</h1>
    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            data: {
                opacity: 1
            },
            // 第一次将元素放入页面调用mounted叫做挂载
            mounted() {
                console.log("666")
                setInterval(() => {
                    if (this.opacity <= 0) {
                        this.opacity = 1
                    }
                    this.opacity -= 0.01
                }, 16);
            },
        })
    </script>
</body>
```

### 挂载流程

生命周期流程图

<img src="https://s2.loli.net/2023/09/24/JKEO3vPFSuCNf5l.png" alt="生命周期" style="zoom: 50%;" />

刚开始创建Vue时，初始化生命周期、事件，数据代理未开始，说明_data还未创建，来到beforeCreate上，在beforeCreate上无法通过vue的对象来访问到data中的数据和methods中的方法，在代码中进行检验，看看是否无法访问

```html
<body>
    <div id="box">
        <h2>n:{{n}}</h2>
        <button @click="add">点我让N++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {
                n: 0
            },
            methods: {
                add() {
                    this.n++
                }
            },
            beforeCreate() {
                console.log('beforeCreate', this.n)
            },
        })
    </script>
</body>
```

![image-20230924141306933](https://s2.loli.net/2023/09/24/uBeT7gykJKlObHD.png)

此时这里的n并没有出现，因为还是beforeCreate时

接着继续进行初始化，将数据监测、数据代理，也就是_data初始化了，来到created上，就可以通过Vue访问到数据和方法了，在代码中进行检验，看看效果

```html
<body>
    <div id="box">
        <h2>n:{{n}}</h2>
        <button @click="add">点我让N++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {
                n: 0
            },
            methods: {
                add() {
                    this.n++
                }
            },
            created() {
                console.log('created', this.n)
            },
        })
    </script>
</body>
```

此时在created上就有n的值了

created结束后，接着就是判断是否存在el的值，如果存在el，就查看是否有template的选项，如果没有，就根据el所在的位置去解析Html的值，该阶段只是解析模板，但是并没有显示解析好的内容，只能显示初始的html页面，vue中的效果还没有渲染

在beforeMount上就会呈现未经Vue编译的DOM结构，这里测试一下，看看效果

```html
<body>
    <div id="box">
        <h2>n:{{n}}</h2>
        <button @click="add">点我让N++</button>
    </div>
    <script src="../vue.js"></script>
    <script>
        new Vue({
            el: '#box',
            data: {
                n: 0
            },
            methods: {
                add() {
                    this.n++
                }
            },
            beforeMount() {
                console.log('beforeMount')
                debugger;
            },
        })
    </script>
</body>
```

<img src="https://s2.loli.net/2023/09/24/JhmpT98k2qZiKgb.png" alt="image-20230924143453566" style="zoom:50%;" />

在这个阶段，如果你断点后，修改页面中的DOM属性，最终都不会有效，因为渲染解析后，会全部改为Vue解析后的内容

此时我们发现，页面已经解析完成了，但并没有把数据填充上去

接着将内存中的虚拟的DOM转为真实的，插入到页面中

此时，挂载完毕，进入mounted

此时：

页面中呈现的是经过Vue编译的DOM，此时对DOM的操作均有效



回到最开始的el判断，它还有另一条线，如果el不存在时，查找vm.$mount(el),这个相当于主动来指定vm的元素，指定为xxx作为el，与其是一个道理

![image-20230924145225559](https://s2.loli.net/2023/09/24/EMl7I9XzykpZrDN.png)

关闭了el后，在命令行下输入该内容也是一个道理，也会主动的进行解析，如果两个都没满足，vue就不会进行工作了，也就是不会进行解析了，接着就是查看是否存在template这个属性了，如果存在，就进行解析

template中的内容需要被包裹，它需要一个根节点的支持

```html
<body>
    <div id="box">

    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            template: '<div><h2>n:{{n}}</h2><button @click="add">点我让N++</button></div>',
            data: {
                n: 0
            },
            methods: {
                add() {
                    this.n++
                }
            },
            beforeMount() {
                console.log('beforeMount')
            },
        })
    </script>
</body>
```

### 更新流程

接着进入更新流程后，先判断数据是否改变了，数据更新前，也就是beforeUpdate时

此时：

数据是新的，页面是旧的，此时页面和数据尚未保持一致

```html
<body>
    <div id="box">

    </div>
    <script src="../vue.js"></script>
    <script>
        const vm = new Vue({
            el: '#box',
            template: '<div><h2>n:{{n}}</h2><button @click="add">点我让N++</button></div>',
            data: {
                n: 0
            },
            methods: {
                add() {
                    this.n++
                }
            },
            beforeUpdate() {
                console.log(this.n)
                debugger
            },
        })
    </script>
</body>
```

接着根据新数据，生成新的虚拟DOM，随后与旧的虚拟DOM进行比较，最终完成页面更新，即：完成了Model到View的更新

此时：进入到了updated，也就是更新后，数据是新的，页面也是新的，此时的页面与数据是保持同步的

### 销毁流程

当vm.$destroy方法被调用时，就调用销毁流程的方法

先进入销毁前，也就是beforeDestory

此时：vm中所有的：data、methods、指令等等，都处于可用状态，马上要执行销毁过程，一般在此阶段：关闭定时器、取消订阅消息、解绑自定义事件等收尾操作

最后destoyed，销毁 

### 生命周期总结

常用的生命周期钩子：

1. mounted：发送ajax请求、启动定时器、绑定自定义事件、订阅消息等【初始化操作】
2. beforeDestory：清除定时器、解绑自定义事件、取消订阅消息等【收尾操作】

关于销毁Vue实例

1. 销毁后借助Vue开发者工具看不到任何信息
2. 销毁后自定义事件会失效，但原生DOM事件依然有效
3. 一般不会再beforeDestory操作数据，因为即便操作数据，也不会再触发更新流程了



# Vue组件化编程

Vue是组件化的，这里给出一个Vue组件的示例：

```js
Vue.component('box', {
            data: function () {
                return {
                    count: 0
                }
            },
            template: `<button @click="count++">{{count}}++</button>`
        })
```

这是一个Vue的组件，叫做box，参数是一个count，模板是template中的内容

```html
<div id="box2">
        <box></box>
    </div>
```

```js
new Vue({
            el: '#box2'
        })
```

在id为box2下的div调用这个组件并进行使用，使用方式就是一种标签的形式

## 组件的复用

你可以将组件进行任意次数的复用

```html
<div id="box2">
        <box></box>
        <box></box>
        <box></box>
        <box></box>
    </div>
```

每个组件都会各自独立维护它的 `count`。因为你每用一次组件，就会有一个它的新**实例**被创建。

### data必须是一个函数

一般情况下，data都是以这种形式来展示的

```js
data: {
  count: 0
}
```

取而代之的是，一个组件的`data`选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝

```js
data:function(){
	return{
		count:0
	}
}
```

如果 Vue 没有这条规则，点击一个按钮就可能会影响到*其它所有实例*，可能会发展成全局的一种值的方式，每个组件都不会是独立的形态

## 组件的组织

通常一个应用会以一棵嵌套的组件树的形式来组织：

<img src="https://s2.loli.net/2023/09/25/wmNDCfFAJIPXeKx.png" alt="image-20230925132324509" style="zoom:50%;" />

这里的组件树，最顶层，是最大的一个壳，下面的三个，分别对应着上，下左，和下右三个盒子，下左的盒子内有两个盒子对应着组件树中的两个盒子，而下右也是同理

为了能在模板中使用，这些组件必须**先注册**以便 Vue 能够识别。这里有两种组件的注册类型：**全局注册**和**局部注册**。至此，我们的组件都只是通过 `Vue.component` 全局注册的：

```js
Vue.component('my-component-name', {
  // ... options ...
})
```

全局注册的组件可以用在其被注册之后的**任何** (通过 `new Vue`) 新创建的 Vue 根实例，也包括**其组件树中的所有子组件的模板中**。

## 通过Prop向子组件传递数据

Prop是你可以在组件上注册的一些自定义attribute。当一个值传递给一个prop attribute的时候，或者说当一个值传递给在组件上注册的attribute时，它就变成了组件实例的一个property，为了传递一个标题，我们可以用一个props选项将其包含在该组件可接收的prop列表中

```js
 Vue.component('blog-title', {
            props: ['title'],
            template: `<h3>{{title}}</h3>`
        })
```

这里写了一个叫做blog-title的组件，里面是一个模板语法，内置了props的title，当title存在时显示标签中的内容

## 非单文件组件

一个文件中包含有n个组件

类似于下图所示

![image-20230925160204423](https://s2.loli.net/2023/10/05/cmnvJDC5gRLdb9h.png)

### 组件学习

Vue中使用组件的三大步骤：

1. 定义组件(创建组件)
2. 注册组件
3. 使用组件(写组件标签)

如何定义一个组件？

使用Vue.extend(options)创建,其中options和new Vue(options)时传入的那个options几乎一样，但也有点区别：

区别如下：

1. el不要写，为什么？	最终所有组件都要经过一个vm的管理，由vm中的el决定服务哪个容器
2. data必须写成函数，为什么？    避免组件被复用时，数据存在引用关系

备注：在options中可以使用template配置组件结构 

如何注册组件？

1. 局部注册：靠new Vue的时候传入components选项
2. 全局注册：靠Vue.component('组件名',组件)

编写组件标签：<组件名></组件名>

#### 创建组件

通过Vue.extend来进行创建

这里的data要作为函数来进行编写，这样可以使得组件独立，函数每一次都会返回一个全新的内容

```js
// 创建school组件
        const school = Vue.extend({
            // el: '#box', 组件定义时,一定不要写el配置项,因为最终所有的组件都要被一个vm管理,由vm决定服务于谁
            template: `
                <div>
                    <h2>学校名称{{schoolName}}</h2>
        <h2>学校地址{{address}}</h2>
                    </div>
            `,
            data() {
                return {
                    schoolName: 'NB',
                    address: '北京'
                }
            }
        })
        // 创建student组件
        const student = Vue.extend({
            template: `
            <div>
            <h2>学生名称{{studentName}}</h2>
            <h2>学生年龄{{age}}</h2></div>
            `,
            // el: '#box', 组件定义时,一定不要写el配置项,因为最终所有的组件都要被一个vm管理,由vm决定服务于谁
            data() {
                return {
                    studentName: '张三',
                    age: 19
                }
            }
        })
```

#### 注册组件

```js
// 注册组件
        new Vue({
            el: '#box',
            // 局部注册
            components: {
                school,
                student
            }
        })
```

#### 使用组件

```html
<!-- 使用组件标签 -->
        <school></school>
        <hr>
        <!-- 使用组件标签 -->
        <student></student>
```

#### 局部注册和全局注册

```js
// 注册组件
        new Vue({
            el: '#box',
            // 局部注册
            components: {
                school,
                student
            }
        })
```

这样的注册只能算局部注册

有时候在一个页面里面可以用到多个组件，一个组件中需要使用到另一个组件中定义的组件，此时就需要全局注册，如果不进行全局注册，只能将之前的局部注册在需要使用到该组件的大组件中再次注册(components)

```js
Vue.component('组件名称', 组件变量名)
```

#### 组件的几个注意点

1. 关于组件名：

	- 一个单词组成：

		- 第一种写法(首字母小写)：school
		- 第二种写法(首字母大写)：School

	- 多个单词组成：

		- 第一种写法(kebab-case命名)：my-school
			- 第二种写法(CamelCase命名)：MySchool（需要Vue脚手架支持）

	- 备注：

		1. 组件名尽可能回避HTML中已有的元素名称，例如：h1,H2都不行
		2. 可以使用name配置项指定组件在**开发者工具**中呈现的名字

		```js
		// 定义组件
		        const school = {
		            name: 'test',
		            template: `
		                <div>
		                    <h2>{{name}}</h2>    
		                </div>
		            `,
		            data() {
		                return {
		                    name: '张三'
		                }
		            }
		        }
		```

		

2. 关于组件标签

	- 第一种写法：<school></school>
	- 第二种写法：<school/>(在脚手架中使用较好，因为非脚手架无法一次性 处理多个自闭合标签)
	- 备注：不使用脚手架时，<school/>会导致后续组件不能渲染

3. 一个简写的方式：

	const school = Vue.extend(options) 可简写为：const school = options

```js
// 定义组件
        const school = {
            template: `
                <div>
                    <h2>{{name}}</h2>    
                </div>
            `,
            data() {
                return {
                    name: '张三'
                }
            }
        }
```

#### 组件的嵌套

将一个组件嵌套到另一个组件中，就叫做组件的嵌套

下面是一个组件嵌套的示例，student是被嵌套的组件,school嵌套了student组件的内容，最后在#box的根元素处调用了school组件，又是一个嵌套

```html
<body>
    <div id="box">
        <school></school>
    </div>
    <script src="../vue.js"></script>
    <script>
        const student = Vue.extend({
            template: `
                <div>
                <h2>学生名称{{name}}</h2>
                </div>
            `,
            data() {
                return {
                    name: '张三'
                }
            }
        })
        const school = Vue.extend({
            template: `
                <div>
                <h2>学校名称{{name}}</h2>
                <student></student>
                </div>
            `,
            data() {
                return {
                    name: 'WD'
                }
            },
            components: {
                student
            }
        })

        new Vue({
            el: '#box',
            components: {
                school
            }
        })

    </script>
</body>
```



### VueComponent

1. school组件本质是一个名为VueComponent的构造函数，且不是程序员定义的，是Vue.extend生成的

2. 我们只需要写<school/>或<school></school>，Vue解析时会帮我们创建school组件的实例对象，即Vue帮我们执行的：new VueComponent(options)

3. 特别注意：每次调用Vue.extend，返回的是一个全新的VueComponent！

4. 关于this指向：

	1. **组件配置**中：
		- data函数、methods中的函数、watch中的函数、computed中的函数，它们的this均是【VueComponent实例对象】
	2. new **Vue**(options)配置中：
		- data函数、methods中的函数、watch中的函数、computed中的函数，它们的this均是【Vue实例对象】

5. VueComponent的实例对象，以后简称vc(也可以称之为：组件实例对象)

	Vue的实例对象，以后简称vm



### 分析Vue和VueComponent的关系

1. VueComponent.prototype. ____proto____ === Vue.prototype
2. 为什么要有这个关系：让组件实例对象(vc)可以访问到Vue原型上的属性、方法

在看内置关系之前，需要先知道原型对象的概念

下面的这段代码讲述了一件事情，就是关于隐式原型属性和显示原型属性是否一致，这俩是一致的，都归类在原型对象上

```js
<body>
    <script src="../vue.js"></script>
    <script>
        // 定义一个构造函数
        function Demo() {
            this.a = 1
            this.b = 2
        }
        // 创建一个Demo的实例对象
        const d = new Demo()
        console.log(Demo.prototype) // 显示原型属性
        console.log(d.__proto__)// 隐式原型属性

        // 比较显示原型属性和隐式原型属性是否相同
        console.log(Demo.prototype === d.__proto__)

        // 通过显示原型属性操作原型对象，追加一个x属性，值为99
        Demo.prototype.x = 99

        // 通过隐式原型对象查看x
        console.log(d.__proto__.x)


    </script>
</body>
```

证明了原型对象内的东西是一致的



Vue对象是一个显示原型链，当Vue存在一个实例对象，实例对象会通过隐式原型链，链到Vue的原型对象上，而Vue的原型对象会通过隐式原型链，链到它的缔造者的原型对象身上，Vue的缔造者就是Object，所以Vue的原型对象链接到了Object的原型对象身上

而VueComponent在编写组件标签后，就会创建一个VueComponent的实例对象，暂且称为vc，它通过隐式原型链会链接到缔造者的身上，也就是VueComponent的原型对象身上，而VueComponent的原型对象也有一条隐式的原型链，通过这条原型链，它会链到Vue的原型对象身上，也就是说，VueComponent可以访问到Vue身上的属性和方法，因为VueComponent的原型对象关联了Vue的原型对象

![image-20230926141257683](https://s2.loli.net/2023/10/05/tX6knTrSR4PYGUV.png)



## 单文件组件

一个文件只包含1个组件，这种单文件组件的形式更加常用

如何创建一个单文件组件，文件名.vue，就创建成功了

里面的代码结构如下：

```vue
<template>
  <!-- 组件的结构 -->
  <div></div>
</template>

<script>
// 组件交互相关的代码(数据、方法等等)
export default {
  name: "JsV1",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
// 组件的样式
</style>
```

但是发现写了之后没有代码高亮提示，我们需要安装一个插件来添加vue文件的代码高亮提示

<img src="https://s2.loli.net/2023/10/05/yMDJFpaBfox6vR9.png" alt="image-20230926144306065" style="zoom: 50%;" />

接着编写组件，组件的基本格式为：

```vue
<template>
  <!-- 组件的结构 -->
  <div class="demo">
    <h2>姓名{{ name }}</h2>
    <button @click="showName">点我提示学校名</button>
  </div>
</template>

<script>
// 组件交互相关的代码(数据、方法等等)
// 通常使用export default暴露，这样导入也很方便
export default {
  // 这里的名称通常和文件名一致，要符合首字母
  name: "V1",

  data() {
    return {
      name: "张三",
    };
  },

  mounted() {},

  methods: {
    showName() {
      alert(this.name);
    },
  },
};
</script>

<style lang="scss" scoped>
// 组件的样式
.demo {
  background: #ff6900;
}
</style>
```

如果想使用组件，可以创建一个App.vue来进行使用，这里的App可以换成任意的名字，是一个作为汇总的总组件

```vue
<template>
  <div>
    <School></School>
  </div>
</template>

<script>
import School from "./v1.vue";
export default {
  name: "App",
  components: {
    School: School,
  },
};
</script>

<style lang="scss" scoped>
</style>
```

一般情况下，都不会new Vue，因为.vue后缀的文件都是组件，组件都不会new Vue

所以我们需要创建一个js文件，在vue中一般叫做main.js

```js
import App from './App.vue'

new Vue({
    el:'#box',
    components:{
        App
    }
})
```

将APP的组件注册后，我们并没有编写容器来容纳我们的程序在哪展示，所以需要创建一个index.html来展示

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="box">
        <App></App>
    </div>
    <!-- 需要引入vue.js和已经导入App组件的main.js文件 -->
    <script src="../vue.js"></script>
    <script src="main.js"></script>
    
</body>
</html>
```

如果不想在index.html中进行App标签的编写,可以在main.js中编写对应template的代码

# 使用vue脚手架

Vue脚手架是Vue官方提供的标准化开发工具(开发平台)

vue脚手架官方文档：https://cli.vuejs.org/zh/

以下命令都在命令行使用

1. 全局安装@vue/cli

	`npm install -g @vue/cli`

2. 安装完成后，关闭命令行，再重新打开

	`vue`

	当出现vue相关的提示命令时，说明安装成功了

3. 切换到你要创建项目的目录，然后使用命令创建项目(创建的项目不能包含大写字母)

	`vue create xxxx`

4. 启动项目 

	`npm run serve`

提示：

- 如出现下载缓慢请在命令行配置npm淘宝镜像 `npm config set registry https://registry.npm.taobao.org`
- Vue脚手架隐藏了所有webpack相关的配置，若想查看具体的webpack配置，请执行：v`ue inspect > output.js`

## 分析脚手架结构

assets文件夹一般用来存放静态资源

components一般存放组件

![image-20230926170404634](https://s2.loli.net/2023/10/05/1XFzLQWpuxDiA25.png)

### 脚手架文件结构

- node_modules
- public
	- favicon.ico：页签图标
	- index.html：主页面
- src
	- assets：存放静态资源
		- logo.png
	- component：存放组件
		- HelloWorld.vue
	- App.vue：汇总所有组件
	- main.js：入口文件
- .gitignore：git版本管制忽略的配置
- babel.config.js：babel的配置文件
- package.json：应用包配置文件
- README.md：应用描述文件
- package-lock.json：包版本控制文件



### main.js

```js
/*
该文件是整个项目的入口文件
*/
// 引入vue框架
import Vue from 'vue'
// 引入App组件，它是所有组件的父组件
import App from './App.vue'
// 关闭vue的生产提示
Vue.config.productionTip = false

// 创建vue的实例对象--->vm
new Vue({
  // 下面这行代码后面解释,功能：完成了将App组件放入容器中
  render: h => h(App),
}).$mount('#app')
```

### index.html

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <!-- 针对IE浏览器的特殊配置,含义是让IE浏览器以最高的渲染级别渲染页面 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 开启移动端的理想视口 -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <!-- 配置页签的图标 -->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <!-- 配置网页的标题:在package.json的第二行中配置的name -->
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <!-- 如果浏览器不支持js时，noscript中的元素就会被渲染 -->
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <!-- 容器 -->
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

运行测试一下看看效果，如果报错

`Component name “Student” should always be multi-word vue/multi-word-component-names`

原因是组件中的驼峰命名不规范，要么改成多个单词的驼峰命名，要么就在vue.config.js中修改内容为

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false
})
```



### render函数

关于不同版本的Vue：

1. vue.js与vue.runtime.xxx.js的区别：
	1. vue.js是完整版的Vue，包含：核心功能+模板解释器
	2. vue.runtime.xxx.js是运行版的Vue只包含：核心功能：没有模板解释器
2. 因为vue.runtime.xxx.js没有模板解析器，所以不能使用template配置项，需要使用render函数接收到的createElement函数去指定具体内容

![image-20230927134201945](https://s2.loli.net/2023/09/27/qXcJuA69WEseM14.png)

## 修改默认配置

```shell
vue inspect > output.js
```

将vue脚手架的默认配置整理成一个.js文件

该指令需要在vue脚手架文件所在处运行

被红色框框选的文件夹或文件的名称不可以修改

![image-20230927192746582](https://s2.loli.net/2023/09/27/ux1NglU6OTDbCqJ.png)

如果需要修改默认文件，可以在vue.config.js下进行修改，这是一个可选的文件，也就是说没有也可以，如果没有的话，使用的就是vue默认的配置项，如果需要修改，可以在与packagejson同级的目录下进行添加

有些配置项是不可改的，如果需要修改对应的配置项，可以在vue官网进行查阅：https://cli.vuejs.org/zh/config/

现在来进行测试一下，看看修改了配置项以后能否生效

在vue.config.js中进行修改

```js
module.exports = defineConfig({
  pages:{
    index:{
      // 入口
      entry:'src/peiqi.js'
    }
  }
})
```

然后修改一下main.js的文件名为peiqi.js

重新运行`npm run serve`



关闭语法检查

```js
module.exports = defineConfig({
  lintOnSave:false,	// 关闭语法检查
})
```



## ref属性

1. 被用来给元素或子组件注册引用信息(id替代者)
2. 应用在html标签上获取的是真实DOM元素，应用在组件标签上是组件实例对象(vc)
3. 使用方式
	- `打标识：<h1 ref="xxx">.....</h1>或<School ref="xxx"></School>`
	- 获取`this.$refs.xxx`

ref属性可以帮助我们获取对应的DOM元素

下面是一个利用ref属性获取对应DOM元素的方法

可以忽略对应的组件，里面其实就写了一个获取DOM元素的点击事件，因为methods方法对应的是vc，在vc中就存在着ref的属性，通过ref就可以获得对应的DOM元素了

为哪一个标签添加ref，到时候就可以通过vc来进行获取

```vue
<template>
  <div id="app">
    <h1 ref="title">学习Vue</h1>
    <button @click="showDOM">点我获取上方的DOM元素</button>
    <Student></Student>
  </div>
</template>

<script>
import Student from "./components/Student.vue";

export default {
  name: "App",
  components: {
    Student: Student,
  },
  methods: {
    showDOM() {
      console.log(this.$refs.title);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

如果我给一个组件设置了ref属性，那么我能拿到什么呢？

那么我们就可以获得对应的组件实例对象

```vue
showDOM() {
      console.log(this.$refs.title); // 真实DOM元素
      console.log(this.$refs.school); // school组件的实例对象(vc)
      console.log(document.querySelector("#school")); // school组件的真实DOM元素
    },
```

## props配置

功能：让组件接收到外部传过来的数据

1. 传递数据：`<Demo name="xxx"/>`

2. 接收数据：

	- 第一种方式(只接收)：

		`props:['name']`

	- 第二种方式(限制类型)：

		`props:{`

		​	`name:String`

		`}`

	- 第三种方式(限制类型、限制必要性、指定默认值)

		props:{

		​	name:{

		​		type:String,	// 类型

		​		required:true,	//必要性

		​		default:'老王'		// 默认值

		}

		}

3. ```txt
	备注：props是只读的，Vue底层会监测你对props的修改，如果进行了修改，就会发出警告，若业务需求确实需要修改，那么请复制props的内容到data中一份，然后去修改data中的数据
	```

有些时候其他地方需要该组件，但是参数不一定与默认的参数一致，需要修改，那该怎么办呢，这时候就要用到props属性了，它可以在组件上添加属性

props配置有三种方式，例如我们有一个Student组件

```vue
<template>
  <div>
    <div>学生名称:{{ studentName }}</div>
    <div>学生年龄:{{ age }}</div>
  </div>
</template>

<script>
export default {
  name: "Student",

  data() {
    return {
      studentName: "张三",
      age: 19,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
```

这里面有一个studentName和一个age，我们可能需要为其的学生名称和年龄来做修改

在里面加入props,并删除data中的studentName和age属性

```vue
<script>
export default {
  name: "Student",

  data() {
    return {};
  },
  props: ["studentName", "age"],

  mounted() {},

  methods: {},
};
</script>
```

在调用该组件的位置赋值

```vue
<template>
  <div id="app">
    <Student studentName="李四" age="20"></Student>
  </div>
</template>
```

![image-20230929132311448](https://s2.loli.net/2023/09/29/2cdZp68NzUf147W.png)

但是这里还有个坑

如果我想为这里李四的年龄+1，该如何操作呢，如果直接在学生的组件上对年龄加一，就会造成以下这个情况

`学生名称:李四`

`学生年龄:201`

原因是传递的这个参数是个字符串，字符串+1还是字符串1这样的一种情况

可以通过强制类型转化，将其转为数字类型

```vue
<template>
  <div>
    <div>学生名称:{{ studentName }}</div>
    <div>学生年龄:{{ age * 1 + 1 }}</div>
  </div>
</template>
```

但这不是最好的解决方法

在age上面加入:，也就是v-model，单向绑定，这样会将:age后面的内容修改成一个表达式，js表达式就可以进行计算了，这样的话，20+1=21

```vue
<template>
  <div id="app">
    <Student studentName="李四" :age="20"></Student>
  </div>
</template>
```

有时候粗心大意容易写错代码，可以为props添加限制

```vue
<script>
export default {
  name: "Student",

  data() {
    return {};
  },
  props: {
    studentName: String,
    age: Number,
  },

  mounted() {},

  methods: {},
};
</script>
```

添加了限制后，当类型不正确时，就会出现异常

### props的高级写法

接收的同时对数据：进行类型限制+默认值的指定+必要性的限制

```vue
 props: {
    studentName: {
      type: String, // studentName的类型是字符串
      required: true, // studentName必须传递的一个参数
    },
    age: {
      type: Number, // age的类型是数字类型
      default: 99, // 可传可不传，不传就给个默认值
    },
  },
```

## mixin混入

功能：可以把多个组件共用的配置提取成一个混入对象

使用方式：

​	第一步定义混合，例如：

​		{

​			data(){....},

​			methods:{.....}

​			.........

}

第二步使用混入,例如：

1. 全局混入：Vue.mixin(xxx)
2. 局部混入：mixins：['xxx']



先将代码修改为原样

School组件

```vue
<template>
  <div>
    <h1 @click="showName">学校名称:{{ schoolName }}</h1>
  </div>
</template>

<script>
export default {
  name: "Student",

  data() {
    return {
      schoolName: "NB",
    };
  },

  mounted() {},

  methods: {
    showSchool() {
      alert(this.schoolName);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
```

Student组件

```vue
<template>
  <div>
    <h1 @click="showName">学生名称:{{ studentName }}</h1>
    <h1>学生年龄:{{ age }}</h1>
  </div>
</template>

<script>
export default {
  name: "Student",

  data() {
    return {
      studentName: "张三",
      age: 19,
    };
  },

  mounted() {},

  methods: {
    showName() {
      alert(this.studentName);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
```

App组件

```vue
<template>
  <div id="app">
    <School />
    <hr />
    <Student />
  </div>
</template>

<script>
import School from "./components/School.vue";
import Student from "./components/Student.vue";

export default {
  name: "App",
  components: {
    School,
    Student,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

```

这里的Student和School组件都有一个类似的方法，把这俩东西整合成一个东西，然后在俩组件中引用一下，就是混入了

在src目录下新建一个mixin.js，文件名不固定

将Student和School组件中的methods删除，并在mixin文件中添加如下内容

```js
export const mixin = {
    methods: {
    showName() {
      alert(this.name);
    },
  }
}
```

应用mixin对应的混入内容

School

```vue
<script>
import { mixin } from "../mixin";

export default {
  name: "Student",

  data() {
    return {
      name: "NB",
    };
  },
  mixins: [mixin],
  mounted() {},
};
</script>
```

Student

```vue
<script>
import { mixin } from "../mixin";
export default {
  name: "Student",

  data() {
    return {
      name: "张三",
      age: 19,
    };
  },
  mixins: [mixin],

  mounted() {},
};
</script>
```

如果想要全局混入，可以在main.js中进行配置

先导入对应的mixin，然后在Vue中使用对应的mixin

```js
import {mixin} from './mixin'
Vue.mixin(mixin)
```

## 插件

功能：用于增强Vue

本质：包含install方法的一个对象，install的第一个参数是Vue，第二个以后的参数是插件使用者传递的数据，也就是说，在main.js中里引入插件后，可以为它添加参数，例如：Vue.use(plugins,xxx,xxx,xxx)

定义插件：

```js
export default {
    install(Vue,xxx,xxx){
        console.log("@@install",Vue)
    }
}
```

使用插件：Vue.use(xxx)

先修改之前的内容为

App

```vue
<template>
  <div id="app">
    <School />
    <hr />
    <Student />
  </div>
</template>

<script>
import School from "./components/School.vue";
import Student from "./components/Student.vue";

export default {
  name: "App",
  components: {
    School,
    Student,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

main.js

```js
/*
该文件是整个项目的入口文件
*/
// 引入vue框架
import Vue from 'vue'
// 引入App组件，它是所有组件的父组件
import App from './App.vue'
// 关闭vue的生产提示
Vue.config.productionTip = false
// 创建vue的实例对象--->vm
new Vue({
  // 下面这行代码后面解释,完成了将App组件放入容器中
  render: h => h(App),
}).$mount('#app')
```

School

```vue
<template>
  <div>
    <h1>学校名称:{{ name }}</h1>
  </div>
</template>

<script>
export default {
  name: "School",

  data() {
    return {
      name: "NB",
    };
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
```

Student

```vue
<template>
  <div>
    <h1>学生名称:{{ name }}</h1>
    <h1>学生年龄:{{ age }}</h1>
  </div>
</template>

<script>
export default {
  name: "Student",

  data() {
    return {
      name: "张三",
      age: 19,
    };
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
```

在src下新建一个文件，作为自己定义的插件

plugins

```js
export default {
    install(){
        console.log("@@install")
    }
}
```

接着在main.js中引入对应的插件

```js
// 引入plugins插件
import plugins from './plugins'
// 在Vue中使用对应的插件
Vue.use(plugins)
```

在install方法中可以添加一个形参，这个形参是一个Vue的构造器

```js
export default {
    install(Vue){
        console.log("@@install",Vue)
    }
}
```

## scoped样式

作用：让样式在局部生效，防止冲突

写法：`<style scoped>`

当我们在组件中编写样式后，最终，它们的样式都会放到一起，如果有两个相同的类名，就会造成样式冲突,当样式冲突后，后引入中组件的同名样式会覆盖掉前面的样式

想解决这个问题，可以在style标签上添加一个scoped

```css
<style scoped>
.test {
  background: red;
}
</style>
```

## Todo-List案例

需求：输入对应的任务，可以添加或删除，以及勾选完成的组件并删除，带有全选或复选的功能

组件拆分：

- Header：头部，搜索栏
- List：展示列表
- Item：列表中的每一项
- Footer：底部按钮

![image-20230930083912858](https://s2.loli.net/2023/09/30/qioMbrl4CvVJ1ya.png)

先删除之前创建的Student组件和School组件，再修改App.vue中的代码

```vue
<template>
  <div id="app"></div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
```

根据上图所示，先创建对应的组件

但是这样起名可能会造成与h5标签冲突的问题，所以修改对应的名称

TodoHeader

```vue
<template>
  <div></div>
</template>

<script>
export default {
  name: "TodoHeader",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
```

TodoList

```vue
<template>
  <div></div>
</template>

<script>
export default {
  name: "TodoList",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
```

TodoItem

```vue
<template>
  <div></div>
</template>

<script>
export default {
  name: "TodoItem",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
```

TodoFooter

```vue
<template>
  <div></div>
</template>

<script>
export default {
  name: "TodoFooter",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
```

在App中引入对应的组件

```vue
<script>
import TodoFooter from "./components/TodoFooter.vue";
import TodoHeader from "./components/TodoHeader.vue";
import TodoList from "./components/TodoList.vue";
export default {
  name: "App",
  components: {
    TodoHeader,
    TodoList,
    TodoFooter,
  },
};
</script>
```

这里没有引入Item组件，原因是Item是包含在List组件中的，所以不需要在App中引入，可以在List组件中进行引入，然后在App中引入List即可

接着在List组件中引入Item

```vue
<script>
import TodoItem from "./TodoItem.vue";
export default {
  name: "TodoList",

  data() {
    return {};
  },

  mounted() {},
  components: {
    TodoItem,
  },

  methods: {},
};
</script>
```

在App中引入html页面

```vue
<template>
  <div id="app">
    <div class="todo-container">
      <div class="todo-wrap">
        <div class="todo-header">
          <input type="text" placeholder="请输入你的任务名称，按回车键确认" />
        </div>
        <ul class="todo-main">
          <li>
            <label>
              <input type="checkbox" />
              <span>xxxxx</span>
            </label>
            <button class="btn btn-danger" style="display: none">删除</button>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>yyyy</span>
            </label>
            <button class="btn btn-danger" style="display: none">删除</button>
          </li>
        </ul>
        <div class="todo-footer">
          <label>
            <input type="checkbox" />
          </label>
          <span> <span>已完成0</span> / 全部2 </span>
          <button class="btn btn-danger">清除已完成任务</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodoFooter from "./components/TodoFooter.vue";
import TodoHeader from "./components/TodoHeader.vue";
import TodoList from "./components/TodoList.vue";
export default {
  name: "App",
  components: {
    TodoHeader,
    TodoList,
    TodoFooter,
  },
};
</script>

<style>
/*base*/
body {
  background: #fff;
}

.btn {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.btn-danger {
  color: #fff;
  background-color: #da4f49;
  border: 1px solid #bd362f;
}

.btn-danger:hover {
  color: #fff;
  background-color: #bd362f;
}

.btn:focus {
  outline: none;
}

.todo-container {
  width: 600px;
  margin: 0 auto;
}
.todo-container .todo-wrap {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/*header*/
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(82, 168, 236, 0.6);
}

/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}

/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
```

运行看看效果

没啥毛病

接着拆分为组件，先拆结构，再拆样式

在App中找到对应的Header组件，剪切到TodoHeader中，并将剪切的位置修改为对应的组件名称

TodoHeader

```html
<div class="todo-header">
     <input type="text" placeholder="请输入你的任务名称，按回车键确认" />
</div>
```

```vue
<!-- 头部组件 -->
        <TodoHeader></TodoHeader>
```

接着其他的几个也是一样的道理，切分为不同组件

TodoList

```html
<ul class="todo-main">
          <li>
            <label>
              <input type="checkbox" />
              <span>xxxxx</span>
            </label>
            <button class="btn btn-danger" style="display: none">删除</button>
          </li>
          <li>
            <label>
              <input type="checkbox" />
              <span>yyyy</span>
            </label>
            <button class="btn btn-danger" style="display: none">删除</button>
          </li>
        </ul>
```

```vue
<!-- 列表组件 -->
        <TodoList></TodoList>
```

TodoFooter

```html
<div class="todo-footer">
      <label>
        <input type="checkbox" />
      </label>
      <span> <span>已完成0</span> / 全部2 </span>
      <button class="btn btn-danger">清除已完成任务</button>
    </div>
```

```vue
<!-- 底部组件 -->
        <TodoFooter></TodoFooter>
```

在TodoList中加入Item相关结构

```html
<li>
      <label>
        <input type="checkbox" />
        <span>xxxxx</span>
      </label>
      <button class="btn btn-danger" style="display: none">删除</button>
    </li>
```

```vue
<ul class="todo-main">
      <TodoItem></TodoItem>
      <TodoItem></TodoItem>
      <TodoItem></TodoItem>
      <TodoItem></TodoItem>
    </ul>
```

添加对应样式

header

```css
<style  scoped>
/*header*/
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
}

.todo-header input:focus {
  outline: none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(82, 168, 236, 0.6);
}
</style>
```

list

```css
<style  scoped>
/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
```

item

```css
<style scoped>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
</style>
```

footer

```css
<style  scoped>
/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
}

.todo-footer label {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.todo-footer label input {
  position: relative;
  top: -1px;
  vertical-align: middle;
  margin-right: 5px;
}

.todo-footer button {
  float: right;
  margin-top: 5px;
}
</style>
```

### 初始化列表

将每个数据细分为一个个的对象数组

每个数组中都存在一个对应的对象

这些对象将作为props属性传递到子组件中使用

```vue
<template>
  <div>
    <ul class="todo-main">
      <!-- 利用props传递对象属性给子组件 -->
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo"></TodoItem>
    </ul>
  </div>
</template>

<script>
import TodoItem from "./TodoItem.vue";
export default {
  name: "TodoList",

  data() {
    return {
      todos: [
        { id: "001", title: "喝水", done: true },
        { id: "002", title: "喝茶", done: true },
        { id: "003", title: "喝饮料", done: false },
      ],
    };
  },

  mounted() {},
  components: {
    TodoItem,
  },

  methods: {},
};
</script>

<style  scoped>
/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
```

子组件接收后，可以对其进行操作

```vue
<template>
  <div>
    <li>
      <label>
        <!-- 根据对象中的done属性决定是否可选 -->
        <input type="checkbox" :checked="todo.done" />
        <!-- 通过props添加标题 -->
        <span>{{ todo.title }}</span>
      </label>
      <button class="btn btn-danger" style="display: none">删除</button>
    </li>
  </div>
</template>

<script>
export default {
  name: "TodoItem",

  data() {
    return {};
  },
  // 添加props传入的对象
  props: ["todo"],

  mounted() {},

  methods: {},
};
</script>

<style scoped>
/*item*/
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
</style>
```

### 添加

如果想要添加的话，就需要在输入框中输入对应的内容，如何获取输入框的内容呢，有两种方式

先为输入框绑定对应的键盘事件

```vue
<input
        type="text"
        placeholder="请输入你的任务名称，按回车键确认"
        @keyup.enter="add"
      />
```

第一种

通过方法中的event来获取标签对应的值

```vue
methods: {
    add(event) {
      console.log(event.target.value);
    },
  },
```

第二种

在标签中绑定v-model

```vue
<input
        type="text"
        placeholder="请输入你的任务名称，按回车键确认"
        @keyup.enter="add"
        v-model="headValue"
      />
```

在data中设置该属性，并输出数据测试

```vue
<script>
export default {
  name: "TodoHeader",

  data() {
    return {
      headValue: "",
    };
  },

  mounted() {},

  methods: {
    add(event) {
      console.log(this.headValue);
      // console.log(event.target.value);
    },
  },
};
</script>
```

这里用哪一种都可以，不影响

接着我们需要考虑如何将数据放到页面上，之前封装的都是一个个的对象，所以这里也需要封装成对象的形式

这里的id我们通过uuid的形式来进行生成，需要安装一个包

```bash
npm i nanoid
```

安装完成后，需要在需要使用到的组件上进行引入

```js
import { nanoid } from "nanoid";
```

```js
methods: {
    add(e) {
      const todoObj = {
        id: nanoid(),
        title: e.target.value,
        done: false,
      };
      console.log(todoObj);
    },
  }
```

测试对象是否有效

包装完成后，考虑一个问题，两个组件不在一个位置，我们该如何解决？

props可以在父子组件之间传递数据，所以我们可以考虑将数据放到App中，通过App来进行数据的传递

App

```vue
<template>
  <div id="app">
    <div class="todo-container">
      <div class="todo-wrap">
        <!-- 头部组件 -->
        <TodoHeader></TodoHeader>
        <!-- 列表组件 -->
        <TodoList :todos="todos"></TodoList>
        <!-- 底部组件 -->
        <TodoFooter></TodoFooter>
      </div>
    </div>
  </div>
</template>

<script>
import TodoFooter from "./components/TodoFooter.vue";
import TodoHeader from "./components/TodoHeader.vue";
import TodoList from "./components/TodoList.vue";
export default {
  name: "App",
  components: {
    TodoHeader,
    TodoList,
    TodoFooter,
  },
  data() {
    return {
      todos: [
        { id: "001", title: "喝水", done: true },
        { id: "002", title: "喝茶", done: true },
        { id: "003", title: "喝饮料", done: false },
      ],
    };
  },
};
</script>
```

TodoList

```vue
<script>
import TodoItem from "./TodoItem.vue";
export default {
  name: "TodoList",

  mounted() {},
  components: {
    TodoItem,
  },
  props: ["todos"],

  methods: {},
};
</script>
```

而对象的数据是存在Header中，子组件如何向父组件传递数据呢？

需要先让父组件给子组件传递一个函数，接着子组件在方法中调用函数，就可以将参数传递给父组件

先让App组件给Header组件传递函数

```vue
 <!-- 头部组件 -->
        <TodoHeader :addTodo="addTodo"></TodoHeader>
```

```js
methods: {
    addTodo(todo) {
	  // 添加对应的todo对象
      this.todos.unshift(todo);
    },
  },
```

子组件接收对应函数并调用

```vue
<script>
import { nanoid } from "nanoid";
export default {
  name: "TodoHeader",

  data() {
    return {};
  },
  props: ["addTodo"],

  mounted() {},

  methods: {
    add(e) {
      // 校验数据
      if (e.target.value.trim() == "") return alert("输入不能为空");
      // 造对象
      const todoObj = {
        id: nanoid(),
        title: e.target.value,
        done: false,
      };
      // 添加对象
      this.addTodo(todoObj);
      // 输入完成后，就输入框中的内容置为空
      e.target.value = "";
    },
  },
};
</script>
```

### 勾选

当内容被勾选上后，对应的数据也会被修改

有两种方法处理勾选的事件

第一种

为多选框绑定单击事件，被点击后改变对应的数据

Item

```vue
@click="handleClick(todo.id)"
```

```vue
methods: {
    handleClick(todoId) {
      console.log(todoId);
    },
  },
```

第二种

为多选框添加改变事件，当按钮改变时，就改变对应的数据

```vue
 @change="handleClick(todo.id)"
```

```vue
methods: {
    handleClick(todoId) {
      console.log(todoId);
    },
  },
```

接着需要给App组件传递数据，需要对其传递对应的id进行修改

通过App组件传递数据给子组件List

```js
// 勾选
    checkAtItem(id) {
      let todos = this.todos;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          todos[i].done = !todos[i].done;
        }
      }
      console.log(todos);
    }
```

```vue
<!-- 列表组件 -->
        <TodoList :todos="todos" :checkAtItem="checkAtItem"></TodoList>
```

在子组件中继续传递该方法到Item中

```vue
<!-- 利用props传递对象属性给子组件 -->
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :checkAtItem="checkAtItem"
      ></TodoItem>
```

接收并调用对应的方法

```vue
<script>
export default {
  name: "TodoItem",

  data() {
    return {};
  },
  // 添加props传入的对象
  props: ["todo", "checkAtItem"],

  mounted() {},

  methods: {
    handleClick(todoId) {
      this.checkAtItem(todoId);
    },
  },
};
</script>
```

### 删除

先将Item中button的display删除

```html
<button class="btn btn-danger">删除</button>
```

为Item添加两个样式，就可以让button显示出来了

```css
li:hover {
  background: #ddd;
}
li:hover button {
  display: block;
}
```

删除思路和勾选是一样的，依然是获取id，传递参数，然后删除即可

为按钮添加单击事件 

```vue
<button class="btn btn-danger" @click="handleDelete(todo.id)">
```

在App中添加删除的对应代码

```js
// 删除
    deleAtItem(id) {
      if (confirm("确定删除吗?")) {
        let todos = this.todos;
        // 将数据赋值给原数组
        todos = todos.filter((todo) => {
          // 当被删除的id不为数组中的id,就返回数据
          return todo.id !== id;
        });
      }
    },
```

将数据传递

```vue
<!-- 列表组件 -->
        <TodoList
          :todos="todos"
          :checkAtItem="checkAtItem"
          :deleAtItem="deleAtItem"
        ></TodoList>
```

接收对应函数

```vue
props: ["todos", "checkAtItem", "deleAtItem"],
```

接收后继续传递

```vue
 <!-- 利用props传递对象属性给子组件 -->
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :checkAtItem="checkAtItem"
        ::deleAtItem="deleAtItem"
      ></TodoItem>
```

Item也是类似的

```vue
// 添加props传入的对象
props: ["todo", "checkAtItem", "deleAtItem"],
```

```js
handleDelete(todoId) {
      this.deleAtItem(todoId);
    },
```

### 底部统计

先将对象数组传给Footer，然后在Footer中判断对象中的down值是否为true，存在几个true就激活几个

App

```vue
<!-- 底部组件 -->
        <TodoFooter :todos="todos"></TodoFooter>
```

Footer

```vue
<script>
export default {
  name: "TodoFooter",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
  props: ["todos"],
};
</script>
```

为Footer设置总长度

```vue
<span> <span>已完成0</span> / 全部{{ todos.length }} </span>
```

统计已完成的数量

```vue
<span>已完成{{ doneCount }}</span> / 全部{{ todos.length }}
```

```js
computed: {
    doneCount() {
      // 统计已完成的数量
      let i = 0;
      this.todos.forEach((todo) => {
        if (todo.done) i++;
      });
      return i;
    },
  }
```

这样统计不高级，我们要使用高级的方法来统计

返回一个todo统计done值后的属性

```js
computed: {
    doneCount() {
      // reduce第一个参数是一个函数，函数中第一个参数是上一次的值，第二个参数是当前值
      // reduce的遍历次数由数组长度决定，而current由当前值决定，当数组到下一次时，pre会是上一次的current
      // 而current这次会是上一次的返回值
      return this.todos.reduce(
        (pre, current) => pre + (current.done ? 1 : 0),
        0
      );
    },
  },
```

### 底部交互

先将todo.length作为一个计算属性，在后面可以对其进行判断

```vue
<span>已完成{{ doneCount }}</span> / 全部{{ totalCount }}
```

```js
computed: {
    isAll(){
      return totalCount === doneCount
    },
    totalCount() {
      return this.todos.length;
    },
    doneCount() {
      // reduce第一个参数是一个函数，函数中第一个参数是上一次的值，第二个参数是当前值
      // reduce的遍历次数由数组长度决定，而current由当前值决定，当数组到下一次时，pre会是上一次的current
      // 而current这次会是上一次的返回值
      return this.todos.reduce(
        (pre, current) => pre + (current.done ? 1 : 0),
        0
      );
    },
  },
```

```vue
<input type="checkbox" :checked="isAll" />
```

这样写的话，还存在一些小的问题，当数组长度为0时，这个框依然会被选中，所以我们需要加入一个判断

修改isAll

```js
isAll() {
      return this.totalCount === this.doneCount && this.totalCount > 0;
    },
```

而当一个任务都没有时，下面的Footer框就不需要存在了，没有意义

```vue
<template>
  <div>
    <div class="todo-footer" v-show="totalCount">
      <label>
        <input type="checkbox" :checked="isAll" />
      </label>
      <span>
        <span>已完成{{ doneCount }}</span> / 全部{{ totalCount }}
      </span>
      <button class="btn btn-danger">清除已完成任务</button>
    </div>
  </div>
</template>
```

#### 实现全选、全不选功能

添加事件

```vue
<input type="checkbox" :checked="isAll" @change="checkAll" />
```

添加对应的方法

通过checkAll方法查看按钮是否被选中

```js
methods: {
    checkAll(e) {
      console.log(e.target.checked);
    },
  },
```

在App中编写对应的方法，然后将参数传递给对应的组件

这里传递的代码就不展示了，仅展示对应方法

```js
// 全选or全不选
    allOrNoAll(isAll) {
      // 根据isAll来判断是否全选
      this.todos.forEach((todo) => {
        todo.done = isAll;
      });
    }
```

```js
methods: {
    checkAll(e) {
      this.allOrNoAll(e.target.checked);
    },
  },
```

通过计算属性也可以实现，而且更加方便

进行双向绑定后，当数据发生改变时，set方法生效，生效后会导致所有的多选框被选中或取消选择，而set方法生效后，get方法也随之生效，get方法会重新进行判断，判断后得出对应的结果

```vue
<input type="checkbox" v-model="isAll" />
```

```js
isAll: {
      get() {
        return this.totalCount === this.doneCount && this.totalCount > 0;
      },
      set(value) {
        this.allOrNoAll(value);
      },
    },
```

#### 清除所有

为按钮绑定对应的方法

```vue
<button class="btn btn-danger" @click="clearAll">清除已完成任务</button>
```

在App中添加对应的方法

```js
clearAllTodo() {
      this.todos = this.todos.filter((todo) => {
        return !todo.done;
      });
    },
```

将对应的方法传递给Footer

```vue
<!-- 底部组件 -->
        <TodoFooter
          :todos="todos"
          :allOrNoAll="allOrNoAll"
          :clearAllTodo="clearAllTodo"
        ></TodoFooter>
```

```js
 clearAll() {
      this.clearAllTodo();
    },
```

为清除全部添加弹窗提示

```js
clearAllTodo() {
      if (confirm("是否清空所有已选中的内容")) {
        this.todos = this.todos.filter((todo) => {
          return !todo.done;
        });
      }
    }
```

### 总结TodoList案例

1. 组件化编码流程：
	1. 拆分静态组件：组件要按照功能点拆分，命名不要与html元素冲突
	2. 实现动态组件：考虑好数据的存放位置，数据是一个组件在用，还是一些组件在用
		1. 一个组件在用：放在组件自身即可
		2. 一些组件在用：放在共同的父组件上，通过父组件可以让数据传递
	3. 实现交互：从绑定事件开始
2. props适用于：
	1. 父组件==>子组件 通信
	2. 子组件 ==> 父组件 通信(要求父传递给子一个函数，通过函数子将数据传回给父)
3. 使用v-model切记：v-model绑定的值不是props传过来的值，因为props是不可以修改的！
4. props传过来的若是对象类型的值，修改对象中的属性时Vue不会报错，但不推荐这样做



## 浏览器本地存储

localStorage和sessionStorage都统称webStorage

1. 存储内容大小一般支持5MB左右(不同浏览器可能还不太一样)

2. 浏览器端通过Window.sessionStorage和Window.localStorage属性来实现本地存储机制

3. 相关API：

	1. `xxxStorage.setItem('key',value);`

		该方法接受一个键和值作为参数，会把键值对添加到存储中，如果键名存在，则更新对应的值

	2. `xxxStorage.getItem('key');`

		该方法接受一个键名作为参数，返回键名对应的值

	3. `xxxStorage.removeItem('key');`

		该方法接受一个键名作为参数，并把该键名从存储中删除

	4. `xxxStorage.clear()`

		该方法会清空存储中的所有数据

4. 备注：

	1. SessionStorage存储的内容会随着浏览器窗口关闭而消失
	2. LocalStorage存储的内容，需要手动清除才会消失
	3. `xxxStorage.getItem(xxx)`如果xxx对应的value获取不到，那么getItem的返回值是null
	4. `JSON.parse(null)`的结果依然是null

点开一个浏览器，在对应的搜索页面进行搜索，搜索完成后，搜索的历史记录就会被保存到本地，在下一次打开浏览器后，历史记录依然存在，这就是浏览器的本地存储

浏览器中查看本地存储的位置如下

![image-20231001075932376](https://s2.loli.net/2023/10/05/bhtIfCG4RMEuPp2.png)

这里以唯品会网站为例去查找对应的本地存储

在唯品会首页的搜索框中进行搜索，搜索任意内容，这里示例搜索，西装，搜索完成后，关掉浏览器，再次打开唯品会首页

在唯品会首页查看对应的本地存储

![image-20231001080748354](https://s2.loli.net/2023/10/01/qMWCu5TDHIm7JhP.png)

此时发现西装已经被存储到了本地上

回到页面，编写localStorage

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>localStorage</title>
</head>

<body>
    <h2>localStorage</h2>
    <button onclick="saveData()">点我保存数据</button>
    <script>
        function saveData() {
            localStorage.setItem('msg', '666')
            localStorage.setItem('msg2', 666)   // 传入的如果是数值类型，会被自动转换为字符串类型
        }
    </script>
</body>

</html>
```

## ToodList本地存储版

通过watch+localStorage实现本地存储

```vue
<script>
import TodoFooter from "./components/TodoFooter.vue";
import TodoHeader from "./components/TodoHeader.vue";
import TodoList from "./components/TodoList.vue";
export default {
  name: "App",
  components: {
    TodoHeader,
    TodoList,
    TodoFooter,
  },
  data() {
    return {
      // 当转换为json的数据不为空时，返回对应数据，否则返回空
      todos: JSON.parse(localStorage.getItem("todos")) || [],
    };
  },
  methods: {
    clearAllTodo() {
      if (confirm("是否清空所有已选中的内容")) {
        this.todos = this.todos.filter((todo) => {
          return !todo.done;
        });
      }
    },
    // 全选or全不选
    allOrNoAll(isAll) {
      // 根据isAll来判断是否全选
      this.todos.forEach((todo) => {
        todo.done = isAll;
      });
    },
    // 添加
    addTodo(todo) {
      // 添加对应的todo对象
      this.todos.unshift(todo);
    },
    // 勾选
    checkAtItem(id) {
      let todos = this.todos;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          todos[i].done = !todos[i].done;
        }
      }
    },
    // 删除
    deleAtItem(id) {
      if (confirm("确定删除吗?")) {
        // 将数据赋值给原数组
        this.todos = this.todos.filter((todo) => {
          // 当被删除的id不为数组中的id,就返回数据
          return todo.id !== id;
        });
      }
    },
  },
  watch: {
    todos: {
      // 开启深度监视，当里面某个数据改变时，也能监测得到
      deep: true,
      handler(value) {
        // 当数据发生改变时，数据将被存在本地存储中，并转为json字符串
        localStorage.setItem("todos", JSON.stringify(value));
      },
    },
  },
};
</script>
```

## 组件自定义事件-绑定

先在脚手架中准备如下代码

School.vue

```vue
<template>
  <div class="school">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
  </div>
</template>

<script>
export default {
  name: "School",
  data() {
    return {
      name: "NB",
      address: "北京",
    };
  },
};
</script>

<style scoped>
.school {
  background-color: skyblue;
  padding: 5px;
}
</style>
```

Student.vue

```vue
<template>
  <div class="student">
    <h2>学生姓名：{{ name }}</h2>
    <h2>学生性别：{{ sex }}</h2>
  </div>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      name: "张三",
      sex: "男",
    };
  },
};
</script>

<style  scoped>
.student {
  background-color: pink;
  padding: 5px;
  margin-top: 30px;
}
</style>

```

App.vue

```vue
<template>
  <div class="app">
    <h1>{{ msg }}</h1>
    <School />
    <Student />
  </div>
</template>

<script>
import Student from "./components/Student";
import School from "./components/School";

export default {
  name: "App",
  components: { School, Student },
  data() {
    return {
      msg: "你好啊！",
    };
  },
};
</script>

<style scoped>
.app {
  background-color: gray;
  padding: 5px;
}
</style>
```

然后进行一下父子组件的数据传递

将School组件中的name数据传递给App组件

App

```js
methods: {
    getSchoolName(SchoolName) {
      console.log(SchoolName);
    },
  },
```

```vue
<School :getSchoolName="getSchoolName" />
```

School

```vue
props: ["getSchoolName"],
```

```vue
<button @click="sendSchoolName">把学校名称给父组件</button>
```

```js
methods: {
    sendSchoolName() {
      this.getSchoolName(this.name);
    },
  },
```

接着为Student组件的实例对象vc绑定一个叫做nb的事件，被触发后会调用nbDemo对应的方法

```vue
<Student v-on:nb="nbDemo" />
```

编写nbDemo

```js
nbDemo() {
      console.log("666");
    },
```

那么，我们如何触发组件的事件呢？

需要触发组件的事件，那么就要在对应的组件中进行编写了，所以我们来到Student组件中

添加一个触发组件事件的按钮

```vue
<button @click="sendStudentName">把学校名称给父组件</button>
```

添加触发组件事件的方法

```js
 methods: {
    sendStudentName() {
      // this.$emit('被触发的事件名称');
      this.$emit("nb");
    },
  },
```

测试一下，没啥毛病，触发成功了

组件事件也可以接收参数

```js
methods: {
    sendStudentName() {
      // this.$emit('被触发的事件名称');
      this.$emit("nb学生名称:", this.name);
    },
  },
```

这里改动后，在App中也需要修改对应的参数

```vue
<Student v-on:nb="getStudentlName" />
```

```js
getStudentlName(value) {
      console.log("学生名称:" + value);
    },
```

测试一下，没啥毛病

还有另一种更方便的方法

在App中修改对应内容

```vue
<!-- 通过ref获取Student组件实例对象 -->
    <Student ref="student" />
```

通过ref可以获取到Student组件实例对象，通过实例对象中的$on取代了之前对应的v-on方法，在触发nb事件名称后，参数传递给了回调函数并接收触发回调函数中的内容

```vue
mounted() {
    // 通过on取代了<Student v-on:nb="getStudentlName" />中的v-on的方法
    //this.$refs.student.$on("事件名称", 触发事件名称后的回调函数);
    this.$refs.student.$on("nb", this.getStudentlName);
  },
```

参数可以接收很多，可以通过形参列表中的一种方式：方法名(需要接收的参数y，...x)

这里的x会将数据收集为一个数组

如果想为自定义事件添加一些效果，例如方法只生效一次这种

可以通过一些特定方法使用

```vue
mounted() {
    // 通过on取代了<Student v-on:nb="getStudentlName" />中的v-on的方法
    //this.$refs.student.$on("事件名称", 触发事件名称后的回调函数);
    this.$refs.student.$once("nb", this.getStudentlName);
  },
```

或者在组件上

```vue
 <Student v-on:nb.once="getStudentlName" />
```

## 组件自定义事件-解绑

### 解绑单个自定义事件

为Student组件添加一个按钮作为事件的解绑

```vue
<button @click="unbind">解绑事件</button>
```

添加对应方法

```js
unbind() {
      // 只适用于解绑一个事件
      this.$off("nb");
    },
```

### 解绑多个自定义事件

为Student组件添加一些自定义事件，用于后面解绑多个进行使用

App.vue

```vue
<Student v-on:nb="getStudentlName" @demo="demo1" />
```

```js
demo1() {
      console.log("demo1被调用了");
    },
```

Student.vue

```js
sendStudentName() {
      // this.$emit('被触发的事件名称');
      this.$emit("nb", this.name);
      this.$emit("demo");
    },
```

```js
 unbind() {
      //   this.$off("nb");	解绑单个
      this.$off(["nb", "demo"]); // 解绑多个
    },
```

### 解绑所有自定义事件

```js
unbind() {
      //   this.$off("nb");	解绑单个
      //   this.$off(["nb", "demo"]); // 解绑多个
      this.$off(); // 解绑所有自定义事件
    },
```

## 组件自定义事件总结

1. 一种组件间通信的方式，适用于：子组件 ===> 父组件

2. 使用场景：A是父组件，B是子组件，B想给A传数据，那么就要在A中给B绑定自定义事件(事件的回调在A中)

3. 绑定自定义事件：

	1. 第一种方式，在父组件中：`<Demo @show="showTest"/>`或`<Demo v-on:show="showTest"/>`

	2. 第二种方式，在父组件中：

		```js
		<Demo ref="demo"/>
		mounted(){
			this.$refs.demo.$on('show',this.showTest)
		}
		```

	3. 若想让自定义事件只触发一次，可以使用`once`修饰符或`$once`方法

4. 触发自定义事件：`this.$emit('show',需要传递的数据(不限个数))`

5. 解绑自定义事件：`this.$off('show')`

6. 组件上也可以绑定原生DOM事件，需要使用`native`修饰符，修饰为原生事件

7. 注意：通过`this.$refs.xxx.$on('show',回调)`绑定自定义事件时，**回调要么配置在methods中，要么用箭头函数，否则this的指向会出现问题！**

如果我们想为App组件在页面上显示一个学生姓名，该怎么做？

可以通过方法得到学生组件中的姓名，然后赋值到data属性上，通过插值语法显示到页面上即可

App.vue

```vue
<script>
import Student from "./components/Student";
import School from "./components/School";

export default {
  name: "App",
  components: { School, Student },
  data() {
    return {
      msg: "你好啊！",
      studentName: "",
    };
  },
  methods: {
    getSchoolName(SchoolName) {
      console.log(SchoolName);
    },
    getStudentlName(value) {
      console.log("学生名称:" + value);
      this.studentName = value;
    },
    demo1() {
      console.log("demo1被调用了");
    },
  },
  mounted() {
    // 通过on取代了<Student v-on:nb="getStudentlName" />中的v-on的方法
    //this.$refs.student.$on("事件名称", 触发事件名称后的回调函数);
    // this.$refs.student.$once("nb", this.getStudentlName);
  },
};
</script>
```

这里有一个坑，当我们换种方式进行编写就会踩坑了

```vue
 <Student ref="student" />
```

```js
mounted() {
    // 通过on取代了<Student v-on:nb="getStudentlName" />中的v-on的方法
    // this.$refs.student.$on("事件名称", 触发事件名称后的回调函数);
    this.$refs.student.$on("nb", this.getStudentlName);
  },
```

$on这里有一个回调函数，当自定义事件被触发后会执行对应的回调函数，如果我们将这里的回调函数改成一个函数直接来使用呢？

先注释掉原先的那段回调函数，将mounted中的$on改为如下代码

```js
this.$refs.student.$on("nb", function (value) {
      console.log("学生名称:" + value);
      console.log(this);
      this.studentName = value;
    });
```

![image-20231001144524263](https://s2.loli.net/2023/10/01/DhnNaBTtfo5MwOc.png)

这里的vc是Student的vc？

原因是底层设计，当谁触发了这个nb事件，那么这里的this就是谁，此时触发该事件的是Student组件，所以这里的this是Student

想解决这个问题，将普通函数改为箭头函数就可以了，因为箭头函数没有自己的this，往外找就是App了

```js
this.$refs.student.$on("nb", (value) => {
      console.log("学生名称:" + value);
      console.log(this);
      this.studentName = value;
    });
```

### 组件使用原生事件

之前说组件可以使用自定义事件，那组件是否可以使用其他的原生事件等等呢

```vue
<!-- 通过native可以使用原生的事件 -->
    <Student ref="student" @click.native="show" />
```

```js
 show() {
      alert("666");
    },
```

## TodoList自定义事件

修改App.vue

```vue
<!-- 头部组件 -->
        <TodoHeader @addTodo="addTodo"></TodoHeader>
```

修改Header

```vue
<script>
import { nanoid } from "nanoid";
export default {
  name: "TodoHeader",

  data() {
    return {};
  },

  mounted() {},

  methods: {
    add(e) {
      // 校验数据
      if (e.target.value.trim() == "") return alert("输入不能为空");
      // 造对象
      const todoObj = {
        id: nanoid(),
        title: e.target.value,
        done: false,
      };
      // 添加对象
      this.$emit("addTodo", todoObj);
      // 输入完成后，就输入框中的内容置为空
      e.target.value = "";
    },
  },
};
</script>
```

修改App.vue

```vue
<!-- 底部组件 -->
        <TodoFooter
          :todos="todos"
          @allOrNoAll="allOrNoAll"
          @clearAllTodo="clearAllTodo"
        ></TodoFooter>
```

接着修改Footer

```vue
<script>
export default {
  name: "TodoFooter",
  computed: {
    isAll: {
      get() {
        return this.totalCount === this.doneCount && this.totalCount > 0;
      },
      set(value) {
        this.$emit("allOrNoAll", value);
      },
    },
    totalCount() {
      return this.todos.length;
    },
    doneCount() {
      // reduce第一个参数是一个函数，函数中第一个参数是上一次的值，第二个参数是当前值
      // reduce的遍历次数由数组长度决定，而current由当前值决定，当数组到下一次时，pre会是上一次的current
      // 而current这次会是上一次的返回值
      return this.todos.reduce(
        (pre, current) => pre + (current.done ? 1 : 0),
        0
      );
    },
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    // checkAll(e) {
    //   this.allOrNoAll(e.target.checked);
    // },
    clearAll() {
      // this.clearAllTodo();
      this.$emit("clearAllTodo");
    },
  },
  props: ["todos"],
};
</script>
```

## 全局事件总线

任意组件间通信（开发常用）

1. 一种组件间通信的方式，适用于**任意组件间通信**

2. 安装全局事件总线(main.js)：

	- ```js
		//创建vm
		new Vue({
			el:'#app',
			render: h => h(App),
			beforeCreate(){
				Vue.prototype.$bus = this	// 安装全局事件总线，$bus就是当前应用的vm
			}
		})
		```

3. 使用事件总线

	1. 接收数据：A组件想接收数据，则在A组件中给$bus绑定自定义事件，事件的回调停留在A组件自身

		```js
		mounted() {
		    // 为$bus总线添加被触发的hello方法，可以传递一个数据
		    this.$bus.$on("hello", (data) => {
		      console.log(data);
		    });
		  },
		```

	2. 提供数据：`this.$bus.$emit('xxx方法',数据)`

		```js
		methods: {
		    testClick() {
		      this.$bus.$emit("hello", this.name);
		    },
		  },
		```

4. 最好在beforeDestory钩子中，用`$off`去解绑当前组件所用到的事件

### 原理图

大概是这样的一个流程，说有4个组件在App中，而X是用来绑定事件的一个组件，如果D想给A传递数据，那么A就在X组件上创建一个自定义事件，这个事件会要求携带一个参数，这个参数就是D给A传递的参数，而回调的函数会在A中体现，D需要调用X身上的A创建的自定义事件来进行数据的传递，假设A组件的自定义方法名称是demo，那么D组件就需要通过demo(666)的形式，将数据666传递给A，这样A接收到数据后，就可以进行处理，其他的组件通信也是类似的

![image-20231001202446830](https://s2.loli.net/2023/10/05/ymdHf8UvebSg3Ta.png)

修改一下对应的数据

School.vue

```vue
<template>
  <div class="school">
    <h2>学校名称：{{ name }}</h2>
    <h2>学校地址：{{ address }}</h2>
  </div>
</template>

<script>
export default {
  name: "School",
  data() {
    return {
      name: "NB",
      address: "北京",
    };
  },
};
</script>

<style scoped>
.school {
  background-color: skyblue;
  padding: 5px;
}
</style>
```

Student.vue

```vue
<template>
  <div class="student">
    <h2>学生姓名：{{ name }}</h2>
    <h2>学生性别：{{ sex }}</h2>
  </div>
</template>

<script>
export default {
  name: "Student",
  data() {
    return {
      name: "张三",
      sex: "男",
    };
  },
};
</script>

<style  scoped>
.student {
  background-color: pink;
  padding: 5px;
  margin-top: 30px;
}
</style>
```

App.vue

```vue
<template>
  <div class="app">
    <h1>{{ msg }}</h1>
    <School />
    <Student />
  </div>
</template>

<script>
import Student from "./components/Student";
import School from "./components/School";

export default {
  name: "App",
  components: { School, Student },
  data() {
    return {
      msg: "你好啊！",
    };
  },
};
</script>

<style scoped>
.app {
  background-color: gray;
  padding: 5px;
}
</style>
```

我们需要让原理图中的X能被所有组件识别到，那么我们需要在Vue身上放一个实验数据来进行测试

在main.js中

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false

// 添加全局测试数据
Vue.prototype.x = {a:1,b:2}

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
})
```

然后在组件中进行查看

可以得到对应的数据

```vue
mounted() {
    console.log(this.x);
  },
```

但是这样放置的数据无法被识别，所以需要换一种方式

通过VC这个实例对象将数据传递过去

在main.js中进行添加

```js
// 创建组件实例对象
const Demo = Vue.extend({})
const d = new Demo()
// 后面可以通过vc从vue中查询到数据
Vue.prototype.x = d
```

当然，这不是最优选，可以通过vm来创建对应实例对象

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false
Vue.prototype.x = {a:1,b:2}


//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	beforeCreate(){
		Vue.prototype.$bus = this	// 安装全局事件总线
	}
})
```

School.vue

```js
 mounted() {
    // 为$bus总线添加被触发的hello方法，可以传递一个数据
    this.$bus.$on("hello", (data) => {
      console.log(data);
    });
  },
```

Student.vue

```vue
<button @click="testClick"></button>
```

```js
methods: {
    testClick() {
      this.$bus.$emit("hello", this.name);
    },
  },
```

在一些不使用的组件被销毁后，总线上的一些方法可以进行销毁，可以在组件的生命周期上进行销毁，使用beforeDestory里调用this.总线名.$off("对应的方法名")

## TodoList全局事件总线

让Item与App进行互传

先安装全局事件总线

main.js

```js
new Vue({
  // 下面这行代码后面解释,完成了将App组件放入容器中
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')
```

先将无意义的数据传递删除

App.vue

```vue
<!-- 列表组件 -->
        <TodoList :todos="todos"></TodoList>
```

绑定对应的方法

```js
mounted() {
    // 当有人使用对应的自定义事件时，会触发对应的回调函数
    this.$bus.$on("checkAtItem", this.checkAtItem);
    this.$bus.$on("deleAtItem", this.deleAtItem);
  },
beforeDestroy() {
    this.$bus.$off(["checkAtItem", "deleAtItem"]);
  },
```

List

```vue
<!-- 利用props传递对象属性给子组件 -->
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo"></TodoItem>
```

```vue
props: ["todos"],
```

Item

```vue
// 添加props传入的对象
  props: ["todo"],
```

```js
methods: {
    handleClick(todoId) {
      this.$bus.$emit("checkAtItem", todoId);
    },
    handleDelete(todoId) {
      this.$bus.$emit("deleAtItem", todoId);
    },
  },
```

## 消息订阅与发布_pubsub

1. 一种组件间通信的方式，适用于任意组件间通信

2. 使用步骤

	1. 安装pubsub：`npm i  pubsub-js`

	2. 引入：`import pubsub from 'pubsub-js'`

	3. 接收数据：A组件想接收数据，则在A组件中订阅消息，订阅的回调留在A组件自身

		```js
		methods(){
			demo(msgName,data){.......}		// A 组件的回调
		}
		mounted(){
			this.pid = pubsub.subscribe('xxx',this.demo)	// 订阅消息
		}
		```

	4. 提供数据：`pubsub.publish('xxx',数据)`

	5. 最好在beforeDestory钩子中，用`PubSub.unsubscribe(pid)`去<span style="color:red">取消订阅</span>

消息订阅与发布

1. 订阅消息：消息名
2. 发布消息：消息内容

### 原理图

原理图说明：

当A中订阅了一个demo，回调函数为test时，如果C发布demo的消息，并传递一个666的数据，此时test可以进行接收，接收到的数据会传递到test当中，实现功能

<img src="https://s2.loli.net/2023/10/02/DtgxPmYGuC35TLp.png" alt="image-20231002090655357" style="zoom:50%;" />

相应的初始代码

main.js

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false
Vue.prototype.x = {a:1,b:2}


//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	beforeCreate(){
		Vue.prototype.$bus = this
	}
})
```

Student.vue

```vue
<script>
export default {
  name: "Student",
  data() {
    return {
      name: "张三",
      sex: "男",
    };
  },
  methods: {
    testClick() {
      // this.$bus.$emit("hello", this.name);
    },
  },
};
</script>
```

School.vue

```vue
<script>
export default {
  name: "School",
  data() {
    return {
      name: "NB",
      address: "北京",
    };
  },
  mounted() {
    // 为$bus总线添加被触发的hello方法，可以传递一个数据
    // this.$bus.$on("hello", (data) => {
    //   console.log(data);
    // });
  },
};
</script>
```

其他的代码是之前全局事件总线的代码不变

安装对应的库，因为原生js实现很麻烦

```shell
npm i pubsub-js
```

School.vue

谁接收数据，那么就是谁订阅消息

```vue
<script>
import pubsub from "pubsub-js";
export default {
  name: "School",
  data() {
    return {
      name: "NB",
      address: "北京",
    };
  },
  mounted() {
    // 为$bus总线添加被触发的hello方法，可以传递一个数据
    // this.$bus.$on("hello", (data) => {
    //   console.log(data);
    // });

    // pub 订阅消息
    // subscribe(订阅的消息名称,订阅的消息名称被调用时的回调函数)
    pubsub.subscribe("hello", function () {
      console.log("hello消息被订阅了,回调执行");
    });
  },
};
</script>
```

Student.vue

谁发送数据那么，就是谁发布消息

```vue
<script>
import pubsub from "pubsub-js";
export default {
  name: "Student",
  data() {
    return {
      name: "张三",
      sex: "男",
    };
  },
  methods: {
    testClick() {
      // this.$bus.$emit("hello", this.name);

      // 消息发布
      pubsub.publish("hello", 666);
    },
  },
};
</script>
```

接收数据的方式有一点小小的不同，在Student处，传递了666的数据，那么在School中需要进行接收

函数的第一个参数是消息名称，第二个参数是数据

```js
 mounted() {
    // 为$bus总线添加被触发的hello方法，可以传递一个数据
    // this.$bus.$on("hello", (data) => {
    //   console.log(data);
    // });

    // pub 订阅消息
    // subscribe(订阅的消息名称,订阅的消息名称被调用时的回调函数)
    pubsub.subscribe("hello", function (msgName, data) {
      console.log("hello消息被订阅了,回调执行", msgName, data);
    });
  },
```

消息能被订阅，那也需要能解绑订阅

这里的解绑类似定时器，需要赋值才能解绑

```js
mounted() {
    // 为$bus总线添加被触发的hello方法，可以传递一个数据
    // this.$bus.$on("hello", (data) => {
    //   console.log(data);
    // });

    // pub 订阅消息
    // subscribe(订阅的消息名称,订阅的消息名称被调用时的回调函数)
    this.pubId = pubsub.subscribe("hello", function (msgName, data) {
      console.log("hello消息被订阅了,回调执行", msgName, data);
    });
  },
  beforeDestroy() {
    pubsub.unsubscribe("hello");
  },
```

如果直接通过默认函数作为回调函数，上层就不是VC了，可以通过箭头函数或在methods中的普通函数进行编写

## TodoList消息订阅

简单分析一下，哪个组件需要数据，哪个组件提供数据

App组件是需要数据的，需要传入的对应的id，而Item组件是提供数据的，提供对应的id

订阅消息的都是需要数据的，而发布消息的是提供数据的

App.vue

```js
import pubsub from "pubsub-js";
```

因为普通函数的调用中，pubsub的第一个参数是msgName，也就是消息名，一般用不到，但是需要占位

```js
 // 勾选
    checkAtItem(_, id) {
      let todos = this.todos;
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].id == id) {
          todos[i].done = !todos[i].done;
        }
      }
    },
    // 删除
    deleAtItem(_, id) {
      if (confirm("确定删除吗?")) {
        // 将数据赋值给原数组
        this.todos = this.todos.filter((todo) => {
          // 当被删除的id不为数组中的id,就返回数据
          return todo.id !== id;
        });
      }
    },
```

```js
mounted() {
    // 当有人使用对应的自定义事件时，会触发对应的回调函数
    // this.$bus.$on("checkAtItem", this.checkAtItem);
    // this.$bus.$on("deleAtItem", this.deleAtItem);
    pubsub.subscribe("checkAtItem", this.checkAtItem);
    pubsub.subscribe("deleAtItem", this.deleAtItem);
  },
beforeDestroy() {
    // this.$bus.$off(["checkAtItem", "deleAtItem"]);
    pubsub.unsubscribe([this.pubId, this.deleteId]);
  },
```

Item.vue

```js
import pubsub from "pubsub-js";
```

```js
methods: {
    handleClick(todoId) {
      pubsub.publish("checkAtItem", todoId);
      // this.$bus.$emit("checkAtItem", todoId);
    },
    handleDelete(todoId) {
      pubsub.publish("deleAtItem", todoId);
    },
  },
```

## TodoList编辑

Item添加编辑按钮

```vue
<template>
  <div>
    <li>
      <label>
        <!-- 根据对象中的done属性决定是否可选 -->
        <input
          type="checkbox"
          :checked="todo.done"
          @change="handleClick(todo.id)"
        />
        <!-- 通过props添加标题 -->
        <span>{{ todo.title }}</span>
      </label>

      <button class="btn btn-danger" @click="handleDelete(todo.id)">
        删除
      </button>
      <button class="btn btn-edit">编辑</button>
    </li>
  </div>
</template>
```

这里的编辑样式`btn btn-edit`需要进行修改

在App.vue中添加对应样式

```css
.btn-edit {
  color: #fff;
  background-color: skyblue;
  border: 1px solid rgb(103, 159, 180);
  margin-right: 5px;
}
```

分析一下，在点击编辑后，对应的title应该变为应该输入框，可以输入内容进行修改，修改完成后，可以点击完成按钮进行保存

Item

为按钮绑定点击事件

```vue
<button class="btn btn-edit" @click="handleEdit(todo)">编辑</button>
```

添加对应方法

```js
 handleEdit(todo) {
      todo.isEdit = true;
    },
```

并且修改对应的样式结构

```vue
<template>
  <div>
    <li>
      <label>
        <!-- 根据对象中的done属性决定是否可选 -->
        <input
          type="checkbox"
          :checked="todo.done"
          @change="handleClick(todo.id)"
        />
        <!-- 通过props添加标题 -->
        <span v-show="!todo.isEdit">{{ todo.title }}</span>
        <input v-show="todo.isEdit" :value="todo.title" />
      </label>

      <button class="btn btn-danger" @click="handleDelete(todo.id)">
        删除
      </button>
      <button class="btn btn-edit" @click="handleEdit(todo)">编辑</button>
    </li>
  </div>
</template>
```

此时运行一下看看效果，会发现没效果，在控制台打印一下看看

我们发现数据确实是加进去了，但是没有对应的get和set的方法，没有get和set就不会引起vue的注意，也就是说，它不是响应式的

![image-20231002103504433](https://s2.loli.net/2023/10/02/2k7QxDfnjdAHXuS.png)

所以我们需要借助一个方法，$set

Item

```js
handleEdit(todo) {
      // 为todo追加一个属性名为isEdit的属性，值为true
      this.$set(todo, "isEdit", true);
    },
```

为输入框绑定失去焦点事件

```vue
<input v-show="todo.isEdit" :value="todo.title" @blur="handleBlue(todo)" />
```

当失去焦点后，对应的数据就自动的保存了

```js
handleBlue(todo) {
      todo.isEdit = false;
    },
```

但是这样写不是很完美，因为当我们第一次点击编辑按钮时，会追加一个isEdit，当第二次又点击编辑按钮时，就不需要进行追加了，浪费资源

所以修改对应的handleEdit

```js
handleEdit(todo) {
      if (todo.hasOwnProperty("isEdit")) {
        // 如果todo身上存在isEdit，那就让它为true
        console.log("isEdit存在");
        todo.isEdit = true;
      }
      // 为todo追加一个属性名为isEdit的属性，值为true
      else this.$set(todo, "isEdit", true);
    },
```

真正执行修改逻辑是在失去焦点回调的时候

```js
handleBlue(todo, e) {
      todo.isEdit = false;
      // 触发对应事件
      this.$bus.$emit("updateTodo", todo.id, e.target.value);
    },
```

逻辑能执行了，我们就需要进行绑定

在App.vue中的mounted中绑定

```js
this.$bus.$on("updateTodo", this.updateTodo);
```

然后在App中的beforeDestory中进行销毁`this.$bus.$off();`

```js
updateTodo(id, title) {
      this.todos.forEach((todo) => {
        if (todo.id === id) todo.title = title;
      });
    },
```

但是一般点击编辑后，编辑按钮应该会消失，所以在Item中进行添加

```vue
<button
        class="btn btn-edit"
        @click="handleEdit(todo)"
        v-show="!todo.isEdit"
      >
        编辑
      </button>
```

这里输入是可以为空的，所以我们需要进行修改，让其输入不能为空

在Item中

```js
handleBlue(todo, e) {
      if (e.target.value.trim() === "") return alert("输入不能为空");
      todo.isEdit = false;
      // 触发对应事件
      this.$bus.$emit("updateTodo", todo.id, e.target.value);
    },
```

## $nextTick

1. 语法：`this.$nextTick(回调函数)`
2. 作用：在下一次DOM更新结束后执行`其指定的回调`
3. 什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行

之前写TodoList的时候，点击编辑按钮后，还需要点一下输入框才能获取焦点，很麻烦，整个办法自动获取焦点

获取焦点的话，我们需要拿到输入框

Item

```vue
<input
          v-show="todo.isEdit"
          :value="todo.title"
          @blur="handleBlue(todo, $event)"
          ref="inputTitle"
        />
```

```js
handleEdit(todo) {
      if (todo.hasOwnProperty("isEdit")) {
        // 如果todo身上存在isEdit，那就让它为true
        console.log("isEdit存在");
        todo.isEdit = true;
      }
      // 为todo追加一个属性名为isEdit的属性，值为true
      else {
        this.$set(todo, "isEdit", true);
        console.log("isEdit不存在");
      }
      this.$refs.inputTitle.focus();
    },
```

运行测试一下，发现没有效果，原因是vue是等你整个方法结束后再对你做模版解析，而你在方法运行中就想获取焦点，这时候input框还没有出来，所以没效果，我们可以通过添加一个定时器，当方法结束后，再获取焦点，但这样解决不太好，vue对于这个情况也有解决方案

```js
handleEdit(todo) {
      if (todo.hasOwnProperty("isEdit")) {
        // 如果todo身上存在isEdit，那就让它为true
        console.log("isEdit存在");
        todo.isEdit = true;
      }
      // 为todo追加一个属性名为isEdit的属性，值为true
      else {
        this.$set(todo, "isEdit", true);
        console.log("isEdit不存在");
      }
      // nextTick会在DOM结点更新之后使用回调函数
      this.$nextTick(function () {
        this.$refs.inputTitle.focus();
      });
    },
```

通过$nextTick方法，在DOM元素更新后再获取焦点

## 过度与动画

### 动画效果

创建几个基础的文件

App.vue

```vue
<template>
  <div class="app">
    <Test />
  </div>
</template>

<script>
import Test from "./components/Test.vue";
export default {
  components: { Test },
  name: "App",
};
</script>

<style scoped>
</style>

```

main.js

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false



//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
})
```

在components中新建Test.vue

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示|隐藏</button>
    <h1 v-show="isShow">你好啊！</h1>
  </div>
</template>

<script>
export default {
  name: "Test",

  data() {
    return {
      isShow: true,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
h1 {
  background-color: orange;
}
</style>
```

为其添加动画

```css
<style scoped>
h1 {
  background-color: orange;
}

.come {
  animation: eastwind 1s;
}

.go {
  animation: eastwind 1s reverse;
}

@keyframes eastwind {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0px);
  }
}
</style>
```

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示|隐藏</button>
    <h1 v-show="isShow" class="come">你好啊！</h1>
  </div>
</template>
```

这样是由自己来进行动画的添加

如何通过vue来添加动画呢

```vue
<transition>
      <h1 v-show="isShow">你好啊！</h1>
    </transition>
```

包裹了transition标签后，vue就可以添加上对应效果的动画了

而样式的名称此时就不能乱写了，有vue自己管理的一套流程

v-enter-active：进入时激活的样式

v-leave-active：离开时激活的样式

```css
.v-enter-active {
  animation: eastwind 1s;
}

.v-leave-active {
  animation: eastwind 1s reverse;
}
```

还可以为transition添加名称name

```vue
<transition name="hello">
      <h1 v-show="isShow">你好啊！</h1>
    </transition>
```

如果你为transition起了名称

则css中的样式名称也需要变化

之前的v-就需要变成hello-

```css
.hello-enter-active {
  animation: eastwind 1s;
}

.hello-leave-active {
  animation: eastwind 1s reverse;
}
```

如果你想让动画一开始就播放的话，需要添加一个属性`appear`

```vue
<transition name="hello" :appear="true">
      <h1 v-show="isShow">你好啊！</h1>
    </transition>
```

也可以这样写

```vue
<transition name="hello" appear>
      <h1 v-show="isShow">你好啊！</h1>
    </transition>
```

### 过渡效果

使用过渡编写之前的动画效果

App.vue

```vue
<template>
  <div class="app">
    <Test />
    <Test2 />
  </div>
</template>

<script>
import Test from "./components/Test.vue";
import Test2 from "./components/Test2.vue";

export default {
  components: { Test, Test2 },
  name: "App",
};
</script>

<style scoped>
</style>
```

Test2

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示|隐藏</button>
    <transition name="hello" :appear="true">
      <h1 v-show="isShow">你好啊！</h1>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Test",

  data() {
    return {
      isShow: true,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
h1 {
  background-color: orange;
  transition: 0.5s linear;
}

/* 进入的起点 */
.hello-enter {
  transform: translateX(-100%);
}
/* 进入的终点 */
.hello-enter-to {
  transform: translateX(0);
}
/* 离开的起点 */
.hello-leave {
  transform: translateX(0);
}
/* 离开的终点 */
.hello-leave-to {
  transform: translateX(-100%);
}
</style>
```

但这样的样式看起来很麻烦，可以进行优化，把相同的样式放一起

```css
<style scoped>
h1 {
  background-color: orange;
  transition: 0.5s linear;
}

/* 进入的起点 离开的终点 */
.hello-enter,
.hello-leave-to {
  transform: translateX(-100%);
}
/* 进入的终点 离开的起点 */
.hello-enter-to,
.hello-leave {
  transform: translateX(0);
}
</style>
```

 `transition: 0.5s linear;`这句话加在代码上可能会破坏别人代码的结构，所以单独取一个样式出来给它

```css
<style scoped>
h1 {
  background-color: orange;
}

/* 进入的起点 离开的终点 */
.hello-enter,
.hello-leave-to {
  transform: translateX(-100%);
}
/* 进入的终点 离开的起点 */
.hello-enter-to,
.hello-leave {
  transform: translateX(0);
}
.hello-enter-active,
.hello-leave-active {
  transition: 0.5s linear;
}
</style>
```

### 多个元素过渡

如果有多个元素需要使用过渡有相同的效果，可以通过`transition-group`标签，并在每个元素中添加唯一的key

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示|隐藏</button>
    <transition-group name="hello" :appear="true">
      <h1 v-show="isShow" :key="1">你好啊！</h1>
      <h1 v-show="isShow" :key="2">你好啊！！</h1>
    </transition-group>
  </div>
</template>
```

### 集成第三方动画

新建一个Test3组件，并在App中引入

这里采用的是第三方的动画，所以需要安装对应的库

```shell
npm install animate.css
```

引入对应的样式

```js
import "animate.css";
```

配置相应的名称

```vue
<template>
  <div>
    <button @click="isShow = !isShow">显示|隐藏</button>
    <transition-group
      :appear="true"
      name="animate__animated animate__bounce"
      enter-active-class="animate__swing"
      leave-active-class="animate__backOutUp"
    >
      <h1 v-show="isShow" :key="1">你好啊！</h1>
      <h1 v-show="isShow" :key="2">你好啊！！</h1>
    </transition-group>
  </div>
</template>
```

显示不出来说明版本的问题，改变一下动画的版本即可

### 总结

1. 作用：在插入、更新或移除DOM元素时，在合适的时候给元素添加样式类名

2. 图示

	![image-20231002161325847](https://s2.loli.net/2023/10/05/m1uCcfEGpYivAlW.png)

3. 写法

	1. 准备好样式：

		- 元素进入的样式：
			1. v-enter：进入的起点
			2. v-enter-active：进入过程中
			3. v-enter-to：进入的终点
		- 元素离开的样式：
			1. v-leave：离开的起点
			2. v-leave-active：离开过程中
			3. v-leave-to：离开的重点

	2. 使用`<transition>`包裹要过度的元素，并配置name属性：

		```vue
		<transition name="hello" :appear="true">
		      <h1 v-show="isShow">你好啊！</h1>
		    </transition>
		```

	3. 备注：若有多个元素需要过度，则需要使用`<transition-group>`,且每个元素都要指定`key`值

# Vue中的Ajax

## 配置代理一(跨域)

先将资料中的两个node服务器启动，启动方式为

```shell
node 文件名
```

启动完成后，从之前的脚手架中复制一份，组件只留App

```vue
<template>
  <div class="app"></div>
</template>

<script>
export default {
  name: "App",
};
</script>
```

接着需要安装axios，这是一个发ajax请求的包

```shell
npm i axios
```

安装完成后导入axios，并编写axios请求发送的代码

```vue
<script>
import axios from "axios";
export default {
  name: "App",
  methods: {
    getStudent() {
      axios.get("http://localhost:5000/students").then(
        (response) => {
          // 成功后,会接收到response
          // response中的data是数据
          console.log(response.data);
        },
        (error) => {
          // 失败后,会接收到error
          // error中的message是错误原因
          console.log(error.message);
        }
      );
    },
  },
};
</script>
```

运行后，报错了

![image-20231002194214969](https://s2.loli.net/2023/10/02/yuGNmlKhiVBTqnM.png)

这个问题是说明你出现了跨域的问题，违背了同源策略

同源策略是说：协议名、主机名、端口号需要一致

由于我们的请求是：`http://localhost:8080`，而后台数据的是`http://localhost:5000`，前两个都能对上，但是端口号不一致，所以导致跨域问题出现了

要解决这种方法，有cors、jsonp、代理服务器等方式，cors是由后端来做，jsonp需要前后端配置，这里只能依靠代理服务器来实现，那么，什么是代理服务器呢？

前端需要数据，向代理服务器要数据，代理服务器向后端服务器要数据，服务器之间没有跨域，要到再发给前端，就解决了跨域问题

![image-20231002195810802](https://s2.loli.net/2023/10/02/bkEwm6S4JynDNdH.png)

如何开启代理服务器？

一种是nginx，另一种是通过vue cli，这里选择vue cli开启

在vue.config.js中进行配置

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    // 这里的proxy是你配置的代理服务器地址
    proxy:'http://localhost:5000'
  }
})
```

接着需要修改App中的地址为代理服务器

代理服务器的地址为localhost:8080，而所代理的地址已经在vue.config.js中进行配置过了，所以我们直接找代理服务器要数据

```vue
<script>
import axios from "axios";
export default {
  name: "App",
  methods: {
    getStudent() {
      axios.get("http://localhost:8080/students").then(
        (response) => {
          // 成功后,会接收到response
          // response中的data是数据
          console.log(response.data);
        },
        (error) => {
          // 失败后,会接收到error
          // error中的message是错误原因
          console.log(error.message);
        }
      );
    },
  },
};
</script>
```

运行测试一下，数据就收到了

但是这样会有一个问题，当发送的地址名称与本地冲突了，就不会发送给服务器了

例如`http://localhost:8080/students`，如果本地上有students这个文件，那么当发送地址为`http://localhost:8080/students`，就会发送到本地上了

而且这个还有一个弊端

```js
devServer:{
    // 这里的proxy是你配置的代理服务器地址
    proxy:'http://localhost:5000'
  }
```

这里配置的是5000的端口，就不能进行其他地址的配置了，如果还有5001，5002，就都无法进行配置了，局限性很大



## 配置代理二(跨域)

第二种方式依然是在vue.config.js中进行配置

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  // 开启代理服务器(方式一)
  // devServer:{
  //   // 这里的proxy是你配置的代理服务器地址
  //   proxy:'http://localhost:5000'
  // }

  // 开启代理服务器(方式二)
  devServer:{
    proxy:{
      // 如果前缀是eastwind,就使用5000代理服务器
      'eastwind':{
        target:'http://localhost:5000'
      }
    }
  }
})
```

因为需要添加一个前缀，所以我们需要修改App.vue中请求的前缀

这个前缀是紧跟在端口号的后面

```vue
<script>
import axios from "axios";
export default {
  name: "App",
  methods: {
    getStudent() {
      axios.get("http://localhost:8080/eastwind/students").then(
        (response) => {
          // 成功后,会接收到response
          // response中的data是数据
          console.log(response.data);
        },
        (error) => {
          // 失败后,会接收到error
          // error中的message是错误原因
          console.log(error.message);
        }
      );
    },
  },
};
</script>
```

此时又报错了，说是404，查看服务器，发现服务器已经被访问到了，这又是什么情况呢？

这是因为请求的地址为`http://localhost:8080/eastwind/students`

转发过去之后就成了`http://localhost:5000/eastwind/students`

所以就找不到了

解决方法：

```js
// 开启代理服务器(方式二)
  devServer:{
    proxy:{
      // 如果前缀是eastwind,就使用5000代理服务器
      'eastwind':{
        target:'http://localhost:5000',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind':""}
      }
    }
  }
```

此时再次运行，就拿到数据了

在这里还有两个配置项可以选择是否开启

```js
// 开启代理服务器(方式二)
  devServer:{
    proxy:{
      // 如果前缀是eastwind,就使用5000代理服务器
      'eastwind':{
        target:'http://localhost:5000',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      }
    }
  }
```

### 配置多个代理

```js
// 开启代理服务器(方式二)
  devServer:{
    proxy:{
      // 如果前缀是eastwind,就使用5000代理服务器
      'eastwind':{
        target:'http://localhost:5000',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
      'eastwind2':{
        target:'http://localhost:5001',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind2':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
       'eastwind3':{
        target:'http://localhost:5002',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind3':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
    }
  }
```

## 配置代理总结

方法一

在vue.config.js中添加如下配置：

```js
devServer:{
	proxy:'http://localhost:5000'
}
```

说明：

1. 优点：配置简单，请求资源时直接发给前端(8080)即可
2. 缺点：不能配置多个代理，不能灵活的控制请求是否走代理
3. 工作方式：若按照上述配置代理，当请求了前端不存在的资源时，那么该请求会转发给服务器(优先匹配前端资源)



方法二

```js
devServer:{
    proxy:{
      // 如果前缀是eastwind,就使用5000代理服务器
      'eastwind':{
        target:'http://localhost:5000',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
      'eastwind2':{
        target:'http://localhost:5001',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind2':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
       'eastwind3':{
        target:'http://localhost:5002',
        // 匹配所有以eastwind开头的字符串，将它们变成空字符串
        pathRewrite:{'^/eastwind3':""},
        ws:true,  // 用于支持websocket
        // 如果目标服务器的端口是5000,开启后,代理服务器的端口也是5000,会模仿对方的地址
        changeOrigin:true   // 用于控制请求头中的host值
      },
    }
  }

/*
	changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
	changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8000
	changeOrigin默认值为true
*/
```

说明：

1. 优点：可以配置多个代理，且可以灵活的控制请求是否走代理
2. 缺点：配置略微繁琐，请求资源时必须加前缀

## github案例

做一个关于代理的案例

效果如下

![image-20231003075543891](https://s2.loli.net/2023/10/05/lFEmau87HGyJsvL.png)

分析这张图片后，这里选择创建两个组件，一个是Search，另一个是List

引入对应的样式和界面

App.vue

```vue
<template>
  <div id="app">
    <div class="container">
      <section class="jumbotron">
        <h3 class="jumbotron-heading">Search Github Users</h3>
        <div>
          <input
            type="text"
            placeholder="enter the name you search"
          />&nbsp;<button>Search</button>
        </div>
      </section>
      <div class="row">
        <div class="card">
          <a href="https://github.com/xxxxxx" target="_blank">
            <img
              src="https://cn.vuejs.org/images/logo.svg"
              style="width: 100px"
            />
          </a>
          <p class="card-text">xxxxxx</p>
        </div>
        <div class="card">
          <a href="https://github.com/xxxxxx" target="_blank">
            <img
              src="https://cn.vuejs.org/images/logo.svg"
              style="width: 100px"
            />
          </a>
          <p class="card-text">xxxxxx</p>
        </div>
        <div class="card">
          <a href="https://github.com/xxxxxx" target="_blank">
            <img
              src="https://cn.vuejs.org/images/logo.svg"
              style="width: 100px"
            />
          </a>
          <p class="card-text">xxxxxx</p>
        </div>
        <div class="card">
          <a href="https://github.com/xxxxxx" target="_blank">
            <img
              src="https://cn.vuejs.org/images/logo.svg"
              style="width: 100px"
            />
          </a>
          <p class="card-text">xxxxxx</p>
        </div>
        <div class="card">
          <a href="https://github.com/xxxxxx" target="_blank">
            <img
              src="https://cn.vuejs.org/images/logo.svg"
              style="width: 100px"
            />
          </a>
          <p class="card-text">xxxxxx</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style  scoped>
.album {
  min-height: 50rem; /* Can be removed; just added for demo purposes */
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #f7f7f7;
}

.card {
  float: left;
  width: 33.333%;
  padding: 0.75rem;
  margin-bottom: 2rem;
  border: 1px solid #efefef;
  text-align: center;
}

.card > img {
  margin-bottom: 0.75rem;
  border-radius: 100px;
}

.card-text {
  font-size: 85%;
}
</style>
```

这里需要引入一个第三方的样式，所以我们需要在public目录下的index.html进行引入

在public下新建css目录，将需要引入的css文件放入

```html
<!-- 添加第三方的样式 -->
    <link rel="stylesheet" href="<%= BASE_URL %>css/bootstrap.css">
```

接着进行组件的拆分

App.vue

```vue
<template>
  <div class="container">
    <!-- 搜索组件 -->
    <Search />
    <List />
  </div>
</template>

<script>
import Search from "./components/Search.vue";
import List from "./components/List.vue";
export default {
  name: "App",
  components: {
    Search,
    List,
  },
};
</script>
```

Search.vue

```vue
<template>
  <div>
    <section class="jumbotron">
      <h3 class="jumbotron-heading">Search Github Users</h3>
      <div>
        <input
          type="text"
          placeholder="enter the name you search"
        />&nbsp;<button>Search</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "Search",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style  scoped>
</style>
```

List.vue

```vue
<template>
  <div>
    <div class="row">
      <div class="card">
        <a href="https://github.com/xxxxxx" target="_blank">
          <img
            src="https://cn.vuejs.org/images/logo.svg"
            style="width: 100px"
          />
        </a>
        <p class="card-text">xxxxxx</p>
      </div>
      <div class="card">
        <a href="https://github.com/xxxxxx" target="_blank">
          <img
            src="https://cn.vuejs.org/images/logo.svg"
            style="width: 100px"
          />
        </a>
        <p class="card-text">xxxxxx</p>
      </div>
      <div class="card">
        <a href="https://github.com/xxxxxx" target="_blank">
          <img
            src="https://cn.vuejs.org/images/logo.svg"
            style="width: 100px"
          />
        </a>
        <p class="card-text">xxxxxx</p>
      </div>
      <div class="card">
        <a href="https://github.com/xxxxxx" target="_blank">
          <img
            src="https://cn.vuejs.org/images/logo.svg"
            style="width: 100px"
          />
        </a>
        <p class="card-text">xxxxxx</p>
      </div>
      <div class="card">
        <a href="https://github.com/xxxxxx" target="_blank">
          <img
            src="https://cn.vuejs.org/images/logo.svg"
            style="width: 100px"
          />
        </a>
        <p class="card-text">xxxxxx</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style  scoped>
.album {
  min-height: 50rem; /* Can be removed; just added for demo purposes */
  padding-top: 3rem;
  padding-bottom: 3rem;
  background-color: #f7f7f7;
}

.card {
  float: left;
  width: 33.333%;
  padding: 0.75rem;
  margin-bottom: 2rem;
  border: 1px solid #efefef;
  text-align: center;
}

.card > img {
  margin-bottom: 0.75rem;
  border-radius: 100px;
}

.card-text {
  font-size: 85%;
}
</style>
```

为Search添加对应方法

添加了搜索栏、发起了ajax请求

```vue
<template>
  <div>
    <section class="jumbotron">
      <h3 class="jumbotron-heading">Search Github Users</h3>
      <div>
        <input
          type="text"
          placeholder="enter the name you search"
          v-model="keyWord"
        />&nbsp;<button @click="searchUsers">Search</button>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Search",

  data() {
    return {
      keyWord: "",
    };
  },

  mounted() {},

  methods: {
    searchUsers() {
      axios.get(`https://api.github.com/search/users?q=${this.keyWord}`).then(
        (response) => {
          // 获取对应的数据
          console.log("请求到的数据为", response.data.items);
        },
        (error) => {
          console.log("报错信息为", error.message);
        }
      );
    },
  },
};
</script>

<style  scoped>
</style>
```

采用全局事件总线将数据交给List组件

安装全局事件总线

main.js

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	beforeCreate(){
		Vue.prototype.$bus= this
	}
})
```

来到List组件

```js
mounted() {
    // 创建事件
    this.$bus.$on("getUsers", (users) => {
      this.users = users;
    });
  },
```

来到Search中发送数据

```js
methods: {
    searchUsers() {
      axios.get(`https://api.github.com/search/users?q=${this.keyWord}`).then(
        (response) => {
          // 获取对应的数据
          // console.log("请求到的数据为", response.data.items);
          // 当请求成功后
          this.$bus.$emit("getUsers", response.data.items);
        },
        (error) => {
          console.log("报错信息为", error.message);
        }
      );
    },
  }
```

为List组件添加一个接收数据的数组

```js
 data() {
    return {
      users: [],
    };
  },
```

![image-20231003100451935](https://s2.loli.net/2023/10/03/g1zPVlofRaYc3pN.png)

移去上面无用的结构，保留有意义的结构进行数据存入

```vue
<template>
  <div>
    <div class="row">
      <div class="card" v-for="user in users" :key="user.login">
        <a :href="user.html_url" target="_blank">
          <img :src="user.avatar_url" style="width: 100px" />
        </a>
        <p class="card-text">{{ user.login }}</p>
      </div>
    </div>
  </div>
</template>
```

## github案例完善

进入当前页面时，需要有一个欢迎词，在点击搜索后，会有对应的加载效果，不能完全空白，当网络请求错误时，就出现错误页面

来到List中，为它新增几个属性

```js
data() {
    return {
      users: [],
      //   是否第一次进入
      isFirst: true,
      //   是否正在加载中
      isLoading: false,
      // 错误信息
      errMsg: "",
    };
  }
```

根据这些属性来显示不同的效果

```vue
<template>
  <div>
    <div class="row">
      <!-- 展示用户列表 -->
      <div
        class="card"
        v-show="users.length"
        v-for="user in users"
        :key="user.login"
      >
        <a :href="user.html_url" target="_blank">
          <img :src="user.avatar_url" style="width: 100px" />
        </a>
        <p class="card-text">{{ user.login }}</p>
      </div>
      <!-- 欢迎词 -->
      <h1 v-show="isFirst">Welcome to Github</h1>
      <!-- 加载中 -->
      <h1 v-show="isLoading">加载中.....</h1>
      <!-- 错误信息 -->
      <h1 v-show="errMsg">{{ errMsg }}</h1>
    </div>
  </div>
</template>
```

编写对应的功能代码

List.vue

添加了数据合并的功能，且对象传递参数时，不会有顺序的问题

```vue
<template>
  <div>
    <div class="row">
      <!-- 展示用户列表 -->
      <div
        class="card"
        v-show="info.users.length"
        v-for="user in info.users"
        :key="user.login"
      >
        <a :href="user.html_url" target="_blank">
          <img :src="user.avatar_url" style="width: 100px" />
        </a>
        <p class="card-text">{{ user.login }}</p>
      </div>
      <!-- 欢迎词 -->
      <h1 v-show="info.isFirst">Welcome to Github</h1>
      <!-- 加载中 -->
      <h1 v-show="info.isLoading">加载中.....</h1>
      <!-- 错误信息 -->
      <h1 v-show="info.errMsg">{{ info.errMsg }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",

  data() {
    return {
      info: {
        users: [],
        //   是否第一次进入
        isFirst: true,
        //   是否正在加载中
        isLoading: false,
        // 错误信息
        errMsg: "",
      },
    };
  },

  mounted() {
    // 创建事件
    this.$bus.$on("updateListData", (dataObj) => {
      // dataObj作为所有数据的一个集合(不会有顺序的问题，里面是一个完整的对象)
      // 通过字面量的形式合并两者的数据，就不会产生当dataObj的数据少于info中的时，所出现的数据缺失问题
      // this.info = dataObj  容易出现数据缺失问题
      this.info = { ...this.info, ...dataObj };
    });
  },

  methods: {},
};
</script>
```

Search.vue

```js
searchUsers() {
      // 获取对应的数据时(加载中)
      this.$bus.$emit("updateListData", {
        isFirst: false,
        isLoading: true,
        errMsg: "",
        users: [],
      });
      this.$http
        .get(`https://api.github.com/search/users?q=${this.keyWord}`)
        .then(
          (response) => {
            // 当请求成功后
            this.$bus.$emit("updateListData", {
              isLoading: false,
              errMsg: "",
              users: response.data.items,
            });
          },
          (error) => {
            // 请求失败时
            this.$bus.$emit("updateListData", {
              isLoading: false,
              errMsg: error.message,
              users: [],
            });
          }
        );
    },
  },
```

## vue-resource(了解)

安装

```shell
npm i vue-resource
```

在main.js中加入

```js
// 引入vueResource
import vueResource from 'vue-resource'
// 使用vueResource
Vue.use(vueResource)
```

使用方式

与axios都是一致的，只是将axios.get改为了this.$http.get这样的形式，其他都不变

```js
methods: {
    searchUsers() {
      this.$http
        .get(`https://api.github.com/search/users?q=${this.keyWord}`)
        .then(
          (response) => {
            // 获取对应的数据时(加载中)
            this.$bus.$emit("updateListData", {
              isFirst: false,
              isLoading: true,
              errMsg: "",
              users: [],
            });
            // 当请求成功后
            this.$bus.$emit("updateListData", {
              isLoading: false,
              errMsg: "",
              users: response.data.items,
            });
          },
          (error) => {
            // 请求失败时
            this.$bus.$emit("updateListData", {
              isLoading: false,
              errMsg: error.message,
              users: [],
            });
          }
        );
    },
  }
```

## 默认插槽(slot插槽)

效果一(不使用插槽)

创建一个如下的效果，添加一个Category组件

![image-20231003204731753](https://s2.loli.net/2023/10/05/4xQI1YuTyLNKvBl.png)

App.vue

```vue
<template>
  <div class="container">
    <Category />
    <Category />
    <Category />
  </div>
</template>

<script>
import Category from "./components/Category.vue";
export default {
  name: "App",
  components: {
    Category,
  },
  data() {
    return {
      foods: ["火锅", "烧烤", "小龙虾", "牛排"],
      games: ["游戏1", "游戏2", "游戏3", "游戏four"],
      films: ["电影1", "电影2", "电影3", "电影four"],
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}
</style>
```

Category.vue

```vue
<template>
  <div class="category">
    <h3>xxx分类</h3>
    <ul>
      <li>xxx</li>
      <li>xxx</li>
      <li>xxx</li>
      <li>xxx</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Category",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
.category {
  background-color: skyblue;
  width: 200px;
  height: 300px;
}
h3 {
  background-color: orange;
}
</style>
```

首先，要将数据传入到子组件中，通过props进行传递

由于组件要不断的复用，所以可以通过一个大的数据进行整体进行传递

App.vue

```vue
<template>
  <div class="container">
    <Category :listData="foods" title="美食" />
    <Category :listData="games" title="游戏" />
    <Category :listData="films" title="电影" />
  </div>
</template>
```

Category.vue

```vue
props: ["listData", "title"],
```

```vue
<template>
  <div class="category">
    <h3>{{ title }}</h3>
    <ul>
      <li v-for="(item, index) in listData" :key="index">{{ item }}</li>
    </ul>
  </div>
```

此时需求改变了，美食和电影变成图片了，游戏分类依然不变

![image-20231004103421822](https://s2.loli.net/2023/10/04/3ax2dOWoSDzMviy.png)

我们可以通过插槽的形式来存放对应的内容

先单独存放一个看看效果

App.vue

```vue
<template>
  <div class="container">
    <Category :listData="foods" title="美食">
      <img src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg" alt="" />
    </Category>
    <!-- <Category :listData="games" title="游戏" />
    <Category :listData="films" title="电影" /> -->
  </div>
</template>
```

改变一下对应的样式

```css
img {
  width: 200px;
}
```

如果直接给Category组件中放置img标签是没有效果的，需要通过slot插槽进行数据的插入

Category.vue

```vue
<template>
  <div class="category">
    <h3>{{ title }}</h3>
    <!-- <ul>
      <li v-for="(item, index) in listData" :key="index">{{ item }}</li>
    </ul> -->
    <slot></slot>
  </div>
</template>
```

添加了插槽后，就能看到对应的效果了

slot插槽中还可以指定默认值

Category.vue

```vue
<template>
  <div class="category">
    <h3>{{ title }}</h3>
    <!-- <ul>
      <li v-for="(item, index) in listData" :key="index">{{ item }}</li>
    </ul> -->
    <slot>这里是默认值，当用户不传递对应的数据时，就会给出默认值</slot>
  </div>
</template>
```

然后将App.vue中Category组件中的img注释掉，查看对应效果

那么，这里改变后的需求就可以通过slot插槽+默认值来实现

```vue
<template>
  <div class="container">
    <Category title="美食">
      <img src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg" alt="" />
    </Category>
    <Category title="游戏">
      <ul>
        <li v-for="(item, index) in games" :key="index">{{ item }}</li>
      </ul>
    </Category>
    <Category title="电影">
      <img src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg" alt="" />
    </Category>
  </div>
</template>
```

Category中的props也不需要接收数据了

```vue
props: ["title"],
```

## 具名插槽

使用具名插槽编写如下需求

![image-20231004143439635](https://s2.loli.net/2023/10/05/DhSq8i9lpkPz1Nj.png)

具名插槽需要有名称，所以在插槽上加入name

```vue
<!-- 中部 -->
    <slot name="center"
      >这里是默认值,当用户不传递对应的数据时,就会给出默认值1</slot
    >
    <!-- 尾部 -->
    <slot name="footer"
      >这里是默认值,当用户不传递对应的数据时,就会给出默认值2</slot
    >
```

然后在App.vue中调用它

通过slot对应不同的插槽，或者在template中使用v-slot指定

```vue
<template>
  <div class="container">
    <Category title="美食">
      <img
        src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg"
        alt=""
        slot="center"
      />
      <a href="#" slot="footer">更多美食</a>
    </Category>
    <Category title="游戏">
      <ul slot="center">
        <li v-for="(item, index) in games" :key="index">{{ item }}</li>
      </ul>
      <div class="container" slot="footer">
        <!-- slot可以添加多个,不受数量限制 -->
        <a href="#">单击游戏</a>
        <a href="#">网络游戏</a>
      </div>
    </Category>
    <Category title="电影">
      <img
        src="https://s3.ax1x.com/2021/01/16/srJlq0.jpg"
        alt=""
        slot="center"
      />
      <template v-slot:footer>
        <!-- v-slot:footer只能使用在template中 -->
        <div class="container">
          <!-- slot可以添加多个,不受数量限制 -->
          <a href="#">经典</a>
          <a href="#">热门</a>
          <a href="#">推荐</a>
        </div>
      </template>
    </Category>
  </div>
</template>
```

## 作用域插槽

先将代码精简一下

App.vue

```vue
<template>
  <div class="container">
    <Category title="游戏"> </Category>
    <Category title="游戏"> </Category>
    <Category title="游戏"> </Category>
  </div>
</template>

<script>
import Category from "./components/Category.vue";
export default {
  name: "App",
  components: {
    Category,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-around;
}
img {
  width: 200px;
}
</style>
```

Category.vue

```vue
<template>
  <div class="category">
    <h3>{{ title }}</h3>
    <ul>
      <li v-for="(item, index) in games" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Category",

  data() {
    return {
      games: ["游戏1", "游戏2", "游戏3", "游戏four"],
    };
  },

  mounted() {},

  methods: {},
  props: ["title"],
};
</script>

<style lang="css" scoped>
.category {
  background-color: skyblue;
  width: 200px;
  height: 300px;
}
h3 {
  background-color: orange;
}
</style>
```

如果我们想将Category中的数据games传递到App中使用，可以通过作用域插槽传递数据

Category.vue

```vue
<template>
  <div class="category">
    <h3>{{ title }}</h3>
    <!-- 这里名称可以任意取 -->
    <slot :games="games"></slot>
  </div>
</template>
```

App.vue

```vue
<template>
  <div class="container">
    <Category title="游戏">
      <!-- 外面必须包裹一层template -->
      <template scope="eastwind">
        <ul>
          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
          <li v-for="(item, index) in eastwind.games" :key="index">
            {{ item }}
          </li>
        </ul>
      </template>
    </Category>
    <Category title="游戏">
      <template scope="eastwind">
        <ol>
          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
          <li v-for="(item, index) in eastwind.games" :key="index">
            {{ item }}
          </li>
        </ol>
      </template>
    </Category>
    <Category title="游戏">
      <template scope="eastwind">
        <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
        <h4 v-for="(item, index) in eastwind.games" :key="index">
          {{ item }}
        </h4>
      </template>
    </Category>
  </div>
</template>
```

代码莫得问题，但是在写这个的时候报了一个警告`Emitted value instead of an instance of Error) the “scope“ attribute for scoped slots`

造成原因：

scope 属性在2.5以后的版本中已经废弃， 被 slot-scope 替代

解决办法：

检查下你的列表组件里，slot 里的 `<template>` 上面有个 scope 属性，你改成 `slot-scope`.

```vue
<template>
  <div class="container">
    <Category title="游戏">
      <!-- 外面必须包裹一层template -->
      <template slot-scope="eastwind">
        <ul>
          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
          <li v-for="(item, index) in eastwind.games" :key="index">
            {{ item }}
          </li>
        </ul>
      </template>
    </Category>
    <Category title="游戏">
      <template slot-scope="eastwind">
        <ol>
          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
          <li v-for="(item, index) in eastwind.games" :key="index">
            {{ item }}
          </li>
        </ol>
      </template>
    </Category>
    <Category title="游戏">
      <template slot-scope="eastwind">
        <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
        <h4 v-for="(item, index) in eastwind.games" :key="index">
          {{ item }}
        </h4>
      </template>
    </Category>
  </div>
</template>
```

这上面不止能传一个值，还可以传递多个值，传递得到的值都在slot-scope对应的对象身上

Category.vue

```vue
<slot :games="games" msg="hahahah"></slot>
```

App.vue

```vue
<Category title="游戏">
      <!-- 外面必须包裹一层template -->
      <template slot-scope="eastwind">
        <ul>
          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
          <li v-for="(item, index) in eastwind.games" :key="index">
            {{ item }}
          </li>
        </ul>
        <h1>{{ eastwind.msg }}</h1>
      </template>
    </Category>
```

也可以通过ES6的结构赋值

```vue
<Category title="游戏">
      <template slot-scope="{ games }">
        <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
        <h4 v-for="(item, index) in games" :key="index">
          {{ item }}
        </h4>
      </template>
    </Category>
```

## 插槽总结

1. 作用：让父组件可以向子组件指定位置插入html结构，也是一种组件间通信的方式，适用于父组件 => 子组件

2. 分类：默认插槽、具名插槽、作用域插槽

3. 使用方式：

	1. 默认插槽

		```vue
		父组件中:
			<Category>
				<div>
		            html结构
		        </div>
			</Category>
		子组件中:
			<template>
				<div>
		           <!-- 定义插槽 -->
		            <slot>插槽默认内容</slot>
		        </div>
			</template>
		```

	2. 具名插槽

		```vue
		父组件中:
			<Category>
				<div slot="子组件中的插槽名称">
		            html结构1
		        </div>
		        <template v-slot:子组件中的插槽名称>
		            html结构2
		        </template>
			</Category>
		子组件中:
			<template>
				<div>
		           <!-- 定义插槽 -->
		            <slot name="zhangsan">插槽默认内容</slot>
		        </div>
			</template>
		```

	3. 作用域插槽

		1. 理解：数据在组件的自身，但根据数据生成的结构需要由组件的使用者来决定。(games数据在Category组件中，但使用数据所遍历出来的结构由App组件决定)
		2. 传递的数据会由子组件决定，而父组件划分结构

		```vue
		父组件中:
			<Category title="游戏">
		      <!-- 外面必须包裹一层template -->
		      <template slot-scope="eastwind">
		        <ul>
		          <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
		          <li v-for="(item, index) in eastwind.games" :key="index">
		            {{ item }}
		          </li>
		        </ul>
		        <h1>{{ eastwind.msg }}</h1>
		      </template>
		    </Category>
			<Category title="游戏">
		      <template slot-scope="{ games }">
		        <!-- 这里的games是来源于之前在作用域插槽中取的名字 -->
		        <h4 v-for="(item, index) in games" :key="index">
		          {{ item }}
		        </h4>
		      </template>
		    </Category>
		子组件中:
			<template>
				<div>
		           <!-- 定义插槽 -->
		           <!-- 这里名称可以任意取 -->
		    	   <slot :games="games" msg="hahahah"></slot>
		        </div>
			</template>
		```



# vuex

## 什么是vuex

1. 概念：专门在Vue中实现集中式状态(数据)管理的一个Vue插件，对vue应用中多个组件的共享状态进行集中式管理(读/写)，也是一种组件间通信的方式，且适用于任意组件间通信
2. 什么时候使用Vuex
	1. 多个组件依赖同一状态
	2. 来自不同组件的行为需要变更同一状态

通俗点说：Vuex相当于一个大的数据共享器，共用的数据都可以存放在这里，要获取时直接调用api获取，或修改

## 纯vue版求和案例

![image-20231004182214132](https://s2.loli.net/2023/10/05/qfXEJBlpeV5hH4r.png)

添加一个组件Count用于编写如下的代码

Count.vue

```vue
<template>
  <div>
    <h1>当前求和为{{ sum }}</h1>
    <!-- v-model.number="n"双向绑定转为数字类型 -->
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前和为奇数再加</button>
    <button @click="incrementWait">等一等再加</button>
  </div>
</template>

<script>
export default {
  name: "Count",

  data() {
    return {
      n: 1,
      sum: 0,
    };
  },

  mounted() {},

  methods: {
    increment() {
      this.sum += this.n;
    },
    decrement() {
      this.sum -= this.n;
    },
    incrementOdd() {
      if (this.sum % 2) this.sum += this.n;
    },
    incrementWait() {
      setTimeout(() => {
        this.sum += this.n;
      }, 500);
    },
  },
};
</script>

<style  scoped>
button {
  margin-left: 5px;
}
</style>
```

App.vue

```vue
<template>
  <Count />
</template>

<script>
import Count from "./components/Count.vue";
export default {
  name: "App",
  components: { Count },
};
</script>

<style scoped>
</style>
```

## 工作原理图

<img src="https://s2.loli.net/2023/10/04/1x92YCQIOcgbd4s.png" alt="vuex" style="zoom: 33%;" />

## Vuex环境搭建

安装Vuex插件

vue2中要使用vuex的3版本

vue3中要使用vuex的4版本

否则会出现版本不兼容的问题

这里学习vue使用的是vue2的版本，所以需要安装指定的vuex的版本

```shell
npm i vuex@3
```

在main.js中进行use，使用vuex

```js
// 引入vuex
import Vuex from 'vuex'
Vue.use(Vuex)

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	store:'hello',
	beforeCreate(){
		Vue.prototype.$bus= this
	}
})
```

查看对应的Vue对象是否存在store属性，因为store属性管理着所有的内容

![image-20231004193655529](https://s2.loli.net/2023/10/05/PmiFHS2OUKRDtux.png)

但是很明显，上面创建的store只是一个模拟的，所以我们需要创建一个store

在src目录下创建一个文件夹store，在store文件夹下创建index.js文件

```js
// 该文件用于创建Vuex中最为核心的store

// 引入Vuex
import Vuex from 'vuex'

// 准备actions——用于响应组件中的动作
const actions = {}

// 准备mutations——用于操作数据(state),操作state中的数据
const mutations = {}

// 准备state——用于存储数据
const state = {}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```

修改main.js中的store

```js
// 以index.js命名的文件可以省略
import store from './store'

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	store:store,
	beforeCreate(){
		Vue.prototype.$bus= this
	}
})
```

此时，会报一个错误`[vuex] must call Vue.use(Vuex) before creating a store instance.`

说是，在创建store实例之前，必须调用Vue.use(Vuex)

要解决这个问题，我们可以将Vue.use方法放到创建store实例之前即可

main.js

在main.js中删除之前引入Vuex并use的代码

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false

// 引入vueResource
import vueResource from 'vue-resource'
// 使用vueResource
Vue.use(vueResource)

// 以index.js命名的文件可以省略
import store from './store'

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	store:store,
	beforeCreate(){
		Vue.prototype.$bus= this
	}
})
```

index.js

在index.js中加入Vue.use(Vuex)的代码，这样就可以让Vue.use在创建store实例之前了

```js
// 该文件用于创建Vuex中最为核心的store

// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作
const actions = {}

// 准备mutations——用于操作数据(state),操作state中的数据
const mutations = {}

// 准备state——用于存储数据
const state = {}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```

## 求和案例vuex版

将Count组件中的sum剪切到index.js中

```vue
sum: 0,
```

```js
// 准备state——用于存储数据
const state = {sum: 0,}
```

将Count组件修改为空壳组件，在后面再对它修改

```vue
<template>
  <div>
    <h1>当前求和为???</h1>
    <!-- v-model.number="n"双向绑定转为数字类型 -->
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前和为奇数再加</button>
    <button @click="incrementWait">等一等再加</button>
  </div>
</template>

<script>
export default {
  name: "Count",

  data() {
    return {
      n: 1,
    };
  },

  mounted() {},

  methods: {
    increment() {},
    decrement() {},
    incrementOdd() {},
    incrementWait() {
      setTimeout(() => {}, 500);
    },
  },
};
</script>

<style  scoped>
button {
  margin-left: 5px;
}
</style>
```

原理图上的第一步是调用Dispatch

在Count组件中调用dispatch

```js
increment() {
      this.$store.dispatch("jia", this.n);
    },
```

来到store目录下的index.js

```js
// 该文件用于创建Vuex中最为核心的store

// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作
const actions = {
    jia(context,value){
        // 这里的context相当于一个MinStore,value是传入的值
        // 在mutations中的方法名都是使用大写
        context.commit('JIA',value)
    }
}

// 准备mutations——用于操作数据(state),操作state中的数据
const mutations = {
    JIA(state,value){
        state.sum += value
    }
}

// 准备state——用于存储数据
const state = {sum: 0,}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```

为组件获得在store身上的值

```vue
 <h1>当前求和为{{ $store.state.sum }}</h1>
```

接着是减法

Count.vue

```js
decrement() {
      this.$store.dispatch("jian", this.n);
    },
```

```js
const actions = {
    jia(context,value){
        // 这里的context相当于一个MinStore,value是传入的值
        // 在mutations中的方法名都是使用大写
        context.commit('JIA',value)
    },
     jian(context,value){
        // 减法
        context.commit('JIAN',value)
    }
}

// 准备mutations——用于操作数据(state),操作state中的数据
const mutations = {
    JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    }
}
```

其他也是类似的，这里就不进行赘述了
有一些业务逻辑较为简单，可以直接在组件中commit提交使用对应的函数

Count

```js
increment() {
      this.$store.commit("JIA", this.n);
    }
```

只需要直接在mutations中进行编写对应函数即可



完整版

Count.vue

```vue
<template>
  <div>
    <h1>当前求和为{{ $store.state.sum }}</h1>
    <!-- v-model.number="n"双向绑定转为数字类型 -->
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前和为奇数再加</button>
    <button @click="incrementWait">等一等再加</button>
  </div>
</template>

<script>
export default {
  name: "Count",

  data() {
    return {
      n: 1,
    };
  },

  mounted() {},

  methods: {
    increment() {
      this.$store.commit("JIA", this.n);
    },
    decrement() {
      this.$store.commit("JIAN", this.n);
    },
    incrementOdd() {
      this.$store.dispatch("jiaOdd", this.n);
    },
    incrementWait() {
      this.$store.dispatch("jiaWait", this.n);
    },
  },
};
</script>

<style  scoped>
button {
  margin-left: 5px;
}
</style>
```

index.js

```js
// 该文件用于创建Vuex中最为核心的store

// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 准备actions——用于响应组件中的动作
const actions = {
    // jia(context,value){
    //     // 这里的context相当于一个MinStore,value是传入的值
    //     // 在mutations中的方法名都是使用大写
    //     context.commit('JIA',value)
    // },
    jiaOdd(context,value){
        if (state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
  
}

// 准备mutations——用于操作数据(state),操作state中的数据
const mutations = {
    JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    }
}

// 准备state——用于存储数据
const state = {sum: 0,}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state
})
```

## vuex开发者工具的使用

vuex开发者工具和vue开发者工具的位置是一样的

![image-20231005145835143](https://s2.loli.net/2023/10/05/5Sf9wVLgt7ul2dM.png)

分为选择区和展示区

根据选择区选择不同的内容而展示区展示对应的内容

![image-20231005150023522](https://s2.loli.net/2023/10/05/9NFb1ce8tqHExv4.png)

如果我们想查看点击后的对应内容，可以在Timeline下的Vue Mutations下查看

![image-20231005150438432](https://s2.loli.net/2023/10/05/JdSzVrqeQ5ZuNOG.png)

新版是像上图一样查看，旧版直接在Vuex下就可以看了

### actions中的context上下文参数

当业务过于复杂时，可以通过在actions中继续调用dispatch进行逻辑分解，或当state中的数据需要被使用时，可以进行操作

context中封装了足够使用的参数

![image-20231005152159433](https://s2.loli.net/2023/10/06/xNJig1DYSBvGpFW.png)

此时我们发现直接在actions中调用context中的state对象修改数据，也能奏效，mutations一下就感觉没必要了，但这样做会有一个问题，开发者工具就直接失效了，因为它缺少了一个步骤，mutations，所以就无效了



## getters配置项

1. 概念：当state中的数据需要经过加工后再使用时，可以使用getters加工

2. 在`store.js`中追加`getters`配置

	```js
	const getters = {
		bigSum(state){
			return state.sum * 10
		}
	}
	
	// 创建并暴露store
	export default new Vuex.Store({
		......
		getters
	})
	```

3. 在组件中读取数据`$store.getters.bigSum`

getters作为核心配置项，其作用是为了添加一个全局的类似于computed这样的一个属性来使用

getters可以处理复杂的逻辑，并且可以全局共享

比如说我们想让之前的求和扩大10倍，就可以通过getters

index.js

```js
// 准备getters——用于将state中的数据进行加工
const getters = {
    bigSum(state){
        // 这里的函数参数是state对象
        return state.sum * 10
    }
}

// 创建并暴露store
export default new Vuex.Store({
    actions,
    mutations,
    state,
    // 并将getters配置在store中
    getters
})
```

在Count.vue组件中的使用方法

```vue
 <h1>当前求和扩大10倍后为{{ $store.getters.bigSum }}</h1>
```



## mapState和mapGetters

准备工作

首先为index.js中添加属性

```js
// 准备state——用于存储数据
const state = {sum: 0,
    address:'Home',
    subject:'后端'
}
```

然后在Count组件修改对应内容

```vue
<template>
  <div>
    <h1>当前求和为{{ $store.state.sum }}</h1>
    <h1>我在{{ $store.state.address }}学习{{ $store.state.subject }}</h1>
    <!-- v-model.number="n"双向绑定转为数字类型 -->
    <select v-model.number="n">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementOdd">当前和为奇数再加</button>
    <button @click="incrementWait">等一等再加</button>
  </div>
</template>
```

此时页面会是这样的

![image-20231005155422308](https://s2.loli.net/2023/10/05/Uu8zrbRxi4E1LAo.png)

此时我们发现，我们在一遍一遍的写着`$store.state.xxx`，这样非常的麻烦

我们可以通过computed简化代码

```vue
<h1>当前求和为{{ sum }}</h1>
    <h1>我在{{ address }}学习{{ subject }}</h1>
```

```js
computed: {
    sum() {
      return this.$store.state.sum;
    },
    address() {
      return this.$store.state.address;
    },
    subject() {
      return this.$store.state.subject;
    },
  },
```

但这些代码看着也是很冗余，能不能自动生成这些代码呢？

我们可以考虑写一个函数，来生成这些计算属性

这里Vuex已经为我们写好了，只需要使用即可

生成器需要引入

在Count.vue中

```js
import { mapState } from "vuex";
```

mapState中的map代表函数名和函数名中可变的数值的名称

也就是

计算属性中，例如sum和`this.$store.state.sum;`中的sum，注意，是这个可变的数值的名称

```js
computed: {
    sum() {
      return this.$store.state.sum;
    },
    address() {
      return this.$store.state.address;
    },
    subject() {
      return this.$store.state.subject;
    },
  },
```

State代表的是之前store中的state属性

mapState可以生成关于State的数据

只有是关于$store.state的才可以生成，例如`this.$store.state.subject;`

此时，我们可以通过mapState生成对应的参数

先在mounted中查看一下会生成什么

```js
mounted() {
    const x = mapState({
      sum: "sum",
      address: "address",
      subject: "subject",
    });
    console.log(x);
  },
```

里面的每一个键值对都分别是对应的函数

![image-20231005210607086](https://s2.loli.net/2023/10/05/7XI59hMnzWZoy6F.png)

通过这些mapState可以生成对应的获取方法

在computed中进行生成

```js
computed: {
    ...mapState({
      sum: "sum",
      address: "address",
      subject: "subject",
    }),
  },
```

在ES6语法中，...对象，这样的形式会将里面的每个参数依次取出并分散(**对象写法**)

例如：

```js
<script>
        let d1 = {
            a:10,
            b:20
        }
        let d2 = {
            c:30,
            ...d1
        }
        console.log(d2)
</script>
```

得到的结果为

![image-20231005210956591](https://s2.loli.net/2023/10/06/hOKUiFCNqeIDkJH.png)

而在computed中，如果这样进行分散的话，就会依次取出，分散成一个个的函数，就相当于之前程序猿自己写的computed

还有一种更精简的写法，数组写法

这种写法需要让函数名与返回的函数值是一致的，例如：

```js
sum() {
      return this.$store.state.sum;
    }
```

可以简写为如下形式

```js
 computed: {
     // 等同于 sum:'sum'
    ...mapState(["sum", "address", "subject"]),
  },
```

我们还使用过了getters配置项，getters配置项也有对应的生成方法 

拿之前的getters来说

```js
const getters = {
    bigSum(state){
        // 这里的函数参数是state对象
        return state.sum * 10
    }
}   
```

这里的getters返回了一个bigSum，如果手动写的话，是这样的

```js
 bigSum() {
      return this.$store.getters.bigSum;
    },
```

使用mapGetters的对象写法

```js
...mapGetters({ bigSum: "bigSum" }),
```

数组写法

```js
...mapGetters(["bigSum"]),
```



## mapActions和mapMutations

既然有了自动生成State对应属性和Getters对应属性的方法，那么

methods中的commit和dispatch这些对应的方法是不是也能自动生成呢？

```js
methods: {
    increment() {
      this.$store.commit("JIA", this.n);
    },
    decrement() {
      this.$store.commit("JIAN", this.n);
    },
    incrementOdd() {
      this.$store.dispatch("jiaOdd", this.n);
    },
    incrementWait() {
      this.$store.dispatch("jiaWait", this.n);
    },
  },
```

可以通过mapMutations和mapActions自动来生成

导入对应的mapMutations

```js
import { mapGetters, mapState, mapMutations } from "vuex";
```

```js
...mapMutations({
      increment: "JIA",
      decrement: "JIAN",
    }),
```

运行测试一下

![image-20231006112346217](https://s2.loli.net/2023/10/06/WS7Zj5IyRiskzar.png)

此时发现数据产生了问题

解决方法：

为increment添加参数，因为第一个不带参数默认传入的是一个event

我们可以验证一下

在index.js中的mutations下修改如下代码

```js
const mutations = {
    JIA(state,value){
        console.log(value)
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    }
}
```

测试效果正确，说明默认不带参数传入的是一个event的对象

![image-20231006112657772](https://s2.loli.net/2023/10/06/n2xAGphPOiaItJH.png)

increment(event)是默认的，所以导致出现了点击事件，所以我们可以手动改变对应的事件

```vue
<!-- 这里的n代指传入的值，可以使得本来increment(event)被覆盖掉 -->
    <button @click="increment(n)">+</button>
    <button @click="decrement(n)">-</button>
```

再次运行之后就没有问题了

也可以使用数组写法，但是需要函数名一致，写法跟mapState中的数组写法是一致的

接着是mapActions，跟mapMutations是一模一样的，也需要传递参数n，然后使用对象写法或数组写法

```js
...mapActions({
      incrementOdd: "jiaOdd",
      incrementWait: "jiaWait",
    }),
```

```vue
<button @click="incrementOdd(n)">当前和为奇数再加</button>
    <button @click="incrementWait(n)">等一等再加</button>
```

## 多组件共享数据

创建一个新组件，Person，作为多组件共享数据的模板

```vue
<template>
  <div>
    <h1>人员列表</h1>
    <input type="text" placeholder="请输入名字" />
    <button>添加</button>
    <ul>
      <li>xxxxxxx</li>
      <li>xxxxxxx</li>
      <li>xxxxxxx</li>
      <li>xxxxxxx</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Person",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
</style>
```

在App.vue中引入对应的组件

```vue
<script>
import Count from "./components/Count.vue";
import Person from "./components/Person.vue";
export default {
  name: "App",
  components: { Count, Person },
};
</script>
```

```vue
<template>
  <div>
    <Count />
    <hr />
    <Person />
  </div>
</template>
```

将Person中需要保存的数据存放到vuex当中

在store下的index.js修改

```js
const state = {sum: 0,
    address:'Home',
    subject:'后端',
    personList:[
        {id:'001',name:'张三'}
    ]
}
```

我们想获取数据，有三种方法

第一种，直接获取

回到Person.vue

```vue
<ul>
      <li v-for="person in $store.state.personList" :key="person.id">
        {{ person.name }}
      </li>
    </ul>
```

第二种，赋值到personList身上

```js
data() {
    return {
      personList: this.$store.state.personList,
    };
  },
```

```vue
<ul>
      <li v-for="person in personList" :key="person.id">
        {{ person.name }}
      </li>
    </ul>
```

第三种，可以通过mapState获取

```js
computed: {
    ...mapState({ personList: "personList" }),
  },
```

```vue
<script>
import { mapState } from "vuex";
export default {
  name: "Person",

  data() {
    return {};
  },
  computed: {
    // ...mapState({ personList: "personList" }),
    ...mapState(["personList"]),
  },
  mounted() {},

  methods: {},
};
</script>
```

编写添加按钮对应的代码

```vue
<input type="text" placeholder="请输入名字" v-model="name" />
    <button @click="addPerson">添加</button>
```

```js
data() {
    return {
      name: "",
    };
  },
```

导入生成随机id的库

```js
import { nanoid } from "nanoid";
```

在store下的index.js

```js
const mutations = {
    JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    },
     ADD_PERSON(state,value){
        state.personList.unshift(value)
    }
}
```

编写添加代码

```js
methods: {
    addPerson() {
      const personObj = { id: nanoid(), name: this.name };
      this.$store.commit("ADD_PERSON", personObj);
      this.name = "";
    },
  },
```

两个组件可以通过vuex来互相的共享数据

在Person.vue中

```vue
<h1>Count组件中的值为{{ sum }}</h1>
```

```js
 computed: {
    // ...mapState({ personList: "personList" }),
    ...mapState(["personList", "sum"]),
  },
```

在Count.vue下

```vue
<h1>Person组件中的人数为{{ personList.length }}</h1>
```

```js
computed: {
    ...mapState(["sum", "address", "subject", "personList"]),
    ...mapGetters({ bigSum: "bigSum" }),
    // ...mapGetters(["bigSum"]),
  },
```

运行并测试，此时就实现了数据共享

灰常方便



## vuex模块化+namespace

vuex模块化，可以让代码更好管理，例如求和组件和Person组件都放在一起，会显得十分的冗余，我们可以将其拆开再一个个的放入

例如这一段

```js
const actions = {
    // jia(context,value){
    //     // 这里的context相当于一个MinStore,value是传入的值
    //     // 在mutations中的方法名都是使用大写
    //     context.commit('JIA',value)
    // },
    jiaOdd(context,value){
        if (state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
  
}
```

它是求和组件中的actions，我们可以将它拆分到对应的求和组件中去

```js
// 求和相关配置
const sumOptions = {
    actions:{
    jiaOdd(context,value){
        if (state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
    },
    mutations:{
        JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    },
    },
    state:{},
    getters:{}
}
```

以及Count组件相关的mutations

```js
const personOptions = {
    actions:{},
    mutations:{
         ADD_PERSON(state,value){
        state.personList.unshift(value)
    }
    },
     state:{},
    getters:{}
}
```

然后将对应的配置修改为现在的配置项

最后的整体如下

```js
// 该文件用于创建Vuex中最为核心的store

// 引入Vue
import Vue from 'vue'
// 引入Vuex
import Vuex from 'vuex'
Vue.use(Vuex)

// 求和相关配置
const sumOptions = {
    actions:{
    jiaOdd(context,value){
        if (state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
    },
    mutations:{
        JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    },
    },
    state:{sum: 0,
    address:'Home',
    subject:'后端',},
    getters:{
        bigSum(state){
        // 这里的函数参数是state对象
        return state.sum * 10
    }
    }
}
const personOptions = {
    actions:{},
    mutations:{
         ADD_PERSON(state,value){
        state.personList.unshift(value)
    }
    },
     state:{personList:[
        {id:'001',name:'张三'}
    ]},
    getters:{}
}


// 创建并暴露store
export default new Vuex.Store({
    modules:{
        CountOptions:sumOptions,
        PersonOption:personOptions
    }
})
```

开启对应的命名空间，因为开启了对应的命名空间后，才能使用简写，否则只能在模块中通过模块名.xxx这样调用对应的属性，很麻烦

```js
// 求和相关配置
const sumOptions = {
    namespaced:true,
    actions:{
    jiaOdd(context,value){
        if (state.sum % 2){
            context.commit('JIA',value)
        }
    },
    jiaWait(context,value){
        setTimeout(()=>{
            context.commit('JIA',value)
        },500)
    }
    },
    mutations:{
        JIA(state,value){
        state.sum += value
    },
    JIAN(state,value){
        state.sum -= value
    },
    },
    state:{sum: 0,
    address:'Home',
    subject:'后端',},
    getters:{
        bigSum(state){
        // 这里的函数参数是state对象
        return state.sum * 10
    }
    }
}
const personOptions = {
    namespaced:true,
    actions:{},
    mutations:{
         ADD_PERSON(state,value){
        state.personList.unshift(value)
    }
    },
     state:{personList:[
        {id:'001',name:'张三'}
    ]},
    getters:{}
}
```

配置都模块化后，我们在组件中修改对应的内容，让其生效

Count.vue

`...mapState("对应着store中index.js下不同的数据名称", ["对应的数据","sum", "address", "subject"])`

```js
computed: {
    ...mapState("CountOption", ["sum", "address", "subject"]),
    ...mapState("PersonOption", ["personList"]),
    ...mapGetters("CountOption", ["bigSum"]),
    // ...mapGetters(["bigSum"]),
  },
```

如果不在数据中加入`namesapced:true`，就需要先注册对应的`CountOption`和`PersonOption`，然后在组件中修改对应的名称为

注册对应数据

```js
...mapState(["PersonOption"]),
```

修改对应名称

```vue
<h1>Person组件中的人数为{{ PersonOption.personList.length }}</h1>
```

这样也是可以的

但是太麻烦了，不如上面那种

然后我们点击了一下按钮，又没效果了，这是因为，没有标明这些方法是在哪个模块下方，我们需要标注一下，方法和上面这段是类似的

```js
 methods: {
    ...mapMutations("CountOption", {
      increment: "JIA",
      decrement: "JIAN",
    }),
    ...mapActions("CountOption", {
      incrementOdd: "jiaOdd",
      incrementWait: "jiaWait",
    }),
  },
```

写完这一段之后运行其他的没啥问题，但是在运行奇数的时候报了一个错误，是我在actions的时候想对sum做判断，但是获取不到sum的值，之前没问题，现在存到一个对象后，就需要用contex.state.sum来获取了，所以修改store下的index.js的代码

```js
jiaOdd(context,value){
        if (context.state.sum % 2){
            context.commit('JIA',value)
        }
    },
```

修改完成后就没啥毛病了

接着来修改Person对应的代码

这里的计算属性用原生来写

```js
computed: {
    personList() {
      return this.$store.state.PersonOption.personList;
    },
    sum() {
      return this.$store.state.CountOption.sum;
    },
    // ...mapState("CountOption", ["sum"]),
    // ...mapState("PersonOption", ["personList"]),
  },
```

而对应的方法就有所不同了

```js
methods: {
    addPerson() {
      const personObj = { id: nanoid(), name: this.name };
      this.$store.commit("PersonOption/ADD_PERSON", personObj);
      this.name = "";
    },
  },
```

通过`this.$store.commit("对应的属性名称/ADD_PERSON", 传入的参数);`

以/为分割找到对应的方法



接着为store下的index.js下的personOptions添加一个方法addWang和一个getters

```js
const personOptions = {
    namespaced:true,
    actions:{
        // 只添加姓王的成员
        addWang(context,value){
            if (value.name.indexOf('王') === 0){
                context.commit('ADD_PERSON',value)
            }
        }
    },
    mutations:{
         ADD_PERSON(state,value){
        state.personList.unshift(value)
    }
    },
     state:{personList:[
        {id:'001',name:'张三'}
    ]},
    getters:{
       firstName(state){
         return state.personList[0].name;
       }
    }
}
```

我想获取getters下的`firstName`，用原生写法怎么写呢？

首先在Person.vue下

```vue
<h1>列表里的第一个人的名字叫{{ firstName }}</h1>
```

在getters下的数据与state中的数据有所不同
我们输出一下store看一下getters的数据是什么

![image-20231006155119952](https://s2.loli.net/2023/10/06/eg9Hkd6f1TpnZKM.png)

是在getters下的`属性名/方法名`，这下我们就可以直接调用了

```js
firstName() {
      return this.$store.getters["PersonOption/firstName"];
    },
```

接着运行测试，OK了

当然，也可以使用...mapgetters，方法是类似的

```js
...mapGetters("PersonOption", ["firstName"]),
```

这样写的话就不会很麻烦了，都封装好了 

接着将刚刚那个添加wang姓的方法加入进来，在Person.vue下

```vue
<button @click="addWang">添加wang person</button>
```

添加对应方法

```js
addWang() {
      const personObj = { id: nanoid(), name: this.name };
      this.$store.dispatch("PersonOption/addWang", personObj);
      this.name = "";
    },
```

这样的模块化使得代码更容易管理

我们甚至可以单独的创建一个文件，来单独的写对应的内容，然后使用export default对外暴露后，在store下的index.js进行引入，效果是一样的，并且代码更加精简

接着使用vuex来发请求

在store下的index.js中

```js
import axios from 'axios'
import {nanoid} from 'nanoid'
```

添加对应的请求代码

```js
addRanPerson(context){
            axios.get('https://api.uixsj.cn/hitokoto/get?type=social').then(
                response=>{
                    context.commit('ADD_PERSON',{id:nanoid(),name:response.data})
                },
                error=>{
                    alert(error.message)
                }
            )
        }
```

回到Person.vue中添加对应的单击事件 

```vue
 <button @click="addRanPerson">随机添加名称</button>
```

```js
addRanPerson() {
      this.$store.dispatch("PersonOption/addRanPerson");
      this.name = "";
    },
```

# 路由

在生活中有路由器(router)，一个路由器可以管理多个路由(route)，一个路由对应一个key -> value，这里的key指的是路由器上对应的路由接口，value对应的是电脑主机，相当于说一个路由是由一个路由接口+电脑主机组成的

![image-20231007071620830](https://s2.loli.net/2023/10/29/izXUdmnhSYHVgtF.png)



SPA（single page web application）单页面应用

单页面应用指的是所有的内容都在一个页面中呈现，即不使用跳转修改为其他页面，增强了页面的可读性，并且页面只是做了一个局部的更新

如下图所示，下图就是一个局部的组件更新，当图片中的地址发生改变后，对应页面中的组件也会进行切换，这就是单页面应用

![image-20231007073642192](https://s2.loli.net/2023/10/07/JRyLnz4ZYtFNvBo.png)

总结：

1. 单页面Web应用(single page web application,SPA)
2. 整个应用只有**一个完整的页面**(index.html)
3. 点击页面中的导航链接**不会刷新**页面，只会做页面的**局部更新**
4. 数据需要通过ajax请求获取

## 路由的介绍

什么是路由？

1. 一个路由就是一组映射关系(key-value)
2. key为路径，value可能是function或component

路由分类

1. 后端路由
	1. 理解：value是function。用于处理客户端提交的请求
	2. 工作过程：服务器收到一个请求时，根据**请求路径**找到匹配的**函数**来处理请求，返回响应数据
2. 前端路由：
	1. 理解：value是component，用于展示页面内容
	2. 工作过程：当浏览器的路径改变时，对应的组件就会显示



## 路由的基本使用

了解完了路由，接着做一个小demo熟悉路由的使用过程

这个小demo通过路由做了一个单页面应用，点击不同的按钮后会出现不同的内容，且路径也会发生对应的变化

<img src="https://s2.loli.net/2023/10/07/JMLrypfXSdD9luj.png" alt="image-20231007080358838" style="zoom:50%;" />

添加默认代码

App.vue

```vue
<template>
  <div>
    <div class="row">
      <div class="col-xs-offset-2 col-xs-8">
        <div class="page-header"><h2>Vue Router Demo</h2></div>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-2 col-xs-offset-2">
        <div class="list-group">
          <a class="list-group-item active" href="./about.html">About</a>
          <a class="list-group-item" href="./home.html">Home</a>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="panel">
          <div class="panel-body">
            <h2>我是About的内容</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style scoped>
</style>
```

引入样式

public/index.html

```html
<link rel="stylesheet" href="<%= BASE_URL %>css/bootstrap.css">
```

main.js

```js
//引入Vue
import Vue from 'vue'
//引入App
import App from './App.vue'
//关闭Vue的生产提示
Vue.config.productionTip = false

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),

})
```

运行测试后，效果如下

![image-20231007123422118](https://s2.loli.net/2023/10/07/fi29MkFaUGBVXRZ.png)

接着进行组件的拆分，按照逻辑，会拆分成两个组件

About和Home

在Components目录下新建对应的文件

About.vue

```vue
<template>
  <div>
    <h2>我是About的内容</h2>
  </div>
</template>

<script>
export default {
  name: "About",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

Home.vue

```vue
<template>
  <div>
    <h2>我是Home的内容</h2>
  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

并在App中删除`<h2>我是About的内容</h2>`

App中展示的内容，得根据用户点击的导航项来确定

安装`vue-router`

vue-router的最新版是不支持vue2的

所以我们需要安装老版本的vue-router

```shell
npm i vue-router@3
npm i vue-router		————支持vue3,但不支持vue2
```

安装完成后，在main.js中进行引入

```js
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	router:'hello'
})
```

引入后，需要在src下新建一个文件夹router，并在里面创建index.js

该文件是为了配置路由器所存在的

```js
// 该文件专门用于创建路由器
import VueRouter from 'vue-router'
// 引入对应的组件
import About from '../components/About.vue'
import Home from '../components/Home.vue'

// 创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/about',
            component:About
        },
        {
            path:'/home',
            component:Home
        }
    ]
})
```

回到main.js中添加路由器的对应配置

```js
import router from './router'
//创建vm
new Vue({
	el:'#app',
	render: h => h(App),
	router:router
})
```

在原始的html中是使用a标签进行跳转，但在vue-router中就不是了

在vue-router中使用的是一个专门的标签

router-link对应着html中的a标签，to对应着a标签中的href，active-class是当哪个标签被选中时，渲染对应的效果

```vue
<!-- Vue中通过router-link实现路由的切换 -->
<router-link class="list-group-item" active-class="active" to="/about"
            >About</router-link
          >
<router-link class="list-group-item" active-class="active" to="/home"
            >Home</router-link>
```

在需要添加页面的位置添加对应的路由切换

```vue
<!-- 通过router-view指定展示的位置 -->
<router-view></router-view>
```

此时，页面就完成了

## 使用路由的注意点

为上节做的页面拆分组件，将头部内容拆分为一个组件

Banner.vue

```vue
<div class="col-xs-offset-2 col-xs-8">
        <div class="page-header"><h2>Vue Router Demo</h2></div>
      </div>
```

在App.vue中进行引入

```vue
<script>
import Banner from "./components/Banner.vue";
export default {
  name: "App",
  components: { Banner },
};
</script>
```

在页面中，使用路由所出现的组件叫路由组件，直接在页面中使用的叫一般组件，一般会将这两种组件区分，路由组件放在pages目录下，而一般组件放在components目录下

并在index.js修改之前的代码

```js
import About from '../pages/About.vue'
import Home from '../pages/Home.vue'
```

总结：

1. 路由组件通常存放在`pages`文件夹，一般组件通常存放在`components`文件夹
2. 通过切换，`隐藏`了的路由组件，默认是被销毁掉的，需要的时候再去挂载
3. 每个组件有自己的`$route`属性，里面存储着自己的路由信息
4. 整个应用只有一个router，可以通过组件的`$router`属性获取到

## 嵌套(多级)路由

在路由中添加一个导航路由，方式是类似的，其实就是在路由中再添加一个路由

效果图如下

<img src="https://s2.loli.net/2023/10/07/jwR8V72sLgCzmSp.png" alt="image-20231007142521827" style="zoom:67%;" />

先在pages下创建一个对应的组件

```vue
<template>
  <div>
    <ul>
      <li><a href="/message1">message001</a>&nbsp;&nbsp;</li>
      <li><a href="/message2">message002</a>&nbsp;&nbsp;</li>
      <li><a href="/message/3">message003</a>&nbsp;&nbsp;</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Message",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

再创建一个组件，News，也在pages下

```vue
<template>
  <div>
    <ul>
      <li>news001</li>
      <li>news002</li>
      <li>news003</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "News",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

编写组件对应的路由规则
在router下的index.js进行编写

默认编写的是一级路由，一级路由内有children是二级路由，依次往下，children路由不需要编写/开头的路径

```js
// 该文件专门用于创建路由器
import VueRouter from 'vue-router'
// 引入对应的组件
import About from '../pages/About.vue'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import Message from '../pages/Message.vue'

// 创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/about',
            component:About
            
        },
        {
            path:'/home',
            component:Home,
            children:[
                {
            path:'news',
            component:News
        },
        {
            path:'message',
            component:Message
        }
            ]
        },
        
    ]
})
```

修改Home.vue中的代码

```vue
<template>
  <div>
    <h2>我是Home的内容</h2>
    <div>
      <ul class="nav nav-tabs">
        <li>
          <router-link
            class="list-group-item"
            active-class="active"
            to="/home/news"
            >News</router-link
          >
        </li>
        <li>
          <router-link
            class="list-group-item"
            active-class="active"
            to="/home/message"
            >Message</router-link
          >
        </li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Home",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

## 路由传参(query参数)

先在Message.vue中修改一下代码，从之前写死的数据改为动态数据

```vue
<template>
  <div>
    <ul>
      <li v-for="i in messageList" :key="i.id">
        <a href="/message1">{{ i.title }}</a
        >&nbsp;&nbsp;
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Message",

  data() {
    return {
      messageList: [
        { id: "001", title: "消息001" },
        { id: "002", title: "消息002" },
        { id: "003", title: "消息003" },
      ],
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

如果我们想通过该组件实现数据传递的话，该怎么操作呢
我们先新建一个组件，在pages下，新建Detail组件

```vue
<template>
  <div>
    <ul>
      <li>消息编号：???</li>
      <li>消息标题：???</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Detail",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style  scoped>
</style>
```

当点击Message中对应的数据时，会改变显示区中的内容

在router中的index.js先进行路由的配置

```js
// 该文件专门用于创建路由器
import VueRouter from 'vue-router'
// 引入对应的组件
import About from '../pages/About.vue'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import Message from '../pages/Message.vue'
import Detail from '../pages/Detail.vue'

// 创建并暴露一个路由器
export default new VueRouter({
    routes:[
        {
            path:'/about',
            component:About
            
        },
        {
            path:'/home',
            component:Home,
            children:[
                {
            path:'news',
            component:News
        },
        {
            path:'message',
            component:Message,
            children:[
                {
                    path:'detail',
                    component:Detail
                }
            ]
        }
            ]
        },
        
    ]
})
```

修改Message.vue下的内容，将其改为路由相应的内容

```vue
<template>
  <div>
    <ul>
      <li v-for="i in messageList" :key="i.id">
        <router-link to="/home/message/detail">{{ i.title }}</router-link
        >&nbsp;&nbsp;
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>
```

接下来编写，当点击对应位置时，传递对应位置的信息

当Message中发送请求时，在地址中可以进行数据的传递

```vue
<ul>
      <li v-for="i in messageList" :key="i.id">
        <router-link to="/home/message/detail?id=666&title=你好啊!">{{
          i.title
        }}</router-link
        >&nbsp;&nbsp;
      </li>
    </ul>
```

这个地址会被解析，紧接着里面的数据会被传递

来到Detail组件中，进行接收

对应的数据都在route中的query下获取

```vue
<li>消息编号：{{ $route.query.id }}</li>
<li>消息标题：{{ $route.query.title }}</li>
```

传递的这些是假数据，这下通过地址传递一些真数据过去

在Message下

通过v-bind将内容转为js表达式，并使用模板字符串初始化数据

```vue
<li v-for="i in messageList" :key="i.id">
    	<!-- 跳转路由并携带query参数，to的字符串写法 -->
        <router-link :to="`/home/message/detail?id=${i.id}&title=${i.title}`">{{
          i.title
        }}</router-link
        >&nbsp;&nbsp;
      </li>
```

运行并测试，此时效果就出现了
但是这种写法太麻烦了

这里是另一种写法，通过to的对象写法，方便管理和查看

```vue
<li v-for="i in messageList" :key="i.id">
        <!-- <router-link :to="`/home/message/detail?id=${i.id}&title=${i.title}`">{{
          i.title
        }}</router-link> -->
        <!-- 跳转路由并携带query参数，to的对象写法 -->
        <router-link
          :to="{
            path: '/home/message/detail',
            query: {
              id: i.id,
              title: i.title,
            },
          }"
          >{{ i.title }}</router-link
        >
        &nbsp;&nbsp;
      </li>
```

## 命名路由

命名路由可以简化路由的跳转

在router/index.js中进行修改

例如

```js
{
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail',
                    component:Detail
                }
            ]
        }
```

这个名字可以让你在做路由跳转时简化编码

在里面直接编写对应的name，可以跳转到对应的detail

```vue
<router-link
          :to="{
            name: 'guanyu',
            // path: '/home/message/detail',
            query: {
              id: i.id,
              title: i.title,
            },
          }"
          >{{ i.title }}</router-link
        >
```

## 路由传参(params参数)

拿Message举例

```vue
<router-link :to="`/home/message/detail/${i.id}/${i.title}`">{{
          i.title
        }}</router-link>
```

这里是通过/xxx/xxx这样的一个内容，且需要在router下的index.js中修改对应的router

```js
 {
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail/:id/:title',
                    component:Detail
                }
            ]
        }
```

因为是在params下传递参数，所以需要在params下获取对应的参数

Detail.vue

```vue
<li>消息编号：{{ $route.params.id }}</li>
<li>消息标题：{{ $route.params.title }}</li>
```

或者换成对应query参数的形式

```vue
<router-link
          :to="{
            name: 'guanyu',
            params: {
              id: i.id,
              title: i.title,
            },
          }"
          >{{ i.title }}</router-link
        >
```

但这样写有一个坑

如果使用params参数，不允许使用path，也就是路径的形式，会报错，只能使用name

## 路由的props配置

在vue中，像这样重复的代码很多

```vue
<li>消息编号：{{ $route.params.id }}</li>
<li>消息标题：{{ $route.params.title }}</li>
```

我们可以考虑使用computed来进行简化，在computed中添加对应的属性来指明对应的一长串数值，但这样很明显也很麻烦

我们可以通过在router/index.js下，添加一个配置项props

### props的对象写法(只能传递死数据)

```js
{
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail/:id/:title',
                    component:Detail,
                    props:{
                        name:'zhangsan',
                        age:18
                    }
                }
            ]
        }
```

添加后，需要到对应的地址下进行接收

```vue
<script>
export default {
  name: "Detail",
  props: ["name", "age"],
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
```

在页面上进行显示

```vue
 <li>{{ name }}</li>
 <li>{{ age }}</li>
```

这样的效果可以显示，但是只能传递写死的数据



## props的布尔值写法

将组件的props属性设置为true，若布尔值为真，就会把该路由组件收到的所有params参数，以props的形式传给Detail组件

```js
{
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail/:id/:title',
                    component:Detail,
                    props:true
                }
            ]
        }
```

在组件中进行接收并使用

```vue
<template>
  <div>
    <ul>
      <li>消息编号：{{ id }}</li>
      <li>消息标题：{{ title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["id", "title"],
  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
</style>
```

但是这种方法不是很完美，它只支持params参数

## props的函数式写法

以函数式的写法来写，很通用，query和params都可以使用

```js
{
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail',
                    component:Detail,
                    props($route){
                        return{
                            id:$route.query.id,
                            title:$route.query.title
                        }
                    }
                }
            ]
        }
```

当然，这里使用的是query，所以在代码里换一下

Message.vue

```vue
<router-link
          :to="{
            path: '/home/message/detail',
            query: {
              id: i.id,
              title: i.title,
            },
          }"
        >
          {{ i.title }}
        </router-link>
```

运行测试，没毛病



## router-link的replace属性

1. 作用：控制路由跳转时操作浏览器历史记录的模式

2. 浏览器的历史记录有两种写入方式：分别为`push`和`replace`，`push`是追加历史记录，`replace`是替换当前记录。路由跳转时候默认为`push`

3. 如何开启`replace`模式：

	在`router-link`上加入`replace`属性即可

	`<router-link replace  ........>News</router-lin>`



## 编程式路由导航

有时候我们可能无法使用`router-link`，因为最终`router-link`会被转为a标签，而我们如果通过button的话，那该如何实现呢，接下来做下面这个效果

<img src="https://s2.loli.net/2023/10/08/ZPih7Re6GqYFSor.png" alt="image-20231008140302613" style="zoom:50%;" />

先在Message组件下添加对应的两个按钮

```diff
<template>
  <div>
    <ul>
      <li v-for="i in messageList" :key="i.id">
        <router-link
          :to="{
            path: '/home/message/detail',
            query: {
              id: i.id,
              title: i.title,
            },
          }"
        >
          {{ i.title }}
        </router-link>
+        <button>push查看</button>
+        <button>replace查看</button>
        <!-- <router-link :to="`/home/message/detail/${i.id}/${i.title}`">{{
          i.title
        }}</router-link> -->
        <!-- 跳转路由并携带query参数，to的对象写法 -->
        <!-- <router-link
          :to="{
            name: 'guanyu',
            params: {
              id: i.id,
              title: i.title,
            },
          }"
          >{{ i.title }}</router-link
        > -->
        &nbsp;&nbsp;
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>
```

然后为按钮绑定对应的点击事件

```vue
 <button @click="pushShow">push查看</button>
```

添加对应的方法

里面的参数纯纯是依靠router传递的，所以和:to是一样的

```js
pushShow(i) {
      this.$router.push({
        path: "/home/message/detail",
        query: {
          id: i.id,
          title: i.title,
        },
      });
    },
```

因为这里需要i，而i在循环里，所以要在循环里接收对应的i

```vue
<button @click="pushShow(i)">push查看</button>
```

接着写replace对应的代码

```vue
<button @click="pushReplace(i)">replace查看</button>
```

```js
pushReplace(i) {
      this.$router.replace({
        path: "/home/message/detail",
        query: {
          id: i.id,
          title: i.title,
        },
      });
    }
```

运行后测试，发现点击按钮后，能显示对应的信息，回退也没毛病

组件中还缺少后退和前进的按钮操作，进行添加

在Banner组件中

```vue
<button @click="back">后退</button>
<button @click="forward">前进</button>
```

router中内置的回退和前进方法

```js
methods: {
    back() {
      console.log(this.$router.back());
    },
    forward() {
      console.log(this.$router.forward());
    },
  },
```

在router内置还内置了一个函数go，这个效果是，传入一个正数，比如2，就会相当于使用forward前进了两步，如果传入负数，就相当于使用back后退了若干步，如果是0，就会刷新页面



## 缓存路由组件

先为News组件添加一些内容

```vue
<template>
  <div>
    <ul>
      <li>news001 <input type="text" /></li>
      <li>news002 <input type="text" /></li>
      <li>news003 <input type="text" /></li>
    </ul>
  </div>
</template>
```

![image-20231008203345463](https://s2.loli.net/2023/10/08/IA1kN8KygfVlTeO.png)

如果想实现缓存效果，只需要在使用该组件的位置添加一个标签

在Home下添加

```vue
<keep-alive include="News">
      <router-view></router-view>
    </keep-alive>
```

include表示缓存的是哪个组件，这里是通过组件名进行缓存的，也就是组件中的name

运行并测试，此时就有缓存的效果了

如果想要缓存多个路由组件的话，可以使用数组的形式

```vue
<keep-alive :include="['News', 'Message']">
      <router-view></router-view>
    </keep-alive>
```

总结：

1. 作用：让不展示的路由组件保持挂载，不被销毁



## 两个新的生命周期钩子

 一个新的需求，为News下方添加一个不断刷新透明度的文字

在News下，

```vue
<template>
  <div>
    <ul>
      <li :style="{ opacity }">欢迎学习Vue</li>
      <li>news001 <input type="text" /></li>
      <li>news002 <input type="text" /></li>
      <li>news003 <input type="text" /></li>
    </ul>
  </div>
</template>
```

```vue
<script>
export default {
  name: "News",

  data() {
    return {
      opacity: 1,
    };
  },

  mounted() {
    this.timer = setInterval(() => {
      this.opacity -= 0.01;
      if (this.opacity <= 0) this.opacity = 1;
    }, 16);
  },
  beforeDestroy() {
    console.log("News组件销毁了");
    clearInterval(this.timer);
  },
  methods: {},
};
</script>
```

回到Home.vue

将之前做的缓存消除

此时，效果是有了，但是之前输入框中的缓存又没了

此时就需要用到两个新的生命周期钩子了

在News中进行使用

```js
activated() {
    this.timer = setInterval(() => {
      this.opacity -= 0.01;
      if (this.opacity <= 0) this.opacity = 1;
    }, 16);
  },
  deactivated() {
    clearInterval(this.timer);
  },
```

如果在这里activated没有生效

需要在Home.vue

在`router-view`外面包一层`keep-alive`

```vue
<keep-alive>
      <router-view></router-view>
    </keep-alive>
```

这样就可以生效了
总结：

1. 作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态
2. 具体名字：
	1. `activated`路由组件被激活时触发
	2. `deactivated`路由组件失活时触发



## 全局前置_路由守卫

路由守卫：保护路由的权限

配置全局前置路由守卫

配置前需要为路由配置名字,name

在router/index.js中进行

```js
const router = new VueRouter({
    routes:[
        {
            name:'guanyu',
            path:'/about',
            component:About
            
        },
        {
            name:'zhuye',
            path:'/home',
            component:Home,
            children:[
                {
            path:'news',
            component:News
        },
        {
            name:'xiaoxi',
            path:'message',
            component:Message,
            children:[
                {
                    name:'guanyu',
                    path:'detail',
                    component:Detail,
                    props($route){
                        return{
                            id:$route.query.id,
                            title:$route.query.title
                        }
                    }
                }
            ]
        }
            ]
        },
        
    ]
})

export default router
```

配置完name后，就要进行路由守卫的配置了

路由守卫非常给力啊

```js
// 全局前置路由
// 全局前置路由的意思是在每一次路由切换前被调用
// 初始化时被调用
router.beforeEach((to,from,next)=>{
    // to:去哪(给出了目标路由的信息)
    // from:来自哪
    // next:放行,如果不使用next，是不会前往下一个页面的
    if (to.name == 'zhuye'){
        // 动态的决定是否放行,可以通过to.xxx来进行判断
        next()
    }
    else alert("无权限")
    
})
```

## 全局后置_路由守卫

如果想在路由中添加一些自定义的数据，可以放在路由的meta属性中

假如我们想为message添加单独的权限，就可以考虑在路由的meta属性中添加对应的一个判断属性

```js
name:'xiaoxi',
            path:'message',
            component:Message,
            meta:{
                isAuth:true
            },
```

在前置路由被调用时，增加对应的方法

```js
// 全局前置路由
// 全局前置路由的意思是在每一次路由切换前被调用
// 初始化时被调用
router.beforeEach((to,from,next)=>{
    // to:去哪(给出了目标路由的信息)
    // from:来自哪
    // next:放行,如果不使用next，是不会前往下一个页面的
    
    // 只有在isAuth存在时，才会拦截
    if (!to.meta.isAuth){
        // 动态的决定是否放行,可以通过to.xxx来进行判断
        next()
    }
    else alert("无权限")
    
})
```

有前置路由守卫，就有后置路由守卫

后置路由守卫是没有next的，因为后置路由守卫是路由调用后，才使用，所以没有next

```js
router.afterEach((to,from)=>{
    console.log("后置路由守卫")
})
```

通过后置路由守卫实现，当用户点击不同的组件时，切换不同的标题

<img src="https://s2.loli.net/2023/10/09/YsJr1QpqemfKHuU.png" alt="image-20231009091438632" style="zoom:50%;" />

先为router中的数据添加对应的标题title

```js
const router = new VueRouter({
    routes:[
        {
            name:'guanyu',
            path:'/about',
            component:About,
            meta:{title:'关于'}
        },
        {
            name:'zhuye',
            path:'/home',
            component:Home,
            meta:{title:'主页'},
            children:[
                {
            path:'news',
            meta:{title:'新闻'},
            component:News
        },
        {
            name:'xiaoxi',
            path:'message',
            component:Message,
            meta:{
                isAuth:true,
                title:'消息'
            },
            children:[
                {
                    name:'guanyu',
                    path:'detail',
                    component:Detail,
                    props($route){
                        return{
                            id:$route.query.id,
                            title:$route.query.title
                        }
                    }
                }
            ]
        }
            ]
        },
        
    ]
})
```

接着在后置路由中添加对应的方法

```js
router.afterEach((to,from)=>{
    console.log("后置路由守卫")
    // 在根目录访问时左上角的标题是underfined，所以需要添加另一个条件
    // 当underfined时，标题为EW
    document.title = to.meta.title || 'EW'
})
```

测试，查看效果

总结:

1. 作用：对路由进行权限控制
2. 分类：全局守卫、独享守卫、组件内守卫



## 独享路由守卫

想针对某个组件做出限制

可以在组件内添加beforeEnter方法

独享路由守卫**只有前置**，没有后置

```js
{
            name:'guanyu',
            path:'/about',
            component:About,
            meta:{title:'关于'},
            beforeEnter:(to,from,next)=>{
                // 功能与全局路由守卫是一致的，只是变为了独享的
                alert("无权限")
            }
        },
```



## 组件内路由守卫

组件内路由守卫在组件内进行使用

这里选择About组件进行路由守卫的使用

```vue
<script>
export default {
  name: "About",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
  // 通过路由规则,进入该组件时被调用
  beforeRouteEnter(to, from, next) {
    alert("进入了About组件");
      next()
  },
  // 通过路由规则,离开该组件时被调用
  beforeRouteLeave(to, from, next) {
    alert("离开了About组件");
  },
};
</script>
```

记得把之前独享路由守卫的代码注释掉.......

这里如果不进行next是不能离开该组件的，只有进行next才能进行进入组件或离开组件

## history模式与hash模式

向服务器发送数据时，会传递一个地址，例如：`localhost/students/xxx/xxx`

这种地址相当于是history模式，地址后面的内容会一起传递给服务器

什么是hash模式呢，拿个地址举例：`localhost/students/#/xxx/xxx`

#相当于是hash模式，hash模式下，#后面的内容不会传递给服务器

路由中默认是hash模式

如果你想在路由中使用对应的模式，可以在router/index.js目录下进行路由的修改

使用`mode`对模式进行配置

```js
const router = new VueRouter({
    mode:'history',
    routes:[
        {   
            name:'guanyu',
            path:'/about',
            component:About,
            meta:{title:'关于'},
            // beforeEnter:(to,from,next)=>{
            //     // 功能与全局路由守卫是一致的，只是变为了独享的
            //     alert("无权限")
            // }
        },
        {
            name:'zhuye',
            path:'/home',
            component:Home,
            meta:{title:'主页'},
            children:[
                {
            path:'news',
            meta:{title:'新闻'},
            component:News,
        },
        {
            name:'xiaoxi',
            path:'message',
            component:Message,
            meta:{
                isAuth:true,
                title:'消息'
            },
            children:[
                {
                    name:'guanyu',
                    path:'detail',
                    component:Detail,
                    props($route){
                        return{
                            id:$route.query.id,
                            title:$route.query.title
                        }
                    }
                }
            ]
        }
            ]
        },
        
    ]
})
```

运行并测试，此时界面就有效果了，地址中就不会携带#

总结：

1. 对于一个url来说，什么是hash值？	——#及其后面的内容就是hash值
2. hash值不会包含在HTTP请求中，即：hash值不会带给服务器
3. hash模式：
	1. 地址中永远带着#号，不美观
	2. 若以后将地址通过第三方手机app分享，若app校验严格，则地址会标记为不合法
	3. 兼容性较好
4. history模式：
	1. 地址干净，美观
	2. 兼容性和hash模型相比略差
	3. 应用部署上线时需要后端人员的支持，解决页面服务端404的问题



# Vue UI组件库

## 移动端常用UI组件库

Vant：https://youzan.github.io/vant

Cube UI：https://didi.github.io/cube-ui

Mint UI：http://mint-ui.github.io

## PC端常用UI组件库

Element UI：https://element.eleme.cn

IView UI：https://www.iviewui.com

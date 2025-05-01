---
title: Vue3
date: 2024-03-11 21:35:33
tags: Vue
---

# 创建Vue3.0工程

## 使用vue-cli创建

官方文档：`https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create`

```sh
## 查看@vue/cli版本，确保@vue/cli版本在4.5.0以上
vue --version
## 安装或升级你的@vue/cli
npm i -g @vue/cli
## 创建
vue create you_project
## 启动
cd you_project
npm run serve
```

## 使用vite创建

vite官网：https://vitejs.cn

- 什么是vite？
	- 新一代前端构建工具
- 优势如下：
	- 开发环境中，无需打包操作，可快速的冷启动
	- 轻量快速的热重载（HMR）
	- 真正的按需编译，不再等待整个应用编译完成

```sh
## 创建工程
npm init vite-app <project-name>
## 进入工程目录
cd <project-name>
## 安装依赖
npm i
## 运行
npm run dev
```

# 常用 Composition API

## setup

1. 理解：Vue3.0中一个新的配置项，值为一个函数。
2. setup是所有<strong style="color:#DD5145">Composition API（组合API）</strong><i style="color:gray;font-weight:bold">“ 表演的舞台 ”</i>。
3. 组件中所用到的：数据、方法等等，均要配置在setup中。
4. setup函数的两种返回值：
	1. 若返回一个对象，则对象中的属性、方法, 在模板中均可以直接使用。（重点关注！）
	2. <span style="color:#aad">若返回一个渲染函数：则可以自定义渲染内容。（了解）</span>
5. 注意点：
	1. 尽量不要与Vue2.x配置混用
		- Vue2.x配置（data、methos、computed...）中<strong style="color:#DD5145">可以访问到</strong>setup中的属性、方法。
		- 但在setup中<strong style="color:#DD5145">不能访问到</strong>Vue2.x配置（data、methos、computed...）。
		- 如果有重名, setup优先。
	2. setup不能是一个async函数，因为返回值不再是return的对象, 而是promise, 模板看不到return对象中的属性。（后期也可以返回一个Promise实例，但需要Suspense和异步组件的配合）

先关闭vue3的语法检查

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false
})
```

通过setup来为模板产生属性

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
</template>

<script>
export default {
  name: "App",
  setup() {
    // 数据
    let name = "张三";
    let age = 18;

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my namis ${name}
      and age is for ${age}
      `);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      sayHello,
    };
  },
};
</script>
```

也可以返回渲染函数，返回渲染函数后，模板里编写的内容都会被覆盖掉

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
</template>

<script>
import { h } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = "张三";
    let age = 18;

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my namis ${name}
      and age is for ${age}
      `);
    }
    // 将对应的内容返回
    // return {
    //   name,
    //   age,
    //   sayHello,
    // };

    return () => h("h1", "Eastwind");
  },
};
</script>
```

当然，Vue3里也向下兼容Vue2的写法，但建议Vue2的配置和Vue3的配置不进行混用，因为Vue2可以读取Vue3的内容，Vue3读取不了Vue2的内容

当Vue2和Vue3冲突时，以Vue3的为主

## ref函数

- 作用: 定义一个响应式的数据
- 语法: ```const xxx = ref(initValue)``` 
	- 创建一个包含响应式数据的<strong style="color:#DD5145">引用对象（reference对象，简称ref对象）</strong>。
	- JS中操作数据： ```xxx.value```
	- 模板中读取数据: 不需要.value，直接：```<div>{{xxx}}</div>```
- 备注：
	- 接收的数据可以是：基本类型、也可以是对象类型。
	- 基本类型的数据：响应式依然是靠``Object.defineProperty()``的```get```与```set```完成的。
	- 对象类型的数据：内部 <i style="color:gray;font-weight:bold">“ 求助 ”</i> 了Vue3.0中的一个新函数—— ```reactive```函数。

### 处理基本类型

先精简一下之前的代码

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
</template>

<script>
import { h } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = "张三";
    let age = 18;

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my name is ${name}
      and age is for ${age}
      `);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      sayHello,
    };
  },
};
</script>
```

此时，我们编写一个修改函数变量的方法

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
  <button @click="changeInfo">修改个人信息</button>
</template>

<script>
import { h } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = "张三";
    let age = 18;

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my name is ${name}
      and age is for ${age}
      `);
    }

    function changeInfo() {
      (name = "李四"), (age = 16);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      sayHello,
      changeInfo,
    };
  },
};
</script>
```

进行测试，会发现值变了，页面没有变化，它不是响应式的

将值变为响应式，需要通过ref函数

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
  <button @click="changeInfo">修改个人信息</button>
</template>

<script>
import { h, ref } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = ref("张三");
    let age = ref(18);

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my name is ${name}
      and age is for ${age}
      `);
    }

    function changeInfo() {
      (name.value = "李四"), (age.value = 16);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      sayHello,
      changeInfo,
    };
  },
};
</script>
```

此时页面的数据也成功被修改了

为什么这里修改值是xxx.value的形式呢，我们可以打印一下这里的name和age看一下

![image-20240312092907699](https://s2.loli.net/2024/03/12/7sluUWqNP5hywmS.png)

此时就有了一个ref对象，通过这里的ref.value就可以修改对应的值了

而在模板里却不需要xxx.value，这是因为模板中的ref对象都会自动.value

### 处理对象类型

添加对应的对象类型，并显示

通过Ref获取到对应的对象，再直接通过变量名获取对应的变量值

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="sayHello">233</button>
  <button @click="changeInfo">修改个人信息</button>
  <h3>工作种类{{ job.type }}</h3>
  <h3>工资{{ job.salary }}</h3>
</template>

<script>
import { h, ref } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = ref("张三");
    let age = ref(18);
    let job = ref({
      type: "前端工程师",
      salary: 666,
    });

    // 方法
    function sayHello() {
      // 这里可以直接使用是因为作用域的关系
      alert(`my name is ${name}
      and age is for ${age}
      `);
    }

    function changeInfo() {
      job.value.type = "UI设计师";
      (name.value = "李四"), (age.value = 16);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      sayHello,
      changeInfo,
      job,
    };
  },
};
</script>
```

## reactive函数

- 作用: 定义一个<strong style="color:#DD5145">对象类型</strong>的响应式数据（基本类型不要用它，要用```ref```函数）
- 语法：```const 代理对象= reactive(源对象)```接收一个对象（或数组），返回一个<strong style="color:#DD5145">代理对象（Proxy的实例对象，简称proxy对象）</strong>
- reactive定义的响应式数据是“深层次的”。
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作。

通过reactive可以更方便的定义对象响应式数据

```vue
 let job = reactive({
      type: "前端工程师",
      salary: 666,
    });
 function changeInfo() {
      job.type = "UI设计师";
      (name.value = "李四"), (age.value = 16);
    }
```

不再需要xxx.value获取

如果我们想让数组也作为响应式数据，该怎么办呢

```vue
<template>
  <h1>一个人的信息{{ name }},年龄{{ age }}</h1>
  <button @click="changeInfo">修改个人信息</button>
  <h3>工作种类{{ job.type }}</h3>
  <h3>工资{{ job.salary }}</h3>
  <h3>{{ a }}</h3>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  name: "App",
  setup() {
    // 数据
    let name = ref("张三");
    let age = ref(18);
    let job = reactive({
      type: "前端工程师",
      salary: 666,
    });
    const a = reactive([1, 2, 3, 4]);

    function changeInfo() {
      a[0] = 667;
      job.type = "UI设计师";
      (name.value = "李四"), (age.value = 16);
    }
    // 将对应的内容返回
    return {
      name,
      age,
      changeInfo,
      job,
      a,
    };
  },
};
</script>
```

在Vue3中，通过reactive创建的数组，直接修改里面的值也可以达到一个响应式的效果

## Vue3中的响应式原理

### vue2.x的响应式

- 实现原理：

	- 对象类型：通过```Object.defineProperty()```对属性的读取、修改进行拦截（数据劫持）。

	- 数组类型：通过重写更新数组的一系列方法来实现拦截。（对数组的变更方法进行了包裹）。

		```js
		Object.defineProperty(data, 'count', {
		    get () {}, 
		    set () {}
		})
		```

- 存在问题：

	- 新增属性、删除属性, 界面不会更新。
		- Vue2想解决该问题，可以通过`this.$set(this.xxx对象,'xx变量名','xx值')`，或者引入Vue，通过`Vue.set(this.xxx对象,'xx变量名','xx值')`
		- 删除可以通过$delete(this.xxx对象，'xx变量名')
		- 例：this.$delete(this.person，'sex')，删除当前的person对象中的sex变量值
	- 直接通过下标修改数组, 界面不会自动更新。
		- Vue2解决方法：`this.$set(this.xxx对象，索引，变量值)`或`this.对象.变量值.splice(被删除的索引值，删除几个，添加的值)`
		- 例：this.$set(this.person，0，'逛街')，为person对象的索引0位置修改为逛街

### Vue3.0的响应式

在Vue3中，就可以无视以上的情况，直接进行更新

```vue
<template>
  <h1>
    {{ person.name }}
    {{ person.list[0] }}
  </h1>
  <button @click="updateEveryColumn">Test</button>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  name: "App",
  setup() {
    const person = reactive({
      name: "zhangsan",
      sex: "boy",
      list: [1, 2, 3],
    });
    function updateEveryColumn() {
      person.name = "lisi";
      person.list[0] = 10;
    }

    return {
      person,
      updateEveryColumn,
    };
  },
};
</script>
```

这里需要使用到reactive，让其变成响应式，就方便了

- 实现原理: 

	- 通过Proxy（代理）:  拦截对象中任意属性的变化, 包括：属性值的读写、属性的添加、属性的删除等。

	- 通过Reflect（反射）:  对源对象的属性进行操作。

	- MDN文档中描述的Proxy与Reflect：

		- Proxy：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

		- Reflect：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

			```js
			new Proxy(data, {
				// 拦截读取属性值
			    get (target, prop) {
			    	return Reflect.get(target, prop)
			    },
			    // 拦截设置属性值或添加新属性
			    set (target, prop, value) {
			    	return Reflect.set(target, prop, value)
			    },
			    // 拦截删除属性
			    deleteProperty (target, prop) {
			    	return Reflect.deleteProperty(target, prop)
			    }
			})
			
			proxy.name = 'tom'   
			```

## reactive对比ref

-  从定义数据角度对比：
	-  ref用来定义：<strong style="color:#DD5145">基本类型数据</strong>。
	-  reactive用来定义：<strong style="color:#DD5145">对象（或数组）类型数据</strong>。
	-  备注：ref也可以用来定义<strong style="color:#DD5145">对象（或数组）类型数据</strong>, 它内部会自动通过```reactive```转为<strong style="color:#DD5145">代理对象</strong>。
-  从原理角度对比：
	-  ref通过``Object.defineProperty()``的```get```与```set```来实现响应式（数据劫持）。
	-  reactive通过使用<strong style="color:#DD5145">Proxy</strong>来实现响应式（数据劫持）, 并通过<strong style="color:#DD5145">Reflect</strong>操作<strong style="color:orange">源对象</strong>内部的数据。
-  从使用角度对比：
	-  ref定义的数据：操作数据<strong style="color:#DD5145">需要</strong>```.value```，读取数据时模板中直接读取<strong style="color:#DD5145">不需要</strong>```.value```。
	-  reactive定义的数据：操作数据与读取数据：<strong style="color:#DD5145">均不需要</strong>```.value```。

## setup的两个注意点

- setup执行的时机
	- 在beforeCreate之前执行一次，this是undefined。

- setup的参数
	- props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性。
	- context：上下文对象
		- attrs: 值为对象，包含：组件外部传递过来，但没有在props配置中声明的属性, 相当于 ```this.$attrs```。(attrs会接收props未接收的属性)
		- slots: 收到的插槽内容, 相当于 ```this.$slots```。
		- emit: 分发自定义事件的函数, 相当于 ```this.$emit```。

setup是早于beforeCreate执行的，且执行时this为undefined

示例

App.vue

```vue
<template>
  <HelloWorld @sayHello="hello" msg="666" name="张三">
    <!-- <a>test</a> -->
    <!-- 具名插槽 -->
    <template v-slot:test>
      <a href="">test</a>
    </template>
  </HelloWorld>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { reactive, ref } from "vue";
export default {
  name: "App",
  components: { HelloWorld },
  setup() {
    function hello(value) {
      console.log(value);
      alert(`666+${value}`);
    }
    return { hello };
  },
};
</script>
```

HelloWorld.vue

```vue
<template>
  <div>
    <button @click="test">点击测试emit</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["msg", "name"],
  emits: ["sayHello"],
  setup(props, context) {
    // console.log(props);  获取传入的props数据
    // console.log(context.attrs); 获取传入props但未接收的数据
    // 输出具名插槽时会带上名称
    console.log(context.slots); // 插槽
    function test() {
      // 参数1是方法名,参数2是参数值
      context.emit("sayHello", "测试");
    }
    return { test };
  },
};
</script>
```

## 计算属性与监视

### computed函数

- 与Vue2.x中computed配置功能一致

- 简写

	```vue
	<template>
	  <div>
	    <h1>信息</h1>
	    姓:<input placeholder="输入姓" v-model="person.firstName" /> 名:<input
	      placeholder="输入名"
	      v-model="person.lastName"
	    />
	    <h1>{{ person.fullName }}</h1>
	  </div>
	</template>
	
	<script>
	import { reactive, computed } from "vue";
	export default {
	  name: "HelloWorld",
	  setup(props, context) {
	    let person = reactive({
	      firstName: "张",
	      lastName: "三",
	    });
	    person.fullName = computed(() => {
	      return person.firstName + "-" + person.lastName;
	    });
	    return {
	      person,
	    };
	  },
	};
	</script>
	```

- 写法

	```js
	import {computed} from 'vue'
	
	setup(){
	    ...
		//计算属性——简写
	    let fullName = computed(()=>{
	        return person.firstName + '-' + person.lastName
	    })
	    //计算属性——完整
	    let fullName = computed({
	        get(){
	            return person.firstName + '-' + person.lastName
	        },
	        set(value){
	            const nameArr = value.split('-')
	            person.firstName = nameArr[0]
	            person.lastName = nameArr[1]
	        }
	    })
	}
	```

### watch函数

- 与Vue2.x中watch配置功能一致

- 两个小“坑”：

	- 监视reactive定义的响应式数据时：oldValue无法正确获取、强制开启了深度监视（deep配置失效）。

		**2024-3-16未解决oldValue无法正确获取的问题，依然无法正确获取oldValue**

	- 监视reactive定义的响应式数据中某个属性时：deep配置有效。

	```js
	//情况一：监视ref定义的响应式数据
	watch(sum,(newValue,oldValue)=>{
		console.log('sum变化了',newValue,oldValue)
	},{immediate:true})
	// 这里的immediate说明的是刚开始就进行监视
	// immediate这个对象的配置项还可以进行其他的配置
	
	//情况二：监视多个ref定义的响应式数据
	watch([sum,msg],(newValue,oldValue)=>{
		console.log('sum或msg变化了',newValue,oldValue)
	}) 
	
	/* 情况三：监视reactive定义的响应式数据
				若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！
				若watch监视的是reactive定义的响应式数据，则强制开启了深度监视 
	*/
	watch(person,(newValue,oldValue)=>{
		console.log('person变化了',newValue,oldValue)
	},{immediate:true,deep:false}) //此处的deep配置不再奏效
	
	//情况四：监视reactive定义的响应式数据中的某个属性
	watch(()=>person.job,(newValue,oldValue)=>{
		console.log('person的job变化了',newValue,oldValue)
	},{immediate:true,deep:true}) 
	
	//情况五：监视reactive定义的响应式数据中的某些属性
	watch([()=>person.job,()=>person.name],(newValue,oldValue)=>{
		console.log('person的job变化了',newValue,oldValue)
	},{immediate:true,deep:true})
	
	//特殊情况
	// 此处监视的是属性，所以deep有效
	// 如果不进行deep配置，deep将不生效
	watch(()=>person.job,(newValue,oldValue)=>{
	    console.log('person的job变化了',newValue,oldValue)
	},{deep:true}) //此处由于监视的是reactive定义的对象中的某个属性，所以deep配置有效
	```

### watch时value的问题

当我们在watch监听时，要对数据进行监控，我们监听ref的数据一般是这样的

```vue
 let t1 = ref("666");
 watch(t1, (newValue, oldValue) => {
      console.log(newValue, oldValue);
    });
```

而监听通过ref生成的对象是这样的

```vue
let person = ref({
      firstName: "张",
      lastName: "三",
    });
watch(person.value, (newValue, oldValue) => {
      console.log(newValue, oldValue);
    });    
```

使用了.value的形式就相当于拿到了里面的每一个属性

而为什么ref对象是通过.value的形式呢，如果里面有嵌套对象，ref只会监听浅层次的数据，而不会监听里面的嵌套对象，因为嵌套对象是调用了reactive的，与浅层数据不一致，当然，不通过value，也可以，需要添加deep配置项

```vue
watch(
      person,
      (newValue, oldValue) => {
        console.log(newValue, oldValue);
      },
      { deep: true }
    );
```

### watchEffect函数

- watch的套路是：既要指明监视的属性，也要指明监视的回调。

- watchEffect的套路是：不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性(使用了谁，就监视谁)。

- watchEffect有点像computed：

	- 但computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
	- 而watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值。

	```js
	//watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
	watchEffect(()=>{
	    const x1 = sum.value
	    const x2 = person.age
	    console.log('watchEffect配置的回调执行了')
	})
	```

## 生命周期

- Vue3.0中可以继续使用Vue2.x中的生命周期钩子，但有有两个被更名：
	- ```beforeDestroy```改名为 ```beforeUnmount```
	- ```destroyed```改名为 ```unmounted```
- Vue3.0也提供了 Composition API 形式的生命周期钩子，与Vue2.x中钩子对应关系如下：
	- `beforeCreate`===>`setup()`
	- `created`=======>`setup()`
	- `beforeMount` ===>`onBeforeMount`
	- `mounted`=======>`onMounted`
	- `beforeUpdate`===>`onBeforeUpdate`
	- `updated` =======>`onUpdated`
	- `beforeUnmount` ==>`onBeforeUnmount`
	- `unmounted` =====>`onUnmounted`

使用方法
在setup中使用

```
import { onBeforeMount } from "vue";
onBeforeMount(() => {
      console.log("onBeforeMount");
    });
```

组合式API优先级比配置项的高一些

## 自定义hook函数

- 什么是hook？—— 本质是一个函数，把setup函数中使用的Composition API进行了封装。

- 类似于vue2.x中的mixin。

- 自定义hook的优势: 复用代码, 让setup中的逻辑更清楚易懂。

## toRef

- 作用：创建一个 ref 对象，其value值指向另一个对象中的某个属性。
- 语法：```const name = toRef(person,'name')```
- 应用:   要将响应式对象中的某个属性单独提供给外部使用时。


- 扩展：```toRefs``` 与```toRef```功能一致，但可以批量创建多个 ref 对象，语法：```toRefs(person)```

toRef用法：

浅层次数据

```vue
<template>
  <div>
    <h1>{{ name }}</h1>
    <button @click="name + '@@'">更新名称</button>
  </div>
</template>

<script>
import { toRef, reactive } from "vue";
export default {
  name: "HelloWorld",
  setup(props, context) {
    function updateName() {
      person.name = "李四";
    }

    let person = reactive({
      name: "张三",
      age: 18,
    });
    let name = toRef(person, "name");
    return {
      name,
      updateName,
    };
  },
};
</script>
```

深层次数据

```vue
let person = reactive({
      name: "张三",
      age: 18,
      a: {
        b: {
          c: 1,
        },
      },
    });
    let name = toRef(person, "name");
    return {
      name,
      updateName,
      d: toRef(person.a.b, "c"),
    };
```

toRefs用法：

拆开对象，变为一个个的值

```vue
return {
      ...toRefs(person),
      updateName,
    };
```

# 其它 Composition API

## shallowReactive 与 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。

- 什么时候使用?
	-  如果有一个对象数据，结构比较深, 但变化时只是外层属性变化(对数据进行修改)===> shallowReactive。
	-  如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换(不会对对象数据进行修改) ===> shallowRef。

## readonly 与 shallowReadonly

- readonly: 让一个响应式数据变为只读的（深只读）。
- shallowReadonly：让一个响应式数据变为只读的（浅只读）。
- 应用场景: 不希望数据被修改时。

用法：

```vue
person = readonly(person);
```

## toRaw 与 markRaw

- toRaw：
	- 作用：将一个由```reactive```生成的<strong style="color:orange">响应式对象</strong>转为<strong style="color:orange">普通对象</strong>。
	- 仅能转换reactive的对象
	- 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- markRaw：
	- 作用：标记一个对象，使其永远不会再成为响应式对象。
	- 应用场景:
		1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
		2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。
		3. 往响应式对象身上添加数据后，该数据是响应式数据，通过markRaw可以让它变为非响应式数据

用法：

```vue
function showRawPerson() {
      let p = toRaw(person);
      console.log(p);
    }
```

```vue
function updateCar() {
      person.car.name = "233";
    }
    function updateName() {
      let car = { name: "无敌", price: 40 };
      // 对车辆标记了原始数据后,就不会再进行响应式了
      person.car = markRaw(car);
      console.log(person);
    }
```

## customRef

- 作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

- 实现防抖效果：

	```vue
	<template>
		<input type="text" v-model="keyword">
		<h3>{{keyword}}</h3>
	</template>
	
	<script>
		import {ref,customRef} from 'vue'
		export default {
			name:'Demo',
			setup(){
				// let keyword = ref('hello') //使用Vue准备好的内置ref
				//自定义一个myRef
	            // 这里的value是初始值
	            // 这里的delay是一个延迟值
				function myRef(value,delay){
					let timer
					//通过customRef去实现自定义
					return customRef((track,trigger)=>{
						return{
							get(){
								track() //告诉Vue这个value值是需要被“追踪”的
								return value
							},
	                        // newValue是修改的值
							set(newValue){
	                            // 在多次输入时,清除定时器,再次调用,产生防抖
								clearTimeout(timer)
								timer = setTimeout(()=>{
									value = newValue
									trigger() //告诉Vue去更新界面
								},delay)
							}
						}
					})
				}
				let keyword = myRef('hello',500) //使用程序员自定义的ref
				return {
					keyword
				}
			}
		}
	</script>
	```

	## provide 与 inject
	
	- 作用：实现<strong style="color:#DD5145">祖与后代组件间</strong>通信
	
	- 套路：父组件有一个 `provide` 选项来提供数据，后代组件有一个 `inject` 选项来开始使用这些数据
	
	- 具体写法：
	
		1. 祖组件中：
	
			```js
			setup(){
				......
			    let car = reactive({name:'奔驰',price:'40万'})
			    provide('car',car)
			    ......
			}
			```
	
		2. 后代组件中：
	
			```js
			setup(props,context){
				......
			    const car = inject('car')
			    return {car}
				......
			}
			```
	
	## 响应式数据的判断
	
	- isRef: 检查一个值是否为一个 ref 对象
	- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
	- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
	- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理

# Composition API 的优势

## Options API 存在的问题

使用传统OptionsAPI中，新增或者修改一个需求，就需要分别在data，methods，computed里修改 。

<div style="width:400px;height:370px;overflow:hidden;float:left">
    <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84e4e2c02424d9a99862ade0a2e4114~tplv-k3u1fbpfcp-watermark.image" style="width:300px;float:left" />
</div>



<div style="width:300px;height:370px;overflow:hidden;float:left">
    <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5ac7e20d1784887a826f6360768a368~tplv-k3u1fbpfcp-watermark.image" style="zoom:50%;width:560px;left" /> 
</div>



















## Composition API 的优势

我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。

<div style="width:300px;height:340px;overflow:hidden;float:left">
    <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0be8211fc54b6c941c036791ba4efe~tplv-k3u1fbpfcp-watermark.image"style="height:360px"/>
</div>
<div style="width:330px;height:340px;overflow:hidden;float:left">
    <img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cc55165c0e34069a75fe36f8712eb80~tplv-k3u1fbpfcp-watermark.image"style="height:360px"/>
</div>


















# 新的组件

## Fragment

- 在Vue2中: 组件必须有一个根标签
- 在Vue3中: 组件可以没有根标签, 内部会将多个标签包含在一个Fragment虚拟元素中
- 好处: 减少标签层级, 减小内存占用

## Teleport

- 什么是Teleport？—— `Teleport` 是一种能够将我们的<strong style="color:#DD5145">组件html结构</strong>移动到指定位置的技术。

	```vue
	<teleport to="移动位置">
	   <!-- 组件结构 --> 
		<div v-if="isShow" class="mask">
			<div class="dialog">
				<h3>我是一个弹窗</h3>
				<button @click="isShow = false">关闭弹窗</button>
			</div>
		</div>
	</teleport>
	```

## Suspense

- 等待异步组件时渲染一些额外内容，让应用有更好的用户体验

- 使用步骤：

	- 异步引入组件

		```js
		import {defineAsyncComponent} from 'vue'
		const Child = defineAsyncComponent(()=>import('./components/Child.vue'))
		```

	- 使用```Suspense```包裹组件，并配置好```default``` 与 ```fallback```

		```vue
		<template>
			<div class="app">
				<h3>我是App组件</h3>
				<Suspense>
					<template v-slot:default>
						<Child/>
					</template>
					<template v-slot:fallback>
						<h3>加载中.....</h3>
					</template>
				</Suspense>
			</div>
		</template>
		```

# 其他

## 全局API的转移

- Vue 2.x 有许多全局 API 和配置。

	- 例如：注册全局组件、注册全局指令等。

		```js
		//注册全局组件
		Vue.component('MyButton', {
		  data: () => ({
		    count: 0
		  }),
		  template: '<button @click="count++">Clicked {{ count }} times.</button>'
		})
		
		//注册全局指令
		Vue.directive('focus', {
		  inserted: el => el.focus()
		}
		```

- Vue3.0中对这些API做出了调整：

	- 将全局的API，即：```Vue.xxx```调整到应用实例（```app```）上

		| 2.x 全局 API（```Vue```） | 3.x 实例 API (`app`)                        |
		| ------------------------- | ------------------------------------------- |
		| Vue.config.xxxx           | app.config.xxxx                             |
		| Vue.config.productionTip  | <strong style="color:#DD5145">移除</strong> |
		| Vue.component             | app.component                               |
		| Vue.directive             | app.directive                               |
		| Vue.mixin                 | app.mixin                                   |
		| Vue.use                   | app.use                                     |
		| Vue.prototype             | app.config.globalProperties                 |

## 其他改变

- data选项应始终被声明为一个函数。

- 过度类名的更改：

	- Vue2.x写法

		```css
		.v-enter,
		.v-leave-to {
		  opacity: 0;
		}
		.v-leave,
		.v-enter-to {
		  opacity: 1;
		}
		```

	- Vue3.x写法

		```css
		.v-enter-from,
		.v-leave-to {
		  opacity: 0;
		}
		
		.v-leave-from,
		.v-enter-to {
		  opacity: 1;
		}
		```

- <strong style="color:#DD5145">移除</strong>keyCode作为 v-on 的修饰符，同时也不再支持```config.keyCodes```

- <strong style="color:#DD5145">移除</strong>```v-on.native```修饰符

	- 父组件中绑定事件

		```vue
		<my-component
		  v-on:close="handleComponentEvent"
		  v-on:click="handleNativeClickEvent"
		/>
		```

	- 子组件中声明自定义事件

		```vue
		<script>
		  export default {
		    emits: ['close']
		  }
		</script>
		```

- <strong style="color:#DD5145">移除</strong>过滤器（filter）

	> 过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。

- ......


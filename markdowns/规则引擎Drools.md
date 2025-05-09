---
title: 规则引擎Drools
date: 2024-08-21 09:39:10
tags: Drools
---



# 规则引擎概述

某电商平台的促销活动，活动规则是根据⽤户购买订单的⾦额给⽤户送相应的积分，购买的越多送的积分越多用户购买的金额和对应送多少积分的规则如下：

| 规则编号 | 订单金额       | 奖励积分 |
| -------- | -------------- | -------- |
| 1        | 100元以下      | 不加分   |
| 2        | 100元 - 500元  | 加100分  |
| 3        | 500元 - 1000元 | 加500分  |
| 4        | 1000元以上     | 加1000分 |

思考：如何实现上面的业务逻辑呢？

我们最容易想到的就是使用分支判断(if else)来实现，例如通过如下代码来检查用户信息合法性：

```java
/**
 * 设置订单积分
 */
public void setOrderPoint(Order order){
    if (order.getAmout() <= 100){
        order.setScore(0);
    }else if(order.getAmout() > 100 && order.getAmout() <= 500){
        order.setScore(100);
    }else if(order.getAmout() > 500 && order.getAmout() <= 1000){
        order.setScore(500);
    }else{
        order.setScore(1000);
    }
}
```

通过上面的伪代码我们可以看到，需要在代码中写很多这样if else的代码。这种实现方式存在如下问题：

1、硬编码实现业务规则难以维护

2、硬编码实现业务规则难以应对变化

3、业务规则发生变化需要修改代码，重启服务后才能生效

 

那么面对上面的业务场景，还有什么好的实现方式吗？

此时我们需要引入规则引擎来帮助我们将规则从代码中分离出去，让开发人员从规则的代码逻辑中解放出来，把规则的维护和设置交由业务人员去管理。



**规则引擎**，全称为业务规则管理系统，英文名为BRMS（即Business Rule System）。规则引擎的主要思想是将应用程序中的业务决策部分分离出来，并使用预定义的语义模块编写业务决策（业务规则），由用户或开发者在需要时进行配置、管理。

需要注意的是规则引擎并不是一个具体的技术框架，而是指的一类系统，即业务规则管理系统。目前市面上具体的规则引擎产品有：drools、VisualRules、iLog等。

规则引擎实现了将业务决策从应用程序代码中分离出来，接收数据输入，解释业务规则，并根据业务规则做出业务决策。规则引擎其实就是一个输入输出平台。



系统中引入规则引擎后，业务规则不再以程序代码的形式驻留在系统中，取而代之的是处理规则的规则引擎，业务规则存储在规则库中，完全独立于程序。业务人员可以像管理数据一样对业务规则进行管理，比如查询、添加、更新、统计、提交业务规则等。业务规则被加载到规则引擎中供应用系统调用。

# Drools介绍

drools是一款由JBoss组织提供的基于Java语言开发的开源规则引擎，可以将复杂且多变的业务规则从硬编码中解放出来，以规则脚本的形式存放在文件或特定的存储介质中(例如存放在数据库中)，使得业务规则的变更不需要修改项目代码、重启服务器就可以在线上环境立即生效。

drools官网地址：https://drools.org/

drools源码下载地址：https://github.com/kiegroup/drools

# Drools入门案例

## 引入依赖

```xml
<!--drools相关依赖-->
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-core</artifactId>
            <version>${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-compiler</artifactId>
            <version>${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-decisiontables</artifactId>
            <version>${drools.version}</version>
        </dependency>
        <dependency>
            <groupId>org.drools</groupId>
            <artifactId>drools-mvel</artifactId>
            <version>${drools.version}</version>
        </dependency>
```

## 添加配置类

```java
package com.eastwind.config;

import org.kie.api.KieServices;
import org.kie.api.builder.*;
import org.kie.api.runtime.KieContainer;
import org.kie.internal.io.ResourceFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 规则引擎配置类
 */
@Configuration
public class DroolsConfig {

    private static final KieServices kieServices = KieServices.Factory.get();
    //制定规则文件的路径（通常在resources目录下）
    private static final String RULES_CUSTOMER_RULES_DRL = "rules/order.drl";

    @Bean
    public KieContainer kieContainer() {
        //获得Kie容器对象
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        kieFileSystem.write(ResourceFactory.newClassPathResource(RULES_CUSTOMER_RULES_DRL));

        KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
        kieBuilder.buildAll();

        KieModule kieModule = kieBuilder.getKieModule();
        KieContainer kieContainer = kieServices.newKieContainer(kieModule.getReleaseId());

        return kieContainer;
    }

}
```

**说明：**

- 定义了一个 `KieContainer`的`Spring Bean` ，`KieContainer`用于通过加载应用程序的`/resources`文件夹下的规则文件来构建规则引擎。
- 创建`KieFileSystem`实例并配置规则引擎并从应用程序的资源目录加载规则的 `DRL` 文件。
- 使用`KieBuilder`实例来构建 `drools` 模块。我们可以使用KieSerive单例实例来创建 `KieBuilder` 实例。
- 最后，使用 `KieService` 创建一个 `KieContainer` 并将其配置为 `spring bean`

## 创建业务相关实体类

```java
package com.eastwind.bean;

public class Order {

    private double amout;
    private double score;

    public double getAmout() {
        return amout;
    }

    public void setAmout(double amout) {
        this.amout = amout;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
```

## 创建规则文件

```java
//订单积分规则
package com.eastwind.order
import com.eastwind.bean.Order

//规则一：100元以下 不加分
rule "order_rule_1"
    when
        $order:Order(amout < 100)
    then
        $order.setScore(0);
        System.out.println("成功匹配到规则一：100元以下 不加分");
end

//规则二：100元 - 500元 加100分
rule "order_rule_2"
    when
        $order:Order(amout >= 100 && amout < 500)
    then
         $order.setScore(100);
         System.out.println("成功匹配到规则二：100元 - 500元 加100分");
end

//规则三：500元 - 1000元 加500分
rule "order_rule_3"
    when
        $order:Order(amout >= 500 && amout < 1000)
    then
         $order.setScore(500);
         System.out.println("成功匹配到规则三：500元 - 1000元 加500分");
end

//规则四：1000元以上 加1000分
rule "order_rule_4"
    when
        $order:Order(amout >= 1000)
    then
         $order.setScore(1000);
         System.out.println("成功匹配到规则四：1000元以上 加1000分");
end
```

接着ide提示我们，让我们安装一个插件drools，安装后有drools的提示

## 测试

```java
package com.eastwind;

import com.eastwind.bean.Order;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DroolsDemosApplicationTests {

    @Resource
    private KieContainer kieContainer;

    @Test
    public void test(){
        //从Kie容器对象中获取会话对象
        KieSession session = kieContainer.newKieSession();

        //Fact对象，事实对象
        Order order = new Order();
        order.setAmout(1300);

        //将Order对象插入到工作内存中
        session.insert(order);

        //激活规则，由Drools框架自动进行规则匹配，如果规则匹配成功，则执行当前规则
        session.fireAllRules();
        //关闭会话
        session.dispose();

        System.out.println("订单金额：" + order.getAmout() +
                "，添加积分：" + order.getScore());
    }

}
```

测试激活规则后，对应的情况是否有效

## 小结

drools规则引擎由以下三部分构成：

- Working Memory（工作内存）
- Rule Base（规则库）
- Inference Engine（推理引擎）

其中Inference Engine（推理引擎）又包括：

- Pattern Matcher（匹配器）     具体匹配哪一个规则，由这个完成
- Agenda(议程)
- Execution Engine（执行引擎）

如下图所示：

![image-20240821103633209](https://s2.loli.net/2024/08/21/SGarx5DOQmeu4XY.png)

### 相关概念说明

**Working Memory**：工作内存，drools规则引擎会从Working Memory中获取数据并和规则文件中定义的规则进行模式匹配，所以我们开发的应用程序只需要将我们的数据插入到Working Memory中即可，例如本案例中我们调用kieSession.insert(order)就是将order对象插入到了工作内存中。

**Fact**：事实，是指在drools 规则应用当中，将一个**普通的JavaBean插入到Working Memory后的对象**就是Fact对象，例如本案例中的Order对象就属于Fact对象。Fact对象是我们的应用和规则引擎进行数据交互的桥梁或通道。

**Rule Base**：规则库，我们在规则文件中定义的规则都会被加载到规则库中。

**Pattern Matcher**：匹配器，将Rule Base中的所有规则与Working Memory中的Fact对象进行模式匹配，匹配成功的规则将被激活并放入Agenda（议程）中。

**Agenda**：议程，用于存放通过匹配器进行模式匹配后被激活的规则。

**Execution Engine**：执行引擎，执行Agenda中被激活的规则。

### 规则引擎执行过程

![image-20240821103926700](https://s2.loli.net/2024/08/21/LAxS5OcuN1dwbVk.png)

### KIE介绍

我们在操作Drools时经常使用的API以及它们之间的关系如下图：

![image-20240821104100451](https://s2.loli.net/2024/08/21/Cd4E36RA9jJUt1S.png)

通过上面的核心API可以发现，大部分类名都是以Kie开头。**Kie全称为Knowledge Is Everything**，即"知识就是一切"的缩写，是Jboss一系列项目的总称。如下图所示，Kie的主要模块有OptaPlanner、Drools、UberFire、jBPM。

![image-20240821104106552](https://s2.loli.net/2024/08/21/jc3FB7uQro2hzfv.png)

通过上图可以看到，Drools是整个KIE项目中的一个组件，Drools中还包括一个Drools-WB的模块，它是一个可视化的规则编辑器。

# Drools基础语法

## 规则文件构成

在使用Drools时非常重要的一个工作就是编写规则文件，通常规则文件的后缀为.drl。

**drl是Drools Rule Language的缩写**。在规则文件中编写具体的规则内容。

一套完整的规则文件内容构成如下：

| 关键字   | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| package  | 包名，只限于逻辑上的管理，同一个包名下的查询或者函数可以直接调用 |
| import   | 用于导入类或者静态方法                                       |
| global   | 全局变量                                                     |
| function | 自定义函数                                                   |
| query    | 查询                                                         |
| rule end | 规则体                                                       |

Drools支持的规则文件，除了drl形式，还有Excel文件类型的。

## 规则体语法结构

规则体是规则文件内容中的重要组成部分，是进行业务规则判断、处理业务结果的部分。

规则体语法结构如下：

```java
rule "ruleName"
    attributes
    when
        LHS 
    then
        RHS
end
```

**rule**：关键字，表示规则开始，参数为规则的唯一名称。

**attributes**：规则属性，是rule与when之间的参数，为可选项。

**when**：关键字，后面跟规则的条件部分。

**LHS**(Left Hand Side)：是规则的条件部分的通用名称。它由零个或多个条件元素组成。**如果LHS为空，则它将被视为始终为true的条件元素**。  （左手边）

**then**：关键字，后面跟规则的结果部分。

**RHS**(Right Hand Side)：是规则的后果或行动部分的通用名称。 （右手边）

**end**：关键字，表示一个规则结束。

## 注释

在drl形式的规则文件中使用注释和Java类中使用注释一致，分为单行注释和多行注释。

单行注释用"//"进行标记，多行注释以"/*"开始，以"*/"结束。如下示例：

```drl
//规则rule1的注释，这是一个单行注释
rule "rule1"
    when
    then
        System.out.println("rule1触发");
end

/*
规则rule2的注释，
这是一个多行注释
*/
rule "rule2"
    when
    then
        System.out.println("rule2触发");
end
```

## Pattern模式匹配

前面我们已经知道了Drools中的匹配器可以将Rule Base中的所有规则与Working Memory中的Fact对象进行模式匹配，那么我们就需要在规则体的LHS部分定义规则并进行模式匹配。LHS部分由一个或者多个条件组成，条件又称为pattern。

**pattern的语法结构为：绑定变量名:Object(Field约束)**

其中绑定变量名可以省略，通常绑定变量名的命名一般建议以$开始。如果定义了绑定变量名，就可以在规则体的RHS部分使用此绑定变量名来操作相应的Fact对象。Field约束部分是需要返回true或者false的0个或多个表达式。

例如我们的入门案例中：

```java
//规则二：100元 - 500元 加100分
rule "order_rule_2"
    when
        $order:Order(amout >= 100 && amout < 500)
    then
         $order.setScore(100);
         System.out.println("成功匹配到规则二：100元 - 500元 加100分");
end
```

通过上面的例子我们可以知道，匹配的条件为：

1、工作内存中必须存在Order这种类型的Fact对象-----类型约束

2、Fact对象的amout属性值必须大于等于100------属性约束

3、Fact对象的amout属性值必须小于500------属性约束

以上条件必须同时满足当前规则才有可能被激活。



## 比较操作符

Drools提供的比较操作符，如下表：

| 符号         | 说明                                                         |
| :----------- | :----------------------------------------------------------- |
| <            | 小于                                                         |
| >            | 大于                                                         |
| >=           | 大于等于                                                     |
| <=           | 小于等于                                                     |
| ==           | 等于                                                         |
| !=           | 不等于                                                       |
| contains     | 检查一个Fact对象的某个属性值是否包含一个指定的对象值         |
| not contains | 检查一个Fact对象的某个属性值是否不包含一个指定的对象值       |
| memberOf     | 判断一个Fact对象的某个属性是否在一个或多个集合中             |
| not memberOf | 判断一个Fact对象的某个属性是否不在一个或多个集合中           |
| matches      | 判断一个Fact对象的属性是否与提供的标准的Java正则表达式进行匹配 |
| not matches  | 判断一个Fact对象的属性是否不与提供的标准的Java正则表达式进行匹配 |

前6个比较操作符和Java中的完全相同。



## Drools内置方法

规则文件的`RHS`部分的主要作用是通过**插入，删除或修改工作内存中的Fact数据**，来达到控制规则引擎执行的目的。Drools提供了一些方法可以用来操作工作内存中的数据，**操作完成后规则引擎会重新进行相关规则的匹配，**原来没有匹配成功的规则在我们修改数据完成后有可能就会匹配成功了。

### update方法

**update方法的作用是更新工作内存中的数据，并让相关的规则重新匹配。**   （要避免死循环）

参数：

```java
//Fact对象，事实对象
Order order = new Order();
order.setAmout(30);
```

规则：

```java
//规则一：100元以下 不加分
rule "order_rule_1"
    when
        $order:Order(amout < 100)
    then
        $order.setAmout(150);
	    update($order) //update方法用于更新Fact对象，会导致相关规则重新匹配
        System.out.println("成功匹配到规则一：100元以下 不加分");
end

//规则二：100元 - 500元 加100分
rule "order_rule_2"
    when
        $order:Order(amout >= 100 && amout < 500)
    then
         $order.setScore(100);
         System.out.println("成功匹配到规则二：100元 - 500元 加100分");
end
```

当规则一重新匹配后，就会触发规则二，此时会打印规则二，也就是说，规则一和规则二的话都会打印

在更新数据时需要注意防止发生死循环。

### insert方法

insert方法的作用是向工作内存中插入数据，并让相关的规则重新匹配。

```java
//规则一：100元以下 不加分
rule "order_rule_1"
    when
        $order:Order(amout < 100)
    then
        Order order = new Order();
        order.setAmout(130);
        insert(order);      //insert方法的作用是向工作内存中插入Fact对象，会导致相关规则重新匹配
        System.out.println("成功匹配到规则一：100元以下 不加分");
end

//规则二：100元 - 500元 加100分
rule "order_rule_2"
    when
        $order:Order(amout >= 100 && amout < 500)
    then
         $order.setScore(100);
         System.out.println("成功匹配到	规则二：100元 - 500元 加100分");
end
```

### retract方法

**retract方法的作用是删除工作内存中的数据，并让相关的规则重新匹配。**

```java
//规则一：100元以下 不加分
rule "order_rule_1"
    when
        $order:Order(amout < 100)
    then
        retract($order)      //retract方法的作用是删除工作内存中的Fact对象，会导致相关规则重新匹配
        System.out.println("成功匹配到规则一：100元以下 不加分");
end
```

### 规则属性  attributes

前面我们已经知道了规则体的构成如下：

```java
rule "ruleName"
    attributes
    when
        LHS
    then
        RHS
end
```

Drools中提供的属性如下表(部分属性)：

| 属性名           | 说明                                               |
| :--------------- | :------------------------------------------------- |
| salience         | 指定规则执行优先级                                 |
| dialect          | 指定规则使用的语言类型，取值为java和mvel           |
| enabled          | 指定规则是否启用                                   |
| date-effective   | 指定规则生效时间                                   |
| date-expires     | 指定规则失效时间                                   |
| activation-group | 激活分组，具有相同分组名称的规则只能有一个规则触发 |
| agenda-group     | 议程分组，只有获取焦点的组中的规则才有可能触发     |
| timer            | 定时器，指定规则触发的时间                         |
| auto-focus       | 自动获取焦点，一般结合agenda-group一起使用         |
| no-loop          | 防止死循环                                         |

重点说一下我们项目需要使用的属性

#### salience属性

salience属性用于指定规则的执行优先级，**取值类型为Integer**。**数值越大越优先执行**。每个规则都有一个默认的执行顺序，如果不设置salience属性，规则体的执行顺序为由上到下。

可以通过创建规则文件salience.drl来测试salience属性，内容如下：

```java
package com.order

rule "rule_1"
    when
        eval(true)
    then
        System.out.println("规则rule_1触发");
end
    
rule "rule_2"
    when
        eval(true)
    then
        System.out.println("规则rule_2触发");
end

rule "rule_3"
    when
        eval(true)
    then
        System.out.println("规则rule_3触发");
end
```



通过控制台可以看到，由于以上三个规则没有设置salience属性，所以执行的顺序是按照规则文件中规则的顺序由上到下执行的。接下来我们修改一下文件内容：

```java
package com.order

rule "rule_1"
    salience 9
    when
        eval(true)
    then
        System.out.println("规则rule_1触发");
end

rule "rule_2"
    salience 10
    when
        eval(true)
    then
        System.out.println("规则rule_2触发");
end

rule "rule_3"
    salience 8
    when
        eval(true)
    then
        System.out.println("规则rule_3触发");
end
```

通过控制台可以看到，规则文件执行的顺序是按照我们设置的salience值由大到小顺序执行的。

建议在编写规则时使用salience属性明确指定执行优先级。

#### no-loop属性

no-loop属性用于防止死循环，当规则通过update之类的函数修改了Fact对象时，可能使当前规则再次被激活从而导致死循环。取值类型为Boolean，默认值为false，测试步骤如下：

编写规则文件/resources/rules/activationgroup.drl

```java
//订单积分规则
package com.order
import com.atguigu.drools.model.Order

//规则一：100元以下 不加分
rule "order_rule_1"
    no-loop true         //防止陷入死循环
    when
        $order:Order(amout < 100)
    then
        $order.setScore(0);
        update($order)
        System.out.println("成功匹配到规则一：100元以下 不加分");
end
```

通过控制台可以看到，由于我们没有设置no-loop属性的值，所以发生了死循环。接下来设置no-loop的值为true再次测试则不会发生死循环。

### Drools高级语法

前面章节我们已经知道了一套完整的规则文件内容构成如下：

| 关键字   | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| package  | 包名，只限于逻辑上的管理，同一个包名下的查询或者函数可以直接调用 |
| import   | 用于导入类或者静态方法                                       |
| global   | 全局变量                                                     |
| function | 自定义函数                                                   |
| query    | 查询                                                         |
| rule end | 规则体                                                       |

#### global全局变量

global关键字用于在规则文件中**定义全局变量**，它可以让应用程序的对象在规则文件中能够被访问。可以用来为规则文件提供数据或服务。

语法结构为：**global 对象类型 对象名称**

在使用global定义的全局变量时有两点需要注意：

1、如果对象类型为**包装类型**时，在一个规则中改变了global的值，那么**只针对当前规则有效**，对其他规则中的global不会有影响。可以理解为它是当前规则代码中的global副本，规则内部修改不会影响全局的使用。

2、如果对象类型为**集合类型或JavaBean**时，在一个规则中改变了global的值，对java代码和所有规则都有效。

订单Order：

```java
package com.atguigu.drools.model;

public class Order {

    private double amout;

    public double getAmout() {
        return amout;
    }

    public void setAmout(double amout) {
        this.amout = amout;
    }

}
```

积分Integral：

```java
package com.atguigu.drools.model;

public class Integral {

    private double score;

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
```

规则文件：

```java
//订单积分规则
package com.order
import com.atguigu.drools.model.Order

global com.atguigu.drools.model.Integral integral;

//规则一：100元以下 不加分
rule "order_rule_1"
    no-loop true         //防止陷入死循环
    when
        $order:Order(amout < 100)
    then
        integral.setScore(10);
        update($order)
        System.out.println("成功匹配到规则一：100元以下 不加分");
end
```

测试：

```java
@Test
public void test1(){
    //从Kie容器对象中获取会话对象
    KieSession session = kieContainer.newKieSession();

    //Fact对象，事实对象
    Order order = new Order();
    order.setAmout(30);

    //全局变量
    Integral integral = new Integral();
    session.setGlobal("integral", integral);

    //将Order对象插入到工作内存中
    session.insert(order);

    //激活规则，由Drools框架自动进行规则匹配，如果规则匹配成功，则执行当前规则
    session.fireAllRules();
    //关闭会话
    session.dispose();

    System.out.println("订单金额：" + order.getAmout());
    System.out.println("添加积分：" + integral.getScore());
}
```




---
title: SpringBoot2基础篇
tags: SpringBoot2
date: 2023-9-07
---
# 小技巧（隐藏指定文件/文件夹）

SpringBoot每次创建时都会携带很多没啥用的文件，可以在设置中进行隐藏，不需要每次都删除

<img src="https://s2.loli.net/2023/09/07/gWt9GlHMcq7pPnm.png" alt="image-20230907143641453" style="zoom: 67%;" />

在设置中，可以进行配置

<img src="https://s2.loli.net/2023/09/07/BZTxtJoaEsRA6wy.png" alt="image-20230907144054936" style="zoom: 50%;" />

# SpringBoot简介

- SpringBoot是由Pivotal团队提供的全新框架，其设计目的是用来简化Spring应用的初始搭建以及开发过程
	- Spring的缺点
		- 依赖设置繁琐
		- 配置繁琐
	- SpringBoot的优点
		- 起步依赖（简化依赖配置）
		- 自动配置（简化常用工程相关配置）
		- 辅助功能（内置服务器，...）

## parent

有时候做项目，可能会导入两个相同的坐标，此时可以将它合并到一个文件中去，直接调用一个文件中的内容即可，但依然不太方便，springboot给出了优化的解决

<img src="https://s2.loli.net/2023/09/07/Q8D3YayVjGBcERp.png" alt="image-20230907151058582" style="zoom:50%;" />

它在pom.xml文件中继承了一个父类

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.15</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

而这里面又继承了一个父类

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-dependencies</artifactId>
  <version>2.7.15</version>
</parent>
```

点进去查看后，发现里面有很多的依赖，这些依赖也有设置了对应的版本，当我们使用某一个依赖时，它就会自动通过场景启动器里的`spring-boot-starter-parent`中的`spring-boot-dependencies`中写入的对应依赖，来自动设置最合适的版本，这样就不会因为版本不同而出现问题



总结：

1. 开发Springboot程序要继承spring-boot-starter-parent
2. spring-boot-starter-parent中定义了若干个依赖管理
3. 继承parent模块可以**避免**多个依赖使用相同技术时出现**依赖**版本**冲突**
4. 继承parent的形式也可以采用引入依赖的形式实现效果



## starter

- SpringBoot中常见项目名称，定义了当前项目使用的所有依赖坐标，以达到`减少依赖配置`的目的

实际开发

- 使用任意坐标时，仅书写GAV中的G和A，V（version）由SpringBoot提供，除非Springboot未提供对应版本的V
- 如发生坐标错误，再指定Version（要小心版本冲突）

1. 开发SpringBoot程序需要导入坐标时，通常导入对应的starter
2. 每个不同的starter根据功能不同，通常包含多个依赖坐标
3. 使用starter可以实现快速配置的效果，达到`简化配置`的目的



## 引导类

启动方式

```java
@SpringBootApplication
public class BootDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(BootDemoApplication.class, args);
    }

}
```

- SpringBoot的引导类是Boot工程的执行入口，运行main方法就可以启动项目
- SpringBoot工程运行后初始化Spring容器，扫描**引导类所在包**加载bean



## 内嵌Tomcat

Tomcat其实是依靠一个依赖引入进来的

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

点入该依赖中

这里内嵌了一个

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <version>2.7.15</version>
  <scope>compile</scope>
</dependency>
```

tomcat场景启动器的依赖，里面就有相关的tomcat配置

```xml
<groupId>org.apache.tomcat.embed</groupId>
<artifactId>tomcat-embed-core</artifactId>
<version>9.0.79</version>
```

`tomcat-embed-core`这个是tomcat的核心嵌入，里面依赖了它，才会有tomcat服务器，而如果，你不想用tomcat，你可以这样做

```xml
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
<!--            排除tomcat服务器，引入自己需要的服务器即可-->
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-tomcat</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
```



### 内置服务器

- tomcat(默认)：apache出品，应用面广，负载了若干较重的组件
- jetty：更轻量级，负载性能远不及tomcat
- undertow：负载性能**勉强**能跑赢tomcat



总结：

1. 内嵌Tomcat服务器是SpringBoot**辅助功能**之一
2. 内嵌Tomcat工作原理是将Tomcat服务器作为对象运行，并将该对象交给**Spring容器管理**
3. 变更内嵌服务器思想是去除现有服务器，添加全新的服务器



# REST风格开发

## REST简介

REST(Representtational State Transfer)，表现形式状态转换

- 传统风格资源描述形式
	- `http://localhost/user/getById?id=1`
	- `http://localhost/user/saverUser`
- REST风格描述形式
	- `http://localhost/user/1`
	- `http://localhost/user`
		- 优点：
			- 隐藏资源的访问行为，无法通过地址得知对资源是何种操作
			- 书写简化

按照REST风格访问资源时使用**行为动作**区分对资源进行了何种操作

- `http://localhost/users`		查询全部用户信息 GET （查询)
- `http://localhost/users/1`  	查询指定用户信息 GET （查询)
- `http://localhost/users ` 	添加用户信息 POST （新增/保存）
- `http://localhost/users` 	修改用户信息  PUT （修改/更新）
- ``http://localhost/users/1`  	删除用户信息  DELETE （删除）

- 根据REST风格对资源进行访问称为RESTful

注意事项：

上述行为是约定方式，约定不是规范，可以打破，所以称为REST风格，而不是REST规范

描述模块的名称通常使用复数，也就是加s的格式描述，表示此类资源，而非单个资源，比如：users、books、accounts.........

## 参数接收的注解介绍

`@RequestBody`：用于接收json数据

`@PathVariable`：用于接收url地址传参或表单传参

`@RequestParam`：用于接收路径参数，使用{参数名称}描述路径参数

应用：

- 后期开发中，发送请求参数超过1个时，以json为主，@RequestBody应用较广
- 如果发送非json格式数据，选用@RequestParam接收请求参数
- 采用RESTful进行开发，当参数数量较少时，例如1个，可以采用@PathVariable接收请求路径变量，通常用于传递id值

## RSET快速开发

编写测试代码

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class HelloController {

    // 查询全部
    @GetMapping("/hellos")
    public void getAll(){
        System.out.println("getAll");
    }

    // 查询单个
    @GetMapping("/hellos/{id}")
    public void getById(@PathVariable Integer id){
        System.out.println("getById"+id);
    }

    // 更新
    @PutMapping("/hellos")
    public void update(){
        System.out.println("更新");
    }

    // 保存
    @PostMapping("/hellos")
    public void save(){
        System.out.println("保存");
    }

    // 删除
    // 更新
    @DeleteMapping("/hellos/{id}")
    public void delete(@PathVariable Integer id){
        System.out.println("删除");
    }

}
```

优化了之前冗余的代码，并且有了一个相当好的风格



# 基础配置

一般的文件配置可以在application.properties中修改

修改服务器端口

```properties
# 服务器端口配置
server.port= 80
# 修改banner，这里off表示是关闭了
spring.main.banner-mode=off
# spring.banner.image.location=识别banner的图片位置

# 控制日志

# 日志级别
logging.level.root = info
```

- SpringBoot中导入对应的starter后，提供对应配置属性
- 书写SpringBoot配置采用关键字+提示形式书写



## 三种配置文件类型

SpringBoot提供了多种属性配置方式

- application.properties

	```properties
	server.port= 80
	```

- application.yml

	```yml
	server:
		port:81
	```

- application.yaml

	```yaml
	server:
		port:81
	```

配置文件之间的加载优先级

- properties（最高）
- yml
- yaml（最低）

不同配置文件中相同配置按照加载优先级相互覆盖，不同配置文件中的**不同配置**全部保留



## yml或yaml属性消失提示

按照步骤操作即可

<img src="https://s2.loli.net/2023/09/08/fc6lZJ3qGVThKtA.png" alt="image-20230908163529742" style="zoom: 50%;" />

<img src="https://s2.loli.net/2023/09/08/BAHEal4VmxJtIhw.png" alt="image-20230908163648643" style="zoom: 50%;" />



## yaml数据样式

YAML(YAML Ain't Markup Language)，一种数据序列化格式

优点：

- 容易阅读
- 容易与脚本语言交互
- 以数据为核心，重数据轻格式

YAML文件拓展名

- .yml
- .yaml

yaml语法规则

- 大小写敏感
- 属性层级关系使用多行描述，每行结尾使用冒号结束
- 使用缩进表示层级关系，同层级左侧对齐，只允许使用空格（不允许使用Tab键）
- 属性值前添加空格（属性名与属性值之间使用冒号+空格作为分隔）



核心规则：**数据前面要加空格与冒号隔开**

字面值的表示方式

![image-20230908170754388](https://s2.loli.net/2023/09/08/29xoM4ClyJQrnHf.png)

数组表示方式：在属性名书写位置的下方使用减号作为数据开始符号，每行书写一个数据，减号与数据空格分隔

![image-20230908170943814](https://s2.loli.net/2023/09/08/9cDzQ8PYZxAlERI.png)



## 读取yaml单一属性数据

application.yml

```yaml
server:
  port: 8080

count: "100"

likes:
  - game
  - games
  - games2
```

HelloController

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class HelloController {

//    读取yaml数据中的单一数据
    @Value("${server.port}")
    private String port;

//    读取多级数据
    @Value("${count}")
    private String count;

//    读取数组数据
    @Value("${likes[1]}")
    private String game;

//    读取对象数组(同样的道理)：对象名[第几个对象的索引].字段
    @GetMapping("/test")
    public String getPort(){
        System.out.println("端口号为+"+port);
        System.out.println("统计+"+count);
        System.out.println("game"+game);
        return "测试完成";
    }

}
```

使用@Value读取单个数据，属性名引用方式：${一级属性名.二级属性名......}



## yaml文件中的变量引用

application.yml

```yaml
baseDir: /var/lib

# 使用${属性名}引用数据
#tempDir: /var/lib/1
tempDir: ${baseDir}/1

# 引用的值为数组的情况
TestDir:
  - test1: /var/lib/1
  - test2: /var/lib/2
  - test3: /var/lib/3
    
UseDir: ${TestDir[0].test1}/test
```

HelloController

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class HelloController {

    @Value("${tempDir}")
    private String tempDir;

    @Value("${UseDir}")
    private String useDir;

//    读取对象数组(同样的道理)：对象名[第几个对象的索引].字段
    @GetMapping("/test")
    public String getPort(){
        System.out.println("temp"+tempDir);
        System.out.println("useDir = " + useDir);
        return "测试完成";
    }

}
```

运行测试

![image-20230909090455825](https://s2.loli.net/2023/09/09/KRgYqyn8DdJ9HES.png)

此时，这里也获取到了对应的数据

如果需要对代码转义，可以在上面加上字符串，下方的\t就会变为对应的转义字符

```yaml
UseDir: "${TestDir[0].test1}\test"
```

结果如下

```java
useDir = /var/lib/1	est
```



总结：

- 在配置文件中可以使用属性名引用方式引用属性
- 属性值如果出现转义字符，需要使用双引号包裹



## 读取yaml全部属性数据

创建一个`Environment`并将全部属性自动装配进去，通过`Environment.getProperty`来得到环境中对应的属性

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class HelloController {

    @Value("${tempDir}")
    private String tempDir;

    @Value("${UseDir}")
    private String useDir;

    @Autowired
    private Environment environment;
    

//    读取对象数组(同样的道理)：对象名[第几个对象的索引].字段
    @GetMapping("/test")
    public String getPort(){
        System.out.println("temp"+tempDir);
        System.out.println("useDir = " + useDir);
        System.out.println("------------------");
        System.out.println(environment.getProperty("tempDir"));
        System.out.println(environment.getProperty("UseDir"));
        return "测试完成";
    }

}
```



## 读取yaml引用数据类型数据

application.yaml

```yaml
# 创建类，用于封装下面的数据
# 由spring帮我们去加载数据到对象中
# 使用时，直接从spring中获取信息使用

datasource:
  driver: com.mysql.jdbc.Driver
  url: jdbc:mysql//localhost:db
  username: root
  password: root
```

模型类

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// 定义数据模型，封装yaml文件中对应的数据
// 定义为spring管控的bean
@Data
@Component
// 指定加载的数据
// @ConfigurationProperties("写入对应封装的对象名")
@ConfigurationProperties(prefix = "datasource")
public class MyDataSource {
    private String driver;
    private String url;

    private String username;

    private String password;
}
```

```java
import fun.eastwind.studyboot.MyDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
public class HelloController {

    @Autowired
    private MyDataSource myDataSource;

    @GetMapping("/test")
    public String getPort(){
        System.out.println(myDataSource);
        return "测试完成";
    }

}
```

测试得出结果

![image-20230909095906918](https://s2.loli.net/2023/09/09/a1JblMtNzgoyxSd.png)

# 整合第三方技术

## 整合Junit

步骤：

1、导入测试对应的starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

2、测试类使用@SpringBootTest修饰（一般都是默认自带的）

```java
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BootDemo2ApplicationTests {

    @Test
    void contextLoads() {
    }

}
```

3、使用自动装配（@Autowired）的形式添加要测试的对象



如果将测试类切换到其他的包下，不在初始的包下，会报错，原因是与引导类不在同一个包下

此时你需要在@SpringBootTest上添加

```java
@SpringBootTest(classes = BootDemo2Application.class)
```

指定对应的引导类，这样测试类就可以找到对应的引导类了

或者还有一种方法，与上面的方法是一样的效果

```java
@ContextConfiguration(classes = BootDemo2Application.class)
```



### 注解学习

名称：@SpringBootTest

类型：测试类注解

位置：测试类定义上方

作用：设置Junit加载的SpringBoot启动类

相关属性：

- classes：设置SpringBoot启动类

**注意：如果测试类在SpringBoot启动类的包或子包中，可以省略启动类的设置，也就是省略classes的设定**



## 整合MyBatis

- 核心配置：数据库连接相关信息（连什么？连谁？什么权限）
- 映射配置：SQL映射（XML/注解）

创建一个Spring Initializr项目

并勾选需要的MyBatis相关依赖

<img src="https://s2.loli.net/2023/09/09/jMEv6sayJGxzSHX.png" alt="image-20230909130337593" style="zoom: 50%;" />

在application.yml中编写对应配置

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/study
```

这里的配置改成自己的
创建实体类

```java
public class User {
    private Integer id;
    private String name;
    private String sex;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

编写Mapper

```java
import fun.eastwind.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {

    @Select("select * from studytable where id = #{id}")
    public User getUser(Integer id);
}
```

在测试类中进行测试

```java
import fun.eastwind.domain.User;
import fun.eastwind.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        User user = userMapper.getUser(1);
        System.out.println("user = " + user);
    }

}
```

测试后，发现没有问题，说明整合完成

### 整合MyBatis的小问题

1. MySQL8.x驱动强制要求设置时区
	- 修改url，添加serverTimezone设定
	- 修改MYSQL数据库配置（略）
2. 驱动类过时，提醒更换为com.mysql.cj.jdbc.Driver



## 整合MyBatisPlus

MyBtais-Plus与MyBatis的区别

- 导入坐标不同
- 数据层实现简化

由于MyBatisPlus未被Spring收录，这里只引入一个mysql的坐标

mybatisplus需要自己引入对应的坐标

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>
```

导入后，你可以将spring-boot-starter的依赖删除，因为mybatis-plus-boot-starter是包含着它的

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

application.yml

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/study
```

实体类

```java
public class User {
    private Integer id;
    private String name;
    private String sex;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                '}';
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }
}
```

UserMapper

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.eastwind.demo1.domain.User;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface UserMapper extends BaseMapper<User> {

}
```

测试类

```java
import fun.eastwind.demo1.domain.User;
import fun.eastwind.demo1.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class Demo1ApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        User user = userMapper.selectById(1);
        System.out.println("user = " + user);
    }

}
```

运行后，会出现一个错误`Cause: java.sql.SQLSyntaxErrorException: Table 'study.user' doesn't exist`

说是表不存在，为什么呢，因为MP（mybatisplus）会直接将实体类的名称小写后，作为表名

解决方法：为实体类直接添加表名

在实体类上方添加注解`@TableName("studytable")`，这样就可以指定表名了

此时，就查询得到结果了

`user = User{id=1, name='张三', sex='男'}`



## 整合Druid

druid的依赖包需要自己导入，在新建项目时勾选mybatis和mysql，因为druid是给数据库使用的

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/druid-spring-boot-starter -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.8</version>
</dependency>
```

配置与实体类，同整合mybatis与mybatisplus时相同

这里我使用的mybatisplus，所以引入一下依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>
```

配置方式：

1、直接在application.yml中编写

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/study
    type: com.alibaba.druid.pool.DruidDataSource
```

2、推荐使用第二种，虽然两种都行

```yaml
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      username: root
      password: 123456
      url: jdbc:mysql://localhost:3306/study
```

测试类

```java
import fun.eastwind.demo2.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class Demo2ApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        System.out.println("userMapper.selectById(1) = " + userMapper.selectById(1));
    }

}
```

查看打印结果

这里显示初始化数据源

![image-20230909143701462](https://s2.loli.net/2023/09/09/2ZLrncsFiwSQvpt.png)



# SSMP整合

SSMP（spring、springmvc、mybatisplus）



## 整合分析

- 实体类开发：使用Lombok快速制作实体类
- Dao开发：整合MyBatisplus，制作数据层测试类
- Service开发：基于MyBatisplus进行增量开发，制作业务层测试类
- Controller开发：基于Restful开发，使用PostMan测试接口功能，前后端开发协议制作
- 页面开发：基于VUE+ElementUI制作，前后端联调，页面数据处理，页面消息处理
	- 列表、新增、修改、删除、分页、查询
- 项目异常处理
- 按条件查询：页面功能调整、Controller修正功能、Service修正功能



## 模块创建

导入依赖

```xml
<dependencies>
        <!-- https://mvnrepository.com/artifact/com.alibaba/druid-spring-boot-starter -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.8</version>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.2</version>
        </dependency>
    </dependencies>
```

修改配置

application.yml

```yaml
server:
  port: 80
```



## 实体类开发

```java
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;

@TableName("studytable")
@Data
@AllArgsConstructor
public class User {
    private String name;
    private String sex;
}
```



## 数据层标准开发

修改配置

```yaml
server:
  port: 80

spring:
  datasource:
    druid:
      password: 123456
      username: root
      url: jdbc:mysql://localhost:3306/study
      driver-class-name: com.mysql.cj.jdbc.Driver
```

编写Mapper接口

```java
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.eastwind.module_practice.domain.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    
}
```

编写测试类

```java
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ModulePracticeApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
        userMapper.insert(new User("test","女"));
    }

}
```

测试一下，没啥问题

为MP添加一下id自增策略，不然后面可能会有问题，因为表中的id采用的是自增策略

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: auto
```



## 开启MP的运行日志

```yaml
mybatis-plus:
  global-config:
    db-config:
      id-type: auto
  configuration:
    # 标准输出
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

再次运行测试类，就可以在控制台看到打印的日志信息了



## 分页

创建拦截器

```java
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MPConfig {

    // 创建一个mybatisPlus的拦截器
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor(){
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页的拦截器
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        // 返回mybatisPlus的拦截器
        return interceptor;
    }

}
```

编写测试类

```java
@Test
void test2() {
    // page对象需要当前页和页码
    IPage page = new Page(1,5);
    // selectPage里需要一个page对象
    userMapper.selectPage(page, null);
}
```

<img src="https://s2.loli.net/2023/09/09/82bEljaGiwxtPyR.png" alt="image-20230909162052949" style="zoom:50%;" />

分页的方法

<img src="https://s2.loli.net/2023/09/09/6YnWDsgi9uaPMLx.png" alt="image-20230909161834629" style="zoom: 50%;" />

## 条件查询

使用QueryWrapper对象封装查询条件，推荐使用LambdaQueryWrapper对象，所有查询操作封装成方法调用

编写代码

```java
@Test
void test3() {
    // QueryWrapper是用来进行查询的
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    // like是进行模糊匹配
    queryWrapper.like("name","张");
    List<User> userList = userMapper.selectList(queryWrapper);
}
```

这里可以很明显的看到下面的语句是模糊查询

<img src="https://s2.loli.net/2023/09/09/vijF3tmngk5UE9N.png" alt="image-20230909163349509" style="zoom:67%;" />

也可以使用另一种

```java
@Test
void test3() {
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    // 提升了安全性，这样不会轻易的写错字段名之类的
    queryWrapper.like(User::getName,"张");
    List<User> userList = userMapper.selectList(queryWrapper);
}
```

一般情况下，数据是由外界传递的，万一出现状况，数据传递出来一个Null，此时，就会出现问题，像这样的like匹配，就会将null传递过来，并由null进行模糊匹配（%null%）

queryWrapper这里可以添加一个condition（条件），在这个条件中就可以对null值进行判断了

```java
@Test
void test3() {
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    String name = "张";
    // 提升了安全性，这样不会轻易的写错字段名之类的
    // 当name不为空时，才进行模糊匹配
    queryWrapper.like(name != null,User::getName,name);
    List<User> userList = userMapper.selectList(queryWrapper);
}
```

 

## 业务层开发

- Service层接口定义与数据层接口定义具有较大区别，不要混用
	- selectByUserNameAndPassword(String username,String password)
	- login(String username,String password)

UserService

```java
import fun.eastwind.module_practice.domain.User;

import java.util.List;

public interface UserService {
    Boolean save(User user);
    Boolean update(User user);
    Boolean delete(Integer id);
    User selectById(Integer id);
    List<User> selectAll();
}
```

进行数据库增删改操作时，会返回一个数值，如果数值为整数，说明操作成功，否则失败

```java
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.mapper.UserMapper;
import fun.eastwind.module_practice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public Boolean save(User user) {
        return userMapper.insert(user) > 0;
    }

    @Override
    public Boolean update(User user) {
        return userMapper.updateById(user) > 0;
    }

    @Override
    public Boolean delete(Integer id) {
        return userMapper.deleteById(id) > 0;
    }

    @Override
    public User selectById(Integer id) {
        return userMapper.selectById(id);
    }

    @Override
    public List<User> selectAll() {
        return userMapper.selectList(null);
    }
}
```

测试代码

```java
import fun.eastwind.module_practice.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void test1(){
        userService.save(new User("zhangsan","男"));
    }

}
```

没啥问题

刚刚少写了一个分页，再到service中进行编写
UserService

```java
IPage<User> page(int current, int pageSize);
```

UserServiceImpl

```java
@Override
public IPage<User> page(int current, int pageSize) {
    IPage iPage = new Page<User>(current,pageSize);
    return userMapper.selectPage(iPage,null);
}
```

测试一下

```java
@Test
public void test2(){
    userService.page(1,5);
}
```

 <img src="https://s2.loli.net/2023/09/10/bZzG46kaFL7Xh9e.png" alt="image-20230910130738572" style="zoom:67%;" />

这里对UserService的方法说明一下

```java
@Override
    public Boolean save(User user) {
        return userMapper.insert(user) > 0;
    }
```

为什么是判断是否大于0呢，因为这里操作成功后都是返回正值，而失败都是负值，测试一下，来看看效果

![image-20230910131130122](https://s2.loli.net/2023/09/10/IKFOVTXPfUcwGqH.png)

测试service可能不太明确，直接拿mapper来进行一个测试

```java
@Autowired
private UserMapper userMapper;

@Test
public void test3(){
    System.out.println("--------------------------------");
    System.out.println(userMapper.insert(new User("zhangsan", "男")));
    System.out.println("--------------------------------");
}
```

![image-20230910131317212](https://s2.loli.net/2023/09/10/x6O9pbQJnvqzG4Y.png)

这里发现成功后，会返回正值1，插入失败，通常会返回-1



## 业务层快速开发

快速开发方案

- 使用MyBatisPlus提供有业务层通用接口(IService<T>)与业务层通用实现类(ServiceImpl<M,T>)
- 使用通用类基础上做功能重载或功能追加
- 注意重载时不要覆盖原始操作，避免原始提供的功能丢失

IUserService

```java
import com.baomidou.mybatisplus.extension.service.IService;
import fun.eastwind.module_practice.domain.User;

public interface IUserService extends IService<User> {
}
```

IUserServiceImpl

```java
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.mapper.UserMapper;
import fun.eastwind.module_practice.service.IUserService;
import org.springframework.stereotype.Service;

@Service
public class IUserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {
}
```

测试代码

```java
import fun.eastwind.module_practice.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class IUserServiceTest {

    @Autowired
    private IUserService userService;

    @Test
    public void test1(){
        List<User> list = userService.list();
        for (User user : list) {
            System.out.println(user);
        }
    }

}
```

没啥问题

## 表现层标准开发

- 基于Restful进行表现层接口开发
- 使用Postman测试表现层接口功能

UserController

```java
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @GetMapping
    public List<User> getUsers() {
        return iUserService.list();
    }

}
```

在postman中测试一下，得到了查询的数据

<img src="https://s2.loli.net/2023/09/10/KOGFqQhUngcexEo.png" alt="image-20230910140359295" style="zoom: 50%;" />

接着补全一下其他的代码，方法就不测试了，效果都差不多

```java
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @GetMapping
    public List<User> getUsers() {
        return iUserService.list();
    }

    @PostMapping
    public Boolean save(@RequestBody User user) {
        return iUserService.save(user);
    }

    @PutMapping
    public Boolean update(@RequestBody User user){
        return iUserService.updateById(user);
    }

    @DeleteMapping("{id}")
    public Boolean delete(@PathVariable Integer id){
        return iUserService.removeById(id);
    }

    @GetMapping("{id}")
    public User getUser(@PathVariable Integer id){
        return iUserService.getById(id);
    }

}
```



总结：

1、基于Restful制作表现层接口

- 新增：POST
- 删除：DELETE
- 修改：PUT
- 查询：GET

2、接收参数

- 实体数据：@RequestBody
- 路径变量：@PathVariable

## 表现层消息的一致性处理

设置表现层返回结果的模型类，用于后端与前端进行数据格式统一，也称为**前后端数据协议**

Result(模型类)

模型类中的flag表示是否成功，data接收数据

```java
import lombok.Data;

@Data
public class Result {
    private Boolean flag;
    private Object data;

}
```

但是这样写，每次都需要set里面的flag和data

所以，进行一下优化

```java
import lombok.Data;

@Data
public class Result {
    private Boolean flag;
    private Object data;

    public Result() {
    }

    public Result(Boolean flag, Object data) {
        this.flag = flag;
        this.data = data;
    }

    public Result(Boolean flag) {
        this.flag = flag;
    }
}
```

编写控制类统一结果返回

```java
import fun.eastwind.module_practice.domain.User;
import fun.eastwind.module_practice.service.IUserService;
import fun.eastwind.module_practice.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService iUserService;

    @GetMapping
    public Result getUsers() {
        return new Result(true,iUserService.list());
    }

    @PostMapping
    public Result save(@RequestBody User user) {
        return new Result(iUserService.save(user));
    }

    @PutMapping
    public Result update(@RequestBody User user){
        return new Result(iUserService.updateById(user));
    }

    @DeleteMapping("{id}")
    public Result delete(@PathVariable Integer id){
        return new Result(iUserService.removeById(id));
    }

    @GetMapping("{id}")
    public Result getUser(@PathVariable Integer id){
        return new Result(true,iUserService.getById(id));
    }

}
```

## 统一异常处理

创建一个异常处理器

```java
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AllException {

    @ExceptionHandler
    public Result doException(Exception ex){
        ex.printStackTrace();
        return new Result("出现异常，请联系程序猿小哥为您服务");
    }

}
```

修改之前的Result对象（一致性处理的对象），出现异常被异常处理器拦截后，肯定会有提示信息，所以需要新增一个msg（消息）

```java
import lombok.Data;

@Data
public class Result {
    private Boolean flag;
    private Object data;

    private String msg;

    public Result(String msg) {
        this.flag = false;
        this.msg = msg;
    }

    public Result() {
    }

    public Result(Boolean flag, Object data) {
        this.flag = flag;
        this.data = data;
    }

    public Result(Boolean flag) {
        this.flag = flag;
    }
}
```

报个异常测试一下

![image-20230910165417121](https://s2.loli.net/2023/09/10/YT3BSvctsIhGKAD.png)

如果想要指定某些异常，可以在`@ExceptionHandler`后添加对应的异常类

```java
@ExceptionHandler(Exception.class)
public Result doException(Exception ex){
    ex.printStackTrace();
    return new Result("出现异常，请联系程序猿小哥为您服务");
}
```



总结：

1. 使用注解@RestControllerAdvice定义SpringMVC异常处理器来处理异常
2. 异常处理器必须被扫描加载，否则无法生效
3. 表现层返回结果的模型类中添加消息属性用来传递消息到页面中



## 基础篇完结

- pom.xml：配置起步依赖
- application.yml：设置数据源、端口、框架技术相关配置等
- mapper：继承BaseMapper、设置@Mapper注解
- mapper测试类
- service：调用数据层接口或MyBatis-Plus提供的接口快速开发
- service测试类
- controller：基于Restful开发，使用Postman测试跑通功能
- 页面：放置在resources目录下的static目录中




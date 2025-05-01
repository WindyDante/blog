---
title: SpringCloud
abbrlink: 96a41905
date: 2024-01-20 10:10:33
tags: 微服务
---

#  认识微服务

## 服务架构演变

### 单体架构

将业务的所有功能集中在一个项目中开发，打成一个包部署

优点：

- 架构简单
- 部署成本低

缺点：

- 耦合度高

当业务变得很多，就容易造成修改了一个业务，引起其他业务的崩溃这一情况

![image-20240120103219346](https://s2.loli.net/2024/01/20/NSthZvCH9o7aQRW.png)

### 分布式架构

根据业务功能对系统进行拆分，每个业务模块作为独立项目开发，称为一个服务

优点：

- 降低服务耦合
- 有利于服务升级拓展

虽然分布式架构降低了服务耦合性，但也带来了一些问题

- 服务拆分粒度如何？
- 服务集群地址如何维护？
- 服务之间如何实现远程调用？
- 服务健康状态如何感知？

![image-20240120103617722](https://s2.loli.net/2024/01/20/7cibE2MNmRaVPDe.png)

### 微服务

微服务是一种经过良好架构设计的分布式架构方案，微服务架构特征：

- 单一职责：微服务拆分粒度更小，每一个服务都有对应唯一的业务能力，做到单一职责，避免重复业务开发
- 面向服务：微服务对外暴露业务接口，暴露的业务接口需要统一
- 自治：团队独立、技术独立、数据独立、部署独立
- 隔离性强：服务调用做好隔离、容错、降级、避免出现级联问题(比如说，我去调用你的服务，结果你的服务宕机了，导致我的服务也挂了，需要处理这种特殊情况)

![image-20240120104745551](https://s2.loli.net/2024/01/20/nhoSW2H1MeFgVBb.png)

总结：

- 单体架构特点：
	- 简单方便，高度耦合，拓展性差，适合小型项目。例如：学生管理系统
- 分布式架构特点
	- 松耦合，拓展性好，但架构复杂，难度大。适合大型互联网项目，例如：京东、淘宝
- 微服务：一种良好的分布式架构方案
	- 优点：拆分粒度更小、服务更独立、耦合度更低
	- 缺点：架构非常复杂，运维、监控、部署难度提高

## 微服务结构

微服务这种方案需要技术框架来落地，全球的互联网公司都在积极尝试自己的微服务落地技术。在国内最知名的就是SpringCloud和阿里巴巴的Dubbo

微服务流程如下：

<img src="https://s2.loli.net/2024/01/20/LKNIgrktdMYnyx2.png" alt="image-20240120122621112" style="zoom:50%;" />

### 微服务技术对比

![image-20240120124115660](https://s2.loli.net/2024/01/20/7TqgLsaxkYJDK21.png)

### 企业需求

![image-20240120124144257](https://s2.loli.net/2024/01/20/A5VQwIZYx7DHzbX.png)

## 了解SpringCloud

- SpringCloud是目前国内使用最广泛的微服务框架。官网地址：https://spring.io/projects/spring-cloud
- SpringCloud集成了各种微服务功能组件，并基于SpringBoot实现了这些组件的自动装配，从而提供了良好的开箱即用体验：

<img src="https://s2.loli.net/2024/01/20/E8WQoGSuzsx5je7.png" alt="image-20240120124728679" style="zoom:50%;" />

# 服务拆分及远程调用

## 服务拆分

### 服务拆分注意事项

1. 不同微服务，不要重复开发相同业务
2. 微服务数据独立，不要访问其他微服务的数据库
3. 微服务可以将自己的业务暴露为接口，供其他微服务调用

### 服务拆分Demo

导入资料中提供的工程：cloud-demo

了解项目结构：

- cloud-demo
	- order-service
		- 根据id查询订单
	- user-service
		- 根据id查询用户

导入资料中对应的sql文件

修改不同模块下的mysql密码

启动两个模块，并访问网址查看是否访问成功

user-service：http://localhost:8081/user/1

order-service：http://localhost:8080/order/101

## 服务远程调用

根据订单id查询订单的同时，把订单所属的用户信息一起返回

访问之前的订单地址：http://localhost:8080/order/101

```json
{"id":101,"price":699900,"name":"Apple 苹果 iPhone 12 ","num":1,"userId":1,"user":null}
```

我们会发现缺失了对应的用户信息，这是因为订单模块中只能查询到订单相关的信息，而用户模块里只能查询用户相关信息

所以我们需要修改订单功能，当根据订单id查询订单信息时，还需要根据userId查询用户信息，但是它俩的数据库已经完全分离了，所以在订单模块查询订单相关信息时，无法查询到用户模块的用户信息

此时，就需要用到服务远程调用了

### 远程调用方式分析

远程调用方式流程

![image-20240120132517167](https://s2.loli.net/2024/01/20/2BAfO8kL9ayi3Rj.png)

#### 步骤

注册RestTemplate

在order-service的OrderApplication中注册RestTemplate

```java
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@MapperScan("cn.itcast.order.mapper")
@SpringBootApplication
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    /**
     * 创建RestTemplate 并注入Spring容器
     * */
    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

}
```

修改OrderService

```java
import cn.itcast.order.mapper.OrderMapper;
import cn.itcast.order.pojo.Order;
import cn.itcast.order.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);
        // 2.利用RestTemplate发起http请求,查询用户
        String url = "http://localhost:8081/user/"+order.getUserId();
        // restTemplate.getForObject(url, User.class):形参为url和返回后可自动反序列化的值
        User user = restTemplate.getForObject(url, User.class);
        // 3.存入order
        order.setUser(user);
        // 4.返回
        return order;
    }
}
```

重启Order服务

```json
{"id":101,"price":699900,"name":"Apple 苹果 iPhone 12 ","num":1,"userId":1,"user":{"id":1,"username":"柳岩","address":"湖南省衡阳市"}}
```

## 提供者和消费者

- 服务提供者：一次业务中，被其他微服务调用的服务。(提供接口给其他微服务)
- 服务消费者：一次业务中，调用其他微服务的服务。(调用其他微服务提供的接口)

假设：服务A调用服务B，服务B调用服务C，那么服务B是什么角色

服务B既是提供者，也是消费者

# Eureka注册中心

## 服务调用出现的问题

在刚才编写获取用户信息时，我们采用的是硬编码的方式来编写用户数据所对应服务的ip地址及端口号，这种硬编码的方式极为不友好，当出现多个用户集群时，该如何获取对应服务的ip地址及端口号呢，由此衍生出多个问题

- 服务消费者该如何获取服务提供者的地址信息？
- 如果有多个服务提供者，消费者该如何进行选择
- 消费者如何得知服务提供者的健康状态

## Eureka的作用

- eureka-server(注册中心)：记录和管理服务
- eureka-client(客户端)：包含服务消费者及服务提供者

Eureka的工作原理：

1. 服务提供者向eureka-server注册服务信息，并且进行心跳续约，默认每30秒一次
2. 当服务消费者需要时，从euraka-server(注册中心)中拉取对应的服务消费者的信息，并且进行负载均衡后，选中最为合适的服务消费者
3. 进行远程调用

假设某服务提供者宕机，由于心跳续约的情况，所以当服务提供者宕机后，不会出现当服务消费者调用对应服务提供者后意外的情况

![image-20240120140614231](https://s2.loli.net/2024/01/20/yEb3LxSKUNH19O4.png)

- 消费者该如何获取服务提供者具体信息？
	- 服务提供者启动时向eureka注册自己的信息
	- eureka保存这些信息
	- 消费者根据服务名称向eureka拉取提供者信息
- 如果有多个服务提供者，消费者该如何选择？
	- 服务消费者利用负载均衡算法，从服务列表中挑选一个
- 消费者如何感知服务提供者的健康状态？
	- 服务提供者会每隔30秒向EurekaServer发送心跳请求，报告健康状态
	- eureka会更新记录服务列表信息，心跳不正常会被剔除
	- 消费者就可以拉取到最新的信息

总结：

在Eureka架构中，微服务角色有两类：

- EurekaServer：服务端，注册中心
	- 记录服务信息
	- 心跳监控
- EurekaClient：客户端
	- Provider：服务提供者，例如案例中的user-service
		- 注册自己的信息到EurekaServer
		- 每隔30秒向EurekaServer发送心跳
	- consumer：服务消费者，例如案例中的order-service
		- 根据服务名称从EurekaServer拉取服务列表
		- 基于服务列表做负载均衡，选中一个微服务后发起远程调用

## 搭建Eureka服务

- 搭建EurekaServer
- 将user-service、order-service都注册到eureka
- 在order-service中完成服务拉取，然后通过负载均衡挑选一个服务，实现远程调用

新建一个空模块，导入对应依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
```

新建类EurekaApplication，并开启EurekaServer

```java
package cn.itcast.eureka;

/*
@author zhangJH
@create 2024-01-20-17:42
*/


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
// 开启EurekaServer
@EnableEurekaServer
public class EurekaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }

}
```

编写配置文件

```yaml
server:
  port: 10086 # 服务端口
spring:
  application:
    name: eurekaserver  # eureka微服务名称
eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
```

启动后可能会报错：`was unable to refresh its cache! This periodic background refresh will be retried in 30 seconds. status = Cannot execute request on any known server stacktrace = com.netflix.discovery.shared.transport.TransportException: Cannot execute request on any known server`

或报错：`Request execution error. endpoint=DefaultEndpoint{ serviceUrl='http://localhost:10086/eureka/}, exception=java.net.ConnectException: Connection refused: connect stacktrace=com.sun.jersey.api.client.ClientHandlerException: java.net.ConnectException: Connection refused: connect`

 以上两个问题，第一个是因为Eureka在启动的时候会获取其他服务的信息，获取不到会报这个异常。第二个是因为，Eureka会把自己当作一个服务注册在注册中心里面。以上两个异常都不会影响程序的正常运行。如果需要修复，需要在配置文件里面加入：

```yaml
server:
  port: 10086 # 服务端口
spring:
  application:
    name: eurekaserver  # eureka微服务名称
eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
    register-with-eureka: false   #Eureka不把自己注册为服务
    fetch-registry: false   #不拉取其他服务的信息
```

访问`http://localhost:10086/`，查看Eureka相关信息

![image-20240120181219175](https://s2.loli.net/2024/01/20/1wapnIjNCAxEiPu.png)

![image-20240120181348194](https://s2.loli.net/2024/01/20/ydYQW5FIXOz2Dos.png)

Eureka会将自身作为实例上传到注册中心，使用的名称就是之前在配置文件中的微服务名称及端口，微服务名称前面的是当前的计算机名称，也可以理解为localhost

![image-20240120181720311](https://s2.loli.net/2024/01/20/x53qDONtUMdVK2m.png)

## 服务注册

注册前需要引入Eureka客户端依赖

在user-service中引入

```xml
<!--        eureka客户端依赖-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

修改user-service的配置文件，为其添加eureka的客户端配置信息

- 需要添加spring.application.name和eureka的服务端信息

```yaml
spring:
  application:
    name: xxx  # 服务名称
eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
    register-with-eureka: false   #Eureka不把自己注册为服务
    fetch-registry: false   #不拉取其他服务的信息
```

user-service完整文件如下

```yaml
server:
  port: 8081
spring:
  application:
    name: userservice  # user-service名称
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_user?useSSL=false
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    cn.itcast: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS

eureka:
  client:
    service-url: # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
    register-with-eureka: false   #Eureka不把自己注册为服务
    fetch-registry: false   #不拉取其他服务的信息
```

同理，依照上述流程将order-service也存入eureka注册中心

注册成功后，结果如下：

![image-20240120184111096](https://s2.loli.net/2024/01/20/LIGMFEqkZ9a6Rjv.png)

这里只是启动了单个实例，如果想启动多个实例，可以将某个服务多次启动

为了避免端口冲突，需要修改端口设置

IDEA2022版本修改情况如下：

![image-20240120184534351](https://s2.loli.net/2024/01/20/6kKw9Vrun4X1IRN.png)

<img src="https://s2.loli.net/2024/01/20/K3SsVYCXAePub1v.png" alt="image-20240120184555031" style="zoom:50%;" />

在里面添加`-Dserver.port=8082`

复制之前的配置

<img src="https://s2.loli.net/2024/01/20/8JM43ovmIPEpgBF.png" alt="image-20240120193500352" style="zoom:50%;" />

接着将之前第一个UserService配置中的VM options删除

重新启动全部配置

回到之前Eureka的面板中，发现已经注册了多个服务了

![image-20240120193858460](https://s2.loli.net/2024/01/20/yOZqgRz8ikXlThn.png)

## 服务发现

在order-service中完成服务拉取

- 修改OrderService的代码，修改访问的url路径，用服务名代替ip、端口：

```java
import cn.itcast.order.mapper.OrderMapper;
import cn.itcast.order.pojo.Order;
import cn.itcast.order.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private RestTemplate restTemplate;

    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);
        // 2.利用RestTemplate发起http请求,查询用户
        // 将ip和端口修改为服务名称
        String url = "http://userservice/user/"+order.getUserId();
        // restTemplate.getForObject(url, User.class):形参为url和返回后可自动反序列化的值
        User user = restTemplate.getForObject(url, User.class);
        // 3.存入order
        order.setUser(user);
        // 4.返回
        return order;
    }
}
```

- 在order-service项目的启动类OrderApplication中的RestTemplate添加负载均衡注解

```java
/**
 * 创建RestTemplate 并注入Spring容器
 * */
@Bean
@LoadBalanced
public RestTemplate restTemplate(){
    return new RestTemplate();
}
```

重启OrderApplication的代码，并且访问一些地址进行测试

http://localhost:8080/order/101

http://localhost:8080/order/102

接着回到userApplication及另一个的日志中进行查看，看看是否进行了负载均衡的操作

总结：

1. 搭建EurekaServer
	- 引入eureka-server依赖
	- 添加@EnableEurekaServer注解
	- 在application.yml中配置eureka地址
2. 服务注册
	- 引入eureka-client依赖
	- 在application.yml中配置eureka地址
3. 服务发现
	- 引入eureka-client依赖
	- 在application.yml中配置eureka地址
	- 给RestTemplate添加@LoadBalanced注解
	- 用服务提供者的服务名称远程调用

# Ribbon负载均衡

## 负载均衡流程

Ribbon的大致流程

- 当服务消费者发起请求后，Ribbon会拦截下来，并拉取eureka-server所对应的服务，接着会返回服务列表，通过轮询的方式向某个服务提供者获取数据

![image-20240120200413257](https://s2.loli.net/2024/01/20/qd3FRioBHapDUQm.png)

Rabbon工作的详细流程如下：

1. 当服务消费者发起请求后，会被LoadBalancerInterceptor负载均衡拦截器所拦截
2. 在拦截器中，有一个RibbonLoadBanlancerClient会获取请求中的服务id，也就是userservice
3. 接着交给DynamicServerLoadBalancer做负载均衡，通过轮询或随机的方式得到服务的ip
4. 最终返回并修改url，并发起对应的请求

![image-20240120201615996](https://s2.loli.net/2024/01/20/iB1DgcSeQb9ylwJ.png)

## 负载均衡策略

Ribbon的负载均衡规则是一个叫做IRule的接口来定义的，每一个子接口都是一种规则：

![image-20240120202517709](https://s2.loli.net/2024/01/20/ZcajA5GCkrJHoXI.png)



![image-20240120202613860](https://s2.loli.net/2024/01/20/G7o1jeKQO4npk62.png)

通过定义IRule实现可以修改负载均衡规则，有两种方式：

- 代码方式（全体）：在服务消费者中的启动类中，定义一个新的IRule：

```java
@Bean
public IRule randomRule(){
    return new RandomRule();
}
```

- 配置文件方式（针对某个服务而言）：在服务消费者的application.yml文件中，添加新的配置也可以修改规则：

```yaml
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule  # 负载均衡规则
```

访问不同的ip及地址进行测试

http://localhost:8080/order/101

http://localhost:8080/order/102

http://localhost:8080/order/103

http://localhost:8080/order/104

## Ribbon饥饿加载

我们第一次访问http://localhost:8080/order/101这个地址的数据时，查看一下访问时间，发现会比较长，大概在几百毫秒的样子，再次访问后，会发现缩短到了几十毫秒的时间

因为Ribbon默认是采用懒加载，即第一次访问时才会去创建LoadBalanceClient，请求时间会很长。

而饥饿加载则会在项目启动时创建，降低第一次访问的耗时，通过下面配置开启饥饿加载：

```yaml
ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients: userservice # 指定开启饥饿加载的提供者
```

```yaml
ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients:  # 指定开启饥饿加载的提供者,数组形式添加
    	- userservice
```

总结：

1. Ribbon负载均衡规则
	- 规则接口是IRule
	- 默认实现是ZoneAvoidanceRule，根据zone选择服务列表，然后轮询
2. 负载均衡自定义方式
	- 代码方式：配置灵活，但修改时需要重新打包发布
	- 配置方式：直观，方便，无需重新打包发布，但是无法做全局配置
3. 饥饿加载
	- 开启饥饿加载
	- 指定饥饿加载的微服务名称

# Nacos注册中心

## Nacos的安装

### Windows安装

开发阶段采用单机安装即可。

在Nacos的GitHub页面，提供有下载链接，可以下载编译好的Nacos服务端或者源代码：

GitHub主页：https://github.com/alibaba/nacos

GitHub的Release下载页：https://github.com/alibaba/nacos/releases

如图：

![image-20240120220127259](https://s2.loli.net/2024/01/20/8hiln3VWj7HckbR.png)

本课程采用1.4.1.版本的Nacos，课前资料已经准备了安装包：

![image-20240120220136498](https://s2.loli.net/2024/01/21/yjl6u7cQOx1fI4G.png)

windows版本使用`nacos-server-1.4.1.zip`包即可。

接着将这个包解压到任意非中文目录下，如图：

![image-20240120220221987](https://s2.loli.net/2024/01/21/qrTSXG9LVsQu7MU.png)

目录说明：

- bin：启动脚本
- conf：配置文件

#### 端口配置

Nacos的默认端口是8848，如果你电脑上的其它进程占用了8848端口，请先尝试关闭该进程。

**如果无法关闭占用8848端口的进程**，也可以进入nacos的conf目录，修改配置文件中的端口：

![image-20240120220255643](https://s2.loli.net/2024/01/21/piGwD7gX3vNUAzf.png)

修改其中的内容：

![image-20240120220305743](https://s2.loli.net/2024/01/21/WUeKmojinQXE3zl.png)

#### 启动

启动非常简单，进入bin目录，结构如下：

![image-20240120220322299](https://s2.loli.net/2024/01/21/bVZ2YK8REpI6fQs.png)

然后执行命令即可：

- windows命令：

	```
	startup.cmd -m standalone
	```

接着在浏览器输入地址：http://127.0.0.1:8848/nacos即可

默认的账号和密码都是nacos

### Linux安装

#### 安装JDK

![image-20240120220547265](https://s2.loli.net/2024/01/21/KyvAQf3DYR8mj2k.png)

上传到某个目录，例如：`/usr/local/`

然后解压缩：

```sh
tar -xvf jdk-8u144-linux-x64.tar.gz
```

然后重命名为java

配置环境变量：

```sh
export JAVA_HOME=/usr/local/java
export PATH=$PATH:$JAVA_HOME/bin
```

设置环境变量：

```sh
source /etc/profile
```

#### 安装nacos

将对应的tar.gz上传到Linux服务器的某个目录，例如`/usr/local/src`目录下：

命令解压缩安装包：

```sh
tar -xvf nacos-server-1.4.1.tar.gz
```

然后删除安装包：

```sh
rm -rf nacos-server-1.4.1.tar.gz
```

端口配置与windows一致

在nacos/bin目录中，输入命令启动Nacos：

```sh
sh startup.sh -m standalone
```

## Nacos的依赖

父工程：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.5.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```



客户端：

```xml
<!-- nacos客户端依赖包 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

## 快速入门

为cloud-demo工程添加

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-alibaba-dependencies</artifactId>
    <version>2.2.5.RELEASE</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

在user-service中注释之前的eureka依赖

替换为对应的nacos

```xml
<!-- nacos客户端依赖包 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

修改user-service中的application.yml文件

添加了nacos的服务地址，端口对应着之前所安装的端口号

```yaml
server:
  port: 8081
spring:
  application:
    name: userservice  # user-service名称
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_user?useSSL=false
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848   # nacos服务地址
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    cn.itcast: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS

#eureka:
#  client:
#    service-url: # eureka的地址信息
#      defaultZone: http://localhost:10086/eureka
```

同样的方法，对order-service也进行修改

回到nacos页面，查看是否已经启动成功

![image-20240121092231332](https://s2.loli.net/2024/01/21/fPUF32dnZetR8TV.png)

这里我启动了一个order以及两个user

http://localhost:8080/order/101

http://localhost:8080/order/102

http://localhost:8080/order/103

http://localhost:8080/order/104

访问以下四个地址，查看负载均衡是否成功

总结：

1. Nacos服务搭建
	1. 下载安装包
	2. 解压
	3. 在bin目录下运行指令：startup.cmd -m standalone
2. Nacos服务注册或发现
	1. 引入nacos.discovery依赖
	2. 配置nacos地址spring.cloud.nacos.server-addr



## Nacos服务分级存储模型

在一个服务中，可以有多个实例，这多个实例，可能存放在一个机房，也可能存放在不同的机房内

以机房划分集群，例如a集群，b集群，每个集群下都有该服务的一些实例

这就形成了一个树形结构

- 服务
	- 集群
		- 实例

这相当于一个分级的存储模型，即使某集群出现问题也不会影响到其他的集群

<img src="https://s2.loli.net/2024/01/21/NKvR9lnWfAFb1MO.png" alt="image-20240121093811789" style="zoom:50%;" />

那么，如何来配置一个集群呢

以user-service为例

打开user-service的application.yml文件进行配置

```yaml
server:
  port: 8081
spring:
  application:
    name: userservice  # user-service名称
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_user?useSSL=false
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848   # nacos服务地址
      discovery:
        cluster-name: SH    # 集群名称,这里的SH代指上海
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    cn.itcast: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS

#eureka:
#  client:
#    service-url: # eureka的地址信息
#      defaultZone: http://localhost:10086/eureka
```

重新启动一个你想指定为SH集群的user-service的实例

接着修改`cluster-name`为HZ

重启另一个user-service的实例，不要全部重启了，重启你需要指定为HZ的实例即可

回到Nacos查看对应实例的`详情`

![image-20240121094630855](https://s2.loli.net/2024/01/21/SEdBoRehzNqxisC.png)

如果想要让服务消费者优先去寻找某个集群，也可以在application.yml中进行配置

在order-service中进行配置cluster-name

```yaml
server:
  port: 8080
spring:
  application:
    name: orderservice  # orderservice
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_order?useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    cn.itcast: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS

eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule  # 负载均衡规则

ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients: userservice
```

重启order-service，再次测试，发现依然是轮询机制，这是因为有负载均衡的存在所导致的，所以需要修改order-service的负载均衡规则

```yaml
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule  # 负载均衡规则
```

再次测试，此时会发现，仅在HZ的集群上操作了，并且是一种随机的形式

当我们将HZ的集群关闭，再次测试

此时依然有效，但访问的是SH的集群，且服务消费者的控制台会输出跨集群访问的地址信息

```shell
A cross-cluster call occurs，name = userservice, clusterName = HZ, instance = [Instance{instanceId='192.168.200.1#8082#SH#DEFAULT_GROUP@@userservice', ip='192.168.200.1', port=8082, weight=1.0, healthy=true, enabled=true, ephemeral=true, clusterName='SH', serviceName='DEFAULT_GROUP@@userservice', metadata={preserved.register.source=SPRING_CLOUD}}]
```

## 服务实例的权重设置

实际部署中会出现这样的场景：

- 服务器设备性能有差异，部分实例所在机器性能较好，另一些较差，我们希望性能好的机器承担更多的用户请求

Nacos提供了权重配置来控制访问频率，权重越大则访问频率越高

进入某个服务后，找到相关的集群

点击编辑

![image-20240121103530327](https://s2.loli.net/2024/01/21/U7OthIQPX1SG8rL.png)

在这里可以修改相应的权重

<img src="https://s2.loli.net/2024/01/21/VGleAMJCn9Ohw18.png" alt="image-20240121103545791" style="zoom:50%;" />

将你想修改的某个实例的权重进行修改后，就会影响其被访问的次数

当权重为0时，该服务不会被访问

总结：

- Nacos控制台可以设置实例的权重值，0~1之间
- 同集群内的多个实例，权重越高被访问的频率越高
- 权重设置为0完全不会被访问

## 环境隔离

Nacos中服务存储和数据存储的最外层都是一个名为namespace的东西，用来做最外层隔离

![image-20240121105056772](https://s2.loli.net/2024/01/21/kifLarqZA7oCz1h.png)

nacos有一个默认的namespace，是作为保留空间使用的，且默认服务都是存在于public上的

![image-20240121104733838](https://s2.loli.net/2024/01/21/mSoBqXfF4hxev7n.png)

![image-20240121104633682](https://s2.loli.net/2024/01/21/gsVTUv92PiA7HCu.png)

新建一个dev的命名空间

![image-20240121104918989](https://s2.loli.net/2024/01/21/PcovgIYT7CxbyEs.png)

回到服务列表，会发现public的旁边出现了一个dev的命名空间，但里面是空的

此时如果想进行环境隔离，将某个服务添加到dev中，需要回到配置文件进行配置

在order-service中，修改application.yml文件

添加namespace

```yaml
spring:
  application:
    name: orderservice  # orderservice
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_order?useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
        namespace: de2d245e-5b7a-4cf1-84a2-cf5ada88fb3c  # 命名空间的id
```

此时回到nacos的页面，会发现之前public中的order-service服务已经没了，在dev中存在着

此时，如果再次访问http://localhost:8080/order/101

会报错，因为它俩不是一个环境的，导致order-service中对于user-service的代码无法使用

总结：

- namespace用来做环境隔离
- 每个namespace都有唯一id
- 不同namespace下的服务不可见

## Nacos和Eureka的区别

### nacos注册中心细节分析

服务提供者在服务初始化时会注册服务信息给nacos注册中心，当服务消费者需要时，会定时拉取服务，并缓存到服务列表中，进行远程调用

nacos的心跳监测与eureka不同，nacos分为两种心跳监测，一种是临时实例，一种是非临时实例

- 临时实例所采用的是心跳监测，它主动向nacos发送心跳，让nacos感知他的存在，如果临时实例突然不发送心跳了，那么nacos会直接将它剔除，并主动推送变更消息给服务消费者，让服务消费者进行更新
- 非临时实例所采用的是nacos的主动询问，当nacos发现非临时实例宕机后，不会剔除，依然是主动推送变更消息给服务消费者，让服务消费者进行更新，并且nacos不会剔除该非临时实例，会等待它恢复健康

![image-20240121110422677](https://s2.loli.net/2024/01/21/wIPzaDcmAlQBo8J.png)

### 临时和非临时实例

服务注册到Nacos时，可以选择注册为临时或非临时实例，通过下面的配置来设置：

在order-sevice中进行设置并测试

```yaml
spring:
  application:
    name: orderservice  # orderservice
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_order?useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
        namespace: de2d245e-5b7a-4cf1-84a2-cf5ada88fb3c  # 命名空间的id
        ephemeral: false # true是设置为临时实例,false是设置为非临时实例
```

来到nacos中查看，此时发现该集群就不是临时实例了

![image-20240121111354389](https://s2.loli.net/2024/01/21/oQYvc6qxe7uI2Bf.png)

并且，当我们关闭order-service服务时，nacos中不会删除该服务，而是会等待该服务恢复健康，除非你手动删除该服务

总结：

1. Nacos域eureka的共同点
	1. 都支持服务注册和服务拉取
	2. 都支持服务提供者心跳方式做健康检测
2. Nacos域Eureka的区别
	1. Nacos支持服务端主动检测提供者状态：临时实例采用心跳模式，非临时实例采用主动检测模式
	2. 临时实例心跳不正常时会被剔除，非临时实例不会被剔除
	3. Nacos支持服务列表变更的主动消息推送模式，服务列表更新更及时
	4. Nacos集群默认采用AP方式，当集群中存在非临时实例时，采用CP模式；Eureka采用AP模式

# Nacos配置管理

## 统一配置管理

在更改配置后，通常是个很麻烦的事情，需要重启更改了配置的服务器让其重新读取配置，这一操作可以通过配置更改热更新来解决

<img src="https://s2.loli.net/2024/01/21/pXao3SHfK1uUWTr.png" alt="image-20240121132043939" style="zoom:50%;" />

来到nacos下的配置管理下的配置列表，点击最右侧的+号可以新建配置

<img src="https://s2.loli.net/2024/01/21/oLqywdf13vMjzEU.png" alt="image-20240121132854851" style="zoom:50%;" />

## 配置获取流程

![image-20240121133811938](https://s2.loli.net/2024/01/21/yFdbXrO3iVPWxpL.png)

在user-service中引入nacos的配置管理依赖，并且创建一个bootstrap.yml文件，并在里面写入nacos对应的参数

因为boostrap.yml文件的优先级高于application.yml，所以项目启动后，会先读取bootstrap中的内容，再从nacos中读取内容

```xml
<!-- nacos的配置管理依赖 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

创建bootstrap.yml文件

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev  # 环境
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
      config:
        file-extension: yaml  # 文件后缀名
```

编写UserController，通过@Value注解获取yml文件的值，看看是否能获取到nacos中的参数

```java
@Value("${pattern.dateformat}")
private String dateFormat;
```

如果dateformat加载成功，说明nacos中的参数成功加载了

```java
@GetMapping("/now")
public String now(){
    return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateFormat));
}
```

访问：http://localhost:8081/user/now，http://localhost:8082/user/now

如果被正确的格式化了，说明nacos中的参数加载成功了

总结：

将配置交给Nacos管理的步骤

1. 在Nacos中添加配置文件
2. 在微服务中引入nacos的config依赖
3. 在微服务中添加bootstrap.yml，配置nacos地址、当前环境、服务名称、文件后缀名。这些决定了程序启动时去nacos读取哪个文件

## 配置热更新

修改之前定义好的默认配置

```yaml
pattern:
    dateformat: yyyy年MM月dd日 HH:mm:ss
```

此时再次访问之前的请求地址，会发现没有发生变化，这是因为我们没有配置热更新

Nacos的配置文件变更后，微服务无需重启就可以感知。不过需要通过下面两种配置实现：

- 方式一：在@Value注入的变量所在类上添加注解@RefreshScope
- 方式二：使用@ConfigurationProperties注解

使用方式一

在刚才的UserController上添加@RefreshScope，重启服务

此时再次访问`http://localhost:8081/user/now`肯定是没问题的

接着再修改nacos关于user的配置

```yaml
pattern:
    dateformat: yyyy/MM/dd HH:mm:ss
```

直接访问相关路径：http://localhost:8081/user/now

此时已经发生了变化



使用方式二

新建一个类，在类中对属性进行配置

```java
package cn.itcast.user.config;

/*
@author zhangJH
@create 2024-01-21-15:22
*/


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
// 将prefix与dateformat结合后,可以获取到对应的参数值
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {

    private String dateformat;

}
```

修改UserController

将其修改为通过PatternProperties来获取的dateformat

```java
package cn.itcast.user.web;

import cn.itcast.user.config.PatternProperties;
import cn.itcast.user.pojo.User;
import cn.itcast.user.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequestMapping("/user")
// @RefreshScope
public class UserController {

    @Autowired
    private UserService userService;

//    @Value("${pattern.dateformat}")
//    private String dateFormat;

    @Autowired
    private PatternProperties patternProperties;

    @GetMapping("/now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(patternProperties.getDateformat()));
    }

    /**
     * 路径： /user/110
     *
     * @param id 用户id
     * @return 用户
     */
    @GetMapping("/{id}")
    public User queryById(@PathVariable("id") Long id) {
        return userService.queryById(id);
    }
}
```

总结：

Nacos配置更改后，微服务可以实现热更新，方式：

1. 通过@Value注解注入，结合@RefreshScope来刷新
2. 通过@ConfigurationProperties注入，自动刷新

注意事项：

- 不是所有配置都适合放到配置中心，维护起来比较麻烦
- 建议将一些关键参数，需要运行时调整的参数放到nacos配置中心，一般都是自定义配置

**在使用热更新时，推荐使用@ConfigurationProperties，因为其可以自动实现热更新，不需要通过两个注解来完成，更方便**

## 多环境配置共享

微服务启动时会从nacos读取多个配置文件：

- [spring.application.name]-[spring.profiles.active].yaml，例如：userservice-dev.yaml
- [spring.application.name].yml，例如：userservice.yaml

无论profile如何变化，[spring.application.name].yaml这个文件一定会加载，因此多环境共享配置可以写入这个文件

在nacos中添加一个配置

<img src="https://s2.loli.net/2024/01/21/FJsbfvUiZTB3pLq.png" alt="image-20240121160125354" style="zoom:50%;" />

在user-service中的PatternProperties类上添加属性

```java
private String envSharedValue;
```

为UserController添加一个获取对应参数的方法

```java
@GetMapping("props")
public PatternProperties patternProperties(){
    return patternProperties;
}
```

接着将其中一个UserApplication的环境切换为test，并重启

<img src="https://s2.loli.net/2024/01/21/8nAsDGxpHB9MLT4.png" alt="image-20240121160616837" style="zoom:50%;" />

此时，bootstrap.yml文件中存在如下内容

```yaml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev  # 环境
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
      config:
        file-extension: yaml  # 文件后缀名
```

在修改环境后的UserApplication中它无法读取到对应的userservice-dev.yaml，但是可以读取到userservice中的内容，因为这里的内容是共享的，只要是userservice中的服务都是可以被读取到的

此时我们访问对应的地址

这里我对8083做了修改，所以，8083是无法读取到相应参数的

http://localhost:8081/user/props

`{"dateformat":"yyyy/MM/dd HH:mm:ss","envSharedValue":"环境共享属性值"}`

http://localhost:8083/user/props

`{"dateformat":null,"envSharedValue":"环境共享属性值"}`

假设，这两个文件都存在着相同的属性，会以谁的为准呢？再假设，如果本地的IDEA中也存在着与这两个文件有着相同的属性的情况，会以谁的为准呢？

这里我先为本地添加一个属性，并在PatternProperties类上也进行同名添加

在user-service的application.yml中

```yaml
pattern:
  name: localEnv
```

```java
private String name;
```

接着重启user-service

访问：http://localhost:8081/user/props

此时展示的肯定是`localEnv`

接着我们为nacos中的userservice.yaml进行配置

```yaml
pattern:
    envSharedValue: 环境共享属性值
    name: envSharedValue
```

访问：http://localhost:8081/user/props

此时`{"dateformat":"yyyy/MM/dd HH:mm:ss","envSharedValue":"环境共享属性值","name":"envSharedValue"}`

值变成了`envSharedValue`，说明nacos中共享的userservice.yaml是大于本地配置的

接着我们为nacos中的userservice-dev.yaml进行配置

```yaml
pattern:
    dateformat: yyyy/MM/dd HH:mm:ss
    name: envDev
```

访问：http://localhost:8081/user/props

此时`{"dateformat":"yyyy/MM/dd HH:mm:ss","envSharedValue":"环境共享属性值","name":"envDev"}`

值变成了`envDev`，说明nacos中的userservice-dev.yaml是大于userservice.yaml的



多种配置的优先级

**服务名-profile(环境).yaml**	> **服务名.yaml**	>	**本地配置**

<img src="https://s2.loli.net/2024/01/21/OhPi2o5IyG36J8V.png" alt="image-20240121162459088" style="zoom:50%;" />

微服务会从nacos读取的配置文件：

1. [服务名]-[spring.profile.active].yaml，环境配置
2. [服务名].yaml，默认配置，多环境共享

优先级：**服务名-profile(环境).yaml**	> **服务名.yaml**	>	**本地配置**

## nacos集群搭建

我们之前一直使用的都是standalone(单机版)，但是在企业中不能使用这种，需要使用Nacos集群的方式，这里不详细讲述，单独使用一篇文章来说明

# http客户端Feign

## RestTemplate方式调用存在的问题

当一个url路径很长，参数很多时，我们想要发起请求就变得十分麻烦

<img src="https://s2.loli.net/2024/01/21/ewCNniQtWHZLI1k.png" alt="image-20240121202938838" style="zoom:50%;" />

这时候，就需要用到Feign了

## Feign的介绍

Feign是一个声明式的http客户端，官方地址：https://github.com/OpenFeign/feign

其作用就是帮助我们优雅的实现http请求的发送，解决上面提到的问题

为order-service[服务消费者]添加一个feign的客户端依赖

```xml
<!-- feign客户端依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
```

开启Feign客户端模式

```java
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@MapperScan("cn.itcast.order.mapper")
@SpringBootApplication
@EnableFeignClients		// 开启Feign客户端模式
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    /**
     * 创建RestTemplate 并注入Spring容器
     * */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

//    @Bean
//    public IRule randomRule(){
//        return new RandomRule();
//    }

}
```

编写对应的服务提供者的接口

```java
package cn.itcast.order.clients;

/*
@author zhangJH
@create 2024-01-21-20:55
*/


import cn.itcast.order.pojo.User;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("userservice")     // 声明-服务名称
public interface UserClient {

    @GetMapping("/user/{id}")
    User findById(@PathVariable("id") Long id);

}
```

记得将之前order-service中划分环境的application.yaml文件修改一下，将namespace注释掉，防止环境不一致的情况

```yaml
server:
  port: 8080
spring:
  application:
    name: orderservice  # orderservice
  datasource:
    url: jdbc:mysql://localhost:3306/cloud_order?useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: 123456
    driver-class-name: com.mysql.jdbc.Driver
  cloud:
    nacos:
      server-addr: localhost:8848
      discovery:
        cluster-name: HZ # 集群名称
#        namespace: de2d245e-5b7a-4cf1-84a2-cf5ada88fb3c  # 命名空间的id
        ephemeral: false # true是设置为临时实例,false是设置为非临时实例
mybatis:
  type-aliases-package: cn.itcast.user.pojo
  configuration:
    map-underscore-to-camel-case: true
logging:
  level:
    cn.itcast: debug
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS

eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://localhost:10086/eureka
userservice:
  ribbon:
    NFLoadBalancerRuleClassName: com.alibaba.cloud.nacos.ribbon.NacosRule  # 负载均衡规则

ribbon:
  eager-load:
    enabled: true # 开启饥饿加载
    clients: userservice
```

重启order-service服务

访问：http://localhost:8080/order/102

回到控制台会发现，不仅实现了发起请求的功能，还实现了负载均衡的功能

总结：

Feign的使用步骤

1. 引入依赖
2. 添加@EnableFeignClients注解
3. 编写FeignClient接口
4. 使用FeignClient中定义的方法代替RestTemplate(创建一个接口，其他几乎和RestFul风格的写法一致)

## Feign的自定义配置

![image-20240121221709570](https://s2.loli.net/2024/01/21/o89r5NbSUVOKxwt.png)

配置日志级别一般有两种方式：

方式一：配置文件方式

- 全局生效

```yaml
feign:
  client:
    config:
      default:
        logger-level: FULL  #全局配置最完整的日志
```

- 局部生效

```yaml
feign:
  client:
    config:
      userservice:  # 单独的为某个服务进行配置
        logger-level: FULL  #全局配置最完整的日志
```

方式二：Java代码方式，需要先声明一个Bean：

- 全局生效

在order-service中新建一个类`DefaultFeignConfiguration`，来作为自定义日志Bean

```java
import feign.Logger;
import org.springframework.context.annotation.Bean;

public class DefaultFeignConfiguration {

    @Bean
    public Logger.Level logLevel(){
        // 基本日志信息
        return Logger.Level.BASIC;
    }

}
```

接着在启动类上添加：**@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration.class)**

这是说明针对于全局生效的情况

- 局部生效(将配置类放到这个 Feign 客户端接口上的 `@FeignClient` 注解中)

```java
@FeignClient(value = "userservice",configuration = FeignClientProperties.FeignClientConfiguration.class)     // 声明-服务名称
```

总结：

Feign的日志配置

1. 方式一是配置文件，feign.client.config.xxx.loggerLevel
	1. 如果xxx是default则代表全局
	2. 如果xxx是服务名称，例如userservice则代表某服务
2. 方式二是java代码配置Logger.Level这个Bean
	1. 如果在@EnableFeignClients注解声明则代表全局
	2. 如果在@FeignClient注解中声明则代表某服务

## Feign的性能优化

Feign底层的客户端实现：

- URLConnection：默认实现，不支持连接池
- Apache HttpClient：支持连接池
- OKHttp：支持连接池



因此优化Feign的性能主要包括：

1. 使用连接池代替默认的URLConnection
2. 日志级别，最好用basic或none，日志级别过大也会拖慢Feign的性能

Feign添加HttpClient的支持：

引入依赖：

```xml
<!-- httpClient依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

配置连接池：

```yaml
feign:
  httpclient:
    enabled: true # 支持httpclient的开关
    max-connections: 200  # 最大连接数
    max-connections-per-route: 50 # 单个路径的最大连接数
```

总结：

Feign的优化：

1. 日志级别尽量用basic
2. 使用HttpClient或OKHttp代替URLConnection
	1. 引入feign-httpClient依赖
	2. 配置文件开启httpClient功能，设置连接池参数

## Feign的最佳实践

方式一（继承）：给消费者的FeignClient和提供者的controller定义统一的父接口作为标准

请看下图

下图是一个编写完成的UserAPI

客户端(消费者)来继承这个接口，作为客户端所需要发送的请求

而服务端(提供者)来实现该接口，在实现后的controller中实现业务

但官方也说明了：这个方法是一种紧耦合的情况，当接口被改变时，其他地方也需要有相应的改变，**且方法参数是不会被映射的**，也就是说，像@PathVariable long id这种参数，自己还需要重新再写一遍，无法直接使用形参

![image-20240122103204017](https://s2.loli.net/2024/01/22/V24kdXthCr8Jpme.png)

方式二（抽取）：将FeignClient抽取为独立模块，并且把接口有关的POJO、默认的Feign配置都放到这个模块中，提供给所有消费者使用

简单来说呢，就是将服务消费者所需要的FeignClient功能，抽取出来，放到一个单独的模块中，若服务消费者需要，就进行该模块的引用，直接调用该模块已经写好的方法即可

![image-20240122104104467](https://s2.loli.net/2024/01/22/Zv8jRpn6d9X3MqV.png)

## 实现Feign的最佳实践

实现Feign的最佳实践中的方法二

1. 首先创建一个module，命名为feign-api，然后引入feign的starter依赖
2. 将order-service(消费者)中编写的UserClient、User、DefaultFeignConfiguration都复制到feign-api项目中
3. 将order-service(消费者)中引入feign-api的依赖
4. 修改order-service(消费者)中的所有与上述三个组件有关的import部分，改成导入feign-api中的包
5. 重启测试

创建无需多言，我这里使用的是IDEA2022版本

<img src="https://s2.loli.net/2024/01/22/fcKH5sDZJWvzPdL.png" alt="image-20240122105045753" style="zoom:50%;" />

引入feign的依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

将order-service(消费者)中的UserClient、User、DefaultFeignConfiguration都复制到feign-api项目中

基本结构如下

![image-20240122105520368](https://s2.loli.net/2024/01/22/y3si89KHqtbdSjx.png)

再将order-service中之前复制走的内容删除，统一使用feign-api来操作

在order-service中的pom.xml中进行添加

```xml
<!--        引入feign的统一api-->
        <dependency>
            <groupId>cn.itcast.demo</groupId>
            <artifactId>feign-api</artifactId>
            <version>1.0</version>
        </dependency>
```

修改order-service中的局部代码

order

```java
package cn.itcast.order.pojo;

import cn.itcast.feign.pojo.User;
import lombok.Data;

@Data
public class Order {
    private Long id;
    private Long price;
    private String name;
    private Integer num;
    private Long userId;
    private User user;
}
```

orderService

```java
package cn.itcast.order.service;

import cn.itcast.feign.clients.UserClient;
import cn.itcast.feign.pojo.User;
import cn.itcast.order.mapper.OrderMapper;
import cn.itcast.order.pojo.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private UserClient userClient;

    public Order queryOrderById(Long orderId) {
        // 1.查询订单
        Order order = orderMapper.findById(orderId);
        // 2.使用Feign远程调用
        User user = userClient.findById(order.getUserId());
        // 3.存入order
        order.setUser(user);
        // 4.返回
        return order;
    }

//    @Autowired
//    private RestTemplate restTemplate;

//    public Order queryOrderById(Long orderId) {
//        // 1.查询订单
//        Order order = orderMapper.findById(orderId);
//        // 2.利用RestTemplate发起http请求,查询用户
//        // 将ip和端口修改为服务名称
//        String url = "http://userservice/user/"+order.getUserId();
//        // restTemplate.getForObject(url, User.class):形参为url和返回后可自动反序列化的值
//        User user = restTemplate.getForObject(url, User.class);
//        // 3.存入order
//        order.setUser(user);
//        // 4.返回
//        return order;
//    }
}
```

启动类

```java
import cn.itcast.feign.config.DefaultFeignConfiguration;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@MapperScan("cn.itcast.order.mapper")
@SpringBootApplication
@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration.class)
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    /**
     * 创建RestTemplate 并注入Spring容器
     * */
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

//    @Bean
//    public IRule randomRule(){
//        return new RandomRule();
//    }

}
```

此时运行会报错，说是FeignClient自动注入的问题，这是因为order-service的启动类无法扫描到关于自动注入的这个类，因为他们不在同一包下所导致的

这里有两种方式解决：

方式一：指定FeignClient所在包

```java
@EnableFeignClients(basePackages = "cn.itcast.feign.clients") 
```

方式二：指定FeignClient字节码

里面是一个数组，需要哪些FeignClient都可以进行指定

```java
@EnableFeignClients(clients = {UserClient.class}) 
```

这里使用指定的方式：

`@EnableFeignClients(defaultConfiguration = DefaultFeignConfiguration.class,clients = {UserClient.class})`

总结：

不同包的FeignClient的导入有两种方式：

1. 在@EnableFeignClients注解中添加basePackages，指定FeignClient所在的包
2. 在@EnableFeignClients注解中添加clients，指定具体FeignClient的字节码

# 统一网关GateWay

## 为什么需要网关

![image-20240122132853581](https://s2.loli.net/2024/01/22/KIqQnobXVkFPHt3.png)

在SpringCloud中网关的实现包括两种：

- gateway
- zuul

Zuul是基于Servlet的实现，属于阻塞式编程。而SpringCloudGateway则是基于Spring5中提供的WebFlux，属于响应式编程的实现，具备更好的性能

总结：

网关的作用

- 对用户请求做身份认证、权限校验
- 将用户请求路由到微服务，并实现负载均衡
- 对用户请求做限流

## 快速入门

搭建网关服务的步骤

创建新的module，引入SpringCloudGateway的依赖和nacos的服务发现依赖

在cloud-demo下新建模块gateway

添加对应依赖

```xml
<!--        nacos服务注册发现依赖-->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>
<!--        网关gateway依赖-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
        </dependency>
```

新建main函数

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class,args);
    }
    
}
```

编写路由配置及nacos地址

因为Gateway也会将自己作为服务注册进nacos中，所以需要配置nacos地址

```yaml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 底下是一个数组,目的是配置多个路由
        - id: user-service  # 路由标识,必须唯一
          uri: lb://userservice # lb是负载均衡的意思,路由的目标地址,通过校验后,会去哪里
          predicates:   # 路由断言(一个数组),判断请求是否符合规则
            - Path=/user/** # 路径断言,判断路径是否以/user,如果是则符合放行,并让其去访问目标地址
```

假设我们还想路由到order-service，可以这么写

```yaml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 底下是一个数组,目的是配置多个路由
        - id: user-service  # 路由标识,必须唯一
          uri: lb://userservice # 路由的目标地址,通过校验后,会去哪里
          predicates:   # 路由断言(一个数组),判断请求是否符合规则
            - Path=/user/** # 路径断言,判断路径是否以/user,如果是则符合放行,并让其去访问目标地址
        - id: order-service  # 路由标识,必须唯一
          uri: lb://orderservice # 路由的目标地址,通过校验后,会去哪里
          predicates: # 路由断言(一个数组),判断请求是否符合规则
            - Path=/order/** # 路径断言,判断路径是否以/order,如果是则符合放行,并让其去访问目标地址
```

启动服务

访问地址测试：

- http://localhost:10010/order/101
- http://localhost:10010/user/1

这样就是为其做了权限控制

总结：

网关搭建步骤：

1. 创建项目，引入nacos服务发现和gateway依赖
2. 配置application.yml，包括服务基本信息、nacos地址、路由

路由配置包括：

1. 路由(id)：路由的唯一标识
2. 路由目标(uri)：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡
3. 路由断言(predicates)：判断路由的规则

## 路由断言工厂

路由断言工厂又称Route Predicate Factory

网关路由可以配置的内容包括：

- 路由id：路由唯一标识
- uri：路由目的地，支持lb(负载均衡)和http两种
- **predicates：路由断言，判断请求是否符合要求，符合则转发到路由目的地**
- filters：路由过滤器，处理请求或响应

- 我们在配置文件中写的断言规则只是字符串，这些字符串会被Predicate Factory读取并处理，转变为路由判断的条件
- 例如Path=/user/**是按照路径匹配，这个规则是由org.springframework.cloud.gateway.handler.predicate.PathRoutePredicateFactory类来处理的
- 像这样的断言工厂在SpringCloudGateway还有十几个

如果不清楚这些断言工厂如何编写，可以在Spring的官网进行查看，上面直接给出了对应的示例

![image-20240122182206226](https://s2.loli.net/2024/01/22/MnSAdCPybEKeJQO.png)

## 路由过滤器

路由过滤器又称GatewayFilter

GatewayFilter是网关中提供的一种过滤器，可以对进入网关的请求和微服务返回的响应做处理

<img src="https://s2.loli.net/2024/01/23/IQA3UYTn6DmJBd4.png" alt="image-20240122193652390" style="zoom:50%;" />

Spring提供了31种不同的路由过滤器工厂

![image-20240122194049658](https://s2.loli.net/2024/01/22/NJLS5sV3Briz2Yt.png)

详细可以在Spring官网查看，有对应示例

假如我们想添加一个请求头

```yaml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 底下是一个数组,目的是配置多个路由
        - id: user-service  # 路由标识,必须唯一
          uri: lb://userservice # 路由的目标地址,通过校验后,会去哪里
          predicates:   # 路由断言(一个数组),判断请求是否符合规则
            - Path=/user/** # 路径断言,判断路径是否以/user,如果是则符合放行,并让其去访问目标地址
          filters:
            - AddRequestHeader=Test,EastWind is freaking aowsome!  # 添加请求头,名称为Test,值为逗号后面的文字
        - id: order-service  # 路由标识,必须唯一
          uri: lb://orderservice # 路由的目标地址,通过校验后,会去哪里
          predicates: # 路由断言(一个数组),判断请求是否符合规则
            - Path=/order/** # 路径断言,判断路径是否以/order,如果是则符合放行,并让其去访问目标地址

```

接着为一个请求编写获取请求头的形参

这里选择user-service下的userController来编写

```java
@GetMapping("/{id}")
public User queryById(@PathVariable("id") Long id,@RequestHeader(value = "Test",required = false) String test) {
    System.out.println("test = " + test);
    return userService.queryById(id);
}
```

重启服务

访问：http://localhost:10010/user/1

因为是网关所管理的请求，所以需要向网关发送请求，如果通过order发送，就不会存在网关的情况

这样只会针对于某个服务进行生效，是限定的

如果想对所有服务生效，可以将过滤器工厂写到default下

```yaml
server:
  port: 10010
spring:
  application:
    name: gateway
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 底下是一个数组,目的是配置多个路由
        - id: user-service  # 路由标识,必须唯一
          uri: lb://userservice # 路由的目标地址,通过校验后,会去哪里
          predicates:   # 路由断言(一个数组),判断请求是否符合规则
            - Path=/user/** # 路径断言,判断路径是否以/user,如果是则符合放行,并让其去访问目标地址
        - id: order-service  # 路由标识,必须唯一
          uri: lb://orderservice # 路由的目标地址,通过校验后,会去哪里
          predicates: # 路由断言(一个数组),判断请求是否符合规则
            - Path=/order/** # 路径断言,判断路径是否以/order,如果是则符合放行,并让其去访问目标地址
      default-filters: # 默认过滤器,会对所有的路由都生效
        - AddRequestHeader=Test,EastWind is freaking aowsome!  # 添加请求头,名称为Test,值为逗号后面的文字
```

修改order-service中orderController的请求，查看是否携带了请求头

```java
@GetMapping("{orderId}")
public Order queryOrderByUserId(@PathVariable("orderId") Long orderId,@RequestHeader(value = "Test",required = false) String test) {
    // 根据id查询订单并返回
    System.out.println("test = " + test);
    return orderService.queryOrderById(orderId);
}
```

重启Gateway服务

访问：

- http://localhost:10010/user/1
- http://localhost:10010/order/101

当我们访问`http://localhost:10010/order/101`时，user会输出test=null，是因为此时在orderService中通过Feign远程调用了userService中的方法，没有涉及到网关，所以没有获取到请求头

总结：

- 过滤器的作用是什么？
	1. 对路由的请求或响应做加工处理，比如添加请求头
	2. 配置在路由下的过滤器只对当前路由的请求生效
- defaultFilters的作用是什么？
	1. 对所有路由都生效的过滤器

## 全局过滤器

全局过滤器：GlobalFilter

全局过滤器的作用是处理一切进入网关的请求和微服务响应，与GatewayFilter(路由过滤器)的作用一样。

区别在于GatewayFilter通过配置定义，处理逻辑是固定的。而GloablFilter的逻辑需要自己编写，更加灵活

定义方式是实现GloablFilter接口。

![image-20240122202705963](https://s2.loli.net/2024/01/22/1sLAmcifXoVz9wP.png)

接着我们来编写一个全局过滤器用于拦截请求，判断请求的参数是否满足下面条件：

- 参数中是否有test
- test参数值是否为admin

如果同时满足则放行，否则拦截

在gateway中进行编写

```java
package cn.itcast.gateway;

/*
@author zhangJH
@create 2024-01-22-20:31
*/


import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

// @Order,用于排序过滤器,根据Order的值进行排序,值越小,优先级越高
@Order(0)   
// @Component注入到容器中被Spring管理
@Component
public class AuthorizeFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        ServerHttpRequest request = exchange.getRequest();
        MultiValueMap<String, String> queryParams = request.getQueryParams();
        // 2.获取参数中的Test参数
        String test = queryParams.getFirst("test");
        // 3.判断参数值是否为admin
        if ("admin".equals(test)){
            // 4.如果相等则放行
           return chain.filter(exchange);
        }
        // 5.否则拦截
        // 设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        // 拦截
        return exchange.getResponse().setComplete();
    }
}
```

如果想要对过滤器进行排序，除了可以使用@Order(排序值)的情况，还可以实现Ordered这个接口

```java
package cn.itcast.gateway;

/*
@author zhangJH
@create 2024-01-22-20:31
*/


import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

// @Order,用于排序过滤器,根据Order的值进行排序,值越小,优先级越高
@Order(0)
// @Component注入到容器中被Spring管理
@Component
public class AuthorizeFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        ServerHttpRequest request = exchange.getRequest();
        MultiValueMap<String, String> queryParams = request.getQueryParams();
        // 2.获取参数中的Test参数
        String test = queryParams.getFirst("test");
        // 3.判断参数值是否为admin
        if ("admin".equals(test)) {
            // 4.如果相等则放行
            return chain.filter(exchange);
        }
        // 5.否则拦截
        // 设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        // 拦截
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        // 与@Order注解是一样的效果
        return 0;
    }
}
```

重启Gateway

访问：http://localhost:10010/user/1

此时报错401

访问：http://localhost:10010/user/1?test=admin

总结：

- 全局过滤器的作用是什么？

对所有路由都生效的过滤器，并且可以自定义处理逻辑

- 实现全局过滤器的步骤？
	1. 实现GlobalFilter接口
	2. 添加@Order注解或实现Ordered接口
	3. 编写处理逻辑

## 过滤器链的执行顺序

请求进入网关会碰到三类过滤器：当前路由过滤器、DefaultFilter、GlobalFilter

请求路由后，会将当前路由过滤器和DefaultFilter、GloablFilter，合并到一个过滤器链(集合)中，排序后依次执行每个过滤器

![image-20240122205513042](https://s2.loli.net/2024/01/22/ScODGzVbuxBYCZf.png)

- 每个过滤器都必须指定一个int类型的order值，**order值越小，优先级越高，执行顺序越靠前。**
- GlobalFilter通过实现Ordered接口，或者添加@Order注解来指定order值，由我们自己指定
- 路由过滤器和defaultFilter的order由Spring指定，默认是按照声明顺序从1递增
- 当过滤器的order值一样时，会按照defaultFilter > 路由过滤器 > GlobalFilter的顺序执行。

总结：

- 路由过滤器、defaultFilter、全局过滤器的执行顺序？
	1. order值越小，优先级越高
	2. 当order值一样时，顺序是defaultFilter最先，然后是局部路由过滤器，最后是全局过滤器

## 网关的cors跨域配置

首先要知道什么是跨域

跨域：域名不一致就是跨域，主要包括：

- 域名不同：`www.taobao.com`和`www.taobao.org`金额`www.jd.com`金额`miaosha.jd.com`
- 域名相同，端口不同：localhost:80和localhost:81

跨域问题：浏览器禁止请求的发起者与服务端发生跨域ajax请求，请求被浏览器拦截的问题

解决方案：CORS

网关处理跨域采用的方式同样是CORS方案，并且只需要简单的配置即可实现：

<img src="https://s2.loli.net/2024/01/22/KOZY39MwDl6WoHI.png" alt="image-20240122211851539" style="zoom:50%;" />

# Docker

## 什么是Docker

大型项目组件较多，运行环境也较为复杂，部署时会碰到一些问题：

- 依赖关系复杂，容易出现兼容性问题
- 开发、测试、生产环境有差异

这个时候就出现了，Docker

那么，Docker如何解决依赖的兼容问题的？

- 将应用的Libs(函数库)、Deps(依赖)、配置与应用一起打包
- 将每个应用放到一个隔离**容器**去运行，避免互相干扰

不同环境的操作系统不同，Docker该如何解决?

这里了解一下Linux系统的结构

其实就是存在三个关系：计算机硬件、内核、系统应用

<img src="https://s2.loli.net/2024/01/23/bF6GUziDcS21x5L.png" alt="image-20240122215436213" style="zoom:50%;" />

拿Ubuntu和Centos为例，它俩都是基于Linux内核，只是系统应用不同，提供的函数库有差异，假设做了迁移，可能有些函数库有出入，会导致出现问题

而Docker解决的办法就是将**用户程序所需要调用的系统函数库一起打包**

总结：

Docker如何解决大型项目依赖关系复杂，不同组件依赖的兼容性问题？

- Docker允许开发中将应用、依赖、函数库、配置一起**打包**，形成可移植镜像
- Docker应用运行在容器中，使用沙箱机制，相互**隔离**

Docker如何解决开发、测试、生产环境有差异的问题

- Docker镜像中包含完整的运行环境，包括系统的函数库，仅依赖系统的Linux内核，因此可以在任意Linux操作系统上运行

Docker是快速交付应用、运行应用的技术：

1. 可以将程序及其依赖、运行环境一起打包为一个镜像，可以迁移到任意Linux操作系统
2. 运行时利用沙箱机制形参隔离容器，各个应用互不干扰
3. 启动、移除都可以通过一行命令完成，方便快捷

## Docker与虚拟机的差别

- docker是一个系统进程；虚拟机是在操作系统中的操作系统
- docker体积小、启动速度快、性能好；虚拟机体积大、启动速度慢、性能一般

## Docker的架构

### 镜像和容器

**镜像(Image)**：Docker将应用程序及其所需的依赖、函数库、环境、配置等文件打包在一起，称为镜像

**容器(Container)**：镜像中的，应用程序，运行后，形成的进程，就是**容器**，只是Docker会给容器做隔离，对外不可见

镜像中的文件是不允许修改的(read only)，当容器想对镜像中的内容做修改时，就需要将镜像中的内容拷贝一份到容器中，单独的在容器中对拷贝来的镜像进行修改和使用

![image-20240122221506183](https://s2.loli.net/2024/01/23/MAJBRnZpSt8hxGv.png)

如果我们想将Docker镜像分享给别人使用怎么办呢

我们可以通过docker build构建一个镜像，然后挂载到DockerHub(一个Docker镜像的托管平台)上，也被称为Docker Registry，如果有一些镜像不想让别人使用，只想内部使用，可以构建到私有云中。

Docker是一个CS架构的程序，由两部分组成：

- 服务端(server)：Docker守护进程，负责处理Docker指令，管理镜像、容器等
- 客户端(client)：通过命令或RestAPI向Docker服务端发送指令。可以在本地或远程向服务端发送指令

下图所示为：

docker build通过docker守护进程构建镜像并注册到Registry

docker pull 可以拉取docker镜像

docker run可以运行docker镜像

![image-20240122222147018](https://s2.loli.net/2024/01/22/74zxVleR8oGj5FC.png)

总结：

镜像：

- 将应用程序及其依赖、环境、配置打包在一起

容器：

- 把镜像运行起来就是容器，一个镜像可以运行多个容器

Docker结构：

- 服务端：接收命令或远程请求，操作镜像或容器
- 客户端：发送命令或者请求到Docker服务端

DockerHub：

- 一个镜像托管的服务器，类似的还有阿里云的镜像服务，统称为DockerRegistry

## Docker的安装

Docker分为CE和EE两大版本。CE即为社区版(免费，支持周期7个月)，EE即企业版，强调安全，付费使用，支持周期24个月。

Docker CE分为`stable test`和`nightly`三个更新频道。

Docker CE支持64位版本Centos 7，并且要求内核版本不低于3.10，Centos 7满足最低内核的要求，所以我们在Centos 7安装Docker

### 卸载Docker

如果之前安装过旧版本的Docker，可以使用下面命令卸载：

```sh
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

### 安装Docker

首先需要虚拟机联网，安装yum工具

```sh
yum install -y yum-utils \
           device-mapper-persistent-data \
           lvm2 --skip-broken
```



然后更新本地镜像源：

```shell
# 设置docker镜像源
yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

yum makecache fast
```





然后输入命令：

```shell
yum install -y docker-ce
```

docker-ce为社区免费版本。稍等片刻，docker即可安装成功。



### 启动Docker

Docker应用需要用到各种端口，逐一去修改防火墙设置。非常麻烦，因此建议大家直接关闭防火墙！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！

启动docker前，一定要关闭防火墙后！！



```sh
# 关闭
systemctl stop firewalld
# 禁止开机启动防火墙
systemctl disable firewalld
```



通过命令启动docker：

```sh
systemctl start docker  # 启动docker服务

systemctl status docker  # 查看docker服务

systemctl stop docker  # 停止docker服务

systemctl restart docker  # 重启docker服务
```



然后输入命令，可以查看docker版本：

```
docker -v
```

### 配置镜像加速

docker官方镜像仓库网速较差，我们需要设置国内镜像服务：

参考阿里云的镜像加速文档：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

## Docker的基本操作

### 镜像相关命令

- 镜像名称一般分为两部分组成：[repository]:[tag]。
- 没有指定tag时，默认是latest，代表最新版本的镜像

![image-20240123095546083](https://s2.loli.net/2024/01/23/lj4G7XwDeH5u3hJ.png)

镜像操作的常用命令

- docker build：构建镜像
- docker images：查看镜像
- docker rmi：删除镜像
- docker push：推送镜像
- docker pull：拉取镜像
- docker save：保存镜像为压缩包
- docker load：加载压缩包为镜像

<img src="https://s2.loli.net/2024/01/23/6fBVjP713zr49UY.png" alt="image-20240123134708026" style="zoom:50%;" />

这里做一个小demo学习docker的常用命令

从DockerHub中拉取一个nginx镜像并查看

首先我们要访问DockerHub：`hub.docker.com`

在左上角的搜索框中搜索nginx，点进去，就可以看到对应的拉取命令了

`docker pull nginx`，这里没有指定nginx的版本，默认是最新版

在终端输入命令进行拉取

安装完成后，可以输入`docker images`查看镜像

![image-20240123142736647](https://s2.loli.net/2024/01/23/GR4yfJgeCaiAvdt.png)

接着我们可以利用docker save将nginx导出磁盘，再通过load加载回来

分为以下几个步骤：

步骤一：利用docker xxx --help命令查看docker save和docker load的语法

步骤二：使用docker tag 创建新镜像mynginx1.0

步骤三：使用docker save导出镜像到磁盘

通过`docker save --help`我们可以查看save命令的帮助

```
Usage:  docker save [OPTIONS] IMAGE [IMAGE...]

Save one or more images to a tar archive (streamed to STDOUT by default)

Aliases:
  docker image save, docker save

Options:
  -o, --output string   Write to a file, instead of STDOUT
```

这里有一个多选项，-o的作用是写入文件，而不是输出

格式是这样的：docker save [多选项-o] 输出的文件名[镜像名称:版本]

```sh
docker save -o nginx.tar nginx:latest 
```

这时候我们再将之前保存的镜像导入回来，在此之前，我们先删除镜像

`docker rmi 镜像名称:版本`

```sh
docker rmi nginx:latest
docker images		# 查看镜像是否删除
```

通过`docker load --help` 查看load的命令帮助

```
Usage:  docker load [OPTIONS]

Load an image from a tar archive or STDIN

Aliases:
  docker image load, docker load

Options:
  -i, --input string   Read from tar archive file, instead of STDIN
  -q, --quiet          Suppress the load output
```

-i是读取某个镜像

-q是不输出日志，`Suppress`有压制的意思

具体如下：`docker load -i 被读取的tar文件`

总结：

镜像操作有哪些？

- docker images
- docker rmi
- docker pull
- docker push
- docker save 
- docker load

### 练习

完成一个小练习：去DockerHub搜索并拉取一个Redis镜像

流程如下：

1. 去DockerHub搜索Redis镜像
2. 查看Redis镜像的名称和版本
3. 利用docker pull命令拉取镜像
4. 利用docker save命令将redis:latest打包为一个redis.tar包
5. 利用docker rmi删除本地的redis:latest
6. 利用docker load重新加载redis.tar

挺简单的，练习一下即可

### 容器相关命令

- docker run：运行容器
- docker pause：暂停容器
- docker unpause：恢复容器为运行状态
- docker stop：停止容器，它与暂停的区别是，暂停不会杀死容器进程，停止会直接杀死进程
- docker start：启动容器
- docker ps：查看所有**运行的**容器及状态
- docker logs：查看容器运行日志
- docker exec：进入容器执行命令
- docker rm：删除容器，删除运行的进程及回收进程，包括硬盘上的文件

<img src="https://s2.loli.net/2024/01/23/cGjLP6NvSWx8T5l.png" alt="image-20240123151701097" style="zoom:50%;" />

这里我们创建并运行一个Nginx的容器

命令格式如下：

```sh
docker run --name containerName -p 80:80 -d nginx
```

命令解读：

- docker run：创建并运行一个容器
- --name：容器名称
- -p：将宿主机端口与容器端口映射，冒号左侧是宿主机端口，右侧是容器端口
- -d：后台运行容器
- nginx：镜像名称，例如nginx

这里的端口映射可以这么来理解，宿主机其实相当于你的电脑，而容器是存在于虚拟机中的，容器会被单独的隔离起来，我们无法直接访问，要通过端口映射的方式进行访问，举个例子，宿主机为ip:80，假设容器是nginx，那么其的端口也是80，如果想要映射，就需要这样写`-p 80:80`，此时，当我们去访问宿主机的80端口时，就能访问到容器的80端口了，宿主机的端口一般是任意的，而容器端口不能任意，有固定的端口，也就是说，宿主机端口可以是8080、8081....这些，如果想要映射到对应服务，就:xxx端口即可

接下来编写nginx容器的运行

```sh
docker run --name ng -p 80:80 -d nginx
```

在运行完成后，返回了一串内容，这一串内容是该容器的id

输入`docker ps`查看容器是否运行完毕

此时，我们可以访问一下nginx服务是否启动成功

我们可以通过宿主机来映射容器 ，以此来达成查看nginx的效果

我们需要查看当前虚拟机的ip，访问其的80端口，就可以看到nginx的内容了

访问nginx后，对应的容器中肯定会出现一些日志，我们查看一下日志的情况

输入`docker logs ng`，这里的ng是之前的容器名

如果我们想持续跟踪日志，当我们访问nginx主页后，日志中会同步的出现信息

我们可以使用`docker logs -f ng`，跟踪日志输出

```
-f, --follow         Follow log output
```

总结：

docker run命令的常见参数有哪些？

- --name：指定容器名称
- -p：指定端口映射
- -d：让容器后台运行

查看容器日志命令：

- docker logs
- 添加-f参数可以持续查看日志

查看容器状态

- docker ps

如果我们想对Nginx容器中的HTML文件内容进行修改，该如何操作呢

步骤如下：

步骤一：进入容器

```sh
docker exec -it ng bash
```

命令解读：

- docker exec ：进入容器内部，执行一个命令
- -it：给当前进入的容器创建一个标准输入、输出终端，运行我们与容器交互
- ng：要进入容器的名称
- bash：进入容器后执行的命令，bash是一个linux终端交互命令

具体如何查看该容器相关的信息呢，还是在DockerHub中进行查看，看nginx镜像的作者将数据存放的位置在哪了

```
cd /usr/share/nginx/html/
```

进入这个目录，里面有nginx静态资源的信息，我们可以修改里面的index.html文件即可

那么我们该如何修改index.html文件呢

首先想到的就是vi命令，在尝试后，发现没有vi命令，原因是这里是容器的bash环境，没有完整的linux系统，所以无法使用vi

这里就需要用到一个命令了：`sed -i 's#Welcome to nginx#This is WindyDante#g' index.html`

修改完成后，重新访问页面，此时页面就来到了`This is WindyDante`

此时，如果我们想退出容器，可以输入exit

如果想停止容器，输入：`docker stop containerName`

再输入`docker ps`，查看运行中的容器，此时ng就从环境中剔除了

如果我们想查看所有容器，可以输入：`docker ps -a`

如果想删除该容器，需要在该容器**停止时删除**，输入：`docker rm containerName`

如果想强制删除(当容器运行时也能进行删除)容器，可以输入：`docker rm -f container`

总结：

- docker ps
- 添加-a参数查看所有状态的容器

删除容器：

- docker rm
- 不能删除运行中的容器，除非添加-f参数

进入容器：

- 命令是docker exec -it [容器名] [要执行的命令]
- exec命令可以进入容器修改文件，但是在容器内修改文件是不推荐的

### 练习

创建并运行一个redis容器，并且支持数据持久化

步骤如下：

步骤一：到DockerHub搜索Redis镜像

步骤二：查看Redis镜像文档中的帮助信息

步骤三：利用docker run 命令运行一个Redis容器

在之前的练习中，已经拉取了Redis的镜像在本地，所以我们直接运行即可

```sh
docker run --name rd -p 6379:6379 -d redis
```

```sh
docker ps # 查看容器运行情况
```

输入`docker exec -it rd bash`进入redis容器，并执行redis-cli客户端命令，存入num=666

输入：

`redis-cli`

`set num 666`

`get num`

此时num的值为666说明成功了

当然，我们不一定非要使用bash进入，也可以直接`docker exec -it rd redis-cli`

直接进入redis客户端也是一样的

## 数据卷

在上面的学习后我们发现

- 当我们要修改Nginx的html内容时，需要进入容器内部修改，很不方便

- 而且在容器中的修改，对外是不可见的，所有修改对新创建的容器是不可复用的
- 数据在容器内，如果要升级容器必然删除旧容器，所有数据都跟着删除了

此时，我们继续需要一个新功能的出现-->数据卷

**数据卷(volume)**是一个虚拟目录，指向宿主机文件系统中的某个目录

拿下图来举例

Volumes是数据卷，它所映射的是容器中的两个文件夹，而实际的存放位置是在宿主机的文件系统中，当我们想修改容器中的内容时，可以直接去修改数据卷中的内容，它可以映射到对应的容器中起效果，并且，如果有新创建的容器，我们可以将新创建的容器中的目录，挂载上数据卷的目录，这样就可以复用其他容器已经写好的目录了，如果我们升级了容器，删除了容器的所有数据，也不会对数据卷造成影响，因为数据卷是单独在宿主机文件系统有一个存放位置，只要不删除数据卷，就不会对数据造成影响

<img src="https://s2.loli.net/2024/01/23/UfvGk67SajwJtoA.png" alt="image-20240123191901336" style="zoom: 67%;" />

### 数据卷的基本命令

数据卷的基本语法如下：

```sh
docker volume [COMMAND]
```

docker volume命令是数据卷操作，根据命令后跟随的command来确定下一步的操作：

- create：创建一个volume
- inspect：显示一个或多个volume的信息
- ls：列出所有的volume
- prune：删除未使用的volume
- rm：删除一个或多个指定的volume

接下来我们创建一个数据卷，并查看数据卷在宿主机的目录位置

创建数据卷：`docker volume create html`

列出数据卷：`docker volume ls`

查看数据卷的存放位置：`docker volume inspect`

```
[
    {
        "CreatedAt": "2023-11-07T05:27:47-08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": null,
        "Scope": "local"
    }
]
```

`Mountpoint`：存放位置

删除所有未使用的数据卷：`docker volume prune`

删除指定数据卷：`docker volume rm html`

总结：

数据卷的作用：

- 将容器与数据分离，解耦合，方便操作容器内数据，保证数据安全

数据卷操作：

- docker volume create(创建数据卷)
- docker volume ls(列出所有数据卷)
- docker volume rm(删除指定数据卷)
- docker volume prune(删除未使用的数据卷)

### 挂载数据卷

我们在创建容器时，可以通过-v参数来挂载一个数据卷到某个容器目录

```sh
docker run \
--name ng \
-v html:/root/html \
-p 8080:80
nginx 
```

参数解析：

docker run：创建并运行容器

--name ng：为容器起名字

-v html:/root/html：把html的数据卷挂载到容器中的/root/html目录中

-p 8080:80：将宿主机的8080端口映射到容器的80端口中

nginx：镜像名称

根据上面的命令，我们创建一个nginx容器，修改容器内的html目录内的index.html内容

需求说明：上个案例中，我们进入nginx容器内部，已经知道nginx的html目录所在位置/usr/share/nginx/html，我们需要把这个目录挂载到html这个数据卷上，方便操作其内容

提示：运行容器时使用-v参数挂载数据卷

步骤：

1. 创建容器并挂载数据卷到容器内的html目录
2. 进入html数据卷的所在位置，并修改html内容

查看是否有nginx的镜像：`docker images`

在前面我已经从dockerHub上导入过了nginx的镜像，这里就不需要再导入了

有了镜像之后，就需要进行容器的创建及数据卷的挂载

查看一下数据卷是否创建：`docker volume ls`

这里我已经创建过了html的数据卷

创建容器及数据卷的挂载

```sh
docker run \
--name ng \
-v html:/usr/share/nginx/html \
-p 8080:80 \
-d \
nginx
```

挂载完成后，通过查看数据卷的挂载位置：`docker volume inspect html`查看对应数据卷的位置，前往该位置

输入：`当前id:8080`，查看nginx是否启动成功，当我们修改数据卷中的内容后，查看是否有效，会发现已经生效了，如果没生效，说明浏览器有缓存，换个浏览器试一下

假设我们没有html数据卷，它是否会为我们创建一个呢？

先将之前运行的容器和数据卷删除

```sh
docker rm -f ng
docker volume rm html
```

此时我们不存在之前的数据卷，再次运行之前的命令

```sh
docker run \
--name ng \
-v html:/usr/share/nginx/html \
-p 8080:80 \
-d \
nginx
```

依然成功了，也就是说，当数据卷不存在时，我们可以直接通过创建容器，Docker会自动帮我们创建数据卷

总结：

数据卷挂载方式：

- -v volumeName ：/targetContainerPath
- 如果容器运行时volume不存在，会自动被创建出来

### 将宿主机目录挂载到容器

- -v	[宿主机目录]:[容器内目录]
- -v	[宿主机文件]:[容器内文件]

实现思路如下：

1. 将资料中的mysql.tar上传到虚拟机，通过load加载为镜像
2. 创建目录/tmp/myql/data
3. 创建目录/tmp/myql/conf，将资料中提供的hmy.cnf文件上传到/tmp/myql/conf
4. 在DockerHub查阅资料，创建并运行MySql容器，要求：
	1. 挂载/tmp/myql/data到mysql容器内数据存储目录
	2. 挂载/tmp/myql/conf/hmy.cnf到mysql容器的配置文件
	3. 设置MySql密码

以下操作在/tmp目录下进行

加载mysql镜像

```sh
docker load -i mysql.tar
```

查看docker 镜像是否包含了mysql的镜像

```sh
docker images
```

创建对应目录

```sh
mkdir -p /tmp/myql/data
mkdir -p /tmp/myql/conf
mv hmy.cnf /tmp/myql/conf
```

创建并运行MySql容器，挂载到对应目录

```sh
docker run \
--name mq \
-e MYSQL_ROOT_PASSWORD=123 \
-p 3306:3306 \
-v /tmp/myql/conf/hmy.cnf:/etc/mysql/conf.d/hmy.cnf \
-v /tmp/myql/data:/var/lib/mysql \
-d \
mysql:5.7.25
```

`-e MYSQL_ROOT_PASSWORD=123` ：-e是设置环境变量，这里是设置mysql的密码

此时来到/tmp/myql/data目录下，查看hmy.cnf下是否有数据

总结：

docker run的命令中通过-v参数挂载文件或目录到容器中：

1. -v volume名称：容器内目录
2. -v 宿主机文件：容器内文件
3. -v  宿主机目录：容器内目录

数据卷挂载与目录直接挂载的区别

1. 数据卷挂载的耦合度低，由Docker来管理目录，但是目录较深，不好找
2. 目录挂载耦合度高，需要我们自己管理目录，不过目录容易寻找查看

## DockerFile自定义镜像

### 镜像结构

- **入口(Entrypoint)**：镜像运行入口，一般是程序启动的脚本和参数
- **层(Layer)**：在BaseImage基础上添加安装包、依赖、配置等，每次操作都形成新的一层
- **基础镜像(BaseImage)**：应用依赖的系统函数库、环境、配置、文件等

以下图为例就可以很好的说明上面的结构，最底层是基础镜像，中间是层，入口程序启动的参数和脚本

<img src="https://s2.loli.net/2024/01/24/JCdHX3hkyaiEV2I.png" alt="image-20240124091154837" style="zoom:50%;" />

总结：

镜像是分层结构，每一层称为一个Layer

- BaseImage层：包含基本的系统函数库、环境变量、文件系统
- Entrypoint：入口，是镜像中应用启动的命令
- 其他：在BaseImage基础上添加依赖、安装程序、完成整个应用的安装和配置

### 什么是Dockerfile

Dockerfile就是一个文本文件，其中包含一个个的指令(Instruction)，用指令来说明要执行什么操作来构建镜像。每一个指令都会形成一层Layer。

|    指令    |                     说明                     |            示例             |
| :--------: | :------------------------------------------: | :-------------------------: |
|    FROM    |                 指定基础镜像                 |        FROM centos:7        |
|    ENV     |        设置环境变量，可在后面指令使用        |        ENV key value        |
|    COPY    |         拷贝本地文件到镜像的指定目录         |      COPY ./mysql /tmp      |
|    RUN     |  执行linux的shell命令，一般是安装过程的命令  |     RUN yum install gcc     |
|   EXPOSE   | 指定容器运行时监听的端口，是给镜像使用者看的 |         EXPOSE 8800         |
| ENTRYPOINT |      镜像中应用启动命令，容器运行时调用      | ENTRYPOINT java -jar xx.jar |

这里我们基于Ubuntu镜像构建一个新镜像，运行一个java项目

以下操作在tmp目录执行

步骤一：新建一个空文件夹docker-demo

步骤二：拷贝资料中的docker-demo.jar到docker-demo目录

步骤三：拷贝资料中的jdk8.tar.gz到docker-demo目录

步骤四：拷贝资料中的Dockerfile到docker-demo目录

步骤五：进入docker-demo

步骤6：运行命令

```sh
docker build -t javaweb:1.0 .
```

这里详细看一下Dockerfile

导入ubuntu的16.04的镜像，并配置jdk的安装目录

拷贝jdk到jdk的安装目录，且拷贝jar包到指定位置并改名

安装jdk，配置jdk的环境变量

暴露端口，编写java项目的启动命令

```dockerfile
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量，JDK的安装目录
ENV JAVA_DIR=/usr/local

# 拷贝jdk和java项目的包
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar

# 安装JDK
RUN cd $JAVA_DIR \
 && tar -xf ./jdk8.tar.gz \
 && mv ./jdk1.8.0_144 ./java8

# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin

# 暴露端口
EXPOSE 8090
# 入口，java项目的启动命令
ENTRYPOINT java -jar /tmp/app.jar
```

具体操作步骤如下：

```sh
cd /tmp
mkdir docker-demo
cd docker-demo
# 拷贝对应资料到docker-demo
docker build -t javaweb:1.0 .
```

此时自定义镜像构建完毕，输入：`docker images`查看镜像是否存在

接着我们将这个镜像运行起来

```sh
docker run \
--name web \
-p 8090:8090 \
-d \
javaweb:1.0
```

访问：`http://宿主机ip:8090/hello/count`即可查看相应内容

像上述一些操作是可复用的，我们就可以整理出来单独的作为一个镜像，不过像一些最基本的镜像别人已经帮我们制作过了，比如java8的镜像之类的

总结：

1. Dockerfile的本质是一个文件，通过指令描述镜像的构建过程
2. Dockerfile的第一行必须是FROM，从一个基础镜像来构建
3. 基础镜像可以是基本操作系统，如Ubuntu。也可以是其他人制作好的镜像，例如：java:8-alpine



## DockerCompose

当生产环境下，微服务一个个的构建就非常麻烦了，此时就需要用到集群部署的方法了

- Docker Compose可以基于Compose文件帮我们快速的部署分布式应用，而无需手动一个个创建和运行容器
- Compose文件是一个文本文件，通过指令定义集群中的每个容器如何运行

Linux下需要通过命令下载：

```sh
# 安装
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

如果下载速度较慢，或者下载失败，可以使用课前资料提供的docker-compose文件，将其上传到`/usr/local/bin`目录

修改文件权限：

为添加执行权限

```sh
# 修改权限
chmod +x /usr/local/bin/docker-compose
```

Base自动补全命令：

添加自动补全后，使用DockerCompose会有提示

```sh
# 补全命令
curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

如果这里出现错误，需要修改自己的hosts文件：

```sh
echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts
```

## Docker镜像仓库

镜像仓库(Docker Registry)有公共和私有的两种形式：

- 公共仓库：例如Docker官方的Docker Hub，阿里云镜像服务等等
- 除了使用公开仓库外，用户还可以在本地搭建私有Docker Registry。企业自己的镜像最好是采用私有Docker Registry来实现。

### 简化版镜像仓库

Docker官方的Docker Registry是一个基础版本的Docker镜像仓库，具备仓库管理的完整功能，但是没有图形化界面。

搭建方式比较简单，命令如下：

```sh
docker run -d \
    --restart=always \
    --name registry	\
    -p 5000:5000 \
    -v registry-data:/var/lib/registry \
    registry
```



命令中挂载了一个数据卷registry-data到容器内的/var/lib/registry 目录，这是私有镜像库存放数据的目录。

访问http://YourIp:5000/v2/_catalog 可以查看当前私有镜像服务中包含的镜像

### 图形化页面版本

使用DockerCompose部署带有图像界面的DockerRegistry，命令如下：

```yaml
version: '3.0'
services:
  registry:
    image: registry
    volumes:
      - ./registry-data:/var/lib/registry
  ui:
    image: joxit/docker-registry-ui:static
    ports:
      - 8080:80
    environment:
      - REGISTRY_TITLE=Eastwind私有仓库
      - REGISTRY_URL=http://registry:5000
    depends_on:
      - registry
```

### 配置Docker信任地址

我们的私服采用的是http协议，默认不被Docker信任，所以需要做一个配置：

```sh
# 打开要修改的文件
vi /etc/docker/daemon.json
# 添加内容：
"insecure-registries":["http://YouIp:8080"]
# 重加载
systemctl daemon-reload
# 重启docker
systemctl restart docker
```

### 在私有镜像仓库推送或拉取镜像

推送镜像到私有镜像服务必须先tag，步骤如下：

重新tag本地镜像，名称前缀为私有仓库的地址：YouIP:8080/

```sh
docker tag nginx:latest YouIP:8080/nginx:1.0
```

推送镜像

```sh
docker push YouIP:8080/nginx:1.0
```

拉取镜像

```sh
docker pull YouIP:8080/nginx:1.0
```

总结：

1. 推送本地镜像到仓库前必须重命名(docker tag)镜像，以镜像仓库地址为前缀
2. 镜像仓库推送前需要把仓库地址配置到docker服务的daemon.json中，被docker信任
3. 推送使用docker push命令
4. 拉取使用docker pull命令
5. 修改镜像名称使用docker tag命令

# RabbitMq

## 同步通讯

以下图为例：

同步通讯：当你向其他人发起视频通话时，对方说的话你能马上知道，并且你说的对方也能马上知道，这种就是同步通讯，并且在同步通讯时，其他人是无法向你发起会话的

异步通讯：当你给别人发微信时，别人不一定能秒回你的消息，可能要等到他看到你的消息时，才能进行回复，并且这种消息呢，你可以给多个人发，多个人也可以给你回复，并不是说你给他单独发了，就不能给其他人单独发了

<img src="https://s2.loli.net/2024/01/24/jklYgC1uAQxcTIb.png" alt="image-20240124123300604" style="zoom:50%;" />

同步通讯的缺点：

1. 耦合度高：每次加入新的需求，都要修改原来的代码
2. 性能下降：调用者需要等待服务提供者响应，如果调用链过长则响应时间等于每次调用的时间之和
3. 资源浪费：调用链的每个服务在等待响应过程中，不能释放请求占用的资源，高并发场景下会极度浪费系统资源
4. 级联失败：如果服务提供者出现问题，所有调用方都会跟着出问题，如同多米诺骨牌一样，迅速导致整个微服务集群故障

总结：

同步调用的优点：

- 时效性较强，可以立即得到结果

同步调用的问题：

- 耦合度高
- 性能和吞吐能力下降
- 有额外的资源消耗
- 有级联失败问题

## 异步调用

异步调用常见实现就是事件驱动模式

以下图为例，这里多出了一个Broker(代理)，当支付服务结束后，会发布一个消息，这个消息会去通知后面的服务继续往后执行，而支付服务直接返回支付成功的消息即可，这样需要的耗时只在支付服务上了

<img src="https://s2.loli.net/2024/01/24/1odqym6AxIW7VZC.png" alt="image-20240124125326566" style="zoom: 50%;" />

总结：

异步通信的优点：

- 耦合度低
- 吞吐量提升
- 故障隔离
- 流量削峰

异步通信的缺点：

- 依赖于Broker的可靠性、安全性、吞吐能力
- 架构复杂，业务没有明显的流程线，不好追踪管理



## MQ常见技术介绍

MQ(MessageQueue)，中文是消息队列，字面来看就是存放消息的队列。也就是事件驱动架构中的Broker(代理)

![image-20240124131204186](https://s2.loli.net/2024/01/24/nfUtTe41E8IhbVS.png)

## RabbitMq快速入门

首先要将RabbitMq部署到当前系统上

### 单机部署

方式一：在线拉取

从dockerHub上拉取镜像

``` sh
docker pull rabbitmq:3-management
```

方式二：从本地加载

在课前资料已经提供了镜像包，上传到虚拟机中后，使用命令加载镜像即可

```sh
docker load -i mq.tar
```

#### 安装MQ

执行下面的命令来运行MQ容器：

```sh
docker run \
 -e RABBITMQ_DEFAULT_USER=eastwind \
 -e RABBITMQ_DEFAULT_PASS=123 \
 --name mq \
 --hostname mq1 \
 -p 15672:15672 \
 -p 5672:5672 \
 -d \
 rabbitmq:3-management
```

15672是控制台端口，所以在浏览器中访问该端口就可以看到rabbitmq了

### RabbitMq的结构

Google浏览器访问：`YourIp:15672`，在其他浏览器访问不一定能进入与视频相同的页面

输入之前在环境变量里面写好的用户名和密码

这是一个虚拟主机，每个虚拟主机之间是分离的，都有着各自的内容，这里我们新建一个虚拟主机

<img src="https://s2.loli.net/2024/01/24/koEQGc2FTv8D5mW.png" alt="image-20240124152936083" style="zoom: 33%;" />

并为其分配用户，我们可以新建一个用户，并为其分配虚拟主机，这样的话，每个用户就有其独立的虚拟主机环境了

<img src="https://s2.loli.net/2024/01/24/Fpr9zyYD7Oj4TcE.png" alt="image-20240124153252727" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/01/24/91X3EU7nglkva2K.png" alt="image-20240124153320134" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/01/24/42owbOK1Gy7tfhH.png" alt="image-20240124153518221" style="zoom:50%;" />

此时，这两块区域就存在着不同的虚拟主机了

<img src="https://s2.loli.net/2024/01/24/UTzAyqtBWxfDFRe.png" alt="image-20240124153630400" style="zoom:50%;" />

RabbitMQ的结构和概念

下面这个图就基本讲述RabbitMQ的基本结构了

Publisher是消息的发送方，他会将消息发送到exchange(交换机上)，而exchange会将消息转发到队列上，最后consumer(消息订阅者)会监听队列获取消息

<img src="https://s2.loli.net/2024/01/24/LDxjBZ3ftTYnFd1.png" alt="image-20240124153908096" style="zoom:50%;" />

总结：

RabbitMQ中的几个概念：

- channel：操作MQ的工具
- exchange：路由消息到队列中
- queue：缓存消息
- virtual host：虚拟主机，是对queue、exchange等资源的逻辑分组

### 消息模型

- 基本消息队列(BasicQueue)
- 工作消息队列(WorkQueue)

发布订阅(Publish、Subscribe)，又根据交换机类型不同分为三种：

- Fanout Exchange：广播
- Direct Exchange：路由
- Topic Exchange：主题

#### 基本消息队列

基本消息队列包含三个角色：

- publisher：消息发布者，将消息发送到队列queue
- queue：消息队列，负责接受并缓存消息
- consumer：订阅队列，处理队列中的消息

实现基本消息队列的步骤：

- 导入资料中的mq-demo工程
- 原型publisher服务中的测试类PublisherTest中的测试方法testSendMessage()
- 查看RabbitMQ控制台的消息
- 启动consumer服务，查看是否能接收消息

在消息发送方(publish)和消息接收方(consumer)的测试方法中，修改自己的ip、用户名、密码信息

总结：

基本消息队列的消息发送流程：

1. 建立connection
2. 创建channel(通道)
3. 利用channel声明队列
4. 利用channel向队列发送消息

基本消息队列的消息接收流程：

1. 建立connection
2. 创建channel
3. 利用channel声明队列
4. 定义consumer的消费行为handleDelivery()
5. 利用channel将消费者与队列绑定

这里都声明队列是防止队列不存在的情况导致程序出错

## SpringAMQP

### 什么是SpringAMQP

想知道什么是SpringAMQP，首先要知道什么是AMQP

AMQP是：Advanced Message Queuing Protocol（高级消息队列协议），是用于在应用程序之间传递业务消息的开放标准。该协议与语言和平台无关，更符合微服务中独立性的要求

SpringAMQP是基于AMQP协议定义的一套API规范，提供了模版来发送和接收消息。包含两部分，其中spring-amqp是基础抽象，spring-rabbit是底层的默认实现

### 利用SpringAMQP实现基础消息队列功能

流程如下：

1. 在父工程中引入spring-amqp的依赖
2. 在publisher服务中利用RabbitTemplate发送消息到simple.queue这个队列
3. 在consumer服务中编写消费逻辑，绑定simple.queue这个队列

引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

在publisher服务中编写application.yml，添加mq连接信息：

```yaml
spring:
  rabbitmq:
    port: 5672
    username: eastwind
    password: 123
    virtual-host: /
    host: 192.168.200.129
```

新建测试类，用于在publisher中发送消息

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class SpringAMQPTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void testSend2SimpleQueue() {
        String queueName = "simple.queue";
        String message = "Hello world";
        rabbitTemplate.convertAndSend(queueName,message);
    }
}
```

这里记得创建一下simple.queue这个队列，防止它不存在

![image-20240124191635932](https://s2.loli.net/2024/01/24/Mg7uVR14ek9tKNm.png)

运行进行测试

运行后无问题的话，回到管理页面，进行查看消息是否被队列存储了

![image-20240124191801803](https://s2.loli.net/2024/01/24/otUdBDFIxLevP18.png)

<img src="https://s2.loli.net/2024/01/24/WJlKogAwXxQI2YF.png" alt="image-20240124191849088" style="zoom:50%;" />

消息无误说明消息的发送成功了

总结：

什么是AMQP？

- 应用间通信的一种协议，与语言平台无关。

SpringAMQP如何发送消息？

- 引入amqp的starter依赖
- 配置RabbitMQ地址
- 利用RabbitTemplate的convertAndSend方法

发送方结束了，接下来就是接收方了，接收方肯定也需要先配置地址信息

信息是一样的，直接从publisher里复制到consumer的application.yml里即可

编写消息接收代码

```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {

    // 监听simple.queue的消息
    @RabbitListener(queues = "simple.queue")
    public void listenSimpleQueueMessage(String msg){
        System.out.println(msg);
    }

}
```

运行`ConsumerApplication`，启动后控制台就会打印消息了

并且回到Mq的主页，之前的存储在队列的消息也不见了，获取后就自动删除了

SpringAMQP如何接收消息？

- 引入amqp的starter依赖
- 配置RabbitMQ地址
- 定义类，添加@Component注解
- 类中声明方法，添加@RabbitListener注解，方法参数就是对应的消息

主要：消息一旦被消费就会从队列中删除，RabbitMQ没有消息回溯功能

### Work Queue工作队列

Work queue，工作队列，可以提高消息处理速度，避免队列消息堆积

Work queue与基础消息队列不同的是，它有两个消费者，可以均匀的来分别处理消息，减少单个消费者的压力

<img src="https://s2.loli.net/2024/01/24/hbHomfuwrMPDg47.png" alt="image-20240124193630039" style="zoom:50%;" />

 模拟WorkQueue，实现一个队列绑定多个消费者

基本思路如下：

1. 在publisher服务中定义测试方法，每秒产生50条消息，发送到simple.queue
2. 在consumer服务中定义两个消息监听者，都监听simple.queue队列
3. 消息者1每秒处理50条消息，消费者2每秒处理10条消息

变为每秒产生50条消息

```java
@Test
public void testSend2WorkQueue() throws InterruptedException {
    String queueName = "simple.queue";
    String message = "Hello Work message_";
    for (int i = 0; i < 50; i++) {
        rabbitTemplate.convertAndSend(queueName,message + i);
        Thread.sleep(20);
    }
}
```

消息消费者变为两个消费者

```java
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class SpringRabbitListener {

//    // 监听simple.queue的消息
//    @RabbitListener(queues = "simple.queue")
//    public void listenSimpleQueueMessage(String msg){
//        System.out.println(msg);
//    }

    @RabbitListener(queues = "simple.queue")
    public void listenWorkQueue1Message(String msg) throws InterruptedException {
        System.out.println("消费者1------------:"+msg);
        Thread.sleep(20);
    }

    @RabbitListener(queues = "simple.queue")
    public void listenWorkQueue2Message(String msg) throws InterruptedException {
        System.out.println("消费者2:==========="+msg);
        Thread.sleep(200);
    }

}
```

此时我们想达成的效果是，消费者1多消费一些，消费者2少消费一些

此时重启运行，会发现两者消费的内容依然是平均的，只是变成了谁先消费而已

出现这种情况是因为，两个消费者都会有消息预取的情况，就是说，提前获取消息到消费者上，一个一个的慢慢处理消息

我们可以配置预取消息的上限来解决这个问题

```yaml
logging:
  pattern:
    dateformat: MM-dd HH:mm:ss:SSS
spring:
  rabbitmq:
    port: 5672
    username: eastwind
    password: 123
    virtual-host: /
    host: 192.168.200.129
    listener:
      simple:
        prefetch: 1   # 每次只能获取一条消息,处理完成才能获取下一条消息
```

此时消费者1的消费就变得很多了，因为消费者2的堵塞时间很长

总结：

Work模型的使用：

- 多个消费者绑定到一个队列，同一条消息只会被一个消费者处理
- 通过设置prefetch来控制消费者预取的消息数量

### 发布订阅模型介绍

发布订阅模式与之前案例的区别就是允许将同一消息发送给多个消费者。实现方式是加入了exchange(交换机)。

常见的exchange类型包括：

- Fanout：广播
- Direct：路由
- Topic：话题

<img src="https://s2.loli.net/2024/01/24/9ZGtUoe2jxkBdWM.png" alt="image-20240124210710571" style="zoom:50%;" />

注意：exchange负责路由消息，而不是存储，若路由失败则消息丢失

### FanoutExchange

Fanout Exchange 会将接收到的消息路由到每一个跟其绑定的queue

简单来说，就是这个交换机在接收到消息后，会给每个队列都发一份消息

<img src="https://s2.loli.net/2024/01/25/Cead8sn5ypjF7t4.png" alt="image-20240125102224788" style="zoom:50%;" />

利用SpringAMQP演示FanoutExchange

实现思路如下：

1. 在consumer服务中，利用代码声明队列、交换机，并将两者绑定
2. 在consumer服务中，编写两个消费者方法，分别监听fanout.queue1和fanout.queue2
3. 在publisher中编写测试方法，向eastwind.fanout发送消息

Exchange的体系结构

![image-20240125104402433](https://s2.loli.net/2024/01/25/oi2EtagQh6lJdu3.png)

FanoutExchange是Exchange的实现类，直接new就可以

在consumer里新建一个配置类

```java
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FanoutConfig {

    // 声明fanout交换机
    @Bean
    public FanoutExchange fanoutExchange(){
        return new FanoutExchange("eastwind.fanout");
    }

    // 声明队列1
    @Bean
    public Queue fanoutQueue1(){
        return new Queue("fanout.queue1");
    }

    // 声明队列2
    @Bean
    public Queue fanoutQueue2(){
        return new Queue("fanout.queue2");
    }

    // 将队列1绑定到fanout上
    @Bean
    public Binding fanoutBuilder(Queue fanoutQueue1, FanoutExchange fanoutExchange){
        return BindingBuilder
                .bind(fanoutQueue1)
                .to(fanoutExchange);
    }

    // 将队列2绑定到fanout上
    @Bean
    public Binding fanoutBuilder2(Queue fanoutQueue2, FanoutExchange fanoutExchange){
        return BindingBuilder
                .bind(fanoutQueue2)
                .to(fanoutExchange);
    }


}
```

启动该程序，访问mq的主页，是否存在对应的exchange和queue

接着我们实现消息的发布与订阅

先编写consumer的接收消息

```java
@RabbitListener(queues = "fanout.queue1")
public void listenToFanout1(String msg) throws InterruptedException {
    System.out.println("消费者1:==========="+msg);
}

@RabbitListener(queues = "fanout.queue2")
public void listenToFanout2(String msg) throws InterruptedException {
    System.out.println("消费者2:==========="+msg);
}
```

重启服务，并编写消息的发送

```java
@Test
public void testSendFanoutExchange() {
    // 交换机名称
    String exchangeName = "eastwind.fanout";
    // 消息
    String message = "hello fanout";
    // 交换机名称,routingKey,消息
    // routingKey暂时不用管，后面会说
    rabbitTemplate.convertAndSend(exchangeName,"",message);
}
```

运行程序，会发现两个队列中都收到了消息
总结：

交换机的作用是什么？

- 接收publisher发送的消息
- 将消息按照规则路由到与之绑定的队列
- 不能缓存消息，路由失败，消息丢失
- FanoutExchange的会将消息路由到每个绑定的队列

声明队列、交换机、绑定关系的Bean是什么？

- Queue
- FanoutExchange
- Binding

### DirectExchange

DirectExchange会将接受到的消息根据规则路由到指定Queue，因此称为路由模式(routes)。

- 每一个Queue都与Exchange设置一个BindingKey
- 发布者发送消息时，指定消息的RoutingKey
- Exchange将消息路由到BindingKey与消息RoutingKey一致的队列

以下图为例：假设queue1有已经设置好的bindingKey:red和blue，而queue2有已经设置好的yellow和red，当exchange拿着routingKey为yellow的，就会发送给bindingKey为yellow的，也就是queue2，假设exchange拿着routingKey为red的，此时两边都会接收到消息

![image-20240125135550224](https://s2.loli.net/2024/01/25/7GmNxIArqKHTcyj.png)

实现思路如下：

1. 利用@RabbitListener声明Exchange、Queue、RoutingKey
2. 在consumer服务中，编写两个消费者方法，分别监听direct.queuq1和direct.queue2
3. 在publisher中编写测试方法，向itcast.direct发送消息

在SpringRabbitListener里进行exchange和queue的声明

```java
@RabbitListener(
    bindings = @QueueBinding(
        value = @Queue(name = "direct.queue1"),
        exchange = @Exchange(name = "eastwind.direct",type = ExchangeTypes.DIRECT),
        key = {"red","blue"}
    )
)
public void listenDirectQueue1(String msg) throws InterruptedException {
    System.out.println("消费者1接收到direct.queue1的消息:==========="+msg);
}

@RabbitListener(
    bindings = @QueueBinding(
        value = @Queue(name = "direct.queue2"),
        exchange = @Exchange(name = "eastwind.direct",type = ExchangeTypes.DIRECT),
        key = {"red","yellow"}
    )
)
public void listenDirectQueue2(String msg) throws InterruptedException {
    System.out.println("消费者1接收到direct.queue2的消息:==========="+msg);
}
```

这里使用的是注解形式的绑定，更方便快捷

重启服务，查看mq主页是否出现了队列和交换机

编写测试方法，变化不大

```java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "eastwind.direct";
    // 消息
    String message = "hello direct";
    rabbitTemplate.convertAndSend(exchangeName,"red",message);
}
```

运行测试，查看是否两个消费者都收到了消息

修改测试，查看direct.queue1是否收到消息

```java
@Test
public void testSendDirectExchange() {
    // 交换机名称
    String exchangeName = "eastwind.direct";
    // 消息
    String message = "hello direct";
    rabbitTemplate.convertAndSend(exchangeName,"blue",message);
}
```

总结：

描述Direct交换机与Fanout交换机的差异？

- Fanout交换机将消息路由给每一个与之绑定的队列
- Direct交换机根据RoutingKey判断路由给哪个队列
- 如果多个队列具有相同的RoutingKey，则与Fanout功能类似

基于@RabbitListener注解声明队列与交换机有哪些常见注解？

- @Queue
- @Exchange

### TopicExchange

TopicExchange与DirectExchange类似，区别在于routingKey必须是多个单词的列表，并以`.`分割

Queue与Exchange指定BindingKey时可以使用通配符：

#：代指0个或多个单词

*：代指一个单词

类似于模糊查询这种

<img src="https://s2.loli.net/2024/01/25/153IuDTCx6Xnk8o.png" alt="image-20240125143829156" style="zoom:50%;" />

和普通交换机没啥区别，只是多了一个模糊匹配的routingKey

```java
@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue1"),
        exchange = @Exchange(name = "exchange.topic",type = ExchangeTypes.TOPIC),
        key = "china.#"
))
public void listenTopicQueue1(String msg){
    System.out.println("topic.queue1的消息:==========="+msg);
}

@RabbitListener(bindings = @QueueBinding(
        value = @Queue(name = "topic.queue2"),
        exchange = @Exchange(name = "exchange.topic",type = ExchangeTypes.TOPIC),
        key = "#.news"
))
public void listenTopicQueue2(String msg){
    System.out.println("topic.queue2的消息:==========="+msg);
}
```

重启服务，查看mq主页是否出现了队列和交换机

编写发送代码

china.news的测试情况应该是两个都能收到对应的消息

```java
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "exchange.topic";
    // 消息
    String message = "hello topic";
    rabbitTemplate.convertAndSend(exchangeName,"china.news",message);
}
```

a.news的测试情况应该是topic2能收到

```java
@Test
public void testSendTopicExchange() {
    // 交换机名称
    String exchangeName = "exchange.topic";
    // 消息
    String message = "hello topic";
    rabbitTemplate.convertAndSend(exchangeName,"a.news",message);
}
```

### 消息转化器

我们现在发送的消息一直是String类型，如果消息发的是Object类型会怎么样呢？

我们先在FanoutConfig编写一个测试queue，等会发object的message都在这个queue里

```java
@Bean
public Queue objectQueue(){
    return new Queue("object.queue");
}
```

重启服务，编写消息的发送

```java
@Test
public void testSendObj() {
    Map msg = new HashMap();
    msg.put("name","hello");
    msg.put("age",21);
    rabbitTemplate.convertAndSend("object.queue",msg);
}
```

运行测试后，在mq中的object.queue队列查看信息

![image-20240125152733086](https://s2.loli.net/2024/01/25/8EH4iN5CPRItbXr.png)

此时，我们发现，消息乱码了，这是因为消息采用的是Java中的序列化方式，导致传输过来的内容是字节的形式

我们应该如何修改呢

Spring的对消息处理是由org.springframework.amqp.support.converter.MessageConverter来处理的。而默认实现是SimpleMessageConverter，基于JDK的ObjectOutputStream完成序列化。

如果要修改，只需要定义一个MessageConverter类型的Bean即可。推荐用JSON方式序列化，步骤如下：

在父工程引入JSON序列化依赖：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

在publisher服务中声明MessageConverter的Bean

这里我声明在了启动类上

```java
@Bean
public MessageConverter messageConverter(){
    return new Jackson2JsonMessageConverter();
}
```

重新发消息测试，此时发送的消息就是正常的了

此时如果要接收消息，也需要定义消息转换器

步骤是一致的：引入依赖，添加消息转换器，定义消费者监听消息

依赖已经在父工程引入过了，所以不需要二次引入了

消息转换器和之前是一样的，还是放在启动类里

这里接收消息时，**也需要使用Map**，因为发送时是Map，需要使用一个类型

```java
@RabbitListener(queues = "object.queue")
    public void listenObj(Map msg) throws InterruptedException {
        System.out.println("==========="+msg);
    }
```

重启服务

总结：

SpringAMQP中消息的序列化和反序列化是怎么实现的？

- 利用MessageConverter实现的，默认是JDK的序列化
- 注意发送方与接收方必须使用相同的MessageConverter

# ES

## 什么是ES

ES，又称elasticsearch，是一款非常强大的开源搜索引擎，可以帮助我们从海量数据中快速找到需要的内容。

elastucsearch结合kibana、Logstash、Beats，也就是elastic stack(ELK)。被广泛应用在日志数据分析、实时监控等领域。

elasticsearch是elastic stack的核心，负责存储、搜索、分析数据。

<img src="https://s2.loli.net/2024/01/25/2JeWPcZQgjT4uk9.png" alt="image-20240125174209259" style="zoom:50%;" />

而elasticsearch的底层是Lucene

Lucene是一个Java语言的搜索引擎类库，是Apache公司的顶级项目，由DougCutting于1999年研发。

官网地址：https://lucene.apache.org/

Luecene的优势：

- 易拓展
- 高性能(基于倒排索引)

Luecene的缺点：

- 只限于Java语言开发
- 学习曲线陡峭
- 不支持水平拓展

2004年Shay Banon基于Lucene开发了Compass

2010年Shay Banon重写了Compass，取名Elasticseach

官网地址：https://www.elastic.co/cn/

目前最新的版本是：7.12.1

相比于lucene，elasticsearch具备下列优势：

- 支持分布式，可水平拓展
- 提供Restful接口，可被任何语言调用

总结：

什么是elasticsearch？

- 一个开源的分布式搜索引擎，可以用来实现搜索、日志统计、分析、系统监控等功能

什么是elastic stack（ELK）？

- 是以elasticsearch为核心的技术栈，包括beats、Logstash、kibana、elasticsearch

什么是Lucene？

- 是Apache的开源搜索引擎类库，提供了搜索引擎的核心API

## 正向索引和倒排索引

传统数据库(如MySql)采用正向索引，例如给下表(tb_goods)中的id创建索引：

它会逐条搜索，查看是否包含，如果包含，就存入结果集，否则丢弃

<img src="https://s2.loli.net/2024/01/25/btYgOqoaBPr4sWJ.png" alt="image-20240125181424096" style="zoom:50%;" />

elasticsearch采用倒排索引：

- 文档(document)：每条数据就是一个文档
- 词条(term)：文档按照语义分成的词语

查询时，也会对查询的条件进行分词，再到倒排索引的表中根据分词后的结果查询词条，会得到一连串的文档id，存入结果集中，最后可以根据文档id去正向索引表中查询结果集

<img src="https://s2.loli.net/2024/01/25/vatKZeOTkPpYAsC.png" alt="image-20240125182500051" style="zoom:50%;" />

总结：

什么是文档和词条？

- 每一条数据就是一个文档
- 对文档中的内容分词，得到的词语就是词条

什么是正向索引？

- 基于文档id创建索引。查询词条时必须先找到文档，而后判断是否包含词条

什么是倒排索引？

- 是对文档内容分词，对词条创建索引，并记录词条所在文档的信息。查询时先根据词条查询到文档id，而后获取到文档

## es与mysql的对比

elasticsearch是面向文档存储的，可以是数据库中的一条商品数据，一个订单信息。

文档数据会被序列化为json格式后存储在elasticsearch中

<img src="https://s2.loli.net/2024/01/25/LWvo3cjDmYOUByx.png" alt="image-20240125185712060" style="zoom:50%;" />

索引：

- 索引(index)：相同类型的文档的集合
- 映射(mapping)：索引中文档的字段约束信息，类似于表的结构约束

<img src="https://s2.loli.net/2024/01/25/XydB1gSl4hfHv5o.png" alt="image-20240125190238145" style="zoom:50%;" />

### 概念对比

![image-20240125190724388](https://s2.loli.net/2024/01/25/w4HANjXyWTume7d.png)

Mysql：擅长事务类型操作，可以确保数据的安全和一致性

Elasticsearch：擅长海量数据的搜索、分析、计算

一般情况下呢，写操作都会写入到mysql中，而读操作都会通过es来读取，此时，这俩都需要有数据，那么从mysql中写入的数据，如何让es中也有呢，这就涉及到了数据同步了，将mysql中的数据同步到es中即可

总结：

文档：一条数据就是一个文档，es中文档是json格式

字段：json文档中的字段

索引：同类型文档的集合

映射：索引中文档的约束，比如字段名称、类型

elasticsearch与数据库的关系：

- 数据库负责事务类型操作
- elasticsearch负责海量数据的搜索、分析、计算

## 安装es、kibana

### 单点部署es

因为我们还需要部署kibana容器，因此需要让es和kibana容器互联。这里先创建一个网络：

```sh
docker network create es-net
```

这里我们采用elasticsearch的7.12.1版本的镜像，这个镜像体积非常大，接近1G。不建议大家自己pull。

课前资料提供了镜像的tar包

将其上传到虚拟机中，然后运行命令加载即可：

```sh
# 导入数据
docker load -i es.tar
```

同理还有`kibana`的tar包也需要这样做。

运行docker命令，部署单点es：

```sh
docker run -d \
	--name es \
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
    -e "discovery.type=single-node" \
    -v es-data:/usr/share/elasticsearch/data \
    -v es-plugins:/usr/share/elasticsearch/plugins \
    --privileged \
    --network es-net \
    -p 9200:9200 \
    -p 9300:9300 \
elasticsearch:7.12.1
```

命令解释：

- `-e "cluster.name=es-docker-cluster"`：设置集群名称
- `-e "http.host=0.0.0.0"`：监听的地址，可以外网访问
- `-e "ES_JAVA_OPTS=-Xms512m -Xmx512m"`：内存大小
- `-e "discovery.type=single-node"`：非集群模式
- `-v es-data:/usr/share/elasticsearch/data`：挂载逻辑卷，绑定es的数据目录
- `-v es-logs:/usr/share/elasticsearch/logs`：挂载逻辑卷，绑定es的日志目录
- `-v es-plugins:/usr/share/elasticsearch/plugins`：挂载逻辑卷，绑定es的插件目录
- `--privileged`：授予逻辑卷访问权
- `--network es-net` ：加入一个名为es-net的网络中
- `-p 9200:9200`：端口映射配置



在浏览器中输入：http://yourIp:9200 即可看到elasticsearch的响应结果

### 部署kibana

kibana可以给我们提供一个elasticsearch的可视化界面，便于我们学习。

运行docker命令，部署kibana

```sh
docker run -d \
--name kibana \
-e ELASTICSEARCH_HOSTS=http://es:9200 \
--network=es-net \
-p 5601:5601  \
kibana:7.12.1
```

- `--network es-net` ：加入一个名为es-net的网络中，与elasticsearch在同一个网络中
- `-e ELASTICSEARCH_HOSTS=http://es:9200"`：设置elasticsearch的地址，因为kibana已经与elasticsearch在一个网络，因此可以用容器名直接访问elasticsearch
- `-p 5601:5601`：端口映射配置

kibana启动一般比较慢，需要多等待一会，可以通过命令：

```sh
docker logs -f kibana
```

查看运行日志，当查看到下面的日志，说明成功：

此时，在浏览器输入地址访问：http://yourIp:5601，即可看到结果

点击按钮

![image-20240125204607559](https://s2.loli.net/2024/01/25/9snu8IREA4KgPQm.png)

<img src="https://s2.loli.net/2024/01/25/HRZPGho34edQCvs.png" alt="image-20240125205244339" style="zoom: 33%;" />

我们可以在Dev tools中模拟一下Get请求，之前在访问ES主页时，其实也是发了一个get请求，我们来模拟一下

<img src="https://s2.loli.net/2024/01/25/4AxyPRVzwOeTb3H.png" alt="image-20240125205918964" style="zoom: 33%;" />

## 安装IK分词器

es在创建倒排索引时，需要对文档进行分词；在搜索时，需要对用户输入内容分词。但默认的分词规则则对中文处理并不友好。我们在kibana的DevTools中测试：

```es
POST /_analyze
{
  "analyzer": "english",
  "text": "EastWind 太喜欢学Java啦！"
}
```

语法说明：

- POST：请求方式
- /_analyze：请求路径，这里省略你的IP和端口，有kibana帮我们补充
- 请求参数，json风格：
	- analyzer：分词器类型，这里是默认的standard分词器
	- text：要分词的内容

```json
{
  "tokens" : [
    {
      "token" : "eastwind",
      "start_offset" : 0,
      "end_offset" : 8,
      "type" : "<ALPHANUM>",
      "position" : 0
    },
    {
      "token" : "太",
      "start_offset" : 9,
      "end_offset" : 10,
      "type" : "<IDEOGRAPHIC>",
      "position" : 1
    },
    {
      "token" : "喜",
      "start_offset" : 10,
      "end_offset" : 11,
      "type" : "<IDEOGRAPHIC>",
      "position" : 2
    },
    {
      "token" : "欢",
      "start_offset" : 11,
      "end_offset" : 12,
      "type" : "<IDEOGRAPHIC>",
      "position" : 3
    },
    {
      "token" : "学",
      "start_offset" : 12,
      "end_offset" : 13,
      "type" : "<IDEOGRAPHIC>",
      "position" : 4
    },
    {
      "token" : "java",
      "start_offset" : 13,
      "end_offset" : 17,
      "type" : "<ALPHANUM>",
      "position" : 5
    },
    {
      "token" : "啦",
      "start_offset" : 17,
      "end_offset" : 18,
      "type" : "<IDEOGRAPHIC>",
      "position" : 6
    }
  ]
}
```

英文的分词没有任何问题，但是中文分词后是一个一个的汉字，这显然是有问题的

### 在线安装IK(较慢)

```sh
# 进入容器内部
docker exec -it elasticsearch /bin/bash

# 在线下载并安装
./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip

#退出
exit
#重启容器
docker restart elasticsearch
```

### 离线安装IK插件(推荐)

安装插件需要知道elasticsearch的plugins目录位置，而我们用了数据卷挂载，因此需要查看elasticsearch的数据卷目录，通过下面命令查看:

```sh
docker volume inspect es-plugins
```

显示结果：

```json
[
    {
        "CreatedAt": "2022-05-06T10:06:34+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/es-plugins/_data",
        "Name": "es-plugins",
        "Options": null,
        "Scope": "local"
    }
]
```

说明plugins目录被挂载到了：`/var/lib/docker/volumes/es-plugins/_data `这个目录中。

下面我们需要把课前资料中的ik分词器解压缩，重命名为ik

上传到es容器的插件数据卷中，也就是`/var/lib/docker/volumes/es-plugins/_data `

```shell
# 4、重启容器
docker restart es
```

```sh
# 查看es日志
docker logs -f es
```

### 测试ik分词

IK分词器包含两种模式：

* `ik_smart`：最少切分

* `ik_max_word`：最细切分

```es
POST /_analyze
{
  "analyzer": "ik_max_word",
  "text": "EastWind 太喜欢学Java啦！"
}
```

此时运行后，中文分词也没问题了

```json
{
  "tokens" : [
    {
      "token" : "eastwind",
      "start_offset" : 0,
      "end_offset" : 8,
      "type" : "ENGLISH",
      "position" : 0
    },
    {
      "token" : "太",
      "start_offset" : 9,
      "end_offset" : 10,
      "type" : "CN_CHAR",
      "position" : 1
    },
    {
      "token" : "喜欢",
      "start_offset" : 10,
      "end_offset" : 12,
      "type" : "CN_WORD",
      "position" : 2
    },
    {
      "token" : "学",
      "start_offset" : 12,
      "end_offset" : 13,
      "type" : "CN_CHAR",
      "position" : 3
    },
    {
      "token" : "java",
      "start_offset" : 13,
      "end_offset" : 17,
      "type" : "ENGLISH",
      "position" : 4
    },
    {
      "token" : "啦",
      "start_offset" : 17,
      "end_offset" : 18,
      "type" : "CN_CHAR",
      "position" : 5
    }
  ]
}
```

## ik-拓展词库

有些文字比较新颖，有些文字是禁忌，像一些不允许出现的文字或者一些ik中没有的文字，就需要进行拓展了

要拓展ik分词器的词库，只需要修改一个ik分词器目录中的config目录的IkAnalyzer.cfg.xml文件：

一般挂载后在：/var/lib/docker/volumes/es-plugins/_data/ik/config

在该文件夹找到IkAnalyzer.cfg.xml

```sh
vi IkAnalyzer.cfg.xml
```

![image-20240126175141318](https://s2.loli.net/2024/01/26/IxRY2sl9kfQ3DCZ.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 -->
        <entry key="ext_dict">ext.dic</entry>
         <!--用户可以在这里配置自己的扩展停止词字典-->
        <entry key="ext_stopwords">stopword.dic</entry>
        <!--用户可以在这里配置远程扩展字典 -->
        <!-- <entry key="remote_ext_dict">words_location</entry> -->
        <!--用户可以在这里配置远程扩展停止词字典-->
        <!-- <entry key="remote_ext_stopwords">words_location</entry> -->
</properties>
```

这里编写的ext.dic和stopword.dic是文件名，到时候ik会去读取里面的内容

```xml
<!--用户可以在这里配置自己的扩展字典 -->
        <entry key="ext_dict">ext.dic</entry>
         <!--用户可以在这里配置自己的扩展停止词字典-->
        <entry key="ext_stopwords">stopword.dic</entry>
```

新建对应的dic文件

```sh
touch ext.dic
touch stopword.dic
```

在ext.dic和stopword.dic编写想要存入的词汇

在stopword.dic中添加了一些英文单词，我们可以通过`cat stopword.dic`进行查看

编写完配置文件后，需要重启一下es

```sh
docker restart es
```

回到es的edvtools中，再次进行测试

```es
POST /_analyze
{
  "analyzer": "ik_smart",
  "text": "天王盖地虎，宝塔镇河妖"
}
```

我是在ext.dic中添加了拓展词汇，所以分词后，会得到以下结果，这里我让`analyzer`变为了`ik_smart`，就不会分很多的词汇了

```json
{
  "tokens" : [
    {
      "token" : "天王盖地虎",
      "start_offset" : 0,
      "end_offset" : 5,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "宝塔镇河妖",
      "start_offset" : 6,
      "end_offset" : 11,
      "type" : "CN_WORD",
      "position" : 1
    }
  ]
}
```

总结：

分词器的作用是什么？

- 创建倒排索引时对文档分词
- 用户搜索时，对输入的内容分词

IK分词器有几种模式？

- ik_smart：智能切分，粗粒度
- ik_max_word：最细切分，细粒度

IK分词器如何拓展词条？如何停用词条？

- 利用config目录的IKAnalyzer.cfg.xml文件添加拓展词典和停用词典
- 在词典中添加拓展词条或停用词条

## 索引库操作

### mapping属性

mappign是对索引库中文档的约束，常见的mapping属性包括：

- type：字段数据类型，常见的简单类型有：
	- 字符串：text(可分词的文本)、keyword(精确值，例如，品牌、国家、ip地址)
	- 数值：long、integer、short、byte、double、float
	- 布尔：boolean
	- 日期：date
	- 对象：object
- index：是否创建索引，默认为true
- analyzer：使用哪种分词器
- properties：该字段的子字段

总结：

mapping常见属性有哪些？

- type：数据类型
- index：是否索引
- analyzer：分词器
- properties：子字段

type常见的有哪些？

- 字符串：text、keyword
- 数字：long、integer、short、byte、double、float
- 布尔：boolean
- 日期：date
- 对象：object

### 创建索引库

ES中通过Restful请求操作索引库、文档。请求内容用DSL语句来表示。创建索引库和mapping的DSL语法如下：

```es
PUT /索引库名称
{
	"mappings":{
		"properties":{
			"字段名1":{
				"type":"text",
				"analyzer":"ik_smart"
			},
			"字段名2":{
				"type":"keyword",
				index:false
			},
			"字段名3":{
				"properties":{
                    "子字段":{
                        "type":"keyword"
                    }
                }
			},
		}
	}
}
```

这里尝试编写一个索引库

```es
# 创建索引库
PUT /eastwind
{
  "mappings": {
    "properties": {
      "info":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "email":{
        "type": "keyword",
        "index":false
      },
      "name":{
        "type": "object",
        "properties": {
          "firstName":{
            "type":"keyword"
          },
          "lastName":{
            "type":"keyword"
          }
        }
      }
    }
  }
}
```

### 查询、删除、修改索引库

查看索引库语法：

```es
GET /索引库名
```

删除索引库语法：

```es
DELETE /索引库名
```

修改索引库

索引库和mapping一旦创建无法修改，但是可以添加新的字段，语法如下：

```es
PUT /索引库名/_mapping
{
	"properties":{
		"新字段名":{
			"type":"integer"
		}
	}
}
```

示例：

```es
# 查询索引库
GET /eastwind

# 修改索引库,添加新的字段
PUT /eastwind/_mapping
{
  "properties":{
    "age":{
      "type":"integer"
    }
  }
}

# 查询索引库
GET /eastwind

# 删除索引库
DELETE /eastwind

# 查询索引库
GET /eastwind
```

总结：

索引库操作有哪些？

- 创建索引库：PUT /索引库名
- 查询索引库：GET /索引库名
- 删除索引库： DELETE/索引库名
- 添加字段： PUT/索引库名/_mapping

## 新增、删除、查询文档

新增文档的DSL语法如下：

不写文档id会随机给一个文档id

```es
POST /索引库名/_doc/文档id
{
	"字段1":"值1",
	"字段2":"值2",
	"字段3":{
		"子属性1":"值3",
		"子属性2":"值4"
	}
}
```

查看文档的语法：

```es
GET /索引库名/_doc/文档id
```

删除文档的语法：

```es
DELETE /索引库名/_doc/文档id
```

修改文档的语法：

方式一：全量修改，会删除旧文档，添加新文档

```es
PUT /索引库名/_doc/文档id
{
	"字段1":"值1",
	"字段2":"值2"
}
```

方式二：增量修改，修改指定字段值

```es
POST /索引库名/_update/文档id
{
	"doc":{
		"字段名":"值"
	}
}
```

示例：

```es
# 新增文档
POST /eastwind/_doc/1
{
  "email":"233@163.com",
  "info":"test",
  "name":{
    "firstName":"name1",
    "lastName":"name2"
  }
}

# 查看文档
GET /eastwind/_doc/1

# 全量修改文档,会删除旧文档,
PUT /eastwind/_doc/1
{
  "email":"667233@163.com",
  "info":"test667233",
  "name":{
    "firstName":"667233name1",
    "lastName":"667233name2"
  }
}

# 增量修改,修改指定文档值
POST /eastwind/_update/1
{
  "doc":{
    "name":{
      "firstName" : "667",
      "lastName" : "667"
    }
  }
}

# 删除文档
DELETE /eastwind/_doc/1
```

总结：

文档操作有哪些？

- 创建文档：POST /索引库/_doc/文档id	{json文档}
- 查询文档：GET    /索引库名/_doc/文档id
- 删除文档：DELETE    /索引库名/_doc/文档id
- 修改文档：
	- 全量修改：PUT /索引库名/_doc/文档id	{json文档}
	- 增量修改：POST   /索引库名/_update/文档id	{"doc":{字段}}

**注意**：插入文档时，es会检查文档中的字段是否有mapping，如果没有则按照默认mapping规则来创建索引。如果默认mapping规则不符合你的需求，一定要自己设置字段mapping

## RestClient操作索引库

ES官方提供了各种不同语言的客户端，用来操作ES。这些客户端的本质就是组装DSL语句，通过http请求发送给ES。官方文档地址：https://www.elastic.co/guide/en/elasticsearch/client/index.html

## 索引库demo

这里通过一个案例来学习如何操作索引库

利用JavaRestClient实现创建、删除索引库，判断索引库是否存在

根据资料提供的酒店数据创建索引库，索引库名为hotel，mapping属性根据数据库结构定义

基本步骤如下：

1. 导入资料demo
2. 分析数据结构，定义mapping属性
3. 初始化JavaRestClient
4. 利用JavaRestClient创建索引库
5. 利用JavaRestClient删除索引库
6. 利用JavaRestClient判断索引库是否存在

新建数据库

```sql
CREATE DATABASE heima
```

在数据库中运行对应的sql文件

在IDEA中打开资料中的hotel-demo

### 分析数据结构

mapping要考虑的问题：

字段名、数据类型、是否参与搜索、是否分词，如果分词，分词器是什么？

<img src="https://s2.loli.net/2024/01/27/KhqLW76ltjnexiT.png" alt="image-20240127095356039" style="zoom: 67%;" />

根据上图的表，我们来编写索引库的信息

在写之前需要先说明，在ES中支持两种地理坐标数据类型：

- geo_point：由纬度(latitude)和经度(longitude)确定的一个点。例如：上述的latitude和longitude
- geo_shape：有多个geo_point组成的复杂几何图形。例如一条直线

字段拷贝可以使用copy_to属性将当前字段拷贝到指定字段，例如：

```es
"all":{
	"type":"text",
	"analyzer":"ik_max_word"
},
"brand":{
	"type":"keyword",
	"copy_to":"all"
}
```

编写对应的索引库

```es
# 编写对应的索引库信息
PUT /hotel
{
  "mappings": {
    "properties": {
      "id":{
        "type": "keyword"
      },
      "name":{
        "type": "text",
        "analyzer": "ik_max_word",
        "copy_to": "all"
      },
      "address":{
        "type": "text",
        "index": false
      },
      "price":{
        "type": "integer"
      },
      "score":{
        "type": "integer"
      },
      "brand":{
        "type": "keyword"
      },
      "city":{
        "type": "keyword"
      },
      "star_name":{
        "type": "keyword"
      },
      "business":{
        "type": "keyword",
        "copy_to": "all"
      },
      "location":{
        "type": "geo_point"
      },
      "pic":{
        "type": "keyword",
        "index": false
      },
      "all":{
        "type": "text",
        "analyzer": "ik_max_word"
      }
    }
  }
}
```

这里的location是地址坐标，geo_point说明是以一个点为位置，all是用于将其他的查询参数作为一个整体，比如说business、name，通过all来查询的话，只需要提供business和name的其中之一都可以查询出对应的内容

### 初始化RestClient

引入es的RestHighLevelClient依赖：

```xml
<dependency>
            <groupId>org.elasticsearch.client</groupId>
            <artifactId>elasticsearch-rest-high-level-client</artifactId>
            <version>7.12.1</version>
</dependency>
```

因为SpringBoot默认的ES版本是7.6.2所以我们需要覆盖默认的ES版本

```xml
<properties>
    <java.version>1.8</java.version>
    <elasticsearch.version>7.12.1</elasticsearch.version>
</properties>
```

初始化client

```java
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class HotelIndexTest {

    private RestHighLevelClient client;

    @Test
    void init(){
        System.out.println(client);
    }

    // 创建client
    @BeforeEach
    void setUp(){
        this.client = new RestHighLevelClient(RestClient.builder(
                // ip写自己的,如果需要集群创建就写多个httpHost.create
                HttpHost.create("http://192.168.200.129:9200")
        ));
    }


    // 结束时,移除client
    @AfterEach
    void afterAll() throws IOException {
        this.client.close();
    }
}
```

### 创建索引库

```java
 @Test
    void createHotelIndex() throws IOException {
        // 创建Request对象,里面指定了索引库的名称
        CreateIndexRequest hotel = new CreateIndexRequest("hotel");
        // 准备请求的参数:DSL语句,这里指定创建的内容格式为json,由于代码过于臃肿,这里创建常量类放置对应的值
        hotel.source(HotelIndexConstant.MAPPING_TEMPLATE, XContentType.JSON);
        // 发送请求,方式为默认
        client.indices().create(hotel, RequestOptions.DEFAULT);
    }
```

常量类

```java
public class HotelIndexConstant {

    public static String MAPPING_TEMPLATE = "{\n" +
            "  \"mappings\": {\n" +
            "    \"properties\": {\n" +
            "      \"info\":{\n" +
            "        \"type\": \"text\",\n" +
            "        \"analyzer\": \"ik_smart\"\n" +
            "      },\n" +
            "      \"email\":{\n" +
            "        \"type\": \"keyword\",\n" +
            "        \"index\":false\n" +
            "      },\n" +
            "      \"name\":{\n" +
            "        \"type\": \"object\",\n" +
            "        \"properties\": {\n" +
            "          \"firstName\":{\n" +
            "            \"type\":\"keyword\"\n" +
            "          },\n" +
            "          \"lastName\":{\n" +
            "            \"type\":\"keyword\"\n" +
            "          }\n" +
            "        }\n" +
            "      }\n" +
            "    }\n" +
            "  }\n" +
            "}";

}
```

运行测试，成功后回到es主页进行查看

```es
GET /hotel
```

### 删除、判断索引库是否存在

```java
// 删除索引库
@Test
void deleteHotelIndex() throws IOException {
    DeleteIndexRequest hotel = new DeleteIndexRequest("hotel");
    client.indices().delete(hotel,RequestOptions.DEFAULT);
}

// 判断索引库是否存在
@Test
void decideHotel() throws IOException {
    GetIndexRequest hotel = new GetIndexRequest("hotel");
    boolean exists = client.indices().exists(hotel, RequestOptions.DEFAULT);
    System.out.println(exists);
}
```

总结：

- 初始化RestHighLevelClient
- 创建xxxIndexRequest。XXX是CREATE、Get、Delete
- 准备DSL(CREATE时需要)
- 发送请求。调用RestHighLevelClient.indices().xxx()方法，xxx是create、exists、delete

## 文档demo

去数据库查询酒店数据，导入到hotel索引库，实现酒店数据的crud

基本步骤如下：

1. 初始化JavaRestClient
2. 利用JavaRestClient新增酒店数据
3. 利用JavaRestClient根据id查询酒店数据
4. 利用JavaRestClient删除酒店数据
5. 利用JavaRestClient修改酒店数据

### 初始化

```java
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

public class HotelTextTest {
    private RestHighLevelClient client;

    @Test
    void init(){
        System.out.println(client);
    }

    // 创建client
    @BeforeEach
    void setUp(){
        this.client = new RestHighLevelClient(RestClient.builder(
                // ip写自己的,如果需要集群创建就写多个httpHost.create
                HttpHost.create("http://192.168.200.129:9200")
        ));
    }


    // 结束时,移除client
    @AfterEach
    void afterAll() throws IOException {
        this.client.close();
    }

}
```

### 添加

```java
@Test
void add() throws IOException {
    // 创建Request对象,里面需要索引库的名称和id
    IndexRequest hotel = new IndexRequest("hotel").id("1");
    // 准备json数据
    hotel.source(
            "{\n" +
                    "  \"email\":\"233@163.com\",\n" +
                    "  \"info\":\"test\",\n" +
                    "  \"name\":{\n" +
                    "    \"firstName\":\"name1\",\n" +
                    "    \"lastName\":\"name2\"\n" +
                    "  }\n" +
                    "}", XContentType.JSON
    );
    // 发送请求
    client.index(hotel, RequestOptions.DEFAULT);
}
```

### 根据id查询

```java
@Test
void getById() throws IOException {
    // 创建request对象,参数1:索引库名称,参数2:文档id
    GetRequest hotel = new GetRequest("hotel", "1");
    // 发送请求
    GetResponse res = client.get(hotel, RequestOptions.DEFAULT);
    // 转为string类型
    String sourceAsString = res.getSourceAsString();
    System.out.println(sourceAsString);
}
```

### 修改文档数据

#### 全量更新

再次写入id一样的文档，就会删除旧文档，添加新文档，类似于删除之前的添加一个新的，区别不大，这里演示方式二

#### 局部更新

只更新部分字段

```java
@Test
void update() throws IOException {
    // 创建request对象
    UpdateRequest hotel = new UpdateRequest("hotel", "1");
    // 准备参数,每2个参数为一对key,value
    hotel.doc(
            "age",18,
            "email","2333"
    );
    client.update(hotel,RequestOptions.DEFAULT);
}
```

### 删除

```java
@Test
void delete() throws IOException {
    DeleteRequest hotel = new DeleteRequest("hotel", "1");
    client.delete(hotel,RequestOptions.DEFAULT);
}
```

### 批量导入

需求：批量查询酒店数据，然后批量导入酒店数据到ES

思路：

1. 利用mybatis-plus查询酒店数据
2. 将查询到的酒店数据(Hotel)转换为文档类型数据(HotelDoc)
3. 利用JavaRestClient的Bulk批处理，实现批量新增文档

```java
@Test
void multipleAdd() throws IOException {
    // 从数据库中查询对应数据
    List<Hotel> list = hotelService.list();
    BulkRequest request = new BulkRequest();
    // 添加采用indexRequest
    for (Hotel hotel : list) {
        // 转为HotelDoc并添加
        HotelDoc hotelDoc = new HotelDoc(hotel);
        // 添加到请求
        request.add(new IndexRequest("hotel")
                .id(hotelDoc.getId().toString())
                .source(JSON.toJSONString(hotelDoc)));
    }
    client.bulk(request,RequestOptions.DEFAULT);
}
```

### 总结

文档操作的基本步骤：

- 初始化RestHighLevelClient
- 创建xxxRequest。xxx是Index、Get、Update、Delete
- 准备参数(Index和Update时需要)
- 发送请求。调用RestHighLevelClient.xxx()，xxx是index、get、update、delete
- 解析结果（GET需要）


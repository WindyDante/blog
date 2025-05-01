---
title: mongoDB
date: 2024-08-28 13:55:32
tags: mongoDB
---


# MongoDB概念

MongoDB 是在2007年由DoubleClick公司的几位核心成员开发出的一款分布式文档数据库，由C++语言编写。

目的是为了解决数据大量增长的时候系统的可扩展性和敏捷性。MongoDB要比传统的关系型数据库简单很多。

在MongoDB中数据主要的组织结构就是`数据库、集合和文档`，文档存储在集合当中，集合存储在数据库中。

MongoDB中每一条数据记录就是一个文档，`数据结构由键值(key=>value)对组成`。

文档类似于 JSON 对象，它的数据结构被叫做`BSON`（Binary JSON）。

![image-20240828135720899](C:/Users/Administrator/AppData/Roaming/Typora/typora-user-images/image-20240828135720899.png)

下表将帮助您更容易理解MongoDB中的一些概念：

| RDBMS  | MongoDB  |
| ------ | -------- |
| 数据库 | 数据库   |
| 表格   | 集合     |
| 行     | 文档     |
| 列     | 字段     |
| 表联合 | 嵌入文档 |
| 主键   | _id      |

# MongoDB适用场景

MongoDB不需要去明确指定一张表的具体结构，对字段的管理非常灵活，有很强的可扩展性。

支持高并发、高可用、高可扩展性，自带数据压缩功能，支持海量数据的高效存储和访问。

支持基本的CRUD、数据聚合、文本搜索和地理空间查询功能。

**适用场景：**

- 网站数据：Mongo非常适合实时的插入，更新与查询，并具备网站实时数据存储所需的复制及高度伸缩性。
- 高伸缩性的场景：Mongo非常适合由数十或数百台服务器组成的数据库。
- 大尺寸，低价值的数据：使用传统的关系型数据库存储一些数据时可能会比较昂贵，在此之前，很多时候程序员往往会选择传统的文件进行存储。
- 缓存：由于性能很高，Mongo也适合作为信息基础设施的缓存层。在系统重启之后，由Mongo搭建的持久化缓存层可以避免下层的数据源过载。

**例如：**

弹幕、直播间互动信息、朋友圈信息、物流场景等

**不适用场合：**

- 高度事务性系统：例如银行系统。传统的关系型数据库目前还是更适用于需要大量原子性复杂事务的应用程序。
- 传统的商业智能应用：针对特定问题的BI数据库会对产生高度优化的查询方式。对于此类应用，数据仓库可能是更合适的选择。

# 安装和启动（docker方式）

## 拉取镜像

```shell
docker pull mongo:7.0.0
```

## 创建和启动容器

需要在宿主机建立文件夹

> rm -rf /opt/mongo
>
> mkdir -p /opt/mongo/data/db

```shell
docker run -d --restart=always -p 27017:27017 --name mongo -v /opt/mongo/data/db:/data/db mongo:7.0.0
```

## 进入容器

```shell
docker exec -it mongo mongosh
```

## 基本命令

```shell
show dbs
db.version() #当前db版本
db.getMongo() #查看当前db的链接机器地址
db.help() #帮助
quit() #退出命令行
```

#### 数据库操作

##### 创建数据库

如果数据库不存在，则创建数据库，否则切换到指定数据库。

```shell
use tingshu
```

##### 查看当前数据库

```
db.getName()
```

##### 显示当前数据库状态

```
db.stats()
```

##### 删除当前数据库

```
db.dropDatabase()
```



#### 集合操作

##### 创建集合

```shell
db.createCollection("User")
```

##### 删除集合

```shell
db.User.drop()
```



#### 文档操作

文档是一组键值(key-value)对。MongoDB 的文档不需要设置相同的字段，并且相同的字段不需要相同的数据类型，这与关系型数据库有很大的区别，也是 MongoDB 非常突出的特点。



**需要注意的是：**

1、MongoDB区分类型和大小写。

2、MongoDB的文档不能有重复的键。



##### insert

向User集合插入一条记录。可以预先使用createCollection方法创建集合，也可以不创建集合，直接插入数据，那么集合会被自动创建

```shell
db.User.insert({name:'zhangsan',age:21,sex:true})
```

##### query

查询当前User集合中所有的记录

```shell
db.User.find()
```

查询当前User集合中name是zhangsan的记录

```shell
db.User.find({name:"zhangsan"})
```

##### update

只更新匹配到的第一条记录

```shell
db.User.update({age:20}, {$set:{name:100}}) 
```

更新匹配到的所有记录

```shell
db.User.update({age:21}, {$set:{age:99}}, {multi: true})
```

##### remove

移除一个文档

```shell
db.User.remove(id)
```

移除所有文档

```shell
db.User.remove({}) 
```



**更多命令参考：**https://www.runoob.com/mongodb/mongodb-tutorial.html



### SpringBoot集成MongoDB

spring-data-mongodb提供了`MongoTemplate`与`MongoRepository`两种方式访问mongodb，MongoRepository操作简单，MongoTemplate操作灵活，我们在项目中可以灵活使用这两种方式操作mongodb。

#### 集成spring-data-mongodb

##### 搭建项目

1、创建项目：mongo_demo

2、导入pom.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.atguigu</groupId>
    <artifactId>mongo_demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--mongodb-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

3、添加配置文件

application.yml

```yaml
spring:
  data:
    mongodb:
      database: mong
      host: 192.168.100.101
      port: 27017
```



##### 添加实体

```java
package com.atguigu.mongo_demo.model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document("user") //指定mongodb中的集合名字
public class User {

    @Id
    private ObjectId id;
    private String name;
    private Integer age;
    private String email;
    private Date createDate;
}
```



#### MongoRepository

##### 添加Repository类

```java
package com.atguigu.mongo_demo.repository;

import com.atguigu.mongo_demo.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, ObjectId> {


}
```

##### 创建测试类

test目录创建测试类：MongoRepositoryTest

```java
package com.atguigu.mongo_demo;

import com.atguigu.mongo_demo.model.User;
import com.atguigu.mongo_demo.repository.UserRepository;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@SpringBootTest
public class MongoRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    //插入
    @Test
    public void testCreateUser(){

        User user = new User();
        user.setName("小谷");
        user.setAge(19);
        user.setCreateDate(new Date());
        userRepository.save(user);
    }

    //查询所有
    @Test
    public void testFindAll(){
        List<User> userList = userRepository.findAll();
        System.out.println(userList);
    }

    //根据id查询
    @Test
    public void testFindById(){

        Optional<User> optional = userRepository.findById(
                new ObjectId("64eee9dff317c823c62b4faf")
        );
        boolean present = optional.isPresent();
        if(present){
            User user = optional.get();
            System.out.println(user);
        }
    }

    //条件查询
    @Test
    public void testFindAllExample(){

        User user = new User();
        user.setAge(19);
        Example<User> example = Example.of(user);
        List<User> userList = userRepository.findAll(example);
        System.out.println(userList);
    }

    //排序查询
    @Test
    public void testFindAllSort(){
        Sort sort = Sort.by(Sort.Direction.DESC, "age");
        List<User> userList = userRepository.findAll(sort);
        System.out.println(userList);
    }

    //分页查询
    @Test
    public void testFindAllPage(){

        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<User> page = userRepository.findAll(pageRequest);
        int totalPages = page.getTotalPages();
        List<User> userList = page.getContent();
        System.out.println(userList);
        System.out.println(totalPages);
    }

    //更新
    @Test
    public void testUpdateUser(){

        //注意：先查询，再更新
        Optional<User> optional = userRepository.findById(
                new ObjectId("64eee9dff317c823c62b4faf")
        );
        if(optional.isPresent()){
            User user = optional.get();
            user.setAge(100);
            //user中包含id，就会执行更新
            userRepository.save(user);
            System.out.println(user);
        }
    }

    //删除
    @Test
    public void testDeleteUser(){
        userRepository.deleteById(
                new ObjectId("64eee9dff317c823c62b4faf")
        );
    }
}
```



#### MongoTemplate

test目录创建测试类：MongoTemplateTest

```java
package com.atguigu.mongo_demo;

import com.atguigu.mongo_demo.model.User;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;
import java.util.regex.Pattern;

@SpringBootTest
public class MongoTemplateTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    //添加
    @Test
    public void testCreateUser(){
        User user = new User();
        user.setAge(20);
        user.setName("test");
        user.setEmail("test@qq.com");
        mongoTemplate.insert(user);
        System.out.println(user);
    }

    //查询所有
    @Test
    public void testFindUser() {
        List<User> userList = mongoTemplate.findAll(User.class);
        System.out.println(userList);
    }

    //根据id查询
    @Test
    public void testFindUserById(){
        User user = mongoTemplate.findById("64eeeae31711344f35635788", User.class);
        System.out.println(user);
    }

    //删除
    @Test
    public void testRemove() {
        Criteria criteria = Criteria.where("_id").is("64eeeae31711344f35635788");
        Query query = new Query(criteria);
        DeleteResult result = mongoTemplate.remove(query, User.class);
        long count = result.getDeletedCount();
        System.out.println(count);
    }

    //条件查询 and
    @Test
    public void findUserList() {

        Criteria criteria = Criteria.where("name").is("test").and("age").is(20);
        Query query = new Query(criteria);

        List<User> userList = mongoTemplate.find(query, User.class);
        System.out.println(userList);
    }

    //分页查询
    @Test
    public void findUsersPage() {
        Query query = new Query();
        //先查询总记录数
        long count = mongoTemplate.count(query, User.class);
        System.out.println(count);
        //后查询分页列表
        List<User> userList = mongoTemplate.find(query.skip(0).limit(2), User.class);
        System.out.println(userList);
    }
    
    //修改
    @Test
    public void testUpdateUser() {
        Criteria criteria = Criteria.where("_id").is("64eeeae31711344f35635788");
        Query query = new Query(criteria);
        Update update = new Update();
        update.set("name", "zhangsan");
        update.set("age", 99);
        UpdateResult result = mongoTemplate.upsert(query, update, User.class);//改一条
        //UpdateResult result = mongoTemplate.updateMulti(query, update, User.class);//改多条
        long count = result.getModifiedCount();
        System.out.println(count);
    }
}
```


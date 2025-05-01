---
title: Redis入门
tags: Redis
date: 2023-8-13
---

# Redis入门

- Redis是一个基于内存的`key-value`结构数据库
	- 基于内存存储，读写性能高
	- 适合存储热点数据（热点商品、咨询、新闻）
- 官网：`https://redis.io/`



# Redis的简介

- Redis是用C语言开发的一个开源的、高性能的键值对(key-value)数据库，官方提供的数据是可以达到100000+的QPS（每秒内查询次数）。它存储的value类型比较丰富，也被称为结构化NoSql数据库

- NoSql(Not Only Sql)，不仅仅是SQL，泛指非关系型数据库，NoSql数据库并不是要取代关系型数据库，而是关系型数据库的补充

	关系型数据库(RDBMS)：MySQL、Oracl、DB2、SQLServer
	非关系型数据库(NoSql)：Redis、Mongo DB、MemCached

- Redis应用场景：缓存、消息队列、任务队列、分布式锁



## 下载与安装

- 这里我们在Linux和Windows上都装一下
	- Windows 版：`https://github.com/microsoftarchive/redis/releases`
	- Linux 版：`https://download.redis.io/releases/`

### Windows安装Redis

- 直接下载对应版本的`.zip`压缩包，直接解压



### Linux安装Redis

- Linux系统安装Redis步骤：

	1. 将Redis安装包上传到Linux

	2. 解压安装包，改成自己的redis版本

		```bash
		tar -zxvf redis-4.0.0.tar.gz -C /usr/local/
		```

	3. 安装Redis的依赖环境gcc

		```bash
		# 安装依赖环境
		yum install gcc-c++
		```

	4. 进入`/usr/local/redis根目录`，进行编译

		```bash
		# 进入到根目录
		cd /usr/local/redis根目录
		
		# 编译
		make
		```

	5. 进入redis的src目录，进行安装

		```bash
		# 进入到src目录
		cd /usr/local/redis根目录/src
		# 进行安装
		make install
		```

		

## 服务启动与停止

### Linux启动与停止

- 进入到`/src`目录下，执行`redis-server`即可启动服务，默认端口号为`6379`

```bash
# 进入到根目录
cd /usr/local/redis/src

# 执行redis-server
./redis-server
```

​			

### Linux设置后台运行

进入到redis根目录下，修改配置redis.conf文件

```bash
# 进入到redis根目录下
cd /usr/local/redis

# 修改配置文件
vim redis.conf
```

找到`daemonize no`字段，将其修改为`daemonize yes`

在redis根目录以redis.conf作为配置文件在后台运行

```bash
src/redis-server ./redis.conf
```



### Linux开启密码校验

- 还是修改redis.conf配置文件，找到`requirepass`这行，将其注释去掉，并在后面写上自己的密码
- 然后杀掉原进程再重新启动

![image-20230804214017944](https://s2.loli.net/2023/08/14/lgT1NfVWrIxQCjY.png)

```bash
# 重新启动
src/redis-server ./redis.conf 

# 登录时同时进行认证（连接的是cli客户端服务，-h是本地服务，-p设置的是端口号，-a是auth也相当于密码）
src/redis-cli -h localhost -p 6379 -a 密码
```

修改完毕之后还是杀进程，然后重启服务

![image-20230804214221395](https://s2.loli.net/2023/08/14/wDLpANBq8C2hcJd.png)



### Linux开启远程连接

- 还是修改redis.conf配置文件，找到`bind 127.0.0.1`这行，把这行注释掉，这一行是让我们本地进行连接的，注释之后就是开启了远程连接
- 之后设置防火墙，开启6379端口
- 杀死进程，并重新启动服务

```bash
# 开启6379端口
firewall-cmd --zone=public --add-port=6379/tcp --permanent

# 设置立即生效
firewall-cmd --reload

# 查看开放的端口
firewall-cmd --zone=public --list-ports
```

最后在Windows的redis根目录下，按住Shift+右键打开PowerShell窗口，连接Linux的Redis

```bash
.\redis-cli.exe -h 虚拟机的ip地址 -p 6379 -a 密码
```



# Redis数据类型

## 介绍

Redis存储的是key-value结构的数据，其中key是字符串类型，value有五种常用的数据类型

- 字符串 string（普通字符串，常用）
- 哈希 hash（hash适合存储对象）
- 列表 list（list按照插入顺序排序，可以有重复元素）
- 集合 set（无序集合，没有重复元素）
- 有序集合 sorted set（有序集合，没有重复元素）



## Redis常用命令

### 字符串string操作命令

|          命令           |                      描述                       |
| :---------------------: | :---------------------------------------------: |
|      SET key value      |                 设置指定key的值                 |
|         GET key         |                 获取指定key的值                 |
| SETEX key seconds value | 设置指定key的值，并将key的过期时间设为seconds秒 |
|     SETNX key value     |          只有在key不存在时设置key的值           |

#### 操作命令示例:

```bash
127.0.0.1:6379> set name 666
OK
127.0.0.1:6379> get name
"666"
127.0.0.1:6379> setex name2 3 888
OK
127.0.0.1:6379> get name2
(nil)
127.0.0.1:6379> setnx name2 888
(integer) 1
127.0.0.1:6379> setnx name2 555
(integer) 0
127.0.0.1:6379> keys *
1) "name2"
2) "name"
127.0.0.1:6379> get name2
"888"
```

### 哈希hash操作命令

`Redis Hash`是一个`String`类型的`Field`和`Value`的映射表，`Hash`特别适合用于存储对象

|         命令         |                  描述                  |
| :------------------: | :------------------------------------: |
| HSET key field value | 将哈希表key 中的字段field的值设为value |
|    HGET key field    |     获取存储在哈希表中指定字段的值     |
|    HDEL key field    |      删除存储在哈希表中的指定字段      |
|      HKEYS key       |          获取哈希表中所有字段          |
|      HVALS key       |           获取哈希表中所有值           |
|     HGETALL key      |  获取在哈希表中指定key的所有字段和值   |

#### 操作命令示例

```bash
127.0.0.1:6379> hset table1 name wangwu			// 设置table1表中的name字段值为wangwu
(integer) 1
127.0.0.1:6379> hget table1 name				// 获取存储在table1表中的name字段
"wangwu"
127.0.0.1:6379> hdel table1 name				// 删除存储在table1表中的name字段
(integer) 1
127.0.0.1:6379> hget table1 name				// 此时已经被删除了，得到的是nil
(nil)
127.0.0.1:6379> hset table1 name lisi			// 设置table1表中的name字段值为lisi
(integer) 1
127.0.0.1:6379> hset table1 age 10				// 设置table1表中的age字段值为10
(integer) 1
127.0.0.1:6379> hkeys table1					// 获取哈希表中所有字段
1) "name"
2) "age"
127.0.0.1:6379> hvals table1					// 获取哈希表中所有值
1) "wangwu"
2) "10"
127.0.0.1:6379> hgetall table1					// 获取在哈希表中指定key的所有字段和值
1) "name"
2) "wangwu"
3) "age"
4) "10"
```



### 列表list操作命令

`Redis List`是简单的字符串列表，按照插入顺序排序

|            命令             |                             描述                             |
| :-------------------------: | :----------------------------------------------------------: |
| `LPUSH` key value1 [value2] |                 将一个或多个值插入到列表头部                 |
|   `LRANGE` key start stop   |                   获取列表指定范围内的元素                   |
|         `RPOP` key          |                  移除并获取列表最后一个元素                  |
|         `LLEN` key          |                         获取列表长度                         |
| `BRPOP` key1 [key2] timeout | 移出并获取列表的最后一个元素 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止 |

#### 操作命令示例

```bash
127.0.0.1:6379> lpush list a b c	// 将a、b、c插入到列表头部
(integer) 3
127.0.0.1:6379> lrange list 0 -1	// 查询从0到-1位置的元素,-1表示最后一个值
1) "c"	// c在最前面是因为列表是按照插入顺序排序的，最后插入的在最前面
2) "b"
3) "a"
127.0.0.1:6379> rpop list	// 删除最后一个元素，并得到值，a是最先插入的，所以是最后一个
"a"
127.0.0.1:6379> llen list	// 获取长度
(integer) 2
127.0.0.1:6379> brpop list 3  // 移除列表的最后一个元素，如果列表没有值，会阻塞timeout秒，否则删除
1) "list"
2) "b"
127.0.0.1:6379> brpop list 3
1) "list"
2) "c"
127.0.0.1:6379> brpop list 3	// 阻塞3秒
(nil)
(3.09s)
```

### 集合set操作命令

`Redis set`是`String`类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据
概念和数学中的集合概念基本一致

|            命令            |           描述           |
| :------------------------: | :----------------------: |
| SADD key member1 [member2] | 向集合添加一个或多个成员 |
|        SMEMBERS key        |   返回集合中的所有成员   |
|         SCARD key          |     获取集合的成员数     |
|     SINTER key1 [key2]     |  返回给定所有集合的交集  |
|     SUNION key1 [key2]     |  返回所有给定集合的并集  |
|     SDIFF key1 [key2]      |  返回给定所有集合的差集  |
| SREM key member1 [member2] | 移除集合中一个或多个成员 |

#### 操作命令示例

```bash
127.0.0.1:6379> sadd set a a b b c d	// 向set集合添加a、a、b、b、c、d
(integer) 4
127.0.0.1:6379> smembers set	// 由于集合的唯一性，所以，只有a、b、c、d
1) "d"
2) "c"
3) "b"
4) "a"
127.0.0.1:6379> scard set	// 获取长度
(integer) 4
127.0.0.1:6379> srem set a b c	// 删除集合中指定的对象
(integer) 3
127.0.0.1:6379> smembers set	
1) "d"
```

### 有序集合sorted set常用命令

`Redis Sorted Set`有序集合是`String`类型元素的集合，且不允许重复的成员。每个元素都会关联一个`double`类型的分数(`score`) 。`Redis`正是通过分数来为集合中的成员进行从小到大排序。有序集合的成员是唯一的，但分数却可以重复。

|                   命令                   |                          描述                          |
| :--------------------------------------: | :----------------------------------------------------: |
| ZADD key score1 member1 [score2 member2] | 向有序集合添加一个或多个成员，或者更新已存在成员的分数 |
|    ZRANGE key start stop [WITHSCORES]    |       通过索引区间返回有序集合中指定区间内的成员       |
|       ZINCRBY key increment member       |      有序集合中对指定成员的分数加上增量increment       |
|        ZREM key member [member …]        |             移除有序集合中的一个或多个成员             |

#### 操作命令示例

```bash
127.0.0.1:6379> zadd sortset 3 a 1 c 2 b	// 向集合sortset添加值与分数
(integer) 3
127.0.0.1:6379> zrange sortset 0 -1			// 查询，按照分数从小到大排序，最小的在最前面
1) "c"
2) "b"
3) "a"
127.0.0.1:6379> zincrby sortset 3 c			// 为字段c加3分
"4"
127.0.0.1:6379> zrange sortset 0 -1			// 查询，此时c>a>b在最下面
1) "b"
2) "a"
3) "c"
127.0.0.1:6379> zrem sortset a b c			// 删除有序集合元素
(integer) 3
127.0.0.1:6379> zrange sortset 0 -1
(empty list or set)
127.0.0.1:6379>
```

### 通用命令

针对key来操作

|     命令     |                           描述                           |
| :----------: | :------------------------------------------------------: |
| KEYs pattern |            查找所有符合给定模式(pattern)的key            |
|  EXISTs key  |                   检查给定key是否存在                    |
|   TYPE key   |                 返回key所储存的值的类型                  |
|   TTL key    | 返回给定key的剩余生存时间(TTL, time to live)，以秒为单位 |
|   DEL key    |               该命令用于在key存在是删除key               |

```bash
127.0.0.1:6379> keys *		// 查看所有的key
1) "name"
2) "table2"
3) "table1"
4) "NewName"
5) "set"
127.0.0.1:6379> exists name		// 查看某个key是否存在，存在返回1，不存在返回0
(integer) 1
127.0.0.1:6379> exists abc
(integer) 0
127.0.0.1:6379> type name	// 查看key的类型 
string
127.0.0.1:6379> type set
set
127.0.0.1:6379> type table1
hash
127.0.0.1:6379> ttl name		// 查看key的剩余存活时间，-1表示永久存活
(integer) -1
127.0.0.1:6379> setex test 10 test	// 设置test字段存活时间10s，值为test
OK
127.0.0.1:6379> ttl test	// 查看test
(integer) 8
127.0.0.1:6379> ttl test
(integer) 2
127.0.0.1:6379> keys *		// 查看所有key
1) "name"
2) "table2"
3) "table1"
4) "NewName"
5) "set"
127.0.0.1:6379> del name	// 删除name字段
(integer) 1
127.0.0.1:6379> keys *		// 查看所有key，此时name字段就不存在了
1) "table2"
2) "table1"
3) "NewName"
4) "set"
```



# 在Java中使用Redis

## 简介

- Redis的Java客户端有很多，官方推荐的有三种
	- `Jedis`
	- `Lettuce`
	- `Redisson`
- Spring对Redis客户端进行了整合，提供了SpringDataRedis，在Spring Boot项目中还提供了对应的Starter，即`spring-boot-starter-data-redis`



## Jedis

- 使用Jedis的步骤
	1. 获取连接
	2. 执行操作
	3. 关闭连接
- 在此之前我们需要导入一下Jedis的maven坐标

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.8.0</version>
</dependency>
```

编写测试类（测试之前记得打开Redis的服务）

```java
@SpringBootTest
class RedisTestApplicationTests {

    @Test
    void contextLoads() {
        //1. 获取连接
        Jedis jedis = new Jedis("localhost", 6379);
        //2. 执行具体操作
        jedis.set("name", "zhangsan");

        jedis.hset("stu", "name", "Jerry");
        jedis.hset("stu", "age", "18");
        jedis.hset("stu", "num", "4204000400");

        Map<String, String> map = jedis.hgetAll("stu");
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            String value = map.get(key);
            System.out.println(key + ":" + value);
        }
        String name = jedis.get("name");
        System.out.println(name);
        //3. 关闭连接
        jedis.close();
    }

}
```

Jedis我们了解一下即可，大多数情况下我们还是用SpringDataRedis的



## Spring Data Redis

SpringBoot项目中，可以使用SpringDataRedis来简化Redis（常用）

Spring Data Redis中提供了一个高度封装的类：RedisTemplate，针对jedis客户端中大量api进行了归类封装，将同一类型操作封装为operation接口，具体分类如下：

- ValueOperations：简单K-V操作
- SetOperations：set类型数据操作
- ZSetOperations：zset类型数据操作
- HashOperations：针对map类型的数据操作
- ListOperations：针对list类型的数据操作

使用SpringDataRedis，我们首先需要导入它的maven坐标

```xml
<!--Spring Boot-redis的依赖包-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

之后重新设置一下序列化器，防止出现乱码，在config包下创建`RedisConfig`配置类

键和值的序列化器都需要统一，不能单一的只统一一个，否则会乱码

```java
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig extends CachingConfigurerSupport {
    @Bean
    public RedisTemplate<Object, Object> redisTemplate(RedisConnectionFactory connectionFactory) {

        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<>();

        //默认的Key序列化器为：JdkSerializationRedisSerializer
        // 设置键的序列化器统一
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        // 设置值的序列化器统一
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());
        redisTemplate.setConnectionFactory(connectionFactory);

        return redisTemplate;
    }
}
```

随后配置一下连接redis的相关配置

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    #password: 123456
    database: 0 #操作的是0号数据库
    jedis:
      #Redis连接池配置
      pool:
        max-active: 8 #最大连接数
        max-wait: 1ms #连接池最大阻塞等待时间
        max-idle: 4 #连接池中的最大空闲连接
        min-idle: 0 #连接池中的最小空闲连接
```

**可以通过命令来改变自己操作的数据库，默认是0号**

在安装Redis的目录下有一个文件：`redis.windows.conf`

打开它，可以修改数据库的数量

![image-20230805141353134](https://s2.loli.net/2023/08/14/KSWzXx7TV3jcBPn.png)

### string操作

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

@SpringBootTest
class Demo1ApplicationTests {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void test1() {
        // 设置string
        redisTemplate.opsForValue().set("name","zhangsan");

        // 获得string
        String name = (String) redisTemplate.opsForValue().get("name");
        System.out.println(name);

        // 设置string的超时时间(timeout是一个long型变量,TimeUnit是一个工具类，可以设置秒分时这种)
        redisTemplate.opsForValue().set("key1","value1",10L, TimeUnit.SECONDS);

        // 当某个key不存在，才执行设置操作，否则不执行
        // 返回boolean类型的值，如果是true，说明执行成功，否则失败
        Boolean aBoolean = redisTemplate.opsForValue().setIfAbsent("key1", "value2");
        System.out.println(aBoolean);

    }
}
```

### hash操作

```java
@Test
void hashTest() {
    HashOperations hashOperations = redisTemplate.opsForHash();
    // put(哪个hash表，什么字段，什么值)
    hashOperations.put("4204000400", "name", "Hades");
    hashOperations.put("4204000400", "age", "18");
    hashOperations.put("4204000400", "hobby", "Apex");
    //获取map集合
    Map<String, String> map = hashOperations.entries("4204000400");
    Set<String> keySet = map.keySet();
    // 获取方式和Java的hash操作一致
    for (String hashKey : keySet) {
        System.out.println(hashKey + ":" + map.get(hashKey));
    }
    System.out.println("----------------");
    //只获取keys
    Set<String> keys = hashOperations.keys("4204000400");
    for (String key : keys) {
        System.out.println(key);
    }
    System.out.println("----------------");
    //只获取values
    List<String> values = hashOperations.values("4204000400");
    for (String value : values) {
        System.out.println(value);
    }
}
```

### list操作

```java
@Test
void listTest() {
    ListOperations listOperations = redisTemplate.opsForList();
    //存数据
    // 为testData列表添加A
    listOperations.leftPush("testData", "A");
    // 多值添加
    listOperations.leftPushAll("testData", "B", "C", "D");
    // 遵循先进后出原则，所以A是在最下面依次往上
    List<String> testDatas = listOperations.range("testData", 0, -1);
    //遍历
    for (String tableData : testDatas) {
        System.out.print(tableData + " ");
    }
    System.out.println();
    //获取当前list长度，用于遍历
    Long size = listOperations.size("testData");
    int value = size.intValue();
    //遍历输出并删除
    for (int i = 0; i < value; i++) {
        System.out.print(listOperations.leftPop("testData") + " ");
    }
    //最后输出一下当前list长度
    System.out.println();
    System.out.println(listOperations.size("testData"));
}
```

### set操作

```java
@Test
void setTest() {
    SetOperations setOperations = redisTemplate.opsForSet();
    //存数据，这里存了两个a
    setOperations.add("tmp", "a", "b", "c", "d", "a");
    //遍历输出(跟Java差不多)
    Set<String> tmpData = setOperations.members("tmp");
    for (String value : tmpData) {
        System.out.print(value + " ");
    }
    System.out.println();
    System.out.println("---------------");
    //删除多值
    setOperations.remove("tmp", "b", "c");
    //再次遍历输出
    tmpData = setOperations.members("tmp");
    for (String value : tmpData) {
        System.out.print(value + " ");
    }
}
```

### ZSet数据操作

```java
@Test
void zsetTest() {
    ZSetOperations zSetOperations = redisTemplate.opsForZSet();
    //存scope值
    zSetOperations.add("myZset", "a", 0.0);
    zSetOperations.add("myZset", "b", 1.0);
    zSetOperations.add("myZset", "c", 2.0);
    zSetOperations.add("myZset", "a", 3.0);
    //遍历所有
    Set<String> myZset = zSetOperations.range("myZset", 0, -1);
    for (String s : myZset) {
        System.out.println(s);
    }
    //修改scope
    zSetOperations.incrementScore("myZset", "b", 4.0);
    //取值
    System.out.println("--------------------");
    myZset = zSetOperations.range("myZset", 0, -1);
    for (String s : myZset) {
        System.out.println(s);
    }
    //删除成员
    zSetOperations.remove("myZset", "a", "b");
    //取值
    System.out.println("-------------------");
    myZset = zSetOperations.range("myZset", 0, -1);
    for (String s : myZset) {
        System.out.println(s);
    }
}
```

### 通用操作

```java
@Test
void commonTest() {
    //查看所有key(keys *)
    Set<String> keys = redisTemplate.keys("*");
    for (String key : keys) {
        System.out.println(key);
    }
    //查看是否存在指定key
    System.out.println("----------------------------");
    System.out.println(redisTemplate.hasKey("Random"));
    System.out.println("----------------------------");
    //删除指定key，并再次查看
    redisTemplate.delete("myZset");
    keys = redisTemplate.keys("*");
    for (String key : keys) {
        System.out.println(key);
    }
    System.out.println("----------------------------");
    //输出指定key的类型
    System.out.println(redisTemplate.type("tmp"));
}
```

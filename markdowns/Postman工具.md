---
title: Postman工具
date: 2023-08-17 08:32:01
tags: 实用工具
---

由于Postman在2018年后，就不支持浏览器版本，所以需要下载客户端再安装使用

下面以Windows为例进行安装

# 下载与安装

访问postman官方网站，下载最新版本：https://www.postman.com/

![image-20230817085128946](https://s2.loli.net/2023/08/17/bxGYAruhDpitvmg.png)

根据自己电脑的系统来下载

![image-20230817085254054](https://s2.loli.net/2023/08/17/vc7gTsW2HaXYRKw.png)

下载好之后，进行安装，安装就不讲了，跟普通软件的安装方式是一样的，安装完成后，进行一个注册和登录，就可以进到页面里了

# 使用方法

<img src="https://s2.loli.net/2023/08/17/HPwsemhAyEtGWjo.png" alt="image-20230817085610314" style="zoom:50%;" />

点击创建一个工作空间

<img src="https://s2.loli.net/2023/08/17/QSFsIer6HNx9fVk.png" alt="image-20230817085643819" style="zoom:50%;" />

![image-20230817085753069](https://s2.loli.net/2023/08/17/DLQHYWeMcE3Utq2.png)

创建完成后会来到如下页面

点击这个按钮会新建一个连接

![image-20230817085905695](https://s2.loli.net/2023/08/17/Pj4eq6tByIkKxFO.png)

右击这个按钮，添加一个请求

<img src="https://s2.loli.net/2023/08/17/aHqxbXsI2gPYKtG.png" alt="image-20230817090053973" style="zoom:50%;" />

默认是get请求，你可以根据自己的需求来确定

![image-20230817090116652](https://s2.loli.net/2023/08/17/a897CmKxLyqpkJX.png)



# 常见的连接方式

讲一下常见的几种连接参数

## Get请求

一般把地址拷贝到地址栏里就可以了，下面的Response是响应的内容

<img src="https://s2.loli.net/2023/08/17/daDpH6UzNMyrTXC.png" alt="image-20230817090340322" style="zoom: 33%;" />

## Post请求

### 表单类型的接口请求

表单类型数据其实就是在请求头中查看Content-Type，它的值如果是:application/x-www-form-urlencoded ，那么就说明客户端提交的数据是以表单形式提交的，这里一般发送的都是表单类的请求测试

![image-20230817090617628](https://s2.loli.net/2023/08/17/OXoKswUz6jq3YmI.png)

### 上传文件的表单请求

跟表单数据差不多，其实就是将x-www-form-urlencoded改为了form-data，可以携带的参数由Text变为File，File的Value就可以选择文件了

![image-20230817091134556](https://s2.loli.net/2023/08/17/RW1nczqJyA35sk7.png)

### json类型的接口请求

都没啥区别，其实还是跟上面的类似，只需要简单的变动一下参数

<img src="https://s2.loli.net/2023/08/17/KwIJh4YL81EDCem.png" alt="image-20230817091440542" style="zoom: 33%;" />

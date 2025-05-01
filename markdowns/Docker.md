---
title: Docker
tags: Docker
date: 2023-11-07 13:38:38
---
abbrlink: f5f9fa9b
date: 2023-11-07 13:38:38
tags:
  - Docker
  - MQ
categories:
  - 微服务
description: Docker快速入门教程
---

# Docker的安装

## 删除Docker

在安装Docker之前需要先进行Docker的删除，防止本地存在Docker导致冲突

```bash
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
```

## 配置Docker的yum库

首先要安装一个yum工具

```bash
yum install -y yum-utils
```

安装成功后，执行命令，配置Docker的yum源：

```Bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

## 安装Docker

执行命令，安装Docker

```Bash
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

安装完成后，输入命令`docker -v`可以查看docker的版本

## 启动和校验

这里可以设置docker为开机自启

然后启动docker，并输入`docker images`或者`docker ps`查看是否有效，如果有效就说明启动成功了

```Bash
# 启动Docker
systemctl start docker

# 停止Docker
systemctl stop docker

# 重启
systemctl restart docker

# 设置开机自启
systemctl enable docker

# 执行docker ps命令，如果不报错，说明安装启动成功
docker ps
```

## 配置镜像加速

这里配置阿里的镜像加速

注册阿里云账号https://www.aliyun.com/

<img src="https://s2.loli.net/2023/11/07/jS9zpPtkyEfC1gi.png" alt="image-20231107144316412" style="zoom:50%;" />

![image-20231107144348307](https://s2.loli.net/2023/11/07/2RufPhqJEAtQoI9.png)

具体命令如下：

```Bash
# 创建目录
mkdir -p /etc/docker

# 复制内容，注意把其中的镜像加速地址改成你自己的
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://xxxx.mirror.aliyuncs.com"]
}
EOF

# 重新加载配置
systemctl daemon-reload

# 重启Docker
systemctl restart docker
```

# 部署MySQL

部署MySQL只需要一条指令

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

接着你可以打开你使用的sql工具，来连接docker刚刚部署的mysql，连接成功说明，部署成功了

## 镜像和容器

当我们利用Docker安装应用时，Docker会自动搜索并下载应用**镜像(image)**。镜像不仅包含应用本身，还包含应用运行所需要的环境、配置、系统函数库。Docker会在运行镜像时创建一个隔离环境。称为**容器(container)**。

**镜像仓库**：存储和管理镜像的平台，Docker官方维护了一个公共仓库：Docker Hub。

在我们启动Docker的服务器后，docker daemon守护进程会对docker命令进行监听，当我们运行docker xxx的命令后，守护进程就会去查看本地是否存在镜像，存在就直接使用，否则就回去镜像仓库进行下载，下载完成后作为容器来使用

## 命令解读

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

- `docker run -d` ：创建并运行一个容器，`-d`则是让容器以后台进程运行
- `--name mysql ` : 给容器起个名字叫`mysql`，你可以叫别的
- `-p 3306:3306` : 设置端口映射。
	- **容器是隔离环境**，外界不可访问。但是可以将宿主机端口映射容器内到端口，当访问宿主机指定端口时，就是在访问容器内的端口了。
	- 容器内端口往往是由容器内的进程决定，例如MySQL进程默认端口是3306，因此容器内端口一定是3306；而宿主机端口则可以任意指定，一般与容器内保持一致。
	- 格式： `-p 宿主机端口:容器内端口`，示例中就是将宿主机的3306映射到容器内的3306端口
- `-e TZ=Asia/Shanghai` : 配置容器内进程运行时的一些参数
	- 格式：`-e KEY=VALUE`，KEY和VALUE都由容器内进程决定
	- 案例中，`TZ=Asia/Shanghai`是设置时区；`MYSQL_ROOT_PASSWORD=123`是设置MySQL默认密码
- `mysql`：设置**镜像**名称，Docker会根据这个名字搜索并下载镜像
	- 格式：`REPOSITORY:TAG`，例如`mysql:8.0`，其中`REPOSITORY`可以理解为镜像名，`TAG`是版本号
	- 在未指定`TAG`的情况下，默认是最新版本，也就是`mysql:latest`

### 镜像命名规范

- 镜像名称一般分两部分组成：[repository]:[tag]
	- 其中repository就是镜像名
	- tag是镜像的版本
- 在没有指定tag时，默认是latest(最新)，代表最新版本的镜像

# Docker基础

Docker最常见的命令就是操作镜像、容器的命令，详见官方文档：https://docs.docker.com/

Docker常见命令，可以参考官方文档：https://docs.docker.com/engine/reference/commandline/cli/

比较常见的命令有：

| **命令**       | **说明**                       | **文档地址**                                                 |
| :------------- | :----------------------------- | :----------------------------------------------------------- |
| docker pull    | 拉取镜像                       | [docker pull](https://docs.docker.com/engine/reference/commandline/pull/) |
| docker push    | 推送镜像到DockerRegistry       | [docker push](https://docs.docker.com/engine/reference/commandline/push/) |
| docker images  | 查看本地镜像                   | [docker images](https://docs.docker.com/engine/reference/commandline/images/) |
| docker rmi     | 删除本地镜像                   | [docker rmi](https://docs.docker.com/engine/reference/commandline/rmi/) |
| docker run     | 创建并运行容器（不能重复创建） | [docker run](https://docs.docker.com/engine/reference/commandline/run/) |
| docker stop    | 停止指定容器                   | [docker stop](https://docs.docker.com/engine/reference/commandline/stop/) |
| docker start   | 启动指定容器                   | [docker start](https://docs.docker.com/engine/reference/commandline/start/) |
| docker restart | 重新启动容器                   | [docker restart](https://docs.docker.com/engine/reference/commandline/restart/) |
| docker rm      | 删除指定容器                   | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/rm/) |
| docker ps      | 查看容器                       | [docker ps](https://docs.docker.com/engine/reference/commandline/ps/) |
| docker logs    | 查看容器运行日志               | [docker logs](https://docs.docker.com/engine/reference/commandline/logs/) |
| docker exec    | 进入容器                       | [docker exec](https://docs.docker.com/engine/reference/commandline/exec/) |
| docker save    | 保存镜像到本地压缩文件         | [docker save](https://docs.docker.com/engine/reference/commandline/save/) |
| docker load    | 加载本地压缩文件到镜像         | [docker load](https://docs.docker.com/engine/reference/commandline/load/) |
| docker inspect | 查看容器详细信息               | [docker inspect](https://docs.docker.com/engine/reference/commandline/inspect/) |

## 保存镜像到本地压缩文件

```bash
docker save -o 镜像名称.tar 镜像名称:版本
```

## 删除镜像

删除镜像时如果遇到以下报错：Error response from daemon: conflict: unable to remove repository reference "mysql:latest" (must force) - container 0fa37bf7c610 is using its referenced image 3218b38490ce

报错内容是因为镜像被容器引用，那么删除容器再删除镜像。

此时使用`docker rm 0fa37bf7c610    ` 

再次执行即可

```bash
docker rmi 镜像名:版本
```

## 加载已有镜像

-p：不输出任何内容

```
docker load -i 读取的镜像名称 -p
```

## 创建并运行容器

docker run 

-d：后台运行

--name：容器名称

-p：端口号，分为宿主机端口：容器内端口

-e：相关配置

最后是设置镜像名称

```bash
docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 mysql
```

## 停止容器运行

```bash
docker stop 容器名
```

## 查看容器是否运行

```bash
docker ps
```

查看所有容器，包括没有运行的容器

```bash
docker ps -a
```

## 启动容器

```bash
docker start 容器名
```

## 查看容器日志

```bash
docker logs 容器名
```

### 持续查看容器日志

```bash
docker logs -f 容器名
```

## 进入容器内部

-it：添加一个可输入的终端 

bash：命令行交互

```bash
docker exec -it 容器名 bash
# 退出
exit
```

## 删除容器

删除容器需要先停止容器再删除

```bash
docker stop 被删除的容器名
```

```bash
docker rm 容器名
```

也可以强制删除docker

```bash
docker rm 容器名 -f
```

## 命令别名

```bash
# 修改/root/.bashrc文件
vi /root/.bashrc
内容如下：
# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias dps='docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"'
alias dis='docker images'

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi
```



# 数据卷

数据卷(volume)是一个虚拟目录，是**容器内目录**与**宿主机目录**之间映射的桥梁

数据卷可以映射容器内目录到宿主机上，因为容器内目录是无法直接修改里面的内容的，原因是容器内目录是最小化的服务器，只有服务器的功能，其他的功能都没有，所以无法通过命令修改，通过数据卷可以将容器内的目录映射到一个固定的目录下进行修改

![image-20231107193919346](https://s2.loli.net/2023/11/07/6SnXYUs3gqoNI8t.png)

## 数据卷命令

| **命令**              | **说明**             | **文档地址**                                                 |
| :-------------------- | :------------------- | :----------------------------------------------------------- |
| docker volume create  | 创建数据卷           | [docker volume create](https://docs.docker.com/engine/reference/commandline/volume_create/) |
| docker volume ls      | 查看所有数据卷       | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/volume_ls/) |
| docker volume rm      | 删除指定数据卷       | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/volume_prune/) |
| docker volume inspect | 查看某个数据卷的详情 | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/volume_inspect/) |
| docker volume prune   | 清除数据卷           | [docker volume prune](https://docs.docker.com/engine/reference/commandline/volume_prune/) |

## 创建相关数据卷

注意：容器与数据卷的挂载要在创建容器时配置，对于创建好的容器，是不能设置数据卷的。而且**创建容器的过程中，数据卷会自动创建**。

也就是说，数据卷要在容器创建前进行创建，所以之前的容器需要删除，我们可以将之前的nginx容器删除

```bash
docker rm -f nginx
```

- 在执行docker run命令时，使用-v 数据卷名称：容器内目录 可以完成数据卷挂载
- 当创建容器时，如果挂载了数据卷且数据卷不存在，会自动创建数据卷

创建容器并创建对应数据卷，-d以后台形式运行，名称为nginx，开放宿主机端口为80且容器内端口为80，使用-v 数据卷名称：容器内目录来映射对应的数据卷完成数据卷挂载，最后的nginx设置的是数据卷的镜像名称，镜像名称需要自己特意指定，会在本地和docker仓库进行搜索

```bash
docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx
```

查看nginx容器是否创建成功

```bash
docker ps
```

查看数据卷是否创建成功

```bash
docker volume ls
```

展示数据卷的详细信息

```bash
docker volume inspect 数据卷的名称
```

这里的数据卷是html，所以通过html来查询，`docker volume inspect html`

```bash
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

**Mountpoint**是所挂载的宿主机的位置

此时，如果你进入挂载到的位置进行查看，就会看到你所访问的位置与之前nginx位置的内容是一致的

## 数据卷的常用命令

- docker volume ls：查看数据卷
- docker volume rm：删除数据卷
- docker volume inspect：查看数据卷详情
- docker volume prune：删除未使用的数据卷

## 本地目录挂载

### 查看容器详情

```bash
docker inspect 容器名
```

- 在执行docker run命令时，使用-v  本地目录：容器内目录可以完成本地目录挂载
- 本地目录必须以`/`或`./`开头，如果直接以名称开头，会被识别为数据卷而非本地目录
	- -v mysql：/var/lib/mysql 会被识别为一个数据卷叫mysql
	- -v ./mysql：/var/lib/mysql 会被识别当前目录下的mysql目录挂载

挂载MySQL的目录到本地上

```bash
docker run -d \
--name mysql \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=123 \
-v /root/mysql/data:/var/lib/mysql \
-v /root/mysql/init/:/docker-entrypoint-initdb.d \
-v /root/mysql/conf/:/etc/mysql/conf.d \
mysql
```

创建完成后

查看目前启动的容器

```bash
docker ps
```

此时如果数据库中存在内容，说明挂载完成了，即使mysql镜像被删除了，只要你不删除挂载目录，数据就不会丢失，你只需要重新挂载到这些目录下，数据就能回来

# 自定义镜像

前面我们一直在使用别人准备好的镜像，那如果我要部署一个Java项目，把它打包为一个镜像该怎么做呢？

## 镜像结构

要想自己构建镜像，必须先了解镜像的结构。

之前我们说过，镜像之所以能让我们快速跨操作系统部署应用而忽略其运行环境、配置，就是因为镜像中包含了程序运行需要的系统函数库、环境、配置、依赖。

因此，自定义镜像本质就是依次准备好程序运行的基础环境、依赖、应用本身、运行配置等文件，并且打包而成。

举个例子，我们要从0部署一个Java应用，大概流程是这样：

- 准备一个linux服务（CentOS或者Ubuntu均可）

- 安装并配置JDK
- 上传Jar包
- 运行jar包

那因此，我们打包镜像也是分成这么几步：

- 准备Linux运行环境（java项目并不需要完整的操作系统，仅仅是基础运行环境即可）
- 安装并配置JDK
- 拷贝jar包
- 配置启动脚本

上述步骤中的每一次操作其实都是在生产一些文件（系统运行环境、函数库、配置最终都是磁盘文件），所以**镜像就是一堆文件的集合**。

但需要注意的是，镜像文件不是随意堆放的，而是按照操作的步骤分层叠加而成，每一层形成的文件都会单独打包并标记一个唯一id，称为**Layer**（**层**）。这样，如果我们构建时用到的某些层其他人已经制作过，就可以直接拷贝使用这些层，而不用重复制作。

例如，第一步中需要的Linux运行环境，通用性就很强，所以Docker官方就制作了这样的只包含Linux运行环境的镜像。我们在制作java镜像时，就无需重复制作，直接使用Docker官方提供的CentOS或Ubuntu镜像作为基础镜像。然后再搭建其它层即可，这样逐层搭建，最终整个Java项目的镜像结构如图所示：

![image-20231109134001580](https://s2.loli.net/2023/11/09/bmZzw9PnUyKThCB.png)

此时我们可以拉取一个镜像来测试一下
我们可以拉取redis的镜像来测试

```bash
docker pull redis
```

![image-20231109134258944](https://s2.loli.net/2023/11/09/7yneNKGZ6iajrTq.png)

此时我们可以看到Already exists，重复的存在

这是因为镜像文件中存在着重复的层，所以可以直接拷贝来加快镜像的拉取速度

## Dockerfile

由于制作镜像的过程中，需要逐层处理和打包，比较复杂，所以Docker就提供了自动打包镜像的功能。我们只需要将打包的过程，每一层要做的事情用固定的语法写下来，交给Docker去执行即可。

而这个记录镜像结构的文件就称为**Dockerfile**，其对应的语法可以参考官方文档：

https://docs.docker.com/engine/reference/builder/

其中的语法比较多，比较常用的有：

| **指令**       | **说明**                                     | **示例**                     |
| :------------- | :------------------------------------------- | :--------------------------- |
| **FROM**       | 指定基础镜像                                 | `FROM centos:6`              |
| **ENV**        | 设置环境变量，可在后面指令使用               | `ENV key value`              |
| **COPY**       | 拷贝本地文件到镜像的指定目录                 | `COPY ./xx.jar /tmp/app.jar` |
| **RUN**        | 执行Linux的shell命令，一般是安装过程的命令   | `RUN yum install gcc`        |
| **EXPOSE**     | 指定容器运行时监听的端口，是给镜像使用者看的 | EXPOSE 8080                  |
| **ENTRYPOINT** | 镜像中应用的启动命令，容器运行时调用         | ENTRYPOINT java -jar xx.jar  |

例如，要基于Ubuntu镜像来构建一个Java应用，其Dockerfile内容如下：

```bash
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量，JDK的安装目录、容器内时区
ENV JAVA_DIR=/usr/local
ENV TZ=Asia/Shanghai
# 拷贝jdk和java项目的包
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar
# 设定时区
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 安装JDK
RUN cd $JAVA_DIR \
 && tar -xf ./jdk8.tar.gz \
 && mv ./jdk1.8.0_144 ./java8
# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin
# 指定项目监听的端口
EXPOSE 8080
# 入口，java项目的启动命令
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

以后我们会有很多很多java项目需要打包为镜像，他们都需要Linux系统环境、JDK环境这两层，只有上面的3层不同（因为jar包不同）。如果每次制作java镜像都重复制作前两层镜像，是不是很麻烦。

所以，就有人提供了基础的系统加JDK环境，我们在此基础上制作java镜像，就可以省去JDK的配置了：

```Dockerfile
# 基础镜像
FROM openjdk:11.0-jre-buster
# 设定时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 拷贝jar包
COPY docker-demo.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 自定义镜像

当编写好了Dockerfile，可以利用下面的命令来构建镜像：

```bash
docker build -t myTest:1.0 .
```

- `-t`：是给镜像起名，格式依然是repository：tag的格式，不指定tag时，默认为latest(最新)
- `.`：是指定Dockerfile所在目录，如果就在当前目录，则指定为`.`，如果是指定了当前目录的话，就需要对Dockerfile的目录做一些调整

将资料中的demo目录拷贝到根目录下，进入demo目录

```bash
cd /root/demo
```

如果觉得下载镜像不方便可以拷贝资料中的images目录到根目录下

并通过

```bash
# 加载为docker的镜像
docker load -i tar包的名称
```

构建镜像

```bash
docker build -t docker-demo:1.0 .
```

命令说明：

- `docker build `: 就是构建一个docker镜像
- `-t docker-demo:1.0` ：`-t`参数是指定镜像的名称（`repository`和`tag`）
- `.` : 最后的点是指构建时Dockerfile所在路径，由于我们进入了demo目录，所以指定的是`.`代表当前目录，也可以直接指定Dockerfile目录：

```bash
# 直接指定Dockerfile目录
docker build -t docker-demo:1.0 /root/demo
```

运行`docker images`

```bash
REPOSITORY    TAG               IMAGE ID       CREATED          SIZE
docker-demo   latest            cee3813af51e   16 seconds ago   319MB
nginx         latest            605c77e624dd   22 months ago    141MB
redis         latest            7614ae9453d1   22 months ago    113MB
mysql         latest            3218b38490ce   22 months ago    516MB
openjdk       11.0-jre-buster   57925f2e4cff   23 months ago    301MB
```

此时发现镜像被引入进来了

接着运行该镜像

```bash
docker run -d --name demo -p 8080:8080 docker-demo
```

查看该镜像是否正在运行

```bash
docker ps
```

接着可以看看它的运行日志

```bash
docker logs -f demo
```

来到浏览器中

```
http://自己的ip地址:8080/hello/count
```

访问一下是否有效

总结：

镜像的结构是怎样的？

- 镜像中包含了应用程序所需要的运行环境、函数库、配置、以及应用本身等各种文件，这些文件分层打包而成

Dockerfile是做什么的？

- Dockerfile就是利用固定的指令来描述镜像的结构和构建过程，这样Docker才可以依次来构建镜像

构建镜像的命令是什么？

- docker build -t 镜像名 Dockerfile目录

# 容器网络互连

java项目有时候需要访问其它各种中间件，例如MySQL、Redis等。现在，我们的容器之间能否互相访问呢？我们来测试一下

首先，我们查看下MySQL容器的详细信息，重点关注其中的网络IP地址：

记得启动mysql容器

```bash
docker inspect mysql
```

得到的IP地址如下：`"IPAddress": "172.17.0.3"`

然后通过命令进入demo容器 `docker exec -it demo bash`

在demo容器中ping mysql容器，查看是否能成功

```bash
64 bytes from 172.17.0.3: icmp_seq=1 ttl=64 time=0.168 ms
64 bytes from 172.17.0.3: icmp_seq=2 ttl=64 time=0.087 ms
64 bytes from 172.17.0.3: icmp_seq=3 ttl=64 time=0.077 ms
64 bytes from 172.17.0.3: icmp_seq=4 ttl=64 time=0.077 ms
```

测试表明，可以互联

默认情况下，所有容器是以bridge（网桥）方式连接到Docker的一个虚拟网桥上：

![image-20231109145543378](https://s2.loli.net/2023/11/10/MIFjfg6iJeA8kW9.png)

但是，容器的网络IP其实是一个虚拟的IP，其值并不固定与某一个容器绑定，如果我们在开发时写死某个IP，而在部署时很可能MySQL容器的IP会发生变化，连接会失败。

所以，我们必须借助于docker的网络功能来解决这个问题，官方文档：

https://docs.docker.com/engine/reference/commandline/network/

常见命令有：

| **命令**                  | **说明**                 | **文档地址**                                                 |
| :------------------------ | :----------------------- | :----------------------------------------------------------- |
| docker network create     | 创建一个网络             | [docker network create](https://docs.docker.com/engine/reference/commandline/network_create/) |
| docker network ls         | 查看所有网络             | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/network_ls/) |
| docker network rm         | 删除指定网络             | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/network_rm/) |
| docker network prune      | 清除未使用的网络         | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/network_prune/) |
| docker network connect    | 使指定容器连接加入某网络 | [docs.docker.com](https://docs.docker.com/engine/reference/commandline/network_connect/) |
| docker network disconnect | 使指定容器连接离开某网络 | [docker network disconnect](https://docs.docker.com/engine/reference/commandline/network_disconnect/) |
| docker network inspect    | 查看网络详细信息         | [docker network inspect](https://docs.docker.com/engine/reference/commandline/network_inspect/) |

## 自定义网络

```bash
docker network ls
```

先查看存在的网络有哪些

接着我们可以创建一个网络

创建一个eastwind的网络，并查看所有网络

```bash
docker network create eastwind
docker network ls
```

```bash
NETWORK ID     NAME       DRIVER    SCOPE
3de0c3b573b5   bridge     bridge    local
76140a3e4693   eastwind   bridge    local
8c7edfa12652   host       host      local
8ef97f11560b   none       null      local
```

此时发现刚刚创建的网络也在其中
如果想加入一个容器到自定义网络中，可以使用`connect`

```bash
docker network connect eastwind mysql
```

这样就可以将mysql加入到eastwind网络中了

此时可以通过

```bash
# 查看网络
docker inspect mysql
```

<img src="https://s2.loli.net/2023/11/09/Or8oNgSA39P4QpR.png" alt="image-20231109154755754" style="zoom:50%;" />

上面这种是可以在容器存在时进行网络连接，下面这种方法可以让容器在创建时就进行连接
我们先将之前的demo容器删除

接着在创建容器时，可以添加一个参数`--network`，后面跟自定义网络的名称

```bash
docker run -d --name demo -p 8080:8080 --network eastwind docker-demo
```

```bash
docker inspect
```

此时如果我们进入demo容器中ping mysql和nginx

```bash
docker exec -it demo bash
ping mysql
ping nginx
```

因为nginx与demo不在一个网段中，所以无法ping通，但mysql可以

**加入自定义网络的容器才可以通过容器名互相访问**

# 部署Java项目

将资料中的项目打包为jar包

将jar包和Dockerfile文件传入linux下

```bash
docker build -t emall .
```

查看docker 镜像是否部署成功

```bash
docker images
```

接着运行该镜像

代码释义：

后台运行该镜像，名称为emall，指定开放端口为8080，设置网络为eastwind，指定运行的镜像为emall

```bash
docker run -d --name emall -p 8080:8080 --network eastwind emall
```

接着可以通过查看日志

```bash
docker logs -f emall
```

访问该路径

```
http://192.168.10.142:8080/hi
```

# 部署前端

修改nginx目录下的nginx.conf为

这里的proxy_pass需要修改http://自己的后端镜像:8080

```conf
server {
        listen       18080;
        # 指定前端项目所在的位置
        location / {
            root /usr/share/nginx/html/hmall-portal;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
        location /api {
            rewrite /api/(.*)  /$1 break;
            proxy_pass http://eastwind:8080;
        }
    }
    server {
        listen       18081;
        # 指定前端项目所在的位置
        location / {
            root /usr/share/nginx/html/hmall-admin;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
        location /api {
            rewrite /api/(.*)  /$1 break;
            proxy_pass http://eastwind:8080;
        }
    }
```

将前台的打包好的内容上传

运行前台的项目

命令解读：

以后台模式运行一个叫nginx的容器

开放端口18080和18081，并且与容器内的队友路径进行关联

设置对应的网络为自定义网络eastwind

设置使用的镜像为nginx

```bash
docker run -d \
--name nginx \
-p 18080:18080 \
-p 18081:18081 \
-v /root/nginx/html:/usr/share/nginx/html \
-v /root/nginx/nginx.conf:/etc/nginx/nginx.conf \
--network eastwind \
nginx
```

访问http://你的虚拟机ip:18080

# DockerCompose

我们部署一个简单的java项目，其中包含3个容器：

- MySQL
- Nginx
- Java项目

而稍微复杂的项目，其中还会有各种各样的其它中间件，需要部署的东西远不止3个。如果还像之前那样手动的逐一部署，就太麻烦了。

而Docker Compose就可以帮助我们实现**多个相互关联的Docker容器的快速部署**。它允许用户通过一个单独的 docker-compose.yml 模板文件（YAML 格式）来定义一组相关联的应用容器。

## 基本语法

docker-compose.yml文件的基本语法可以参考官方文档：https://docs.docker.com/compose/compose-file/compose-file-v3/

docker-compose文件中可以定义多个相互关联的应用容器，每一个应用容器被称为一个服务（service）。由于service就是在定义某个应用的运行时参数，因此与`docker run`参数非常相似。

举例来说，用docker run部署MySQL的命令如下：

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  -v ./mysql/data:/var/lib/mysql \
  -v ./mysql/conf:/etc/mysql/conf.d \
  -v ./mysql/init:/docker-entrypoint-initdb.d \
  --network eastwind
  mysql
```

如果用`docker-compose.yml`文件来定义，就是这样：

```yaml
version: "3.8"

services:
  mysql:
    image: mysql
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "./mysql/conf:/etc/mysql/conf.d"
      - "./mysql/data:/var/lib/mysql"
    networks:
      - new
networks:
  new:
    name: eastwind
```

对比如下：

| **docker run 参数** | **docker compose 指令** | **说明**   |
| :------------------ | :---------------------- | :--------- |
| --name              | container_name          | 容器名称   |
| -p                  | ports                   | 端口映射   |
| -e                  | environment             | 环境变量   |
| -v                  | volumes                 | 数据卷配置 |
| --network           | networks                | 网络       |

商城部署文件：

```YAML
version: "3.8"

services:
  mysql:
    image: mysql
    container_name: mysql
    ports:
      - "3306:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "./mysql/conf:/etc/mysql/conf.d"
      - "./mysql/data:/var/lib/mysql"
      - "./mysql/init:/docker-entrypoint-initdb.d"
    networks:
      - hm-net
  hmall:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: hmall
    ports:
      - "8080:8080"
    networks:
      - hm-net
    depends_on:
      - mysql
  nginx:
    image: nginx
    container_name: nginx
    ports:
      - "18080:18080"
      - "18081:18081"
    volumes:
      - "./nginx/nginx.conf:/etc/nginx/nginx.conf"
      - "./nginx/html:/usr/share/nginx/html"
    depends_on:
      - hmall
    networks:
      - hm-net
networks:
  hm-net:
    name: hmall
```

编写好docker-compose.yml文件，就可以部署项目了。常见的命令：https://docs.docker.com/compose/reference/

基本语法如下：

```bash
docker compose [OPTIONS] [COMMAND]
```

其中，OPTIONS和COMMAND都是可选参数，比较常见的有：

![image-20231110152104483](https://s2.loli.net/2023/11/10/kpv3fbNEjPGnVqh.png)

需要删除旧容器及旧镜像

在root目录运行即可docker compose up -d


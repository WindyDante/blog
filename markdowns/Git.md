---
title: Git工具
tags: Git
date: 2023-8-13
---

# 1、Git概述

- Git是一个分布式版本控制工具，主要用于管理开发过程中的源代码文件（Java类、xml文件、html页面等），在软件开发过程中被广泛使用。
- 作用
	1. 代码回溯
	2. 版本切换
	3. 多人协作
	4. 远程备份

## 简介

- Git 是一个分布式版本控制工具，通常用来对软件开发过程中的源代码文件进行管理。通过Git仓库来存储和管理这些文件，Git仓库分为两种:
	1. 本地仓库：开发人员自己电脑上的Git仓库
	2. 远程仓库：远程服务器上的Git仓库 
- `commit`：提交。将本地文件和版本信息保存到本地仓库
- `push`：推送，将本地仓库文件和版本信息上传到远程仓库
- `pull`：拉取，将远程仓库文件和版本信息下载到本地仓库

Git一般的操作就是将本地仓库中的数据提交后推送到远程仓库上，而另一个本地仓库需要时只需要拉取一下在远程仓库上的数据即可，反之同理

## 下载和安装

- 这个应该没啥好说的，安装完毕之后再任意目录点击右键出现如下菜单，则说明安装成功

<img src="https://s2.loli.net/2023/08/14/45xdOwlsTiePh1n.png" alt="image-20230801081300669" style="zoom:50%;" />

一般经常使用的都是`Git Bash Here`



# Git代码托管服务

## 常用的Git代码托管服务

- Git中存在两种类型的仓库，即`本地仓库`和`远程仓库`，那么我们如何搭建`- Git远程仓库`呢？
- 我们可以借助互联网上提供的一些代码托管服务俩实现，比较常用的有GitHub、Gitee（狗都不用）、GitLab等
	- `GitHub`（ 地址：`https://github.com/` ），是一个面向开源私有软件项目的托管平台，因为只支持Git作为唯一的版本库格式进行托管，故名GitHub
	- `Gitee`（地址： `https://gitee.com/` ），又名码云，是国内的一个代码托管平台，由于服务器在国内，所以相比较于GitHub，Gitee速度更快
	- `GitLab`（地址： `https://about.gitlab.com/` ），是一个用于仓库管理系统的开源项目，使用Git作为代码管理工具，并在此基础上搭建起来的Web服务
	- `BitBucket`（地址：`https://bitbucket.org/`） ，是一家代码托管网站，采用Mercurial和Git作为分布式版本控制系统，同时提供商业计划和免费账户

## 使用GitHub代码托管服务

具体步骤如下

### 注册登录GitHub账号

注册Github账号`https://github.com/`

通过这个网址来注册github账号，注册和登录就Nothing好说的了



### 创建一个远程仓库

![image-20230801084001670](https://s2.loli.net/2023/08/14/btKhIm6Lv5NEVjC.png)

右上角有一个+号，点开后New repository可以来创建远程仓库

<img src="https://s2.loli.net/2023/08/14/56hWqkGQ2cyzmU3.png" alt="image-20230801085420384" style="zoom:50%;" />

就正常的创建就行了，下面都有这些英文解释，基本上不需要太大的变动

创建完成后是这个样子

<img src="https://s2.loli.net/2023/08/14/XbYT783nO2QIKv5.png" alt="image-20230801085648789" style="zoom:50%;" />



### 邀请其他用户成为仓库成员

![image-20230801085909782](https://s2.loli.net/2023/08/14/E6tsWbdlpzfhIym.png)



# Git常用命令

## Git全局设置

安装Git后首先要做的是设置用户名称和email地址。这是非常重要的，因为每次Git提交都会使用该用户的信息



在Git命令行中执行下面的命令：

- 设置用户信息

```bash
git config --global user.name "你的用户名"
```

```bash
git config --global user.email "你的邮箱"
```

- 查看配置信息

```bash
git config --list
```

- 签名的作用是为了区分不同操作者的身份
- 用户的签名信息在每一个版本的提交信息中能够看到，以确认本次提交是谁做的
- Git首次安装必须设置一下用户签名，否则无法提交代码

注意：上面设置的user.name和user.email并不是在Github上注册的用户名和邮箱，此处可以任意设置\

通过上面的命令设置的信息都保存在`~/.gitconfig`文件中

## 获取Git仓库

要使用Git对我们的代码进行版本控制，首先需要获得Git仓库

`获取Git仓库的命令`

本地初始化（不常用）

```bash
git init
```

从远程仓库克隆（常用）

```bash
git clone
```

这里给一个简单示例将远程仓库克隆过来

我们创建一个文件夹暂存一下我们的Git仓库

![image-20230801095043522](https://s2.loli.net/2023/08/14/lHNgJVjkiuGXZoe.png)

这里是我们的一个文件夹,我们右击鼠标Git Bash Here

<img src="https://s2.loli.net/2023/08/14/cYyKoNDZSpG1VrT.png" alt="image-20230801095132780" style="zoom:50%;" />

这样就来到了我们的一个文件夹内

我们去GitHub上面复制一下HTTPS到这来

![image-20230801095830555](https://s2.loli.net/2023/08/14/KIPNd3jXfHQzFZw.png)

我们执行git clone "你的远程仓库地址"

![image-20230801095904294](https://s2.loli.net/2023/08/14/WE39t6KP7GkCvSQ.png)

因为我的远程仓库是空的，所以报了一个警告，我们再到文件夹中查看

<img src="https://s2.loli.net/2023/08/14/FhJO7w85Cby1oBU.png" alt="image-20230801095935106" style="zoom:50%;" />

此时，远程仓库就被克隆过来了

注意：仓库是不能嵌套的，不能在一个仓库目录内，克隆/创建另一个仓库。

## 工作区、暂存区、版本库概念

为了更好的学习Git，我们需要了解一下Git相关的一些概念，这些概念在后面的学习中会经常提到。

- 版本库：其实你在`git init`之后，会在当前文件夹创建一个隐藏文件`.git`，这个文件就是版本库，版本库中存储了很多的配置信息、日志信息和文件版本信息等
- 工作目录（工作区）：包含`.git`文件夹的目录就是工作目录，主要用于存放开发的代码
- 暂存区：一个临时保存修改文件的地方
	- `.git`文件夹内有很多文件，其中有一个名为`index`的文件就是暂存区，也可以叫做`stage`

## Git工作区中文件的状态

- Git工作目录下的文件存在两种状态
	- `untracked`未跟踪（未被纳入版本控制）
	- `tracked`已跟踪（被纳入版本控制）
		- `Unmodified`未修改状态
		- `Modified`已修改状态
		- `Staged`已暂存状态

这些文件的状态会随着我们执行Git的命令发生变化

## 本地仓库操作

## 本地仓库相关命令

|                命令                 |                   功能                   |
| :---------------------------------: | :--------------------------------------: |
| git config —global user.name 用户名 |               设置用户签名               |
| git config —global user.email 邮箱  |               设置用户签名               |
|              git init               |               初始化本地库               |
|             git status              |               查看文件状态               |
|         git add [文件名称]          |          将文件的修改加入暂存区          |
|        git reset [文件名称]         |          将暂存区的文件取消暂存          |
|      git reset —hard [版本号]       |              切换到指定版本              |
|         git commit [文件名]         |        将暂存区文件提交到版本库中        |
|      git commit -m “日志信息”       | 将暂存区文件提交到版本库中并增加日志信息 |
|               git log               |                 查看日志                 |
|             git reflog              |               查看历史记录               |

### git status

<img src="https://s2.loli.net/2023/08/14/DcuWnpUvzVs386k.png" alt="image-20230801100210629" style="zoom: 67%;" />

### git add [文件名称] 

将未跟踪的文件加入到暂存区，并查看文件状态

<img src="https://s2.loli.net/2023/08/14/Qjz8ceA2HuIbnUY.png" alt="image-20230801100430539" style="zoom:67%;" />

此时发现暂存区就有文件了



### gie reset

将暂存区的文件取消暂存，并查看文件状态

<img src="https://s2.loli.net/2023/08/14/vDKi6qL4SCQVj12.png" alt="image-20230801100523282" style="zoom:67%;" />

### git commit -m "日志信息" [文件名]

将暂存区的文件提交到版本库中

- 若提交多次，会产生多个版本号
- 使用`git log`来查看版本号

<img src="https://s2.loli.net/2023/08/14/tDiwLMRQ8yh3l1z.png" alt="image-20230801100838568" style="zoom: 67%;" />

提交之前需要先添加到暂存区



### git reset --hard [版本号]

切换到指定版本

这个版本号是`git commit`提交后在`git log`上查看的，这里就不做演示了



### git rm [文件名]

删除工作区文件，并查看状态，提交之后再次查看状态

![image-20230801101357472](https://s2.loli.net/2023/08/14/EfvZsrLyqwptnAO.png)

删除的只是工作区的，仓库里的并没有被删除

## 远程仓库操作

|                命令                 |           功能           |
| :---------------------------------: | :----------------------: |
|             git remote              |       查看远程仓库       |
|            git remote -v            | 查看当前所有远程地址别名 |
|  git remote add [short-name] [url]  |       添加远程仓库       |
|     git remote rm [short-name]      |       移除远程仓库       |
|           git clone [url]           |      从远程仓库克隆      |
| git pull [short-name] [branch-name] |      从远程仓库拉取      |
| git push [short-name] [branch-name] |      推送到远程仓库      |

### git remote查看远程仓库

- 如果想查看已经配置的远程仓库服务器，可以运行`git remote`命令。它会列出指定的每一个远程服务器的简写
- 如果已经克隆了远程仓库，那么至少应该能看到`origin`，这是`Git克隆`的仓库服务器的`默认`名字

### git remote -v则可以查看更为详细的信息

![image-20230802064828067](https://s2.loli.net/2023/08/14/SX37Reap2HVlbvc.png)

### git remote add [short-name] [url]

添加远程仓库，添加一个新的远程Git仓库，同时也指定搞一个可以引用的缩写

- 使用`git remote -v`查看是否连接成功，成功连接之后，我们就可以向仓库推送/拉取数据了
- 移除远程仓库，运行`git remote rm [short-name]`
- 命令`git remote add <shortname> <url>`：将远程仓库唯一的URL`<url>` 映射成为 在本地仓库中对远程仓库起的别名`<shortname>`。
- 参数`<shortname>`：`在本地仓库中对远程仓库起的别名`。而我们按照Git官方教程，一般会把参数`<shortname>`设置为`origin`。
	 为什么要强调`在本地仓库中`？因为我们要知道`git remote add <shortname> <url>`是在我们自己的本地仓库对远程仓库起的别名，这个别名只能在我们自己的本地仓库使用，在真正的远程仓库那边，远程仓库的名字是一个绝对唯一的URL(比如:`git@github.com:michaelliao/learngit.git`)，而不是`origin`。甚至我们的开发团队成员也可以自定义这个开发团队成员他个人的本地仓库中对远程仓库起的别名

![image-20230802070539065](https://s2.loli.net/2023/08/14/lKOcaJjy467M8wG.png)

克隆仓库的命令格式是`git clone [url]`

- 如果你想获得一份已经存在了的Git仓库的拷贝，那么就需要`git clone`命令
- Git克隆的是该Git仓库服务器上的几乎所有数据（包括日志信息，历史记录等），而不仅仅是复制工作所需要的的文件
- 当你执行`git clone`命令时，默认配置下远程Git仓库的每一个文件的每一个版本都会被拉取下来

使用`git push [remote-name] [branch-name]`推送文件到远程仓库

branch-name是分支的名字，也就是仓库名旁边那个蓝色的东西，我这里设置成了master，可以自己调整

![image-20230802070836415](https://s2.loli.net/2023/08/14/OqyWIBUi5X7gYCz.png)

如果使用Gitee，可能需要登录验证



### git pull [short-name] [branch-name]

从远程仓库获取最新版本并合并到本地仓库

- 一般是多人协作的时候用，我和小明分工合作，一人写一部分，他写完上传，然后我拉取下来合并到本地仓库，会方便很多
- 注意:如果当前本地仓库不是从远程仓库克隆，而是本地创建的仓库，并且仓库中存在文件，此时再从远程仓库拉取文件的时候会报错`fatal: refusing to merge unrelated histories`
- 解决此问题可以在`git pull`命令后加入参数`--allow-unrelated-histories`

![image-20230802071235216](https://s2.loli.net/2023/08/14/CsNBILUPOXjAzac.png)

## 分支操作

### 简述

- 分支是Git使用过程中非常重要的概念
- 几乎所有的版本控制系统个都以某种形式支持分支
- 使用分支意味着你可以把你的工作从开发主线上分离开来，以免影响开发主线
- Git的`master`分支并不是一个特殊的分支，它与其他分支没有区别
- 之所以几乎每一个仓库都有`master`分支，是因为git init命令默认创建它，而大多数人都懒得去改它
- 同一个仓库可以有多个分支，各个分支相互独立，互不干扰

### 分支操作常用命令

|                  命令                  |                    功能                    |
| :------------------------------------: | :----------------------------------------: |
|               git branch               |        查看分支：列出本地的所有分支        |
|             git branch -r              |        查看分支：列出所有的远程分支        |
|             git branch -a              |   查看分支：列出所有的本地分支和远程分支   |
|        git branch [branch-name]        |                  创建分支                  |
|       git checkout [branch-name]       |                  切换分支                  |
|  git push [short-Name] [branch-name]   |             推送至远程仓库分支             |
|        git merge [branch-name]         |                  合并分支                  |
|      git branch -d [branch-name]       |                  删除分支                  |
|      git branch -D [branch-name]       | 删除分支（即使该分支中进行了一些开发动作） |
| git push [short-Name] –d [branch-name] |            删除远程仓库中的分支            |

### 分支操作展示

- 列出本地的所有分支
	- `git branch`
- 列出所有的远程分支
	- `git branch -r`
- 列出所有的本地和远程分支
	- `git branch -a`

![image-20230802211110085](https://s2.loli.net/2023/08/14/j5uiOqsIEy7UJo3.png)

- 创建分支
	- `git branch [branch-name]`
- 切换分支
	- `git checkout [branch-name]`
- 推送至远程仓库分支
	- `git push [short-Name] [branch-name]`

![image-20230802212112830](https://s2.loli.net/2023/08/14/mhTvjgnL2Z65yIA.png)

创建完成后，可以在Github对应的仓库中查看分支

<img src="https://s2.loli.net/2023/08/14/pP4wtBEDT9u7HRl.png" alt="image-20230802212100028" style="zoom:50%;" />

合并分支

- `git merge [branch-name]`
- 我们先在`test01`分支中添加点东西，然后再切换到`master`分支，合并分支，在`master`分支中可以看到`test01`分支中新添加的文件

![image-20230802212537427](https://s2.loli.net/2023/08/14/xmqpPZfnLz9JSUi.png)

合并分支的时候可能会出现冲突

- 冲突产生的原因
	- 合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改。
	- Git 无法替我们决定使用哪一个。必须通过手动操作来决定新代码内容。
- 解决方案
	- 编辑有冲突的文件，决定要使用的内容
	- 将编辑好的文件添加到暂存区，（使用`git add`命令）
	- 最后执行提交（注意：此时的提交只输入`git commit`，不要加文件名，或者执行`git commit [文件名] -i`）

删除分支

- `git branch -d [branch-name]`

![image-20230802212658822](https://s2.loli.net/2023/08/14/yUbsQZLRD7OrCSI.png)

## 标签操作

### 简述

- Git中的标签，指的是某个分支特定时间点的状态。
- 通过标签，我们可以很方便地切换到标记时的状态（给我的感觉像是Linux的快照）

### 标签操作的常用命令

|              命令               |         功能         |
| :-----------------------------: | :------------------: |
|             git tag             |       创建标签       |
|         git tag [name]          |       创建标签       |
|   git push [shortName] [name]   | 将标签推送到远程仓库 |
| git checkout -b [branch] [name] |       检出标签       |

<img src="https://s2.loli.net/2023/08/14/VoNpPRAXSjkaBi3.png" alt="image-20230802214005607" style="zoom:50%;" />

分支与标签的区别

- `标签` 是一个`静态`的概念，一旦标签确定后，其中的文件的状态就确定了。
- `分支` 是一个`动态`的概念，其中的文件的状态可以发生变化。

# 在IDEA中使用Git

- 在IDEA中使用Git，其实也是用的我们自己安装的Git
- 在 IDEA 中使用 Git 获取仓库有两种方式：   
	1. 本地初始仓库
		- 选择VCS选项卡 —> 创建Git仓库 —> 选择需要被Git管理的目录 —> 确定
	2. 从远程仓库克隆（常用）
		- 这个可以自己选择克隆的本地位置
		- 可以直接把远程仓库的代码都克隆到本地
		- 远程克隆下来的项目会自带一个文件：`.gitignore`文件，在里面的信息是代表哪些文件不需要交给git管理

关于本地仓库操作、远程仓库操作、分支操作，IDEA都给我们提供了图形化界面，方便我们使用，这里就不再展开说明了，不太明白的地方可以上百度搜搜
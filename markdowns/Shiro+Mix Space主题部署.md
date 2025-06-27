# 前言

最近时间不充足，想找一个那种方便好用的，正好看到我[葱哥的博客](https://blog.ciraos.top/)

wow，看起来非常cool，特意搜了一下，感觉符合自己的审美，也不需要花费过多时间来做其他的事，只需要专注于写文章，发布文章，而且功能非常齐全

我的博客是Shiro(前端)+Mix Space(后端)

虽然看了官方文档，但是说实话部署起来还是遇到了一些坑，这里特此写一篇文章，来防止自己以后再遇到大坑

[文档地址](https://mx-space.js.org/docs/core)

# Mix Space

我采用的是Docker部署，这种方式非常快捷，我非常建议小白用户通过该方式部署

首先根据官方文档将安装Docker的步骤完善，这里就不赘述了

紧接着我们需要拉取后端的配置文件

```bash
# 回到根目录并创建一个目录，进入该目录
cd && mkdir -p mx-space/core && cd $_
 
# 拉取 docker-compose.yml 文件
wget https://fastly.jsdelivr.net/gh/mx-space/core@master/docker-compose.yml
```

不懂这里的意思没关系，其实简单来说就是创建了一个目录，将文件放到该目录下

```bash
vim docker-compose.yml
```

这个指令的意思是打开并编辑这个文件，如果你了解vim了，那你可以直接对该文件中的

- `ALLOWED_ORIGINS`：博客的前端地址
- `JWT_SECRET`：密码，建议安全点

当然这里也有官方的说明，其他两个我没搞，这里不做说明了，有兴趣的可以在文档了解一下

- **`JWT 密钥`**：需要填写长度不小于 16 个字符，不大于 32 个字符的字符串，用于加密用户的 JWT，务必保存好自己的密钥，不要泄露给他人。
- **`被允许的域名`**：需要填写被允许的域名，通常是前端的域名，如果允许多个域名访问，用英文逗号，分隔。

```yaml
environment:
      - TZ=Asia/Shanghai
      - NODE_ENV=production
      - DB_HOST=mongo
      - REDIS_HOST=redis
      - ALLOWED_ORIGINS=博客的前端地址，这里部署的是后端
      - JWT_SECRET=??????????????????????????????
```

如果你是小白，不懂linux的指令，我建议你下载一个ssh的远程可视化工具，直接进行文件可视化编辑，我这里采用的是Xterminal，免费的

双击该文件，进行编辑

![image-20250627171330711](https://b.1wind.cn/2025/06/26f677a47ba642a87884cc4de7d8b22d.png)

**记得保存。**

在该目录，输入`docker compose up -d`

务必记住，需要反向代理！！！

我这里使用的面板是1panel

如何申请ssl，请看[这篇文章](https://blog.ciraos.top/posts/1panel/apply-certs-on-1panel)

可以自动续签！！！超级方便！！！

设置反向代理的步骤(以1panel)：

1. 左侧菜单栏，点击网站->网站
2. 点击新建网站
3. 上方点击反向代理
4. 写入对应的域名，代理地址填写127.0.0.1:2333
5. 保存后点击配置
6. 点击HTTPS，对刚刚申请好的ssl启用

通常来说，此时如果你的地址没问题，已经可以访问了

你应该访问`https://域名/proxy/qaqdmin`

如果成功了，则说明没问题;如果失败了，请对照检查是否有配置项写错了或忽略了

# Shiro

按照官方文档所述，我们需要在配置与云函数中添加一段配置

打开后台系统

左侧菜单栏->附加功能->配置与云函数

![image-20250627174421553](https://b.1wind.cn/2025/06/ad3f608c1190015a06ffb2984ffc7ba8.png)

名称：shiro

引用：theme

内容可以直接copy我这个，或copy[官方](https://mx-space.js.org/docs/themes/shiro/config)的改改

```json
{
  "footer": {
    "otherInfo": {
      "date": "2023-{{now}}"
    },
    "linkSections": []
  },
  "config": {
    "color": {
      "light": [
        "#33A6B8",
        "#FF6666",
        "#26A69A",
        "#fb7287",
        "#69a6cc",
        "#F11A7B",
        "#78C1F3",
        "#FF6666",
        "#7ACDF6"
      ],
      "dark": [
        "#F596AA",
        "#A0A7D4",
        "#ff7b7b",
        "#99D8CF",
        "#838BC6",
        "#FFE5AD",
        "#9BE8D8",
        "#A1CCD1",
        "#EAAEBA"
      ]
    },
    "bg": [
      "/static/images/F0q8mwwaIAEtird.jpeg",
      "/static/images/IMG_2111.jpeg.webp.jpg"
    ],
    "custom": {
      "css": [],
      "styles": [],
      "js": [],
      "scripts": []
    },
    "site": {
      "favicon": "/innei.svg",
      "faviconDark": "/innei-dark.svg"
    },
    "hero": {
      "title": {
        "template": [
          {
            "type": "h1",
            "text": "你好 我是 ",
            "class": "font-light text-4xl"
          },
          {
            "type": "h1",
            "text": "EastWind",
            "class": "font-medium mx-2 text-4xl"
          },
          {
            "type": "h1",
            "text": "一名热爱摸鱼的老年程序猿",
            "class": "font-light text-4xl"
          }
        ]
      },
      "description": "东风不与周郎便 铜雀春深锁二乔"
    },
    "module": {
      "activity": {
        "enable": true,
        "endpoint": "fn/ps/update"
      },
      "donate": {
        "enable": true,
        "link": "https://afdian.net/@Innei",
        "qrcode": [
          "/static/images/20191211132347.png",
          "/static/images/0424213144.png"
        ]
      },
      "bilibili": {
        "liveId": 1434499
      }
    }
  }
}
```

记得点击右上角的绿色按钮保存

接着我们通过docker-compose.yml部署前端

[官方的README](https://github.com/Innei/Shiro/blob/main/README.md#whale-%E8%BF%90%E8%A1%8C)

```yaml
mkdir shiro && cd shiro
wget https://raw.githubusercontent.com/Innei/Shiro/main/docker-compose.yml
wget https://raw.githubusercontent.com/Innei/Shiro/main/.env.template .env

vim .env # 配置环境变量
docker compose up -d
```

这里的环境变量需要配置两个，注意，这里千万不能配置错，错了，**就完了**

```properties
NEXT_PUBLIC_API_URL=https://后台根地址/api/v2
NEXT_PUBLIC_GATEWAY_URL=后台根地址
```

这里的后台根地址为纯域名，不带任何**后缀**！！！

比如我的`https://blog.1wind.cn`就是一个纯域名，而`https://blog.1wind.cn/xxx/xxx`就是不属于纯域名

按照指令依次创建，这里就不赘述了，前文已经提过这些指令的意思了

配置反向代理，此处也不赘述了，但是注意一点：`这里的域名要与前文Mix Space中的environment中说明的域名一致`

最后访问前端地址，如果成功，OK，恭喜你成功了，现在可以用了

如果失败->

打开后台系统->左侧菜单栏->设定->系统

检查前端地址、API 地址、管理后台地址、Gateway 地址

前端地址跟Mix Space的docker-compose的environment里对应的前端一致

API地址为`https://Gateway地址/api/v2`

Gateway地址为后台根地址

管理后台地址为`https://Gateway地址/proxy/qaqdmin`

# 其他

到此呢，本文基本上就结束了，但是.......

我遇到了新的问题，可能是我在配置期间有什么小差错？

好吧，反正我是没有发现

新的问题

1. 后台系统添加分类后，博客页面并没有马上同步
2. 后台系统修改配置与云函数中的shiro的theme，保存后并没有马上同步

这两个问题的解决办法：

在安装shiro的目录下，请注意是**shiro**

```bash
docker compose down
docker compose up -d
```

好的，这两个指令为我们重装了前端，并且对前端不会有任何影响，数据也成功同步了，哈哈哈，虽然方法有点蠢，但是总归是解决了问题

如果有大佬也遇到过这个问题，请在评论区call我，谢谢！

本文参考

- https://mx-space.js.org/
- https://blog.ciraos.top/posts/1panel/apply-certs-on-1panel
- https://blog.ciraos.top/posts/Mix-Space/installation
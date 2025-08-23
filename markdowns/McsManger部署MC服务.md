今天为大家介绍如何快速在自己的服务器里部署MC

先说明我的服务器配置

- **4h4g debian12**

不建议低于这个配置

# 1p安装

`bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"`

直接执行脚本就完事了，安装好之后访问1p面板

# MC服务安装

来到1p面板，左侧的应用商店

<img src="https://b.1wind.cn/2025/08/357290ea240d2ed4b1d34c9087383e81.png" alt="image-20250822220042043" style="zoom:50%;" />

一键安装就完事了

# MC服务部署

安装完成后，在容器处，访问你的前端，通常是http://服务器ip:23333，如果访问了没效果，请点击左侧容器按钮，再点击上方容器按钮

<img src="https://b.1wind.cn/2025/08/1961490dfa09d8f34d1fbba957d34d68.png" alt="image-20250822220911671" style="zoom:50%;" />

向右侧滑动，找到这个端口

![image-20250822221032820](https://b.1wind.cn/2025/08/672ebe45907fc47f00834ac814425c11.png)

40056就是新端口，换上去

来到页面后，先新增节点

![image-20250822221125110](https://b.1wind.cn/2025/08/16ed8fcc8a2e50fa05b349e30843b30b.png)

<img src="https://b.1wind.cn/2025/08/b79fe47e961ca78bedd11f0af2128720.png" alt="image-20250822221234131" style="zoom:50%;" />

填写相关信息，密钥获取也可以在后端的容器里看，点日志就行

填入后等待连接即可，记得开放端口

接着咱们添加游戏用例

<img src="https://b.1wind.cn/2025/08/bc6c09b5ac3d886f5823a22d03f7710f.png" alt="image-20250822221408631" style="zoom:50%;" />

根据自己需求选择，我这里用JAVA

![image-20250822221432288](https://b.1wind.cn/2025/08/7529b0c662ea1d6abce362016606c521.png)

选择刚刚的节点，点击快速部署，这个简单

挑选自己需要的服务器模板

**重点来了：请查看自己的服务器内存剩余多少g，这里很多模板有硬件要求: RAM 4G+，说明剩余内存必须大于这个数值，如果不大于，会有问题，当然，你可以下载**

下载后等待完成

完成后划到下方有个`服务端配置文件`，点进去

点这个`[通用] server.properties`

下滑找到`设置监听服务器的端口号（参见 enable-rcon）`

设置为你需要的访问端口，是用于访问mc服务器的，例如25566，到时候你需要用http://节点ip:25566来访问

并设置下方的`服务器端口（若服务器有更高级的设置，此选项可能会失效）`与`设置监听服务器的端口号（参见 enable-rcon）`一致

回到终端，点击启动

如果你的内存不够，启动的瞬间就会停止

那么你就需要设置了

![image-20250822222246732](https://b.1wind.cn/2025/08/cf976a903dada1827cdad6766cccdc80.png)

往下滑会有一个应用实例设置

![image-20250822222311344](https://b.1wind.cn/2025/08/7ddef54da1387b6eff437b0ef76a4d38.png)

点进去，看这里启动命令，修改为我这样的

解释一下：ms是最小值，mx是最大值，根据你的剩余内存大小来定

接着保存，再次启动

如果启动了，但是没法访问，可能是因为服务器端口映射的问题，如果你不了解docker，请按照我的方法去执行

从应用商店处的已安装找到mcsmanger的后端

点这个

![image-20250822223628803](https://b.1wind.cn/2025/08/12e7ef5e9324f05d64df45f8d15922a7.png)

找到docker-compose.yml

替换端口为你之前在配置文件里写的服务器端口，即25566

```yaml
networks:
    1panel-network:
        external: true
services:
    mcsmanager-daemon:
        container_name: ${CONTAINER_NAME}
        deploy:
            resources:
                limits:
                    cpus: ${CPUS}
                    memory: ${MEMORY_LIMIT}
        environment:
            - MCSM_DOCKER_WORKSPACE_PATH=./data/daemon/data/InstanceData
        image: githubyumao/mcsmanager-daemon:latest
        labels:
            createdBy: Apps
        networks:
            - 1panel-network
        ports:
            - ${HOST_IP}:${PANEL_APP_PORT_HTTP}:24444
            - ${HOST_IP}:端口:端口
        restart: unless-stopped
        volumes:
            - /etc/localtime:/etc/localtime:ro
            - ./data/daemon/data:/opt/mcsmanager/daemon/data
            - ./data/daemon/logs:/opt/mcsmanager/daemon/logs
            - /var/run/docker.sock:/var/run/docker.sock
```

![image-20250822223747984](https://b.1wind.cn/2025/08/85afe05a155ea87c079f7a244c5379a8.png)

点击重建

此时，基本上就可以访问了，当然如果还有问题，欢迎在评论区留言！
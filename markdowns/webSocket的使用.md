---
title: webSocket的使用
tags: webSocket
date: 2024-04-05 23:16:59
---

前段时间做了一个二手平台，上面有个聊天功能，今天就给它写一写，具体页面就不写了，讲一讲功能

webSocket的是一种全双工的通信技术，通过websocket可以监控前端的页面变化，当然，这得与前端协调才行，我这边之前使用的是Vue作为前端，前端需要做一些对应的配置，具体前端内容就不说了，可以**百度**。

这里说明一下后端，我是在springboot中来使用websocket的，使用起来很便捷

引入集成websocket的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

添加配置类

```java
@Configuration
public class WebSocketConfig{
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```

声明服务端发送消息和接收消息的功能

```java
public interface IWebSocketService {
 
    void sendMessage(String message, List<String> toSids);
 
    String getMessage(String msg);
}
```

实现类

简单解释一下这个实现类，存在注释的地方就不说明了，`sendMessage`其实就是服务端推送消息到另一个用户处，当然，因为是在线聊天，所以对方用户需要存在，如果不存在，你可以通过数据库将所发送的消息存储到数据库中，作为历史消息，在对方下一次上线后显示出来即可，服务端想获取消息，在`onMessage`这个方法，可以获取传入的数据，前端可以发json，后端使用json解析包解析一下就可以了

```java
 
@Slf4j
@Service
@ServerEndpoint("/api/websocket/{sid}")
public class IWebSocketServiceImpl implements IWebSocketService {
    @Autowired
    RabbitTemplate rabbitTemplate;
 
    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static AtomicInteger onlineCount = new AtomicInteger(0);
    //concurrent包的线程安全Set，用来存放每个客户端对应的WebSocket对象。
    private static CopyOnWriteArraySet<IWebSocketServiceImpl> webSocketSet = new CopyOnWriteArraySet<>();
 
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    //接收sid
    private String sid = "";
 
    @Override
    public void sendMessage(String message, List<String> toSids) {
        log.info("推送消息到客户端 " + toSids + "，推送内容:" + message);
 
        for (IWebSocketServiceImpl item : webSocketSet) {
            try {
                if (CollectionUtils.isEmpty(toSids)) {
                    item.sendMessage(message);
                } else if (toSids.contains(item.sid)) {
                    item.sendMessage(message);
                }
            } catch (IOException e) {
                continue;
            }
        }
    }
 
    @Override
    public String getMessage(String msg) {
        return null;
    }
 
 
    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("sid") String sid) {
        this.session = session;
        webSocketSet.add(this);     // 加入set中
        this.sid = sid;
        addOnlineCount();           // 在线数加1
        try {
//            sendMessage("conn_success");
            log.info("有新客户端开始监听,sid=" + sid + ",当前在线人数为:" + getOnlineCount());
        } catch (Exception e) {
            log.error("websocket IO Exception");
        }
    }
 
    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  // 从set中删除
        subOnlineCount();              // 在线数减1
        // 断开连接情况下，更新主板占用情况为释放
        log.info("释放的sid=" + sid + "的客户端");
        releaseResource();
    }
 
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("收到来自客户端 sid=" + sid + " 的信息:" + message);
        //此处为MQ接收功能，如果不使用则可以屏蔽,如果有需要可使用
//        if (rabbitTemplate == null) {
//            ApplicationContext context = springUtils.getApplicationContext();
//            rabbitTemplate = context.getBean(RabbitTemplate.class);
//        }
//        rabbitTemplate.convertAndSend(RabbitmqConfig.EXCHANGE_TOPICS_INFORM, //RabbitmqConfig.ROUTINGKEY_RETURN, message);
//        rabbitTemplate.convertAndSend(RabbitmqConfig.EXCHANGE_TOPICS_INFORM, //RabbitmqConfig.ROUTINGKEY_RETURN, message);
        // 群发消息
//        List<String> sids = new ArrayList<>();
//        for (WebSocketServer item : webSocketSet) {
//            sids.add(item.sid);
//        }
//        try {
//            sendMessage("客户端 " + this.sid + "发布消息：" + message, sids);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
    }
 
    private void releaseResource() {
        // 这里写释放资源和要处理的业务
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }
 
    /**
     * 发生错误回调
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error(session.getAsyncRemote() + "客户端发生错误");
        error.printStackTrace();
    }
 
    /**
     * 实现服务器主动推送消息到 指定客户端
     */
    public void sendMessage(String message) throws IOException {
        this.session.getAsyncRemote().sendText(message);
    }
 
    /**
     * 获取当前在线人数
     *
     * @return
     */
    public int getOnlineCount() {
        return onlineCount.get();
    }
 
    /**
     * 当前在线人数 +1
     *
     * @return
     */
    public void addOnlineCount() {
        onlineCount.getAndIncrement();
    }
 
    /**
     * 当前在线人数 -1
     *
     * @return
     */
    public void subOnlineCount() {
        onlineCount.getAndDecrement();
    }
 
    /**
     * 获取当前在线客户端对应的WebSocket对象
     *
     * @return
     */
    public CopyOnWriteArraySet<IWebSocketServiceImpl> getWebSocketSet() {
        return webSocketSet;
    }
 
}
```

使用起来还是非常简单的，如果有小伙伴觉得哪里写的不太正确，可以指出，感谢支持！

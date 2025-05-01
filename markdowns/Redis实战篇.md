---
title: Redis实战篇
tags: Redis
date: 2023-8-28
---

# 短信登录

## 导入项目

### 导入SQL

在资料中运行对应的SQL文件即可，其中的表有

|        表        |           说明            |
| :--------------: | :-----------------------: |
|     tb_user      |          用户表           |
|   tb_user_info   |        用户详情表         |
|     tb_shop      |        商户信息表         |
|   tb_shop_type   |        商户类型表         |
|     tb_blog      | 用户日记表（达人探店日记) |
|    tb_follow     |        用户关注表         |
|    tb_voucher    |         优惠券表          |
| tb_voucher_order |      优惠券的订单表       |

### 导入后端项目

在idea中打开资料中的项目，并修改一下里面的application.yaml文件里的配置

添加以下SpringBoot的启动模块

![image-20230828091255195](https://s2.loli.net/2023/08/28/OskUp3KSiCFNPEQ.png)

启动项目，访问http://localhost:8081/shop-type/list测试一下效果

效果如下，说明成功了

![image-20230828091640486](https://s2.loli.net/2023/08/28/AacYuoVZ1yKdGB7.png)



### 导入前端项目

在`nginx.exe`所在的目录打开cmd

输入`start nginx.exe`

**nginx.exe所在的目录不允许存在中文！！！**

访问`localhost:8080`

<img src="https://s2.loli.net/2023/08/28/fcITsMiYpuVKJFR.png" alt="image-20230828093008480" style="zoom: 50%;" />

## 基于Session实现登录

### 工作流程

![image-20230828102525375](https://s2.loli.net/2023/08/28/GeIup5vWVZr3HP8.png)

### 发送短信验证码

进入短信验证码的页面，点击按钮查看对应的请求地址

请求方式为`POST`，请求路径为`/user/code`，请求参数为phone（电话号码）

![image-20230828145307766](https://s2.loli.net/2023/08/28/ZMFg6tCIsLW19ve.png)

来到UserController下进行代码的编写

```java
/**
 * 发送手机验证码
 */
@PostMapping("code")
public Result sendCode(@RequestParam("phone") String phone, HttpSession session) {
    // 发送短信验证码并保存验证码
    userService.sendCode(phone,session);
    return Result.fail("功能未完成");
}
```

IUserService

```java
Result sendCode(String phone, HttpSession session);
```

UserServiceImpl

```java
import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hmdp.dto.Result;
import com.hmdp.entity.User;
import com.hmdp.mapper.UserMapper;
import com.hmdp.service.IUserService;
import com.hmdp.utils.RegexUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {


    @Override
    public Result sendCode(String phone, HttpSession session) {
        // 1、校验手机号(RegexUtils里面封装了判断是否是手机号的方法)
        boolean phoneInvalid = RegexUtils.isPhoneInvalid(phone);

        // 2、如果不符合，返回错误信息
        if (!phoneInvalid) {
            return Result.fail("请输入正确的手机号");
        }

        // 3、符合，生成验证码(使用随机生成器生成验证码)
        String code = RandomUtil.randomNumbers(6);

        // 4、保存验证码到session
        session.setAttribute("code", code);

        // 5、发送验证码(假设验证码发送成功-->由于手机验证码办理太过复杂，所以就不发送了，直接在底层查看)
        log.info("验证码为{}", code);

        return Result.ok();
    }
}
```

重启服务器，并测试

![image-20230828172917490](https://s2.loli.net/2023/08/28/EMvdnqopFkJixZy.png)

这里得到了验证码，说明没毛病了



### 短信验证码登录

点击登录，查看一下请求地址`http://localhost:8080/api/user/login`

请求方式为`POST`，请求地址为`/user/login`，请求参数是以json形式传递的一个phone（电话号码），和code（验证码），无返回值

在`Payload`这里可以看到传递来的参数

![image-20230828173753182](https://s2.loli.net/2023/08/28/v2HXBjLe1IcuDkm.png)

这里我们采用邮箱验证，先在数据库中更改phone字段类型，将varchar的长度改为100

导入邮箱验证需要的maven坐标

```xml
<!-- https://mvnrepository.com/artifact/javax.activation/activation -->
<dependency>
    <groupId>javax.activation</groupId>
    <artifactId>activation</artifactId>
    <version>1.1.1</version>
</dependency>
<!-- https://mvnrepository.com/artifact/javax.mail/mail -->
<dependency>
    <groupId>javax.mail</groupId>
    <artifactId>mail</artifactId>
    <version>1.4.7</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.commons/commons-email -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-email</artifactId>
    <version>1.4</version>
</dependency>
```

编写邮箱验证需要的工具类

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;

public class MailUtils {
    public static void main(String[] args) throws MessagingException {
        //可以在这里直接测试方法，填自己的邮箱即可
        sendTestMail("3162106996@qq.com", new MailUtils().achieveCode());
    }

    public static void sendTestMail(String email, String code) throws MessagingException {
        // 创建Properties 类用于记录邮箱的一些属性
        Properties props = new Properties();
        // 表示SMTP发送邮件，必须进行身份验证
        props.put("mail.smtp.auth", "true");
        //此处填写SMTP服务器
        props.put("mail.smtp.host", "smtp.qq.com");
        //端口号，QQ邮箱端口587
        props.put("mail.smtp.port", "587");
        // 此处填写，写信人的账号
        props.put("mail.user", "3162106996@qq.com");
        // 此处填写16位STMP口令
        props.put("mail.password", "你的口令");
        // 构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };
        // 使用环境属性和授权信息，创建邮件会话
        Session mailSession = Session.getInstance(props, authenticator);
        // 创建邮件消息
        MimeMessage message = new MimeMessage(mailSession);
        // 设置发件人
        InternetAddress form = new InternetAddress(props.getProperty("mail.user"));
        message.setFrom(form);
        // 设置收件人的邮箱
        InternetAddress to = new InternetAddress(email);
        message.setRecipient(RecipientType.TO, to);
        // 设置邮件标题
        message.setSubject("Eastwind 邮件测试");
        // 设置邮件的内容体
        message.setContent("尊敬的用户:你好!\n注册验证码为:" + code + "(有效期为一分钟,请勿告知他人)", "text/html;charset=UTF-8");
        // 最后当然就是发送邮件啦
        Transport.send(message);
    }

    public static String achieveCode() {  //由于数字 1 、 0 和字母 O 、l 有时分不清楚，所以，没有数字 1 、 0
        String[] beforeShuffle = new String[]{"2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F",
                "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a",
                "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
                "w", "x", "y", "z"};
        List<String> list = Arrays.asList(beforeShuffle);//将数组转换为集合
        Collections.shuffle(list);  //打乱集合顺序
        StringBuilder sb = new StringBuilder();
        for (String s : list) {
            sb.append(s); //将集合转化为字符串
        }
        return sb.substring(3, 8);
    }
}
```

修改sendCode方法，逻辑如下

- 验证手机号/邮箱格式
- 正确则发送验证码

```java
@Override
    public Result sendCode(String phone, HttpSession session) throws MessagingException {
        // 1、校验邮箱(RegexUtils里面封装了判断是否是邮箱的方法)
        boolean phoneInvalid = RegexUtils.isEmailInvalid(phone);

        // 2、如果不符合，返回错误信息
        if (!phoneInvalid) {
            return Result.fail("请输入正确的邮箱号码");
        }

        // 3、符合，生成验证码(这里使用刚刚的邮箱工具类，来生成随机邮箱验证码)
        String code = MailUtils.achieveCode();

        // 4、保存验证码到session
        session.setAttribute("code", code);

        // 5、发送验证码(假设验证码发送成功-->由于手机验证码办理太过复杂，所以就不发送了，直接在底层查看)
        log.info("验证码为{}", code);
        MailUtils.sendTestMail(phone,code);

        return Result.ok();
    }
```

然后输入邮箱，发送验证码，看看能否接收到验证码

测试没有问题之后，我们继续来编写登录功能

```java
/**
     * 登录功能
     * @param loginForm 登录参数，包含手机号、验证码；或者手机号、密码
     */
    @PostMapping("/login")
    public Result login(@RequestBody LoginFormDTO loginForm, HttpSession session){
        // 实现登录功能
        return userService.login(loginForm,session);
    }
```

IUserService

```java
Result login(LoginFormDTO loginForm, HttpSession session);
```

UserServiceImpl

```java
@Autowired
private IUserService userService;

@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
    // 1、校验手机号
    // 获取登录账号
    String loginFormPhone = loginForm.getPhone();

    // 获取登录验证码
    String loginFormCode = loginForm.getCode();

    // 获取session中的验证码
    String code = (String) session.getAttribute("code");


    // 2、校验验证码
    if (!RegexUtils.isEmailInvalid(loginFormCode)){
        // 3、不一致，报错
        return Result.fail("请输入正确的邮箱");
    }


    // 4、一致，根据手机号查询用户
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(User::getPhone,loginFormPhone);
    User user = userService.getOne(queryWrapper);

    // 5、判断用户是否存在
    if (user == null){
        // 6、不存在，创建新用户并保存
        user = createUserWithPhone(loginFormPhone);
    }

    // 7、保存用户信息到session中
    session.setAttribute("user",user);

    return Result.ok();
}

/**
 * 用户登录
 * */
private User createUserWithPhone(String loginFormPhone) {
    // 创建用户
    User user = new User();
    // 设置手机号
    user.setPhone(loginFormPhone);
    // 设置昵称(默认名)，一个固定前缀+随机字符串
    user.setNickName("user_"+RandomUtil.randomString(8));
    // 保存到数据库
    userService.save(user);
    return user;
}
```

### 实现登录拦截

多个业务逻辑需要校验的话，就要用到拦截器了

创建一个`LoginInterceptor`类，实现`HandlerInterceptor`接口，重写其中的两个方法，前置拦截器和完成处理方法，前置拦截器主要用于我们登陆之前的权限校验，完成处理方法是用于处理登录后的信息，避免内存泄露 

在此之前，需要修改`UserHolder`中所写的ThreadLocal方法，因为它采用的是UserDto，需要改为User

UserHolder

```java
import com.hmdp.entity.User;

public class UserHolder {
    private static final ThreadLocal<User> tl = new ThreadLocal<>();

    public static void saveUser(User user){
        tl.set(user);
    }

    public static User getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }
}
```

LoginInterceptor

```java
import com.hmdp.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 拦截器
 * */
public class LoginInterceptor implements HandlerInterceptor {

    /**
     * 前置拦截
     * */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1、获取session
        HttpSession session = request.getSession();

        // 2、获取session中的用户
        User user = (User) session.getAttribute("user");

        // 3、判断用户是否存在
        if (user == null) {
            // 4、不存在，拦截
            response.setStatus(401);
            return false;
        }

        // 5、存在，保存用户信息到ThreadLocal(在utils中的UserHolder中已经封装好了这些方法)
        UserHolder.saveUser(user);

        // 6、放行
        return true;

    }

    /**
     * 视图渲染后，返回给用户前
     * */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 移除用户
        UserHolder.removeUser();
    }
}
```

配置拦截器

MvcConfig

```java
import com.hmdp.utils.LoginInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 排除哪些路径
        registry.addInterceptor(new LoginInterceptor()).excludePathPatterns(
                "/user/code",
                "/user/login",
                "/blog/hot",
                "/shop/**",
                "/shop-type/**",
                "/voucher/**"
        );
    }
}
```

编写获取当前用户的代码

```java
@GetMapping("/me")
public Result me(){
    // 获取当前登录的用户并返回
    User user = UserHolder.getUser();
    return Result.ok(user);
}
```

测试

先运行一下http://localhost:8080/api/user/me

因为有拦截器的存在，而且我们设置了状态码为401

<img src="https://s2.loli.net/2023/08/28/saPHhpVjuqZToRQ.png" alt="image-20230828222540216" style="zoom:50%;" />

没啥问题，登录后再查看一下，成功

<img src="https://s2.loli.net/2023/08/28/7YFD95knbG4zRa3.png" alt="image-20230828223436217" style="zoom:50%;" />

### 隐藏用户敏感信息

如果直接存储一个user对象可能会泄露很多的信息在上面，所以我们需要修改存储session属性的方法

```diff
 @Override
    public Result login(LoginFormDTO loginForm, HttpSession session) {
        // 1、校验手机号
        // 获取登录账号
        String loginFormPhone = loginForm.getPhone();

        // 获取登录验证码
        String loginFormCode = loginForm.getCode();

        // 获取session中的验证码
        String code = (String) session.getAttribute("code");


        // 2、校验验证码
        if (!RegexUtils.isEmailInvalid(loginFormCode)){
            // 3、不一致，报错
            return Result.fail("请输入正确的邮箱");
        }


        // 4、一致，根据手机号查询用户
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone,loginFormPhone);
        User user = userService.getOne(queryWrapper);

        // 5、判断用户是否存在
        if (user == null){
            // 6、不存在，创建新用户并保存
            user = createUserWithPhone(loginFormPhone);
        }

        // 7、保存用户信息到session中
--    session.setAttribute("user",user);
++ 	  session.setAttribute("user", BeanUtil.copyProperties(user, UserDTO.class));

        return Result.ok();
    }
```

再去修改获取session属性的方法

LoginInterceptor

```java
import com.hmdp.dto.UserDTO;
import com.hmdp.entity.User;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 拦截器
 * */
public class LoginInterceptor implements HandlerInterceptor {

    /**
     * 前置拦截
     * */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1、获取session
        HttpSession session = request.getSession();

        // 2、获取session中的用户
        UserDTO user = (UserDTO) session.getAttribute("user");

        // 3、判断用户是否存在
        if (user == null) {
            // 4、不存在，拦截
            response.setStatus(401);
            return false;
        }

        // 5、存在，保存用户信息到ThreadLocal(在utils中的UserHolder中已经封装好了这些方法)
        UserHolder.saveUser(user);

        // 6、放行
        return true;

    }

    /**
     * 视图渲染后，返回给用户前
     * */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 移除用户
        UserHolder.removeUser();
    }
}
```

UserHolder

```java
import com.hmdp.dto.UserDTO;
import com.hmdp.entity.User;

public class UserHolder {
    private static final ThreadLocal<UserDTO> tl = new ThreadLocal<>();

    public static void saveUser(UserDTO user){
        tl.set(user);
    }

    public static UserDTO getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }
}
```

这里就得到了数据，而且与想要限定的数值是一样的，没有过多的暴露数据

![image-20230829085059993](https://s2.loli.net/2023/08/29/LZojzRI3gEGu8KQ.png)

## 集群的session共享问题

**session共享问题**：多台Tomcat并不共享session存储空间，当请求切换到不同Tomcat服务器时导致数据丢失的问题

当有多台Tomcat的服务器时，是不共享session存储空间的，所以Tomcat提出了一个改进，在多台需要共享数据的Tomcat服务器上做一些配置，就可以共享它们的session，也不能完全说共享，准确来说叫拷贝，就是当一台Tomcat接收到数据后，拷贝到另一台Tomcat服务器上，当然，这个拷贝是有时间的，当你正在拷贝时，其他人如果访问了另外的服务器，此时，拷贝还没完成，但是那个人已经访问了，就会导致拿不到对应的数据，也会导致数据丢失

解决方案：

- 使用Redis缓存，因为Redis不属于Tomcat，而是一个个体，当你使用多台Tomcat去访问时，就没啥问题了



## 基于Redis实现共享session登录

思路：校验登录状态时，前端会携带token,token中存储了用户相关的信息，我们通过token去redis中获取之前登录或注册后的保存起来的用户信息，如果用户信息存在，保存用户信息到ThreadLocal，否则就进行拦截

而在校验验证码时，我们可以将手机号存到redis中，key为手机号，value为验证码，通过redis中的手机号读取对应的验证码，即使其他人访问，这个数据也会是共享的

### 发送短信验证码

修改UserServiceImpl中的sendCode方法

```java
@Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Result sendCode(String phone, HttpSession session) throws MessagingException {
        // 1、校验邮箱(RegexUtils里面封装了判断是否是邮箱的方法)
        boolean phoneInvalid = RegexUtils.isEmailInvalid(phone);

        // 2、如果不符合(true)，返回错误信息
        if (phoneInvalid) {
            return Result.fail("请输入正确的邮箱号码");
        }

        // 3、符合，生成验证码(这里使用刚刚的邮箱工具类，来生成随机邮箱验证码)
        String code = MailUtils.achieveCode();

        // 4、保存验证码到Redis(并设置有效期为2分钟)
        stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone,code,LOGIN_CODE_TTL, TimeUnit.MINUTES);

        // 5、发送验证码(假设验证码发送成功-->由于手机验证码办理太过复杂，所以就不发送了，直接在底层查看)
        log.info("验证码为{}", code);
        MailUtils.sendTestMail(phone,code);

        return Result.ok();
    }
```

### 短信验证码登录

```java
@Autowired
private IUserService userService;

@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
    // 1、校验手机号
    // 获取登录账号
    String loginFormPhone = loginForm.getPhone();

    // 获取登录验证码
    String loginFormCode = loginForm.getCode();

    // 获取redis中的验证码
    String code = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + loginFormPhone);

    // 2、校验验证码
    if (!RegexUtils.isEmailInvalid(loginFormCode)){
        // 3、不一致，报错
        return Result.fail("请输入正确的邮箱");
    }


    // 4、一致，根据手机号查询用户
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(User::getPhone,loginFormPhone);
    User user = userService.getOne(queryWrapper);

    // 5、判断用户是否存在
    if (user == null){
        // 6、不存在，创建新用户并保存
        user = createUserWithPhone(loginFormPhone);
    }

    // 7、保存用户信息到Redis中
    // 7.1 随机生成token(UUID)，作为登录令牌
    String token = UUID.randomUUID().toString(true);

    // 7.2 将User对象转为Hash存储
    UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);

    // 通过BeanUtil.beanToMap可以将bean转为Hash
    Map<String, Object> beanToMap = BeanUtil.beanToMap(userDTO);

    // 7.3 token为key，Hash为值存储到redis中
    // putAll可以一次存多个键值对
    stringRedisTemplate.opsForHash().putAll(LOGIN_USER_KEY+token, beanToMap);

    // 7.4设置token有效期为30分钟，这里应该是每次访问地址时都会设置token的有效期
    // 不然只有一次，就没啥效果，在登录拦截器中设置
    stringRedisTemplate.expire(LOGIN_USER_KEY+token,LOGIN_USER_TTL,TimeUnit.MINUTES);

    // 返回token
    return Result.ok(token);
}

/**
 * 用户登录
 * */
private User createUserWithPhone(String loginFormPhone) {
    // 创建用户
    User user = new User();
    // 设置手机号
    user.setPhone(loginFormPhone);
    // 设置昵称(默认名)，一个固定前缀+随机字符串
    user.setNickName("user_"+RandomUtil.randomString(8));
    // 保存到数据库
    userService.save(user);
    return user;
}
```

LoginInterceptor

```java
private StringRedisTemplate stringRedisTemplate;

public LoginInterceptor(StringRedisTemplate stringRedisTemplate) {
    this.stringRedisTemplate = stringRedisTemplate;
}

/**
 * 前置拦截
 * */
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    // 1、获取请求头中的token
    String token = request.getHeader("authorization");

    if (StrUtil.isBlank(token)) {
        // 不存在token，说明未登录，拦截
        response.setStatus(401);
        return false;
    }

    // 2、基于token获取redis中的用户
    // entries方法可以返回一个Map集合
    Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(LOGIN_USER_KEY + token);



    // 3、判断用户是否存在
    if (entries.isEmpty()) {
        // 4、不存在，拦截
        response.setStatus(401);
        return false;
    }

    // 5、将查询到的Hash数据转为Dto对象
    // fillBeanWithMap(传递的map，转换的对象，转换过程中出现错误是否抛出还是忽略)
    UserDTO userDTO = BeanUtil.fillBeanWithMap(entries, new UserDTO(), false);

    // 6、存在，保存用户信息到ThreadLocal(在utils中的UserHolder中已经封装好了这些方法)
    UserHolder.saveUser(userDTO);

    // 7、刷新token的有效期
    stringRedisTemplate.expire(LOGIN_USER_KEY + token,LOGIN_USER_TTL, TimeUnit.MINUTES);

    /// 8、放行
    return true;

}
```

MvcConfig

因为这里使用的构造方法，所以需要在构造器处添加一个



```java
@Resource
private StringRedisTemplate stringRedisTemplate;

@Override
public void addInterceptors(InterceptorRegistry registry) {
    // 排除哪些路径
    registry.addInterceptor(new LoginInterceptor(stringRedisTemplate)).excludePathPatterns(
            "/user/code",
            "/user/login",
            "/blog/hot",
            "/shop/**",
            "/shop-type/**",
            "/voucher/**"
    );
}
```

UserServiceImpl

在运行时出现了错误，因为StringRedisTemplate的值只能为String，所以调整了StringRedisTemplate

```java
@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
    // 1、校验手机号
    // 获取登录账号
    String loginFormPhone = loginForm.getPhone();

    // 获取登录验证码
    String loginFormCode = loginForm.getCode();

    // 获取redis中的验证码
    String code = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + loginFormPhone);

    // 2、校验验证码
    if (!RegexUtils.isEmailInvalid(loginFormCode)){
        // 3、不一致，报错
        return Result.fail("请输入正确的邮箱");
    }


    // 4、一致，根据手机号查询用户
    LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(User::getPhone,loginFormPhone);
    User user = userService.getOne(queryWrapper);

    // 5、判断用户是否存在
    if (user == null){
        // 6、不存在，创建新用户并保存
        user = createUserWithPhone(loginFormPhone);
    }

    // 7、保存用户信息到Redis中
    // 7.1 随机生成token(UUID)，作为登录令牌
    String token = UUID.randomUUID().toString(true);

    // 7.2 将User对象转为Hash存储
    UserDTO userDTO = BeanUtil.copyProperties(user, UserDTO.class);

    // 通过BeanUtil.beanToMap可以将bean转为Hash
    // beanToMap可以自定义类型
    // setFieldValueEditor可以改变存储的类型
    // (field,fieldValue) -> fieldValue.toString())可以将返回的值转为String
    // 因为StringRedisTemplate里面的值，只能为String，所以需要修改
    Map<String, Object> beanToMap = BeanUtil.beanToMap(userDTO,new HashMap<>(), CopyOptions.create()
            .setIgnoreNullValue(true)
            .setFieldValueEditor((field,fieldValue) -> fieldValue.toString()));

    // 7.3 token为key，Hash为值存储到redis中
    // putAll可以一次存多个键值对
    stringRedisTemplate.opsForHash().putAll(LOGIN_USER_KEY+token, beanToMap);

    // 7.4设置token有效期为30分钟
    stringRedisTemplate.expire(LOGIN_USER_KEY+token,LOGIN_USER_TTL,TimeUnit.MINUTES);

    // 返回token
    return Result.ok(token);
}
```

测试，在Redis中查看验证码是否被缓存以及token的情况

![image-20230829121248143](https://s2.loli.net/2023/08/29/d1O5p8bT7oVSaNt.png)

查看请求头中的token

![image-20230829121427217](https://s2.loli.net/2023/08/29/Qot6dYW1IxyJnTs.png)

### 解决登录状态刷新的问题

在上面的方案中，他确实可以使用对应路径的拦截，同时刷新登录token令牌的存活时间，但是现在这个拦截器他只是拦截需要被拦截的路径，假设当前用户访问了一些不需要拦截的路径，那么这个拦截器就不会生效，所以此时令牌刷新的动作实际上就不会执行，所以这个方案他是存在问题的

应该修改为，只要用户登录了，无论访问什么路径都会刷新登录状态的存在时间，这样就解决了问题

修改登录拦截器`LoginInterceptor`

登录拦截器负责拦截无token状态的用户，在token刷新后执行

```java
/**
 * 拦截器(拦截无token状态的用户)
 */
public class LoginInterceptor implements HandlerInterceptor {

    /**
     * 前置拦截
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 判断是否需要拦截(ThreadLocal中是否存在用户)
        if (UserHolder.getUser() == null) {
            // 如果没有，说明用户未登录，需要拦截
            return false;
        }
        // 如果有，直接放行
        return true;

    }
}
```

`RefreshTokenInterceptor`

当用户存在并操作时刷新并保存token

```java
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.hmdp.dto.UserDTO;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.hmdp.utils.RedisConstants.LOGIN_USER_KEY;
import static com.hmdp.utils.RedisConstants.LOGIN_USER_TTL;

/**
 * 拦截器(登录才进行token刷新)
 */
public class RefreshTokenInterceptor implements HandlerInterceptor {

    private StringRedisTemplate stringRedisTemplate;

    public RefreshTokenInterceptor(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * 前置拦截
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1、获取请求头中的token
        String token = request.getHeader("authorization");
        if (StrUtil.isBlank(token)) {
            // 不管是否存在，都放行
            return true;
        }

        // 2、基于token获取redis中的用户
        // entries方法可以返回一个Map集合
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(LOGIN_USER_KEY + token);
        // 3、判断用户是否存在
        if (entries.isEmpty()) {
            return true;
        }

        // (token是登录后才有的)

        // 4、将查询到的Hash数据转为Dto对象
        // fillBeanWithMap(传递的map，转换的对象，转换过程中出现错误是否抛出还是忽略)
        UserDTO userDTO = BeanUtil.fillBeanWithMap(entries, new UserDTO(), false);

        // 5、存在，保存用户信息到ThreadLocal(在utils中的UserHolder中已经封装好了这些方法)
        UserHolder.saveUser(userDTO);

        // 6、刷新token的有效期
        stringRedisTemplate.expire(LOGIN_USER_KEY + token, LOGIN_USER_TTL, TimeUnit.MINUTES);

        // 7、放行
        return true;

    }

    /**
     * 视图渲染后，返回给用户前
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 移除用户
        UserHolder.removeUser();
    }
}
```

配置拦截器`MvcConfig`

```java
import com.hmdp.utils.LoginInterceptor;
import com.hmdp.utils.RefreshTokenInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // excludePathPatterns排除哪些路径
        // 登录拦截器
        registry.addInterceptor(new LoginInterceptor()).excludePathPatterns(
                "/user/code",
                "/user/login",
                "/blog/hot",
                "/shop/**",
                "/shop-type/**",
                "/voucher/**"
        ).order(1);
        // 拦截所有请求
        // order一般用来决定拦截器的顺序,order越小，越先执行
        // token刷新拦截器
        registry.addInterceptor(new RefreshTokenInterceptor(stringRedisTemplate)).addPathPatterns("/**").order(0);
    }
}
```

测试访问不同地址时，登录状态是否刷新token

# 商户查询缓存

## 什么是缓存

缓存是数据交换的缓冲期(Cache)，是存储数据的临时地方，一般读写性能较高

或者另类点的说法，就是当你查看了一件商品，商品数据会留着，当你再次访问时，直接为你返回留下的商品数据，大大的减少了服务器的压力

缓存的作用

- 降低后端负载
- 提高读写效率，降低响应时间



## 添加Redis缓存

访问商户，查看一下商户对应的请求

![image-20230830085759673](https://s2.loli.net/2023/08/30/eo3PXbG1ChxvLT5.png)

请求方式`GET`，请求地址`/shop/商户的id`

这个请求对应着`ShopController`下的`queryShopById`，该方法是直接返回查询到的一个数据库数据

### 实现流程

缓存的工作流程

- 客户端向Redis发起请求
	- 请求命中：直接从Redis返回数据给客户端
	- 请求未命中：从数据库中查询对应数据，并写入到Redis缓存中，再返回数据给客户端

根据id查询商铺缓存的流程

- 提交商铺id，从Redis中查询商铺缓存
	- 缓存命中：从Redis之间返回商铺缓存
	- 缓存未命中：根据id查询数据库
		- 商铺存在：将商铺数据写入Redis，并返回商铺信息
		- 商铺不存在：返回404

![image-20230830090439233](https://s2.loli.net/2023/08/30/FQUntJwTg4uCLNm.png)

queryShopById

```java
/**
 * 根据id查询商铺信息
 * @param id 商铺id
 * @return 商铺详情数据
 */
@GetMapping("/{id}")
public Result queryShopById(@PathVariable("id") Long id) {
    return shopService.queryById(id);
}
```

IShopService

```java
import com.hmdp.dto.Result;
import com.hmdp.entity.Shop;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
public interface IShopService extends IService<Shop> {

    Result queryById(Long id);
}
```

ShopServiceImpl

```java
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.hmdp.dto.Result;
import com.hmdp.entity.Shop;
import com.hmdp.mapper.ShopMapper;
import com.hmdp.service.IShopService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import static com.hmdp.utils.RedisConstants.CACHE_SHOP_KEY;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
@Service
public class ShopServiceImpl extends ServiceImpl<ShopMapper, Shop> implements IShopService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Result queryById(Long id) {
        // 从redis查询商铺缓存
        String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
        // 判断是否存在
        if (StrUtil.isNotBlank(cache)){
            // 存在，直接返回
            // 返回前需要转为对象
            Shop shop = JSONUtil.toBean(cache, Shop.class);
            return Result.ok(shop);
        }
        // 不存在，根据id查询数据库
        Shop shop = getById(id);
        if (shop == null){
            // 查询数据库后不存在，返回错误
            return Result.fail("未找到该商铺信息");
        }
        // 存在，写入redis
        // 转换前需要将对象转为json字符串存入
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(shop));
        //返回
        return Result.ok(shop);
    }
}
```

测试，查看redis，此时已经将数据存入了，再次刷新，也没有再去访问数据库了

![image-20230830094730782](https://s2.loli.net/2023/08/30/53hGoYtEkFwPHu1.png)

无缓存时的访问速度

![image-20230830095002607](https://s2.loli.net/2023/08/30/ce4dkKR26uBsU9i.png)

有缓存时的访问速度

![image-20230830095016381](https://s2.loli.net/2023/08/30/AjlpfTv7Xe1J6Da.png)

快了近十倍，缓存真香

### 店铺类型查询业务添加缓存

#### 使用Redis中的String缓存

为ShopTypeController的queryTypeList添加缓存

```java
@GetMapping("list")
public Result queryTypeList() {
    return typeService.queryList();
}
```

IShopTypeService

```java
import com.hmdp.dto.Result;
import com.hmdp.entity.ShopType;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
public interface IShopTypeService extends IService<ShopType> {

    Result queryList();
}
```

ShopTypeServiceImpl

```java
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.hmdp.dto.Result;
import com.hmdp.entity.ShopType;
import com.hmdp.mapper.ShopTypeMapper;
import com.hmdp.service.IShopTypeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author 虎哥
 * @since 2021-12-22
 */
@Service
public class ShopTypeServiceImpl extends ServiceImpl<ShopTypeMapper, ShopType> implements IShopTypeService {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public Result queryList() {
        String token = "shop-type:list";
        String shopList = stringRedisTemplate.opsForValue().get(token);
        // 查询结果不为空
        if (StrUtil.isNotBlank(shopList)) {
            List<ShopType> shopTypes = JSONUtil.toList(shopList, ShopType.class);
            return Result.ok(shopTypes);
        }
        // 查询结果为空
        List<ShopType> sort = query().orderByAsc("sort").list();
        if (sort == null){
            // 如果数据库查到的也为空
            return Result.fail("店铺类型不存在");
        }
        // 存入redis
        String toJsonStr = JSONUtil.toJsonStr(sort);
        stringRedisTemplate.opsForValue().set(token,toJsonStr);
        // 返回数据
        return Result.ok(sort);
    }
}
```

#### 使用Redis中的List缓存

```java
@Override
public Result queryList() {
    //先从Redis中查，这里的常量值是固定前缀 + 店铺id
    List<String> shopTypes =
            stringRedisTemplate.opsForList().range(CACHE_SHOP_TYPE_KEY, 0, -1);
    //如果不为空（查询到了），则转为ShopType类型直接返回
    if (!shopTypes.isEmpty()) {
        List<ShopType> tmp = new ArrayList<>();
        // 遍历查询得到的每一个String类型，通过JSONUtil转为ShopType存到新集合中，并返回
        for (String types : shopTypes) {
            ShopType shopType = JSONUtil.toBean(types, ShopType.class);
            tmp.add(shopType);
        }
        return Result.ok(tmp);
    }
    //否则去数据库中查
    List<ShopType> tmp = query().orderByAsc("sort").list();
    if (tmp == null){
        return Result.fail("店铺类型不存在！！");
    }
    //查到了转为json字符串，存入redis
    for (ShopType shopType : tmp) {
        String jsonStr = JSONUtil.toJsonStr(shopType);
        shopTypes.add(jsonStr);
    }
    stringRedisTemplate.opsForList().leftPushAll(CACHE_SHOP_TYPE_KEY,shopTypes);
    //最终把查询到的商户分类信息返回给前端
    return Result.ok(tmp);
}
```

stream流简化代码

```java
@Override
public Result queryList() {
    // 先从Redis中查，这里的常量值是固定前缀 + 店铺id
    List<String> shopTypes =
            stringRedisTemplate.opsForList().range(CACHE_SHOP_TYPE_KEY, 0, -1);
    // 如果不为空（查询到了），则转为ShopType类型直接返回
    if (!shopTypes.isEmpty()) {
        List<ShopType> tmp = shopTypes.stream().map(type -> JSONUtil.toBean(type, ShopType.class)).collect(Collectors.toList());
        return Result.ok(tmp);
    }
    // 否则去数据库中查
    List<ShopType> tmp = query().orderByAsc("sort").list();
    if (tmp == null){
        return Result.fail("店铺类型不存在！！");
    }
    // 查到了转为json字符串，存入redis
    shopTypes = tmp.stream().map(type -> JSONUtil.toJsonStr(type))
                                    .collect(Collectors.toList());
    stringRedisTemplate.opsForList().leftPushAll(CACHE_SHOP_TYPE_KEY,shopTypes);
    // 最终把查询到的商户分类信息返回给前端
    return Result.ok(tmp);
}
```

## 缓存更新策略

缓存更新是Redis为了节约内存而设计出来的一个东西，主要是因为内存数据宝贵，当我们想Redis插入太多数据，此时就可能会导致缓存中数据过多，所以Redis会对部分数据进行更新，或者把它成为淘汰更合适

| 内存淘汰 |                           超时剔除                           |                           主动更新                           |                                                |
| :------: | :----------------------------------------------------------: | :----------------------------------------------------------: | ---------------------------------------------- |
|   说明   | 不用自己维护， 利用Redis的内存淘汰机制， 当内存不足时自动淘汰部分数据。 下次查询时更新缓存。 | 给缓存数据添加TTL时间， 到期后自动删除缓存。 下次查询时更新缓存。 | 编写业务逻辑， 在修改数据库的同时， 更新缓存。 |
|  一致性  |                              差                              |                             一般                             | 好                                             |
| 维护成本 |                              无                              |                              低                              | 高                                             |

- 业务场景  
	- 低一致性需求：使用内存淘汰机制，例如店铺类型的查询缓存（因为这个很长一段时间都不需要更新）
	- 高一致性需求：主动更新，并以超时剔除作为兜底方案，例如店铺详情查询的缓存

一般看场景使用

### 主动更新策略

- Cache Aside Pattern（缓存旁模式）：由缓存的调用者，在更新数据库的同时更新缓存
- Read/Write Through Pattern（读/写 通过模式）：缓存与数据库整合为一个服务，由服务来维护一致性。调用者直接调用该服务，无需关心缓存一致性问题
	- 缺点：服务难整合
- Write Behind Caching Pattern（写在缓存模式后）：调用者只操作缓存，由其他线程异步的将缓存数据持久化到数据库，保证最终一致，或者说缓存被修改后，数据库并不会马上被修改，而是由其他线程异步的将缓存中的数据持久化到数据库中，保证其一致，而且当缓存不断的被操作，异步线程只会取最后的操作效果持久化到数据库
	- 缺点：如果缓存中执行了很多操作后，依然没有触发异步线程，此时，如果突然崩溃了，那缓存中的数据就会丢失了，一致性就不存在了

企业中使用较多的是方案一，安全性好，一致性高



### 操作缓存和数据库的三个问题

#### 删除缓存还是更新缓存

- 更新缓存：每次更新数据库都更新缓存，无效写操作较多（如果反复更新数据库，而不去读取缓存，那么缓存也被无限制的更新，无效的写操作）
- **删除缓存（使用）**：更新数据库时让缓存失效，查询时再更新缓存（更新数据库时删除缓存，我们只需要删除一次缓存，无论更新多少次数据库都没事，完全不影响，当要查询时再更新缓存，完美！）

#### 如何保证缓存与数据库的操作同时成功或失败

- 单体系统，将缓存和数据库放在一个事务中，数据库失败则缓存失败，数据库成功则缓存成功
- 分布式系统，利用TCC等分布式事务方案

#### 先操作缓存还是先操作数据库

- 先删除缓存，再操作数据库

	- 正常情况
		- 先进行缓存的删除，再更新数据库，此时如果有人查询缓存，必然是没有缓存的，因为缓存被删除了，所以查询数据库，查询得到的是数据库最新的值，写入缓存，查询得到最新的值
	- 异常情况
		- 先进行缓存的删除，缓存删除后并没有更新数据库，就切换了其他线程来查询缓存，缓存被删除了，所以没有缓存，则查询数据库，而数据库还没有更新，所以返回了旧的值，缓存依然是旧的值，此时回归更新数据库线程，更新了数据库，数据库中是新的值，缓存是旧的值，有问题

	

	下图为错误图示例

	<img src="https://s2.loli.net/2023/08/30/HZN41QRoAEJUCWF.png" alt="image-20230830141231546" style="zoom: 67%;" />

	读写查很快，而数据库更新很慢，所以极容易出现上述的异常情况

- **先操作数据库，再删除缓存（常用）**

	- 正常情况
		- 先更新数据库为新数据，再删除缓存，因为缓存删除了，所以如果有人来查询缓存，此时必然是没有的，会先到数据库查询，再为缓存赋值，是最新数据
	- 异常情况（可能性低）
		- 假设一种特殊情况：缓存失效了，此时线程1去查数据库，会得到旧数据，得到之后，被线程2拿到了控制权，线程2要改变数据库，再删缓存，那么流程就是，线程2先更新了数据库，又删除了缓存（此时缓存是空的，删了等于没删），删完之后切回线程1，线程1将刚刚查询得到的旧数据写入缓存，此时的缓存是旧数据，而数据库是新数据，有问题

	下图为错误图示例

	<img src="https://s2.loli.net/2023/08/30/R4eiNxXfwGuhZUz.png" alt="image-20230830141513424" style="zoom:67%;" />

缓存更新策略的最佳实践方案：

1. 低一致性需求：使用Redis自带的内存淘汰机制
2. 高一致性需求：主动更新，并以超时剔除作为兜底方案
	- 读操作：
		- 缓存命中直接返回
		- 缓存未命中则查询数据库，并写入缓存，设定超时时间
	- 写操作：
		- 先写数据库，再删除缓存
		- 要确保数据库与缓存操作的原子性



## 给查询商铺的缓存添加超时剔除和主动更新的策略

修改ShopController中的业务逻辑，满足下面的需求：

- 根据id查询店铺时，如果缓存未命中，则查询数据库，将数据库结果写入缓存，并设置超时时间
- 根据id修改店铺时，先修改数据库，再删除缓存

### 超时剔除

ShopServiceImpl（添加了一个超时时间）

```java
@Override
    public Result queryById(Long id) {
        // 从redis查询商铺缓存
        String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
        // 判断是否存在
        if (StrUtil.isNotBlank(cache)){
            // 存在，直接返回
            // 返回前需要转为对象
            Shop shop = JSONUtil.toBean(cache, Shop.class);
            return Result.ok(shop);
        }
        // 不存在，根据id查询数据库
        Shop shop = getById(id);
        if (shop == null){
            // 查询数据库后不存在，返回错误
            return Result.fail("未找到该商铺信息");
        }
        // 存在，写入redis
        // 转换前需要将对象转为json字符串存入
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
        //返回
        return Result.ok(shop);
    }
```

### 主动更新

ShopController

```java
@PutMapping
public Result updateShop(@RequestBody Shop shop) {
    // 写入数据库
    return shopService.update(shop);
}
```

IShopService

```java
Result update(Shop shop);
```

ShopServiceImpl

```java
@Override
@Transactional
public Result update(Shop shop) {
    Long id = shop.getId();
    if (id == null){
        return Result.fail("店铺id不能为空");
    }
    // 先更新数据库
    updateById(shop);
    // 再删除缓存
    stringRedisTemplate.delete(CACHE_SHOP_KEY+id);
    return Result.ok();
}
```

测试Redis中的缓存是否会存储30分钟（成功）

![image-20230830152921211](https://s2.loli.net/2023/08/30/DiQvteIMja5NmUd.png)

测试修改后数据库和缓存是否都会被修改（在postman中测试）

请求方式`PUT`，请求地址http://localhost:8081/shop

测试数据

```json
{
  "area": "大关",
  "openHours": "10:00-22:00",
  "sold": 4215,
  "address": "金华路锦昌文华苑29号",
  "comments": 3035,
  "avgPrice": 80,
  "score": 37,
  "name": "102茶餐厅",
  "typeId": 1,
  "id": 1
}
```

数据库更新成功

![image-20230830154434479](https://s2.loli.net/2023/08/30/pWx9OdH5A2fvzPt.png)

redis中的数据也被删除了，当再次查询时才会从数据库中查询

<img src="https://s2.loli.net/2023/08/30/UxdykmGgVoHJwiL.png" alt="image-20230830154514113" style="zoom:67%;" />

## 缓存穿透

缓存穿透是指客户端请求的数据在缓存和数据库中都不存在，这样缓存永远不会生效，这些请求都会打到数据库

就是说，如果客户端发起了一个请求，请求一家店铺，但是这家店铺是不存在的，也就是假的请求，然后此时会请求到Redis中，Redis查看后肯定是没有的，毕竟是假的，然后发给数据库，数据库肯定也没有，然后返回

此时，如果有一个不坏好意的人，整了多个线程，一直反复的发，反复的请求，可能就要坏事了

常见的解决方案有两种

- 缓存空对象

- 缓存空对象流程图

	<img src="https://s2.loli.net/2023/08/30/azr84SL6PUuVsdA.png" alt="image-20230830180305218" style="zoom:67%;" />

	- 当你发了一个假的不存在的对象给我，我最后从数据库会得到一个null，此时我将其缓存起来，当你再次请求，我就直接从Redis里面返回给你之前那个null，简单粗暴
	- 优点：实现简单，维护方便
	- 缺点
		- 额外的内存消耗（反复给你发不同的空的对象，会缓存起来一堆垃圾），可以设置一个TTL（缓存有效期），设置为5分钟或者2分钟不等，专门用来缓存垃圾数据
		- 可能造成短期的不一致（如果我们已经在Redis缓存了发来的空对象，此时Redis会缓存起来，如果真的有一个对象就是刚刚被创建出来的，此时，用户再查询，会是null，也就是刚刚缓存的空对象）

- 布隆过滤

- 布隆过滤流程图

	<img src="https://s2.loli.net/2023/08/30/wdZRoYVv4FPSgt1.png" alt="image-20230830180532253" style="zoom:67%;" />

	- 客户端请求布隆过滤器，若数据不存在直接拒绝，存在则放行通过去Redis中查询，如果Redis中存在，则从Redis缓存中查询，如果Redis缓存中有，则直接返回，若没有则去数据库中查询，数据库中有返回，否则返回无数据
	- 优点：内存占用较少，没有多余key（拦截后，就会拒绝请求了，不拦截才会去内部查询，有时候过滤器可能会误判，放一些进来也没什么大问题）
	- 缺点
		- 实现复杂
		- 存在误判可能



### 代码实现

ShopServiceImpl

```java
@Override
    public Result queryById(Long id) {
        // 从redis查询商铺缓存
        String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
        // 判断是否存在
        if (StrUtil.isNotBlank(cache)){
            // 存在，直接返回
            // 返回前需要转为对象
            Shop shop = JSONUtil.toBean(cache, Shop.class);
            return Result.ok(shop);
        }

        // 如果是空字符串
        if (cache != null){
            // 如果在redis中没有查询到该商铺的信息，说明该缓存为null，去数据库中查询
            // 如果数据库也为空，说明缓存穿透了，然后将空值写入Redis，并返回错误
            // 当再次访问时，查询得到的会是空字符串，而不是空，就会直接拿到redis中的数据，会是空，然后报错
            // StrUtil.isNotBlank会判别空字符串是空的，所以上面的并不会返回数据
            return Result.fail("未找到该商铺信息");
        }

        // 不存在，根据id查询数据库
        Shop shop = getById(id);
        if (shop == null){
            // 将空值写入Redis并设置时间为两分钟
            stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
            // 查询数据库后不存在，返回错误
            return Result.fail("未找到该商铺信息");
        }
        // 存在，写入redis
        // 转换前需要将对象转为json字符串存入
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
        //返回
        return Result.ok(shop);
    }
```

测试

访问http://localhost:8080/api/shop/0，这是一个不存在的地址，看控制台返回什么

没有找到数据，并且页面也显示为空![image-20230830192507127](https://s2.loli.net/2023/08/30/3Xcrm5IjU4EDqVC.png)

![image-20230830192444687](https://s2.loli.net/2023/08/30/StMlp2mZ8AB13KN.png)

再次访问该地址，会发现控制台并没有输出sql语句，而是直接去了redis缓存中查询

## 缓存雪崩

缓存雪崩是指同一时段大量的缓存key同时失效或者Redis服务宕机，导致大量请求到达数据库，带来巨大压力

当Redis服务宕机时，情况就会极为严重，所有的请求都会直接来到数据库中

<img src="https://s2.loli.net/2023/09/01/Vl5BnGFuR4bwcMU.png" alt="image-20230901215347179" style="zoom:67%;" />

解决方案：

- 给不同的key的TTL（存活时间）添加随机值
- 利用Redis集群提高服务的高可用性
- 给缓存业务添加降级限流策略
- 给业务添加多级缓存

## 缓存击穿

缓存击穿问题也叫热点Key问题，就是被高并发访问并且缓存重建业务比较复杂的key突然失效了，无数的请求访问在瞬间给数据库带来巨大的冲击

可以理解为，当一个线程去访问一个高并发访问的缓存并且缓存创建业务复杂的key失效了，那么当前线程查询缓存会未命中，而它的流程也比较麻烦，此时如果有其他线程进来查询，也会去数据库查询，因为最开始的线程还没有将数据写入缓存，而它又是一个高并发的线程，所以，可能会导致数据库压力过大，宕机

<img src="https://s2.loli.net/2023/09/02/AQckUzTYpxhmHP8.png" alt="image-20230902095232043" style="zoom:67%;" />

常见的解决方案有两种：

### 互斥锁

- 假设若干个线程同时来访问缓存，其中最早的一个获取到了互斥锁，那么这个线程会去查询数据库重建缓存数据，并将查到的内容写入缓存后，释放锁，而其他线程在那个线程获取了互斥锁后，都没办法再获取互斥锁，则会休眠一会再重试，而且会不断重试，直到命中
- <img src="https://s2.loli.net/2023/09/02/aWPO6GC3uYrIwLc.png" alt="image-20230902095932118" style="zoom:67%;" />
- 缺点：当数千线程同时进入，只有一个线程可以得到互斥锁并重建缓存数据，其他线程只能无限期的等待，所以性能较差

### 逻辑过期

- 要设置逻辑过期，需要在缓存的时候添加**逻辑时间**，如果有线程查询缓存，当逻辑时间过期时，就会去获取互斥锁，然后开启一个新线程，由新线程来查询数据库，重建缓存数据并写入缓存，重置逻辑时间，最后释放锁，而之前的现场就会返回一份过期数据，如果在**新线程写入缓存**期间有其他线程来访问的话，查询缓存后，查到的是旧数据，此时会发现逻辑时间已经过期， 就会去获取互斥锁，获取失败后，会直接返回一份过期数据，只有当**新线程写入缓存的事件结束后**，其他线程再来访问，就可以得到新数据
- <img src="https://s2.loli.net/2023/09/02/Qj5BYaV7wP2GSkN.png" alt="image-20230902101201232" style="zoom:67%;" />

### 互斥锁与逻辑过期的对比

| 解决方案 |                       优点                       |                      缺点                      |
| :------: | :----------------------------------------------: | :--------------------------------------------: |
|  互斥锁  | 没有额外的内存消耗<br />保证一致性<br />实现简单 | 线程需要等待，性能受影响<br />可能有死锁的风险 |
| 逻辑过期 |              线程无需等待，性能较好              | 不保证一致性<br />有额外内存消耗<br />实现复杂 |

死锁的概念：***毕业生找工作,公司表示只需要有工作经验才可以来;要想有工作经验,就需要去公司工作......***

毕业生找工作，必须要有工作经验才能去公司，而要想有工作经验，就必须要公司工作，而毕业生从来没在公司工作，自然也就无法去公司工作

或者说，一个线程获取了锁A，下面将要获取锁B时，结果切换了线程，切换后的线程去获取了锁B，又要去获取锁A，因为此时锁A被另一个线程占用了，所以获取不了，那么只能等待，最后又切换回了锁A的线程，锁A线程重新访问锁B，锁B被另一个线程所占用了，就导致也获取不了，最后无限循环，死锁了

```java
public void add(int m) {
    synchronized(lockA) { // 获得lockA的锁
        this.value += m;
        synchronized(lockB) { // 获得lockB的锁
            this.another += m;
        } // 释放lockB的锁
    } // 释放lockA的锁
}

public void dec(int m) {
    synchronized(lockB) { // 获得lockB的锁
        this.another -= m;
        synchronized(lockA) { // 获得lockA的锁
            this.value -= m;
        } // 释放lockA的锁
    } // 释放lockB的锁
}
```

### 基于互斥锁方式解决缓存击穿的问题

需求：修改根据id查询商铺的业务，基于互斥锁方式来解决缓存击穿问题

#### 流程分析

提交商铺id，从Redis中查询商铺缓存，判断缓存是否命中

- 缓存命中：返回数据
- 缓存未命中：判断是否获取锁
	- 获取锁：根据Id查询数据库，将商铺数据写入Redis，释放锁，并返回数据
	- 未获取锁：休眠一段时间，从Redis查询商铺缓存，再次执行上述的情况，直到锁被释放，从缓存中查询得到最新的数据，并返回

<img src="https://s2.loli.net/2023/09/02/Jl6avcRW275ZBb3.png" alt="image-20230902110255613" style="zoom:67%;" />

在ServiceImpl下创建两个方法用于获取锁和释放锁

```java
// 获取锁
private boolean TryLock(String key){
    // 获取锁，并设置保存时间为10秒，因为业务一般1秒内都能结束
    // 如果出现10秒还未结束的业务，说明有问题，将锁删除
    // setIfAbsent，当key存在时，不创建key，否则创建key
    Boolean aBoolean = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
    // 返回可能会进行自动拆箱的操作，导致空指针，这里借助具体类修改
    return BooleanUtil.isTrue(aBoolean);
}

// 释放锁
private void unlock(String key){
    stringRedisTemplate.delete(key);
}
```

将缓存穿透的逻辑封装

```java
public Result queryWithPassThrough(Long id){
    // 从redis查询商铺缓存
    String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
    // 判断是否存在
    if (StrUtil.isNotBlank(cache)){
        // 存在，直接返回
        // 返回前需要转为对象
        Shop shop = JSONUtil.toBean(cache, Shop.class);
        return Result.ok(shop);
    }

    // 如果是空字符串
    if (cache != null){
        // 如果在redis中没有查询到该商铺的信息，说明该缓存为null，去数据库中查询
        // 如果数据库也为空，说明缓存穿透了，然后将空值写入Redis，并返回错误
        // 当再次访问时，查询得到的会是空字符串，而不是空，就会直接拿到redis中的数据，会是空，然后报错
        // StrUtil.isNotBlank会判别空字符串是空的，所以上面的并不会返回数据
        return Result.fail("未找到该商铺信息");
    }

    // 不存在，根据id查询数据库
    Shop shop = getById(id);
    if (shop == null){
        // 将空值写入Redis并设置时间为两分钟
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
        // 查询数据库后不存在，返回错误
        return Result.fail("未找到该商铺信息");
    }
    // 存在，写入redis
    // 转换前需要将对象转为json字符串存入
    stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
    //返回
    return Result.ok(shop);
}
```

#### 代码实现

```java
@Override
public Result queryById(Long id) {
    /* 缓存穿透
     Result = queryWithPassThrough(id);*/

    // 互斥锁解决缓存击穿

    return queryWithMutex(id);
}

// 互斥锁
public Result queryWithMutex(Long id){
    // 从redis查询商铺缓存
    String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
    // 判断是否存在
    if (StrUtil.isNotBlank(cache)){
        // 存在，直接返回
        // 返回前需要转为对象
        Shop shop = JSONUtil.toBean(cache, Shop.class);
        return Result.ok(shop);
    }

    // 如果是空字符串
    if (cache != null){
        // 如果在redis中没有查询到该商铺的信息，说明该缓存为null，去数据库中查询
        // 如果数据库也为空，说明缓存穿透了，然后将空值写入Redis，并返回错误
        // 当再次访问时，查询得到的会是空字符串，而不是空，就会直接拿到redis中的数据，会是空，然后报错
        // StrUtil.isNotBlank会判别空字符串是空的，所以上面的并不会返回数据
        return Result.fail("未找到该商铺信息");
    }

    // 实现缓存重建
    // 获取互斥锁
    // 为每个商铺都添加一把锁，访问不同的店铺就会互不影响
    String lockKey = "lock:shop" + id;
    Shop shop = null;
    try {
        boolean isLock = TryLock(lockKey);
        // 判断是否获取成功
        if (!isLock){
            // 失败，则休眠重试
            Thread.sleep(50);
            return queryWithMutex(id);
        }


        // 获取互斥锁成功，根据id查询数据库
        shop = getById(id);
        // 数据库不存在
        if (shop == null){
            // 将空值写入Redis并设置时间为两分钟
            stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
            // 查询数据库后不存在，返回错误
            return Result.fail("未找到该商铺信息");
        }
        // 存在，写入redis
        // 转换前需要将对象转为json字符串存入
        stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY+id,JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }finally {
        // 释放互斥锁
        unlock(lockKey);
    }

    //返回
    return Result.ok(shop);
}
```

### 基于逻辑过期方式解决缓存击穿的问题

#### 流程分析

提交商铺id，从Redis中查询缓存，并判断缓存是否命中（一般情况下，都是绝对命中的，因为是逻辑过期）

- 缓存命中：判断缓存是否过期（逻辑过期）
	- 缓存未过期：直接返回商铺信息
	- 缓存已过期：尝试获取互斥锁，判断是否能获取锁
		- 获取锁成功：开启独立线程，并根据Id查询数据库，将商铺数据写入Redis，并设置逻辑过期时间，最后释放互斥锁
		- 获取锁失败：说明有其他线程已经获取了锁正在进行操作，可以直接返回旧的商铺信息
- 缓存未命中：很少出现这种情况，一旦出现了，返回空

<img src="https://s2.loli.net/2023/09/02/RFj7H9zCbkLaSQx.png" alt="image-20230902132308504" style="zoom: 50%;" />

#### 代码实现

在原来的对象上添加逻辑过期时间，但是又不能修改原来的对象，修改了可能会影响到整体的代码逻辑，如何来添加新的数据呢

**解决方案**

- 新建一个类，继承对应的对象，并在新的对象上添加自己需要的属性，并创建一个包含原有数据的类data

```java
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RedisData<T> {
    private LocalDateTime expireTime;
    private T data;
}
```

在ShopServiceImpl中添加方法，将Shop添加到Redis当中

```java
public void savaShop2Redis(Long id,Long expireSecond){
    // 查询店铺数据
    Shop shop = getById(id);
    // 封装逻辑过期时间
    RedisData redisData = new RedisData();
    redisData.setData(shop);
    // 设置逻辑过期时间为多少秒
    redisData.setExpireTime(LocalDateTime.now().plusSeconds(expireSecond));
    // 写入Redis(转换类型)
    stringRedisTemplate.opsForValue().set(CACHE_SHOP_KEY + id,JSONUtil.toJsonStr(redisData));
}
```

在单元测试中测试能不能将数据添加到Redis当中

```java
import com.hmdp.service.impl.ShopServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
class HmDianPingApplicationTests {

    @Resource
    private ShopServiceImpl shopService;

    @Test
    public void test1(){
        shopService.savaShop2Redis(1L,10L);
    }
}
```

<img src="https://s2.loli.net/2023/09/02/4OGJxq9KH28rhmD.png" alt="image-20230902135306311" style="zoom:67%;" />

ShopServiceImpl

添加一段逻辑过期的代码

```java
@Override
    public Result queryById(Long id) {
        /* 缓存穿透
         Result = queryWithPassThrough(id);*/

        // 互斥锁解决缓存击穿

//        return queryWithMutex(id);

        return queryWithLogicalExpire(id);
    }


    // 创建线程池
    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    // 逻辑过期解决缓冲击穿问题
    public Result queryWithLogicalExpire(Long id) {
        // 从redis查询商铺缓存
        String cache = stringRedisTemplate.opsForValue().get(CACHE_SHOP_KEY + id);
        // 判断是否存在
        if (StrUtil.isNotBlank(cache)) {
            // 不存在，返回空
            // 返回前需要转为对象
            return null;
        }

        // 从缓存中命中数据后，反序列化json为对象
        RedisData redisData = JSONUtil.toBean(cache, RedisData.class);
        JSONObject data = (JSONObject) redisData.getData();
        Shop jsonShop = JSONUtil.toBean(data, Shop.class);
        // 取出过期时间
        LocalDateTime expireTime = redisData.getExpireTime();
        // 判断是否过期
        if (expireTime.isAfter(LocalDateTime.now())) {
            // isAfter判断现在的时间是否在过期时间后
            // 如果现在的时间在过期时间之后，说明还没过期
            // 如果在过期时间之前，说明已过期
            //未过期，直接返回商铺信息
            return Result.ok(jsonShop);
        }
        // 已过期，缓存重建
        // 判断是否获取互斥锁
        if (TryLock(LOCK_SHOP_KEY + id)) {

            // 获取互斥锁成功，开启新线程，实现缓存重建
            // 线程最好通过线程池来获取，节省资源
            CACHE_REBUILD_EXECUTOR.submit(() -> {
                try {
                    // 重建缓存(在savaShop2Redis中有写过这个方法)
                    savaShop2Redis(id, 30L);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    // 释放锁
                    unlock(LOCK_SHOP_KEY + id);
                }
            });

        }
        // 获取互斥锁失败，直接返回商铺信息
        return Result.ok(jsonShop);

    }
```

即使逻辑过期了，也不影响数据，数据并不会消失

## 缓存工具封装

基于StringRedisTemplate封装一个缓存工具类，满足下列需求：

1. 将任意Java对象序列化为json并存储在string类型的key中，并且可以设置TTL过期时间
2. 将任意Java对象序列化为json并存储在string类型的key中，并且可以设置逻辑过期时间，用于处理缓存击穿问题
3. 根据指定的key查询缓存，并反序列化为指定类型，利用缓存空值的方式解决缓存穿透的问题
4. 根据指定的key查询缓存，并反序列化为指定类型，需要利用逻辑过期解决缓存击穿问题

在utils包下新建CacheClient类，用于缓存工具的封装

```java
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;


@Component
@Slf4j
public class CacheClient {
    @Autowired
    private final StringRedisTemplate stringRedisTemplate;

    public CacheClient(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * 将任意Java对象序列化为json并存储在string类型的key中，并且可以设置TTL过期时间
     * */
    public void set(String key, Object value, Long time, TimeUnit timeUnit){
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value),time,timeUnit);
    }


    /**
     * 将任意Java对象序列化为json并存储在string类型的key中，并且可以设置逻辑过期时间，用于处理缓存击穿问题
     * */
    public void  setWithLogicalExpire(String key,Object value,Long time,TimeUnit timeUnit){
        RedisData<Object> redisData = new RedisData<>();
        redisData.setData(value);
        // 过期时间是以当前时间为基准后的多少秒为基准
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(timeUnit.toSeconds(time)));
        // 写入Redis
        stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(redisData));
    }

    public <T,ID> T queryWithPassThough(
            String keyPrefix, ID id, Class<T> type, Function<ID,T> function,Long time,TimeUnit timeUnit){
        // keyPrefix是key的前缀
        // keyPrefix+id = key

        // 根据Key可以从redis中查询
        String key = keyPrefix + id;

        // 从redis中查询缓存
        String cache = stringRedisTemplate.opsForValue().get(key);

        // 判断是否存在，如果存在，直接返回
        if (StrUtil.isNotBlank(cache)){
            // 将cache转为对应的类型
            return JSONUtil.toBean(cache,type);
        }

        // 判断是否为null
        if (cache != null) {
            // 解决缓存穿透
            return null;
        }

        // 不存在，根据Id查询数据库
        //  Function<ID,T> function
        // ID是传递的参数，T是返回的类型
        T t = function.apply(id);

        // 如果得到的结果为Null，说明缓存穿透了，解决这个问题
        // 向Redis中存入一个空值即可
        if (t == null){
            // 将空值写入Redis
            stringRedisTemplate.opsForValue().set(key,"",time,timeUnit);
            // 返回错误信息
            return null;
        }

        // 存在，存入Redis
        this.set(key,t,time,timeUnit);

        return t;
    }
}
```

缓存穿透修改

function需要的是传递一个函数



```java
@Autowired
    private CacheClient cacheClient;

    @Override
    public Result queryById(Long id) {
        /* 缓存穿透
         Result = queryWithPassThrough(id);*/

        // 互斥锁解决缓存击穿

//        return queryWithMutex(id);

        Shop shop = cacheClient.queryWithPassThough(CACHE_SHOP_KEY, id, Shop.class, this::getById,CACHE_SHOP_TTL,TimeUnit.MINUTES);

        if(shop == null){
            return Result.fail("该店铺信息不存在");
        }

        return Result.ok(shop);
    }
```

缓存穿透测试，没啥问题

缓存击穿`queryWithLogicalExpire`

```java
// 创建线程池
private static final ExecutorService CACHE_BUILD_EXECUTOR = Executors.newFixedThreadPool(10);


/**
 * 缓存击穿（基于逻辑过期实现）
 */
public <T,ID> T queryWithLogicalExpire(
        String keyPrefix, ID id, Class<T> type,Function<ID,T> function,Long time,TimeUnit timeUnit) {
    String key = keyPrefix + id;
    // 从redis中查询缓存
    String cache = stringRedisTemplate.opsForValue().get(key);
    // 判断是否存在
    if (StrUtil.isBlank(cache)) {
        // 不存在，直接返回
        return null;
    }

    // 命中，需要先把json反序列化为对象
    RedisData redisData = JSONUtil.toBean(cache, RedisData.class);
    // 获取对应数据
    T t = JSONUtil.toBean((JSONObject) redisData.getData(), type);
    LocalDateTime expireTime = redisData.getExpireTime();
    if (expireTime.isAfter(LocalDateTime.now())) {
        // 如果超时时间在当前时间之后
        // 说明未过期，直接返回商铺信息
        return t;
    }

    // 否则，已过期，需要缓存重建
    // 获取互斥锁
    // 失败
    if (TryLock(key)) {
        // 成功
        // 成功后，开启一个新的线程并让新的线程去操作更新的问题
        CACHE_BUILD_EXECUTOR.submit(() -> {
            try {
                // 查询数据库
                T dbResult = function.apply(id);
                // 写入redis
                this.setWithLogicalExpire(key,JSONUtil.toJsonStr(dbResult),time,timeUnit);
            }
            catch (Exception e){
                e.printStackTrace();
            }
            finally {
                unlock(key);
            }
        });
    }

    // 获取互斥锁失败，则直接返回旧数据
    return t;
}

// 获取锁
private boolean TryLock(String key) {
    // 获取锁，并设置保存时间为10秒，因为业务一般1秒内都能结束
    // 如果出现10秒还未结束的业务，说明有问题，将锁删除
    // setIfAbsent，当key存在时，不创建key，否则创建key
    Boolean aBoolean = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
    // 返回可能会进行自动拆箱的操作，导致空指针，这里借助具体类修改
    return BooleanUtil.isTrue(aBoolean);
}

// 释放锁
private void unlock(String key) {
    stringRedisTemplate.delete(key);
}
```



# 优惠券秒杀

## 全局ID生成器

每个店铺都可以发布优惠券，当用户抢购时，就会生成订单保存到订单表中，而订单表的id如果使用数据库自增id就存在一些问题：

- id的规律性太明显
- 受单表数据量的限制

此时就需要用到全局ID生成器

全局ID生成器：是一种在分布式系统下用来生成全局唯一ID的工具，一般要满足下列特性：

- 唯一性
- 高可用
- 高性能
- 递增性
- 安全性

为了增加ID的安全性，我们可以不直接使用Redis自增的数值，而是拼接一些其他信息：

![image-20230903123716447.png](https://s2.loli.net/2023/09/03/fL5AIlaoxOQG1Tv.png)

ID的组成部分：

- 符号位：1bit
- 时间戳：31bit，以秒为单位，可以使用69年
- 序列号：32bit，秒内的计数器，支持每秒产生2*32个不同的ID

在utils包下

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Component
public class RedisIdWorker {

    // 开始的时间戳
    private static final long BEGIN_STAMP = 1672531200;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // 移动的位数
    private int COUNT_BITS = 32;

    public long nextId(String keyPrefix) {
        // 生成时间戳
        LocalDateTime now = LocalDateTime.now();
        // 得到时间戳
        long second = now.toEpochSecond(ZoneOffset.UTC);
        long timestamp = second - BEGIN_STAMP;
        // 生成序列号
        // 获取当前日期，精确到天
        String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));


        // 采用date的方式，每天可以生成不同的id，不至于让缓存无限堆积，而且也不利于查找
        // 不使用包装类是因为后面还要进行运算
        long increment = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

        // 拼接并返回(移动指定位数是为了让increment可以填充到后面的位数上返回一个long类型的订单号)
        return timestamp<<COUNT_BITS | increment;
    }

    public static void main(String[] args) {
        LocalDateTime time = LocalDateTime.of(2023, 1, 1, 0, 0, 0);
        // 将时间转为秒
        long second = time.toEpochSecond(ZoneOffset.UTC);
        System.out.println("second = " + second);
    }
}
```

测试

```java
@Autowired
private RedisIdWorker redisIdWorker;


private ExecutorService executorService = Executors.newFixedThreadPool(500);

@Test
public void test2() throws InterruptedException {
    CountDownLatch countDownLatch = new CountDownLatch(300);
    Runnable task = () -> {
        for (int i = 0; i < 100; i++) {
            long order = redisIdWorker.nextId("order");
            System.out.println("order = " + order);
        }
        countDownLatch.countDown();
    };
    long begin = System.currentTimeMillis();
    for (int i = 0; i < 100; i++) {
        executorService.submit(task);
    }
    countDownLatch.await();
    long end = System.currentTimeMillis();
    System.out.println("time = " + (end-begin));
}
```

全局唯一ID生成策略：

- UUID
- Redis自增
- snowflake算法（雪花算法）
- 数据库自增

Reids自增ID策略：

- 每天一个key，方便统计订单量
- ID构造是时间戳+计数器


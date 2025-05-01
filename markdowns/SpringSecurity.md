---
title: SpringSecurity
date: 2023-10-26 22:38:08
tags: 安全
---

# SpringSecurity简介

Spring是一个很棒的Java应用开发框架，Spring Security 基于Spring框架，提供了一套Web应用安全性的完整解决方案，一般来说，web应用的安全性包括**用户认证(Authenticaiton)和用户授权(Authorization)**两个部分

- 用户认证指的是验证某个用户是否为系统中的合法主体，也就是说，该用户能否访问该系统，用户认证一般要求用户提供用户名和密码。系统通过校验用户名和密码来完成认证过程
- 用户授权指的是验证某个用户是否有权限执行某个操作。在一个系统中，不同用户所具有的权限是不同的。比如对一个文件来说，有的用户只能进行读取，而有的用户可以进行修改。一般来说，系统会为不同的用户分配不同的角色，而每个角色则对应一系列的权限

在用户认证方面，Spring Security框架支持主流的认证方式，包括Http基本认证、Http表单验证、Http摘要认证、OpenID和LDAP等。在用户授权方面。Spring Security提供了基于角色的访问控制和访问控制列表(Access Control List，ACL)，可以对应用中的领域对象进行细粒度的控制

Spring Security是一套安全框架，可以基于RBAC（基于角色的权限控制）对用户的访问权限进行控制

核心思想是通过一系列的filter chain来进行拦截过滤，对用户的访问权限进行控制

spring security的核心功能主要包括：

- 认证（你是谁）
- 授权（你能干什么）
- 攻击防护（防止伪造身份）

其核心就是一组过滤器链，项目启动后将会自动配置。最核心的就是Basic Authentication Filter用来认证用户的身份，一个在spring security 中一种过滤器处理一种认证方式

<img src="https://s2.loli.net/2023/12/19/ZduRX6e5axgKN8M.png" alt="image-20231219131022716" style="zoom:50%;" />

比如，对于username password认证过滤器来说，

```
会检查是否是一个登录请求;
是否包含username和password(也就是该过滤器需要的一些认证信息);
如果不满足则放行给下一个;
下一个按照自身的职责判定是否是自身需要的信息,basic的特征就是在请求头中有Authorization:Basic eHh4Onh4的信息。中间可能还有更多的认证过滤器。最后一环是FilterSecurityInterceptor,这里会判定该请求是否能进行访问rest服务,判断的依据是BrowserSecurityConfig中的配置,如果被拒绝了就会抛出不同的异常(根据具体的原因),Exception Translation Filter会捕获抛出的错误,然后根据不同的认证方式进行信息的返回提示
从Exception Translation Filter到最后的过滤器都无法控制，其他的可以进行配置是否生效
```



# 认证和授权

 一般来说的应用访问安全性，都是围绕认证(Authentication)和授权(Authorization)这两个核心概念来展开

即：

- 首先需要确认用户身份
- 再确认用户是否有访问指定资源的权限

认证这块的解决方案有很多，主流的有`CAS`、`SAML2`、`OAUTH2`等，常说的单点登录方案(SSO)就是这块授权的话，主流一般是spring security和shiro

shiro比较轻量级，相比较而言spring security 架构比较复杂

## OAuth2

OAuth2是一个关于授权的开放标准，核心思路是通过各类认证手段认证用户身份

并颁发token（令牌），使得第三方应用可以使用该令牌在**限定时间、限定范围**访问**指定资源**

主要涉及RFC规范有【`RFC6748`(整体授权框架)】、【`RFC6750`(令牌使用)】、【`RFC6819`(威胁模型)】这几个，一般需要了解的是`RFC6749`

获取令牌的方式主要有四种，分别是`授权码模式`、`简单模式`、`密码模式`、`客户端模型`

总之：OAuth2是一个授权(Authorization)协议。

认证(Authentication)证明你是不是这个人，而授权(Authoration)则是证明这个人有没有访问这个资源(Resource)的权限。

### OAuth2的抽象流程

     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+

上面的图是一张来自OAuth2的抽象流程图

Client：客户端应用程序(Application)

Authorization Server：授权服务器

Resource Server：资源服务器

解释上图的大致流程：

- 用户连接客户端应用程序后，客户端应用程序(Client)要求用户给予授权
- 用户同意给予客户端应用程序授权
- 客户端应用程序使用上一步获得的授权(Grant)，向授权服务器申请令牌
- 授权服务器对客户端应用程序的授权(Grant)进行验证后，确认无误，发放令牌
- 客户端应用程序使用令牌，向资源服务器申请获取资源
- 资源服务器确认令牌无误，同意向客户端应用程序开放资源

其实流程无非如下，用户连接-->客户端-->客户端要求用户给出授权-->客户端拿授权申请令牌-->授权服务器校验授权无误后发放令牌-->客户端拿着令牌，找资源服务器要资源-->资源服务器校验令牌无误后发放资源

从上面的流程可以看出，如何获取**授权（Grant）**才是关键。拥有正确的授权(Authorzation)就可以去拿到任意的东西了

### OAuth2的4种授权类型

#### Authorization Code（授权码模式）

功能最完整、流程最严密的授权模式。通过第三方应用程序服务器与认证服务器进行互动。广泛用于各种第三方认证。

     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)
     Note: The lines illustrating steps (A), (B), and (C) are broken into
       two parts as they pass through the user-agent.

- 用户(Resource Owner)通过用户代理(User-Agent)访问客户端(Client)，客户端索要授权，并将用户导向认证服务器(Authorization Server)
- 用户选择是否给予客户端授权
- 假设用户给予授权，认证服务器将用户导向客户端事先指定的**重定向URI**，同时附上一个授权码
- 客户端收到授权码，附上早先的**重定向URI**，向认证服务器申请令牌。这一步是在客户端的后台服务器上完成的，对用户不可见
- 认证服务器核对授权码和重定向URI，确认无误后，向客户端发送访问令牌(access token)和更新令牌(refresh token)。这一步对用户也不可见

#### Implicit（简化模式）

不通过第三方应用程序服务器，直接在浏览器中向认证服务器申请令牌，更适用于移动端的App及没有服务器端的第三方单页面应用。

##### Resource Owner Password（密码模式）

用户向客户端服务器提供自己的用户名和密码，用户对客户端高度信任的情况下使用，比如公司、组织的内部系统，SSO

     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          v
          |    Resource Owner
         (A) Password Credentials
          |
          v
     +---------+                                  +---------------+
     |         |>--(B)---- Resource Owner ------->|               |
     |         |         Password Credentials     | Authorization |
     | Client  |                                  |     Server    |
     |         |<--(C)---- Access Token ---------<|               |
     |         |    (w/ Optional Refresh Token)   |               |
     +---------+                                  +---------------+
    
            Figure 5: Resource Owner Password Credentials Flow

- 用户(Resource Owner资源持有者)向客户端(Client)提供用户名和密码
- 客户端将用户名和密码发给认证服务器(Authorization Server)，向后者请求令牌
- 认证服务器确认无误后，向客户端提供访问令牌

#### Client Credentials（客户端模式）

客户端服务器以自己的名义，而不是以用户的名义，向认证服务器进行认证

## 令牌刷新

```
  +--------+                                           +---------------+
  |        |--(A)------- Authorization Grant --------->|               |
  |        |                                           |               |
  |        |<-(B)----------- Access Token -------------|               |
  |        |               & Refresh Token             |               |
  |        |                                           |               |
  |        |                            +----------+   |               |
  |        |--(C)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(D)- Protected Resource --| Resource |   | Authorization |
  | Client |                            |  Server  |   |     Server    |
  |        |--(E)---- Access Token ---->|          |   |               |
  |        |                            |          |   |               |
  |        |<-(F)- Invalid Token Error -|          |   |               |
  |        |                            +----------+   |               |
  |        |                                           |               |
  |        |--(G)----------- Refresh Token ----------->|               |
  |        |                                           |               |
  |        |<-(H)----------- Access Token -------------|               |
  +--------+           & Optional Refresh Token        +---------------+
```

- 客户端找授权服务器索要授权

- 当用户同意给予授权后，授权服务器给予令牌，并给予刷新令牌

- 此时通过令牌去资源服务器中获取资源

- 得到资源

	假设token过期

- 再次获取资源，发现Token无效了
- 通过刷新令牌去授权服务器中获取Token
- 通过Token再次获取令牌和刷新令牌，重复流程


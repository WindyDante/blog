# 前言

最近在看教程写一个微服务的项目，用到了lombok提供的注解

我认为lombok确实是蛮方便的，一个注解帮你完成很多繁琐的事，还能简化代码

昨天我碰到了一个问题

先提供一下我的版本信息，或许会对出现过这个问题的小伙伴有些帮助

| 名称   | 版本       |
| ------ | ---------- |
| IDEA   | 2024.2.0.1 |
| lombok | 1.18.8     |

我的lombok应该算比较新的了

事情的起因是我在写多模块时，我调用了另一个模块的某个**类**，类上存在注解`@Data`，可以一键生成`Get、Set等方法`的一个注解

```java
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class QueryCourseParamsDto {

    //审核状态
    @ApiModelProperty("审核状态")
    private String auditStatus;

    //课程名称
    @ApiModelProperty("课程名称")
    private String courseName;

    // 发布状态
    @ApiModelProperty("发布状态")
    private String publishStatus;

}
```

我在编写一个测试类，用于测试我的Mapper接口

```java
@SpringBootTest
class CourseBaseMapperTests {

    @Autowired
    CourseBaseMapper courseBaseMapper;


    @Test
    void testCourseBaseMapper() {
        CourseBase courseBase = courseBaseMapper.selectById(74L);
        // 以下省略
    }

}
```

直接运行代码->jps incremental annotation processing is disabled. compilation results on partial recompilation may be inaccurate. use build process "jps.track.ap.dependencies" vm flag to enable/disable incremental annotation processing environment.

报错如上，在我查询了一些文档后，我大概知道是什么原因了

注解处理被禁用了，导致部分重新编译时编译结果不准确

好了，现在我们知道注解处理被禁用了，一般就是将其启用

我尝试了以下办法，最终成功了

# 方法一

<img src="https://b.1wind.cn/2025/07/8bd950ebc7cf430b47c472159e87e221.png" alt="image-20250701101107381" style="zoom:50%;" />

左上角搜索框输入Compiler

<img src="https://b.1wind.cn/2025/07/d328f28e8f4d8e9380b49f9f897020b9.png" alt="image-20250701101513849" style="zoom:50%;" />

当然，在我这是失败了，当然你可以试试

# 方法二

清缓存，重新构建

<img src="https://b.1wind.cn/2025/07/774b7df890c5372e3ec7524e8de01593.png" alt="image-20250701101644618" style="zoom:50%;" />

<img src="https://b.1wind.cn/2025/07/7245a815c0b03f8d4c8100129ead0581.png" alt="image-20250701101709299" style="zoom:50%;" />

好吧，这种在我这也失败了，当然你可以试试

# 方法三(成功)

依然是原先的File->Settings

<img src="https://b.1wind.cn/2025/07/2d6a8288e207f91d0dc426f23d1728d3.png" alt="image-20250701101911211" style="zoom: 50%;" />

不过这个问题蛮怪的，我建议如果失败了，可以重启一下电脑，重启一下IDEA

因为我之前没开这个也没遇到过这个问题

怪！
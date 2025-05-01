---
title: MyBatis-Plus代码生成器
tags: 实用工具
date: 2023-08-19 13:18:36
---

`MyBatis-Plus-Generator`：自动生成 Controller Service Mapper/DAO层等的基本代码，免去自己去写实体类映射数据库的繁琐操作



# 添加依赖

```xml
<!-- mybatis-plus自动生成代码 -->
<!-- 代码自动生成依赖 begin -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.4.1</version>
</dependency>
<!-- velocity -->
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.0</version>
</dependency>
<!-- 代码自动生成依赖 end-->
```



# 运行代码

在测试类中运行代码即可

```java
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;



public class MyBatisPlusGenerator {

    public static void main(String[] args) {
        //1. 全局配置
        GlobalConfig config = new GlobalConfig();
        // 是否支持AR模式
        config.setActiveRecord(true)
                // 作者
                .setAuthor("EastWind")
                // 生成路径，最好使用绝对路径
                .setOutputDir("D:\\test")
                // 文件覆盖
                .setFileOverride(true)
                // 主键策略
                .setIdType(IdType.AUTO)

                .setDateType(DateType.ONLY_DATE)
                // 设置生成的service接口的名字
                // xxxService
                .setServiceName("%sService")

                //实体类结尾名称
                .setEntityName("%s")

                //生成基本的resultMap
                .setBaseResultMap(true)

                //不使用AR模式
                .setActiveRecord(false)

                //生成基本的SQL片段
                .setBaseColumnList(true);

        //2. 数据源配置
        DataSourceConfig dsConfig = new DataSourceConfig();
        // 设置数据库类型
        dsConfig.setDbType(DbType.MYSQL)
                .setDriverName("com.mysql.cj.jdbc.Driver")
                .setUrl("jdbc:mysql://localhost:13306/mall?serverTimezone=UTC&useSSL=false")
                .setUsername("root")
                .setPassword("密码");

        //3. 策略配置globalConfiguration中
        StrategyConfig stConfig = new StrategyConfig();

        //全局大写命名
        stConfig.setCapitalMode(true)
                // 数据库表映射到实体的命名策略
                .setNaming(NamingStrategy.underline_to_camel)

                //使用restcontroller注解
                .setRestControllerStyle(true)

                // 生成的表, 支持多表一起生成，以数组形式填写
                // 设置需要生成的表
                .setInclude("自己在数据库中的表名");

        //4. 包名策略配置
        PackageConfig pkConfig = new PackageConfig();
        pkConfig.setParent("fun.eastwind.mall")
                .setMapper("mapper")
                .setService("service")
                .setController("controller")
                .setEntity("pojo");


        //5. 整合配置
        AutoGenerator ag = new AutoGenerator();
        ag.setGlobalConfig(config)
                .setDataSource(dsConfig)
                .setStrategy(stConfig)
                .setPackageInfo(pkConfig);

        //6. 执行操作
        ag.execute();
        System.out.println("=======  Done 相关代码生成完毕  ========");
    }


}
```

运行后就会在D:/test目录下发现自己生成的代码了！


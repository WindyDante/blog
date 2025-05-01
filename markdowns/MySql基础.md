---
title: MySql基础
tags: MySql
date: 2023-12-19 14:52:48
---

#  什么是数据库？

数据库（Database）是按照数据结构来组织、存储和管理数据的仓库。

每个数据库都有一个或多个不同的API用于创建，访问，管理，搜索和复制所保存的数据

我们也可以将数据存储在文件中，但是在文件中读写数据速度相对较慢

所以，我们使用关系型数据库管理系统（RDBMS）来存储和管理大数据量。所谓的关系型数据库，是建立在关系模型基础上的数据库，借助于集合代数等数学概念和方法来处理数据库中的数据

RDBMS即关系数据库管理系统（Relational Database Management System）的特点：

1. 数据以表格的形式出现
2. 每行为各种记录名称
3. 每列为记录名称所对应的数据域
4. 许多的行和列组成一张表单
5. 若干的表单组成database

# RDBMS术语

在学习前，先了解RDBMS（关系型数据库管理系统）的一些术语

- 数据库：数据库是一些关联表的集合
- 数据表：表是数据的矩阵。在一个数据库中的表看起来像一个简单的电子表格
- 列：一列（数据元素）包含了相同类型的数据，例如姓名、年龄的数据
- 一行（元组，或记录）是一组相关的数据，比如一个用户所属的相关信息
- 冗余：存储两倍数据，冗余降低了性能，但提高了数据的安全性
- 主键：主键是唯一的。一个数据表中只能包含一个主键。你可以使用主键来查询数据
- 外键：外键用于关联两个表
- 复合键：复合键（组合键）将多个列作为一个索引键，一般用于复合索引
- 索引：使用索引可快速访问数据库表中的特定信息。索引是对数据库表中一列或多列的值进行排序的一种结构。例如书籍的目录
- 参照完整性：参照的完整性要求关系中不允许引用不存在的实体。与实体完整性是关系模型必须满足的完整性约束条件，目的是保证数据的一致性

MySql为关系型数据库（Relational Database Management System），这种所谓的“关系型”可以理解为表格的概念，一个关系型数据库由一个或数个表格组成，表格如图所示

|  id  |   name    | age  |
| :--: | :-------: | :--: |
|  1   | zhangsan1 |  10  |
|  2   | zhangsan2 |  20  |
|  3   | zhangsan3 |  30  |

![image-20231219150732146](https://s2.loli.net/2023/12/19/HRmKjXhGQBFVxL1.png)

- 表头（header）：每一列的名称
- 列（col）：具有相同数据类型的数据的集合
- 行（row）：每一行用来描述某条记录的具体信息
- 值（value）：行的具体信息，每个值需要与该列的数据类型相同
- 主键（key）：键的值在当前列，具有**唯一性**

# MySql安装

这里以Windows安装MySql为例，这里附上MySQL的Windows版下载地址：https://dev.mysql.com/downloads/mysql/

选择合适自己的版本，直接下载即可

下载完成后，将压缩包解压到相应的目录下

具体的安装流程可以参考这篇博客：https://blog.csdn.net/qq_53381910/article/details/131277067

# MySql连接

win+r，打开运行窗口，输入cmd，接着就会打开命令行窗口，在命令行窗口中输入对应的命令就可以进入mysql

```cmd
mysql -u 你的用户名 -p
```

参数说明：

- -u 参数用于指定用户名
- -p 参数表示需要输入密码

敲完按回车，接着输入你的密码，密码是不可见的，正常输入完成后，就会弹出MySQL的欢迎提示了

成功连接到MySql后，你可以在命令行中执行执行SQL查询。

列出所有可用的数据库：

```SQL
SHOW DATABASES
```

选择要使用的数据库

```sql
USE 你的数据库名
```

列出所选数据库中的所有表

```SQL
SHOW TABLES
```

退出`mysql>`命令提示窗口可以使用`exit`命令

```cmd
EXIT;
```

# MySql创建数据库

我们可以在登录MySql服务后，使用`create`命令创建数据库，语法如下：

```sql
CREATE DATABASE 数据库名
```

假设我们想创建一个eastwind的数据库

```sql
CREATE DATABASE eastwind
```

建数据库的基本语法如下：

```sql
CREATE DATABASE [IF NOT EXISTS] database_name
	[CHARACTER SET charset_name]
	[COLLATE collation_name]
```

这里的中括号是可选项，可填可不填，`IF NOT EXISTS`是说，如果不存在，才对该数据库进行创建

- `CHARACTER SET charset_name`：指定字符集
- `COLLATE  collation_name`：指定排序规则

# MySql删除数据库

使用普通用户登录MySql服务器，需要特定的权限才能创建或者删除数据库，所以通过root用户登录，root用户拥有最高权限

在删除数据库过程中，务必要十分谨慎，因为在执行删除命令后，所有的数据将会消失。

## drop命令删除数据库

drop命令格式：

```sql
DROP DATABASE <database_name>;		-- 直接删除数据库，不检查是否存在
或
DROP DATABASE [IF EXISTS] <database_name>;
```

参数说明：

- IF EXISTS是一个可选的字句，表示如果数据库存在才执行删除操作，避免因为数据库不存在而引发错误
- database_name是你要删除的数据库的名称

假设要删除的数据库是eastwind

```sql
DROP DATABASE IF EXISTS eastwind
```

# MySql选择数据库

在你连接到MySql数据库后，可能有多个可以操作的数据库，所以你需要选择你要操作的数据库

使用`USE`命令选择使用的数据库

```sql
USE database_name
```

参数说明：

- database_name 是你要选择的数据库的名称

选择数据库后，后续的操作在你选择的数据库上执行。

# 数据类型

MySql中定义数据字段的类型对你数据库的优化是非常重要的。

MySql支持多种类型，大致分为三类：数据、日期/时间和字符串(字符)类型

MySql支持所有标准SQL数值数据类型

这些类型包括严格数值数据类型(INTEGER、SMALLINT、DECIMAL和NUMERIC)，以及近似数值数据类型(FLOAT、REAL和DOUBLE PRECISION)

## 数值类型

|     类型     |                   大小                   |                        范围（有符号）                        |                        范围（无符号）                        |      用途       |
| :----------: | :--------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :-------------: |
|   TINYINT    |                 1 Bytes                  |                         (-128，127)                          |                           (0，255)                           |    小整数值     |
|   SMALLINT   |                 2 Bytes                  |                      (-32 768，32 767)                       |                         (0，65 535)                          |    大整数值     |
|  MEDIUMINT   |                 3  Bytes                 |                   (-8 388 608，8 388 607)                    |                       (0，16 777 215)                        |    大整数值     |
| INT或INTEGER |                 4  Bytes                 |               (-2 147 483 648，2 147 483 647)                |                      (0，4 294 967 295)                      |    大整数值     |
|    BIGINT    |                 8  Bytes                 |   (-9,223,372,036,854,775,808，9 223 372 036 854 775 807)    |               (0，18 446 744 073 709 551 615)                |   极大整数值    |
|    FLOAT     |                 4  Bytes                 | (-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38) |         0，(1.175 494 351 E-38，3.402 823 466 E+38)          | 单精度 浮点数值 |
|    DOUBLE    |                 8  Bytes                 | (-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308) | 双精度 浮点数值 |
|   DECIMAL    | 对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2 |                        依赖于M和D的值                        |                        依赖于M和D的值                        |     小数值      |

## 日期和时间类型

表示时间值的日期和时间类型为DATETIME、DATE、TIMESTAMP、TIME和YEAR

每个时间类型有一个有效值范围和一个零值，当指定不合法的MySql不能表示的值时使用零值

TIMESTAMP类型有专有的自动更新特性

|   类型    | 大小 ( bytes) |                             范围                             |        格式         |           用途           |
| :-------: | :-----------: | :----------------------------------------------------------: | :-----------------: | :----------------------: |
|   DATE    |       3       |                    1000-01-01/9999-12-31                     |     YYYY-MM-DD      |          日期值          |
|   TIME    |       3       |                   '-838:59:59'/'838:59:59'                   |      HH:MM:SS       |     时间值或持续时间     |
|   YEAR    |       1       |                          1901/2155                           |        YYYY         |          年份值          |
| DATETIME  |       8       |        '1000-01-01 00:00:00' 到 '9999-12-31 23:59:59'        | YYYY-MM-DD hh:mm:ss |     混合日期和时间值     |
| TIMESTAMP |       4       | '1970-01-01 00:00:01' UTC 到 '2038-01-19 03:14:07' UTC  结束时间是第 **2147483647** 秒，北京时间 **2038-1-19 11:14:07**，格林尼治时间 2038年1月19日 凌晨 03:14:07 | YYYY-MM-DD hh:mm:ss | 混合日期和时间值，时间戳 |

## 字符串类型

字符串类型指CHAR、VARCHAR、BINARY、VARBINARY、BLOB、TEXT、ENUM和SET。

|    类型    |         大小          |              用途               |
| :--------: | :-------------------: | :-----------------------------: |
|    CHAR    |      0-255 bytes      |           定长字符串            |
|  VARCHAR   |     0-65535 bytes     |           变长字符串            |
|  TINYBLOB  |      0-255 bytes      | 不超过 255 个字符的二进制字符串 |
|  TINYTEXT  |      0-255 bytes      |          短文本字符串           |
|    BLOB    |    0-65 535 bytes     |     二进制形式的长文本数据      |
|    TEXT    |    0-65 535 bytes     |           长文本数据            |
| MEDIUMBLOB |  0-16 777 215 bytes   |  二进制形式的中等长度文本数据   |
| MEDIUMTEXT |  0-16 777 215 bytes   |        中等长度文本数据         |
|  LONGBLOB  | 0-4 294 967 295 bytes |    二进制形式的极大文本数据     |
|  LONGTEXT  | 0-4 294 967 295 bytes |          极大文本数据           |

注意：char(n)和varchar(n)中的n代表字符的个数，并不代表字节个数，比如CHAR(30)就可以存储30个字符

CHAR和VARCHAR类型类似，但它们保存和检索的方式不同。它们的最大长度和是否尾部空格被保留等方面也不同。在存储和检索过程中不进行大小写转换

BINARY和VARBINARY类似于CHAR和VARCHAR，不同的是它们包含二进制字符串而不要非二进制字符串。也就是说，它们包含字节字符串而不是字符字符串。也说明它们没有字符集，并且排序和比较基于列值字节的数值值

BLOB是一个二进制大对象，可以容纳可变数量的数据。有4种BLOB类型：TINYBLOB、BLOB、MEDIUMBLOB和LONGBLOB。它们在区别在于可容纳存储范围不同

有4种TEXT类型：TINYTEXT、TEXT、MEDIUMTEXT和LONGTEXT，对应着存储不同最大长度

## 枚举和集合类型(Enumeration and Set Typres)

- ENUM：枚举类型，用于存储单一值，可以选择一个预定义的集合
- SET：集合类型，用于存储多个值，可以选择多个预定义的集合

# MySql创建数据表

创建数据表需要以下信息：

- 表名
- 表字段名
- 定义每个表字段的数据类型

语法

```sql
CREATE TABLE table_name(
	column1 datatype,
	column2 datatype
)
```

参数说明：

- table_name 是你要创建的表的名称
- column1，column2是表中的列名，或者说是字段名
- datatype是每个列的数据类型

这里看一个全面的实例

```SQL
CREATE TABLE IF NOT EXISTS `EASTWIND`(
	`ID` INT PRIMARY KEY AUTO_INCREMENT,
	`TITLE` VARCHAR(100) NOT NULL,
	`AUTHOR` VARCHAR(40) NOT NULL,
	`DATE` DATE
)ENGINE=INNODB DEFAULT CHARSET = UTF8;
```

CREATE TABLE IF EXISTS `EASTWIND`：如果EASTWIND这个表不存在，就进行创建

```sql
`ID` INT PRIMARY KEY AUTO_INCREMENT,
	`TITLE` VARCHAR(100) NOT NULL,
	`AUTHOR` VARCHAR(40) NOT NULL,
	`DATE` DATE
ID、TITLE、AUTHOR、DATE这些是column
VARCHAR、DATE这些是datatype
而datatype后面跟的PRIMARY KEY、NOT NULL这些，就是给出一些条件
```

**AUTO_INCREMENT**：定义列为自增的属性，一般用于主键，数值会自动加1

**PRIMARY KEY**：用于定义列为主键

ENGINE=INNODB DEFAULT CHARSET = UTF8：指定存储引擎为INNODB，CHARSE设置编码

# MySql删除数据表

和删除数据库基本一致

语法

```sql
DROP TABLE 表名		-- 直接删除表,不检查是否存在
或
DROP TABLE [IF EXISTS] table_name;
```

- table_name是要删除的表的名称
- IF EXISTS是一个可选的子句，表示如果表存在才执行删除操作，避免因为表不存在而引发错误

# MySql插入数据

MySql表中使用`insert into`语句来插入数据

语法

```SQL
INSERT INTO TABLE_NAME (COLUMN1,COLUMN2,COLUMN3,...)
VALUES(VALUE1,VALUE2,VALUE3,...)
```

参数说明：

- table_name是你要插入数据的表的名称
- column1，column2，column3是表中的列名
- value1，value2，value3是要插入的具体数值

如果数据是字符型，必须使用单引号`'`或者双引号`"`，如：'value1'、'value2'

假如我们想插入一行数据到eastwind表中

```sql
INSERT INTO eastwind(id,name,age)
values(1,"zhangsan",18)
```

- id：主键唯一标识，整数类型
- name：姓名，字符串类型
- age：年龄，整数类型

如果是插入所有列的数据，可以省略列名

```SQL
INSERT INTO eastwind
values(NULL,"zhangsan",18)
```

这里，`NULL`是用于自增长列的占位符，表示系统将为id列生成一个唯一的值

如果要插入多行数据，可以在VALUES子句中指定多组数值

```sql
INSERT INTO eastwind
values
(NULL,"zhangsan",18)，
(NULL,"zhangsan",19)，
(NULL,"zhangsan",17)
```

# MySql查询数据

MySql数据库使用`SELECT`语句来查询数据

语法

```SQL
SELECT COLUMN1,COLUMN2,...
FROM TABLE_NAME
[WHERE CONDITION]
[ORDER BY COLUMN_NAME [ASC | DESC]]
[LIMIT NUMBER]
```

参数说明：

- column1，column2是你想要选择的列的名称，如果使用*表示选择所有列
- table_name是你要查询数据的数据表的名称
- WHERE CONDITION是一个可选字句，用于过滤条件，返回符合条件的行
- ORDER BY column_name [ASC | DESC]是一个可选的子句，用于指定结果集的排序顺序，默认是升序(ASC)
- LIMIT NUMBER是一个可选的子句，用于限制返回的行数

```SQL
-- 选择所有列的行
SELECT * FROM EASTWIND;

-- 选择特定列的所有行
SELECT ID,NAME FROM EASTWIND;

-- 添加Where子句，选择满足条件的行
SELECT * FROM EASTWIND WHERE NAME = 'zhangsan';

-- 添加ORDER BY子句，按照某列的升序进行排序
SELECT * FROM EASTWIND ORDER BY NAME;

-- 添加ORDER BY子句，按照某列的降序进行排序
SELECT * FROM EASTWIND ORDER BY NAME DESC;

-- 添加LIMIT 子句，限制返回的行数
SELECT * FROM EASTWIND LIMIT 5
```

## Where子句

我们知道从MySql表中使用`SELECT`语句来读取数据

如果想要带条件从表中筛选数据，可以将WHERE子句添加到SELECT语句中

WHERE子句用于在MySql中过滤查询结果，只返回满足特定条件的行

语法

```SQL
SELECT COLUMN1,COLUMN2,...
FROM TABLE_NAME
WHERE CONDITION;
```

参数说明：

- column1，column2，...是你要选择的列的名称，如果使用*表示选择所有列
- table_name是你要从中查询数据的表的名称
- WHERE condition是用于指定过滤条件的子句

更多说明：

- 查询语句中你可以使用一个或者多个表，表之间使用逗号`,`分割，并使用WHERE语句来设定查询条件
- 可以在WHERE子句中指定任何条件
- 可以使用AND或者OR指定一个或多个条件
- WHERE子句也可以运用SQL的DELETE或UPDATE命令
- WHERE子句类似于程序语言中的if条件，根据MySQL表中的字段值来读取指定的数据

| 操作符 |                             描述                             |         实例         |
| :----: | :----------------------------------------------------------: | :------------------: |
|   =    |          等号，检测两个值是否相等，如果相等返回true          | (A = B) 返回false。  |
| <>, != |        不等于，检测两个值是否相等，如果不相等返回true        | (A != B) 返回 true。 |
|   >    | 大于号，检测左边的值是否大于右边的值, 如果左边的值大于右边的值返回true | (A > B) 返回false。  |
|   <    | 小于号，检测左边的值是否小于右边的值, 如果左边的值小于右边的值返回true | (A < B) 返回 true。  |
|   >=   | 大于等于号，检测左边的值是否大于或等于右边的值, 如果左边的值大于或等于右边的值返回true | (A >= B) 返回false。 |
|   <=   | 小于等于号，检测左边的值是否小于或等于右边的值, 如果左边的值小于或等于右边的值返回true | (A <= B) 返回 true。 |

等于条件

```SQL
SELECT * FROM EASTWIND WHERE XXX = XXX
```

不等于条件

```sql
SELECT * FROM EASTWIND WHERE XXX != XXX
SELECT * FROM EASTWIND WHERE XXX <> XXX
```

大于、大于等于条件

```sql
SELECT * FROM EASTWIND WHERE XXX > XXX
SELECT * FROM EASTWIND WHERE XXX >= XXX
```

小于、小于等于条件

```sql
SELECT * FROM EASTWIND WHERE XXX < XXX
SELECT * FROM EASTWIND WHERE XXX <= XXX
```

组合条件(AND、OR)

```SQL
SELECT * FROM EASTWIND WHERE XXX = XXX AND XXX = XXX
SELECT * FROM EASTWIND WHERE XXX = XXX OR XXX = XXX
```

模糊匹配条件(LIKE)

LIKE是正则匹配内容

`%`表示匹配任意，`_`表示匹配单个

```SQL
SELECT * FROM EASTWIND WHERE XXX LIKE 'X%'
```

IN条件

比如说1 in (1,2,3)，这会返回满足条件的行数据

```SQL
SELECT * FROM EASTWIND WHERE XXX IN (XXX,XXX)
```

NOT条件

跟取反是一个意义的，比如1=1是true，NOT 1=1就是false

```SQL
SELECT * FROM EASTWIND WHERE NOT 1 = 1
```

BETWEEN条件

BETWEEN...AND 从字面上翻译过来是从...到...，所以意为XXX由1到3

```SQL
SELECT * FROM EASTWIND WHERE XXX BETWEEN 1 AND 3
```

ISNULL条件

判断xxx是否为空

```SQL
SELECT * FROM EASTWIND WHERE XXX IS NULL
```

IS NOT NULL条件

判断xxx是否不为空

```SQL
SELECT * FROM EASTWIND WHERE XXX IS NOT NULL
```

# MySQL Update更新数据

如果需要更新或修改MySql中的数据，我们可以使用`UPDATE`命令来操作

语法

```SQL
UPDATE TABLE_NAME
SET COLUMN1 = XXX,COLUMN2 = XXX,COLUMN3 = ...
[WHERE CONDITION]
```

- TABLE_NAME是需要更新的表的名称
- column1，column2是你要更新的列的名称
- value1，value2是新的值
- WHERE CONDITION是一个可选的子句，用于指定更新的行，如果省略WHERE，将更新表中所有行

更新某一列的值

```SQL
UPDATE EASTWIND 
SET XXX = XXX
WHERE CONDITION = XXX
```

更新多个列的值

```SQL
UPDATE EASTWIND 
SET XXX = XXX,XXX = XXX
WHERE CONDITION = XXX
```

使用表达式更新值

```SQL
UPDATE EASTWIND 
SET XXX = XXX * 2
WHERE XXX = CONDITION
```

# MySQL DELETE语句

如果想删除数据表中的记录，可以使用`DELETE FROM`来删除MySQL数据表中的记录

语法

```SQL
DELETE FROM TABLE_NAME 
WHERE CONDITION
```

参数说明：

- table_name是你要删除数据的表的名称
- WHERE CONDITION是一个可选的子句，用于指定删除的行，如果省略WHERE子句，将删除表中所有行

更多说明：

- 如果没有指定WHERE子句，MySQL表中的所有记录将被删除
- 你可以在WHERE子句中指定任何条件
- 你可以在单个表中一次性删除记录

当你想删除指定记录时，请使用WHERE子句

删除符合条件的行

```SQL
DELETE FROM EASTWIND
WHERE XXX = XXX;
```

删除所有行

```SQL
DELETE FROM TABLE_NAME;
```


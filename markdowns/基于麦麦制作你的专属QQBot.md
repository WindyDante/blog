最近没啥事，闲着也是闲着，就想整个Bot气气自己

为啥说“气气自己呢”

且看下文

# 部署

麦麦bot，一款专注于 群组聊天 的赛博网友（比较专注）多平台智能体

[官网](https://github.com/MaiM-with-u/MaiBot)

这个bot非常好玩，只要你给出人设，就会根据人设去慢慢假定自己

直接上部署流程，没啥好说的，直接上[文档](https://docs.mai-mai.org/)

这里我采用的是

1. **Debian12**
2. **4h4g**
3. QQ小号(容易被封，请使用自己的小号)
4. 硅基流动的API KEY

我使用的是Docker部署

当然文档有说明对应的环境要求，低于这个配置的最好还是不要去尝试了

- ✅ 已安装 Docker 环境
- ⚙️ 最低系统配置：2 核 CPU / 2GB 内存 / 5GB 磁盘空间
- 🐧 本教程测试环境：Ubuntu Server 24.04 LTS

不赘述Docker部署，我非常建议看到教程的用户安装**宝塔面板**或者**1P面板**

这样你就可以顺手安装Docker了，并且可以在Docker中可视化的检查日志

## 准备环境

创建项目目录

```bash
mkdir -p maim-bot/docker-config/{mmc,adapters} && cd maim-bot
```

获取 Docker 编排文件

```bash
wget https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml
```

```bash
# 备用方案 
wget https://github.moeyy.xyz/https://raw.githubusercontent.com/SengokuCola/MaiMBot/main/docker-compose.yml
```

## 环境配置

准备配置文件模板

```bash
# 获取核心组件配置模板
wget https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env \
     -O docker-config/mmc/.env
```

```bash
# 若 GitHub 直连不稳定，可使用镜像源
https://github.moeyy.xyz/https://raw.githubusercontent.com/MaiM-with-u/MaiBot/main/template/template.env
```

获取`adapter`的`config.toml`

```bash
wget https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter/raw/refs/heads/main/template/template_config.toml \
     -O docker-config/adapters/config.toml
```

```bash
# 若 GitHub 直连不稳定，可使用镜像源
https://github.moeyy.xyz/https://github.com/MaiM-with-u/MaiBot-Napcat-Adapter/raw/refs/heads/main/template/template_config.toml
```

预留配置

```bash
mkdir -p data/MaiMBot && touch ./data/MaiMBot/maibot_statistics.html
```

修改环境变量

```bash
vim docker-config/mmc/.env
```

修改以下内容

```properties
# 网络监听配置
HOST=0.0.0.0

# API 密钥配置（根据实际情况填写）
SILICONFLOW_KEY=sk-xxxxxx
```

这里贴出本人的配置，有需要的可以直接复制

SILICONFLOW_KEY是硅基流动的API，在这个网站申请

SILICONFLOW_BASE_URL是api的路径，我采用的就是硅基流动的，如果用其他的可以看看文档改一改

顺带贴一下俺自己的邀请链接嘿嘿：https://cloud.siliconflow.cn/i/XvoImdFq

注册成功后，左侧，API密钥新建，然后copy一下放到这就可以啦

```bash
HOST=0.0.0.0
PORT=8000

#key and url
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1/
# DEEP_SEEK_BASE_URL=https://api.deepseek.com/v1
# CHAT_ANY_WHERE_BASE_URL=https://api.chatanywhere.tech/v1
# BAILIAN_BASE_URL = https://dashscope.aliyuncs.com/compatible-mode/v1
# xxxxxxx_BASE_URL=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 定义你要用的api的key(需要去对应网站申请哦)
# DEEP_SEEK_KEY=
# CHAT_ANY_WHERE_KEY=
SILICONFLOW_KEY=sk-??????????????????????
# BAILIAN_KEY = 
# xxxxxxx_KEY=
```

修改config.toml

```bash
vim docker-config/adapters/config.toml
```

修改`Napcat_Server`的host为`0.0.0.0`
修改`MaiBot_Server`的host为`core`

并修改如下内容

```properties
[napcat_server] # Napcat连接的ws服务设置
host = "0.0.0.0"      # Napcat设定的主机地址
port = 8095             # Napcat设定的端口 
heartbeat_interval = 30 # 与Napcat设置的心跳相同（按秒计）

[maibot_server] # 连接麦麦的ws服务设置
host = "core" # 麦麦在.env文件中设置的主机地址，即HOST字段
port = 8000        # 麦麦在.env文件中设置的端口，即PORT字段
```

取消注释docker-compose.yml的eula

```bash
vim docker-compose.yml
# 取消注释以下两行（23-24行）
- EULA_AGREE=bda99dca873f5d8044e9987eac417e01  # 同意EULA
- PRIVACY_AGREE=42dddb3cbe2b784b45a2781407b298a1 # 同意EULA
```

当前配置完成后目录结构应如下

```
.
├── docker-compose.yml
├── data
    ├── MaiMbot
        └── maibot_statitics.html
└── docker-config
    ├── adapters
    │   └── config.toml
    └── mmc
        └── .env
```

## 初始化环境

首次启动容器生成剩余配置文件

```bash
docker compose up -d && sleep 15 && docker compose down
```

如果docker下载速度慢，就去更换docker镜像，具体操作可以在bing搜一下，这个很简单

初始化完成后，会有一个`bot_config.toml`

这是有关你bot会干啥的操作

贴一下我的，也欢迎大家使用修改

```properties
[inner]
version = "3.2.0"

#----以下是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----
#如果你想要修改配置文件，请在修改后将version的值进行变更
#如果新增项目，请阅读src/config/official_configs.py中的说明
#
# 版本格式：主版本号.次版本号.修订号，版本号递增规则如下：
#     主版本号：当你做了不兼容的 API 修改，
#     次版本号：当你做了向下兼容的功能性新增，
#     修订号：当你做了向下兼容的问题修正。
# 先行版本号及版本编译信息可以加到"主版本号.次版本号.修订号"的后面，作为延伸。
#----以上是给开发人员阅读的，如果你只是部署了麦麦，不需要阅读----

[bot]
qq_account = 123456 # 麦麦的QQ账号
nickname = "东风" # 麦麦的昵称
alias_names = ["东风老弟", "牢风","eastwind"] # 麦麦的别名

[personality]
# 建议50字以内，描述人格的核心特质
personality_core = "是一个屌丝咸鱼的大学生,热爱编程和睡觉" 
# 人格的细节，可以描述人格的一些侧面，条数任意，不能为0，不宜太多
personality_sides = [
    "懒狗",
    "老实人",
    "废话多",
]

compress_personality = false # 是否压缩人格，压缩后会精简人格信息，节省token消耗并提高回复性能，但是会丢失一些信息，如果人设不长，可以关闭


[identity]
#アイデンティティがない 生まれないらららら
# 可以描述外貌，性别，身高，职业，属性等等描述,条数任意，不能为0
identity_detail = [
    "年龄为21岁",
    "是男孩子",
    "身高为170cm"
]

compress_indentity = true # 是否压缩身份，压缩后会精简身份信息，节省token消耗并提高回复性能，但是会丢失一些信息，如果不长，可以关闭

[expression]
# 表达方式
enable_expression = true # 是否启用表达方式
expression_style = "请回复的平淡一些，简短一些，说中文，不要刻意突出自身学科背景。"
enable_expression_learning = true # 是否启用表达学习，麦麦会学习不同群里人类说话风格（群之间不互通）
learning_interval = 600 # 学习间隔 单位秒

expression_groups = [
    ["qq:123456:private","qq:123456:group","qq:123456:group"], # 在这里设置互通组，相同组的chat_id会共享学习到的表达方式
    # 格式：["qq:123456:private","qq:654321:group"]
    # 注意：如果为群聊，则需要设置为group，如果设置为私聊，则需要设置为private
]


[relationship]
enable_relationship = true # 是否启用关系系统
relation_frequency = 1 # 关系频率，麦麦构建关系的速度，仅在normal_chat模式下有效

[chat] #麦麦的聊天通用设置
chat_mode = "normal" # 聊天模式 —— 普通模式：normal，专注模式：focus，自动auto：在普通模式和专注模式之间自动切换
# chat_mode = "focus"
# chat_mode = "auto"

max_context_size = 18 # 上下文长度

replyer_random_probability = 0.5 # 首要replyer模型被选择的概率

talk_frequency = 1 # 麦麦回复频率，越高，麦麦回复越频繁

time_based_talk_frequency = ["8:00,1", "12:00,1.5", "18:00,2", "01:00,0.5"]
# 基于时段的回复频率配置（可选）
# 格式：time_based_talk_frequency = ["HH:MM,frequency", ...]
# 示例：
# time_based_talk_frequency = ["8:00,1", "12:00,2", "18:00,1.5", "00:00,0.5"]
# 说明：表示从该时间开始使用该频率，直到下一个时间点
# 注意：如果没有配置，则使用上面的默认 talk_frequency 值

talk_frequency_adjust = [
    ["qq:114514:group", "12:20,1", "16:10,2", "20:10,1", "00:10,0.3"],
    ["qq:1919810:private", "8:20,1", "12:10,2", "20:10,1.5", "00:10,0.2"]
]

# 基于聊天流的个性化时段频率配置（可选）
# 格式：talk_frequency_adjust = [["platform:id:type", "HH:MM,frequency", ...], ...]
# 说明：
# - 第一个元素是聊天流标识符，格式为 "platform:id:type"
#   - platform: 平台名称（如 qq）
#   - id: 群号或用户QQ号
#   - type: group表示群聊，private表示私聊
# - 后续元素是"时间,频率"格式，表示从该时间开始使用该频率，直到下一个时间点
# - 优先级：聊天流特定配置 > 全局时段配置 > 默认 talk_frequency
# - 时间支持跨天，例如 "00:10,0.3" 表示从凌晨0:10开始使用频率0.3
# - 系统会自动将 "platform:id:type" 转换为内部的哈希chat_id进行匹配

auto_focus_threshold = 1 # 自动切换到专注聊天的阈值，越低越容易进入专注聊天
exit_focus_threshold = 1 # 自动退出专注聊天的阈值，越低越容易退出专注聊天
# 普通模式下，麦麦会针对感兴趣的消息进行回复，token消耗量较低
# 专注模式下，麦麦会进行主动的观察和回复，并给出回复，token消耗量较高
# 自动模式下，麦麦会根据消息内容自动切换到专注模式或普通模式

[message_receive]
# 以下是消息过滤，可以根据规则过滤特定消息，将不会读取这些消息
ban_words = [
    # "403","张三"
    ]

ban_msgs_regex = [
    # 需要过滤的消息（原始消息）匹配的正则表达式，匹配到的消息将被过滤，若不了解正则表达式请勿修改
    #"https?://[^\\s]+", # 匹配https链接
    #"\\d{4}-\\d{2}-\\d{2}", # 匹配日期
]

[normal_chat] #普通聊天
#一般回复参数
emoji_chance = 0.2 # 麦麦一般回复时使用表情包的概率
thinking_timeout = 30 # 麦麦最长思考规划时间，超过这个时间的思考会放弃（往往是api反应太慢）

willing_mode = "classical" # 回复意愿模式 —— 经典模式：classical，mxp模式：mxp，自定义模式：custom（需要你自己实现）

response_interested_rate_amplifier = 1 # 麦麦回复兴趣度放大系数

mentioned_bot_inevitable_reply = true # 提及 bot 必然回复
at_bot_inevitable_reply = true # @bot 必然回复（包含提及）

enable_planner = true # 是否启用动作规划器（与focus_chat共享actions）


[focus_chat] #专注聊天
think_interval = 3 # 思考间隔 单位秒，可以有效减少消耗
consecutive_replies = 1 # 连续回复能力，值越高，麦麦连续回复的概率越高
compressed_length = 8 # 不能大于observation_context_size,心流上下文压缩的最短压缩长度，超过心流观察到的上下文长度，会压缩，最短压缩长度为5
compress_length_limit = 4 #最多压缩份数，超过该数值的压缩上下文会被删除
working_memory_processor = false # 是否启用工作记忆处理器，消耗量大

[tool]
enable_in_normal_chat = false # 是否在普通聊天中启用工具
enable_in_focus_chat = true # 是否在专注聊天中启用工具

[emoji]
max_reg_num = 60 # 表情包最大注册数量
do_replace = true # 开启则在达到最大数量时删除（替换）表情包，关闭则达到最大数量时不会继续收集表情包
check_interval = 10 # 检查表情包（注册，破损，删除）的时间间隔(分钟)
steal_emoji = true # 是否偷取表情包，让麦麦可以将一些表情包据为己有
content_filtration = false  # 是否启用表情包过滤，只有符合该要求的表情包才会被保存
filtration_prompt = "符合公序良俗" # 表情包过滤要求，只有符合该要求的表情包才会被保存

[memory]
enable_memory = true # 是否启用记忆系统
memory_build_interval = 1000 # 记忆构建间隔 单位秒   间隔越低，麦麦学习越多，但是冗余信息也会增多
memory_build_distribution = [6.0, 3.0, 0.6, 32.0, 12.0, 0.4] # 记忆构建分布，参数：分布1均值，标准差，权重，分布2均值，标准差，权重
memory_build_sample_num = 4 # 采样数量，数值越高记忆采样次数越多
memory_build_sample_length = 30 # 采样长度，数值越高一段记忆内容越丰富
memory_compress_rate = 0.1 # 记忆压缩率 控制记忆精简程度 建议保持默认,调高可以获得更多信息，但是冗余信息也会增多

forget_memory_interval = 1500 # 记忆遗忘间隔 单位秒   间隔越低，麦麦遗忘越频繁，记忆更精简，但更难学习
memory_forget_time = 24 #多长时间后的记忆会被遗忘 单位小时
memory_forget_percentage = 0.01 # 记忆遗忘比例 控制记忆遗忘程度 越大遗忘越多 建议保持默认

consolidate_memory_interval = 1000 # 记忆整合间隔 单位秒   间隔越低，麦麦整合越频繁，记忆更精简
consolidation_similarity_threshold = 0.7 # 相似度阈值
consolidation_check_percentage = 0.05 # 检查节点比例

#不希望记忆的词，已经记忆的不会受到影响，需要手动清理
memory_ban_words = [ "表情包", "图片", "回复", "聊天记录" ]

[mood] # 暂时不再有效，请不要使用
enable_mood = false # 是否启用情绪系统
mood_update_interval = 1.0 # 情绪更新间隔 单位秒
mood_decay_rate = 0.95 # 情绪衰减率
mood_intensity_factor = 1.0 # 情绪强度因子

[lpmm_knowledge] # lpmm知识库配置
enable = true # 是否启用lpmm知识库
rag_synonym_search_top_k = 10 # 同义词搜索TopK
rag_synonym_threshold = 0.8 # 同义词阈值（相似度高于此阈值的词语会被认为是同义词）
info_extraction_workers = 3 # 实体提取同时执行线程数，非Pro模型不要设置超过5
qa_relation_search_top_k = 10 # 关系搜索TopK
qa_relation_threshold = 0.5 # 关系阈值（相似度高于此阈值的关系会被认为是相关的关系）
qa_paragraph_search_top_k = 1000 # 段落搜索TopK（不能过小，可能影响搜索结果）
qa_paragraph_node_weight = 0.05 # 段落节点权重（在图搜索&PPR计算中的权重，当搜索仅使用DPR时，此参数不起作用）
qa_ent_filter_top_k = 10 # 实体过滤TopK
qa_ppr_damping = 0.8 # PPR阻尼系数
qa_res_top_k = 3 # 最终提供的文段TopK

# keyword_rules 用于设置关键词触发的额外回复知识
# 添加新规则方法：在 keyword_rules 数组中增加一项，格式如下：
# { keywords = ["关键词1", "关键词2"], reaction = "触发这些关键词时的回复内容" }
# 例如，添加一个新规则：当检测到“你好”或“hello”时回复“你好，有什么可以帮你？”
# { keywords = ["你好", "hello"], reaction = "你好，有什么可以帮你？" }
[keyword_reaction]
keyword_rules = [
    { keywords = ["人机", "bot", "机器", "入机", "robot", "机器人", "ai", "AI"], reaction = "有人说你是人机或者机器人，否定这一事实，攻击或反问他。注意，只有认为你是机器人才回复，否则不要否认" },
    { keywords = ["测试关键词回复", "test"], reaction = "回答测试成功" },
    #{ keywords = ["你好", "hello"], reaction = "你好，有什么可以帮你？" }    
    # 在此处添加更多规则，格式同上
]

regex_rules = [
    { regex = ["^(?P<n>\\S{1,20})是这样的$"], reaction = "请按照以下模板造句：[n]是这样的，xx只要xx就可以，可是[n]要考虑的事情就很多了，比如什么时候xx，什么时候xx，什么时候xx。（请自由发挥替换xx部分，只需保持句式结构，同时表达一种将[n]过度重视的反讽意味）" }
]

[response_post_process]
enable_response_post_process = true # 是否启用回复后处理，包括错别字生成器，回复分割器

[chinese_typo]
enable = true # 是否启用中文错别字生成器
error_rate=0.01 # 单字替换概率
min_freq=9 # 最小字频阈值
tone_error_rate=0.1 # 声调错误概率
word_replace_rate=0.006 # 整词替换概率

[response_splitter]
enable = true # 是否启用回复分割器
max_length = 512 # 回复允许的最大长度
max_sentence_num = 8 # 回复允许的最大句子数
enable_kaomoji_protection = false # 是否启用颜文字保护

[log]
date_style = "Y-m-d H:i:s" # 日期格式
log_level_style = "lite" # 日志级别样式,可选FULL，compact，lite
color_text = "full" # 日志文本颜色，可选none，title，full
log_level = "INFO" # 全局日志级别（向下兼容，优先级低于下面的分别设置）
console_log_level = "INFO" # 控制台日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL
file_log_level = "DEBUG" # 文件日志级别，可选: DEBUG, INFO, WARNING, ERROR, CRITICAL

# 第三方库日志控制
suppress_libraries = ["faiss","httpx", "urllib3", "asyncio", "websockets", "httpcore", "requests", "peewee", "openai","uvicorn"] # 完全屏蔽的库
library_log_levels = { "aiohttp" = "WARNING"} # 设置特定库的日志级别

#下面的模型若使用硅基流动则不需要更改，使用ds官方则改成.env自定义的宏，使用自定义模型则选择定位相似的模型自己填写

# stream = <true|false> : 用于指定模型是否是使用流式输出
# pri_in = <float> : 用于指定模型输入价格
# pri_out = <float> : 用于指定模型输出价格
# temp = <float> : 用于指定模型温度
# enable_thinking = <true|false> : 用于指定模型是否启用思考
# thinking_budget = <int> : 用于指定模型思考最长长度

[model]
model_max_output_length = 1000 # 模型单次返回的最大token数

#------------必填：组件模型------------

[model.utils] # 在麦麦的一些组件中使用的模型，例如表情包模块，取名模块，消耗量不大
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3

[model.utils_small] # 在麦麦的一些组件中使用的小模型，消耗量较大
# 强烈建议使用免费的小模型
name = "Qwen/Qwen3-8B"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0
temp = 0.7
enable_thinking = false # 是否启用思考

[model.replyer_1] # 首要回复模型，还用于表达器和表达方式学习
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3

[model.replyer_2] # 次要回复模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2 #模型的输入价格（非必填，可以记录消耗）
pri_out = 8 #模型的输出价格（非必填，可以记录消耗）
#默认temp 0.2 如果你使用的是老V3或者其他模型，请自己修改temp参数
temp = 0.2 #模型的温度，新V3建议0.1-0.3


[model.memory_summary] # 记忆的概括模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 2.8
temp = 0.7
enable_thinking = false # 是否启用思考

[model.vlm] # 图像识别模型
name = "Pro/Qwen/Qwen2.5-VL-7B-Instruct"
provider = "SILICONFLOW"
pri_in = 0.35
pri_out = 0.35

[model.planner] #决策：负责决定麦麦该做什么，麦麦的决策模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8
temp = 0.3

[model.relation] #用于处理和麦麦和其他人的关系
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 2.8
temp = 0.7
enable_thinking = false # 是否启用思考

[model.tool_use] #工具调用模型，需要使用支持工具调用的模型
name = "Qwen/Qwen3-14B"
provider = "SILICONFLOW"
pri_in = 0.5
pri_out = 2
temp = 0.7
enable_thinking = false # 是否启用思考（qwen3 only）

#嵌入模型
[model.embedding]
name = "BAAI/bge-m3"
provider = "SILICONFLOW"
pri_in = 0
pri_out = 0

#------------专注聊天必填模型------------

[model.focus_working_memory] #工作记忆模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
enable_thinking = false # 是否启用思考(qwen3 only)
pri_in = 0.7
pri_out = 2.8
temp = 0.7


#------------LPMM知识库模型------------

[model.lpmm_entity_extract] # 实体提取模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8
temp = 0.2


[model.lpmm_rdf_build] # RDF构建模型
name = "Pro/deepseek-ai/DeepSeek-V3"
provider = "SILICONFLOW"
pri_in = 2
pri_out = 8
temp = 0.2


[model.lpmm_qa] # 问答模型
name = "Qwen/Qwen3-30B-A3B"
provider = "SILICONFLOW"
pri_in = 0.7
pri_out = 2.8
temp = 0.7
enable_thinking = false # 是否启用思考

[maim_message]
auth_token = [] # 认证令牌，用于API验证，为空则不启用验证
# 以下项目若要使用需要打开use_custom，并单独配置maim_message的服务器
use_custom = false # 是否启用自定义的maim_message服务器，注意这需要设置新的端口，不能与.env重复
host="127.0.0.1"
port=8090
mode="ws" # 支持ws和tcp两种模式
use_wss = false # 是否使用WSS安全连接，只支持ws模式
cert_file = "" # SSL证书文件路径，仅在use_wss=true时有效
key_file = "" # SSL密钥文件路径，仅在use_wss=true时有效

[telemetry] #发送统计信息，主要是看全球有多少只麦麦
enable = true

[experimental] #实验性功能
debug_show_chat_mode = false # 是否在回复后显示当前聊天模式
enable_friend_chat = false # 是否启用好友聊天
```

# 启动

启动麦麦

```bash
docker compose up -d
```

验证服务状态

```bash
docker compose ps
```

正常应显示 4 个容器（maim-bot-core、maim-bot-adapters、maim-bot-napcat）状态为 `running`

```bash
NAME                IMAGE                           COMMAND                  SERVICE     CREATED          STATUS          PORTS
maim-bot-adapters   unclas/maimbot-adapter:latest   "python main.py"         adapters    34 minutes ago   Up 34 minutes   8095/tcp
maim-bot-core       sengokucola/maimbot:main        "python bot.py"          core        34 minutes ago   Up 34 minutes   8000/tcp
maim-bot-napcat     mlikiowa/napcat-docker:latest   "bash entrypoint.sh"     napcat      34 minutes ago   Up 34 minutes   0.0.0.0:6099->6099/tcp, [::]:6099->6099/tcp
sqlite-web          coleifer/sqlite-web             "/bin/ash -c 'sqlite…"   sqlite-web  34 minutes ago   Up 34 minutes   0.0.0.0:8120->8080/tcp
```

| 操作     | 命令                                    |
| :------- | :-------------------------------------- |
| 启动服务 | `docker compose up -d`                  |
| 停止服务 | `docker compose down`                   |
| 强制重建 | `docker compose up -d --force-recreate` |

紧接着，我们需要配置Napcat

访问 `http://<服务器IP>:6099` 完成 Napcat 的配置，Napcat的默认token是：Napcat

如果不正确，请在napcat 的日志里查看

网络配置使用`websocket客户端`，`url`为`ws://adapters:8095` 例：

<img src="https://docs.mai-mai.org/images/mmc-napcat-client.png" alt="image" style="zoom:50%;" />

此时，一般来说，不会再出现什么问题了，除非你前面少操作了

此时你可以向你的bot发一句，你好

![image-20250709213320591](https://b.1wind.cn/2025/07/eedbe479e9939d822d2db297bf91dd88.png)

顺带分享一下被这个坏bot气愤的事

<img src="https://b.1wind.cn/2025/07/15ae53b56265dfaeaeff4f766b6e8d94.png" alt="image-20250709213508768" style="zoom: 67%;" />
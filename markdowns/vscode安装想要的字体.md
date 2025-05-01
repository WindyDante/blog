---
title: vscode安装想要的字体
tags: 工具
date: 2024-09-29 07:36:26
---

很多时候你会感觉哇，一直用一个字体，真的特别单调或者乏味，甚至于有些同学可能对默认字体不是很喜爱，这里出一个简单的教程，来帮助我 and 其他同学们，学习一下如何安装一个字体

你需要准备的东西

- vscode
- 想要的一个字体包(.ttf后缀的文件)或windows自带字体包

好，现在我们开始，其实操作极其简单，你需要下载一个vscode,下载完成后打开它

想修改对应的配置呢，我们需要找到vscode的settings.json文件

在左下角有一个小齿轮，按下图流程依次点击

![image-20240929074155035](https://s2.loli.net/2024/09/29/3pjQUtBXfF2Zmzc.png)

![image-20240929074302140](https://s2.loli.net/2024/09/29/hFoBuqx7e2HlYtL.png)

此时，你就在vscode中简单而轻易的实习了settings.json文件的打开

`editor.fontFamily`注意这个属性，如果没有你可以添加上

```json
{
    "editor.fontFamily": "Sarasa Mono SC, Fira Code, JetBrains Mono, Menlo, Monaco, Consolas, 'monospace', system-ui, monospace, Symbols Nerd Font, FiraCode Nerd Font, JetBrainsMono Nerd Font, CaskaydiaCove Nerd Font, Hack Nerd Font"
}
```

至于如何添加一个json属性，你只需要在以某个元素即`xxx.xxx:content`的尾部

加入`,"editor.fontFamily":你需要存入的字体`

当然，如果什么都没有呢,我建议你可以直接复制我的上面这一段，然后修改为你需要的字体名称就行了

我的字体是<a href="https://blog.zhilu.cyou/">纸鹿</a>giegie推荐的，用起来感觉相当巴适啊，采用的是`等宽更纱黑体，sarasa`

关于字体如何下载，这里也说明一下，你只需要打开浏览器，搜索你想要的字体名称

你会看到一个网址，点进去，找到对应的ttf文件，下载后点开，进行安装即可


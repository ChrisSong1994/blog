---
title: "Mac/Linux查看内网ip与访问公网的ip地址"
date: "2022-09-08"
excerpt: 查看内网ip与访问公网的ip地址
tags: ["linux","mac"]
---

## 内网IP查询
命令行中使用ifconfig查看的是内网的ip，常见于`192.168.xxx.xxx` 

## 公网 IP 查询

查询公网IP可以在命令行中使用：

```bash
curl ifconfig.me  # 125.119.220.22
```
或者
```bash
curl ipinfo.io/json
```
示例
```json
{
  "ip": "125.119.220.220",
  "city": "Hangzhou",
  "region": "Zhejiang",
  "country": "CN",
  "loc": "30.2936,120.1614",
  "org": "AS4134 CHINANET-BACKBONE",
  "postal": "310000",
  "timezone": "Asia/Shanghai",
  "readme": "https://ipinfo.io/missingauth"
}
```
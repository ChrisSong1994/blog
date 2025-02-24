---
title: "如何使用阿里云DDNS Open API 更新动态域名解析记录"
date: "2024-04-21"
categories: ["nodejs",'network']
top_img: /images/cover/posts/DDNS.jpg
excerpt: 如何使用阿里云DDNS Open API 更新动态域名解析记录
tags: ["nodejs","dns","docker"]
---

最近一段时间我的腾讯云买的域名到期了，正好我也买了一个阿里云的服务器，所以想着域名也一起在阿里云买得了，于是乎我就像之前一样买好域名后开始配置 DNS 解析，本来想着也没啥区别，但是配着配着我才发现腾讯云是提供免费的 ddns 解析服务的，而阿里云没有，只提供了 [ 实现动态域名解析DDNS Open Api ](https://next.api.aliyun.com/api-tools/demo/Alidns/7a52d9f9-59b0-43bd-96fc-8d475220f56f)，没办法，家里的一些服务器和 nas 需要远程访问的话没有域名很麻烦，公网ip又会动态变化，于是想还是使用 `Open Api`自己动手搞定吧。
## 1、创建 AccessKey
首先使用 Open Api 需要登录阿里云控制台，在右上角头像悬浮展开会看到 `AccessKey 管理的`的选项，点进去创建 AccessKey 即可，创建完成后保存下`AccessKeyId`和 `AccessKeySecret`下面使用 `Open Api` 会用到；
## 2、环境安装
使用阿里云`Open Api`需要对应的编程环境，作为前端开发人员，我这里直接选用`nodejs`最为编程环境，大家对应选择自己熟悉的环境即可；
![image.png](/images/96c4a75fdd79f37b763bc6cb900c71c3.png)
环境安装完毕，就是看下需要哪些参数了，更新动态域名解析记录需要调用两个`Open Api`：

- [DescribeDomainRecords](https://help.aliyun.com/document_detail/29776.html?spm=5176.11065259.1996646101.searchclickresult.30897aeeuqKzKJ): 查询域名解析记录
- [UpdateDomainRecord](https://help.aliyun.com/document_detail/113446.html?spm=5176.10695662.1996646101.searchclickresult.63a61118j9ci33)：更新域名解析记录

详细参数如下,具体使用可以查看示例代码就行；
> - accessKeyId: 您的AccessKey ID
> - accessKeySecret: 您的AccessKey Secret
> - regionId: 您的可用区ID
> - DescribeDomainRecords
> - domainName: 域名名称
> - RRKeyWord: 主机记录的关键字，按照“%RRKeyWord%”模式搜索，不区分大小写）
> - currentHostIP: 当前主机公网IP
> - UpdateDomainRecord
> - RR: 主机记录。如果要解析@.exmaple.com，主机记录要填写”@”，而不是空。
> - recordId: 解析记录的ID


⚠️**注意：**
1、这里可以配合着下面的两种方式查看自己的公网 ip 
```bash
curl ifconfig.me
# or
curl ipinfo.io/json
```
2、区域可查看  [阿里云地域和可用区](https://help.aliyun.com/document_detail/40654.html)
## 3、封装 docker 服务
由于官方提供的示例只是个简单的命令行工具，每次更新动态域名解析记录需要自己手动完成，而我需要程序自动就帮我定时更新，所以我想到一个简单的办法就是把命令行改成一个定时执行的脚本封装成 docker 镜像，然后运行在我家里的一个虚拟机上就完成了，具体代码如下:
```typescript
// This file is auto-generated, don't edit it
import Dns, * as $Dns from "@alicloud/alidns20150109";
import Util from "@alicloud/tea-util";
import Env from "@alicloud/darabonba-env";
import OpenApi, * as $OpenApi from "@alicloud/openapi-client";
import Console from "@alicloud/tea-console";
import * as $tea from "@alicloud/tea-typescript";
import schedule from "node-schedule";

const IP_INFO_URL = "https://ipinfo.io/json";

export default class Client {
  /**
   * Initialization  初始化公共请求参数
   */
  static Initialization(regionId: string): Dns {
    let config = new $OpenApi.Config({});
    // AccessKey ID
    config.accessKeyId = Env.getEnv("ALICLOUD_ACCESS_KEY_ID");
    config.accessKeySecret = Env.getEnv("ALICLOUD_ACCESS_KEY_SECRET");
    // 您的可用区ID
    config.regionId = regionId;
    return new Dns(config);
  }

  /**
   * 获取主域名的所有解析记录列表
   */
  static async DescribeDomainRecords(
    client: Dns,
    domainName: string,
    RR: string,
    recordType: string
  ): Promise<$Dns.DescribeDomainRecordsResponse> {
    let req = new $Dns.DescribeDomainRecordsRequest({});
    // 主域名
    req.domainName = domainName;
    // 主机记录
    req.RRKeyWord = RR;
    // 解析记录类型
    req.type = recordType;
    try {
      let resp = await client.describeDomainRecords(req);
      Console.log(
        "-------------------获取主域名的所有解析记录列表--------------------"
      );
      Console.log(Util.toJSONString($tea.toMap(resp)));
      return resp;
    } catch (error) {
      Console.log(error.message);
    }
    return null;
  }

  /**
   * 修改解析记录
   */
  static async UpdateDomainRecord(
    client: Dns,
    req: $Dns.UpdateDomainRecordRequest
  ): Promise<void> {
    try {
      let resp = await client.updateDomainRecord(req);
      Console.log("-------------------修改解析记录--------------------");
      Console.log(Util.toJSONString($tea.toMap(resp)));
    } catch (error) {
      Console.log(error.message);
    }
  }

  static async main(): Promise<void> {
    const domainName = Env.getEnv("DOMAIN_NAME");
    const RR = Env.getEnv("RR");
    const regionid = Env.getEnv("REGION_ID") || "cn-hangzhou"; // 默认杭州
    const recordType = Env.getEnv("RECORD_TYPE") || "A"; // 默认 A 记录

    let client = Client.Initialization(regionid);
    let resp = await Client.DescribeDomainRecords(
      client,
      domainName,
      RR,
      recordType
    );
    if (
      Util.isUnset($tea.toMap(resp)) ||
      Util.isUnset($tea.toMap(resp.body.domainRecords.record[0]))
    ) {
      Console.log("错误参数！");
      return;
    }

    let record = resp.body.domainRecords.record[0];
    // 记录ID
    let recordId = record.recordId;
    // 记录值
    let recordsValue = record.value;
    try {
      const ipinfo: any = await fetch(IP_INFO_URL).then((res) => res.json());
      const currentHostIP = ipinfo.ip;
      Console.log(
        `-------------------当前主机公网IP为：${currentHostIP}--------------------`
      );
      if (!Util.equalString(currentHostIP, recordsValue)) {
        // 修改解析记录
        let req = new $Dns.UpdateDomainRecordRequest({});
        // 主机记录
        req.RR = RR;
        // 记录ID
        req.recordId = recordId;
        // 将主机记录值改为当前主机IP
        req.value = currentHostIP;
        // 解析记录类型
        req.type = recordType;
        await Client.UpdateDomainRecord(client, req);
      }
    } catch (error) {
      Console.log(error.message);
    }
  }
}


Client.main();

// 每半个小时执行一次
schedule.scheduleJob("*/30 * * * *", function () {
  Console.log(
    "------------------- 阿里云 ddns 解析程序执行！--------------------"
  );
  Client.main();
});

```
最后通过`Dockerfile`构建成 docker 镜像于行即可
```bash
FROM --platform=linux/amd64 node:20

# 创建工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json（如果有）到工作目录
COPY package*.json ./
COPY ./dist ./dist

# 安装依赖
RUN npm i

# 执行程序
CMD [ "node","./dist/index.js" ]
```
docker 镜像构建
```bash
# 构建镜像
docker build -t aliyun_ddns_updater:v1 .
```
## 4、docker 运行
docker 镜像的主要运行参数就是 `Open Api` 所需的几个参数，全部是环境变量
```shell

# 创建容器
docker run -it --name aliyun_ddns_updater  aliyun_ddns_updater:v1

# 启动 docker 需要配置环境变量
ALICLOUD_ACCESS_KEY_ID  # 阿里云 accessKeyId
ALICLOUD_ACCESS_KEY_SECRET # 阿里云 accessKeySecret
DOMAIN_NAME # 修改的主域名
RR  # 修改的子域名
REGION_ID  # 阿里云区域 默认 cn-hangzhou
RECORD_TYPE # 域名记录类型 默认 A

```
GitHub 仓库地址：[https://github.com/ChrisSong1994/aliyun_ddns_updater](https://github.com/ChrisSong1994/aliyun_ddns_updater)
docker 地址： [https://hub.docker.com/repository/docker/chrissong1994/aliyun_ddns_updater/general](https://hub.docker.com/repository/docker/chrissong1994/aliyun_ddns_updater/general)



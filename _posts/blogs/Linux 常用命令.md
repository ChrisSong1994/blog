---
title: "Linux 常用命令"
date: "2023-05-26"
excerpt: "在Linux系统中，命令行是与系统交互的核心方式，它提供了强大的功能来管理文件、进程、网络等。以下是一些常用的Linux命令及其详细说明"
tags: ["Linux", "命令行"]
---

在 Linux 系统中，命令行是与系统交互的核心方式，它提供了强大的功能来管理文件、进程、网络等。以下是一些常用的 Linux 命令及其详细说明：

### 1. 文件和目录操作

- `pwd`：打印当前工作目录的绝对路径。
- `ls`：列出目录内容。常见的选项包括 -l（长格式，显示权限、大小等）、-a（显示隐藏文件）。
- `cd <directory>`：切换当前目录到 <directory>。
- `mkdir <directory>`：创建一个或多个目录。
- `rmdir <directory>`：删除空目录。
- `rm [-rf] <file/directory>`：删除文件或目录。使用 -r 或 -R 递归删除目录，-f 强制删除，不提示确认。
- `touch <file>`：创建文件或更新已有文件的访问和修改时间。
- `cp <source> <destination>`：复制文件或目录。使用 -r 复制目录。
- `mv <source> <destination>`：移动或重命名文件或目录。

### 2. 文件内容查看和编辑

- `cat <file>`：显示文件内容。
- `more <file>`：分页查看文件内容，只能向前翻页。
- `less <file>`：分页查看文件内容，支持前后翻页和搜索。
- `head/tail [-n <lines>] <file>`：分别显示文件的前几行或后几行，-n 指定行数。
- `vim/nano <file>`：文本编辑器，用于编辑文件内容。

### 3. 文件查找和过滤

- `find <path> [-name <pattern>] [-type f/d]`：在指定路径下查找文件或目录。-name 按名称模式查找，`-type f/d` 分别指定查找文件或目录。
- `grep <pattern> <file>`：在文件中搜索包含指定模式的行。

### 4. 用户和权限管理

- `whoami`：显示当前用户的用户名。
- `sudo <command>`：以超级用户权限执行命令。
- `chmod <mode> <file>`：更改文件或目录的权限模式，如 chmod 755 file.txt。
- `chown <user:group> <file>`：改变文件或目录的所有权。

### 5. 进程管理

- `ps aux`：显示当前系统中运行的进程状态。
- `top`：实时显示系统中各个进程的资源占用状况。
- `kill <pid>`：发送信号（默认 SIGTERM）给指定 PID 的进程，使其终止。
- `kill -9 <pid>`：强制终止进程，使用 SIGKILL 信号。
- 

### 6. 网络操作

- `ifconfig` 或` ip addr show`：显示网络接口信息。
- `ping <host>`：测试与另一台主机的网络连通性。
- `curl <url>`：下载或获取 URL 的内容。
- `wget <url>`：下载文件。
- `netstat`：显示网络连接和进程。 例如  `netstat -tuln | grep 8080` 查看监听端口为 8080 的进程。

### 7. 系统信息和资源监控

- `uname -a`：显示系统详细信息，如内核版本。
- `df -h`：查看磁盘空间使用情况。
- `du -sh <directory>`：估算指定目录的磁盘使用量。
- `free -m`：显示内存使用情况，单位为 MB。

### 8. 软件包管理（取决于发行版）

- 对于基于 Debian 的系统（如 Ubuntu）：`apt-get update` 更新软件包列表，`apt-get install <package>` 安装软件包，`apt-get remove <package>` 移除软件包。
- 对于基于 Red Hat 的系统（如 CentOS）：`yum update` 更新软件包列表，`yum install <package>` 安装软件包，`yum remove <package> `移除软件包。
- 对于较新系统（如 Ubuntu 20.04+ 或 CentOS 8 Stream）：使用 apt 或 dnf 代替上述命令。

这些命令是 Linux 日常管理和开发的基础，掌握它们能够极大地提升工作效率。不同 Linux 发行版可能有细微差别，使用时可根据具体环境调整。

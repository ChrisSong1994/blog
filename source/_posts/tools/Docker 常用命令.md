---
title: "Docker 常用命令"
date: "2022-01-14"
excerpt: "Docker 提供了一系列丰富的命令来管理容器、镜像、网络和存储卷等。以下是一些常用的 Docker 命令及其详细说明"
tags: ["Docker","命令行"]
categories: ["工具"]
---


Docker 提供了一系列丰富的命令来管理容器、镜像、网络和存储卷等。以下是一些常用的 Docker 命令及其详细说明：
### 1. 帮助类命令

- `docker version`：显示 Docker 的版本信息和运行时的详细信息。
- `docker info`：显示 Docker 系统的详细信息，包括系统范围的设置和容器、镜像的数量等。
### 2. 镜像命令

- `docker images` 或 `docker image ls`：列出本地的镜像。
- `docker pull <image>`：从 Docker Hub 或其他注册表下载镜像。
- `docker build -t <name> <path>`：基于 Dockerfile，在指定路径下构建一个新的镜像。
- `docker rmi <image>`：删除一个或多个镜像。
- `docker tag <source_image> <target_image>`：给镜像打标签，便于推送或引用。
### 3. 容器命令

- `docker run [-d] [-p <host_port>:<container_port>] <image> [command]`：创建并启动一个容器，-d 表示后台运行，-p 用于端口映射。
- `docker ps` 或 `docker container ls`：列出正在运行的容器。
- `docker ps -a` 或 `docker container ls --all`：列出所有容器，包括停止的。
- `docker stop <container>`：停止一个或多个运行中的容器。
- `docker start <container>`：启动一个或多个已停止的容器。
- `docker restart <container>`：重启容器。
- `docker rm <container>`：删除一个或多个容器，容器必须是停止状态。
- `docker kill <container>`：强制终止一个或多个容器的进程。
- `docker exec -it <container> <command>`：在运行的容器中执行命令。
- `docker attach <container>`：连接到一个正在运行的容器的终端。
### 4. 网络命令

- `docker network ls`：列出所有的网络。
- `docker network create <network_name>`：创建一个新的网络。
- `docker network connect <network_name> <container>`：将容器连接到网络。
- `docker network disconnect <network_name> <container>`：将容器从网络断开连接。
### 5. 存储卷命令

- `docker volume create <volume_name>`：创建一个新的存储卷。
- `docker volume ls`：列出所有的存储卷。
- `docker volume inspect <volume_name>`：显示存储卷的详细信息。
- `docker run -v <host_dir>:<container_dir> <image>`：在运行容器时挂载一个卷或目录。
### 6. 其他常用命令

- `docker logs <container>`：查看容器的日志输出。
- `docker commit <container> <image>`：将容器的当前状态保存为一个新的镜像。
- `docker system prune`：清理未使用的资源，如无用的容器、网络、镜像（不含在运行中的镜像）和构建缓存。
- `docker-compose up`：使用 Docker Compose 启动服务定义中的所有容器。
- `docker-compose down`：停止并移除 Docker Compose 管理的服务容器。

这些命令是 Docker 日常管理和开发中非常基础且重要的部分，通过组合使用，可以完成复杂的容器化应用部署和管理任务。

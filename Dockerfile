# 运行阶段
FROM nginx:1.19.2  AS client-server

WORKDIR /usr/share/nginx/html

COPY  ./dist ./
COPY  ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

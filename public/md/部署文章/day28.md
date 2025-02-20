## python项目

### 生产环境-更新依赖

1. 激活生产环境 并且安装

```cmd
source /envs/nb/bin/activate 
pip install -r requirements.txt
```



本地开发环境-生成requirements.txt

````cmd
pip freeze > requirements.txt
````

### 环境变量

1. 创建文件 .env.production 、.env.development

   ```cmd
   FLASK_ENV=development 
   ```

2. 我选择在wsgi.py(因为只有生产环境会使用这个文件)

   ````python
   # 加载.env.production配置文件
   load_dotenv('.env.production')
   ````


### 静态资源配置

例如 

http://1.13.189.249/home/lighthouse/static-uploads/202502/0031c7e0d53fd7a54cf59058145dc95c.png

1. 配置ngnix的静态资源

2. 将其重定向至目标区域

3. 确保 Nginx 用户有权限

4. 此时你应该如此就可以访问到

   ````cmd
   http://1.13.189.249/static-uploads/202502/0031c7e0d53fd7a54cf59058145dc95c.png
   ````

   

### flask数据库更新



1. 若是迁移 flask db migrate -m "更新数据库"

2. 若是升级 flask db upgrade
3. 若是初始化迁移 flask db init

````python
migrate = Migrate(app, db)
````



## 配置安全组

当购买成功且安装好操作系统之后，请先配置安全组

## 线上服务器

登录线上服务器并获取代码，本质上需要以下三个步骤：

- 登录服务器

  ```
  - 云平台网页版：支持登录并进行命令交互（不便捷，不推荐）。
  - SSH工具，连接比较方便（推荐）
  	- win：xshell、SecureCRT
  	- mac：iTerm2
  
  注意：如果使用SSH工具连接远程服务器的话，需要在云平台的的安全组开启22端口权限。
  ```

- 安装git

  ```
  yum install git -y
  ```

  ![image-20221025192515118](assets/image-20221025192515118.png)

- 进入项目克隆或拉取代码

  ```
  基于用户名和密码，需要输入用户和密码
  	git clone https://gitee.com/wupeiqi/xxxxx.git
  	
  基于用户名和密码，直接集成用户和密码
  	git clone https://用户名:密码@gitee.com/wupeiqi/xxxxx.git
  
  基于秘钥：	
  	>>>ssh-keygen -t rsa
  	>>>cat ~/.ssh/id_rsa.pub
  	>>>拷贝公钥到代码仓库
  	>>>git clone git@gitee.com:wupeiqi/xxxxx.git
  ```

## mysql

### 安装

由于mysql开源协议问题，实际服务器上应该使用- MariaDB

- 服务器部署时候会使用到的命令

  1. 检查mysql服务器

     systemctl status mysqld

  2. 若不存在， 启动

     ​	systemctl start mysqld  # 或者 mysql.service

- 安装

  ````cmd
  sudo yum install mariadb-server
  
  sudo systemctl start mariadb
  sudo systemctl enable mariadb
  ````

  - 这个脚本将引导你完成设置root密码、移除匿名用户、禁止root远程登录、删除测试数据库等操作。

    ```cmd
    sudo mysql_secure_installation
    ```

  - cmd

    ```cmd
    mysql -u root -p
    ```

  

### 启动

````js
sudo systemctl start mariadb

# 查看状态
sudo systemctl status mariadb
````

### 设置权限

执行 mysql -u root -p 后！

```cmd
-- 查看所有用户及其权限
SELECT User, Host FROM mysql.user;

-- 创建新用户（如果需要）
CREATE USER 'your_app_user'@'localhost' IDENTIFIED BY 'your_password';

-- 授予权限给新用户
GRANT ALL PRIVILEGES ON your_database.* TO 'your_app_user'@'localhost';

-- 刷新权限使更改生效
FLUSH PRIVILEGES;
```

例如

````cmd
CREATE USER 'huangpeng'@'localhost' IDENTIFIED BY 'your_passwordyour_password';
GRANT ALL PRIVILEGES ON your_database.* TO 'huangpeng'@'localhost';
FLUSH PRIVILEGES;
````

### 本地mysql连接远端mysql

## Python3

- 安装gcc，用于后续安装Python时编译源码。

  ```python
  yum install gcc -y
  ```

- 安装Python3相关依赖

  ```
  yum install zlib zlib-devel -y
  yum install bzip2 bzip2-devel  -y
  yum install ncurses ncurses-devel  -y
  yum install readline readline-devel  -y
  yum install openssl openssl-devel  -y
  yum install xz lzma xz-devel  -y
  yum install sqlite sqlite-devel  -y
  yum install gdbm gdbm-devel  -y
  yum install tk tk-devel  -y
  yum install mysql-devel -y
  yum install python-devel -y
  yum install libffi-devel -y
  ```

- 下载Python源码，https://www.python.org/ftp/python/

  ```
  cd /data/
  wget https://www.python.org/ftp/python/3.9.5/Python-3.9.5.tgz
  ```

  注意：如果没有wget，则先安装 `yum install wget -y`

  https://mirrors.aliyun.com/python-release/source/Python-3.9.5.tgz

- 编译安装

  - 解压

    ```
    tar -xvf Python-3.9.5.tgz
    ```

  - 进入目录并编译安装

    ```
    cd Python-3.9.5
    ./configure
    make all
    make install
    ```

  - 测试

    ```python
    python3 --version
    
    # 进入了python环境的编辑器当中
    /usr/local/bin/python3
    
    
    ```
  
  /usr/local/bin/pip3
    /usr/local/bin/pip3.9
  ```
  
  - 配置豆瓣源（腾讯云服务器，默认腾讯源）
  
  ```
    pip3.9 config set global.index-url https://pypi.douban.com/simple/
  
    ```
  
    ```



## 虚拟环境

- 安装虚拟环境

  ```
  pip3.9 install virtualenv
  ```

- 创建虚拟环境目录并创建虚拟环境

  ```
  mkdir /envs
  virtualenv /envs/nb --python=python3.9
  ```

- 安装项目依赖的pip包

  ```
  source /envs/nb/bin/activate
  pip install flask
  pip install pymysql
  pip install dbutils
  ```
  
  ```
  cd /data/项目目录/
  pip install -r requirements.txt
  ```

- 退出nb环境

  ```
  deactivate
  ```

## uwsgi

### 一些基本操作

- 查看你已经创建的日志

  ```js
  tail -f /var/log/uwsgi/uwsgi.log
  ```
  
  
  
- 重启

  ```cmd
  sudo systemctl restart uwsgi
  ```
  
  

激活虚拟环境并安装uwsgi

```
source /envs/nb/bin/activate

pip install uwsgi
```

基于uwsgi运行项目

- 命令参数 （不推荐）

  ```
  uwsgi --http :80 --wsgi-file app.py  --callable app
  ```

- 文件参数（推荐）

  - 创建 nb_uwsgi.ini

    ```ini
    [uwsgi]
    http = 127.0.0.1:8001
    chdir = /home/lighthouse/falsk-backend
    wsgi-file = app.py
    callable = app
    processes = 1
    threads = 2
    virtualenv = /envs/nb/
  
    # 日志设置
  logto = /var/log/uwsgi/uwsgi.log
    log-level = info
    log-reopen = true
    log-maxsize = 10000000
    
    # 查看错误日记 tail -f /var/log/uwsgi/uwsgi.log
    ```
  
  - 执行命令
  
    ```
    source /envs/nb/bin/activate
    uwsgi --ini  nb_uwsgi.ini
    ```
  
  - 关闭已经运行的
  
    ```linux
    ps -ef | grep nb_uwsgi
    
        kill -9 xxxx
    ```
  
  - 创建日志
  
    ```cmd
    创建日志目录并赋予适当的权限
    确保日志文件所在的目录存在，并且uWSGI有足够的权限在此目录下创建和写入日志文件。例如，如果选择将日志文件存储在/var/log/uwsgi/目录下，可以执行以下命令来创建目录并设置正确的权限：
    
    bash
    深色版本
    sudo mkdir -p /var/log/uwsgi
    sudo chown lighthouse:lighthouse /var/log/uwsgi  # 假设'uWSGI'以'lighthouse'用户身份运行
    sudo chmod 755 /var/log/uwsgi
    
    ```
  ```
    
  ```

### ⭐ 使用 `systemd` 管理 uwsgi

要使用`systemd`来管理uwsgi服务，你需要创建一个uwsgi的服务单元文件（service unit file）。以下是具体步骤：

创建 uwsgi 服务单元文件

```bash
sudo vi /etc/systemd/system/uwsgi.service
```

在文件中添加如下内容（根据你的实际情况调整路径和参数）：

```ini
[Unit]
Description=uWSGI instance to serve flask-backend
After=network.target

[Service]
User=lighthouse
Group=lighthouse
WorkingDirectory=/home/lighthouse/falsk-backend

# 设置环境变量
Environment="PATH=/envs/nb/bin"

# 启动 uWSGI
ExecStart=/envs/nb/bin/uwsgi --ini /home/lighthouse/falsk-backend/nb_uwsgi.ini

Restart=on-failure
RestartSec=10
StartLimitInterval=60s
StartLimitBurst=5

[Install]
WantedBy=multi-user.target
```

配置以后要重新

```cmd
sudo systemctl daemon-reload

sudo systemctl restart uwsgi
```



### 启动 uwsgi 服务

现在你可以像其他systemd管理的服务一样启动uwsgi服务：

```bash
sudo systemctl start uwsgi
```

检查uwsgi服务的状态以确保它正在运行：

```bash
sudo systemctl status uwsgi
```

设置开机自启

如果你想让uwsgi服务随系统启动而自动启动，可以启用开机自启：

```bash
sudo systemctl enable uwsgi
```

### 停止或重启 uwsgi 服务

当你需要停止或重启uwsgi服务时，可以使用以下命令：

- **停止服务**：
  ```bash
  sudo systemctl stop uwsgi
  ```

- **重启服务**：
  ```bash
  sudo systemctl restart uwsgi
  ```

### 服务常见问题

1. [Service]执行用户是否存在？

   ````cmd
   id lighthouse
   ````

2. 目标用户是否给与执行的权限

   - 调整项目目录权限：

     bash深色版本

     ```
     sudo chown -R lighthouse:lighthouse /home/lighthouse/falsk-backend
     sudo chmod -R 755 /home/lighthouse/falsk-backend
     ```

   - 确认uwsgi可执行文件路径及其权限：

     bash深色版本

     ```
     ls -l /envs/nb/bin/uwsgi
     ```

3. uwsgi尝试写入日志文件时遇到权限拒绝错误(`Permission denied`)。

   - 创建并设置日志目录权限：

     bash深色版本

     ```
     sudo mkdir -p /home/lighthouse/falsk-backend/logs
     sudo chown -R lighthouse:lighthouse /home/lighthouse/falsk-backend/logs
     sudo chmod -R 755 /home/lighthouse/falsk-backend/logs
     ```

## nginx

- 重启

  sudo systemctl restart nginx

- 检查报错

  ```
  tail -f /var/log/nginx/error.log
  ```

- 注

  ngnix配置文件（第一行处）

  总不会给那么高的权限的 所以你应该给与我们的要访问的文件夹普通权限来访问。

  ```cmd
  sudo chmod -R 755 /home/lighthouse/blog-next
  
  sudo chmod o+x /home
  sudo chmod o+x /home/lighthouse
  ```
  
  

利用nginx做反向代理和处理静态文件。

```
yum install nginx -y
```

 OpenCloudOS 9.2 上，推荐使用 dnf 包管理器来安装软件包。

```cmd
cat /etc/yum.conf | grep exclude

sudo vim /etc/yum.conf # 以vim编辑器为例
```



修改nginx.conf配置文件： `/etc/nginx/nginx.conf`

````cmd
cd /etc/nginx/

vim ngnix.conf

进入 i 模式

esc

:wq
````



接下来就需要启动uwsgi和nginx：

- nginx

  ```
  # 启动
  systemctl start nginx
  systemctl stop nginx
  
  # 开机启动
  systemctl enable nginx
  ```

- 脚本

  ```
  ./reboot.sh
  ./stop.sh
  ```
  
  

每次启动都比较麻烦，怎么办？



## shell脚本

### reboot.sh

```bash
#!/usr/bin/env bash

echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

ps -ef|grep nb_uwsgi.ini | grep -v grep

sleep 0.5

echo -e '\n--------------------going to close--------------------'

ps -ef |grep nb_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

sleep 0.5

echo -e '\n----------check if the kill action is correct----------'

/envs/nb/bin/uwsgi  --ini nb_uwsgi.ini &  >/dev/null

echo -e '\n\033[42;1m----------------------started...----------------------\033[0m'
sleep 1

ps -ef |grep nb_uwsgi.ini | grep -v grep
```

```
chmod 755 reboot.sh
./reboot.sh
```

### stop.sh

```bash
#!/usr/bin/env bash

echo -e "\033[34m--------------------wsgi process--------------------\033[0m"

ps -ef |grep nb_uwsgi.ini | grep -v grep

sleep 0.5

echo -e '\n--------------------going to close--------------------'

ps -ef |grep nb_uwsgi.ini | grep -v grep | awk '{print $2}' | xargs kill -9

sleep 0.5
```



## 4.8 域名和解析

### 4.8.1 购买域名

![image-20220322121538743](assets/image-20220322121538743.png)



### 4.8.2 解析

就是让域名和我们刚才买的服务器绑定，以后通过域名就可以找到那台服务器，不需要再使用IP了。

![image-20220322121751891](assets/image-20220322121751891.png)

![image-20220322121906853](assets/image-20220322121906853.png)

![image-20220322122037913](assets/image-20220322122037913.png)



解析成功后，基于域名就可以访问了。

![image-20220322124717829](assets/image-20220322124717829.png)



注意：域名需要备案后才能使用。





## redis

1. 使用修改systemd服务配置 或许是更好的选择
2. 

使用redis的原因:

查看radis日志

````bash
cat logfile /var/log/redis/redis.log
````



在远端服务器上测试： redis-cli -h 1.13.189.249 -p 7080 ping



redis-cli -h 1.13.189.249 -p 7080 -a '这是你的密码 '



基本排除了所有的原因，看起来就像是密码没有输对导致的错误，但是我又很肯定密码是正确的



继续定位原因：

https://tongyi.aliyun.com/?sessionId=900be78b980b40458b9dba7fefc5bc01

https://tongyi.aliyun.com/?sessionId=3e1a404d805b4b23b73ff4f4e8206c4c



其实对于我这种小体量的博客来说，本来是不需要做这类处理的。不过由于涉及到了验证码，故需要使用redis来满足这个需求。其实我觉得存数据库也可以，每次数据达到1000条的时候删除所有之前的验证码缓存即可，不过这样确实很蠢。

1. 执行`dnf update`或`yum update`命令的主要目的是确保您的系统上所有已安装的软件包都是最新的，这包括安全补丁和错误修复。这样做有几个好处：

   - **安全性**：更新软件包可以修补已知的安全漏洞，保护您的系统免受潜在威胁。
   - **兼容性**：确保您安装的新软件（如Redis）与系统上的其他组件兼容。
   - **稳定性**：通过应用最新的补丁来提高系统的稳定性和性能。

   ```bash
   sudo dnf update 
   ```

2. 安装EPEL仓库 (不一定必要的，腾讯云就不需要)

   ```bash
   sudo dnf install epel-release  # 对于dnf
   ```

   

   EPEL（Extra Packages for Enterprise Linux）是一个由Fedora项目维护的免费软件库，它为RHEL及其衍生产品（如CentOS、AlmaLinux、Rocky Linux等）提供了额外的企业级开源软件包。并不是所有的第三方软件都包含在标准的软件仓库中，Redis就是一个例子，尤其是在一些较旧的或默认配置的Red Hat系列Linux发行版中可能不会直接提供Redis。

   - 通过启用EPEL仓库，您可以更方便地使用`dnf`或`yum`命令安装像Redis这样的软件，而不需要手动下载和编译源代码。
   - **访问更多软件包**：EPEL提供了大量的附加软件包，这些软件包不在官方的标准仓库中。对于许多开发者和管理员来说，这是获得所需工具的一个重要资源。

3. 安装Redis服务器, 并且启动

   `````bash
   sudo dnf install redis-server
   
   # 启动 
   sudo systemctl start redis
   # 设置开启自启动
   sudo systemctl enable redis
   `````

4. 需要配置服务器防护墙 

   bash深色版本

   ```
   sudo firewall-cmd --zone=public --add-port=6379/tcp --permanent
   sudo firewall-cmd --reload
   ```

5. 





## 扩展

- git相关

  ```
  https://www.bilibili.com/video/BV19E411f76x/
  ```

- https部署

  - 阿里云免费申请证书（1年）
  - 上传到服务器 + nginx修改配置
  - 重启nginx






























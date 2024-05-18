配置命令
```sh
npm i install -no-fund
npm install @vicons/ionicons5
npm install chart.js
npm install axios
```
运行项目

backend，连接好数据库后
```sh
python manage.py runserver 8001
```
frontend
```sh
npm run dev
```

打包项目
```sh
npm run build
```

运行可能遇到报错Permission denied（没有权限）解决方法，按以下步骤:
```sh
chmod 777 node_modules/.bin/vue-cli-service
npm run build
```

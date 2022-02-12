## 微前端

### 1.什么是微前端？

微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f83e9fa81c3481fab5f578a353bfbd1~tplv-k3u1fbpfcp-watermark.awebp)

### 2.微前端有什么优缺点？

###### 优点

1. 独立开发和部署。
2. 降低代码耦合。
3. 大型单页应用无线扩展。
4. 不限技术栈
5. 快速整合业务
6. 多团队协作

###### 缺点

1. 体验有折损
2. 维护成本高
3. 管理版本复杂、依赖复杂
4. 开发体验不太友好
5. 粒度不宜太细

### 3.微前端常见的实现方式

#### 1.iframe

```js
<html>
  <head>
    <title>微前端</title>
  </head>
  <body>
    <h1>我是容器</h1>
    <iframe id="mfeLoader"></iframe>
    <script type="text/javascript">
      const routes = {
        '/': 'https://app.com/index.html',
        '/app1': 'https://app1.com/index.html',
        '/app2': 'https://app2.com/index.html',
      };

      const iframe = document.querySelector('#mfeLoader');
      iframe.src = routes[window.location.pathname];
    </script>
  </body>
</html>

```

###### 优点

- 实现简单
- 天然具备隔离性

###### 缺点

- 主页面和iframe共享最大允许的http链接数
- iframe阻塞主页面加载
- 浏览器的后退按钮无效

#### 2.服务端模板组合

![image-20211215141327262](C:\Users\深圳拓保\AppData\Roaming\Typora\typora-user-images\image-20211215141327262.png)

容器模板

```html
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>微前端-服务端模板</title>
  </head>
  <body>
    <h1>容器应用</h1>
    <!--# include file="$PAGE.html" -->
  </body>
</html>

```

通过Nginx服务器根据url路径动态设置要加载的模块：

```nginx
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;
    ssi on;

    rewrite ^/$ http://localhost:8080/app redirect;

    location /app {
      set $PAGE 'app';
    }
    location /app1 {
      set $PAGE 'app1';
    }
    location /app2 {
      set $PAGE 'app2';
    }

    error_page 404 /index.html;
}

```

###### 优点

- 实现简单
- 技术栈独立

###### 缺点

- 需要额外配置Nginx
- 前后端分离不彻底

#### 3.微前端框架single-spa

- Single-SPA single-spa 是一个用于前端微服务化的 JavaScript 前端解决方案 (本身没有处理样式隔离， js 执行隔离) 实现了路由劫持和应用加载

#### 4.qiankun

qiankun 是一个基于 [single-spa](https://github.com/CanopyTax/single-spa) 的[微前端](https://micro-frontends.org/)实现库，旨在帮助大家能更简单、无痛的构建一个生产可用微前端架构系统。

#### 特性

- 📦 **基于 [single-spa](https://github.com/CanopyTax/single-spa)** 封装，提供了更加开箱即用的 API。
- 📱 **技术栈无关**，任意技术栈的应用均可 使用/接入，不论是 React/Vue/Angular/JQuery 还是其他等框架。
- 💪 **HTML Entry 接入方式**，让你接入微应用像使用 iframe 一样简单。
- 🛡 **样式隔离**，确保微应用之间样式互相不干扰。
- 🧳 **JS 沙箱**，确保微应用之间 全局变量/事件 不冲突。
- ⚡️ **资源预加载**，在浏览器空闲时间预加载未打开的微应用资源，加速微应用打开速度。
- 🔌 **umi 插件**，提供了 [@umijs/plugin-qiankun](https://github.com/umijs/plugins/tree/master/packages/plugin-qiankun) 供 umi 应用一键切换成微前端架构系统。

### 5.从0到1搭建一个qiankun微前端项目

我们使用 react 的脚手架创建一个项目，此项目将作为基座

```shell
npx create-react-app qiankun-base
```

使用 `npm` 或者是 `yarn` 来安装一下 qiankun，对于包管理工具各位**自己选择自己喜欢的一个即可**。本文就直接使用 `yarn` 了

```shell
yarn add qiankun
```

一个子应用想在基座中展示，需要在基座中进行注册。注册子应用需要使用 qiankun 提供的方法 `registerMicroApps` ，注册之后还需要调用 `start` 方法进行启动。

```javascript
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue',
  },
]);

// 启动 qiankun
start();
```

在 react 项目中使用 qiankun 只需将以上代码复制粘贴到 `index.js` 中即可

```react
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue',
  },
  {
    name: 'reactApp',
    entry: '//localhost:4000',
    container: '#container',
    activeRule: '/app-react',
  },
]);

// 启动 qiankun
start();

ReactDOM.render(
  <React.StrictMode>
  <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
```

为了更接近在实际中后台项目中的使用情况，我在此处引入 [antDesign](https://link.juejin.cn/?target=https%3A%2F%2Fant.design%2Fcomponents%2Flayout-cn%2F%23components-layout-demo-side) 使用它的 `layout` 组件搭建一个中后台的基本样子。老规矩我们先安装一下 `antDesign`

```shell
yarn add antd
```

然后在 `index.js` 中导入 `antDesign` 的样式即可

```
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
```

接下来我们需要改造一下 `App.js`，此处我直接贴一下代码，因为只需要将 `antDesign` 文档的内容复制过来加以改动即可，无需多言

```react
import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Vue应用
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            React应用
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          <div id="container" className="site-layout-background" style={{ minHeight: 360 }}></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>This Project ©2021 Created by DiDi</Footer>
      </Layout>
    </Layout>
  );
}

export default App;

// 别忘了在index.css或app.css中添加如下样式

#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}


```

qiankun 是通过路由的变化来匹配微应用的，所以在基座中我们还应该加上路由，在 react 中，即 `react-router-dom` 。

```shell
yarn add react-router-dom
```

安装完成之后，只需要在 `App.js` 中引入 `Link` 组件，然后将侧边栏的文字替换成 `Link` 即可

```shell
import { Link } from 'react-router-dom'
```

```react
<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
  <Menu.Item key="1" icon={<PieChartOutlined />}>
    <Link to="/app-vue">Vue应用</Link>
  </Menu.Item>
  <Menu.Item key="2" icon={<DesktopOutlined />}>
    <Link to="/app-react">React应用</Link>
  </Menu.Item>
</Menu>

```

### 创建子应用

分别使用两个主流的前端框架 `react` 和 `vue` 来创建子应用，在子应用中要做的事情其实很简单，只需要导出子应用的生命周期即可，**注意此处的生命周期并非指的是框架的生命周期**。而是由 qiankun 规定的三种生命周期，分别是：`bootstrap`、`mount`、 `unmount`。以下引用文档的描述

```javascript
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {

}


/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {

}


/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {

}


/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {

}

```

#### vue

首先使用脚手架创建一个 `vue2.x` 的项目，不再赘述详细内容

```shell
vue create vue-app1
```

然后修改 `main.js`，导出三个生命周期，并修改运行时 `publicPath`，[什么是运行时的 publicPath ？](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fguides%2Fpublic-path%2F%23on-the-fly) 简单的理解就是，这个变量可以指定微应用资源加载的基础路径。整体代码如下：

```vue
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

// 文档中将此代码单独放到了一个文件中，此处是直接写在了 main.js 中，两种都可。但是 eslint-disable 需要加上
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

let instance = null;
function render(props = {}) {
  const { container } = props;
  // 文档中使用store，此处没有便删除了。
  // 文档中的router对象是在此处创建的，但是在router文件夹的index.js中已经创建好了，所以稍加改造直接导入就好，下方贴了代码
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时 直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

export async function mount(props) {
  console.log("[vue] props from main framework", props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
}

```

**router配置**

为什么这要加一个 router 配置，上面的代码注释中有过解释，没有看到的小伙伴可以去瞄一眼。可以和文档进行一个对比

```vue
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
];

const router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? "/app-vue/" : "/",
  mode: "history",
  routes,
});

export default router;

```

修改 `webpack` 的配置，添加 `vue.config.js` 文件，添加以下内容即可。主要做了两件事，一是运行跨域，二是将微应用打包成一个 `library`

```vue
const { name } = require("./package");
module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      library: `${name}-[name]`,
      libraryTarget: "umd", // 把微应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
```

#### react子应用

创建一个 `react` 子应用，并安装 `react-router-dom`

```shell
npx create-react-app react-app2
yarn install react-router-dom
```

然后修改 `index.js`，此处文档有坑，即在使用 `react-router-dom` 的时候应该将 `BrowserRouter` 包在 `App` 组件的外层。具体代码如下

```react
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';
import './public-path';

function render(props) {
  const { container } = props;
  ReactDOM.render(
    <React.StrictMode>
      <Router basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
        <App />
      </Router>
    </React.StrictMode>,
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
```

添加端口配置

在项目创建完成后，我们在根目录下添加 `.env` 文件，设置项目监听的端口，代码实现如下：

```js
# react-app2/.env
PORT=3001
BROWSER=none
```

 `publicPath` 的配置

注意：react最新的脚手架拉取的是react17+webpack5具体配置与官网稍有不同

具体代码如下

```react
//react-app2/src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

##### 配置 `webpack`

配置 `webpack`，使 `index.js` 导出的生命周期钩子函数可以被 `qiankun` 识别获取。

我们需要借助 `react-app-rewired` 来帮助我们修改 `webpack` 的配置，我们直接安装该插件：

```shell
yarn add react-app-rewired -D
```

在 `react-app-rewired` 安装完成后，我们还需要修改 `package.json` 的 `scripts` 选项，修改为由 `react-app-rewired` 启动应用，就像下面这样

```json
// react-app2/package.json

//...
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-app-rewired eject"
}

```

在 `react-app-rewired` 配置完成后，我们新建 `config-overrides.js` 文件来配置 `webpack`，代码实现如下：

```javascript
const path = require("path");

module.exports = {
  webpack: (config) => {
    // 微应用的包名，这里与主应用中注册的微应用名称一致
    config.output.library = `ReactMicroApp`;
    // 将你的 library 暴露为所有的模块定义下都可运行的方式
    config.output.libraryTarget = "umd";
    // 按需加载相关，设置为 webpackJsonp_ReactMicroApp 即可
    config.output.chunkLoadingGlobal = `webpackJsonp_ReactMicroApp`;

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
    //   // 关闭主机检查，使微应用可以被 fetch
    //   config.disableHostCheck = true;
      // 配置跨域请求头，解决开发环境的跨域问题
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      // 配置 history 模式
      config.historyApiFallback = true;

      return config;
    };
  },
};
```


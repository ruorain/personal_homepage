# 个人静态主页模板

一个**零依赖、零构建**的个人主页模板。没有框架、没有 npm、不引用任何外部 CDN 或在线字体，
把文件丢到服务器上就能跑。

适合：个人名片页、作品集、简历页。

## 特性

| 特性 | 说明 |
|---|---|
| 自动深色模式 | 跟随系统设置，无需开关 |
| 响应式布局 | 手机 / 平板 / 电脑自适应 |
| 零外部依赖 | 没有任何第三方请求，国内加载不卡 |
| 微信联系方式 | 电脑端鼠标悬停弹二维码，手机端点按钮复制 |
| 联系方式防采集 | 邮箱/微信号不以明文写进 HTML，点击后才由 JS 解码 |
| 访问信息栏 | 显示访客 IP、北京时间、设备类型、操作系统 |
| 蜜罐 404 页 | 访问 `/admin`、`/.env` 等 60+ 种探测路径时显示"抓到你了"彩蛋 |
| 安全响应头 | 由 `_headers` 提供（仅 Cloudflare Pages 有效） |

## 文件结构

```
.
├── index.html            主页面
├── style.css             全部样式（含深色模式、响应式）
├── 404.html              自定义 404 页 + 蜜罐彩蛋
├── favicon.png           站点图标 180×180（iOS 添加到主屏也用这个）
├── favicon-32.png        浏览器标签页图标 32×32
├── functions/
│   └── api/geo.js        Cloudflare Pages Function，返回访客地理位置
├── robots.txt            搜索引擎抓取规则
├── _headers              Cloudflare Pages 专用：安全响应头
├── .gitattributes        统一换行符为 LF
└── .gitignore
```

## 快速开始

### 1. 改成本人的内容

打开 `index.html`，搜索并替换：

| 搜索 | 说明 |
|---|---|
| `你的名字` | 出现多处（标题、导航、首屏、页脚、meta 标签） |
| `全栈开发者 / 开源爱好者 / 在读学生` | 首屏的一句话自我介绍 |
| 关于我、项目名称一/二、技能标签 | 页面主体内容 |
| `你的用户名/你的仓库` | 在 `404.html` 的蜜罐彩蛋页里，指向你的公开源码仓库；不想公开就把整句话删掉 |

改完**直接双击 `index.html`** 就能在浏览器里预览。

### 2. 换掉图标

`favicon.png`（180×180）和 `favicon-32.png`（32×32）现在是通用占位图标，
换成你自己的正方形图片即可。

### 3. 设置联系方式

联系方式**不以明文写在 HTML 里**，而是以 base64 存在 `index.html` 底部的
`CONTACT_B64` 对象中，点击按钮时才解码填充。这样能挡住
「正则扫一遍 HTML 就完事」的那类邮箱采集器。

```js
const CONTACT_B64 = {
  email:  'eW91QGV4YW1wbGUuY29t',    // you@example.com
  github: 'eW91cm5hbWU=',            // yourname
  wechat: 'eW91cl93ZWNoYXRfaWQ='     // your_wechat_id
};
```

**怎么换成自己的**：浏览器按 `F12` 打开控制台，执行：

```js
btoa('你的邮箱')      // 例如 btoa('me@example.com')
```

把输出的字符串替换到对应字段。

> **注意**：base64 是**编码**不是**加密**，任何人都能还原。
> 它挡的是批量扫描源码的采集器，**挡不住能执行 JS 的定向爬虫**。
> 如果联系方式需要绝对保密，请改用留言表单。

### 4. 微信二维码（可选）

把二维码图片放到根目录，命名 `wechat-qr.png`。

微信里获取：**我 → 点自己头像 → 二维码名片 → 右上角 `...` → 保存图片**。

> 用**个人名片二维码**（长期有效），别用群二维码（7 天就失效）。
>
> **还没放这张图也不会出错**：页面检测到图片加载失败会自动降级，
> 电脑端也显示复制按钮，不会出现空白框。
>
> 不想公开二维码的话，可以不提交这个文件（`.gitignore` 里已备好注释行）。

## 部署到 Cloudflare Pages

推荐方式，免费、无需备案、推送即自动部署。

1. 把代码推送到 GitHub 仓库
2. 打开 <https://dash.cloudflare.com/> → **Workers & Pages → Create → Pages → Connect to Git**
3. 选中你的仓库，构建配置这样填：

   | 选项 | 值 |
   |---|---|
   | Framework preset | **None** |
   | Build command | **留空** |
   | Build output directory | **`/`** |

4. **Save and Deploy**

约 1 分钟后拿到 `https://你的项目名.pages.dev`。

之后每次 `git push`，Cloudflare 会自动重新部署。

> **不需要 ICP 备案** —— Cloudflare 的服务器在境外。
> 但也因此，国内访问速度取决于 Cloudflare 线路，能稳定打开但不一定快。

### 其它托管方式

纯静态站点可以放在任何地方：GitHub Pages、Vercel、Netlify、对象存储（OSS/COS）等。

但注意两点：

- `_headers` 只有 Cloudflare Pages 认识，换平台后安全响应头会失效
- `functions/api/geo.js` 是 Cloudflare Pages Functions 专有格式，
  换平台后**访问信息栏会降级**（退回 `/cdn-cgi/trace` 或显示"获取失败"），页面不会报错

## 关于访问信息栏

页面底部会显示访客自己的 IP、北京时间、设备类型和操作系统。

- **IP 和归属地**：走 Cloudflare 的同源接口
  - `/api/geo`（本仓库的 Function）能拿到**城市级**归属、经纬度、运营商
  - 拿不到时降级到 `/cdn-cgi/trace`（只有国家级）
  - 全程**不调用任何第三方接口**，访客信息不会泄露给别人
- **北京时间**：用 Cloudflare 边缘节点的时间戳校正本机时钟，
  所以访客电脑时间设错了，显示也是准的

**不想要这一栏**：删掉 `index.html` 里 `id="visitor"` 那个 `<section>` 即可，
再把 `<script>` 里对应的那段 IIFE 删掉。

## 关于 404 蜜罐彩蛋

`404.html` 会在页面加载时判断当前路径像不像扫描器探测
（`/admin`、`/wp-login.php`、`/.env`、`/phpmyadmin`、`*.php` 等 60 多种模式）。

命中就显示一个"抓到你了"的彩蛋页，把探测者自己的 IP 归属地、运营商、设备指纹亮出来；
没命中就是普通的 404 页面。

路径匹配规则在 `404.html` 里的 `PROBE` 正则，可以自由增删。

**不喜欢这个彩蛋**：把 `404.html` 里 `(function () { ... })();` 那一整段删掉，
就变回普通 404。

## 自定义配色

`style.css` 顶部集中定义了所有颜色变量，改几个值全站跟着变：

```css
:root {
  --bg: #ffffff;        /* 背景 */
  --fg: #16181d;        /* 正文 */
  --muted: #5c6370;     /* 次要文字 */
  --line: #e6e8ec;      /* 分隔线 */
  --accent: #2563eb;    /* 主色 */
  --radius: 16px;       /* 圆角 */
  /* ... */
}

@media (prefers-color-scheme: dark) {
  :root { /* 深色模式的对应值 */ }
}
```

## 注意事项

- **别给 CSS/JS 设长缓存**。HTML 和 CSS 是两个独立请求，
  缓存时长不同会造成「新 HTML + 旧 CSS」的版本错位，
  表现为部分浏览器排版全乱。用平台默认的
  `max-age=0, must-revalidate` 配合 ETag 就是最优解。
- **前端源码是公开的**，不要把任何密钥写进代码。
- **改完 `style.css` 记得清缓存或改文件名**，否则访客可能看到旧样式。

## 许可

随意使用、修改、分发。

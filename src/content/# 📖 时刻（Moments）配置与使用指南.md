# 📖 相簿动态（Moments）配置与使用指南

本相簿模块支持 **时间轴智能倒序排序**、**年月筛选**、**多图片网格展示**、**前端点赞/评论互动**、**可选位置定位** 以及 **Lightbox 大图 EXIF 参数自动解码**。

---

## 📂 文件与目录结构

请将动态 Markdown 文件与本地图片分别存放于以下位置：

```text
my-astro-project/
├── public/
│   └── moments/                # 🟢 存放相簿本地图片的目录
│       └── 2026/
│           ├── 0101-1.webp
│           └── 0101-2.webp
└── src/
    └── content/
        └── moments/            # 🟢 存放朋友圈动态 .md / .mdx 文件的目录
            ├── 2026-01-01-new-year.md
            └── 2026-02-14-valentine.md

```

---

## 📝 Frontmatter 字段全解表

在 `.md` 文件的顶部，通过 `---` 包裹的内容（Frontmatter）进行基础信息配置：

| 字段名称 | 类型 | 是否必填 | 示例/说明 |
| --- | --- | --- | --- |
| `title` | `String` | **是** | 动态主标题，如 `"🥂 2026, A new chapter begins"` |
| `subtitle` | `String` | **是** | 动态副标题 / 金句短句 |
| `time` | `String` | **是** | 完整时间文本，如 `"2026年01月01日 12:00"` 或 `"2026-01-01"` |
| `day` | `String` | **是** | 时间轴显示的日数字，如 `"1"` 或 `"01"` |
| `month` | `String` | *可选* | 月份，如 `"1月"` 或 `"01"`（未填时系统从 `time` 中自动提取） |
| `year` | `String` | *可选* | 年份，如 `"2026"`（未填时系统从 `time` 中自动提取） |
| `location` | `String` | *可选* | 定位信息，如 `"中国 · 香港"`（不填则不显示定位标签） |
| `thumbnail` | `String` | **是** | 左侧时间轴列表中显示的圆角缩略图路径 |
| `images` | `Array` | **是** | 右侧动态卡片中的图片列表（支持 1~9 张） |
| `likes` | `Array` | *可选* | 点赞初始昵称列表 |
| `comments` | `Array` | *可选* | 评论列表（包含 `user` 与 `text` 字段） |

---

## 🖼️ 图片引用的三种方式

相簿系统兼容以下三种不同的图片来源格式，可混合使用：

### 1. 本地存储 URL（最推荐）

存放在 `public/moments/` 目录下，引用时忽略 `public`，以 `/` 开头：

```yaml
thumbnail: "/moments/2026/0101-1.webp"
images:
  - "/moments/2026/0101-1.webp"
  - "/moments/2026/0101-2.webp"

```

### 2. 网络外链图片 URL

直接填写完整的 HTTP / HTTPS 链接（图床或外部资源）：

```yaml
images:
  - "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"

```

### 3. Base64 嵌入格式

可以直接嵌入 Base64 编码图片。**注意：在 YAML 中请务必使用双引号包裹！**

```yaml
images:
  - "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjUyNTI1Ii8+PC9zdmc+"

```

---

## 📄 标准动态模板范例

创建一个 `.md` 文件（如 `src/content/moments/2026-01-01-demo.md`），复制以下范例即可快速建立一条完整动态：

```markdown
---
title: "🥂 2026, A new chapter begins"
subtitle: "时间每日流动 治愈万种心痛"
time: "2026年01月01日 12:00"
day: "1"
month: "1月"
year: "2026"
location: "中国 · 香港"
thumbnail: "/moments/2026/0101-1.webp"
images:
  - "/moments/2026/0101-1.webp"
  - "/moments/2026/0101-2.webp"
likes:
  - "星野"
  - "晨曦"
  - "木梓"
  - "沐风"
comments:
  - user: "星野"
    text: "新年快乐！新的一年万事顺遂！"
  - user: "晨曦"
    text: "照片氛围感拉满了！"
---

🥂 𝟐𝟎𝟐𝟔, 𝐀 𝐧𝐞𝐰 𝐜𝐡𝐚𝐩𝐭𝐞𝐫 𝐛𝐞𝐠𝐢𝐧𝐬.

直接在 Markdown 中输入 Enter 键换行即可，系统会自动转换渲染。
换行第二行：保持热爱，奔赴下一场山海。

```

---

## ✨ 交互亮点与内置功能

* **自动时间排序**：所有添加的 `.md` 动态不需要手动按日期排序，系统会自动解析 `time` 字段并**按最新时间倒序**呈现在左侧列表中。
* **正文自然换行**：在 Markdown 正文中直接按回车键（Enter）换行，前端页面会原汁原味地保留段落换行格式。
* **无刷新点赞互动**：
* **动态点赞**：点击时间行右侧的红心，会将你的昵称（“我”）无缝追加到点赞列表中并伴随动画。
* **评论点赞**：点击每条评论右侧的微型心形按钮，支持实时增减点赞数。


* **Lightbox 大图与 EXIF 显示**：
* 点击任意网格图片即可唤起全屏大图预览。
* 具备 **全自动 EXIF 解码**，自动提取照片的相机型号（如 `iPhone 15 Pro`）、焦段、光圈、快门速度与 ISO。
* 支持键盘快捷键：`Esc`（关闭大图）、`←` / `→`（左右切换照片）。



---

## ⚠️ 常见注意事项

1. **路径拼写检查**：请确保目录名为 `public/moments/`（中间字母为 **o**），请勿拼错为 `mements`。
2. **Base64 引号要求**：如果在 Frontmatter 中使用 Base64，一定要加上双引号（`"data:image/..."`），防止 YAML 内部的分号和冒号导致报错。
3. **图片体积建议**：为了获得最丝滑的打开速度和 GSAP 动画体验，建议本地图片转为 **.webp** 格式，单张体积控制在 **100KB–300KB**。
// src/config.ts

export const SITE_CONFIG = {
  title: "Sinyan Blog",
  logo: "Sinyan",
  subtitle: "⛰️ 不要紧，山野都有雾灯",
  logoIconPath:`<svg viewBox="0 0 24 24" fill="none" class="brand-icon" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 10L6 20H18L12 10Z" fill="currentColor"/>
           </svg>`,

// 🔴 全局主题色 (用于开屏小方块、光标等)
  themeColor: "#015EFB",
  
  // 底部左侧信息（高度定制化）
  bioHeader: "Hello, Here is Singyan",
  bioTitle: "在琐碎与热爱中记录每一个闪光的瞬间",
  bioDesc: "一个奔波在校园与自我探索之路上的大学生，热衷于用镜头去捕捉那些稍纵即逝的生活碎片，重新拼凑成属于我的、温暖且治愈的数字世界。",

  copyRight: "Sinyan Blog",
  redStar1: "光影记录 (Photography)",
  redStar2: "生活碎片 (Life Fragments)",
  redStar3: "思绪漫游 (Mind Wandering)",
};

export const NAVBAR_CONFIG = {
  // 顶部的搜索框提示和 4 个自定义标签页
  searchBox: "🔍 探索 Singyan Blog...",
  navItems: [
    { label: "Projects", url: "/projects" },
    { label: "2", url: "/2" },
    { label: "3", url: "/3" },
    { label: "相册", url: "/albums" },
    { label: "关于", url: "/about" }
  ]
};


export const EARTH_CONFIG = {
  // 地球初始对焦视角
  focusLocation: {
    name: "Zhaoqing",    // 初始对焦焦点名称
    latitude: 23.0515,   // 纬度 (正数为北纬，负数为南纬)
    longitude: 112.4651  // 经度 (正数为东经，负数为西经)
  },
  
  // 3D 渲染控制参数
  rendering: {
    starsCount: 58000,    // 背景繁星数量
    saturation: 0.88     // 地球和大气饱和度系数 (88%)
  }
};

searchData: [
    { type: 'Project', title: '国际营销案例分析', url: '/projects/marketing' },
    { type: 'Journal', title: '数字美学探索笔记', url: '/journal/aesthetics' },
    { type: 'Page', title: '关于 Sinyan', url: '/about' },
    { type: 'Project', title: '电商产品管理实践', url: '/projects/product' },
    { type: 'Journal', title: '法语学习打卡第一天', url: '/journal/french-1' }
  ]


  export const ALBUMS_CONFIG = {
    nav: "Albums",
    title: "🖼️  Singyan Albums",
    subtitle: "我的数字相册，捕捉生活中的微光与余热。",
    // 你的 Google Photos 分享链接
    googleSharedId: "Hj55uVT1gDPqYDu56",
};


// src/config.ts

export const ABOUT_CONFIG = {
  name: "Singyan",
  subtitle: "Sophomore · Class Monitor · Explorer",
  avatar: {
    // 替换成你的 Instagram 头像链接，或者本地图片路径如 "/avatar.jpg"
    src: "	https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-19/426757531_369055709168003_3674533028650657133_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2gEjYRxlwP2wat3zsgP_fFzDA4zswV07--DSF2c2gOqOKqE50qibkfqWxrHqS3fM-RA&_nc_ohc=xUsT-vRmgN0Q7kNvwFbkHq4&_nc_gid=cYU2I9kbcp89oNrzcz0Ciw&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AQBBmtau5MeGzZKbYnYF5FbBPH8Wlo8ZXwJnq-mM60O_Qg&oe=6A60252B&_nc_sid=8b3546", 
    alt: "Singyan Profile"
  },
  bio: [
    "你好，我是 Singyan。",
    "目前在广东广州，作为一名二年级学生，我在数字营销与投资逻辑中寻找平衡。我习惯捕捉生活中的微光，无论是那一抹法文的优雅，还是深夜关于市场波动（比如黄金）的冷思考。",
    "比起终点，我更在意在不同身份之间切换的节奏感。"
  ],
  interests: [
    { title: "Tech & Data", desc: "Google Pixel 的忠实信徒，关注移动生态与开源架构。喜欢用数据说话。" },
    { title: "Languages", desc: "Cantonese / Mandarin / English / French.<br>正在法语的语法森林里漫步。" },
    { title: "Investment", desc: "关注全球市场，以 HSBC Paper Gold 为锚点，尝试理解长期主义的逻辑。" },
    { title: "Life", desc: "Matcha & McFlurry.<br>生活不需要太多修饰，偶尔一点糖分就够了。" }
  ],
  socialLinks: [
    { 
      name: "Instagram", 
      url: "https://instagram.com/chenenyeeeee", 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>` 
    },
    { 
      name: "Email", 
      url: "mailto:", 
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>` 
    }
  ]
};


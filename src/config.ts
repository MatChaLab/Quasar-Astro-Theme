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
    { label: "About", url: "/about" }
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
    googleSharedId: "Hj55uVT1gDPqYDu560",
};
// src/components/services/GooglePhotosFetcher.ts
import { ALBUMS_CONFIG } from '../../config';

export interface PhotoData {
  index: number;
  id: string;
  mediaType: 'photo' | 'video';
  width: number | null;
  height: number | null;
  takenAt: string | null;
  thumbUrl: string;
  displayUrl: string;
  originalLikeUrl: string;
  videoUrl: string | null;
  fallbackThumbUrl?: string;
  fallbackDisplayUrl?: string;
}

export async function fetchAllPhotos(): Promise<{ photos: PhotoData[], errorMsg: string | null }> {
  const shortShareId = ALBUMS_CONFIG.googleSharedId;
  const shareUrl = `https://photos.app.goo.gl/${shortShareId}`;
  let allPhotos: PhotoData[] = [];
  let errorMsg: string | null = null;

  try {
    console.log(`\n📸 [抓取引擎] 开始拉取 Google Photos: ${shortShareId}`);
    const response = await fetch(shareUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      redirect: 'follow'
    });

    if (!response.ok) throw new Error(`HTTP ${response.status} - 访问受限`);

    const finalUrl = response.url;
    let realShareId = shortShareId;
    const idMatch = finalUrl.match(/share\/([^?]+)/);
    if (idMatch && idMatch[1]) {
      realShareId = idMatch[1];
      console.log(`🔗 [抓取引擎] 解析出真实相册长 ID: ${realShareId.substring(0, 15)}...`);
    }

    const html = await response.text();
    const matches = html.match(/AF_initDataCallback\(\s*\{\s*key:\s*'ds:\d+'[\s\S]*?data:\s*([\s\S]*?)\}\s*\);/g);
    let nextPageToken: string | null = null;

    if (matches) {
      for (const match of matches) {
        if (match.includes('https://lh3.googleusercontent.com/')) {
          const dataBlockMatch = match.match(/data:\s*([\s\S]*?)(?=\s*,\s*sideChannel|$)/);
          if (dataBlockMatch) {
            try {
              let dataStr = dataBlockMatch[1].trim();
              if (dataStr.endsWith(',')) dataStr = dataStr.slice(0, -1);
              const parsedData = new Function(`return ${dataStr};`)();

              const extracted = extractPhotosSafely(parsedData);
              if (extracted.length > 10) {
                allPhotos = extracted;
                nextPageToken = extractToken(parsedData);
                console.log(`✅ [抓取引擎] 初始解析成功，提取 ${allPhotos.length} 张`);
                break;
              }
            } catch (e) {
              // 继续寻找
            }
          }
        }
      }
    }

    // 分页处理
    if (nextPageToken) {
      let batchCount = 1;
      while (nextPageToken && batchCount <= 15) {
        console.log(`⏳ [抓取引擎] 正在拉取第 ${batchCount + 1} 页...`);

        // 🔴 终极修复 1：完全使用 JSON.stringify 构建 payload，避免手写转义崩溃
        const innerArgs = JSON.stringify([realShareId, nextPageToken]);
        const rpcReq = JSON.stringify([[["snz1pe", innerArgs, null, "generic"]]]);

        const batchRes = await fetch('https://photos.google.com/_/PhotosUi/data/batchexecute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          },
          body: new URLSearchParams({ 'f.req': rpcReq })
        });

        const batchText = await batchRes.text();
        
        if (batchText.trim().startsWith('<')) {
            console.warn(`⚠️ [抓取引擎] 第 ${batchCount + 1} 页被拒绝(HTML报错)，终止分页。`);
            break;
        }

        const jsonStartIndex = batchText.indexOf('[');
        if (jsonStartIndex === -1) {
            console.warn(`⚠️ [抓取引擎] 第 ${batchCount + 1} 页未找到 JSON 结构，终止分页。`);
            break;
        }
        const cleanJsonStr = batchText.substring(jsonStartIndex);

        try {
          const batchData = JSON.parse(cleanJsonStr);

          // 🔴 终极修复 2：无差别地毯式嗅探，只要字符串像目标数据，立刻抓取
          let innerDataStr: string | null = null;
          function sniffInnerJson(obj: any) {
             if (innerDataStr) return;
             if (Array.isArray(obj)) {
                 for (const el of obj) {
                     // 特征匹配：字符串格式、以 [ 开头、含有谷歌图片域名
                     if (typeof el === 'string' && el.startsWith('[') && el.includes('https://lh3.googleusercontent.com/')) {
                         innerDataStr = el;
                         return;
                     }
                     if (typeof el === 'object') sniffInnerJson(el);
                 }
             }
          }
          sniffInnerJson(batchData);

          if (!innerDataStr) {
             console.warn(`⚠️ [抓取引擎] 第 ${batchCount + 1} 页嗅探失败，没找到隐藏图片。`);
             break;
          }

          const innerData = JSON.parse(innerDataStr);
          const newPhotos = extractPhotosSafely(innerData);

          if (newPhotos.length === 0) break;

          const beforeCount = allPhotos.length;
          const seen = new Set(allPhotos.map(p => p.id));
          for (const p of newPhotos) {
             if (!seen.has(p.id)) {
                 allPhotos.push(p);
                 seen.add(p.id);
             }
          }

          const addedCount = allPhotos.length - beforeCount;
          nextPageToken = extractToken(innerData);
          console.log(`✅ [抓取引擎] 第 ${batchCount + 1} 页成功！(+${addedCount} 张)`);

          if (addedCount === 0) break;
          batchCount++;

        } catch (e: any) {
          console.warn(`⚠️ [抓取引擎] 第 ${batchCount + 1} 页 JSON 解析崩溃: ${e.message}`);
          break;
        }
      }
    }

    allPhotos.forEach((p, i) => { p.index = i; });
    console.log(`🎉 [抓取引擎] 完毕！有效相册去重总计: ${allPhotos.length} 张\n`);

  } catch (err: any) {
    errorMsg = err.message || "未知网络错误";
    console.error("❌ [抓取引擎] 致命错误:", err.message);
  }

  return { photos: allPhotos, errorMsg };
}

// ================= 核心解析器 =================
function extractPhotosSafely(arr: any[]): PhotoData[] {
  let result: PhotoData[] = [];
  const seen = new Set();
  function traverse(item: any) {
    if (!item || typeof item !== 'object') return;
    if (
      Array.isArray(item) && item.length >= 2 &&
      typeof item[0] === 'string' && item[0].length > 15 &&
      Array.isArray(item[1]) && typeof item[1][0] === 'string' &&
      item[1][0].startsWith('https://lh3.googleusercontent.com/')
    ) {
      const id = item[0];
      if (!seen.has(id)) {
        seen.add(id);
        const baseUrl = item[1][0];
        let mediaType: 'photo' | 'video' = 'photo';
        let videoUrl: string | null = null;
        
        const isVideoElement = item.some((field: any) =>
          Array.isArray(field) && field.some(sub => typeof sub === 'string' && sub.includes('video'))
        );
        if (isVideoElement) {
           mediaType = 'video';
           videoUrl = `${baseUrl}=m18`;
        }
        
        let takenAt = null;
        if (typeof item[2] === 'number' && item[2] > 1000000000000) {
          takenAt = new Date(item[2]).toISOString();
        } else if (typeof item[5] === 'number' && item[5] > 1000000000000) {
          takenAt = new Date(item[5]).toISOString();
        }
        
        result.push({
          index: 0, id, mediaType,
          width: item[1][1] || null, height: item[1][2] || null, takenAt,
          thumbUrl: `${baseUrl}=w800`, displayUrl: `${baseUrl}=w1600`, originalLikeUrl: `${baseUrl}=w2400`,
          videoUrl, fallbackVideoUrl: videoUrl ? `${baseUrl}=m22` : null,
          fallbackThumbUrl: `${baseUrl}=w500`, fallbackDisplayUrl: `${baseUrl}=w1200`,
        });
      }
      return;
    }
    if (Array.isArray(item)) {
      for (const sub of item) { traverse(sub); }
    }
  }
  traverse(arr);
  return result;
}

function extractToken(arr: any[]): string | null {
  let token: string | null = null;
  function traverseForToken(item: any) {
    if (token) return;
    if (Array.isArray(item)) {
      for (const el of item) {
        if (typeof el === 'string' && el.length > 50 && /^[A-Za-z0-9_\-]{60,}$/.test(el)) {
           token = el;
           return;
        }
      }
      for (const sub of item) { traverseForToken(sub); }
    }
  }
  traverseForToken(arr);
  return token;
}

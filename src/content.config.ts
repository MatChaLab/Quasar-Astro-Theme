// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


// 🟢 1. 文章 Collection（比照 moments 掃描模式）
const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    pubDate: z.string().or(z.date()).optional(),
    category: z.string().default('Uncategorized'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    readTime: z.string().default('5 min read'),
  }),
});


// 🟢 2. 朋友圈/動態 Collection
const momentsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/moments" }),
  schema: z.object({
    day: z.string(),
    month: z.string(),
    title: z.string(),
    subtitle: z.string(),
    time: z.string(),
    location: z.string().optional(),
    thumbnail: z.string(),
    images: z.array(z.string()).default([]),
    likes: z.array(z.string()).default([]),
    comments: z.array(
      z.object({
        user: z.string(),
        text: z.string()
      })
    ).default([]),
  }),
});

export const collections = {
  posts: postsCollection,
  moments: momentsCollection,
};
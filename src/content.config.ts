// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  moments: momentsCollection,
};
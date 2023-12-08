import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  schema: z.object({
    title: z.string(),
    thumbnail: z.string(),
  }),
});

export const collections = { products };

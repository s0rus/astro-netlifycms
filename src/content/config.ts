import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const products = defineCollection({
  schema: z.object({
    title: z.string(),
    body: z.string(),
    thumbnail: z.string(),
  }),
});

export const collections = { blog, products };

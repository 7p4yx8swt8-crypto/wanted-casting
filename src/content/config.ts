import { defineCollection, z } from 'astro:content';

const castings = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    dates: z.string(),
    location: z.string(),
    production: z.string().optional(),
    format_type: z.enum(['Spielfilm', 'Serie', 'Werbung', 'Foto', 'Sonstiges']).default('Spielfilm'),
    looking_for: z.string(),
    fee: z.string().optional(),
    apply_url: z.string().optional(),
    image: z.string().optional(),
    active: z.boolean().default(true),
  }),
});

export const collections = { castings };

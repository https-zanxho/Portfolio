import { defineCollection, z } from "astro:content";

// 👇 usamos un schema con `image()` y tolerancia de fechas
const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // ✅ acepta string y lo convierte a Date automáticamente
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // ✅ ahora el asset es un tipo válido para <Image /> / getImage()
      heroImage: image().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().optional(),
      lang: z.enum(["es", "en"]).default("es"),
    }),
});

export const collections = { projects: projectsCollection };

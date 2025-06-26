import { z } from "zod"
export const bookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number(),
})
export type Book = z.infer<typeof bookSchema>
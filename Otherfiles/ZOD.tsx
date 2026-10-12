import z from "zod";

const attributeItemSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "if you add an attribute, the key cannot be empty."),
  value: z
    .string()
    .trim()
    .min(1, "if you add a vlue, the key cannot be empty."),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const productBodySchema = z.object({
 name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().optional().nullable(),
  categoryID: z.string().min(8, "A valid Category is required"),
  stock: z.number().int().nonnegative("Stock must be 0 or greater"),
  price: z.number().positive("Price must be greater than 0"),
  discount: z
    .number()
    .nonnegative("Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .default(0),
  color: z.array(z.string()).min(1, "Select at least one color option"),
  images: z
    .array(
      z.instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Each image file must be less than 5MB.")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png, and .webp formats are allowed."
        )
    )
    .min(1, "Please upload at least one image file from your computer"),

  attributes: z.array(attributeItemSchema).optional().default([]),
});


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

export interface CountryOption {
  value: string;
  label: string;
  phoneCode: string;
}
export const ALLOWED_COUNTRIES: CountryOption[] = [
  { value: "AF", label: "Afghanistan", phoneCode: "+93" },
  { value: "AL", label: "Albania", phoneCode: "+355" },
  { value: "DZ", label: "Algeria", phoneCode: "+213" },
  { value: "AR", label: "Argentina", phoneCode: "+54" },
  { value: "AU", label: "Australia", phoneCode: "+61" },
  { value: "AT", label: "Austria", phoneCode: "+43" },
  { value: "BE", label: "Belgium", phoneCode: "+32" },
  { value: "BR", label: "Brazil", phoneCode: "+55" },
  { value: "CA", label: "Canada", phoneCode: "+1" },
  { value: "CL", label: "Chile", phoneCode: "+56" },
  { value: "CO", label: "Colombia", phoneCode: "+57" },
  { value: "CR", label: "Costa Rica", phoneCode: "+506" },
  { value: "CZ", label: "Czech Republic", phoneCode: "+420" },
  { value: "DK", label: "Denmark", phoneCode: "+45" },
  { value: "EG", label: "Egypt", phoneCode: "+20" },
  { value: "FI", label: "Finland", phoneCode: "+358" },
  { value: "FR", label: "France", phoneCode: "+33" },
  { value: "DE", label: "Germany", phoneCode: "+49" },
  { value: "GR", label: "Greece", phoneCode: "+30" },
  { value: "HK", label: "Hong Kong", phoneCode: "+852" },
  { value: "IN", label: "India", phoneCode: "+91" },
  { value: "ID", label: "Indonesia", phoneCode: "+62" },
  { value: "IE", label: "Ireland", phoneCode: "+353" },
  { value: "IT", label: "Italy", phoneCode: "+39" },
  { value: "JP", label: "Japan", phoneCode: "+81" },
  { value: "MY", label: "Malaysia", phoneCode: "+60" },
  { value: "MX", label: "Mexico", phoneCode: "+52" },
  { value: "MA", label: "Morocco", phoneCode: "+212" },
  { value: "NL", label: "Netherlands", phoneCode: "+31" },
  { value: "NZ", label: "New Zealand", phoneCode: "+64" },
  { value: "NO", label: "Norway", phoneCode: "+47" },
  { value: "PE", label: "Peru", phoneCode: "+51" },
  { value: "PH", label: "Philippines", phoneCode: "+63" },
  { value: "PL", label: "Poland", phoneCode: "+48" },
  { value: "PT", label: "Portugal", phoneCode: "+351" },
  { value: "QA", label: "Qatar", phoneCode: "+974" },
  { value: "SA", label: "Saudi Arabia", phoneCode: "+966" },
  { value: "SG", label: "Singapore", phoneCode: "+65" },
  { value: "ZA", label: "South Africa", phoneCode: "+27" },
  { value: "KR", label: "South Korea", phoneCode: "+82" },
  { value: "ES", label: "Spain", phoneCode: "+34" },
  { value: "SE", label: "Sweden", phoneCode: "+46" },
  { value: "CH", label: "Switzerland", phoneCode: "+41" },
  { value: "TW", label: "Taiwan", phoneCode: "+886" },
  { value: "TH", label: "Thailand", phoneCode: "+66" },
  { value: "AE", label: "United Arab Emirates", phoneCode: "+971" },
  { value: "GB", label: "United Kingdom", phoneCode: "+44" },
  { value: "US", label: "United States", phoneCode: "+1" },
  { value: "VN", label: "Vietnam", phoneCode: "+84" },
];

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
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          "Each image file must be less than 5MB.",
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png, and .webp formats are allowed.",
        ),
    )
    .min(1, "Please upload at least one image file from your computer"),

  attributes: z.array(attributeItemSchema).optional().default([]),
});

export const VendorBodySchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  storeSlug: z.string().min(2, "storeSlug must be at least 2 characters"),
  storeDescription: z
    .string()
    .min(2, "description must be at least 2 characters"),
  companyName: z.string().min(2, "Product name must be at least 2 characters"),
  country: z.string().min(2, "Product name must be at least 2 characters"),
  lastName: z.string().min(2, "Product name must be at least 2 characters"),
  mobilenumber: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/, "Please enter a valid mobile number"),
  phoneCode:z.string().min(1,"please select your country"),
  image: z.preprocess(
    (val) => (val === null || val === "" ? undefined : val),
    z.instanceof(File, {message:"please upload your store log/artwork"})
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          "Each image file must be less than 5MB.",
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Only .jpg, .jpeg, .png, and .webp formats are allowed."),
    )
});

export type VendorSignupInput = z.infer<typeof VendorBodySchema>
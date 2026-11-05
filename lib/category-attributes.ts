import { z } from "zod";

export const CATEGORY_ATTRIBUTE_TYPES = [
  "text",
  "number",
  "boolean",
  "select",
] as const;

export type CategoryAttributeType = (typeof CATEGORY_ATTRIBUTE_TYPES)[number];

export interface CategoryAttributeDefinition {
  key: string;
  label: string;
  type: CategoryAttributeType;
  unit?: string;
  options?: string[];
  required: boolean;
  filterable: boolean;
}

export type ProductAttributeValue = string | number | boolean;

export interface ProductAttribute {
  key: string;
  value: ProductAttributeValue;
}

const attributeKeySchema = z
  .string()
  .trim()
  .min(1, "Enter an attribute key.")
  .max(64, "Attribute key must be 64 characters or fewer.")
  .regex(
    /^[a-zA-Z][a-zA-Z0-9_]*$/,
    "Use letters, numbers, and underscores; start with a letter.",
  );

export const categoryAttributeFormItemSchema = z
  .object({
    key: attributeKeySchema,
    label: z
      .string()
      .trim()
      .min(1, "Enter a display label.")
      .max(100, "Label must be 100 characters or fewer."),
    type: z.enum(CATEGORY_ATTRIBUTE_TYPES),
    unit: z.string().trim().max(24, "Unit must be 24 characters or fewer."),
    optionsCsv: z.string(),
    required: z.boolean(),
    filterable: z.boolean(),
  })
  .superRefine((definition, ctx) => {
    if (definition.type === "select" && parseAttributeOptions(definition.optionsCsv).length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["optionsCsv"],
        message: "Select attributes need at least one option.",
      });
    }
  });

export type CategoryAttributeFormValue = z.infer<
  typeof categoryAttributeFormItemSchema
>;

function uniqueAttributeKeys(
  definitions: Array<{ key: string }> | null | undefined,
  ctx: z.RefinementCtx,
) {
  if (!definitions) return;
  const keys = new Set<string>();
  for (const [index, definition] of definitions.entries()) {
    const normalized = definition.key.trim().toLowerCase();
    if (keys.has(normalized)) {
      ctx.addIssue({
        code: "custom",
        path: [index, "key"],
        message: "Attribute keys must be unique within a category.",
      });
    }
    keys.add(normalized);
  }
}

export const categoryAttributesFormSchema = z
  .array(categoryAttributeFormItemSchema)
  .max(100, "A category can define at most 100 attributes.")
  .superRefine(uniqueAttributeKeys);

export function parseAttributeOptions(csv: string | undefined): string[] {
  if (!csv) return [];
  return Array.from(
    new Set(
      csv
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option.length > 0),
    ),
  );
}

export function toCategoryAttributeDefinition(
  value: CategoryAttributeFormValue,
): CategoryAttributeDefinition {
  return {
    key: value.key.trim().toLowerCase(),
    label: value.label.trim(),
    type: value.type,
    ...(value.unit.trim() ? { unit: value.unit.trim() } : {}),
    ...(value.type === "select"
      ? { options: parseAttributeOptions(value.optionsCsv) }
      : {}),
    required: value.required,
    filterable: value.filterable,
  };
}

export function fromCategoryAttributeDefinition(
  definition: CategoryAttributeDefinition,
): CategoryAttributeFormValue {
  return {
    key: definition.key,
    label: definition.label,
    type: definition.type,
    unit: definition.unit ?? "",
    optionsCsv: definition.options?.join(", ") ?? "",
    required: definition.required ?? false,
    filterable: definition.filterable ?? true,
  };
}

export function coerceAttributeFormValue(
  value: unknown,
  type: CategoryAttributeType,
): ProductAttributeValue | "" {
  if (type === "number") {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : "";
    }
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : "";
    }
    return "";
  }
  if (type === "boolean") {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return "";
  }
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return String(value);
}

export function isAttributeValueFilled(
  value: unknown,
  type: CategoryAttributeType,
): boolean {
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "boolean") return typeof value === "boolean";
  return typeof value === "string" && value.trim() !== "";
}

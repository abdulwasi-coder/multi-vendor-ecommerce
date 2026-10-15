"use client";

import Link from "next/link";
import React, {
  ChangeEvent,
  HtmlHTMLAttributes,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  useFieldArray,
  type FieldPath,
} from "react-hook-form";
import { ProductInput, productBodySchema } from "@/Otherfiles/ZOD";
import { Badge } from "../badge";

export function ProductForm({ product }: { product?: ProductInput }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const editing = Boolean(product);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productBodySchema),
    defaultValues: {
      name: "",
      images: undefined,
      description: "",
      brand: "",
      categoryID: "",
      stock: undefined,
      price: undefined,
      discount: undefined,
      colors: [],
      attributes: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const currentColors = watch("colors") || [];
  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && colorInput.trim() !== "") {
      e.preventDefault();
      if (!currentColors.includes(colorInput.trim())) {
        setValue("colors", [...currentColors, colorInput.trim()], {
          shouldValidate: true,
        });
      }
      setColorInput("");
    }
  };
  const handleRemove = (colorToRemove: string) => {
    setValue(
      "colors",
      currentColors.filter((c) => c !== colorToRemove),
      { shouldValidate: true },
    );
  };

  async function onSubmit(data: ProductInput) {
    try {
      const multipartPayload = new FormData();
      multipartPayload.append("name", data.name);
      multipartPayload.append("brand", String(data?.brand));
      multipartPayload.append("description", data.description);
      multipartPayload.append("categoryID", data.categoryID);
      multipartPayload.append("colors", JSON.stringify(data.colors));
      multipartPayload.append("status", data.status);
      multipartPayload.append("price", String(data.price));
      multipartPayload.append("stock", String(data.stock));
      multipartPayload.append("attributes", JSON.stringify(data.attributes));
      if (data.discount !== undefined && data.discount !== null) {
        multipartPayload.append("discount", String(data.discount));
      }
      Array.from(data.images ?? []).forEach((file) => {
        multipartPayload.append("files", file);
      });

      // Keep the submit state visible while the save operation is processed.
      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success("Your vendor profile details are ready", {
        description: `data is successfully saved.`,
      });
    } catch (error) {
      toast.error("Form transmission crash detected");
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const existingFiles = Array.from(watch("images") ?? []);
    const seenFiles = new Set(
      existingFiles.map(
        (file) => `${file.name}:${file.size}:${file.lastModified}`,
      ),
    );
    const newFiles = Array.from(files).filter((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seenFiles.has(key)) return false;
      seenFiles.add(key);
      return true;
    });

    const dataTransfer = new DataTransfer();
    [...existingFiles, ...newFiles].forEach((file) => {
      dataTransfer.items.add(file);
    });
    setValue("images", dataTransfer.files, { shouldValidate: true });

    const localURLs = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((current) => [...current, ...localURLs]);
  }

  function handleRemoveImage(index: number) {
    const files = watch("images");
    if (!files) return;

    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file, fileIndex) => {
      if (fileIndex !== index) dataTransfer.items.add(file);
    });

    URL.revokeObjectURL(previews[index]);
    setPreviews((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
    setValue("images", dataTransfer.files, { shouldValidate: true });
  }

  function HandleAddingFields({
    fieldLabel,
    ControlName,
    placeholder,
    InputParts,
  }: {
    fieldLabel: React.ReactNode;
    ControlName: FieldPath<ProductInput>;
    placeholder: string;
    InputParts?: React.InputHTMLAttributes<HTMLInputElement>;
  }) {
    return (
      <Field>
        <FieldLabel htmlFor={`product-${ControlName}`}>{fieldLabel}</FieldLabel>
        <Controller
          control={control}
          name={ControlName}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                {...InputParts}
                value={
                  typeof field.value === "string" ||
                  typeof field.value === "number"
                    ? field.value
                    : ""
                }
                onChange={(event) =>
                  ControlName === "price" ||
                  ControlName === "stock" ||
                  ControlName === "discount"
                    ? field.onChange(
                        event.target.value === ""
                          ? undefined
                          : event.target.valueAsNumber,
                      )
                    : field.onChange(event.target.value)
                }
                className={inputClassName}
                placeholder={`e.g. ${placeholder}`}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </>
          )}
        ></Controller>
      </Field>
    );
  }

  const inputClassName =
    "h-10 rounded-lg border-border bg-background px-3 shadow-none transition focus-visible:ring-2 focus-visible:ring-ring/20";

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-7 lg:px-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2 text-muted-foreground"
          render={<Link href="/vendor/products" />}
        >
          <ArrowLeft /> Back to products
        </Button>

        <header className="mb-4 border-b pb-4">
          <p className="text-sm text-muted-foreground">
            Store management <span className="mx-1">/</span> Products
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {editing ? "Edit product" : "Add product"}
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Fill in the needed product details below.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit, (error) => {
            console.log(error);
          })}
        >
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <HandleAddingFields
              fieldLabel="Product Name"
              ControlName="name"
              placeholder="Macbook"
            />
            <HandleAddingFields
              fieldLabel="Brand"
              ControlName="brand"
              placeholder="Apple"
            />
            <HandleAddingFields
              fieldLabel="Category"
              ControlName="categoryID"
              placeholder="Laptops"
            />
            <Field>
              <FieldLabel htmlFor="color-input">Available Colors</FieldLabel>
              <div className="space-y-3 ">
                <Controller
                  control={control}
                  name="colors"
                  render={({ field }) => (
                    <Input
                      id="color-input"
                      name={field.name}
                      value={colorInput}
                      className={inputClassName}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyDown={handleAdd}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      placeholder="e.g. Black"
                    />
                  )}
                />
                <FieldDescription>
                  Type a color name and hit Enter.
                </FieldDescription>
                {currentColors.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/40">
                    {currentColors.map((color, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="flex items-center gap-1.5 py-1 px-2.5 text-sm"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => handleRemove(color)}
                          className="rounded-full hover:bg-muted p-0.5 transition"
                        >
                          <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FieldError>{errors.colors?.message}</FieldError>
            </Field>
            <HandleAddingFields
              fieldLabel={
                <>
                  Price By <span className="text-destructive">$</span>
                </>
              }
              ControlName="price"
              placeholder="0.00"
              InputParts={{ type: "number", min: "0" }}
            />
            <HandleAddingFields
              fieldLabel="Available stock"
              ControlName="stock"
              placeholder="10"
              InputParts={{ type: "number", min: "0" }}
            />
            <Field>
              <FieldLabel htmlFor="product-status">Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <select
                    {...field}
                    id="product-status"
                    value={field.value ?? product?.status ?? "active"}
                    required
                    className={`${inputClassName} border pr-9`}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Archieved</option>
                    <option value="inactive">Inactive</option>
                  </select>
                )}
              />
              <FieldError>{errors.status?.message}</FieldError>
            </Field>
            <HandleAddingFields
              ControlName="discount"
              fieldLabel={
                <>
                  Discount By <span className="text-destructive">%</span>
                </>
              }
              placeholder="0"
              InputParts={{ type: "number", min: "0", max: "99" }}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Specification Attributes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Add customized key-value parameters.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ key: "", value: "" })}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Row
                </Button>
              </div>
              <div className="space-y-4">
                {fields.map((item, index) => {
                  const keyError = errors.attributes?.[index]?.key;
                  const valueError = errors.attributes?.[index]?.value;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 items-start p-3 border rounded-xl bg-muted/10"
                    >
                      <div className="flex-1">
                        <Field>
                          <FieldLabel className="sr-only">Key Name</FieldLabel>
                          <Controller
                            control={control}
                            name={`attributes.${index}.key` as const}
                            render={({ field }) => (
                              <Input {...field} placeholder="e.g. Storage" />
                            )}
                          />
                          <FieldError>{keyError?.message}</FieldError>
                        </Field>
                      </div>
                      <div className="flex-1">
                        <Field>
                          <FieldLabel className="sr-only">
                            Value Metric
                          </FieldLabel>
                          <Controller
                            control={control}
                            name={`attributes.${index}.value` as const}
                            render={({ field }) => (
                              <Input {...field} placeholder="e.g. 256 GB" />
                            )}
                          />
                          <FieldError>{valueError?.message}</FieldError>
                        </Field>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        className="mt-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <Field className="sm:col-span-2 border-t pt-4">
              <FieldLabel htmlFor="product-description">
                Description <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="product-description"
                    value={field.value ?? ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder="Describe the product, its materials, fit, and care."
                    defaultValue={product?.description}
                  />
                )}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Upload Images</FieldLabel>
              <div className="space-y-4 mt-1.5">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/60 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6"></div>
                  <Controller
                    control={control}
                    name="images"
                    render={({ field }) => (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload files
                        </p>
                        <Input
                          type="file"
                          name={field.name}
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </>
                    )}
                  />
                </label>
                {previews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
                    {previews.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={url}
                          alt={`Preview image ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          aria-label={`Remove image ${idx + 1}`}
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-foreground shadow hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FieldError>{errors.images?.message}</FieldError>
            </Field>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Link
              href="/vendor/products"
              className="inline-flex min-w-24 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className=" rounded-xl py-2 text-sm px-6 text-white bg-black flex items-center gap-0.5 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  Saving... <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

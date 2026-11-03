"use client";

import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useVendorProductCategories } from "@/Otherfiles/tanstack/vendor-product-categories";

const MAX_PRODUCT_IMAGES = 5;

interface ExistingProductImage {
  _id: string;
  cloudinaryId: string;
  publicId: string;
}

interface EditableProduct {
  _id: string;
  name: string;
  description: string;
  brand: string;
  categoryID: string;
  stock: number;
  price: number;
  discount?: number;
  status: string;
  colors: string[];
  images: ExistingProductImage[];
  attributes?: Array<{ key: string; value: string }>;
}

export function ProductForm({ productId }: { productId?: string }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingProductImage[]>(
    [],
  );
  const [loadedProductId, setLoadedProductId] = useState<string>();
  const [colorInput, setColorInput] = useState("");
  const [selectedLevelOneId, setSelectedLevelOneId] = useState("");
  const [selectedLevelTwoId, setSelectedLevelTwoId] = useState("");
  const [selectedLevelThreeId, setSelectedLevelThreeId] = useState("");
  const categoryQuery = useVendorProductCategories();
  const queryClient = useQueryClient();
  const router = useRouter();
  const editing = Boolean(productId);
  const productQuery = useQuery({
    queryKey: ["vendor-product", productId],
    enabled: editing,
    queryFn: async () => {
      if (!productId) throw new Error("A product ID is required.");
      const response = await api.get<{
        success: boolean;
        message?: string;
        product?: EditableProduct;
      }>(`/vendor/readProduct/${productId}`);
      if (!response.data.success || !response.data.product) {
        throw new Error(response.data.message ?? "Could not load this product.");
      }
      return response.data.product;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
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
      status: "active",
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  useEffect(() => {
    const savedProduct = productQuery.data;
    if (!savedProduct) return;

    reset({
      name: savedProduct.name,
      images: undefined,
      description: savedProduct.description,
      brand: savedProduct.brand,
      categoryID: savedProduct.categoryID,
      stock: savedProduct.stock,
      price: savedProduct.price,
      discount: savedProduct.discount ?? 0,
      colors: savedProduct.colors ?? [],
      status:
        savedProduct.status === "archieved" ||
        savedProduct.status === "archived"
          ? "archived"
          : savedProduct.status === "banned"
            ? "inactive"
            : savedProduct.status === "inactive"
              ? "inactive"
              : "active",
      attributes: (savedProduct.attributes ?? []).map(({ key, value }) => ({
        key,
        value,
      })),
    });
    setExistingImages(savedProduct.images ?? []);
    setPreviews([]);
    setLoadedProductId(productId);
  }, [productId, productQuery.data, reset]);

  useEffect(() => {
    const categoryId = productQuery.data?.categoryID;
    const categories = categoryQuery.data;
    if (!categoryId || !categories) return;

    for (const levelOne of categories) {
      for (const levelTwo of levelOne.children) {
        if (levelTwo.children.some((item) => item._id === categoryId)) {
          setSelectedLevelOneId(levelOne._id);
          setSelectedLevelTwoId(levelTwo._id);
          setSelectedLevelThreeId(categoryId);
          return;
        }
      }
    }
  }, [categoryQuery.data, productQuery.data?.categoryID]);

  const currentColors = watch("colors") || [];
  const addColor = () => {
    const color = colorInput.trim();
    if (!color) return;

    if (!currentColors.includes(color)) {
      setValue("colors", [...currentColors, color], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    setColorInput("");
  };

  const handleAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addColor();
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
    const newImages = Array.from(data.images ?? []);
    if (existingImages.length + newImages.length === 0) {
      setError("images", {
        type: "manual",
        message: "Keep or upload at least one product image.",
      });
      return;
    }

    try {
      const multipartPayload = new FormData();
      multipartPayload.append("name", data.name);
      multipartPayload.append("brand", data.brand?.trim() || "GEN");
      multipartPayload.append("description", data.description);
      multipartPayload.append("categoryID", data.categoryID);
      multipartPayload.append("colors", JSON.stringify(data.colors));
      multipartPayload.append("status", data.status);
      multipartPayload.append("price", String(data.price));
      multipartPayload.append("stock", String(data.stock));
      multipartPayload.append(
        "attributes",
        JSON.stringify(
          (data.attributes ?? []).filter(
            (attribute) =>
              attribute.key.trim() !== "" && attribute.value.trim() !== "",
          ),
        ),
      );
      if (editing) {
        multipartPayload.append(
          "images",
          JSON.stringify(existingImages),
        );
      }
      if (data.discount !== undefined && data.discount !== null) {
        multipartPayload.append("discount", String(data.discount));
      }
      newImages.forEach((file) => {
        multipartPayload.append("imagestoUpload", file);
      });

      const response = await api.post<{
        success: boolean;
        message?: string;
      }>(
        editing && productId
          ? `/vendor/UpdateProduct/${productId}`
          : "/vendor/CreateProduct",
        multipartPayload,
      );

      if (!response.data.success) {
        throw new Error(response.data.message ?? "Could not create product.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["vendor-products"],
      });
      if (productId) {
        await queryClient.invalidateQueries({
          queryKey: ["vendor-product", productId],
        });
      }
      toast.success(
        editing ? "Product updated successfully." : "Product created successfully.",
      );
      router.push("/vendor/products");
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? "Could not create product.")
        : error instanceof Error
          ? error.message
          : "Could not create product.";
      toast.error(message);
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
    const uniqueNewFiles = Array.from(files).filter((file) => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seenFiles.has(key)) return false;
      seenFiles.add(key);
      return true;
    });
    const availableSlots = Math.max(
      0,
      MAX_PRODUCT_IMAGES - existingImages.length - existingFiles.length,
    );
    const newFiles = uniqueNewFiles.slice(0, availableSlots);

    if (newFiles.length < uniqueNewFiles.length) {
      toast.error(`You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`);
    }

    if (newFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const dataTransfer = new DataTransfer();
    [...existingFiles, ...newFiles].forEach((file) => {
      dataTransfer.items.add(file);
    });
    setValue("images", dataTransfer.files, { shouldValidate: true });

    const localURLs = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((current) => [...current, ...localURLs]);
  }

  function handleRemoveImage(index: number) {
    if (index < existingImages.length) {
      setExistingImages((current) =>
        current.filter((_, imageIndex) => imageIndex !== index),
      );
      return;
    }

    const newImageIndex = index - existingImages.length;
    const files = watch("images");
    if (!files) return;

    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file, fileIndex) => {
      if (fileIndex !== newImageIndex) dataTransfer.items.add(file);
    });

    URL.revokeObjectURL(previews[newImageIndex]);
    setPreviews((current) =>
      current.filter((_, fileIndex) => fileIndex !== newImageIndex),
    );
    setValue("images", dataTransfer.files, {
      shouldValidate: true,
      shouldDirty: true,
    });
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
  const levelThreeCategories =
    categoryQuery.data
      ?.find((category) => category._id === selectedLevelOneId)
      ?.children.find((category) => category._id === selectedLevelTwoId)
      ?.children ?? [];

  if (
    editing &&
    (productQuery.isPending || loadedProductId !== productId)
  ) {
    return (
      <main className="min-h-[calc(100dvh-2rem)] bg-background px-4 py-10 text-center text-muted-foreground">
        Loading product details...
      </main>
    );
  }

  if (editing && productQuery.isError) {
    return (
      <main className="min-h-[calc(100dvh-2rem)] bg-background px-4 py-10">
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <p role="alert" className="text-sm text-destructive">
            {productQuery.error instanceof Error
              ? productQuery.error.message
              : "Could not load this product."}
          </p>
          <Button type="button" variant="outline" onClick={() => void productQuery.refetch()}>
            Try again
          </Button>
          <Button variant="ghost" render={<Link href="/vendor/products" />}>
            Back to products
          </Button>
        </div>
      </main>
    );
  }

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
            {editing
              ? "Update the listing details below. Keep or replace its images before saving."
              : "Fill in the needed product details below."}
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
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="level-one-category">
                  Main category
                </FieldLabel>
                <select
                  id="level-one-category"
                  value={selectedLevelOneId}
                  disabled={categoryQuery.isPending || categoryQuery.isError}
                  onChange={(event) => {
                    const categoryId = event.target.value;
                    setSelectedLevelOneId(categoryId);
                    setSelectedLevelTwoId("");
                    setSelectedLevelThreeId("");
                    setValue("categoryID", "", { shouldValidate: true });
                  }}
                  className={`${inputClassName} w-full border pr-9`}
                >
                  <option value="">
                    {categoryQuery.isPending
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {(categoryQuery.data ?? []).map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FieldDescription>
                  Choose the broad category first to find its related
                  subcategories.
                </FieldDescription>
                {categoryQuery.isError && (
                  <div>
                    <p role="alert" className="text-sm text-destructive">
                      {categoryQuery.error instanceof Error
                        ? categoryQuery.error.message
                        : "Could not load product categories."}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => void categoryQuery.refetch()}
                    >
                      Retry
                    </Button>
                  </div>
                )}
                <FieldError>{errors.categoryID?.message}</FieldError>
              </Field>

              {selectedLevelOneId && (
                <Field>
                  <FieldLabel htmlFor="level-two-category">
                    Product category
                  </FieldLabel>
                  <select
                    id="level-two-category"
                    value={selectedLevelTwoId}
                    onChange={(event) => {
                      const categoryId = event.target.value;
                      setSelectedLevelTwoId(categoryId);
                      setSelectedLevelThreeId("");
                      setValue("categoryID", "", { shouldValidate: true });
                    }}
                    className={`${inputClassName} w-full border pr-9`}
                  >
                    <option value="">Select a level-2 category</option>
                    {categoryQuery.data
                      ?.find((category) => category._id === selectedLevelOneId)
                      ?.children.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  <FieldDescription>
                    Choose a level-2 category or narrow it further below.
                  </FieldDescription>
                </Field>
              )}

              {selectedLevelTwoId && (
                <Field>
                  <FieldLabel htmlFor="level-three-category">
                    Level-3 category
                  </FieldLabel>
                  <select
                    id="level-three-category"
                    value={selectedLevelThreeId}
                    required
                    onChange={(event) => {
                      const categoryId = event.target.value;
                      setSelectedLevelThreeId(categoryId);
                      setValue("categoryID", categoryId, {
                        shouldValidate: true,
                      });
                    }}
                    className={`${inputClassName} w-full border pr-9`}
                  >
                    <option value="">Select a level-3 category</option>
                    {levelThreeCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <FieldDescription>
                    {levelThreeCategories.length > 0
                      ? "Select a level-3 category to continue. Deeper levels are not available."
                      : "No level-3 categories are available here. Choose another level-2 category."}
                  </FieldDescription>
                </Field>
              )}
            </div>
            <Field>
              <FieldLabel htmlFor="color-input">Available Colors</FieldLabel>
              <div className="space-y-3 ">
                <Controller
                  control={control}
                  name="colors"
                  render={({ field }) => (
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <Input
                        id="color-input"
                        name={field.name}
                        value={colorInput}
                        className={inputClassName}
                        onChange={(event) => setColorInput(event.target.value)}
                        onKeyDown={handleAdd}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        placeholder="e.g. Black"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addColor}
                        disabled={!colorInput.trim()}
                        aria-label="Add color"
                        className="min-h-11 gap-1.5 px-3"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                        Add
                      </Button>
                    </div>
                  )}
                />
                <FieldDescription>
                  Type a color name and tap Add.
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
                          aria-label={`Remove ${color}`}
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
                    value={field.value ?? "active"}
                    required
                    className={`${inputClassName} border pr-9`}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
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
                          Click to upload up to {Math.max(0, MAX_PRODUCT_IMAGES - existingImages.length)} more files
                        </p>
                        <Input
                          type="file"
                          name={field.name}
                          accept="image/*"
                          multiple
                          disabled={
                            existingImages.length +
                              (watch("images")?.length ?? 0) >=
                              MAX_PRODUCT_IMAGES
                          }
                          onChange={handleImageChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </>
                    )}
                  />
                </label>
                {(existingImages.length > 0 || previews.length > 0) && (
                  <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
                    {existingImages.map((image, index) => (
                      <div
                        key={image._id}
                        className="relative aspect-square rounded-md overflow-hidden border"
                      >
                        <img
                          src={image.publicId}
                          alt={`Current product image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        <button
                          type="button"
                          aria-label={`Remove current image ${index + 1}`}
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-foreground shadow hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
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
                          aria-label={`Remove new image ${idx + 1}`}
                          onClick={() =>
                            handleRemoveImage(existingImages.length + idx)
                          }
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
                  <Save className="size-4" />
                  {editing ? "Save changes" : "Save Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

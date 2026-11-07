"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  useFieldArray,
  type Control,
} from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BrandsFormShape = {
  brands: Array<{ brand: string }>;
};

export type CategoryBrandsControl = Control<BrandsFormShape>;

interface CategoryBrandsEditorProps {
  control: CategoryBrandsControl;
  disabled?: boolean;
}

export function CategoryBrandsEditor({
  control,
  disabled = false,
}: CategoryBrandsEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "brands" });
  const [brandInput, setBrandInput] = useState("");

  const existingBrands = new Set(
    fields.map((field) => field.brand.trim().toLowerCase()),
  );

  const addBrand = () => {
    const brand = brandInput.trim();
    if (!brand || existingBrands.has(brand.toLowerCase())) {
      setBrandInput("");
      return;
    }
    append({ brand });
    setBrandInput("");
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium">Allowed brands</h3>
        <p className="text-xs text-muted-foreground">
          Optional. Vendors must pick one of these brands for products in this
          category. Leave empty to allow any brand.
        </p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <Input
          value={brandInput}
          onChange={(event) => setBrandInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addBrand();
            }
          }}
          placeholder="e.g. Apple"
          autoComplete="off"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addBrand}
          disabled={disabled || !brandInput.trim()}
          aria-label="Add brand"
          className="gap-1.5"
        >
          <Plus className="size-4" aria-hidden="true" /> Add
        </Button>
      </div>
      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <Badge
              key={field.id}
              variant="secondary"
              className="flex items-center gap-1.5 py-1 pl-3 pr-1.5 text-sm"
            >
              {field.brand}
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={disabled}
                aria-label={`Remove ${field.brand}`}
                className="rounded-full p-0.5 hover:bg-muted"
              >
                <X className="size-3 text-muted-foreground hover:text-destructive" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

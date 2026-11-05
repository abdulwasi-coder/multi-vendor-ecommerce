"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useFormState,
  useWatch,
  type Control,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  CATEGORY_ATTRIBUTE_TYPES,
  type CategoryAttributeFormValue,
  type CategoryAttributeType,
} from "@/lib/category-attributes";

const ATTRIBUTE_TYPE_LABELS: Record<CategoryAttributeType, string> = {
  text: "Text",
  number: "Number",
  boolean: "Yes / No",
  select: "Dropdown",
};

const EMPTY_ATTRIBUTE: CategoryAttributeFormValue = {
  key: "",
  label: "",
  type: "text",
  unit: "",
  optionsCsv: "",
  required: false,
  filterable: true,
};

type AttributesFormShape = {
  attributes: CategoryAttributeFormValue[];
};

export type CategoryAttributesControl = Control<AttributesFormShape>;

interface CategoryAttributesEditorProps {
  control: CategoryAttributesControl;
  disabled?: boolean;
}

export function CategoryAttributesEditor({
  control,
  disabled = false,
}: CategoryAttributesEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });
  const { errors } = useFormState({ control, name: "attributes" });
  const attributeRows = useWatch({ control, name: "attributes" });
  const attributeErrors = errors.attributes;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">Attribute fields</h3>
          <p className="text-xs text-muted-foreground">
            Optional. Define the specification fields vendors must fill in for
            products in this category.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || fields.length >= 100}
          onClick={() => append({ ...EMPTY_ATTRIBUTE })}
          className="flex shrink-0 items-center gap-1.5"
        >
          <Plus className="size-4" aria-hidden="true" /> Add attribute
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
          No attribute fields defined.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((item, index) => {
            const itemErrors = Array.isArray(attributeErrors)
              ? attributeErrors[index]
              : undefined;
            const attributeType = attributeRows?.[index]?.type ?? "text";
            return (
              <div
                key={item.id}
                className="space-y-3 rounded-lg border bg-muted/10 p-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label
                      htmlFor={`attribute-${index}-key`}
                      className="text-xs font-medium"
                    >
                      Key
                    </label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.key`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id={`attribute-${index}-key`}
                          placeholder="e.g. material"
                          autoComplete="off"
                          disabled={disabled}
                        />
                      )}
                    />
                    {itemErrors?.key?.message && (
                      <p className="text-xs text-destructive">
                        {itemErrors.key.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`attribute-${index}-label`}
                      className="text-xs font-medium"
                    >
                      Label
                    </label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.label`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id={`attribute-${index}-label`}
                          placeholder="e.g. Material"
                          autoComplete="off"
                          disabled={disabled}
                        />
                      )}
                    />
                    {itemErrors?.label?.message && (
                      <p className="text-xs text-destructive">
                        {itemErrors.label.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`attribute-${index}-type`}
                      className="text-xs font-medium"
                    >
                      Type
                    </label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.type`}
                      render={({ field }) => (
                        <NativeSelect
                          id={`attribute-${index}-type`}
                          className="w-full"
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          disabled={disabled}
                        >
                          {CATEGORY_ATTRIBUTE_TYPES.map((type) => (
                            <NativeSelectOption key={type} value={type}>
                              {ATTRIBUTE_TYPE_LABELS[type]}
                            </NativeSelectOption>
                          ))}
                        </NativeSelect>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor={`attribute-${index}-unit`}
                      className="text-xs font-medium"
                    >
                      Unit (optional)
                    </label>
                    <Controller
                      control={control}
                      name={`attributes.${index}.unit`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id={`attribute-${index}-unit`}
                          placeholder="e.g. cm, kg"
                          autoComplete="off"
                          disabled={disabled}
                        />
                      )}
                    />
                    {itemErrors?.unit?.message && (
                      <p className="text-xs text-destructive">
                        {itemErrors.unit.message}
                      </p>
                    )}
                  </div>
                  {attributeType === "select" && (
                    <div className="space-y-1 sm:col-span-2">
                      <label
                        htmlFor={`attribute-${index}-options`}
                        className="text-xs font-medium"
                      >
                        Options (comma separated)
                      </label>
                      <Controller
                        control={control}
                        name={`attributes.${index}.optionsCsv`}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={`attribute-${index}-options`}
                            placeholder="e.g. Cotton, Polyester, Wool"
                            autoComplete="off"
                            disabled={disabled}
                          />
                        )}
                      />
                      {itemErrors?.optionsCsv?.message && (
                        <p className="text-xs text-destructive">
                          {itemErrors.optionsCsv.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <Controller
                      control={control}
                      name={`attributes.${index}.required`}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            disabled={disabled}
                          />
                          Required
                        </label>
                      )}
                    />
                    <Controller
                      control={control}
                      name={`attributes.${index}.filterable`}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked === true)
                            }
                            disabled={disabled}
                          />
                          Filterable
                        </label>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => remove(index)}
                    aria-label="Remove attribute"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

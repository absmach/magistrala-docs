"use client";

import { Select } from "radix-ui";
import { CURRENT_EDITION, DOC_EDITIONS } from "@/lib/edition";

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function EditionSwitcher() {
  return (
    <Select.Root
      value={CURRENT_EDITION}
      onValueChange={(value) => {
        const target = DOC_EDITIONS.find((edition) => edition.value === value);
        if (target) window.location.href = target.path;
      }}
    >
      <Select.Trigger
        aria-label="Select documentation edition"
        className="inline-flex w-full items-center justify-between gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground data-[state=open]:bg-fd-accent data-[state=open]:text-fd-accent-foreground"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border bg-fd-popover text-fd-popover-foreground shadow-lg data-[state=closed]:animate-fd-popover-out data-[state=open]:animate-fd-popover-in"
        >
          <Select.Viewport className="p-1">
            {DOC_EDITIONS.map((edition) => (
              <Select.Item
                key={edition.value}
                value={edition.value}
                className="relative flex cursor-pointer select-none items-center rounded-md py-1.5 ps-7 pe-2 text-sm outline-none data-[highlighted]:bg-fd-accent data-[highlighted]:text-fd-accent-foreground"
              >
                <Select.ItemIndicator className="absolute inset-y-0 start-2 inline-flex items-center">
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>{edition.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

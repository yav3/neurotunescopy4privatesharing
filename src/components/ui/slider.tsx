import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type RootProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RootProps
>(function Slider(
  { className, value, defaultValue, onValueChange, ...props }: RootProps,
  ref
) {
  // Coerce single numbers to Radix's expected number[]
  const wrappedValue =
    value === undefined || Array.isArray(value) ? (value as number[] | undefined) : [value as number];

  const wrappedDefault =
    defaultValue === undefined || Array.isArray(defaultValue)
      ? (defaultValue as number[] | undefined)
      : [defaultValue as number];

  const handleChange = (v: number[]) => {
    // Preserve native signature; callers expecting number[] still work
    (onValueChange as any)?.(v);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      value={wrappedValue}
      defaultValue={wrappedDefault}
      onValueChange={handleChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

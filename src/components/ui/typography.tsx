import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

export const paragraphVariants = cva("text-primary/80 text-xs font-medium");
type ParagraphProps = React.ComponentProps<"p"> &
  VariantProps<typeof paragraphVariants>;
export const Paragraph: React.FC<ParagraphProps> = ({
  className,
  ...props
}) => {
  return <p className={cn(paragraphVariants({ className }))} {...props} />;
};
export const headingVariance = cva(cn("text-muted-foreground"), {
  variants: {
    level: {
      1: "text-4xl mb-8",
      2: "text-3xl mb-6",
      3: "text-2xl mb-4",
      4: "text-xl mb-3",
      5: "text-lg mb-2",
      6: "text-base mb-2",
    },
  },
  defaultVariants: {
    level: 6,
  },
});
type HeadingProps = React.ComponentProps<"h1"> &
  VariantProps<typeof headingVariance>;
export const Heading: React.FC<HeadingProps> = ({
  className,
  level,
  ...props
}) => {
  return (
    <h1 className={cn(headingVariance({ level, className }))} {...props} />
  );
};

type BlockSectionProps = React.ComponentProps<"section">;
export const BlockSection: React.FC<BlockSectionProps> = ({
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "max-w-xl space-y-2.5 mt-20 container overflow-hidden",
        className,
      )}
      {...props}
    />
  );
};

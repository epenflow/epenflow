import { cva } from "class-variance-authority";
import { motion } from "motion/react";
import React from "react";
import { Heading as AriaHeading } from "react-aria-components";
import { cn } from "~/lib/utils";

const MotionHeading = motion.create(AriaHeading);
type ParagraphProps = React.ComponentProps<typeof motion.p>;
export const Paragraph: React.FC<ParagraphProps> = ({
  className,
  ...props
}) => {
  return (
    <motion.p
      className={cn("text-primary/80 text-xs font-medium", className)}
      {...props}
    />
  );
};
const headingVariance = cva(cn("text-muted-foreground"), {
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
type HeadingProps = React.ComponentProps<typeof MotionHeading> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};
export const Heading: React.FC<HeadingProps> = ({
  className,
  level,
  ...props
}) => {
  return (
    <MotionHeading
      className={cn(headingVariance({ level, className }))}
      {...props}
    />
  );
};

type BlockSectionProps = React.ComponentProps<typeof motion.section>;
export const BlockSection: React.FC<BlockSectionProps> = ({
  className,
  ...props
}) => {
  return (
    <motion.section
      className={cn(
        "text-sm font-medium space-y-2.5 text-pretty container max-w-xl mt-20",
        className,
      )}
      {...props}
    />
  );
};

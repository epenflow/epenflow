import React from "react";
import Button from "../ui/button";
import { BlockSection, Heading, Paragraph } from "../ui/typography";

const ExpensiveTest: React.FC<{
  count: number;
  onPress: () => void;
}> = ({ count, onPress }) => {
  return (
    <BlockSection>
      <Heading>Expensive component</Heading>
      <Paragraph>Count : {count}</Paragraph>
      <Button onPress={onPress} variant={"outline"} className="text-xs">
        count++
      </Button>
    </BlockSection>
  );
};

export default ExpensiveTest;

// eslint-disable-next-line react-refresh/only-export-components
export const useExpensiveTest = () => {
  const [count, setCounter] = React.useState<number>(0);

  // 1. Extremely Expensive Factorial Function:
  const superFactorial = (n: number): number => {
    if (n <= 1) {
      return 1;
    }
    let result = 1;
    // Iterative factorial (slightly more performant for very large numbers)
    for (let i = 2; i <= n; i++) {
      result *= i;
      // Introduce a small delay in each iteration to block the thread longer (VERY HARSH - use with caution)
      // This is a synchronous delay and will BLOCK the main thread - use sparingly for testing!
      const start = performance.now();
      while (performance.now() - start < 0.001) {
        // Micro-delay (0.001ms - adjust if needed)
        // Block CPU - DO NOT DO THIS IN REAL APPS!
      }
    }
    return result;
  };

  const onPress = () => {
    const iterations = 50; // Reduced iterations, but each iteration is MUCH more expensive
    for (let index = 0; index < iterations; index++) {
      // 2. Call the SUPER expensive factorial with a much larger input:
      superFactorial(25 + (index % 10)); // Factorial of ~25-34 (Extremely large numbers)

      // 3. Increment counter (still useful for visualization)
      setCounter((prevCount) => prevCount + 1);
    }
  };
  return { count, onPress };
};

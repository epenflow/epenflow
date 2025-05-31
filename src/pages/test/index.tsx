import { useGSAP } from "@gsap/react";
import gsap from "gsap"; // Import gsap core
import { SplitText } from "gsap/SplitText"; // Make sure SplitText is correctly installed and imported
import React from "react";
import { BlockSection } from "~/components/ui/typography"; // Assuming this is your component
import useDateAndTime from "~/hooks/use-date-and-time"; // Assuming this hook provides an updating Date object
import Time from "./time";

// If SplitText is a GreenSock club plugin, ensure it's registered.
// gsap.registerPlugin(SplitText); // Register plugin globally (e.g., in your app's entry point) or here.

// Mock useDateAndTime for standalone example (replace with your actual hook)
// const useDateAndTime = () => {
//   const [date, setDate] = React.useState(new Date());
//   React.useEffect(() => {
//     const timerId = setInterval(() => setDate(new Date()), 1000);
//     return () => clearInterval(timerId);
//   }, []);
//   return date;
// };

// Mock BlockSection for standalone example
// const BlockSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
//   <div style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>{children}</div>
// );

const Page = () => {
  const scope = React.useRef<HTMLElement>(null); // Main container scope for useGSAP
  const timeDisplayRef = React.useRef<HTMLDivElement>(null); // Ref for the time display div
  const splitTextInstanceRef = React.useRef<SplitText | null>(null); // To store the SplitText instance
  const previousTimeRef = React.useRef<string>(""); // To store the last displayed time string

  const date = useDateAndTime(); // Your hook that provides the current date, updating each second

  // Memoized time formatting function (matches your original)
  const formatTime = React.useCallback((d: Date): string => {
    return new Intl.DateTimeFormat("id-ID", {
      // Using "id-ID" as in your example
      hourCycle: "h12",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .format(d)
      .replace(/\./g, ":"); // Converts "09.30.25 PM" to "09:30:25 PM" (example for id-ID)
  }, []);

  const currentTimeString = formatTime(date);

  // useGSAP for one-time SplitText initialization and cleanup on unmount
  useGSAP(
    () => {
      if (!timeDisplayRef.current) return;

      gsap.registerPlugin(SplitText); // Ensure plugin is registered within this GSAP context

      // Set the initial text content for SplitText to process
      // This uses the currentTimeString from the first render.
      timeDisplayRef.current.textContent = currentTimeString;

      // Create SplitText instance
      splitTextInstanceRef.current = new SplitText(timeDisplayRef.current, {
        type: "chars",
        charsClass: "time-char", // Optional: adds a class to each character span/div
      });

      // Store the time that was used for the initial SplitText setup
      previousTimeRef.current = currentTimeString;

      return () => {
        // Cleanup function: runs when component unmounts
        if (splitTextInstanceRef.current) {
          splitTextInstanceRef.current.revert(); // Reverts SplitText DOM changes
          splitTextInstanceRef.current = null;
        }
      };
    },
    { scope: scope, dependencies: [] },
  ); // Empty dependencies: runs once on mount and cleans up on unmount

  // useGSAP for handling the animation whenever currentTimeString changes
  useGSAP(
    () => {
      if (
        !splitTextInstanceRef.current ||
        !splitTextInstanceRef.current.chars ||
        !timeDisplayRef.current
      ) {
        // SplitText not initialized yet, or element not available.
        return;
      }

      const currentChars = splitTextInstanceRef.current.chars; // Array of character elements
      const oldTimeStr = previousTimeRef.current;
      const newTimeStr = currentTimeString;

      if (newTimeStr === oldTimeStr) {
        return; // Time hasn't changed, no animation needed.
      }

      const oldTimeCharsArray = oldTimeStr.split("");
      const newTimeCharsArray = newTimeStr.split("");

      newTimeCharsArray.forEach((newChar, index) => {
        if (currentChars[index] && newChar !== oldTimeCharsArray[index]) {
          const charElement = currentChars[index];

          gsap
            .timeline()
            .to(charElement, {
              // Animate the old character out
              yPercent: -60, // Move up
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
            })
            .set(charElement, {
              text: newChar, // Change character text content (GSAP can set text)
              yPercent: 60, // Position below, ready to animate in
            })
            .to(charElement, {
              // Animate the new character in
              yPercent: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });
        }
      });

      previousTimeRef.current = newTimeStr; // Update the stored time
    },
    { scope: scope, dependencies: [currentTimeString] },
  ); // Re-run this effect when currentTimeString changes

  return (
    <>
      <main ref={scope}>
        <BlockSection>
          <div
            ref={timeDisplayRef}
            data-time
            className="text-primary" // Your original class
            style={{
              fontSize: "clamp(2rem, 10vw, 4rem)", // Responsive font size
              fontFamily: "'Orbitron', monospace", // A more "digital" font (ensure it's imported)
              lineHeight: "1",
              overflow: "hidden", // Important to clip characters during animation
              padding: "0.2em", // Add some padding if characters touch edges
              display: "inline-block", // Ensures tight fit around text
            }}
            // The content of this div will be managed by GSAP and SplitText.
            // Initial text is set in the first useGSAP hook before SplitText runs.
          />
        </BlockSection>
      </main>
      <Time />
    </>
  );
};

export default Page;

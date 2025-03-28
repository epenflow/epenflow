import { motion } from "motion/react";
import For from "~/components/utility/for";
import AppLayout from "~/layouts/app-layout";
import { withLazy } from "~/lib/utils";

const Home = () => {
  const { socials, texts, BlockSection, Heading, Paragraph } = resources;

  return (
    <AppLayout>
      <div className="w-full min-h-dvh h-full overflow-hidden">
        <BlockSection
          className="mt-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}>
          <Heading
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.25, ease: "easeInOut", delay: 0.2 }}>
            Info
          </Heading>
          <For each={texts}>
            {(text, key) => (
              <Paragraph
                key={key}
                initial={{
                  opacity: 0,
                  y: key * 50,
                }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.25,
                  ease: "easeInOut",
                  delay: key * 0.25,
                }}>
                {text}
              </Paragraph>
            )}
          </For>
        </BlockSection>

        <BlockSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.25, ease: "easeInOut", delay: 0.2 }}>
          <Heading
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.25, ease: "easeInOut", delay: 0.4 }}>
            More
          </Heading>
          <For each={socials}>
            {(social, key) => (
              <Paragraph
                key={`${key}-${social.label}`}
                initial={{
                  opacity: 0,
                  y: key * 10,
                  x: key * 25,
                }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{
                  duration: 1.25,
                  ease: "easeInOut",
                  delay: key * 0.25,
                }}>
                <a href={social.href}>{social.label}</a>
              </Paragraph>
            )}
          </For>
        </BlockSection>
        <BlockSection className="container max-w-xl mx-auto flex justify-end items-center">
          <motion.q
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1, duration: 1.25 }}
            className="text-muted-foreground capitalize text-xs font-medium">
            ideas only matter if they're made real
          </motion.q>
        </BlockSection>
      </div>
    </AppLayout>
  );
};
export default Home;
const resources = {
  BlockSection: withLazy(
    import("~/components/ui/typography").then((res) => ({
      default: res.BlockSection,
    })),
  ),
  Paragraph: withLazy(
    import("~/components/ui/typography").then((res) => ({
      default: res.Paragraph,
    })),
  ),
  Heading: withLazy(
    import("~/components/ui/typography").then((res) => ({
      default: res.Heading,
    })),
  ),
  texts: [
    `Hello, I'm Epen Flow, a Bali-based Web Developer passionate about crafting seamless and intuitive digital experiences.`,
    `With expertise in various frameworks and backend technologies, I excel in building scalable, high-performance web applications. My specialty lies in creating immersive web experiences that merge stunning aesthetics, engaging interactions, and intuitive usability to deliver exceptional results.`,
  ],
  socials: [
    {
      href: import.meta.env.VITE_INSTAGRAM || "#",
      label: "Instagram",
    },
    {
      href: import.meta.env.VITE_FACEBOOK || "#",
      label: "Facebook",
    },
    {
      href: import.meta.env.VITE_TWITTER || "#",
      label: "Twitter",
    },
    {
      href: import.meta.env.VITE_THREADS || "#",
      label: "Threads",
    },
    {
      href: import.meta.env.VITE_LINKEDIN || "#",
      label: "Linkedin",
    },
  ] satisfies Array<{ label: string; href: string }>,
};

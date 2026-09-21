export default function Notes() {
  return (
    <div className="text-primary flex flex-1 scrollbar-thin flex-col items-start justify-center gap-2 space-y-2 overflow-y-auto p-2">
      <h1 className="text-6xl font-medium uppercase">Info</h1>
      <p className="text-primary/80 font-mono font-medium">
        Hello, I'm Epen Flow, a Bali-based Web Developer passionate about crafting seamless and
        intuitive digital experiences.
      </p>
      <p className="text-primary/80 font-mono font-medium">
        With expertise in various frameworks and backend technologies, I excel in building scalable,
        high-performance web applications. My specialty lies in creating immersive web experiences
        that merge stunning aesthetics, engaging interactions, and intuitive usability to deliver
        exceptional results.
      </p>
    </div>
  );
}
declare module "#/lib/types.ts" {
  namespace Systems {
    namespace Process {
      interface Registries {
        Notes: true;
      }
    }
  }
}

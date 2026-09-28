export default function Hello() {
  return <p>Hello World!</p>;
}

declare module "#/system/types.ts" {
  namespace System {
    interface Registries {
      Hello: {
        current: number;
      };
    }
  }
}

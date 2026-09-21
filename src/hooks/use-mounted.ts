import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useMounted = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

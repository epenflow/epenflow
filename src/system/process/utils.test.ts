import { beforeEach, describe, expect, it } from "vitest";
import type { System } from "#/system/types.ts";
import {
  findProcessesInstanceById,
  findVisibleProcessId,
  setProcessesInstanceById,
} from "#/system/process/utils.ts";

describe("process utils", () => {
  let processes: System.Processes;

  beforeEach(() => {
    processes = {
      "task::0": {
        id: "task::0",
        window: { closed: false, minimized: false },
        title: "task-0",
        createdAt: 1000,
      } as System.Process.Instance,
      "task::1": {
        id: "task::1",
        window: { closed: true, minimized: false },
        title: "task-1",
        createdAt: 1000,
      } as System.Process.Instance,
      "task::2": {
        id: "task::2",
        window: { closed: false, minimized: true },
        title: "task-2",
        createdAt: 1000,
      } as System.Process.Instance,
      "worker::0": {
        id: "worker::0",
        window: { closed: false, minimized: false },
        title: "worker-0",
        createdAt: 1000,
      } as System.Process.Instance,
    };
  });

  describe("findProcessesInstanceById", () => {
    it("must return the process instance if the ID exists", () => {
      const process = findProcessesInstanceById("task::1", processes);
      expect(process).toBeDefined();
      expect(process?.id).toBe("task::1");
      expect(process?.window.closed).toBe(true);
    });

    it("must return undefined if the ID does not exist", () => {
      const process = findProcessesInstanceById("unknown::0", processes);
      expect(process).toBeUndefined();
    });
  });

  describe("setProcessesInstanceById", () => {
    it("must return the exact original processes object if ID is not found", () => {
      const result = setProcessesInstanceById("unknown::0", processes, { title: "New Name" });
      expect(result).toBe(processes);
    });

    it("must update the process using an object updater and return a new object", () => {
      const result = setProcessesInstanceById("task::0", processes, {
        window: { minimized: true },
      });

      expect(result["task::0"].window.minimized).toBe(true);
      expect(result["task::0"].window.closed).toBe(false);
      expect(result["task::0"].title).toBe("task-0");
      expect(result).not.toBe(processes);
    });

    it("must update the process using a functional updater", () => {
      const result = setProcessesInstanceById("task::1", processes, (prev) => ({
        title: `${prev.title} Updated`,
      }));

      expect(result["task::1"].title).toBe("task-1 Updated");
      expect(result["task::1"].window.closed).toBe(true);
    });
  });

  describe("findVisibleProcessId", () => {
    const orders = ["task::0", "task::1", "task::2", "worker::0"];

    it("must return the last process ID in orders that is not closed and not minimized", () => {
      const result = findVisibleProcessId("none", processes, orders);
      expect(result).toBe("worker::0");
    });

    it("must skip the ID provided in the first argument", () => {
      const result = findVisibleProcessId("worker::0", processes, orders);
      expect(result).toBe("task::0");
    });

    it("must return null if all matching processes are closed or minimized", () => {
      const closedOrMinimizedOrders = ["task::1", "task::2"];
      const result = findVisibleProcessId("none", processes, closedOrMinimizedOrders);
      expect(result).toBeNull();
    });

    it("must return null if an order ID does not exist in the processes record", () => {
      const invalidOrders = ["ghost::0", "ghost::1"];
      const result = findVisibleProcessId("none", processes, invalidOrders);
      expect(result).toBeNull();
    });
  });
});

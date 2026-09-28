import { difference, groupBy, isNotNil, range } from "es-toolkit";
import type { System } from "#/system/types.ts";
import { PROCESS_ID_DELIMITER } from "#/system/constants.ts";

export class ProcessIdentifier {
  static #instance: ProcessIdentifier | null = null;

  #counter: Map<string, number> = new Map<string, number>();
  #cached: Map<string, Set<number>> = new Map<string, Set<number>>();
  #delimiter: string = PROCESS_ID_DELIMITER;

  private constructor() {
    if (ProcessIdentifier.#instance) {
      return ProcessIdentifier.#instance;
    }
    ProcessIdentifier.#instance = this;
  }
  /**
   *
   * @param {string} id
   * @returns {string}
   */
  public allocate(id: string): string {
    const cached = this.#cached.get(id);

    if (cached && cached.size > 0) {
      const available = Math.min(...cached);
      cached.delete(available);

      return `${id}${this.#delimiter}${available}`;
    }

    const current = this.#counter.get(id) ?? 0;
    this.#counter.set(id, current + 1);

    return `${id}${this.#delimiter}${current}`;
  }

  /**
   *
   * @param {string} pid
   * @returns {void}
   */
  public release(pid: string): void {
    const parsed = this.#parse(pid);
    if (!parsed) return;

    let cached = this.#cached.get(parsed.id);
    if (!cached) {
      cached = new Set<number>();
      this.#cached.set(parsed.id, cached);
    }

    cached.add(parsed.sequence);
  }

  /**
   * @returns {void}
   */
  public dispose(): void {
    this.#counter.clear();
    this.#cached.clear();
  }

  /**
   * DO NOT use this. This exists only for devtools
   * @param {Iterable<string>} pids
   * @returns {void}
   */
  public sync(pids: Iterable<string>): void {
    this.dispose();

    const parsed = Array.from(pids, (pid) => this.#parse(pid)).filter(isNotNil);
    const groups = groupBy(parsed, (item) => item.id);

    for (const [id, items] of Object.entries(groups)) {
      const sequences = items.map((item) => item.sequence);
      const next = Math.max(...sequences) + 1;
      const gaps = difference(range(next), sequences);

      this.#counter.set(id, next);
      if (gaps.length > 0) this.#cached.set(id, new Set(gaps));
    }
  }

  /**
   *
   * @param {string} pid
   * @returns {System.Process.SequenceId | null}
   */
  #parse(pid: string): System.Process.SequenceId | null {
    const index = pid.lastIndexOf(this.#delimiter);
    if (index === -1) return null;

    const sequence = parseInt(pid.slice(index + this.#delimiter.length), 10);
    if (isNaN(sequence)) return null;

    return {
      id: pid.slice(0, index),
      sequence,
    };
  }

  /**
   *
   * @returns {ProcessIdentifier}
   */
  static instance(): ProcessIdentifier {
    return (this.#instance ??= new ProcessIdentifier());
  }
}

export const identifier = ProcessIdentifier.instance();

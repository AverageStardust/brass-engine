export type UnknownFunction = (...rest: unknown[]) => unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassOf<T> = new (...args: any[]) => T;
export type Opaque<T, S> = T & { __opaque__: S; };
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Nullish = null | undefined;
export type Opaque<T, S> = T & { __opaque__: S; };
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type TupleOf<N extends number, T> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type ReadonlyTupleOf<N extends number, T> = N extends N
    ? number extends N
        ? readonly T[]
        : _ReadonlyTupleOf<T, N, []>
    : never;
type _ReadonlyTupleOf<
    T,
    N extends number,
    R extends readonly unknown[],
> = R["length"] extends N ? R : _ReadonlyTupleOf<T, N, readonly [T, ...R]>;

export type Successor<R extends number[]> = [...R, R["length"]];
export type ReadonlySuccessor<R extends readonly number[]> = readonly [
    ...R,
    R["length"],
];
export type Predecessor<R extends number[]> = R extends [
    ...infer Rest,
    infer Last,
]
    ? Rest
    : R;
export type ReadonlyPredecessor<R extends readonly number[]> = R extends [
    ...infer Rest,
    infer Last,
]
    ? Rest
    : R;
export type Count<N extends number> = N extends N
    ? number extends N
        ? number[]
        : _Count<N, []>
    : never;
type _Count<N extends number, R extends number[]> = R["length"] extends N
    ? R
    : _Count<N, Successor<R>>;
export type ReadonlyCount<N extends number> = N extends N
    ? number extends N
        ? readonly number[]
        : _ReadonlyCount<N, []>
    : never;
type _ReadonlyCount<
    N extends number,
    R extends readonly number[],
> = R["length"] extends N ? R : _ReadonlyCount<N, ReadonlySuccessor<R>>;

export type Indices<N extends number> = Count<N>[number];

export type Increment<N extends number> = Successor<Count<N>>["length"];
export type Decrement<N extends number> = Predecessor<Count<N>>["length"];
export type Add<A extends number, B extends number> = [
    ...Count<A>,
    ...Count<B>,
]["length"];

export type Values<T> = T[keyof T];

export type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
export type ReadonlyUntil<Depth extends number, T> = Depth extends 0
    ? T
    : {
          readonly [P in keyof T]: ReadonlyUntil<Decrement<Depth>, T[P]>;
      };
export type ReadonlyAt<Depth extends number, T> = Depth extends 0
    ? Readonly<T>
    : {
          [P in keyof T]: ReadonlyAt<Decrement<Depth>, T[P]>;
      };
let a: ReadonlyUntil<1, { 1: { 2: {} } }>;

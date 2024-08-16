import { TupleOf } from "./types";

class A<T> {}
class B<T> extends A<T> {}

const F = <T>() => class {};
// class C<T> extends F<T>() {}

const adt = undefined as any as <T extends Record<string, () => unknown>>(
    def: T,
) => {
    [K in keyof T]: <U extends T[K]>(
        value: ReturnType<U>,
    ) => {
        tag: K;
        value: ReturnType<U>;
    };
};

const def = {
    Ok: <T>(): T => undefined as T,
    Err: <E>(): E => undefined as E,
};
type d = typeof def;
let tod: {
    [K in keyof d]: <U extends d[K]>(
        value: ReturnType<U>,
    ) => {
        tag: K;
        value: ReturnType<U>;
    };
};
let res = adt<typeof def>(def);
let kk = res.Err(2);

type ResultOk<T> = { tag: "Ok"; value: T };
type ResultErr<E> = { tag: "Err"; value: E };
type Result<T, E> = ResultOk<T> | ResultErr<E>;

const Result = {
    Ok: <T>(value: T): ResultOk<T> => ({ tag: "Ok", value }),
    Err: <E>(value: E): ResultErr<E> => ({ tag: "Err", value }),
};

let a = Result.Ok(2);
let x: Result<number, string> = a;

// Option<T>
// - Some: T
// - None
//
// map<U>
// - Some, (f: (t: T) => U) => Some<U>
// - None => None
// - Option, (f: (t: T) => U) => Option<U>
// (f: (t: T) => U) => self.tag === "Some" ? Some(f(self.value)) : None;
//
// is_some
// - Some => true
// - None => false
// - Option => boolean
// () => self.tag === "Some";
//
// and_then
// - Some, (f: (t: T) => Option<T>) => Option<T>
// - None => None
// - Option, (f: (t: T) => Option<T>) => Option<T>

namespace Option {
    export type Some<T> = { tag: "Some"; value: T };
    export const Some = <T>(value: T): Some<T> => ({ tag: "Some", value });

    export type None = { tag: "None"; value?: undefined };
    export const None: None = { tag: "None" };

    type map = {
        <T, U>(self: Some<T>, f: (t: T) => U): Some<U>;
        (self: None, f?: (t: any) => any): None;
        <T, U>(self: Option<T>, f: (t: T) => U): Option<U>;
    };
    const mapImpl = <T, U>(self: Option<T>, f: (t: T) => U) =>
        self.tag === "Some" ? Some(f(self.value)) : None;
    export const map = mapImpl as map;

    type isSome = {
        <T>(self: Some<T>): true;
        (self: None): false;
        <T>(self: Option<T>): self is Some<T>;
    };
    const isSomeImpl = <T>(self: Option<T>) => self.tag === "Some";
    export const isSome = isSomeImpl as isSome;

    type isNone = {
        <T>(self: Some<T>): false;
        (self: None): true;
        <T>(self: Option<T>): self is None;
    };
    const isNoneImpl = <T>(self: Option<T>) => self.tag === "None";
    export const isNone = isNoneImpl as isNone;

    type and = {
        (self: None, other?: Option<any>): None;
        (self: Option<any>, other: None): None;
        <T, U>(self: Some<T>, other: Some<U>): Some<U>;
        <T, U>(self: Option<T>, other: Option<U>): Option<U>;
    };
    const andImpl = <T, U>(self: Option<T>, other: Option<U>) =>
        self.tag === "None" ? self : other;
    export const and = andImpl as and;

    type andThen = {
        (self: None, f?: (t: any) => any): None;
        <T, U>(self: Some<T>, f: (t: T) => U): Some<U>;
        <T, U>(self: Option<T>, f: (t: T) => U): Option<U>;
    };
    const andThenImpl = <T, U>(self: Option<T>, f: (t: T) => U) =>
        self.tag === "None" ? self : Some(f(self.value));
    export const andThen = andThenImpl as andThen;

    type isSomeAnd = {
        <T>(self: Option<T>, f: (t: T) => boolean): self is Some<T>;
    }
}
type Option<T> = Option.Some<T> | Option.None;

const nm = Option.Some(2);
Option.None;
const oops: Option<number> = nm;
let xy = Option.map(oops, n => n * 2);
let g = Option.and(Option.Some(2), Option.Some("s"));

let v = oops.value;
if (Option.isSome(oops)) {
    oops.value
}

function f(opt:Option<number>) {
    if (Option.isSome(opt)) {
        opt.value += 10;
    }
}


// class Result<T, E> {
//     constructor(tag: "Err", value: E);
//     constructor(tag: "Ok", value: T);
//     constructor(tag: "Ok" | "Err", value: T | E) {
//         this.tag = tag;
//         this.value = value;
//     }

//     private tag: "Ok" | "Err";
//     private value: T | E;

//     // static Ok<T>(value: T) {
//     //     return new Result<T, unknown>("Ok", value);
//     // }
//     // static Err<T, E>(value: E) {
//     //     return new Result<T, E>("Err", value);
//     // }
//     static Ok = class<T> {
//         private tag: "Ok" = "Ok";
//         constructor(private value: T) {}
//     };

//     indict_err(_: E) {}
// }

// let g = new Result.Ok(3);
// g.indict_err("hi");

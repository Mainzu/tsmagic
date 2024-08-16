type ValueOf<T> = T[keyof T];
type OptionalPropertyOf<T extends object> = Exclude<
    {
        [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
>;

type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K;
}[keyof T];
// test
type test = RequiredKeys<{ a?: number; b: string }>;

type ADT<Def extends Record<string, unknown>> = ValueOf<{
    [K in keyof Def]: Def[K] extends undefined
        ? { tag: K; value?: undefined }
        : {
              tag: K;
              value: Def[K];
          };
}>;
type Def<ADT extends { tag: string; value: unknown }> = {
    [K in ADT["tag"]]: Extract<ADT, { tag: K }>["value"];
};

/**
 * A hacky utility to store a type in a JS variable without having to actually instantiate it.
 * Use `ReturnType` to retrieve the type stored.
 *
 * Why would I want to do this? Long story short,
 * it's because literal type can't be used as value.
 *
 * How did that lead to this? At first, I wanted to create a function
 * where a literal type is used as a value (using an actual literal).
 * However, since that wasn't
 * possible, I'm using the keys of an object to do that. To keep the type
 * information, I use this *thing*.
 *
 * @template T type to store
 */
const ty = <T>() => undefined as T;

type adtInputReq = Record<string, typeof ty<any> | undefined>;

const adt = <T extends adtInputReq>(obj: T) =>
    Object.fromEntries(
        Object.entries(obj).map(([tag]) => [tag, (value) => ({ tag, value })])
    ) as {
        [K in keyof T]: T[K] extends (value: any) => any
            ? (value: ReturnType<T[K]>) => {
                  tag: K;
                  value: ReturnType<T[K]>;
              }
            : () => {
                  tag: K;
                  value?: undefined;
              };
    };

// 💀 I can't remember what this does
type M<T extends Record<string, (value: any) => { value: any }>> = {
    [K in keyof T]: ReturnType<T[K]>["value"];
};

// Convert the typeof ADT convenience object (obtained from `adt`) to its corresponding ADT type
type ADTInfer<T extends ReturnType<typeof adt<any>> | ((...args: any) => any)> =
    ADT<M<T extends (...args: any) => any ? ReturnType<T> : T>>;

export type { ValueOf, ADT, ADTInfer, Def, M };
export { adt, ty };

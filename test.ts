import { adt, ty, ADTInfer, Def, M, ADT } from "./adt";

type a = undefined extends () => undefined ? true : false;
const Opt = <T>() =>
    adt({
        Some: ty<T>,
        None: undefined,
    });
type Opt<T> = ADTInfer<typeof Opt<T>>;
type Example = Opt<number>;

const OptNumber = Opt<number>();
const opt: Opt<number> = { tag: "None" };
Opt<number>().None().value;
const opta: Opt<number> = { tag: "Some", value: 2 };

console.log(Opt().None());
Opt<number>().Some(5);

let sexx = Opt().Some(5);

const Result = <T, E>() =>
    adt({
        Ok: ty<T>,
        Err: ty<E>,
    });
type Result<T, E> = ADTInfer<typeof Result<T, E>>;

const x: Result<number, string> = {
    tag: "Err",
    value: "no",
};

const Shape = adt({
    Circle: ty<{ radius: number }>,
    Rectangle: ty<{ width: number; height: number }>,
});
type Shape = ADTInfer<typeof Shape>;

const a = Shape.Circle({ radius: 5 });
const myCircle = Shape.Circle({ radius: 10 });
const s: Shape = a;

function calculateArea(shape: Shape): number {
    switch (shape.tag) {
        case "Circle":
            return Math.PI * shape.value.radius ** 2;
        case "Rectangle":
            return shape.value.width * shape.value.height;
    }
}

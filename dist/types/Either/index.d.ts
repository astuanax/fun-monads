import { Option } from '../Option';
import Functor from '../Functor';
export declare class RightM<A, B> implements Functor<A, B, Either<A, B>> {
    readonly type: string;
    readonly value: B;
    readonly isRight: boolean;
    readonly isLeft: boolean;
    constructor(value: B);
    left: any;
    right: any;
    get: any;
    fold: any;
    map: any;
    flatMap: any;
    forEach: any;
    getOrElse: any;
    forAll: any;
    exists: any;
    toList: any;
    filter: any;
    swap(): Either<B, A>;
}
export declare class LeftM<A, B> implements Functor<A, B, Either<A, B>> {
    readonly type: string;
    readonly value: A;
    readonly isRight: boolean;
    readonly isLeft: boolean;
    constructor(value: A);
    left: any;
    right: any;
    get: any;
    fold: any;
    map: any;
    flatMap: any;
    forEach: any;
    getOrElse: any;
    forAll: any;
    exists: any;
    toList: any;
    filter: any;
    swap(): Either<B, A>;
}
export declare function Either<A, B>(value: B): Either<A, B>;
export declare function Right<A, B>(value: B): Either<A, B>;
export declare function Left<A, B>(value: A): Either<A, B>;
export declare type Left<A, B> = LeftM<A, B>;
export declare type Right<A, B> = RightM<A, B>;
export declare type Either<A, B> = Left<A, B> | Right<A, B>;
export declare namespace Either {
    function apply<A, B>(value: B): Either<A, B>;
    function of<A, B>(value: B): Either<A, B>;
    function get<A, B>(e: Either<A, B>): A | B;
    function fold<A, B, C>(l: (a: A) => C, r: (b: B) => C, e: Either<A, B>): C;
    function map<A, B, C>(f: (x: A | B) => C, e: Either<A, B>): Either<A, C> | Either<C, A>;
    function flatMap<A, B, A1, B1>(f: (a: A) => Either<A1, B1>, e: Either<A, B>): Either<A1, B1>;
    function swap<A, B>(e: Either<A, B>): Either<B, A>;
    function forEach<A, B, C>(f: (x: A | B) => void, e: Either<A, B>): void;
    function getOrElse<A, B, A1, B1>(x: Either<A1, B1>, e: Either<A, B>): Either<A1, B1>;
    function forAll<A, B>(p: (b: B) => boolean, e: Either<A, B>): boolean;
    function exists<A, B>(p: (b: B) => boolean, e: Either<A, B>): boolean;
    function toList<A, B>(e: Either<A, B>): B[] | A[];
    function filter<A, B>(p: (a: A) => boolean, e: Either<A, B>): Option<Either<A, B>>;
}

export declare class Success<A> {
    readonly type: string;
    readonly value: A;
    isSuccess: boolean;
    isFailure: boolean;
    constructor(value: A);
    flatMap<B>(f: (x: A) => Try<B>): Try<B>;
    map<B>(f: (x: A) => B): Try<B>;
    fold<B>(f: (x: Error) => B, s: (x: A) => B): B;
    get(): A;
    getOrElse<B>(b: () => B): A | B;
    orElse<B>(b: Try<B>): Try<A> | Try<B>;
    flatten(): Try<A>;
    forEach(fn: (a: A) => any): void;
    filter(p: (a: A) => boolean): Try<A>;
    recover<B>(pf: (x: Error) => Try<B>): Try<B>;
    failed(): Try<A> | Try<Error>;
    ap<B>(fa: Try<(a: A) => B>): Try<B>;
}
export declare class Failure<A> {
    readonly type: string;
    readonly value: Error;
    isSuccess: boolean;
    isFailure: boolean;
    constructor(value: Error);
    flatMap<B>(f: (x: A) => Try<B>): Try<B>;
    map<B>(f: (x: A) => B): Try<B>;
    fold<B>(f: (x: Error) => B, s: (x: A) => B): B;
    get(): A;
    getOrElse<B>(b: () => B): A | B;
    orElse<B>(b: Try<B>): Try<A> | Try<B>;
    flatten(): Try<A>;
    forEach(fn: (a: A) => any): void;
    filter(p: (a: A) => boolean): Try<A>;
    recover<B>(pf: (x: Error) => Try<B>): Try<B>;
    failed(): Try<A> | Try<Error>;
    ap<B>(fa: Try<(a: A) => B>): Try<B>;
}
export declare type Try<A> = Success<A> | Failure<A>;
export declare function Try<A>(value: () => A): Try<A>;
export declare namespace Try {
    function success<A>(value: A): Try<A>;
    function failure<A>(value: Error): Try<A>;
    function apply<A>(value: () => A): Try<A>;
    function isSuccess<A>(a: Try<A>): boolean;
    function isFailure<A>(a: Try<A>): boolean;
    function flatMap<A, B>(f: (x: A) => Try<B>, a: Try<A>): Try<B>;
    function map<A, B>(f: (x: A) => B, a: Try<A>): Try<B>;
    function fold<A, B>(f: (x: Error) => B, s: (x: A) => B, a: Try<A>): B;
    function get<A>(a: Try<A>): A;
    function getOrElse<A, B>(b: () => B, a: Try<A>): A | B;
    function orElse<A, B>(b: Try<B>, a: Try<A>): Try<A> | Try<B>;
    function flatten<A>(a: Try<A>): Try<A>;
    function forEach<A>(fn: (a: A) => any, a: Try<A>): void;
    function filter<A>(p: (a: A) => boolean, a: Try<A>): Try<A>;
    function recover<A, B>(pf: (x: Error) => Try<B>, a: Try<A>): Try<B>;
    function failed<A>(a: Try<A>): Try<A> | Try<Error>;
    function ap<A, B>(f: Try<(a: A) => B>, a: Try<A>): Try<B>;
}

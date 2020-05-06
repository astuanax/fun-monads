export declare class Success<A> {
    readonly type: string;
    readonly value: A;
    constructor(value: A);
    isSuccess: boolean;
    isFailure: boolean;
    flatMap<B>(f: (x: A | Error) => Try<B>): Try<B>;
    map<B>(f: (x: A | Error) => B): Try<B>;
    fold<B>(f: (x: Error) => B, s: (x: A) => B): B;
    get(): A;
    getOrElse<B>(b: () => B): A | B;
    orElse<B>(b: () => Try<B>): Try<A> | Try<B>;
    flatten<B>(): Try<B>;
    forEach(fn: (a: A) => any): void;
    filter(p: (a: A) => boolean): Try<A>;
    recover<B>(pf: (x: A | Error) => Try<B>): Try<A> | Try<B>;
    failed(): Try<A>;
}
export declare class Failure<A> {
    readonly type: string;
    readonly value: Error;
    constructor(value: Error);
    isSuccess: boolean;
    isFailure: boolean;
    flatMap<B>(f: (x: A | Error) => Try<B>): Try<B>;
    map<B>(f: (x: A | Error) => B): Try<B>;
    fold<B>(f: (x: Error) => B, s: (x: A) => B): B;
    get(): A;
    getOrElse<B>(b: () => B): A | B;
    orElse<B>(b: () => Try<B>): Try<A> | Try<B>;
    flatten<B>(): Try<B>;
    forEach(fn: (a: A) => any): void;
    filter(p: (a: A) => boolean): Try<A>;
    recover<B>(pf: (x: A | Error) => Try<B>): Try<A> | Try<B>;
    failed(): Try<Error>;
}
export declare type Try<A> = Success<A> | Failure<A>;
export declare function Try<A>(value: () => A): Try<A>;
export declare namespace Try {
    function success<A>(value: A): Try<A>;
    function failure<A>(value: Error): Try<A>;
    function apply<A>(value: () => A): Try<A>;
    function isSuccess<A>(a: Try<A>): boolean;
    function isFailure<A>(a: Try<A>): boolean;
    function flatMap<A, B>(a: Try<A>, f: (x: A | Error) => Try<B>): Try<B>;
    function map<A, B>(a: Try<A>, f: (x: A | Error) => B): Try<B>;
    function fold<A, B>(a: Try<A>, f: (x: Error) => B, s: (x: A) => B): B;
    function get<A>(a: Try<A>): A;
    function getOrElse<A, B>(a: Try<A>, b: () => B): A | B;
    function orElse<A, B>(a: Try<A>, b: () => Try<B>): Try<A> | Try<B>;
    function flatten<A, B>(a: Try<A>): Try<B>;
    function forEach<A>(a: Try<A>, fn: (a: A) => any): void;
    function filter<A>(a: Try<A>, p: (a: A) => boolean): Try<A>;
    function recover<A, B>(a: Try<A>, pf: (x: A | Error) => Try<B>): Try<A> | Try<B>;
    function failed<A>(a: Try<A>): Try<A> | Try<Error>;
}

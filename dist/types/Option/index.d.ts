export declare class None<A> {
    readonly type: string;
    isNone(): boolean;
    isSome(): boolean;
    isEmpty: () => boolean;
    isDefined: () => boolean;
    get(): A;
    map<B>(f: (a: A) => B): Option<B>;
    flatMap<B>(f: (a: A) => Option<B>): Option<B>;
    getOrElse(x: A): A;
    flatten(): Option<A>;
    orElse<B>(b: Option<B>): Option<A> | Option<B>;
    toList(): A[];
    ap<B>(fa: Option<(a: A) => B>): Option<B>;
    filter(p: (a: A) => boolean): Option<A>;
    has(p: (a: A) => boolean): boolean;
    exists: (p: (a: A) => boolean) => boolean;
    forEach(fn: (a: A) => any): void;
}
export declare class Some<A> {
    readonly type: string;
    readonly value: A;
    constructor(value: A);
    isNone(): boolean;
    isSome(): boolean;
    isEmpty: () => boolean;
    isDefined: () => boolean;
    get(): A;
    map<B>(f: (a: A) => B): Option<B>;
    flatMap<B>(f: (x: A) => Option<B>): Option<B>;
    getOrElse(x: A): A;
    flatten(): Option<A>;
    orElse<B>(b: Option<B>): Option<A> | Option<B>;
    toList(): A[];
    ap<B>(fa: Option<(a: A) => B>): Option<B>;
    filter(p: (a: A) => boolean): Option<A>;
    has(p: (a: A) => boolean): boolean;
    exists: (p: (a: A) => boolean) => boolean;
    forEach(fn: (a: A) => any): void;
}
export declare type Option<A> = None<A> | Some<A>;
export declare function Option<A>(value: A): Option<A>;
export declare namespace Option {
    function none<A>(): Option<A>;
    const empty: typeof none;
    function some<A>(a: A): Option<A>;
    function apply<A>(a: A): Option<A>;
    function isSome<A>(fa: Option<A>): boolean;
    function isNone<A>(fa: Option<A>): boolean;
    const isEmpty: typeof isNone;
    const isDefined: typeof isSome;
    function get<A>(a: Option<A>): A;
    function map<A, B>(f: (x: A) => B, a: Option<A>): Option<B>;
    function flatMap<A, B>(f: (x: A) => Option<B>, a: Option<A>): Option<B>;
    function getOrElse<A>(x: A, a: Option<A>): A;
    function flatten<A>(a: Option<Option<A>>): Option<A>;
    function ap<A, B>(f: Option<(a: A) => B>, a: Option<A>): Option<B>;
    function filter<A>(p: (a: A) => boolean, a: Option<A>): Option<A>;
    function has<A>(p: (a: A) => boolean, a: Option<A>): boolean;
    const exists: typeof has;
    function forEach<A>(f: (a: A) => any, a: Option<A>): void;
    function orElse<A, B>(b: Option<B>, a: Option<A>): Option<A> | Option<B>;
}

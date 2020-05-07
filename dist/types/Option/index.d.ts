/**
 * Class `None<A>` represents non-existent values of type `A`.
 *
 * ```typescript
 * const s: None<any> = new None<any>()
 * const t: None<any> = Option.none
 * const u: None<any> = Option(null)
 * const v: None<any> = Option(undefined)
 * const w: None<any> = Option.some(null)
 * const x: None<any> = Option.some(undefined)
 * const y: None<any> = Option.apply(null)
 * const z: None<any> = Option.apply(undefined)
 * ```
 */
export declare class None<A> {
    readonly type: string;
    /**
     * Returns true if the option is None, false otherwise.
     */
    isNone: boolean;
    /**
     * Returns true if the option is an instance of Some, false otherwise.
     */
    isSome: boolean;
    /**
     * isEmpty is a convenience shortcut to {@link isNone}
     */
    isEmpty: boolean;
    /**
     * isSome is a convenience shortcut to {@link isSome}
     */
    isDefined: boolean;
    /**
     * get throws an Error if this is a None
     */
    get(): A;
    /** Returns a Some containing the result of applying $f to this $option's
     * value if this $option is nonempty.
     * Otherwise return $none.
     *
     *  ```typescript
     *  const f = (x:number): number => x * 2;
     *  const o = Option<number>(5)
     *  const result = o.map(f).getOrElse(-1) // 10
     *  ```
     *
     *  @note This is similar to `flatMap` except here,
     *  $f does not need to wrap its result in an $option.
     *
     *  @see {@link flatMap}
     *  @see {@link forEach}
     */
    map<B>(f: (a: A) => B): Option<B>;
    /** Returns the result of applying $f to this Option's value if
     * this Option is nonempty.
     * Returns None if this Option is empty.
     * Slightly different from `map` in that $f is expected to
     * return an Option (which could be None).
     *
     *  ```typescript
     *  const f = (x:number) => Option(undefined);
     *  const o = Option<number>(5)
     *  const result = o.flatMap(f).getOrElse(-1) // -1
     *  ```
     *
     *  @param  f   the function to apply
     *  @return Returns None in all cases
     *  @see {@link map}
     *  @see {@link forEach}
     */
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
/**
 * Class `Some<A>` represents existing values of type `A`.
 * Some never contains null or undefined.
 *
 * ```typescript
 * const a:any = "anything"
 * const b: Some<any> = new Some<any>(a)
 * const c: Some<any> = Option.some(a)
 * const d: Some<any> = Option(a)
 * const e: Some<any> = Option.some(a)
 * const f: Some<any> = Option.apply(a)
 * ```
 */
export declare class Some<A> {
    readonly type: string;
    readonly value: A;
    constructor(value: A);
    isNone: boolean;
    isSome: boolean;
    isEmpty: boolean;
    isDefined: boolean;
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
    function flatten<A>(a: Option<A>): Option<A>;
    function ap<A, B>(f: Option<(a: A) => B>, a: Option<A>): Option<B>;
    function filter<A>(p: (a: A) => boolean, a: Option<A>): Option<A>;
    function has<A>(p: (a: A) => boolean, a: Option<A>): boolean;
    const exists: typeof has;
    function forEach<A>(f: (a: A) => void, a: Option<A>): void;
    function orElse<A, B>(b: Option<B>, a: Option<A>): Option<A> | Option<B>;
}

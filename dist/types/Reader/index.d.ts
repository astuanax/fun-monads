import Functor from '../Functor';
export declare class ReaderM<A, Config extends any> implements Functor<A, any, Reader<A, Config>> {
    readonly type: string;
    readonly value: (a: Config) => A;
    constructor(value: (a: Config) => A);
    run(config: Config): A;
    get(config: Config): A;
    map<B>(f: (x: A) => B): Reader<B, Config>;
    flatMap<B>(f: (x: A) => Reader<B, Config>): Reader<B, Config>;
    ap<B>(fa: Reader<(a: A) => B, undefined>): Reader<B, Config>;
    zip<B extends A>(other: Reader<A, Config>): Reader<B[], Config>;
}
export declare type Reader<A, Config extends any> = ReaderM<A, Config>;
export declare function Reader<A, Config>(value: (a: Config) => A): ReaderM<A, Config>;
export declare namespace Reader {
    function of<A>(value: A): ReaderM<A, undefined>;
    function apply<A, Config>(fn: (a: Config) => A): ReaderM<A, Config>;
    function run<A, Config>(config: Config, r: Reader<A, Config>): A;
    function get<A, Config>(config: Config, r: Reader<A, Config>): A;
    function map<A, B, Config>(f: (x: A) => B, r: Reader<A, Config>): Reader<B, Config>;
    function flatMap<A, B, Config>(f: (x: A) => Reader<B, Config>, r: Reader<A, Config>): Reader<B, Config>;
    function ap<A, B, Config>(fa: Reader<(c: A) => B, undefined>, r: Reader<A, Config>): Reader<B, Config>;
    function zip<A, B extends A, Config>(other: Reader<A, Config>, r: Reader<A, Config>): Reader<B[], Config>;
}

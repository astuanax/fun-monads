'use strict'

export class ReaderM<A, Config extends any> {
  readonly type: string = 'Reader'
  readonly value: (a: Config) => A

  constructor(value: (a: Config) => A) {
    this.value = value
    return this
  }

  run(config: Config): A {
    return this.value(config)
  }

  get(config: Config): A {
    return this.run(config)
  }

  map<B>(f: (x: A) => B): Reader<B, Config> {
    return new ReaderM(a => f(this.run(a)))
  }

  flatMap<B>(f: (x: A) => Reader<B, Config>): Reader<B, Config> {
    return new ReaderM((a: Config): B => f(this.run(a)).run(a))
  }

  ap<B>(fa: Reader<(a: A) => B, undefined>): Reader<B, Config> {
    return this.map<B>(fa.get(undefined))
  }

  zip<B extends A>(other: Reader<A, Config>): Reader<B[], Config> {
    return this.flatMap((a: A) => other.map((b: A) => [a as B, b as B]))
  }
}

export type Reader<A, Config extends any> = ReaderM<A, Config>

export function Reader<A, Config>(value: (a: Config) => A): ReaderM<A, Config> {
  return Reader.apply(value)
}

/* istanbul ignore next */
export namespace Reader {
  export function apply<A, Config>(fn: (a: Config) => A): ReaderM<A, Config> {
    return new ReaderM<A, Config>(fn)
  }

  export function run<A, Config>(config: Config, r: Reader<A, Config>): A {
    return r.run(config)
  }

  export function get<A, Config>(config: Config, r: Reader<A, Config>): A {
    return r.get(config)
  }

  export function map<A, B, Config>(f: (x: A) => B, r: Reader<A, Config>): Reader<B, Config> {
    return r.map(f)
  }

  export function flatMap<A, B, Config>(
    f: (x: A) => Reader<B, Config>,
    r: Reader<A, Config>
  ): Reader<B, Config> {
    return r.flatMap(f)
  }

  export function ap<A, B, Config>(
    fa: Reader<(c: A) => B, undefined>,
    r: Reader<A, Config>
  ): Reader<B, Config> {
    return r.ap(fa)
  }

  export function zip<A, B extends A, Config>(
    other: Reader<A, Config>,
    r: Reader<A, Config>
  ): Reader<B[], Config> {
    return r.flatMap((a: A) => other.map((b: A) => [a as B, b as B]))
  }
}

'use strict'

export class Success<A> {
  readonly type: string = 'Success'
  readonly value: A
  isSuccess: boolean = true
  isFailure: boolean = false

  constructor(value: A) {
    this.value = value
    return this
  }

  flatMap<B>(f: (x: A) => Try<B>): Try<B> {
    try {
      return f(this.value)
    } catch (err) {
      return new Failure<B>(err)
    }
  }

  map<B>(f: (x: A) => B): Try<B> {
    return Try.apply(() => f(this.value))
  }

  fold<B>(f: (x: Error) => B, s: (x: A) => B): B {
    return s(this.value)
  }

  get(): A {
    return this.value
  }

  getOrElse<B>(b: () => B): A | B {
    return this.value
  }

  orElse<B>(b: Try<B>): Try<A> | Try<B> {
    return this
  }

  flatten(): Try<A> {
    if (((this.value as unknown) as Try<A>).isSuccess) {
      return (this.get() as unknown) as Try<A>
    }
    return this
  }

  forEach(fn: (a: A) => any): void {
    fn(this.get())
  }

  filter(p: (a: A) => boolean): Try<A> {
    try {
      return p(this.get())
        ? this
        : new Failure<A>(new Error('Predicate does not hold for value ' + this.value))
    } catch (err) {
      return new Failure<A>(err)
    }
  }

  recover<B>(pf: (x: Error) => Try<B>): Try<B> {
    return new Success<B>((this.value as unknown) as B)
  }

  failed(): Try<A> | Try<Error> {
    return new Failure<A>(new Error('Unsupported operation. Success failed'))
  }

  ap<B>(fa: Try<(a: A) => B>): Try<B> {
    return this.map<B>(fa.get())
  }
}

export class Failure<A> {
  readonly type: string = 'Failure'
  readonly value: Error
  isSuccess: boolean = false
  isFailure: boolean = true

  constructor(value: Error) {
    this.value = value
    return this
  }

  flatMap<B>(f: (x: A) => Try<B>): Try<B> {
    return new Failure<B>(this.value)
  }

  map<B>(f: (x: A) => B): Try<B> {
    return new Failure<B>(this.value)
  }

  fold<B>(f: (x: Error) => B, s: (x: A) => B): B {
    return f(this.value)
  }

  get(): A {
    throw this.value
  }

  getOrElse<B>(b: () => B): A | B {
    return b()
  }

  orElse<B>(b: Try<B>): Try<A> | Try<B> {
    try {
      return b
    } catch (err) {
      return new Failure<B>(err)
    }
  }

  flatten(): Try<A> {
    return this
  }

  forEach(fn: (a: A) => any): void {
    // noop
  }

  filter(p: (a: A) => boolean): Try<A> {
    return this
  }

  recover<B>(pf: (x: Error) => Try<B>): Try<B> {
    try {
      return pf(this.value)
    } catch (err) {
      return new Failure<B>(err)
    }
  }

  failed(): Try<A> | Try<Error> {
    return new Success<Error>(this.value)
  }

  ap<B>(fa: Try<(a: A) => B>): Try<B> {
    return new Failure<B>(this.value)
  }
}

export type Try<A> = Success<A> | Failure<A>

export function Try<A>(value: () => A): Try<A> {
  return Try.apply(value)
}

export namespace Try {
  export function success<A>(value: A): Try<A> {
    return new Success<A>(value)
  }

  export function failure<A>(value: Error): Try<A> {
    return new Failure<A>(value)
  }

  export function apply<A>(value: () => A): Try<A> {
    try {
      return new Success<A>(value())
    } catch (err) {
      return new Failure<A>(err)
    }
  }

  export function isSuccess<A>(a: Try<A>): boolean {
    return a.isSuccess
  }

  export function isFailure<A>(a: Try<A>): boolean {
    return a.isFailure
  }

  export function flatMap<A, B>(f: (x: A) => Try<B>, a: Try<A>): Try<B> {
    return a.flatMap(f)
  }

  export function map<A, B>(f: (x: A) => B, a: Try<A>): Try<B> {
    return a.map(f)
  }

  export function fold<A, B>(f: (x: Error) => B, s: (x: A) => B, a: Try<A>): B {
    return a.fold(f, s)
  }

  export function get<A>(a: Try<A>): A {
    return a.get()
  }

  export function getOrElse<A, B>(b: () => B, a: Try<A>): A | B {
    return a.getOrElse(b)
  }

  export function orElse<A, B>(b: Try<B>, a: Try<A>): Try<A> | Try<B> {
    return a.orElse(b)
  }

  export function flatten<A>(a: Try<A>): Try<A> {
    return a.flatten()
  }

  export function forEach<A>(fn: (a: A) => any, a: Try<A>): void {
    return a.forEach(fn)
  }

  export function filter<A>(p: (a: A) => boolean, a: Try<A>): Try<A> {
    return a.filter(p)
  }

  export function recover<A, B>(pf: (x: Error) => Try<B>, a: Try<A>): Try<B> {
    return a.recover(pf)
  }

  export function failed<A>(a: Try<A>): Try<A> | Try<Error> {
    return a.failed()
  }

  export function ap<A, B>(f: Try<(a: A) => B>, a: Try<A>): Try<B> {
    return a.ap(f)
  }
}

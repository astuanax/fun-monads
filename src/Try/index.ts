'use strict'

export class Success<A> {
  readonly type: string = 'Success'
  readonly value: A

  constructor(value: A) {
    this.value = value
    return this
  }

  isSuccess: boolean = true
  isFailure: boolean = false

  flatMap<B>(f: (x: A | Error) => Try<B>): Try<B> {
    try {
      return f(this.value)
    } catch (err) {
      return new Failure<B>(err)
    }
  }

  map<B>(f: (x: A | Error) => B): Try<B> {
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

  orElse<B>(b: () => Try<B>): Try<A> | Try<B> {
    return this
  }

  flatten<B>(): Try<B> {
    if (this.value instanceof Try) {
      return this.value as unknown as Try<B>
    } else {
      return this as unknown as Try<B>
    }
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

  recover<B>(pf: (x: A | Error) => Try<B>): Try<A> | Try<B> {
    return this
  }

  failed(): Try<A> {
    return new Failure<A>(new Error('Unsupported operation. Success failed'))
  }

}

export class Failure<A> {
  readonly type: string = 'Failure'
  readonly value: Error

  constructor(value: Error) {
    this.value = value
    return this
  }

  isSuccess: boolean = false
  isFailure: boolean = true

  flatMap<B>(f: (x: A | Error) => Try<B>): Try<B> {
    return new Failure<B>(this.value)
  }

  map<B>(f: (x: A | Error) => B): Try<B> {
    return Try.apply(() => f(this.value))
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

  orElse<B>(b: () => Try<B>): Try<A> | Try<B> {
    try {
      return b()
    } catch (err) {
      return new Failure<B>(err)
    }
  }

  flatten<B>(): Try<B> {
    return new Failure<B>(this.value)
  }

  forEach(fn: (a: A) => any): void {
    // noop
  }

  filter(p: (a: A) => boolean): Try<A> {
    return this
  }

  recover<B>(pf: (x: A | Error) => Try<B>): Try<A> | Try<B> {
    try {
      return pf(this.value)
    } catch (err) {
      return new Failure<A>(err)
    }
  }

  failed(): Try<Error> {
    return new Success<Error>(this.value)
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

  export function flatMap<A, B>(a: Try<A>, f: (x: A | Error) => Try<B>): Try<B> {
    return a.flatMap(f)
  }

  export function map<A, B>(a: Try<A>, f: (x: A | Error) => B): Try<B> {
    return a.map(f)
  }

  export function fold<A, B>(a: Try<A>, f: (x: Error) => B, s: (x: A) => B): B {
    return a.fold(f, s)
  }

  export function get<A>(a: Try<A>): A {
    return a.get()
  }

  export function getOrElse<A, B>(a: Try<A>, b: () => B): A | B {
    return a.getOrElse(b)
  }

  export function orElse<A, B>(a: Try<A>, b: () => Try<B>): Try<A> | Try<B> {
    return a.orElse(b)
  }

  export function flatten<A, B>(a: Try<A>): Try<B> {
    return a.flatten()
  }

  export function forEach<A>(a: Try<A>, fn: (a: A) => any): void {
    return a.forEach(fn)
  }

  export function filter<A>(a: Try<A>, p: (a: A) => boolean): Try<A> {
    return a.filter(p)
  }

  export function recover<A, B>(a: Try<A>, pf: (x: A | Error) => Try<B>): Try<A> | Try<B> {
    return a.recover(pf)
  }

  export function failed<A>(a: Try<A>): Try<A> | Try<Error> {
    return a.failed()
  }
}



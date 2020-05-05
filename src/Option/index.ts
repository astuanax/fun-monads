'use strict'

export class None<A> {
  readonly type: string = "None"

  isNone(): boolean {
    return true
  }

  isSome(): boolean {
    return false
  }

  isEmpty = this.isNone
  isDefined = this.isSome

  get(): A {
    throw new Error('Unsupported operation None.get')
  }

  map<B>(f: (a: A) => B): Option<B> {
    return new None<B>()
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return new None<B>()
  }

  getOrElse(x: A): A {
    return x
  }

  flatten(): Option<A> {
    return new None<A>()
  }

  orElse<B>(b: Option<B>): Option<A> | Option<B> {
    return b
  }

  toList(): A[] {
    return []
  }

  ap<B>(fa: Option<(a: A) => B>): Option<B> {
    return new None<B>()
  }

  filter(p: (a: A) => boolean): Option<A> {
    return new None<A>()
  }

  has(p: (a: A) => boolean): boolean {
    return false
  }

  exists = this.has

  forEach(fn: (a: A) => any): void {
    // noop
  }

}

export class Some<A> {
  readonly type: string = 'Some'
  readonly value: A

  constructor(value: A) {
    this.value = value
    if (this.value == null) {
      throw new Error('null or undefined exception. Please use Option.apply')
    }
    return this
  }

  isNone(): boolean {
    return false
  }

  isSome(): boolean {
    return true
  }

  isEmpty = this.isNone
  isDefined = this.isSome

  get(): A {
    return this.value
  }

  map<B>(f: (a:A) => B): Option<B> {
    const res = f(this.value)
    return res == null
      ? new None<B>()
      : new Some<B>(res)
  }

  flatMap<B>(f: (x: A) => Option<B>): Option<B> {
    return f(this.value)
  }

  getOrElse(x: A): A {
    return this.get()
  }

  flatten(): Option<A> {
    if(this.value instanceof Option) {
      return this.value as unknown as Option<A>
    } else {
      return this
    }
  }

  orElse<B>(b: Option<B>): Option<A> | Option<B> {
    return this
  }

  toList(): A[] {
    return [this.get()]
  }

  ap<B>(fa: Option<(a:A) => B>): Option<B> {
    return this.map<B>(fa.get())
  }

  filter(p: (a:A) => boolean): Option<A> {
    return p(this.get())
      ? this
      : new None<A>()
  }

  has(p: (a:A) => boolean): boolean {
    return p(this.get())
  }

  exists = this.has

  forEach(fn: (a:A) => any): void {
    fn(this.get())
  }
}

export type Option<A> = None<A> | Some<A>

export function Option<A>(value: A): Option<A> {
  return Option.apply(value)
}

export namespace Option {
  export function none<A>(): Option<A> {
    return new None<A>()
  }

  export const empty = none

  export function some<A>(a: A): Option<A> {
    return a == null ? new None<A>() : new Some(a)
  }

  export function apply<A>(a: A): Option<A> {
    return some(a)
  }

  export function isSome<A>(fa: Option<A>): boolean {
    return fa.isSome()
  }

  export function isNone<A>(fa: Option<A>): boolean {
    return fa.isNone()
  }

  export const isEmpty = isNone
  export const isDefined = isSome

  export function get<A>(a:Option<A>): A {
    return a.get()
  }

  export function map<A, B>(f: (x:A) => B, a: Option<A>): Option<B> {
    return a.map(f)
  }

  export function flatMap<A, B>(f: (x:A) => Option<B>, a: Option<A>): Option<B> {
    return a.flatMap(f)
  }

  export function getOrElse<A>(x:A, a:Option<A>): A {
    return a.getOrElse(x)
  }

  export function flatten<A>(a: Option<Option<A>>): Option<A> {
    return a.getOrElse(new None<A>())
  }

  export function ap<A, B>(f: Option<(a:A) => B>, a: Option<A>): Option<B> {
    return a.ap(f)
  }

  export function filter<A>(p: (a:A) => boolean, a: Option<A>): Option<A> {
    return a.filter(p)
  }

  export function has<A>(p: (a:A) => boolean, a: Option<A>): boolean {
    return a.has(p)
  }

  export const exists = has

  export function forEach<A>(f: (a:A) => any, a: Option<A>): void {
    a.forEach(f)
  }

  export function orElse<A, B>(b: Option<B>, a: Option<A>): Option<A> | Option<B> {
    return a.orElse(b)
  }

}





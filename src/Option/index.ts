'use strict'
import Functor from '../Functor'

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
export class None<A> implements Functor<A, any, Option<A>> {
  readonly type: string = 'None'

  /**
   * Returns true if the option is None, false otherwise.
   */
  isNone: boolean = true

  /**
   * Returns true if the option is an instance of Some, false otherwise.
   */
  isSome: boolean = false

  /**
   * isEmpty is a convenience shortcut to {@link isNone}
   */
  isEmpty = this.isNone

  /**
   * isSome is a convenience shortcut to {@link isSome}
   */
  isDefined = this.isSome
  exists = this.has

  /**
   * get throws an Error if this is a None
   */
  get(): A {
    throw new Error('Unsupported operation None.get')
  }

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
  map<B>(f: (a: A) => B): Option<B> {
    return new None<B>()
  }

  /** Returns the result of applying $f to this Option's value if
   * this Option is nonempty.
   * Returns None if this Option is empty.
   * Slightly different from `map` in that $f is expected to
   * return an Option (which could be None).
   *
   * ```typescript
   * const f = (x:number) => Option(undefined);
   * const o = Option<number>(5)
   * const result = o.flatMap(f).getOrElse(-1) // -1
   * ```
   *
   * @param  f   the function to apply
   * @return Returns None in all cases
   * @see {@link map}
   * @see {@link forEach}
   */
  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return new None<B>()
  }

  getOrElse(x: A): A {
    return x
  }

  flatten(): Option<A> {
    return this
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

  forEach(fn: (a: A) => any): void {
    // noop
  }
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
export class Some<A> implements Functor<A, any, Option<A>> {
  readonly type: string = 'Some'
  readonly value: A
  isNone: boolean = false
  isSome: boolean = true
  isEmpty = this.isNone
  isDefined = this.isSome
  exists = this.has

  constructor(value: A) {
    this.value = value
    if (this.value == null) {
      throw new Error('null or undefined exception. Please use Option.apply')
    }
    return this
  }

  get(): A {
    return this.value
  }

  map<B>(f: (a: A) => B): Option<B> {
    const res = f(this.value)
    return res == null ? new None<B>() : new Some<B>(res)
  }

  flatMap<B>(f: (x: A) => Option<B>): Option<B> {
    return f(this.value)
  }

  getOrElse(x: A): A {
    return this.get()
  }

  flatten(): Option<A> {
    const v: Option<A> = (this.value as unknown) as Option<A>
    if (v && (v.isSome || v.isNone)) {
      return v
    }
    return this
  }

  orElse<B>(b: Option<B>): Option<A> | Option<B> {
    return this
  }

  toList(): A[] {
    return [this.get()]
  }

  ap<B>(fa: Option<(a: A) => B>): Option<B> {
    return this.map<B>(fa.get())
  }

  filter(p: (a: A) => boolean): Option<A> {
    return p(this.get()) ? this : new None<A>()
  }

  has(p: (a: A) => boolean): boolean {
    return p(this.get())
  }

  forEach(fn: (a: A) => any): void {
    fn(this.get())
  }
}

export type Option<A> = None<A> | Some<A>

export function Option<A>(value: A): Option<A> {
  return Option.apply(value)
}

/* istanbul ignore next */
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

  export function of<A>(a: A): Option<A> {
    return some(a)
  }

  export function isSome<A>(fa: Option<A>): boolean {
    return fa.isSome
  }

  export function isNone<A>(fa: Option<A>): boolean {
    return fa.isNone
  }

  export const isEmpty = isNone
  export const isDefined = isSome

  export function get<A>(a: Option<A>): A {
    return a.get()
  }

  export function map<A, B>(f: (x: A) => B, a: Option<A>): Option<B> {
    return a.map(f)
  }

  export function flatMap<A, B>(f: (x: A) => Option<B>, a: Option<A>): Option<B> {
    return a.flatMap(f)
  }

  export function getOrElse<A>(x: A, a: Option<A>): A {
    return a.getOrElse(x)
  }

  export function flatten<A>(a: Option<A>): Option<A> {
    return a.flatten()
  }

  export function ap<A, B>(f: Option<(a: A) => B>, a: Option<A>): Option<B> {
    return a.ap(f)
  }

  export function filter<A>(p: (a: A) => boolean, a: Option<A>): Option<A> {
    return a.filter(p)
  }

  export function has<A>(p: (a: A) => boolean, a: Option<A>): boolean {
    return a.has(p)
  }

  export const exists = has

  export function forEach<A>(f: (a: A) => void, a: Option<A>): void {
    a.forEach(f)
  }

  export function orElse<A, B>(b: Option<B>, a: Option<A>): Option<A> | Option<B> {
    return a.orElse(b)
  }
}

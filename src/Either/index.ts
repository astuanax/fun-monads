'use strict'
import { Option } from '../Option'
import Functor from '../Functor'

const leftProjection = <A, B>(that: Either<A, B>) => ({
  get: () => {
    if (that.isLeft) {
      return that.value
    }
    throw new Error('Unsupported operation')
  },
  getOrElse: <A1, B1>(x: Either<A1, B1>): Either<A1, B1> => {
    if (that.isLeft) {
      return (that as unknown) as Either<A1, B1>
    }
    return x
  },
  fold: <C>(l: (a: A) => C, r: (b: B) => C): C => {
    if (that.isLeft) {
      return l(that.value as A)
    } else {
      return r(that.value as B)
    }
  },
  map: <A1>(f: (a: A) => A1): Either<A1, B> => {
    if (that.isLeft) {
      return Left(f(that.value as A)).left
    }
    return (that as unknown) as Either<A1, B>
  },
  flatMap: <A1, B1>(f: (a: A) => Either<A1, B1>): Either<A1, B1> => {
    if (that.isLeft) {
      return f(that.value as A)
    }
    return (that as unknown) as Either<A1, B1>
  },
  forEach: (f: (a: A) => void): void => {
    if (that.isLeft) {
      f(that.value as A)
    }
  },
  forAll: (p: (a: A) => boolean): boolean => {
    if (that.isLeft) {
      return p(that.value as A)
    }
    return true
  },
  exists: (p: (a: A) => boolean): boolean => {
    if (that.isLeft) {
      return p(that.value as A)
    }
    return false
  },
  toList: (): A[] => {
    if (that.isLeft) {
      return [that.value as A]
    }
    return []
  },
  filter: (p: (a: A) => boolean): Option<Either<A, B>> => {
    if (that.isLeft && p(that.value as A)) {
      return Option.some(that)
    }
    return Option.none()
  },
  isRight: that.isRight,
  isLeft: that.isLeft
})

const rightProjection = <A, B>(that: Either<A, B>) => ({
  get: () => {
    if (that.isRight) {
      return that.value
    }
    throw new Error('Unsupported operation')
  },
  getOrElse: <A1, B1>(x: Either<A1, B1>): Either<A1, B1> => {
    if (that.isRight) {
      return (that as unknown) as Either<A1, B1>
    }
    return x
  },
  fold: <C>(l: (a: A) => C, r: (b: B) => C): C => {
    if (that.isRight) {
      return r(that.value as B)
    } else {
      return l(that.value as A)
    }
  },
  map: <B1>(f: (b: B) => B1): Either<A, B1> => {
    if (that.isRight) {
      return Right(f(that.value as B))
    }
    return (that as unknown) as Either<A, B1>
  },
  flatMap: <A1, B1>(f: (b: B) => Either<A1, B1>): Either<A1, B1> => {
    if (that.isRight) {
      return f(that.value as B)
    }
    return (that as unknown) as Either<A1, B1>
  },
  forEach: (f: (b: B) => void): void => {
    if (that.isRight) {
      f(that.value as B)
    }
  },
  forAll: (p: (b: B) => boolean): boolean => {
    if (that.isRight) {
      return p(that.value as B)
    }
    return true
  },
  exists: (p: (b: B) => boolean): boolean => {
    if (that.isRight) {
      return p(that.value as B)
    }
    return false
  },
  toList: (): A[] => {
    if (that.isRight) {
      return [that.value as A]
    }
    return []
  },
  filter: (p: (a: A) => boolean): Option<Either<A, B>> => {
    if (that.isRight && p(that.value as A)) {
      return Option.some(that)
    }
    return Option.none()
  },
  isRight: that.isRight,
  isLeft: that.isLeft
})

export class RightM<A, B> implements Functor<A, B, Either<A, B>> {
  readonly type: string = 'Right'
  readonly value: B
  readonly isRight: boolean = true
  readonly isLeft: boolean = false

  constructor(value: B) {
    this.value = value
    return this
  }

  left: any = leftProjection(this)
  right: any = rightProjection(this)

  get = this.right.get
  fold = this.right.fold
  map = this.right.map
  flatMap = this.right.flatMap
  forEach = this.right.forEach
  getOrElse = this.right.getOrElse
  forAll = this.right.forAll
  exists = this.right.exists
  toList = this.right.toList
  filter = this.right.filter

  swap(): Either<B, A> {
    return Left<B, A>(this.value)
  }
}

export class LeftM<A, B> implements Functor<A, B, Either<A, B>> {
  readonly type: string = 'Left'
  readonly value: A
  readonly isRight: boolean = false
  readonly isLeft: boolean = true

  constructor(value: A) {
    this.value = value
    return this
  }

  left: any = leftProjection(this)
  right: any = rightProjection(this)

  get = this.right.get
  fold = this.right.fold
  map = this.right.map
  flatMap = this.right.flatMap
  forEach = this.right.forEach
  getOrElse = this.right.getOrElse
  forAll = this.right.forAll
  exists = this.right.exists
  toList = this.right.toList
  filter = this.right.filter

  swap(): Either<B, A> {
    return Right<B, A>(this.value)
  }
}

export function Right<A, B>(value: B): Either<A, B> {
  return Either.apply<A, B>(value)
}

export function Left<A, B>(value: A): Either<A, B> {
  return new LeftM<A, B>(value)
}

export type Left<A, B> = LeftM<A, B>
export type Right<A, B> = RightM<A, B>
export type Either<A, B> = Left<A, B> | Right<A, B>

export namespace Either {
  export function apply<A, B>(value: B): Either<A, B> {
    return new RightM<A, B>(value)
  }

  export function of<A, B>(value: B): Either<A, B> {
    return new RightM<A, B>(value)
  }

  export function get<A, B>(e: Either<A, B>): A | B {
    return e.get()
  }

  export function fold<A, B, C>(l: (a: A) => C, r: (b: B) => C, e: Either<A, B>): C {
    return e.fold(l, r)
  }

  export function map<A, B, C>(f: (x: A | B) => C, e: Either<A, B>): Either<A, C> | Either<C, A> {
    return e.map(f)
  }

  export function flatMap<A, B, A1, B1>(
    f: (a: A) => Either<A1, B1>,
    e: Either<A, B>
  ): Either<A1, B1> {
    return e.flatMap(f)
  }

  export function swap<A, B>(e: Either<A, B>): Either<B, A> {
    return e.swap()
  }

  export function forEach<A, B, C>(f: (x: A | B) => void, e: Either<A, B>): void {
    e.forEach(f)
  }

  export function getOrElse<A, B, A1, B1>(x: Either<A1, B1>, e: Either<A, B>): Either<A1, B1> {
    return e.getOrElse(x)
  }

  export function forAll<A, B>(p: (b: B) => boolean, e: Either<A, B>): boolean {
    return e.forAll(p)
  }

  export function exists<A, B>(p: (b: B) => boolean, e: Either<A, B>): boolean {
    return e.exists(p)
  }

  export function toList<A, B>(e: Either<A, B>): B[] | A[] {
    return e.toList()
  }

  export function filter<A, B>(p: (a: A) => boolean, e: Either<A, B>): Option<Either<A, B>> {
    return e.filter(p)
  }
}

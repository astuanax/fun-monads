import { Option, Either, Left, Right } from '../src/fun-monads'
const v = 1

const fixturesRight: Either<any, any>[] = [Right(v), Either.apply(v), Either(v)]

const fixturesLeft: Either<any, any>[] = [Left(v)]

describe('Option', function() {
  test.each(fixturesRight)('Get Right', a => {
    expect(a.type).toEqual('Right')
  })

  test.each(fixturesLeft)('Get Left', a => {
    expect(a.type).toEqual('Left')
  })

  test.each(fixturesRight)('isRight', a => {
    expect(a.isRight).toBeTruthy()
    expect(a.left.isRight).toBeTruthy()
    expect(a.right.isRight).toBeTruthy()
  })

  test.each(fixturesLeft)('isLeft', a => {
    expect(a.isLeft).toBeTruthy()
    expect(a.right.isLeft).toBeTruthy()
    expect(a.left.isLeft).toBeTruthy()
  })

  test.each(fixturesRight)('Get Right %#', a => {
    expect(a.right.get()).toEqual(v)
    expect(a.get()).toEqual(v)
    expect(() => a.left.get()).toThrow()
    expect(Either.get(a)).toEqual(v)
  })

  test.each(fixturesLeft)('Get Left %#', a => {
    expect(a.left.get()).toEqual(v)
    expect(() => a.right.get()).toThrow()
    expect(() => a.get()).toThrow()
    expect(() => Either.get(a)).toThrow()
  })

  test.each(fixturesRight)('Fold Right %#', a => {
    const fnL = (x: number) => x * 2
    const fnR = (x: number) => x / 2
    expect(a.fold(fnL, fnR)).toBe(0.5)
    expect(a.right.fold(fnL, fnR)).toBe(0.5)
    expect(a.left.fold(fnL, fnR)).toBe(0.5)
    expect(Either.fold(fnL, fnR, a)).toBe(0.5)
  })

  test.each(fixturesLeft)('Fold Left %#', a => {
    const fnL = (x: number) => x * 2
    const fnR = (x: number) => x / 2
    expect(a.fold(fnL, fnR)).toBe(2)
    expect(a.left.fold(fnL, fnR)).toBe(2)
    expect(a.right.fold(fnL, fnR)).toBe(2)
    expect(Either.fold(fnL, fnR, a)).toBe(2)
  })

  test.each(fixturesRight)('Map Right %#', a => {
    const f = (x: any) => x * 2
    expect(a.map(f).get()).toEqual(2)
    expect(a.left.map(f).get()).toEqual(1)
    expect(Either.map(f, a).get()).toEqual(2)
  })

  test.each(fixturesLeft)('Map Left %#', a => {
    const f = (x: any) => x * 3
    expect(a.left.map(f).get()).toEqual(3)
    expect(() => a.right.map(f).get()).toThrow()
    expect(a.left.map(f).isLeft).toBeTruthy()
  })

  test.each(fixturesLeft)('swap Left %#', a => {
    expect(a.swap().isRight).toBeTruthy()
    expect(a.swap().get()).toBe(v)

    expect(Either.swap(a).isRight).toBeTruthy()
    expect(Either.swap(a).get()).toBe(v)
  })

  test.each(fixturesRight)('swap Right %#', a => {
    expect(a.swap().isLeft).toBeTruthy()
    expect(() => a.swap().get()).toThrow()

    expect(Either.swap(a).isLeft).toBeTruthy()
    expect(() => Either.swap(a).get()).toThrow()
  })

  test.each(fixturesRight)('flatMap Right to Left %#', a => {
    const fn = (x: any) => Left(x * 1234567890)
    expect(a.flatMap(fn).isLeft).toBeTruthy()
    expect(() => a.flatMap(fn).get()).toThrow()

    expect(() => Either.flatMap(fn, a).isLeft).toBeTruthy()
    expect(() => Either.flatMap(fn, a).get()).toThrow()
  })

  test.each(fixturesLeft)('flatMap Left to Right %#', a => {
    const fn = (x: any) => Right(x * 1234567890)
    expect(a.left.flatMap(fn).isRight).toBeTruthy()
    expect(a.left.flatMap(fn).get()).toEqual(fn(v).get())
  })

  test.each(fixturesRight)('flatMap Right %#', a => {
    const fn = (x: any) => Right(x * 1234567890)
    expect(a.flatMap(fn).isRight).toBeTruthy()
    expect(a.flatMap(fn).get()).toEqual(fn(v).get())
    expect(a.left.flatMap(fn).get()).toEqual(v)

    expect(Either.flatMap(fn, a).get()).toEqual(fn(v).get())
    expect(Either.flatMap(fn, a).right.isRight).toBeTruthy()
  })

  test.each(fixturesLeft)('flatMap Left %#', a => {
    const fn = (x: any) => Left(x * 1234567890)
    expect(a.left.flatMap(fn).isLeft).toBeTruthy()
    expect(a.left.flatMap(fn).left.get()).toEqual(fn(v).left.get())

    expect(Either.flatMap(fn, a).left.isLeft).toBeTruthy()
  })

  test.each(fixturesRight)('forEach Right %#', a => {
    let y = 1
    const f = (a: any): void => {
      y = y + 1
    }
    expect((a.forEach(f), y)).toBe(2)
    expect((a.forEach(f), y)).toBe(3)
    expect((Either.forEach(f, a), y)).toBe(4)
    expect((a.right.forEach(f), y)).toBe(5)
    expect((a.left.forEach(f), y)).toBe(5)
  })

  test.each(fixturesLeft)('forEach Left %#', a => {
    let y = 1
    const f = (a: any): void => {
      y = y + 1
    }
    expect((a.left.forEach(f), y)).toBe(2)
    expect((Either.forEach(f, a), y)).toBe(2)
    expect((a.right.forEach(f), y)).toBe(2)
    expect((a.left.forEach(f), y)).toBe(3)
  })

  test.each(fixturesRight)('getOrElse Right %#', a => {
    const or = Left<number, number>(5)
    expect(a.getOrElse(or)).toBe(a)
    expect(a.right.getOrElse(or)).toBe(a)
    expect(a.left.getOrElse(or)).toBe(or)

    expect(Either.getOrElse(or, a)).toBe(a)
  })

  test.each(fixturesLeft)('getOrElse Left %#', a => {
    const or = Right<number, number>(5)
    expect(a.getOrElse(or)).toBe(or)
    expect(a.right.getOrElse(or)).toBe(or)
    expect(a.left.getOrElse(or)).toBe(a)

    expect(Either.getOrElse(or, a)).toBe(or)
  })

  test.each(fixturesRight)('exists Right %#', a => {
    const p = (x: number) => x > 0
    expect(a.exists(p)).toBeTruthy()
    expect(a.right.exists(p)).toBeTruthy()
    expect(a.left.exists(p)).toBeFalsy()
  })

  test.each(fixturesLeft)('exists Left %#', a => {
    const p = (x: number) => x > 0
    expect(a.exists(p)).toBeFalsy()
    expect(a.right.exists(p)).toBeFalsy()
    expect(a.left.exists(p)).toBeTruthy()
  })

  test.each(fixturesRight)('forAll Right %#', a => {
    const p = (x: number) => x > 0
    expect(a.forAll(p)).toBeTruthy()
    expect(a.right.forAll(p)).toBeTruthy()
    expect(a.left.forAll(p)).toBeTruthy()

    expect(Either.forAll(p, a)).toBeTruthy()
  })

  test.each(fixturesLeft)('forAll Left %#', a => {
    const p = (x: number) => x > 0
    expect(a.forAll(p)).toBeTruthy()
    expect(a.right.forAll(p)).toBeTruthy()
    expect(a.left.forAll(p)).toBeTruthy()

    expect(Either.forAll(p, a)).toBeTruthy()
  })

  test.each(fixturesRight)('filter Right %#', a => {
    const p = (x: number) => x > 0
    expect(a.filter(p)).toEqual(Option.some(a))
    expect(a.right.filter(p)).toEqual(Option.some(a))
    expect(a.left.filter(p)).toEqual(Option.none())

    expect(Either.filter(p, a)).toEqual(Option.some(a))
  })

  test.each(fixturesLeft)('filter Left %#', a => {
    const p = (x: number) => x > 0
    expect(a.filter(p)).toEqual(Option.none())
    expect(a.right.filter(p)).toEqual(Option.none())
    expect(a.left.filter(p)).toEqual(Option.some(a))

    expect(Either.filter(p, a)).toEqual(Option.none())
  })

  test.each(fixturesRight)('forAll not Right %#', a => {
    const p = (x: number) => x < 0
    expect(a.forAll(p)).toBeFalsy()
    expect(a.right.forAll(p)).toBeFalsy()
    expect(a.left.forAll(p)).toBeTruthy()

    expect(Either.forAll(p, a)).toBeFalsy()
  })

  test.each(fixturesLeft)('forAll not Left %#', a => {
    const p = (x: number) => x < 0
    expect(a.forAll(p)).toBeTruthy()
    expect(a.right.forAll(p)).toBeTruthy()
    expect(a.left.forAll(p)).toBeFalsy()

    expect(Either.forAll(p, a)).toBeTruthy()
  })

  test.each(fixturesRight)('exists not Right %#', a => {
    const p = (x: number) => x < 0
    expect(a.exists(p)).toBeFalsy()
    expect(a.right.exists(p)).toBeFalsy()
    expect(a.left.exists(p)).toBeFalsy()

    expect(Either.exists(p, a)).toBeFalsy()
  })

  test.each(fixturesLeft)('exists not Left %#', a => {
    const p = (x: number) => x < 0
    expect(a.exists(p)).toBeFalsy()
    expect(a.right.exists(p)).toBeFalsy()
    expect(a.left.exists(p)).toBeFalsy()

    expect(Either.exists(p, a)).toBeFalsy()
  })

  test.each(fixturesRight)('toList Right %#', a => {
    expect(a.toList()).toEqual([1])
    expect(a.right.toList()).toEqual([1])
    expect(a.left.toList()).toEqual([])

    expect(Either.toList(a)).toEqual([1])
  })

  test.each(fixturesLeft)('toList Left %#', a => {
    expect(a.toList()).toEqual([])
    expect(a.right.toList()).toEqual([])
    expect(a.left.toList()).toEqual([1])

    expect(Either.toList(a)).toEqual([])
  })
})

import { Try } from '../src/fun-monads'
import { Failure, Success } from '../src/Try'

const divZero = (x: number) => {
  throw new Error('Divide by zero')
}
const div = (x: number) => x

const v: number = 1

const fixturesSuccess: Success<any>[] = [Try.apply((): number => div(v)), Try((): number => div(v))]

const fixturesFailure: Failure<any>[] = [Try.apply(() => divZero(v)), Try(() => divZero(v))]

describe('Try', function() {
  test.each(fixturesSuccess)('Get success', a => {
    expect(a.type).toEqual('Success')
  })

  test.each(fixturesFailure)('Get failure', a => {
    expect(a.type).toEqual('Failure')
  })

  test.each(fixturesFailure)('Get none %#', a => {
    expect(() => a.get()).toThrow()
  })

  test.each(fixturesSuccess)('Get some %#', a => {
    const f = (x: any): any => 1 + x
    expect(Try.map(f, a).get()).toBe(2)
  })

  test.each(fixturesSuccess)('Get some %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).isSuccess).toBeTruthy()
  })

  test.each(fixturesSuccess)('Applicative laws: identity', a => {
    const x = v
    const b = Try(() => (x: any) => x)
    expect(Try.ap(b, a).get()).toEqual(x)
    expect(a.ap(b).get()).toEqual(x)
  })

  test('Applicative laws: identity', () => {
    const x = 'a string'
    const a = Try(() => (x: any) => x)
    const b = Try(() => x)

    expect(Try.ap(a, b).get()).toEqual(x)
  })

  test('Applicative laws: composition', () => {
    const compose = (a: any) => (b: any) => (c: any) => a(b(c))
    const fn = (x: string): string => x + 'a'
    const u = Try(() => fn)
    const v = Try(() => fn)
    const w = Try<string>(() => 'a')

    const monad = Try

    const expected = monad.ap(u, monad.ap(v, w))
    expect(expected.get()).toEqual('aaa')
    const actual = monad.ap(
      monad.ap(
        monad.ap(
          monad(() => compose),
          u
        ),
        v
      ),
      w
    )
    expect(expected.get()).toEqual(actual.get())
  })

  test('Applicative laws: interchange', () => {
    const x = 'a string'
    const u = Try(() => (x: string) => x)

    const monad = Try
    const actual = monad.ap(
      u,
      monad(() => x)
    )
    const expected = monad.ap(
      monad(() => (f: any) => f(x)),
      u
    )

    expect(expected.get()).toEqual(actual.get())
  })

  test.each(fixturesSuccess)('Monad law: left identity', a => {
    const f = (x: any) => Try(() => ((x: number): number => x * 2)(v))
    expect(a.flatMap(f)).toEqual(f(v))
  })

  test.each(fixturesFailure)('Monad law: left identity with Failure', a => {
    const f = (x: number) => Try.apply(() => divZero(v))
    expect(a.flatMap(f)).toEqual(Try.failure(new Error('Divide by zero')))
  })

  test('Monad law: right identity', () => {
    const TryVal = Try<number>((): number => 4)
    const mapper = (x: number): Try<number> => Try.apply((): number => x)
    expect(TryVal.flatMap<number>(mapper)).toEqual(TryVal)
  })

  test('Monad law: associativity', () => {
    const f = (val: number) => Try(() => val + 1)
    const g = (val: number): Try<number> => Try(() => val * 2)
    const m = Try(() => 1)

    const lhs = m.flatMap(f).flatMap(g)
    const rhs = m.flatMap((x: any): Try<number> => f(x).flatMap(g))

    expect(lhs).toEqual(rhs)
  })

  test.each(fixturesSuccess)('Static map some isSuccess %#', a => {
    const f = (x: number) => 2 * x
    expect(Try.isSuccess(Try.map(f, a))).toBeTruthy()
  })

  test.each(fixturesFailure)('Map some isFailure %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).isFailure).toBeTruthy()
  })

  test.each(fixturesFailure)('Static map some isFailure %#', a => {
    const f = (x: number) => 2 * x
    expect(Try.isFailure(Try.map(f, a))).toBeTruthy()
  })

  test('getOrElse', () => {
    const a = Try(() => 'a')
    const b = Try.failure(new Error('Boom'))
    const c = Try.failure(new Error('Bang'))
    const println = function(opt: Try<any>) {
      return opt.getOrElse(() => 'nada')
    }
    expect(println(a)).toBe('a')
    expect(println(b)).toBe('nada')
    expect(println(c)).toBe('nada')
  })

  test('static getOrElse', () => {
    const a = Try(() => 'a')
    const b = Try.failure(new Error('Boom'))
    const c = Try.failure(new Error('Bang'))
    const println = function(opt: Try<any>) {
      return Try.getOrElse(() => 'nada', opt)
    }
    expect(println(a)).toBe('a')
    expect(println(b)).toBe('nada')
    expect(println(c)).toBe('nada')
  })

  test('flatten', () => {
    const a = Try(() => 'a')
    const b = Try(() => a)
    expect(b.isSuccess).toBeTruthy()
    expect(b.flatten()).toBe(a)
    expect(a.flatten()).toBe(a)
  })

  test('type Success', () => {
    const a = Try(() => 'a')
    expect(typeof a).toBe('object')
    expect(a instanceof Success).toBeTruthy()
  })

  test('type Failure', () => {
    const a = Try(() => divZero(1))
    expect(typeof a).toBe('object')
    expect(a instanceof Failure).toBeTruthy()
  })

  test('Filter a Try', () => {
    const a = Try(() => 'a')
    const b = Try(() => 'b')
    const fn = (x: string): boolean => x === 'a'
    expect(Try.filter(fn, a).isSuccess).toBeTruthy()
    expect(Try.filter(fn, b).isFailure).toBeTruthy()
  })

  test('foreach a try', () => {
    const a = Try(() => 'a')
    let b = ''
    const fn = (x: string): string => (b = 'a' + x)
    expect((Try.forEach(fn, a), b)).toBe('aa')
  })

  test('orElse an Failure', () => {
    const a: Try<string> = Try(() => divZero(4))
    const b: Try<string> = Try(() => 'alt')
    expect(a.orElse(b)).toBe(b)
  })

  test('orElse a Success', () => {
    const a = Try(() => 'this')
    const b = Try(() => 'alt')
    expect(a.orElse(b)).toBe(a)
  })
})

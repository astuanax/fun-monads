import { Try } from '../src/Try'
import { Failure, Success } from '../src/Try'

const err = new Error('Divide by zero')
const divZero = (x: number) => {
  throw new Error('Divide by zero')
}
const div = (x: number) => x

const v: number = 1

const fixturesSuccess: Success<any>[] = [
  Try.apply((): number => div(v)),
  Try((): number => div(v)),
  Try.success(v)
]

const fixturesFailure: Failure<any>[] = [
  Try.apply(() => divZero(v)),
  Try(() => divZero(v)),
  Try.failure(err)
]

describe('Try', function() {
  test.each(fixturesSuccess)('Get success', a => {
    expect(a.type).toEqual('Success')
  })

  test.each(fixturesFailure)('Get failure', a => {
    expect(a.type).toEqual('Failure')
  })

  test.each(fixturesFailure)('Get none %#', a => {
    expect(() => a.get()).toThrow()
    expect(() => Try.get(a)).toThrow()
  })

  test.each(fixturesSuccess)('Get some %#', a => {
    const f = (x: any): any => 1 + x
    expect(Try.map(f, a).get()).toBe(2)
    expect(Try.get(Try.map(f, a))).toBe(2)
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

  test('Applicative with failure', () => {
    const a = Try(() => (x: any) => divZero(4))
    const b: any = Try(() => 2)

    expect(() => Try.ap(a, b).get()).toThrow()
    expect(() => b.ap(a).get()).toThrow()
  })

  test('Applicative with failure', () => {
    const a = Try.failure<any>(err)

    expect(() => Try.ap(a, a).get()).toThrow()
    expect(() => a.ap(a).get()).toThrow()
  })

  test('Applicative laws: composition', () => {
    const compose = () => (a: any) => (b: any) => (c: any) => a(b(c))
    const fn = (x: string): string => x + 'a'
    const u = Try(() => fn)
    const v = Try(() => fn)
    const w = Try<string>(() => 'a')

    const monad = Try

    const expected = monad.ap(u, monad.ap(v, w))
    expect(expected.get()).toEqual('aaa')
    const actual = monad.ap(monad.ap(monad.ap(monad(compose), u), v), w)
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
    expect(Try.flatMap(f, a)).toEqual(f(v))
  })

  test.each(fixturesSuccess)('Monad law: left identity with flatMap Failure', a => {
    const f = (x: number) => divZero(v)
    expect(a.isSuccess).toBeTruthy()
    expect(a.flatMap(f)).toEqual(Try.failure(new Error('Divide by zero')))
    expect(Try.flatMap(f, a)).toEqual(Try.failure(new Error('Divide by zero')))
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
    expect(Try.flatten(a)).toBe(a)
    expect(Try.flatten(b)).toBe(a)
  })

  test('flatten', () => {
    let x: any = undefined
    const a = Try(() => divZero(4))
    const b = Try(() => a)
    expect(a.isFailure).toBeTruthy()
    expect(b.flatten()).toBe(a)
    expect(a.flatten()).toBe(a)
    expect(Try.flatten(a)).toBe(a)
    expect(Try.flatten(b)).toBe(a)
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

  test('Filter a Try failure', () => {
    const a = Try(() => {
      throw err
    })
    const b = Try(() => 'b')
    const fn = (x: string): boolean => {
      throw err
    }
    expect(Try.filter(fn, a).isFailure).toBeTruthy()
    expect(Try.filter(fn, b).isFailure).toBeTruthy()
  })

  test.each(fixturesFailure)('orElse with Failure %#', a => {
    const fn = (x: string): boolean => x === 'a'
    expect(Try.filter(fn, a).isFailure).toBeTruthy()
    expect(a.filter(fn).isFailure).toBeTruthy()
  })

  test.each(fixturesSuccess)('orElse with Success %#', a => {
    const fn = (x: number): boolean => x === v
    expect(Try.filter(fn, a).isSuccess).toBeTruthy()
    expect(a.filter(fn).isSuccess).toBeTruthy()
  })

  test('foreach a try', () => {
    const a = Try(() => 'a')
    let b = ''
    const fn = (x: string): string => (b = 'a' + x)
    expect((Try.forEach(fn, a), b)).toBe('aa')
  })

  test('foreach a try Failure', () => {
    const a = Try(() => divZero(6))
    let b = ''
    const fn = (x: string): string => (b = 'a' + x)
    expect((Try.forEach(fn, a), b)).toBe('')
  })

  test('orElse an Failure', () => {
    const a: Try<string> = Try(() => divZero(4))
    const b: Try<string> = Try(() => 'alt')
    expect(a.orElse(b)).toBe(b)
    expect(Try.orElse(b, a)).toBe(b)
  })

  test('orElse a Success', () => {
    const a = Try(() => 'this')
    const b = Try(() => 'alt')
    expect(a.orElse(b)).toBe(a)
    expect(Try.orElse(b, a)).toBe(a)
  })

  test('fold a Success', () => {
    const a = Try(() => 'this')
    expect(
      a.fold(
        y => y,
        (x: any) => x
      )
    ).toBe('this')
    expect(
      Try.fold(
        y => y,
        (x: any) => x,
        a
      )
    ).toBe('this')
  })

  test('fold a Failure', () => {
    const a = Try(() => divZero(0))
    expect(
      a.fold(
        y => y,
        x => x
      )
    ).toEqual(err)
    expect(
      Try.fold(
        y => y,
        x => x,
        a
      )
    ).toEqual(err)
  })

  test.each(fixturesSuccess)('Recover success', a => {
    const recoverFn = (x: Error) => {
      if (x == err) {
        return Try.apply(() => 54321)
      } else {
        return Try.apply(() => 12345)
      }
    }
    expect(a.recover(recoverFn)).toEqual(a)
    expect(Try.recover(recoverFn, a)).toEqual(a)
  })

  test.each(fixturesFailure)('Recover from failure', a => {
    const recoverFn = (x: Error) => {
      if (x.message === err.message) {
        return Try.apply(() => 54321)
      } else {
        return Try.apply(() => 12345)
      }
    }
    expect(a.recover(recoverFn).get()).toBe(54321)
    expect(Try.recover(recoverFn, a).get()).toBe(54321)
    expect(a.recover(recoverFn).isSuccess).toBeTruthy()
  })

  test.each(fixturesFailure)('Recover from failure with a failure', a => {
    const recoverFn = (x: Error) => {
      throw err
    }
    expect(() => a.recover(recoverFn).get()).toThrow()
    expect(() => Try.recover(recoverFn, a).get()).toThrow()
    expect(a.recover(recoverFn).isFailure).toBeTruthy()
  })

  test.each(fixturesSuccess)('force success to failed', a => {
    expect(a.failed().isFailure).toBeTruthy()
    expect(Try.failed(a).isFailure).toBeTruthy()
  })

  test.each(fixturesFailure)('force failure to success', a => {
    expect(a.failed().isSuccess).toBeTruthy()
    expect(Try.failed(a).isSuccess).toBeTruthy()
  })
})

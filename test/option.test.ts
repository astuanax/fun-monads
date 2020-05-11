import { Option } from '../src/Option'
import { None, Some } from '../src/Option'

const v = 1

const fixturesSome: Option<any>[] = [Option.apply(v), Option(v), Option.some(v)]

const fixturesNone: Option<any>[] = [
  Option.apply(undefined),
  Option.apply(null),
  Option(undefined),
  Option(null),
  Option.none(),
  Option.empty(),
  Option.some(undefined),
  Option.some(null)
]

describe('Option', function() {
  test.each(fixturesSome)('Get some', a => {
    expect(a.type).toEqual('Some')
  })

  test.each(fixturesNone)('Get none %#', a => {
    expect(a.type).toEqual('None')
  })

  test.each(fixturesNone)('Get none %#', a => {
    expect(() => a.get()).toThrow()
    expect(() => Option.get(a)).toThrow()
  })

  test.each(fixturesSome)('Get some %#', a => {
    const f = (x: number) => 2 * x
    expect(Option.map(f, a).get()).toBe(2)
  })

  test.each(fixturesSome)('Get some %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).isSome).toBeTruthy()
    expect(a.map(f).isNone).toBeFalsy()
  })

  test.each(fixturesNone)('Get some %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).isNone).toBeTruthy()
    expect(a.map(f).isSome).toBeFalsy()
  })

  test.each(fixturesSome)('Applicative laws: identity', a => {
    const x = v
    const b = Option((x: any) => x)
    expect(Option.ap(b, a).get()).toEqual(x)
    expect(a.ap(b).get()).toEqual(x)
  })

  test('Applicative laws: identity', () => {
    const x = 'a string'
    const a = Option((x: any) => x)
    const b = Option(x)

    expect(Option.ap(a, b).get()).toEqual(x)
  })

  test('Applicative laws: identity with None throws', () => {
    const x: any = undefined
    const a = Option((x: any) => x)
    const b = Option(x)

    expect(() => Option.ap(a, b).get()).toThrow()
  })

  test('Applicative laws: composition', () => {
    const compose = (a: any) => (b: any) => (c: any) => a(b(c))
    const x = 'a string'
    const fn = (x: string) => x + 'a'
    const u = Option(fn)
    const v = Option(fn)
    const w = Option('a')

    const monad = Option
    const actual = monad.ap(monad.ap(monad.ap(monad(compose), u), v), w)
    const expected = monad.ap(u, monad.ap(v, w))

    expect(expected.get()).toEqual(actual.get())
  })

  test('Applicative laws: interchange', () => {
    const x = 'a string'
    const u = Option((x: string) => x)

    const monad = Option
    const actual = monad.ap(u, monad(x))
    const expected = monad.ap(
      monad((f: any) => f(x)),
      u
    )

    expect(expected.get()).toEqual(actual.get())
  })

  test.each(fixturesSome)('Monad law: left identity', a => {
    const x: any = 1
    const f = (x: any) => Option(x * 2)
    expect(a.flatMap(f)).toEqual(f(x))
    expect(Option.flatMap(f, a)).toEqual(f(x))
  })

  test.each(fixturesNone)('Monad law: left identity with None', a => {
    let x: any = undefined
    const f = (x: any) => Option.apply(45)
    expect(a.flatMap(f)).toEqual(Option.none())
    expect(Option.flatMap(f, a)).toEqual(Option.none())
  })

  test('Monad law: right identity', () => {
    const OptionVal = Option(4)
    const mapper = (x: number) => Option(x)
    expect(OptionVal.flatMap(mapper)).toEqual(OptionVal)
  })

  test('Monad law: associativity', () => {
    const f = (val: number) => Option(val + 1)
    const g = (val: number) => Option(val * 2)
    const m = Option(1)

    const lhs = m.flatMap(f).flatMap(g)
    const rhs = m.flatMap((x: number) => f(x).flatMap(g))

    expect(lhs).toEqual(rhs)
  })

  test.each(fixturesSome)('Static map some isSome %#', a => {
    const f = (x: number) => 2 * x
    expect(Option.isSome(Option.map(f, a))).toBeTruthy()
    expect(Option.isDefined(Option.map(f, a))).toBeTruthy()
  })

  test.each(fixturesNone)('Map some isNone %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).isNone).toBeTruthy()
  })

  test.each(fixturesNone)('Static map some isNone %#', a => {
    const f = (x: number) => 2 * x
    expect(Option.isNone(Option.map(f, a))).toBeTruthy()
  })

  test('getOrElse', () => {
    const a = Option('a')
    const b = Option.some(null)
    const c = Option(null)
    const println = function(opt: Option<any>) {
      return opt.getOrElse('nada')
    }
    expect(println(a)).toBe('a')
    expect(println(b)).toBe('nada')
    expect(println(c)).toBe('nada')
  })

  test('static getOrElse', () => {
    const a = Option('a')
    const b = Option.some(null)
    const c = Option(null)
    const println = function(opt: Option<any>) {
      return Option.getOrElse('nada', opt)
    }
    expect(println(a)).toBe('a')
    expect(println(b)).toBe('nada')
    expect(println(c)).toBe('nada')
  })

  test('flatten Some 1', () => {
    const a = Option('a')
    const b = Option(a)
    expect(Option.flatten(b).isSome).toBeTruthy()
    expect(b.flatten()).toBe(a)
  })

  test('flatten Some 2', () => {
    const a = Option('a')
    const b = Option(a)
    expect(Option.flatten(b).isSome).toBeTruthy()
    expect(Option.flatten(b)).toBe(a)
  })

  test('flatten Some 3', () => {
    const a = Option('a')
    expect(a.flatten().isSome).toBeTruthy()
    expect(a.flatten()).toBe(a)
  })

  test('flatten', () => {
    const a = Option(null)
    const b = Option(a)
    expect(Option.flatten(b).isNone).toBeTruthy()
    expect(Option.flatten(b)).toBe(a)
    expect(Option.flatten(a)).toBe(a)
    expect(b.flatten()).toBe(a)
    expect(a.flatten()).toBe(a)
  })

  test('type Some', () => {
    const a = Option('a')
    expect(typeof a).toBe('object')
    expect(a instanceof Some).toBeTruthy()
  })

  test('type None', () => {
    const a = Option(null)
    expect(typeof a).toBe('object')
    expect(a instanceof None).toBeTruthy()
  })

  test('Filter an option', () => {
    const a = Option('a')
    const b = Option('b')
    const fn = (x: string): boolean => x === 'a'
    expect(Option.filter(fn, a).isSome).toBeTruthy()
    expect(Option.filter(fn, b).isNone).toBeTruthy()
  })

  test('Filter an option None', () => {
    const x: any = undefined
    const a = Option(x)
    const fn = (x: string): boolean => x === 'a'
    expect(Option.filter(fn, a).isSome).toBeFalsy()
    expect(a.filter(fn).isNone).toBeTruthy()
  })

  test('Has an option Some', () => {
    const a = Option('a')
    const b = Option('b')
    const fn = (x: string): boolean => x === 'a'
    expect(Option.has(fn, a)).toBeTruthy()
    expect(Option.has(fn, b)).toBeFalsy()
  })

  test('Exists an option Some', () => {
    const a = Option('a')
    const b = Option('b')
    const fn = (x: string): boolean => x === 'a'
    expect(Option.exists(fn, a)).toBeTruthy()
    expect(Option.exists(fn, b)).toBeFalsy()
  })

  test('Exists an option None', () => {
    let x: any = undefined
    const a = Option.apply(x)
    const fn = (x: string): boolean => x === 'a'
    expect(a.has(fn)).toBeFalsy()
  })

  test('foreach an option Some', () => {
    const a = Option('a')
    let b = ''
    const fn = (x: string): string => (b = 'a' + x)
    expect((Option.forEach(fn, a), b)).toBe('aa')
  })

  test('foreach an None', () => {
    const a: Option<any> = Option.apply(undefined)
    let b = ''
    const fn = (x: string): string => (b = 'a' + x)
    expect((Option.forEach(fn, a), b)).toBe('')
  })

  test('orElse an none', () => {
    const a = Option(null)
    const b = Option('alt')
    expect(a.orElse(b)).toBe(b)
    expect(Option.orElse(b, a)).toBe(b)
  })

  test('orElse an some', () => {
    const a = Option('this')
    const b = Option('alt')
    expect(a.orElse(b)).toBe(a)
    expect(Option.orElse(b, a)).toBe(a)
  })

  test('toList an option', () => {
    const a = Option(null)
    const b = Option('alt')
    expect(a.toList()).toEqual([])
    expect(b.toList()).toEqual(['alt'])
  })

  test('cannot assign null to Some', () => {
    expect(() => new Some(null)).toThrow()
  })

  test('cannot assign undefined to Some', () => {
    expect(() => new Some(undefined)).toThrow()
  })

  test('None<A> is not None<B>', () => {
    const a = Option<number>(5).map(x => undefined)
    const b = Option<string>('5').map(x => undefined)

    const noneA = new None<string>()
    const noneB = new None<object>()

    expect(a === b).toBeFalsy()
    expect(a.type).toBe('None')
    expect(b.type).toBe('None')
    // @ts-ignore
    expect(noneA === noneB).toBeFalsy()
  })

  test('None<A> is not None<B> 2', () => {
    const a = Option<number>(5).map(x => x)
    const b = Option<string>('5').map(x => 5)
    const c = Option<string>('').map<number>((x: string): number => 5)

    expect(a === b).toBeFalsy()
    expect(a.get() === Option.get(b)).toBeTruthy()
    expect(a).toEqual(c)
  })

  test('None<A> is not None<B> 2', () => {
    const a = Option.none<any>()
    expect(a.isSome).toBeFalsy()
  })
})

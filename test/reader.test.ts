import { Reader } from '../src/fun-monads'

const v = (x: any): any => x

const fixturesReader: Reader<any, any>[] = [Reader.apply(v), Reader(v)]

describe('Reader', function() {
  test.each(fixturesReader)('Get reader', a => {
    expect(a.type).toEqual('Reader')
  })

  test.each(fixturesReader)('Get reader value %#', a => {
    const x: number = 1
    expect(a.get(x)).toBe(x)
    expect(a.run(x)).toBe(x)

    expect(Reader.get(x, a)).toBe(x)
    expect(Reader.run(x, a)).toBe(x)
  })

  test.each(fixturesReader)('Get some %#', a => {
    const f = (x: number) => 2 * x
    expect(a.map(f).get(1)).toEqual(2)
    expect(Reader.map(f, a).get(1)).toEqual(2)
  })

  test.each(fixturesReader)('Applicative laws: identity', a => {
    const x = v

    // partial function
    const c = a.map((x: any) => (y: any = x) => y)

    // value
    const b = Reader((x: any) => 1)

    // apply function c to value b
    expect(b.ap(c).get(undefined)).toEqual(1)
    expect(Reader.ap(c, b).get(undefined)).toEqual(1)
  })

  test('Applicative laws: identity', () => {
    const y = 'string'
    const a = Reader((x: any) => (y: any = x) => 'a ' + y)
    const b = Reader((x: any) => y)

    expect(Reader.ap(a, b).get(undefined)).toEqual('a ' + y)
  })

  test('Applicative laws: composition', () => {
    const compose = () => (a: any) => (b: any) => (c: string) => a(b(c))
    const x: any = 'a string'
    const fn = (x: string): string => x + 'a'
    const u = Reader((x: any) => fn)
    const v = Reader((x: any) => fn)
    const w = Reader((x: any) => 'a')

    const monad = Reader
    const actual = monad.ap(monad.ap(monad.ap(monad(compose), u), v), w)
    const expected = monad.ap(u, monad.ap(v, w))

    expect(expected.get(undefined)).toEqual(actual.get(undefined))
  })

  test('Applicative laws: interchange', () => {
    const xx = 'a string'
    const u = Reader((y: any) => (x: string) => x)

    const monad = Reader
    const actual = monad.ap(
      u,
      monad((x: any) => xx)
    )
    const expected = monad.ap(
      monad((x: any) => (f: any) => f(xx)),
      u
    )

    expect(expected.get(undefined)).toEqual(actual.get(undefined))
  })

  test.each(fixturesReader)('Monad law: left identity', a => {
    const x: any = 1
    const f = (x: any) => Reader((x: number) => x * 2)
    expect(a.flatMap(f).get(1)).toEqual(f(x).get(1))
    expect(Reader.flatMap(f, a).get(1)).toEqual(f(x).get(1))
  })

  test('Monad law: right identity', () => {
    const ReaderVal = Reader(() => 4)
    const mapper = (x: number) => Reader(() => x)
    expect(ReaderVal.flatMap(mapper).get(1)).toEqual(ReaderVal.get(1))
    expect(Reader.flatMap(mapper, ReaderVal).get(1)).toEqual(Reader.get(1, ReaderVal))
  })

  test('Monad law: associativity', () => {
    const f = (val: number) => Reader((x: any) => val + 1)
    const g = (val: number) => Reader((x: any) => val * 2)
    const m = Reader((x: any) => 1)

    const lhs = m.flatMap(f).flatMap(g)
    const rhs = m.flatMap((x: number) => f(x).flatMap(g))

    expect(lhs.get(1)).toEqual(rhs.get(1))
  })

  test('Zip 2 readers', () => {
    const f = Reader((x: any) => x + 100)
    const g = Reader((x: any) => x * 3)

    const actual = Reader.zip(f, g).get(1)
    expect(actual).toEqual([3, 101])

    const actual2 = g.zip(f).get(2)
    expect(actual2).toEqual([6, 102])
  })
})

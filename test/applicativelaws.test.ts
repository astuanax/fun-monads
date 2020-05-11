import { Option } from '../src/Option'
import { Try } from '../src/Try'
import { Reader } from '../src/Reader'

const aValue: any = 1

const monads: any[] = [Option, Reader, Try]

describe('Applicative laws', () => {
  test.each(monads)('Identity', m => {
    const a = m.of(aValue)
    const b = m.of((x: any) => x)
    expect(m.ap(b, a).get()).toEqual(aValue)
  })

  test.each(monads)('Applicative laws: composition', m => {
    const compose = (a: any) => (b: any) => (c: any) => a(b(c))
    const fn = (x: string) => x + 'a'
    const u = m.of(fn)
    const v = m.of(fn)
    const w = m.of('a')

    const actual = m.ap(m.ap(m.ap(m.of(compose), u), v), w)
    const expected = m.ap(u, m.ap(v, w))

    expect(expected.get()).toEqual(actual.get())
  })

  test.each(monads)('Interchange', m => {
    const u = m.of((x: string) => x)

    const actual = m.ap(u, m.of(aValue))
    const expected = m.ap(
      m.of((f: any) => f(aValue)),
      u
    )

    expect(expected.get()).toEqual(actual.get())
  })
})

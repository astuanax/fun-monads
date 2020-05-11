import { Option } from '../src/Option'
import { Either } from '../src/Either'
import { Try } from '../src/Try'
import { Reader } from '../src/Reader'

const aValue: any = 1

const monads: any[] = [Option, Either, Reader, Try]

describe('Monad laws', () => {
  test.each(monads)('Left identity  %#', (m: any) => {
    const a = m.of(aValue)
    const f = (x: any) => m.of(x * 2)
    expect(m.flatMap(f, a).get()).toEqual(f(aValue).get())
  })

  test.each(monads)('Right identity  %#', (m: any) => {
    const mVal = m.of(4)
    const mapper = (x: number) => m.of(x)
    expect(m.flatMap(mapper, mVal).get()).toEqual(mVal.get())
  })

  test.each(monads)('Associativity %#', (m: any) => {
    const f = (val: number) => m.of(val + 1)
    const g = (val: number) => m.of(val * 2)
    const valM = m.of(1)

    const lhs = valM.flatMap(f).flatMap(g)
    const rhs = valM.flatMap((x: number) => f(x).flatMap(g))

    expect(lhs.get()).toEqual(rhs.get())
  })
})

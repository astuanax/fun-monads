import { Try } from '../src/fun-monads'
import { Success, Failure } from '../src/Try'

const divZero = (x:number) => {
  throw new Error("Divide by zero")
}
const div = (x:number):number => x / 2

const fixturesSuccess: Success<any>[] = [
  Try.apply((): number => div(4)),
  Try(():number => div(4))
]

const fixturesFailure: Failure<any>[] = [
  Try.apply(() => divZero(4))
]

describe('Try', function () {

  test.each(fixturesSuccess)(
    'Get success',
    (a) => {
      expect(a.type).toEqual('Success')
    },
  );

  test.each(fixturesFailure)(
    'Get failure',
    (a) => {
      expect(a.type).toEqual('Failure')
    },
  );

})

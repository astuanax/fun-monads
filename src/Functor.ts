/**
 * @ignore
 */
export default interface Functor<A, B, M> {
  map: (f: (a: A) => B) => M
}

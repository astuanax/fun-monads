(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.funMonads = {})));
}(this, (function (exports) { 'use strict';

  /**
   * Class `None<A>` represents non-existent values of type `A`.
   *
   * ```typescript
   * const s: None<any> = new None<any>()
   * const t: None<any> = Option.none
   * const u: None<any> = Option(null)
   * const v: None<any> = Option(undefined)
   * const w: None<any> = Option.some(null)
   * const x: None<any> = Option.some(undefined)
   * const y: None<any> = Option.apply(null)
   * const z: None<any> = Option.apply(undefined)
   * ```
   */
  var None = /** @class */ (function () {
      function None() {
          this.type = 'None';
          /**
           * Returns true if the option is None, false otherwise.
           */
          this.isNone = true;
          /**
           * Returns true if the option is an instance of Some, false otherwise.
           */
          this.isSome = false;
          /**
           * isEmpty is a convenience shortcut to {@link isNone}
           */
          this.isEmpty = this.isNone;
          /**
           * isSome is a convenience shortcut to {@link isSome}
           */
          this.isDefined = this.isSome;
          this.exists = this.has;
      }
      /**
       * get throws an Error if this is a None
       */
      None.prototype.get = function () {
          throw new Error('Unsupported operation None.get');
      };
      /** Returns a Some containing the result of applying $f to this $option's
       * value if this $option is nonempty.
       * Otherwise return $none.
       *
       *  ```typescript
       *  const f = (x:number): number => x * 2;
       *  const o = Option<number>(5)
       *  const result = o.map(f).getOrElse(-1) // 10
       *  ```
       *
       *  @note This is similar to `flatMap` except here,
       *  $f does not need to wrap its result in an $option.
       *
       *  @see {@link flatMap}
       *  @see {@link forEach}
       */
      None.prototype.map = function (f) {
          return new None();
      };
      /** Returns the result of applying $f to this Option's value if
       * this Option is nonempty.
       * Returns None if this Option is empty.
       * Slightly different from `map` in that $f is expected to
       * return an Option (which could be None).
       *
       * ```typescript
       * const f = (x:number) => Option(undefined);
       * const o = Option<number>(5)
       * const result = o.flatMap(f).getOrElse(-1) // -1
       * ```
       *
       * @param  f   the function to apply
       * @return Returns None in all cases
       * @see {@link map}
       * @see {@link forEach}
       */
      None.prototype.flatMap = function (f) {
          return new None();
      };
      None.prototype.getOrElse = function (x) {
          return x;
      };
      None.prototype.flatten = function () {
          return this;
      };
      None.prototype.orElse = function (b) {
          return b;
      };
      None.prototype.toList = function () {
          return [];
      };
      None.prototype.ap = function (fa) {
          return new None();
      };
      None.prototype.filter = function (p) {
          return new None();
      };
      None.prototype.has = function (p) {
          return false;
      };
      None.prototype.forEach = function (fn) {
          // noop
      };
      return None;
  }());
  /**
   * Class `Some<A>` represents existing values of type `A`.
   * Some never contains null or undefined.
   *
   * ```typescript
   * const a:any = "anything"
   * const b: Some<any> = new Some<any>(a)
   * const c: Some<any> = Option.some(a)
   * const d: Some<any> = Option(a)
   * const e: Some<any> = Option.some(a)
   * const f: Some<any> = Option.apply(a)
   * ```
   */
  var Some = /** @class */ (function () {
      function Some(value) {
          this.type = 'Some';
          this.isNone = false;
          this.isSome = true;
          this.isEmpty = this.isNone;
          this.isDefined = this.isSome;
          this.exists = this.has;
          this.value = value;
          if (this.value == null) {
              throw new Error('null or undefined exception. Please use Option.apply');
          }
          return this;
      }
      Some.prototype.get = function () {
          return this.value;
      };
      Some.prototype.map = function (f) {
          var res = f(this.value);
          return res == null ? new None() : new Some(res);
      };
      Some.prototype.flatMap = function (f) {
          return f(this.value);
      };
      Some.prototype.getOrElse = function (x) {
          return this.get();
      };
      Some.prototype.flatten = function () {
          var v = this.value;
          if (v && (v.isSome || v.isNone)) {
              return v;
          }
          return this;
      };
      Some.prototype.orElse = function (b) {
          return this;
      };
      Some.prototype.toList = function () {
          return [this.get()];
      };
      Some.prototype.ap = function (fa) {
          return this.map(fa.get());
      };
      Some.prototype.filter = function (p) {
          return p(this.get()) ? this : new None();
      };
      Some.prototype.has = function (p) {
          return p(this.get());
      };
      Some.prototype.forEach = function (fn) {
          fn(this.get());
      };
      return Some;
  }());
  function Option(value) {
      return Option.apply(value);
  }
  /* istanbul ignore next */
  (function (Option) {
      function none() {
          return new None();
      }
      Option.none = none;
      Option.empty = none;
      function some(a) {
          return a == null ? new None() : new Some(a);
      }
      Option.some = some;
      function apply(a) {
          return some(a);
      }
      Option.apply = apply;
      function of(a) {
          return some(a);
      }
      Option.of = of;
      function isSome(fa) {
          return fa.isSome;
      }
      Option.isSome = isSome;
      function isNone(fa) {
          return fa.isNone;
      }
      Option.isNone = isNone;
      Option.isEmpty = isNone;
      Option.isDefined = isSome;
      function get(a) {
          return a.get();
      }
      Option.get = get;
      function map(f, a) {
          return a.map(f);
      }
      Option.map = map;
      function flatMap(f, a) {
          return a.flatMap(f);
      }
      Option.flatMap = flatMap;
      function getOrElse(x, a) {
          return a.getOrElse(x);
      }
      Option.getOrElse = getOrElse;
      function flatten(a) {
          return a.flatten();
      }
      Option.flatten = flatten;
      function ap(f, a) {
          return a.ap(f);
      }
      Option.ap = ap;
      function filter(p, a) {
          return a.filter(p);
      }
      Option.filter = filter;
      function has(p, a) {
          return a.has(p);
      }
      Option.has = has;
      Option.exists = has;
      function forEach(f, a) {
          a.forEach(f);
      }
      Option.forEach = forEach;
      function orElse(b, a) {
          return a.orElse(b);
      }
      Option.orElse = orElse;
  })(Option || (Option = {}));

  var Success = /** @class */ (function () {
      function Success(value) {
          this.type = 'Success';
          this.isSuccess = true;
          this.isFailure = false;
          this.value = value;
          return this;
      }
      Success.prototype.flatMap = function (f) {
          try {
              return f(this.value);
          }
          catch (err) {
              return new Failure(err);
          }
      };
      Success.prototype.map = function (f) {
          var _this = this;
          return Try.apply(function () { return f(_this.value); });
      };
      Success.prototype.fold = function (f, s) {
          return s(this.value);
      };
      Success.prototype.get = function () {
          return this.value;
      };
      Success.prototype.getOrElse = function (b) {
          return this.value;
      };
      Success.prototype.orElse = function (b) {
          return this;
      };
      Success.prototype.flatten = function () {
          var v = this.value;
          if (v && (v.isSuccess || v.isFailure)) {
              return v;
          }
          return this;
      };
      Success.prototype.forEach = function (fn) {
          fn(this.get());
      };
      Success.prototype.filter = function (p) {
          try {
              return p(this.get())
                  ? this
                  : new Failure(new Error('Predicate does not hold for value ' + this.value));
          }
          catch (err) {
              return new Failure(err);
          }
      };
      Success.prototype.recover = function (pf) {
          return new Success(this.value);
      };
      Success.prototype.failed = function () {
          return new Failure(new Error('Unsupported operation. Success failed'));
      };
      Success.prototype.ap = function (fa) {
          return this.map(fa.get());
      };
      return Success;
  }());
  var Failure = /** @class */ (function () {
      function Failure(value) {
          this.type = 'Failure';
          this.isSuccess = false;
          this.isFailure = true;
          this.value = value;
          return this;
      }
      Failure.prototype.flatMap = function (f) {
          return new Failure(this.value);
      };
      Failure.prototype.map = function (f) {
          return new Failure(this.value);
      };
      Failure.prototype.fold = function (f, s) {
          return f(this.value);
      };
      Failure.prototype.get = function () {
          throw this.value;
      };
      Failure.prototype.getOrElse = function (b) {
          return b();
      };
      Failure.prototype.orElse = function (b) {
          return b;
      };
      Failure.prototype.flatten = function () {
          return this;
      };
      Failure.prototype.forEach = function (fn) {
          // noop
      };
      Failure.prototype.filter = function (p) {
          return this;
      };
      Failure.prototype.recover = function (pf) {
          try {
              return pf(this.value);
          }
          catch (err) {
              return new Failure(err);
          }
      };
      Failure.prototype.failed = function () {
          return new Success(this.value);
      };
      Failure.prototype.ap = function (fa) {
          return new Failure(this.value);
      };
      return Failure;
  }());
  function Try(value) {
      return Try.apply(value);
  }
  /* istanbul ignore next */
  (function (Try) {
      function success(value) {
          return new Success(value);
      }
      Try.success = success;
      function failure(value) {
          return new Failure(value);
      }
      Try.failure = failure;
      function apply(value) {
          try {
              return new Success(value());
          }
          catch (err) {
              return new Failure(err);
          }
      }
      Try.apply = apply;
      function of(value) {
          try {
              return new Success((function () { return value; })());
          }
          catch (err) {
              return new Failure(err);
          }
      }
      Try.of = of;
      function isSuccess(a) {
          return a.isSuccess;
      }
      Try.isSuccess = isSuccess;
      function isFailure(a) {
          return a.isFailure;
      }
      Try.isFailure = isFailure;
      function flatMap(f, a) {
          return a.flatMap(f);
      }
      Try.flatMap = flatMap;
      function map(f, a) {
          return a.map(f);
      }
      Try.map = map;
      function fold(f, s, a) {
          return a.fold(f, s);
      }
      Try.fold = fold;
      function get(a) {
          return a.get();
      }
      Try.get = get;
      function getOrElse(b, a) {
          return a.getOrElse(b);
      }
      Try.getOrElse = getOrElse;
      function orElse(b, a) {
          return a.orElse(b);
      }
      Try.orElse = orElse;
      function flatten(a) {
          return a.flatten();
      }
      Try.flatten = flatten;
      function forEach(fn, a) {
          return a.forEach(fn);
      }
      Try.forEach = forEach;
      function filter(p, a) {
          return a.filter(p);
      }
      Try.filter = filter;
      function recover(pf, a) {
          return a.recover(pf);
      }
      Try.recover = recover;
      function failed(a) {
          return a.failed();
      }
      Try.failed = failed;
      function ap(f, a) {
          return a.ap(f);
      }
      Try.ap = ap;
  })(Try || (Try = {}));

  var ReaderM = /** @class */ (function () {
      function ReaderM(value) {
          this.type = 'Reader';
          this.value = value;
          return this;
      }
      ReaderM.prototype.run = function (config) {
          return this.value(config);
      };
      ReaderM.prototype.get = function (config) {
          return this.run(config);
      };
      ReaderM.prototype.map = function (f) {
          var _this = this;
          return new ReaderM(function (a) { return f(_this.run(a)); });
      };
      ReaderM.prototype.flatMap = function (f) {
          var _this = this;
          return new ReaderM(function (a) { return f(_this.run(a)).run(a); });
      };
      ReaderM.prototype.ap = function (fa) {
          return this.map(fa.get(undefined));
      };
      ReaderM.prototype.zip = function (other) {
          return this.flatMap(function (a) { return other.map(function (b) { return [a, b]; }); });
      };
      return ReaderM;
  }());
  function Reader(value) {
      return Reader.apply(value);
  }
  /* istanbul ignore next */
  (function (Reader) {
      function of(value) {
          return new ReaderM(function () { return value; });
      }
      Reader.of = of;
      function apply(fn) {
          return new ReaderM(fn);
      }
      Reader.apply = apply;
      function run(config, r) {
          return r.run(config);
      }
      Reader.run = run;
      function get(config, r) {
          return r.get(config);
      }
      Reader.get = get;
      function map(f, r) {
          return r.map(f);
      }
      Reader.map = map;
      function flatMap(f, r) {
          return r.flatMap(f);
      }
      Reader.flatMap = flatMap;
      function ap(fa, r) {
          return r.ap(fa);
      }
      Reader.ap = ap;
      function zip(other, r) {
          return r.flatMap(function (a) { return other.map(function (b) { return [a, b]; }); });
      }
      Reader.zip = zip;
  })(Reader || (Reader = {}));

  /**
   * @ignore
   */
  var leftProjection = function (that) { return ({
      get: function () {
          if (that.isLeft) {
              return that.value;
          }
          throw new Error('Unsupported operation');
      },
      getOrElse: function (x) {
          if (that.isLeft) {
              return that;
          }
          return x;
      },
      fold: function (l, r) {
          if (that.isLeft) {
              return l(that.value);
          }
          else {
              return r(that.value);
          }
      },
      map: function (f) {
          if (that.isLeft) {
              return Left(f(that.value)).left;
          }
          return that;
      },
      flatMap: function (f) {
          if (that.isLeft) {
              return f(that.value);
          }
          return that;
      },
      forEach: function (f) {
          if (that.isLeft) {
              f(that.value);
          }
      },
      forAll: function (p) {
          if (that.isLeft) {
              return p(that.value);
          }
          return true;
      },
      exists: function (p) {
          if (that.isLeft) {
              return p(that.value);
          }
          return false;
      },
      toList: function () {
          if (that.isLeft) {
              return [that.value];
          }
          return [];
      },
      filter: function (p) {
          if (that.isLeft && p(that.value)) {
              return Option.some(that);
          }
          return Option.none();
      },
      isRight: that.isRight,
      isLeft: that.isLeft
  }); };
  /**
   * @ignore
   */
  var rightProjection = function (that) { return ({
      get: function () {
          if (that.isRight) {
              return that.value;
          }
          throw new Error('Unsupported operation');
      },
      getOrElse: function (x) {
          if (that.isRight) {
              return that;
          }
          return x;
      },
      fold: function (l, r) {
          if (that.isRight) {
              return r(that.value);
          }
          else {
              return l(that.value);
          }
      },
      map: function (f) {
          if (that.isRight) {
              return Right(f(that.value));
          }
          return that;
      },
      flatMap: function (f) {
          if (that.isRight) {
              return f(that.value);
          }
          return that;
      },
      forEach: function (f) {
          if (that.isRight) {
              f(that.value);
          }
      },
      forAll: function (p) {
          if (that.isRight) {
              return p(that.value);
          }
          return true;
      },
      exists: function (p) {
          if (that.isRight) {
              return p(that.value);
          }
          return false;
      },
      toList: function () {
          if (that.isRight) {
              return [that.value];
          }
          return [];
      },
      filter: function (p) {
          if (that.isRight && p(that.value)) {
              return Option.some(that);
          }
          return Option.none();
      },
      isRight: that.isRight,
      isLeft: that.isLeft
  }); };
  var RightM = /** @class */ (function () {
      function RightM(value) {
          this.type = 'Right';
          this.isRight = true;
          this.isLeft = false;
          this.left = leftProjection(this);
          this.right = rightProjection(this);
          this.get = this.right.get;
          this.fold = this.right.fold;
          this.map = this.right.map;
          this.flatMap = this.right.flatMap;
          this.forEach = this.right.forEach;
          this.getOrElse = this.right.getOrElse;
          this.forAll = this.right.forAll;
          this.exists = this.right.exists;
          this.toList = this.right.toList;
          this.filter = this.right.filter;
          this.value = value;
          return this;
      }
      RightM.prototype.swap = function () {
          return Left(this.value);
      };
      return RightM;
  }());
  var LeftM = /** @class */ (function () {
      function LeftM(value) {
          this.type = 'Left';
          this.isRight = false;
          this.isLeft = true;
          this.left = leftProjection(this);
          this.right = rightProjection(this);
          this.get = this.right.get;
          this.fold = this.right.fold;
          this.map = this.right.map;
          this.flatMap = this.right.flatMap;
          this.forEach = this.right.forEach;
          this.getOrElse = this.right.getOrElse;
          this.forAll = this.right.forAll;
          this.exists = this.right.exists;
          this.toList = this.right.toList;
          this.filter = this.right.filter;
          this.value = value;
          return this;
      }
      LeftM.prototype.swap = function () {
          return Right(this.value);
      };
      return LeftM;
  }());
  function Either(value) {
      return Right(value);
  }
  function Right(value) {
      return Either.apply(value);
  }
  function Left(value) {
      return new LeftM(value);
  }
  (function (Either) {
      function apply(value) {
          return new RightM(value);
      }
      Either.apply = apply;
      function of(value) {
          return new RightM(value);
      }
      Either.of = of;
      function get(e) {
          return e.get();
      }
      Either.get = get;
      function fold(l, r, e) {
          return e.fold(l, r);
      }
      Either.fold = fold;
      function map(f, e) {
          return e.map(f);
      }
      Either.map = map;
      function flatMap(f, e) {
          return e.flatMap(f);
      }
      Either.flatMap = flatMap;
      function swap(e) {
          return e.swap();
      }
      Either.swap = swap;
      function forEach(f, e) {
          e.forEach(f);
      }
      Either.forEach = forEach;
      function getOrElse(x, e) {
          return e.getOrElse(x);
      }
      Either.getOrElse = getOrElse;
      function forAll(p, e) {
          return e.forAll(p);
      }
      Either.forAll = forAll;
      function exists(p, e) {
          return e.exists(p);
      }
      Either.exists = exists;
      function toList(e) {
          return e.toList();
      }
      Either.toList = toList;
      function filter(p, e) {
          return e.filter(p);
      }
      Either.filter = filter;
  })(Either || (Either = {}));

  exports.Option = Option;
  exports.Some = Some;
  exports.None = None;
  exports.Try = Try;
  exports.Reader = Reader;
  exports.Either = Either;
  exports.Left = Left;
  exports.Right = Right;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=fun-monads.umd.js.map

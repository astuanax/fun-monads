'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("../Option");
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
            return Option_1.Option.some(that);
        }
        return Option_1.Option.none();
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
            return Option_1.Option.some(that);
        }
        return Option_1.Option.none();
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
exports.RightM = RightM;
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
exports.LeftM = LeftM;
function Either(value) {
    return Right(value);
}
exports.Either = Either;
function Right(value) {
    return Either.apply(value);
}
exports.Right = Right;
function Left(value) {
    return new LeftM(value);
}
exports.Left = Left;
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
})(Either = exports.Either || (exports.Either = {}));
//# sourceMappingURL=index.js.map
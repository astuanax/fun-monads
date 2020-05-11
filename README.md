# fun-monads

A monad library modelled after scala's monads.

[![Coverage Status](https://coveralls.io/repos/github/astuanax/fun-monads/badge.svg?branch=master)](https://coveralls.io/github/astuanax/fun-monads?branch=master)

## Option
Use the of() or apply() function to create an option
```typescript
const o = Option.apply(1)
const x = Option.of(userObj)
```

The Option monad is not nullable and should never contain null or undefined.

Below examples will all return None 
```typescript
const s: None<any> = new None<any>()
const t: None<any> = Option.none
const u: None<any> = Option(null)
const v: None<any> = Option(undefined)
const w: None<any> = Option.some(null)
const x: None<any> = Option.some(undefined)
const y: None<any> = Option.apply(null)
const z: None<any> = Option.apply(undefined)
```

### Example
```typescript
const user:Option<User> = db.GetUser(123456)

return user
  .filter(user => user.admin === true)
  .map(x => loadAdminData(x))
  .getOrElse("No admin data found")    
```

## Either
The Either monad is right biased but has a left and right projection.
```typescript
const user = Either.of(userObj)
const user = Either.apply(userObj)

const user = userObj.admin === false ? Left(userObj) : Right(userObj)
```

### Example
```typescript
const user: Either<User, Admin> = userObj.admin === false 
  ? Left(userObj) 
  : Right(userObj)

user.map(x => loadAdminData(x))
  .fold(u => getUser(u), a => => getAdmin(a))  
```



## Reader
The Reader monad can be used for dependency injection

Use the of() and apply() function to create a new Reader
```typescript
const r = Reader.of(x => 2*x)
const db = Reader.of(db => db.getType())
```

### Example
```typescript
const getUser: Reader<User, Db> = userId => Reader.apply(db => db.getUser(userId))

const john = getUser(1)
const adam = getUser(5)

john.run(couchbaseDb)
adam.run(postgresDb)
```

## Try
The Try monad is right/success biased. 

Try catch monad, use of() and or apply() function
```typescript
const r = Try.apply(() => getDb())
const db = Try.apply(() => getFile("/path/to/file"))
```

### Example
```typescript
const getUser: Reader<User, Try<DB>> = userId => Reader.apply(db => Try(() => db.getUser(userId)))
const user: Try<User> = getUser(123).run(couchbaseDb)

user.map(x => getUserInfo(x))
  .fold(err=> logAndUiError(err), s => renderUser(s))  
```

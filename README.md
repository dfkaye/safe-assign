# safe-object-assign

Sensible wrapper for `Object.assign()`.

## Documentation

`Object.assign()` can return surprising results when a value to be modified is not an object. 

The point of `safe-object-assign` is to allow users to pass anything,

1. without blowing up,
2. retain the initial value if it is not an object or array,
3. obtain a modified copy of the initial object or array to be updated,
4. mixing only objects or arrays into the new model.

See full details on my blog post at https://dfkaye.com/posts/2020/08/21/safer-object.assign-operations-using-a-sensible-wrapper/

## Install

`npm install safe-object-assign`

**OR**

`git clone https://github.com/dfkaye/safer-object-assign.git`

## Test

Install dependencies (mocha and chai): `npm install safe-object-assign --save-dev`

Run: `npm test`

**OR**

Visit the live demo running the browser test suite on my blog:
https://dfkaye.com/demos/safe-assign-test-suite/.

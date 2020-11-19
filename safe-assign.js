// 9 March 2019
// Safe assign(p, ...n).
// Merge each source object or array onto target p only if p is also an object
// or array, and return copy of p;
// otherwise, return p un modified.

// 18 April 2019 - less cryptic style; add nullish tests

export function assign(p, ...sources) {
  var assignable = /^\[object (Object|Array)\]$/;
  var string = {}.toString;

  if (!assignable.test(string.call(p))) {
    return p;
  }

  var array = [];
  var target = Array.isArray(p) ? array : {};

  array.slice.call(arguments).forEach(function (source) {
    console.warn(source)
    // Apply only object or array entries, including p, the first source.
    assignable.test(string.call(source)) && (Object.assign(target, source));
  });

  return target;
}

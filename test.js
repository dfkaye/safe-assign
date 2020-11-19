/*
 * This suite is run with mocha and uses chai expect.
 * Run this suite from wheredoc root using:
 * 
 *    npm test
 * 
 * Suite uses import syntax. Dependencies can be required or imported per the
 * steps outlined next.
 */

/*
 * To import a commonJS module (in this case, chai.js):
 *  - import createRequire from 'module'
 *  - declare require = createRequire(import.meta.url);
 *  - require the module via its filepath, including extension.
 *  - use destructuring assignment after module is loaded.
 */
import { createRequire } from 'module';
let require = createRequire(import.meta.url);
let chai = require("chai");
let { assert } = chai;

/*
 * To import an ES6 module (in this case, where.js):
 *  - use dynamic import() function
 *  - import the module via its filepath, including extension
 *  - use top-level await import(module_filepath)
 *  - use destructuring assignment in one step, not after.
 */
/* Safe assign: a sensible wrapper for Object.assign(). */
import { assign } from "./safe-assign.js";

describe("safe-assign vs. Object.assign", function () {
  describe("Similarities of each", () => {
    it("assigns array onto object", () => {
      var unsafe = Object.assign({}, ['world']);
      var safe = assign({}, ['world']);

      assert(unsafe[0] === "world");
      assert(safe[0] === unsafe[0]);
    });

    it("assigns object onto array", () => {
      var unsafe = Object.assign([], { name: 'world' });
      var safe = assign([], { name: 'world' });

      assert(unsafe.length === 0);
      assert(unsafe.name === "world")
      assert(safe.length === 0);
      assert(safe.name === "world")
    });

    it("merges array keys onto objects keys", () => {
      var unsafe = Object.assign({ 1: 'one' }, ['a', 'b']);
      var safe = assign({ 1: 'one' }, ['a', 'b']);

      assert(unsafe[0] === 'a');
      assert(unsafe[1] === 'b');
      assert(safe[0] === 'a');
      assert(safe[1] === 'b');
    });

    it("merges object keys onto array keys", () => {
      var unsafe = Object.assign(['a', 'b'], { 0: 'one' });
      var safe = assign(['a', 'b'], { 0: 'one' });

      assert(unsafe[0] === 'one');
      assert(unsafe[1] === 'b');
      assert(safe[0] === 'one');
      assert(safe[1] === 'b');
    });

    it("merges multiple sources", () => {
      var unsafe = Object.assign({ first: 'first' }, { middle: 'middle' }, { last: 'last' });
      var safe = assign({ first: 'first' }, { middle: 'middle' }, { last: 'last' });

      assert(unsafe.first === 'first');
      assert(unsafe.middle === 'middle');
      assert(unsafe.last === 'last');
      assert(safe.first === 'first');
      assert(safe.middle === 'middle');
      assert(safe.last === 'last');
    });
  });

  describe("Differences between", () => {
    describe("Unsafe Object.assign()", () => {
      it("**modifies** original target", () => {
        var target = { name: "original" };
        var unsafe = Object.assign(target, { name: "modified" });

        assert(unsafe === target);
        assert(target.name != "original");
      });

      describe("string sources", () => {
        it("onto objects", () => {
          var unsafe = Object.assign({}, 'hello');

          assert(Object.values(unsafe).join("") === "hello");
        });

        it("onto arrays", () => {
          var unsafe = Object.assign([], 'hello');

          assert(unsafe.join("") === "hello");
        });

        it("overwrite array indexes", () => {
          var unsafe = Object.assign(['a', 'b'], "should not copy", { 2: 'SEE' });

          assert(unsafe.join("") === "shSEEuld not copy");
        });
      });

      describe("number targets", () => {
        it("string onto number returns Number with index keys", () => {
          var unsafe = Object.assign(1, 'hello');

          assert(unsafe.constructor === Number);
          assert(Object.keys(unsafe).join(",") === "0,1,2,3,4");
          assert(Object.values(unsafe).join("") === "hello")
        });

        it("string onto number returns Number", () => {
          var unsafe = Object.assign(1, 'hello');

          assert(unsafe.constructor === Number)
        });
      });

      describe("string targets", () => {
        it("returns a new String object", () => {
          var target = "name";
          var unsafe = Object.assign(target);

          assert(unsafe !== target);
        });

        it("merges string onto an empty string", () => {
          var source = "hello";
          var unsafe = Object.assign("", source);

          assert(Object.values(unsafe).join("") === source);
        });

        it("throws an error when merging onto non-empty string", () => {
          var source = "hello";
          var failed = false;
          try {
            var unsafe = Object.assign("x", source);
          } catch (e) {
            failed = true;
          }
          assert(failed);
        });
      });

      describe("assigning to null", () => {
        it("throws an error", () => {
          var failed = false;
          try {
            var unsafe = Object.assign(null, 'hello'); // 1
          } catch (e) {
            failed = true;
          }

          assert(failed);
        });
      });

      describe("typed object targets", () => {
        after(() => {
          // Clean up after global pollution test.
          Math.idea = undefined;
        });

        it("returns modified target", () => {
          var target = new RegExp("123");
          var unsafe = Object.assign(target, 'abc'); // 1

          assert(unsafe === target);
          assert(unsafe[0] === 'a');
          assert(unsafe[1] === 'b');
          assert(unsafe[2] === 'c');
        });

        it("pollutes globals", () => {
          assert(typeof Math.idea != "function");

          var unsafe = Object.assign(Math, {
            idea: function () { }
          });

          assert(unsafe === Math);
          assert(typeof Math.idea == "function");
        });
      });
    });

    describe("Safe assign()", () => {
      it("**returns a modified copy** of original target", () => {
        var target = { name: "original" };
        var safe = assign(target, { name: "modified" });

        assert(safe !== target);
        assert(safe.name === "modified");
        assert(target.name === "original");
      });

      describe("string sources", () => {
        it("not merged onto objects", () => {
          var safe = assign(['a', 'b'], "should not copy", { 2: 'three' })

          assert(safe.join(", ") === "a, b, three");
        });
      });

      describe("string onto number", () => {
        it("returns original target number", () => {
          var safe = assign(1, 'hello'); // 1

          assert(safe === 1);
          assert(safe[0] === undefined);
        });
      });

      describe("string targets", () => {
        it("returns original string", () => {
          var target = "name";
          var safe = assign(target);

          assert(safe === target);
        });

        it("returns original empty string", () => {
          var source = "name";
          var safe = assign("", source);

          assert(safe === "");
        });

        it("returns original non-empty string without error", () => {
          var target = "name";
          var safe = assign(target, "anything");

          assert(safe === target);
        });
      });

      describe("assigning to null", () => {
        it("returns null", () => {
          var safe = assign(null, 'hello'); // 1

          assert(safe === null);
        });
      });

      describe("typed object targets", () => {
        it("returns original target unmodified", () => {
          var target = new RegExp("123");
          var safe = assign(target, 'abc'); // 1

          assert(safe === target);
          assert(safe[0] === undefined);
        });

        it("does not pollute globals", () => {
          var safe = assign(Math, {
            idea: function () { }
          });

          assert(safe === Math);
          assert(typeof Math.idea != "function");
        });
      });
    });
  });
});

(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Orator = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var objectAssign = require('object-assign');

          // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
          // original notice:

          /*!
           * The buffer module from node.js, for the browser.
           *
           * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
           * @license  MIT
           */
          function compare(a, b) {
            if (a === b) {
              return 0;
            }
            var x = a.length;
            var y = b.length;
            for (var i = 0, len = Math.min(x, y); i < len; ++i) {
              if (a[i] !== b[i]) {
                x = a[i];
                y = b[i];
                break;
              }
            }
            if (x < y) {
              return -1;
            }
            if (y < x) {
              return 1;
            }
            return 0;
          }
          function isBuffer(b) {
            if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
              return global.Buffer.isBuffer(b);
            }
            return !!(b != null && b._isBuffer);
          }

          // based on node assert, original notice:
          // NB: The URL to the CommonJS spec is kept just for tradition.
          //     node-assert has evolved a lot since then, both in API and behavior.

          // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
          //
          // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
          //
          // Originally from narwhal.js (http://narwhaljs.org)
          // Copyright (c) 2009 Thomas Robinson <280north.com>
          //
          // Permission is hereby granted, free of charge, to any person obtaining a copy
          // of this software and associated documentation files (the 'Software'), to
          // deal in the Software without restriction, including without limitation the
          // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
          // sell copies of the Software, and to permit persons to whom the Software is
          // furnished to do so, subject to the following conditions:
          //
          // The above copyright notice and this permission notice shall be included in
          // all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
          // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
          // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

          var util = require('util/');
          var hasOwn = Object.prototype.hasOwnProperty;
          var pSlice = Array.prototype.slice;
          var functionsHaveNames = function () {
            return function foo() {}.name === 'foo';
          }();
          function pToString(obj) {
            return Object.prototype.toString.call(obj);
          }
          function isView(arrbuf) {
            if (isBuffer(arrbuf)) {
              return false;
            }
            if (typeof global.ArrayBuffer !== 'function') {
              return false;
            }
            if (typeof ArrayBuffer.isView === 'function') {
              return ArrayBuffer.isView(arrbuf);
            }
            if (!arrbuf) {
              return false;
            }
            if (arrbuf instanceof DataView) {
              return true;
            }
            if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
              return true;
            }
            return false;
          }
          // 1. The assert module provides functions that throw
          // AssertionError's when particular conditions are not met. The
          // assert module must conform to the following interface.

          var assert = module.exports = ok;

          // 2. The AssertionError is defined in assert.
          // new assert.AssertionError({ message: message,
          //                             actual: actual,
          //                             expected: expected })

          var regex = /\s*function\s+([^\(\s]*)\s*/;
          // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
          function getName(func) {
            if (!util.isFunction(func)) {
              return;
            }
            if (functionsHaveNames) {
              return func.name;
            }
            var str = func.toString();
            var match = str.match(regex);
            return match && match[1];
          }
          assert.AssertionError = function AssertionError(options) {
            this.name = 'AssertionError';
            this.actual = options.actual;
            this.expected = options.expected;
            this.operator = options.operator;
            if (options.message) {
              this.message = options.message;
              this.generatedMessage = false;
            } else {
              this.message = getMessage(this);
              this.generatedMessage = true;
            }
            var stackStartFunction = options.stackStartFunction || fail;
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, stackStartFunction);
            } else {
              // non v8 browsers so we can have a stacktrace
              var err = new Error();
              if (err.stack) {
                var out = err.stack;

                // try to strip useless frames
                var fn_name = getName(stackStartFunction);
                var idx = out.indexOf('\n' + fn_name);
                if (idx >= 0) {
                  // once we have located the function frame
                  // we need to strip out everything before it (and its line)
                  var next_line = out.indexOf('\n', idx + 1);
                  out = out.substring(next_line + 1);
                }
                this.stack = out;
              }
            }
          };

          // assert.AssertionError instanceof Error
          util.inherits(assert.AssertionError, Error);
          function truncate(s, n) {
            if (typeof s === 'string') {
              return s.length < n ? s : s.slice(0, n);
            } else {
              return s;
            }
          }
          function inspect(something) {
            if (functionsHaveNames || !util.isFunction(something)) {
              return util.inspect(something);
            }
            var rawname = getName(something);
            var name = rawname ? ': ' + rawname : '';
            return '[Function' + name + ']';
          }
          function getMessage(self) {
            return truncate(inspect(self.actual), 128) + ' ' + self.operator + ' ' + truncate(inspect(self.expected), 128);
          }

          // At present only the three keys mentioned above are used and
          // understood by the spec. Implementations or sub modules can pass
          // other keys to the AssertionError's constructor - they will be
          // ignored.

          // 3. All of the following functions must throw an AssertionError
          // when a corresponding condition is not met, with a message that
          // may be undefined if not provided.  All assertion methods provide
          // both the actual and expected values to the assertion error for
          // display purposes.

          function fail(actual, expected, message, operator, stackStartFunction) {
            throw new assert.AssertionError({
              message: message,
              actual: actual,
              expected: expected,
              operator: operator,
              stackStartFunction: stackStartFunction
            });
          }

          // EXTENSION! allows for well behaved errors defined elsewhere.
          assert.fail = fail;

          // 4. Pure assertion tests whether a value is truthy, as determined
          // by !!guard.
          // assert.ok(guard, message_opt);
          // This statement is equivalent to assert.equal(true, !!guard,
          // message_opt);. To test strictly for the value true, use
          // assert.strictEqual(true, guard, message_opt);.

          function ok(value, message) {
            if (!value) fail(value, true, message, '==', assert.ok);
          }
          assert.ok = ok;

          // 5. The equality assertion tests shallow, coercive equality with
          // ==.
          // assert.equal(actual, expected, message_opt);

          assert.equal = function equal(actual, expected, message) {
            if (actual != expected) fail(actual, expected, message, '==', assert.equal);
          };

          // 6. The non-equality assertion tests for whether two objects are not equal
          // with != assert.notEqual(actual, expected, message_opt);

          assert.notEqual = function notEqual(actual, expected, message) {
            if (actual == expected) {
              fail(actual, expected, message, '!=', assert.notEqual);
            }
          };

          // 7. The equivalence assertion tests a deep equality relation.
          // assert.deepEqual(actual, expected, message_opt);

          assert.deepEqual = function deepEqual(actual, expected, message) {
            if (!_deepEqual(actual, expected, false)) {
              fail(actual, expected, message, 'deepEqual', assert.deepEqual);
            }
          };
          assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
            if (!_deepEqual(actual, expected, true)) {
              fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
            }
          };
          function _deepEqual(actual, expected, strict, memos) {
            // 7.1. All identical values are equivalent, as determined by ===.
            if (actual === expected) {
              return true;
            } else if (isBuffer(actual) && isBuffer(expected)) {
              return compare(actual, expected) === 0;

              // 7.2. If the expected value is a Date object, the actual value is
              // equivalent if it is also a Date object that refers to the same time.
            } else if (util.isDate(actual) && util.isDate(expected)) {
              return actual.getTime() === expected.getTime();

              // 7.3 If the expected value is a RegExp object, the actual value is
              // equivalent if it is also a RegExp object with the same source and
              // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
            } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
              return actual.source === expected.source && actual.global === expected.global && actual.multiline === expected.multiline && actual.lastIndex === expected.lastIndex && actual.ignoreCase === expected.ignoreCase;

              // 7.4. Other pairs that do not both pass typeof value == 'object',
              // equivalence is determined by ==.
            } else if ((actual === null || typeof actual !== 'object') && (expected === null || typeof expected !== 'object')) {
              return strict ? actual === expected : actual == expected;

              // If both values are instances of typed arrays, wrap their underlying
              // ArrayBuffers in a Buffer each to increase performance
              // This optimization requires the arrays to have the same type as checked by
              // Object.prototype.toString (aka pToString). Never perform binary
              // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
              // bit patterns are not identical.
            } else if (isView(actual) && isView(expected) && pToString(actual) === pToString(expected) && !(actual instanceof Float32Array || actual instanceof Float64Array)) {
              return compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0;

              // 7.5 For all other Object pairs, including Array objects, equivalence is
              // determined by having the same number of owned properties (as verified
              // with Object.prototype.hasOwnProperty.call), the same set of keys
              // (although not necessarily the same order), equivalent values for every
              // corresponding key, and an identical 'prototype' property. Note: this
              // accounts for both named and indexed properties on Arrays.
            } else if (isBuffer(actual) !== isBuffer(expected)) {
              return false;
            } else {
              memos = memos || {
                actual: [],
                expected: []
              };
              var actualIndex = memos.actual.indexOf(actual);
              if (actualIndex !== -1) {
                if (actualIndex === memos.expected.indexOf(expected)) {
                  return true;
                }
              }
              memos.actual.push(actual);
              memos.expected.push(expected);
              return objEquiv(actual, expected, strict, memos);
            }
          }
          function isArguments(object) {
            return Object.prototype.toString.call(object) == '[object Arguments]';
          }
          function objEquiv(a, b, strict, actualVisitedObjects) {
            if (a === null || a === undefined || b === null || b === undefined) return false;
            // if one is a primitive, the other must be same
            if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
            if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
            var aIsArgs = isArguments(a);
            var bIsArgs = isArguments(b);
            if (aIsArgs && !bIsArgs || !aIsArgs && bIsArgs) return false;
            if (aIsArgs) {
              a = pSlice.call(a);
              b = pSlice.call(b);
              return _deepEqual(a, b, strict);
            }
            var ka = objectKeys(a);
            var kb = objectKeys(b);
            var key, i;
            // having the same number of owned properties (keys incorporates
            // hasOwnProperty)
            if (ka.length !== kb.length) return false;
            //the same set of keys (although not necessarily the same order),
            ka.sort();
            kb.sort();
            //~~~cheap key test
            for (i = ka.length - 1; i >= 0; i--) {
              if (ka[i] !== kb[i]) return false;
            }
            //equivalent values for every corresponding key, and
            //~~~possibly expensive deep test
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i];
              if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects)) return false;
            }
            return true;
          }

          // 8. The non-equivalence assertion tests for any deep inequality.
          // assert.notDeepEqual(actual, expected, message_opt);

          assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
            if (_deepEqual(actual, expected, false)) {
              fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
            }
          };
          assert.notDeepStrictEqual = notDeepStrictEqual;
          function notDeepStrictEqual(actual, expected, message) {
            if (_deepEqual(actual, expected, true)) {
              fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
            }
          }

          // 9. The strict equality assertion tests strict equality, as determined by ===.
          // assert.strictEqual(actual, expected, message_opt);

          assert.strictEqual = function strictEqual(actual, expected, message) {
            if (actual !== expected) {
              fail(actual, expected, message, '===', assert.strictEqual);
            }
          };

          // 10. The strict non-equality assertion tests for strict inequality, as
          // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

          assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
              fail(actual, expected, message, '!==', assert.notStrictEqual);
            }
          };
          function expectedException(actual, expected) {
            if (!actual || !expected) {
              return false;
            }
            if (Object.prototype.toString.call(expected) == '[object RegExp]') {
              return expected.test(actual);
            }
            try {
              if (actual instanceof expected) {
                return true;
              }
            } catch (e) {
              // Ignore.  The instanceof check doesn't work for arrow functions.
            }
            if (Error.isPrototypeOf(expected)) {
              return false;
            }
            return expected.call({}, actual) === true;
          }
          function _tryBlock(block) {
            var error;
            try {
              block();
            } catch (e) {
              error = e;
            }
            return error;
          }
          function _throws(shouldThrow, block, expected, message) {
            var actual;
            if (typeof block !== 'function') {
              throw new TypeError('"block" argument must be a function');
            }
            if (typeof expected === 'string') {
              message = expected;
              expected = null;
            }
            actual = _tryBlock(block);
            message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');
            if (shouldThrow && !actual) {
              fail(actual, expected, 'Missing expected exception' + message);
            }
            var userProvidedMessage = typeof message === 'string';
            var isUnwantedException = !shouldThrow && util.isError(actual);
            var isUnexpectedException = !shouldThrow && actual && !expected;
            if (isUnwantedException && userProvidedMessage && expectedException(actual, expected) || isUnexpectedException) {
              fail(actual, expected, 'Got unwanted exception' + message);
            }
            if (shouldThrow && actual && expected && !expectedException(actual, expected) || !shouldThrow && actual) {
              throw actual;
            }
          }

          // 11. Expected to throw an error:
          // assert.throws(block, Error_opt, message_opt);

          assert.throws = function (block, /*optional*/error, /*optional*/message) {
            _throws(true, block, error, message);
          };

          // EXTENSION! This is annoying to write outside this module.
          assert.doesNotThrow = function (block, /*optional*/error, /*optional*/message) {
            _throws(false, block, error, message);
          };
          assert.ifError = function (err) {
            if (err) throw err;
          };

          // Expose a strict only variant of assert
          function strict(value, message) {
            if (!value) fail(value, true, message, '==', strict);
          }
          assert.strict = objectAssign(strict, assert, {
            equal: assert.strictEqual,
            deepEqual: assert.deepStrictEqual,
            notEqual: assert.notStrictEqual,
            notDeepEqual: assert.notDeepStrictEqual
          });
          assert.strict.strict = assert.strict;
          var objectKeys = Object.keys || function (obj) {
            var keys = [];
            for (var key in obj) {
              if (hasOwn.call(obj, key)) keys.push(key);
            }
            return keys;
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "object-assign": 36,
      "util/": 4
    }],
    2: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        };
      }
    }, {}],
    3: [function (require, module, exports) {
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
      };
    }, {}],
    4: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          var formatRegExp = /%[sdj%]/g;
          exports.format = function (f) {
            if (!isString(f)) {
              var objects = [];
              for (var i = 0; i < arguments.length; i++) {
                objects.push(inspect(arguments[i]));
              }
              return objects.join(' ');
            }
            var i = 1;
            var args = arguments;
            var len = args.length;
            var str = String(f).replace(formatRegExp, function (x) {
              if (x === '%%') return '%';
              if (i >= len) return x;
              switch (x) {
                case '%s':
                  return String(args[i++]);
                case '%d':
                  return Number(args[i++]);
                case '%j':
                  try {
                    return JSON.stringify(args[i++]);
                  } catch (_) {
                    return '[Circular]';
                  }
                default:
                  return x;
              }
            });
            for (var x = args[i]; i < len; x = args[++i]) {
              if (isNull(x) || !isObject(x)) {
                str += ' ' + x;
              } else {
                str += ' ' + inspect(x);
              }
            }
            return str;
          };

          // Mark that a method should not be used.
          // Returns a modified function which warns once by default.
          // If --no-deprecation is set, then it is a no-op.
          exports.deprecate = function (fn, msg) {
            // Allow for deprecating things in the process of starting up.
            if (isUndefined(global.process)) {
              return function () {
                return exports.deprecate(fn, msg).apply(this, arguments);
              };
            }
            if (process.noDeprecation === true) {
              return fn;
            }
            var warned = false;
            function deprecated() {
              if (!warned) {
                if (process.throwDeprecation) {
                  throw new Error(msg);
                } else if (process.traceDeprecation) {
                  console.trace(msg);
                } else {
                  console.error(msg);
                }
                warned = true;
              }
              return fn.apply(this, arguments);
            }
            return deprecated;
          };
          var debugs = {};
          var debugEnviron;
          exports.debuglog = function (set) {
            if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
            set = set.toUpperCase();
            if (!debugs[set]) {
              if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                var pid = process.pid;
                debugs[set] = function () {
                  var msg = exports.format.apply(exports, arguments);
                  console.error('%s %d: %s', set, pid, msg);
                };
              } else {
                debugs[set] = function () {};
              }
            }
            return debugs[set];
          };

          /**
           * Echos the value of a value. Trys to print the value out
           * in the best way possible given the different types.
           *
           * @param {Object} obj The object to print out.
           * @param {Object} opts Optional options object that alters the output.
           */
          /* legacy: obj, showHidden, depth, colors*/
          function inspect(obj, opts) {
            // default options
            var ctx = {
              seen: [],
              stylize: stylizeNoColor
            };
            // legacy...
            if (arguments.length >= 3) ctx.depth = arguments[2];
            if (arguments.length >= 4) ctx.colors = arguments[3];
            if (isBoolean(opts)) {
              // legacy...
              ctx.showHidden = opts;
            } else if (opts) {
              // got an "options" object
              exports._extend(ctx, opts);
            }
            // set default options
            if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
            if (isUndefined(ctx.depth)) ctx.depth = 2;
            if (isUndefined(ctx.colors)) ctx.colors = false;
            if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
            if (ctx.colors) ctx.stylize = stylizeWithColor;
            return formatValue(ctx, obj, ctx.depth);
          }
          exports.inspect = inspect;

          // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
          inspect.colors = {
            'bold': [1, 22],
            'italic': [3, 23],
            'underline': [4, 24],
            'inverse': [7, 27],
            'white': [37, 39],
            'grey': [90, 39],
            'black': [30, 39],
            'blue': [34, 39],
            'cyan': [36, 39],
            'green': [32, 39],
            'magenta': [35, 39],
            'red': [31, 39],
            'yellow': [33, 39]
          };

          // Don't use 'blue' not visible on cmd.exe
          inspect.styles = {
            'special': 'cyan',
            'number': 'yellow',
            'boolean': 'yellow',
            'undefined': 'grey',
            'null': 'bold',
            'string': 'green',
            'date': 'magenta',
            // "name": intentionally not styling
            'regexp': 'red'
          };
          function stylizeWithColor(str, styleType) {
            var style = inspect.styles[styleType];
            if (style) {
              return '\u001b[' + inspect.colors[style][0] + 'm' + str + '\u001b[' + inspect.colors[style][1] + 'm';
            } else {
              return str;
            }
          }
          function stylizeNoColor(str, styleType) {
            return str;
          }
          function arrayToHash(array) {
            var hash = {};
            array.forEach(function (val, idx) {
              hash[val] = true;
            });
            return hash;
          }
          function formatValue(ctx, value, recurseTimes) {
            // Provide a hook for user-specified inspect functions.
            // Check that value is an object with an inspect function on it
            if (ctx.customInspect && value && isFunction(value.inspect) &&
            // Filter out the util module, it's inspect function is special
            value.inspect !== exports.inspect &&
            // Also filter out any prototype objects using the circular check.
            !(value.constructor && value.constructor.prototype === value)) {
              var ret = value.inspect(recurseTimes, ctx);
              if (!isString(ret)) {
                ret = formatValue(ctx, ret, recurseTimes);
              }
              return ret;
            }

            // Primitive types cannot have properties
            var primitive = formatPrimitive(ctx, value);
            if (primitive) {
              return primitive;
            }

            // Look up the keys of the object.
            var keys = Object.keys(value);
            var visibleKeys = arrayToHash(keys);
            if (ctx.showHidden) {
              keys = Object.getOwnPropertyNames(value);
            }

            // IE doesn't make error fields non-enumerable
            // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
            if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
              return formatError(value);
            }

            // Some type of object without properties can be shortcutted.
            if (keys.length === 0) {
              if (isFunction(value)) {
                var name = value.name ? ': ' + value.name : '';
                return ctx.stylize('[Function' + name + ']', 'special');
              }
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
              }
              if (isDate(value)) {
                return ctx.stylize(Date.prototype.toString.call(value), 'date');
              }
              if (isError(value)) {
                return formatError(value);
              }
            }
            var base = '',
              array = false,
              braces = ['{', '}'];

            // Make Array say that they are Array
            if (isArray(value)) {
              array = true;
              braces = ['[', ']'];
            }

            // Make functions say that they are functions
            if (isFunction(value)) {
              var n = value.name ? ': ' + value.name : '';
              base = ' [Function' + n + ']';
            }

            // Make RegExps say that they are RegExps
            if (isRegExp(value)) {
              base = ' ' + RegExp.prototype.toString.call(value);
            }

            // Make dates with properties first say the date
            if (isDate(value)) {
              base = ' ' + Date.prototype.toUTCString.call(value);
            }

            // Make error with message first say the error
            if (isError(value)) {
              base = ' ' + formatError(value);
            }
            if (keys.length === 0 && (!array || value.length == 0)) {
              return braces[0] + base + braces[1];
            }
            if (recurseTimes < 0) {
              if (isRegExp(value)) {
                return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
              } else {
                return ctx.stylize('[Object]', 'special');
              }
            }
            ctx.seen.push(value);
            var output;
            if (array) {
              output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
            } else {
              output = keys.map(function (key) {
                return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
              });
            }
            ctx.seen.pop();
            return reduceToSingleString(output, base, braces);
          }
          function formatPrimitive(ctx, value) {
            if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
            if (isString(value)) {
              var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
              return ctx.stylize(simple, 'string');
            }
            if (isNumber(value)) return ctx.stylize('' + value, 'number');
            if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
            // For some reason typeof null is "object", so special case here.
            if (isNull(value)) return ctx.stylize('null', 'null');
          }
          function formatError(value) {
            return '[' + Error.prototype.toString.call(value) + ']';
          }
          function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
            var output = [];
            for (var i = 0, l = value.length; i < l; ++i) {
              if (hasOwnProperty(value, String(i))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
              } else {
                output.push('');
              }
            }
            keys.forEach(function (key) {
              if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
              }
            });
            return output;
          }
          function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
            var name, str, desc;
            desc = Object.getOwnPropertyDescriptor(value, key) || {
              value: value[key]
            };
            if (desc.get) {
              if (desc.set) {
                str = ctx.stylize('[Getter/Setter]', 'special');
              } else {
                str = ctx.stylize('[Getter]', 'special');
              }
            } else {
              if (desc.set) {
                str = ctx.stylize('[Setter]', 'special');
              }
            }
            if (!hasOwnProperty(visibleKeys, key)) {
              name = '[' + key + ']';
            }
            if (!str) {
              if (ctx.seen.indexOf(desc.value) < 0) {
                if (isNull(recurseTimes)) {
                  str = formatValue(ctx, desc.value, null);
                } else {
                  str = formatValue(ctx, desc.value, recurseTimes - 1);
                }
                if (str.indexOf('\n') > -1) {
                  if (array) {
                    str = str.split('\n').map(function (line) {
                      return '  ' + line;
                    }).join('\n').substr(2);
                  } else {
                    str = '\n' + str.split('\n').map(function (line) {
                      return '   ' + line;
                    }).join('\n');
                  }
                }
              } else {
                str = ctx.stylize('[Circular]', 'special');
              }
            }
            if (isUndefined(name)) {
              if (array && key.match(/^\d+$/)) {
                return str;
              }
              name = JSON.stringify('' + key);
              if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.substr(1, name.length - 2);
                name = ctx.stylize(name, 'name');
              } else {
                name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
                name = ctx.stylize(name, 'string');
              }
            }
            return name + ': ' + str;
          }
          function reduceToSingleString(output, base, braces) {
            var numLinesEst = 0;
            var length = output.reduce(function (prev, cur) {
              numLinesEst++;
              if (cur.indexOf('\n') >= 0) numLinesEst++;
              return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
            }, 0);
            if (length > 60) {
              return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
            }
            return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
          }

          // NOTE: These type checking functions intentionally don't use `instanceof`
          // because it is fragile and can be easily faked with `Object.create()`.
          function isArray(ar) {
            return Array.isArray(ar);
          }
          exports.isArray = isArray;
          function isBoolean(arg) {
            return typeof arg === 'boolean';
          }
          exports.isBoolean = isBoolean;
          function isNull(arg) {
            return arg === null;
          }
          exports.isNull = isNull;
          function isNullOrUndefined(arg) {
            return arg == null;
          }
          exports.isNullOrUndefined = isNullOrUndefined;
          function isNumber(arg) {
            return typeof arg === 'number';
          }
          exports.isNumber = isNumber;
          function isString(arg) {
            return typeof arg === 'string';
          }
          exports.isString = isString;
          function isSymbol(arg) {
            return typeof arg === 'symbol';
          }
          exports.isSymbol = isSymbol;
          function isUndefined(arg) {
            return arg === void 0;
          }
          exports.isUndefined = isUndefined;
          function isRegExp(re) {
            return isObject(re) && objectToString(re) === '[object RegExp]';
          }
          exports.isRegExp = isRegExp;
          function isObject(arg) {
            return typeof arg === 'object' && arg !== null;
          }
          exports.isObject = isObject;
          function isDate(d) {
            return isObject(d) && objectToString(d) === '[object Date]';
          }
          exports.isDate = isDate;
          function isError(e) {
            return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
          }
          exports.isError = isError;
          function isFunction(arg) {
            return typeof arg === 'function';
          }
          exports.isFunction = isFunction;
          function isPrimitive(arg) {
            return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'symbol' ||
            // ES6 symbol
            typeof arg === 'undefined';
          }
          exports.isPrimitive = isPrimitive;
          exports.isBuffer = require('./support/isBuffer');
          function objectToString(o) {
            return Object.prototype.toString.call(o);
          }
          function pad(n) {
            return n < 10 ? '0' + n.toString(10) : n.toString(10);
          }
          var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

          // 26 Feb 16:19:34
          function timestamp() {
            var d = new Date();
            var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
            return [d.getDate(), months[d.getMonth()], time].join(' ');
          }

          // log is just a thin wrapper to console.log that prepends a timestamp
          exports.log = function () {
            console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
          };

          /**
           * Inherit the prototype methods from one constructor into another.
           *
           * The Function.prototype.inherits from lang.js rewritten as a standalone
           * function (not on Function.prototype). NOTE: If this file is to be loaded
           * during bootstrapping this function needs to be rewritten using some native
           * functions as prototype setup using normal JavaScript does not work as
           * expected during bootstrapping (see mirror.js in r114903).
           *
           * @param {function} ctor Constructor function which needs to inherit the
           *     prototype.
           * @param {function} superCtor Constructor function to inherit prototype from.
           */
          exports.inherits = require('inherits');
          exports._extend = function (origin, add) {
            // Don't do anything if add isn't an object
            if (!add || !isObject(add)) return origin;
            var keys = Object.keys(add);
            var i = keys.length;
            while (i--) {
              origin[keys[i]] = add[keys[i]];
            }
            return origin;
          };
          function hasOwnProperty(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
          }
        }).call(this);
      }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./support/isBuffer": 3,
      "_process": 37,
      "inherits": 2
    }],
    5: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = asyncify;
      var _initialParams = require('./internal/initialParams.js');
      var _initialParams2 = _interopRequireDefault(_initialParams);
      var _setImmediate = require('./internal/setImmediate.js');
      var _setImmediate2 = _interopRequireDefault(_setImmediate);
      var _wrapAsync = require('./internal/wrapAsync.js');
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * Take a sync function and make it async, passing its return value to a
       * callback. This is useful for plugging sync functions into a waterfall,
       * series, or other async functions. Any arguments passed to the generated
       * function will be passed to the wrapped function (except for the final
       * callback argument). Errors thrown will be passed to the callback.
       *
       * If the function passed to `asyncify` returns a Promise, that promises's
       * resolved/rejected state will be used to call the callback, rather than simply
       * the synchronous return value.
       *
       * This also means you can asyncify ES2017 `async` functions.
       *
       * @name asyncify
       * @static
       * @memberOf module:Utils
       * @method
       * @alias wrapSync
       * @category Util
       * @param {Function} func - The synchronous function, or Promise-returning
       * function to convert to an {@link AsyncFunction}.
       * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
       * invoked with `(args..., callback)`.
       * @example
       *
       * // passing a regular synchronous function
       * async.waterfall([
       *     async.apply(fs.readFile, filename, "utf8"),
       *     async.asyncify(JSON.parse),
       *     function (data, next) {
       *         // data is the result of parsing the text.
       *         // If there was a parsing error, it would have been caught.
       *     }
       * ], callback);
       *
       * // passing a function returning a promise
       * async.waterfall([
       *     async.apply(fs.readFile, filename, "utf8"),
       *     async.asyncify(function (contents) {
       *         return db.model.create(contents);
       *     }),
       *     function (model, next) {
       *         // `model` is the instantiated model object.
       *         // If there was an error, this function would be skipped.
       *     }
       * ], callback);
       *
       * // es2017 example, though `asyncify` is not needed if your JS environment
       * // supports async functions out of the box
       * var q = async.queue(async.asyncify(async function(file) {
       *     var intermediateStep = await processFile(file);
       *     return await somePromise(intermediateStep)
       * }));
       *
       * q.push(files);
       */
      function asyncify(func) {
        if ((0, _wrapAsync.isAsync)(func)) {
          return function (...args /*, callback*/) {
            const callback = args.pop();
            const promise = func.apply(this, args);
            return handlePromise(promise, callback);
          };
        }
        return (0, _initialParams2.default)(function (args, callback) {
          var result;
          try {
            result = func.apply(this, args);
          } catch (e) {
            return callback(e);
          }
          // if result is Promise object
          if (result && typeof result.then === 'function') {
            return handlePromise(result, callback);
          } else {
            callback(null, result);
          }
        });
      }
      function handlePromise(promise, callback) {
        return promise.then(value => {
          invokeCallback(callback, null, value);
        }, err => {
          invokeCallback(callback, err && err.message ? err : new Error(err));
        });
      }
      function invokeCallback(callback, error, value) {
        try {
          callback(error, value);
        } catch (err) {
          (0, _setImmediate2.default)(e => {
            throw e;
          }, err);
        }
      }
      module.exports = exports['default'];
    }, {
      "./internal/initialParams.js": 13,
      "./internal/setImmediate.js": 18,
      "./internal/wrapAsync.js": 19
    }],
    6: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _eachOfLimit2 = require('./internal/eachOfLimit.js');
      var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2);
      var _wrapAsync = require('./internal/wrapAsync.js');
      var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
      var _awaitify = require('./internal/awaitify.js');
      var _awaitify2 = _interopRequireDefault(_awaitify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
       * time.
       *
       * @name eachOfLimit
       * @static
       * @memberOf module:Collections
       * @method
       * @see [async.eachOf]{@link module:Collections.eachOf}
       * @alias forEachOfLimit
       * @category Collection
       * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
       * @param {number} limit - The maximum number of async operations at a time.
       * @param {AsyncFunction} iteratee - An async function to apply to each
       * item in `coll`. The `key` is the item's key, or index in the case of an
       * array.
       * Invoked with (item, key, callback).
       * @param {Function} [callback] - A callback which is called when all
       * `iteratee` functions have finished, or an error occurs. Invoked with (err).
       * @returns {Promise} a promise, if a callback is omitted
       */
      function eachOfLimit(coll, limit, iteratee, callback) {
        return (0, _eachOfLimit3.default)(limit)(coll, (0, _wrapAsync2.default)(iteratee), callback);
      }
      exports.default = (0, _awaitify2.default)(eachOfLimit, 4);
      module.exports = exports['default'];
    }, {
      "./internal/awaitify.js": 9,
      "./internal/eachOfLimit.js": 11,
      "./internal/wrapAsync.js": 19
    }],
    7: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _eachOfLimit = require('./eachOfLimit.js');
      var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit);
      var _awaitify = require('./internal/awaitify.js');
      var _awaitify2 = _interopRequireDefault(_awaitify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
       *
       * @name eachOfSeries
       * @static
       * @memberOf module:Collections
       * @method
       * @see [async.eachOf]{@link module:Collections.eachOf}
       * @alias forEachOfSeries
       * @category Collection
       * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
       * @param {AsyncFunction} iteratee - An async function to apply to each item in
       * `coll`.
       * Invoked with (item, key, callback).
       * @param {Function} [callback] - A callback which is called when all `iteratee`
       * functions have finished, or an error occurs. Invoked with (err).
       * @returns {Promise} a promise, if a callback is omitted
       */
      function eachOfSeries(coll, iteratee, callback) {
        return (0, _eachOfLimit2.default)(coll, 1, iteratee, callback);
      }
      exports.default = (0, _awaitify2.default)(eachOfSeries, 3);
      module.exports = exports['default'];
    }, {
      "./eachOfLimit.js": 6,
      "./internal/awaitify.js": 9
    }],
    8: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = asyncEachOfLimit;
      var _breakLoop = require('./breakLoop.js');
      var _breakLoop2 = _interopRequireDefault(_breakLoop);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      // for async generators
      function asyncEachOfLimit(generator, limit, iteratee, callback) {
        let done = false;
        let canceled = false;
        let awaiting = false;
        let running = 0;
        let idx = 0;
        function replenish() {
          //console.log('replenish')
          if (running >= limit || awaiting || done) return;
          //console.log('replenish awaiting')
          awaiting = true;
          generator.next().then(({
            value,
            done: iterDone
          }) => {
            //console.log('got value', value)
            if (canceled || done) return;
            awaiting = false;
            if (iterDone) {
              done = true;
              if (running <= 0) {
                //console.log('done nextCb')
                callback(null);
              }
              return;
            }
            running++;
            iteratee(value, idx, iterateeCallback);
            idx++;
            replenish();
          }).catch(handleError);
        }
        function iterateeCallback(err, result) {
          //console.log('iterateeCallback')
          running -= 1;
          if (canceled) return;
          if (err) return handleError(err);
          if (err === false) {
            done = true;
            canceled = true;
            return;
          }
          if (result === _breakLoop2.default || done && running <= 0) {
            done = true;
            //console.log('done iterCb')
            return callback(null);
          }
          replenish();
        }
        function handleError(err) {
          if (canceled) return;
          awaiting = false;
          done = true;
          callback(err);
        }
        replenish();
      }
      module.exports = exports['default'];
    }, {
      "./breakLoop.js": 10
    }],
    9: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = awaitify;
      // conditionally promisify a function.
      // only return a promise if a callback is omitted
      function awaitify(asyncFn, arity = asyncFn.length) {
        if (!arity) throw new Error('arity is undefined');
        function awaitable(...args) {
          if (typeof args[arity - 1] === 'function') {
            return asyncFn.apply(this, args);
          }
          return new Promise((resolve, reject) => {
            args[arity - 1] = (err, ...cbArgs) => {
              if (err) return reject(err);
              resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0]);
            };
            asyncFn.apply(this, args);
          });
        }
        return awaitable;
      }
      module.exports = exports['default'];
    }, {}],
    10: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      // A temporary value used to identify if the loop should be broken.
      // See #1064, #1293
      const breakLoop = {};
      exports.default = breakLoop;
      module.exports = exports["default"];
    }, {}],
    11: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _once = require('./once.js');
      var _once2 = _interopRequireDefault(_once);
      var _iterator = require('./iterator.js');
      var _iterator2 = _interopRequireDefault(_iterator);
      var _onlyOnce = require('./onlyOnce.js');
      var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
      var _wrapAsync = require('./wrapAsync.js');
      var _asyncEachOfLimit = require('./asyncEachOfLimit.js');
      var _asyncEachOfLimit2 = _interopRequireDefault(_asyncEachOfLimit);
      var _breakLoop = require('./breakLoop.js');
      var _breakLoop2 = _interopRequireDefault(_breakLoop);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      exports.default = limit => {
        return (obj, iteratee, callback) => {
          callback = (0, _once2.default)(callback);
          if (limit <= 0) {
            throw new RangeError('concurrency limit cannot be less than 1');
          }
          if (!obj) {
            return callback(null);
          }
          if ((0, _wrapAsync.isAsyncGenerator)(obj)) {
            return (0, _asyncEachOfLimit2.default)(obj, limit, iteratee, callback);
          }
          if ((0, _wrapAsync.isAsyncIterable)(obj)) {
            return (0, _asyncEachOfLimit2.default)(obj[Symbol.asyncIterator](), limit, iteratee, callback);
          }
          var nextElem = (0, _iterator2.default)(obj);
          var done = false;
          var canceled = false;
          var running = 0;
          var looping = false;
          function iterateeCallback(err, value) {
            if (canceled) return;
            running -= 1;
            if (err) {
              done = true;
              callback(err);
            } else if (err === false) {
              done = true;
              canceled = true;
            } else if (value === _breakLoop2.default || done && running <= 0) {
              done = true;
              return callback(null);
            } else if (!looping) {
              replenish();
            }
          }
          function replenish() {
            looping = true;
            while (running < limit && !done) {
              var elem = nextElem();
              if (elem === null) {
                done = true;
                if (running <= 0) {
                  callback(null);
                }
                return;
              }
              running += 1;
              iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback));
            }
            looping = false;
          }
          replenish();
        };
      };
      module.exports = exports['default'];
    }, {
      "./asyncEachOfLimit.js": 8,
      "./breakLoop.js": 10,
      "./iterator.js": 15,
      "./once.js": 16,
      "./onlyOnce.js": 17,
      "./wrapAsync.js": 19
    }],
    12: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = function (coll) {
        return coll[Symbol.iterator] && coll[Symbol.iterator]();
      };
      module.exports = exports["default"];
    }, {}],
    13: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = function (fn) {
        return function (...args /*, callback*/) {
          var callback = args.pop();
          return fn.call(this, args, callback);
        };
      };
      module.exports = exports["default"];
    }, {}],
    14: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = isArrayLike;
      function isArrayLike(value) {
        return value && typeof value.length === 'number' && value.length >= 0 && value.length % 1 === 0;
      }
      module.exports = exports['default'];
    }, {}],
    15: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = createIterator;
      var _isArrayLike = require('./isArrayLike.js');
      var _isArrayLike2 = _interopRequireDefault(_isArrayLike);
      var _getIterator = require('./getIterator.js');
      var _getIterator2 = _interopRequireDefault(_getIterator);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function createArrayIterator(coll) {
        var i = -1;
        var len = coll.length;
        return function next() {
          return ++i < len ? {
            value: coll[i],
            key: i
          } : null;
        };
      }
      function createES2015Iterator(iterator) {
        var i = -1;
        return function next() {
          var item = iterator.next();
          if (item.done) return null;
          i++;
          return {
            value: item.value,
            key: i
          };
        };
      }
      function createObjectIterator(obj) {
        var okeys = obj ? Object.keys(obj) : [];
        var i = -1;
        var len = okeys.length;
        return function next() {
          var key = okeys[++i];
          if (key === '__proto__') {
            return next();
          }
          return i < len ? {
            value: obj[key],
            key
          } : null;
        };
      }
      function createIterator(coll) {
        if ((0, _isArrayLike2.default)(coll)) {
          return createArrayIterator(coll);
        }
        var iterator = (0, _getIterator2.default)(coll);
        return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
      }
      module.exports = exports['default'];
    }, {
      "./getIterator.js": 12,
      "./isArrayLike.js": 14
    }],
    16: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = once;
      function once(fn) {
        function wrapper(...args) {
          if (fn === null) return;
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        }
        Object.assign(wrapper, fn);
        return wrapper;
      }
      module.exports = exports["default"];
    }, {}],
    17: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = onlyOnce;
      function onlyOnce(fn) {
        return function (...args) {
          if (fn === null) throw new Error("Callback was already called.");
          var callFn = fn;
          fn = null;
          callFn.apply(this, args);
        };
      }
      module.exports = exports["default"];
    }, {}],
    18: [function (require, module, exports) {
      (function (process, setImmediate) {
        (function () {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.fallback = fallback;
          exports.wrap = wrap;
          /* istanbul ignore file */

          var hasQueueMicrotask = exports.hasQueueMicrotask = typeof queueMicrotask === 'function' && queueMicrotask;
          var hasSetImmediate = exports.hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
          var hasNextTick = exports.hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';
          function fallback(fn) {
            setTimeout(fn, 0);
          }
          function wrap(defer) {
            return (fn, ...args) => defer(() => fn(...args));
          }
          var _defer;
          if (hasQueueMicrotask) {
            _defer = queueMicrotask;
          } else if (hasSetImmediate) {
            _defer = setImmediate;
          } else if (hasNextTick) {
            _defer = process.nextTick;
          } else {
            _defer = fallback;
          }
          exports.default = wrap(_defer);
        }).call(this);
      }).call(this, require('_process'), require("timers").setImmediate);
    }, {
      "_process": 37,
      "timers": 44
    }],
    19: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.isAsyncIterable = exports.isAsyncGenerator = exports.isAsync = undefined;
      var _asyncify = require('../asyncify.js');
      var _asyncify2 = _interopRequireDefault(_asyncify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }
      function isAsync(fn) {
        return fn[Symbol.toStringTag] === 'AsyncFunction';
      }
      function isAsyncGenerator(fn) {
        return fn[Symbol.toStringTag] === 'AsyncGenerator';
      }
      function isAsyncIterable(obj) {
        return typeof obj[Symbol.asyncIterator] === 'function';
      }
      function wrapAsync(asyncFn) {
        if (typeof asyncFn !== 'function') throw new Error('expected a function');
        return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn;
      }
      exports.default = wrapAsync;
      exports.isAsync = isAsync;
      exports.isAsyncGenerator = isAsyncGenerator;
      exports.isAsyncIterable = isAsyncIterable;
    }, {
      "../asyncify.js": 5
    }],
    20: [function (require, module, exports) {
      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      var _once = require('./internal/once.js');
      var _once2 = _interopRequireDefault(_once);
      var _onlyOnce = require('./internal/onlyOnce.js');
      var _onlyOnce2 = _interopRequireDefault(_onlyOnce);
      var _wrapAsync = require('./internal/wrapAsync.js');
      var _wrapAsync2 = _interopRequireDefault(_wrapAsync);
      var _awaitify = require('./internal/awaitify.js');
      var _awaitify2 = _interopRequireDefault(_awaitify);
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      /**
       * Runs the `tasks` array of functions in series, each passing their results to
       * the next in the array. However, if any of the `tasks` pass an error to their
       * own callback, the next function is not executed, and the main `callback` is
       * immediately called with the error.
       *
       * @name waterfall
       * @static
       * @memberOf module:ControlFlow
       * @method
       * @category Control Flow
       * @param {Array} tasks - An array of [async functions]{@link AsyncFunction}
       * to run.
       * Each function should complete with any number of `result` values.
       * The `result` values will be passed as arguments, in order, to the next task.
       * @param {Function} [callback] - An optional callback to run once all the
       * functions have completed. This will be passed the results of the last task's
       * callback. Invoked with (err, [results]).
       * @returns {Promise} a promise, if a callback is omitted
       * @example
       *
       * async.waterfall([
       *     function(callback) {
       *         callback(null, 'one', 'two');
       *     },
       *     function(arg1, arg2, callback) {
       *         // arg1 now equals 'one' and arg2 now equals 'two'
       *         callback(null, 'three');
       *     },
       *     function(arg1, callback) {
       *         // arg1 now equals 'three'
       *         callback(null, 'done');
       *     }
       * ], function (err, result) {
       *     // result now equals 'done'
       * });
       *
       * // Or, with named functions:
       * async.waterfall([
       *     myFirstFunction,
       *     mySecondFunction,
       *     myLastFunction,
       * ], function (err, result) {
       *     // result now equals 'done'
       * });
       * function myFirstFunction(callback) {
       *     callback(null, 'one', 'two');
       * }
       * function mySecondFunction(arg1, arg2, callback) {
       *     // arg1 now equals 'one' and arg2 now equals 'two'
       *     callback(null, 'three');
       * }
       * function myLastFunction(arg1, callback) {
       *     // arg1 now equals 'three'
       *     callback(null, 'done');
       * }
       */
      function waterfall(tasks, callback) {
        callback = (0, _once2.default)(callback);
        if (!Array.isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
        if (!tasks.length) return callback();
        var taskIndex = 0;
        function nextTask(args) {
          var task = (0, _wrapAsync2.default)(tasks[taskIndex++]);
          task(...args, (0, _onlyOnce2.default)(next));
        }
        function next(err, ...args) {
          if (err === false) return;
          if (err || taskIndex === tasks.length) {
            return callback(err, ...args);
          }
          nextTask(args);
        }
        nextTask([]);
      }
      exports.default = (0, _awaitify2.default)(waterfall);
      module.exports = exports['default'];
    }, {
      "./internal/awaitify.js": 9,
      "./internal/once.js": 16,
      "./internal/onlyOnce.js": 17,
      "./internal/wrapAsync.js": 19
    }],
    21: [function (require, module, exports) {
      'use strict';

      var UTF8_ACCEPT = 12;
      var UTF8_REJECT = 0;
      var UTF8_DATA = [
      // The first part of the table maps bytes to character to a transition.
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7, 10, 9, 9, 9, 11, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      // The second part of the table maps a state to a new state when adding a
      // transition.
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 24, 36, 48, 60, 72, 84, 96, 0, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // The third part maps the current transition to a mask that needs to apply
      // to the byte.
      0x7F, 0x3F, 0x3F, 0x3F, 0x00, 0x1F, 0x0F, 0x0F, 0x0F, 0x07, 0x07, 0x07];
      function decodeURIComponent(uri) {
        var percentPosition = uri.indexOf('%');
        if (percentPosition === -1) return uri;
        var length = uri.length;
        var decoded = '';
        var last = 0;
        var codepoint = 0;
        var startOfOctets = percentPosition;
        var state = UTF8_ACCEPT;
        while (percentPosition > -1 && percentPosition < length) {
          var high = hexCodeToInt(uri[percentPosition + 1], 4);
          var low = hexCodeToInt(uri[percentPosition + 2], 0);
          var byte = high | low;
          var type = UTF8_DATA[byte];
          state = UTF8_DATA[256 + state + type];
          codepoint = codepoint << 6 | byte & UTF8_DATA[364 + type];
          if (state === UTF8_ACCEPT) {
            decoded += uri.slice(last, startOfOctets);
            decoded += codepoint <= 0xFFFF ? String.fromCharCode(codepoint) : String.fromCharCode(0xD7C0 + (codepoint >> 10), 0xDC00 + (codepoint & 0x3FF));
            codepoint = 0;
            last = percentPosition + 3;
            percentPosition = startOfOctets = uri.indexOf('%', last);
          } else if (state === UTF8_REJECT) {
            return null;
          } else {
            percentPosition += 3;
            if (percentPosition < length && uri.charCodeAt(percentPosition) === 37) continue;
            return null;
          }
        }
        return decoded + uri.slice(last);
      }
      var HEX = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'a': 10,
        'A': 10,
        'b': 11,
        'B': 11,
        'c': 12,
        'C': 12,
        'd': 13,
        'D': 13,
        'e': 14,
        'E': 14,
        'f': 15,
        'F': 15
      };
      function hexCodeToInt(c, shift) {
        var i = HEX[c];
        return i === undefined ? 255 : i << shift;
      }
      module.exports = decodeURIComponent;
    }, {}],
    22: [function (require, module, exports) {
      'use strict';

      // do not edit .js files directly - edit src/index.jst
      module.exports = function equal(a, b) {
        if (a === b) return true;
        if (a && b && typeof a == 'object' && typeof b == 'object') {
          if (a.constructor !== b.constructor) return false;
          var length, i, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length) return false;
            for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
            return true;
          }
          if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
          if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
          if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
          keys = Object.keys(a);
          length = keys.length;
          if (length !== Object.keys(b).length) return false;
          for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
          for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
          }
          return true;
        }

        // true if both NaN, false otherwise
        return a !== a && b !== b;
      };
    }, {}],
    23: [function (require, module, exports) {
      "use strict";

      const parse = require("./parse");
      const stringify = require("./stringify");
      const fastQuerystring = {
        parse,
        stringify
      };

      /**
       * Enable TS and JS support
       *
       * - `const qs = require('fast-querystring')`
       * - `import qs from 'fast-querystring'`
       */
      module.exports = fastQuerystring;
      module.exports.default = fastQuerystring;
      module.exports.parse = parse;
      module.exports.stringify = stringify;
    }, {
      "./parse": 25,
      "./stringify": 26
    }],
    24: [function (require, module, exports) {
      // This file is taken from Node.js project.
      // Full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js

      const hexTable = Array.from({
        length: 256
      }, (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());

      // These characters do not need escaping when generating query strings:
      // ! - . _ ~
      // ' ( ) *
      // digits
      // alpha (uppercase)
      // alpha (lowercase)
      // rome-ignore format: the array should not be formatted
      const noEscape = new Int8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // 0 - 15
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      // 16 - 31
      0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0,
      // 32 - 47
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
      // 48 - 63
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      // 64 - 79
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
      // 80 - 95
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      // 96 - 111
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0 // 112 - 127
      ]);

      /**
       * @param {string} str
       * @returns {string}
       */
      function encodeString(str) {
        const len = str.length;
        if (len === 0) return "";
        let out = "";
        let lastPos = 0;
        let i = 0;
        outer: for (; i < len; i++) {
          let c = str.charCodeAt(i);

          // ASCII
          while (c < 0x80) {
            if (noEscape[c] !== 1) {
              if (lastPos < i) out += str.slice(lastPos, i);
              lastPos = i + 1;
              out += hexTable[c];
            }
            if (++i === len) break outer;
            c = str.charCodeAt(i);
          }
          if (lastPos < i) out += str.slice(lastPos, i);

          // Multi-byte characters ...
          if (c < 0x800) {
            lastPos = i + 1;
            out += hexTable[0xc0 | c >> 6] + hexTable[0x80 | c & 0x3f];
            continue;
          }
          if (c < 0xd800 || c >= 0xe000) {
            lastPos = i + 1;
            out += hexTable[0xe0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3f] + hexTable[0x80 | c & 0x3f];
            continue;
          }
          // Surrogate pair
          ++i;

          // This branch should never happen because all URLSearchParams entries
          // should already be converted to USVString. But, included for
          // completion's sake anyway.
          if (i >= len) {
            throw new Error("URI malformed");
          }
          const c2 = str.charCodeAt(i) & 0x3ff;
          lastPos = i + 1;
          c = 0x10000 + ((c & 0x3ff) << 10 | c2);
          out += hexTable[0xf0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3f] + hexTable[0x80 | c >> 6 & 0x3f] + hexTable[0x80 | c & 0x3f];
        }
        if (lastPos === 0) return str;
        if (lastPos < len) return out + str.slice(lastPos);
        return out;
      }
      module.exports = {
        encodeString
      };
    }, {}],
    25: [function (require, module, exports) {
      "use strict";

      const fastDecode = require("fast-decode-uri-component");
      const plusRegex = /\+/g;
      const Empty = function () {};
      Empty.prototype = Object.create(null);

      /**
       * @callback parse
       * @param {string} input
       */
      function parse(input) {
        // Optimization: Use new Empty() instead of Object.create(null) for performance
        // v8 has a better optimization for initializing functions compared to Object
        const result = new Empty();
        if (typeof input !== "string") {
          return result;
        }
        let inputLength = input.length;
        let key = "";
        let value = "";
        let startingIndex = -1;
        let equalityIndex = -1;
        let shouldDecodeKey = false;
        let shouldDecodeValue = false;
        let keyHasPlus = false;
        let valueHasPlus = false;
        let hasBothKeyValuePair = false;
        let c = 0;

        // Have a boundary of input.length + 1 to access last pair inside the loop.
        for (let i = 0; i < inputLength + 1; i++) {
          c = i !== inputLength ? input.charCodeAt(i) : 38;

          // Handle '&' and end of line to pass the current values to result
          if (c === 38) {
            hasBothKeyValuePair = equalityIndex > startingIndex;

            // Optimization: Reuse equality index to store the end of key
            if (!hasBothKeyValuePair) {
              equalityIndex = i;
            }
            key = input.slice(startingIndex + 1, equalityIndex);

            // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
            if (hasBothKeyValuePair || key.length > 0) {
              // Optimization: Replace '+' with space
              if (keyHasPlus) {
                key = key.replace(plusRegex, " ");
              }

              // Optimization: Do not decode if it's not necessary.
              if (shouldDecodeKey) {
                key = fastDecode(key) || key;
              }
              if (hasBothKeyValuePair) {
                value = input.slice(equalityIndex + 1, i);
                if (valueHasPlus) {
                  value = value.replace(plusRegex, " ");
                }
                if (shouldDecodeValue) {
                  value = fastDecode(value) || value;
                }
              }
              const currentValue = result[key];
              if (currentValue === undefined) {
                result[key] = value;
              } else {
                // Optimization: value.pop is faster than Array.isArray(value)
                if (currentValue.pop) {
                  currentValue.push(value);
                } else {
                  result[key] = [currentValue, value];
                }
              }
            }

            // Reset reading key value pairs
            value = "";
            startingIndex = i;
            equalityIndex = i;
            shouldDecodeKey = false;
            shouldDecodeValue = false;
            keyHasPlus = false;
            valueHasPlus = false;
          }
          // Check '='
          else if (c === 61) {
            if (equalityIndex <= startingIndex) {
              equalityIndex = i;
            }
            // If '=' character occurs again, we should decode the input.
            else {
              shouldDecodeValue = true;
            }
          }
          // Check '+', and remember to replace it with empty space.
          else if (c === 43) {
            if (equalityIndex > startingIndex) {
              valueHasPlus = true;
            } else {
              keyHasPlus = true;
            }
          }
          // Check '%' character for encoding
          else if (c === 37) {
            if (equalityIndex > startingIndex) {
              shouldDecodeValue = true;
            } else {
              shouldDecodeKey = true;
            }
          }
        }
        return result;
      }
      module.exports = parse;
    }, {
      "fast-decode-uri-component": 21
    }],
    26: [function (require, module, exports) {
      "use strict";

      const {
        encodeString
      } = require("./internals/querystring");
      function getAsPrimitive(value) {
        const type = typeof value;
        if (type === "string") {
          // Length check is handled inside encodeString function
          return encodeString(value);
        } else if (type === "bigint") {
          return value.toString();
        } else if (type === "boolean") {
          return value ? "true" : "false";
        } else if (type === "number" && Number.isFinite(value)) {
          return value < 1e21 ? "" + value : encodeString("" + value);
        }
        return "";
      }

      /**
       * @param {Record<string, string | number | boolean
       * | ReadonlyArray<string | number | boolean> | null>} input
       * @returns {string}
       */
      function stringify(input) {
        let result = "";
        if (input === null || typeof input !== "object") {
          return result;
        }
        const separator = "&";
        const keys = Object.keys(input);
        const keyLength = keys.length;
        let valueLength = 0;
        for (let i = 0; i < keyLength; i++) {
          const key = keys[i];
          const value = input[key];
          const encodedKey = encodeString(key) + "=";
          if (i) {
            result += separator;
          }
          if (Array.isArray(value)) {
            valueLength = value.length;
            for (let j = 0; j < valueLength; j++) {
              if (j) {
                result += separator;
              }

              // Optimization: Dividing into multiple lines improves the performance.
              // Since v8 does not need to care about the '+' character if it was one-liner.
              result += encodedKey;
              result += getAsPrimitive(value[j]);
            }
          } else {
            result += encodedKey;
            result += getAsPrimitive(value);
          }
        }
        return result;
      }
      module.exports = stringify;
    }, {
      "./internals/querystring": 24
    }],
    27: [function (require, module, exports) {
      'use strict';

      const HandlerStorage = require('./handler_storage');
      const NODE_TYPES = {
        STATIC: 0,
        PARAMETRIC: 1,
        WILDCARD: 2
      };
      class Node {
        constructor() {
          this.handlerStorage = new HandlerStorage();
        }
      }
      class ParentNode extends Node {
        constructor() {
          super();
          this.staticChildren = {};
        }
        findStaticMatchingChild(path, pathIndex) {
          const staticChild = this.staticChildren[path.charAt(pathIndex)];
          if (staticChild === undefined || !staticChild.matchPrefix(path, pathIndex)) {
            return null;
          }
          return staticChild;
        }
        createStaticChild(path) {
          if (path.length === 0) {
            return this;
          }
          let staticChild = this.staticChildren[path.charAt(0)];
          if (staticChild) {
            let i = 1;
            for (; i < staticChild.prefix.length; i++) {
              if (path.charCodeAt(i) !== staticChild.prefix.charCodeAt(i)) {
                staticChild = staticChild.split(this, i);
                break;
              }
            }
            return staticChild.createStaticChild(path.slice(i));
          }
          const label = path.charAt(0);
          this.staticChildren[label] = new StaticNode(path);
          return this.staticChildren[label];
        }
      }
      class StaticNode extends ParentNode {
        constructor(prefix) {
          super();
          this.prefix = prefix;
          this.wildcardChild = null;
          this.parametricChildren = [];
          this.kind = NODE_TYPES.STATIC;
          this._compilePrefixMatch();
        }
        createParametricChild(regex, staticSuffix) {
          const regexpSource = regex && regex.source;
          let parametricChild = this.parametricChildren.find(child => {
            const childRegexSource = child.regex && child.regex.source;
            return childRegexSource === regexpSource;
          });
          if (parametricChild) {
            return parametricChild;
          }
          parametricChild = new ParametricNode(regex, staticSuffix);
          this.parametricChildren.push(parametricChild);
          this.parametricChildren.sort((child1, child2) => {
            if (!child1.isRegex) return 1;
            if (!child2.isRegex) return -1;
            if (child1.staticSuffix === null) return 1;
            if (child2.staticSuffix === null) return -1;
            if (child2.staticSuffix.endsWith(child1.staticSuffix)) return 1;
            if (child1.staticSuffix.endsWith(child2.staticSuffix)) return -1;
            return 0;
          });
          return parametricChild;
        }
        createWildcardChild() {
          if (this.wildcardChild) {
            return this.wildcardChild;
          }
          this.wildcardChild = new WildcardNode();
          return this.wildcardChild;
        }
        split(parentNode, length) {
          const parentPrefix = this.prefix.slice(0, length);
          const childPrefix = this.prefix.slice(length);
          this.prefix = childPrefix;
          this._compilePrefixMatch();
          const staticNode = new StaticNode(parentPrefix);
          staticNode.staticChildren[childPrefix.charAt(0)] = this;
          parentNode.staticChildren[parentPrefix.charAt(0)] = staticNode;
          return staticNode;
        }
        getNextNode(path, pathIndex, nodeStack, paramsCount) {
          let node = this.findStaticMatchingChild(path, pathIndex);
          let parametricBrotherNodeIndex = 0;
          if (node === null) {
            if (this.parametricChildren.length === 0) {
              return this.wildcardChild;
            }
            node = this.parametricChildren[0];
            parametricBrotherNodeIndex = 1;
          }
          if (this.wildcardChild !== null) {
            nodeStack.push({
              paramsCount,
              brotherPathIndex: pathIndex,
              brotherNode: this.wildcardChild
            });
          }
          for (let i = this.parametricChildren.length - 1; i >= parametricBrotherNodeIndex; i--) {
            nodeStack.push({
              paramsCount,
              brotherPathIndex: pathIndex,
              brotherNode: this.parametricChildren[i]
            });
          }
          return node;
        }
        _compilePrefixMatch() {
          if (this.prefix.length === 1) {
            this.matchPrefix = () => true;
            return;
          }
          const lines = [];
          for (let i = 1; i < this.prefix.length; i++) {
            const charCode = this.prefix.charCodeAt(i);
            lines.push(`path.charCodeAt(i + ${i}) === ${charCode}`);
          }
          this.matchPrefix = new Function('path', 'i', `return ${lines.join(' && ')}`); // eslint-disable-line
        }
      }

      class ParametricNode extends ParentNode {
        constructor(regex, staticSuffix) {
          super();
          this.isRegex = !!regex;
          this.regex = regex || null;
          this.staticSuffix = staticSuffix || null;
          this.kind = NODE_TYPES.PARAMETRIC;
        }
        getNextNode(path, pathIndex) {
          return this.findStaticMatchingChild(path, pathIndex);
        }
      }
      class WildcardNode extends Node {
        constructor() {
          super();
          this.kind = NODE_TYPES.WILDCARD;
        }
        getNextNode() {
          return null;
        }
      }
      module.exports = {
        StaticNode,
        ParametricNode,
        WildcardNode,
        NODE_TYPES
      };
    }, {
      "./handler_storage": 28
    }],
    28: [function (require, module, exports) {
      'use strict';

      class HandlerStorage {
        constructor() {
          this.unconstrainedHandler = null; // optimized reference to the handler that will match most of the time
          this.constraints = [];
          this.handlers = []; // unoptimized list of handler objects for which the fast matcher function will be compiled
          this.constrainedHandlerStores = null;
        }

        // This is the hot path for node handler finding -- change with care!
        getMatchingHandler(derivedConstraints) {
          if (derivedConstraints === undefined) {
            return this.unconstrainedHandler;
          }
          return this._getHandlerMatchingConstraints(derivedConstraints);
        }
        addHandler(handler, params, store, constrainer, constraints) {
          const handlerObject = {
            handler,
            params,
            constraints,
            store: store || null,
            _createParamsObject: this._compileCreateParamsObject(params)
          };
          if (Object.keys(constraints).length === 0) {
            this.unconstrainedHandler = handlerObject;
          }
          for (const constraint of Object.keys(constraints)) {
            if (!this.constraints.includes(constraint)) {
              if (constraint === 'version') {
                // always check the version constraint first as it is the most selective
                this.constraints.unshift(constraint);
              } else {
                this.constraints.push(constraint);
              }
            }
          }
          if (this.handlers.length >= 32) {
            throw new Error('find-my-way supports a maximum of 32 route handlers per node when there are constraints, limit reached');
          }
          this.handlers.push(handlerObject);
          // Sort the most constrained handlers to the front of the list of handlers so they are tested first.
          this.handlers.sort((a, b) => Object.keys(a.constraints).length - Object.keys(b.constraints).length);
          this._compileGetHandlerMatchingConstraints(constrainer, constraints);
        }
        _compileCreateParamsObject(params) {
          const lines = [];
          for (let i = 0; i < params.length; i++) {
            lines.push(`'${params[i]}': paramsArray[${i}]`);
          }
          return new Function('paramsArray', `return {${lines.join(',')}}`); // eslint-disable-line
        }

        _getHandlerMatchingConstraints() {
          return null;
        }

        // Builds a store object that maps from constraint values to a bitmap of handler indexes which pass the constraint for a value
        // So for a host constraint, this might look like { "fastify.io": 0b0010, "google.ca": 0b0101 }, meaning the 3rd handler is constrainted to fastify.io, and the 2nd and 4th handlers are constrained to google.ca.
        // The store's implementation comes from the strategies provided to the Router.
        _buildConstraintStore(store, constraint) {
          for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            const constraintValue = handler.constraints[constraint];
            if (constraintValue !== undefined) {
              let indexes = store.get(constraintValue) || 0;
              indexes |= 1 << i; // set the i-th bit for the mask because this handler is constrained by this value https://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascrip
              store.set(constraintValue, indexes);
            }
          }
        }

        // Builds a bitmask for a given constraint that has a bit for each handler index that is 0 when that handler *is* constrained and 1 when the handler *isnt* constrainted. This is opposite to what might be obvious, but is just for convienience when doing the bitwise operations.
        _constrainedIndexBitmask(constraint) {
          let mask = 0;
          for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            const constraintValue = handler.constraints[constraint];
            if (constraintValue !== undefined) {
              mask |= 1 << i;
            }
          }
          return ~mask;
        }

        // Compile a fast function to match the handlers for this node
        // The function implements a general case multi-constraint matching algorithm.
        // The general idea is this: we have a bunch of handlers, each with a potentially different set of constraints, and sometimes none at all. We're given a list of constraint values and we have to use the constraint-value-comparison strategies to see which handlers match the constraint values passed in.
        // We do this by asking each constraint store which handler indexes match the given constraint value for each store. Trickily, the handlers that a store says match are the handlers constrained by that store, but handlers that aren't constrained at all by that store could still match just fine. So, each constraint store can only describe matches for it, and it won't have any bearing on the handlers it doesn't care about. For this reason, we have to ask each stores which handlers match and track which have been matched (or not cared about) by all of them.
        // We use bitmaps to represent these lists of matches so we can use bitwise operations to implement this efficiently. Bitmaps are cheap to allocate, let us implement this masking behaviour in one CPU instruction, and are quite compact in memory. We start with a bitmap set to all 1s representing every handler that is a match candidate, and then for each constraint, see which handlers match using the store, and then mask the result by the mask of handlers that that store applies to, and bitwise AND with the candidate list. Phew.
        // We consider all this compiling function complexity to be worth it, because the naive implementation that just loops over the handlers asking which stores match is quite a bit slower.
        _compileGetHandlerMatchingConstraints(constrainer) {
          this.constrainedHandlerStores = {};
          for (const constraint of this.constraints) {
            const store = constrainer.newStoreForConstraint(constraint);
            this.constrainedHandlerStores[constraint] = store;
            this._buildConstraintStore(store, constraint);
          }
          const lines = [];
          lines.push(`
    let candidates = ${(1 << this.handlers.length) - 1}
    let mask, matches
    `);
          for (const constraint of this.constraints) {
            // Setup the mask for indexes this constraint applies to. The mask bits are set to 1 for each position if the constraint applies.
            lines.push(`
      mask = ${this._constrainedIndexBitmask(constraint)}
      value = derivedConstraints.${constraint}
      `);

            // If there's no constraint value, none of the handlers constrained by this constraint can match. Remove them from the candidates.
            // If there is a constraint value, get the matching indexes bitmap from the store, and mask it down to only the indexes this constraint applies to, and then bitwise and with the candidates list to leave only matching candidates left.
            const strategy = constrainer.strategies[constraint];
            const matchMask = strategy.mustMatchWhenDerived ? 'matches' : '(matches | mask)';
            lines.push(`
      if (value === undefined) {
        candidates &= mask
      } else {
        matches = this.constrainedHandlerStores.${constraint}.get(value) || 0
        candidates &= ${matchMask}
      }
      if (candidates === 0) return null;
      `);
          }

          // There are some constraints that can be derived and marked as "must match", where if they are derived, they only match routes that actually have a constraint on the value, like the SemVer version constraint.
          // An example: a request comes in for version 1.x, and this node has a handler that matches the path, but there's no version constraint. For SemVer, the find-my-way semantics do not match this handler to that request.
          // This function is used by Nodes with handlers to match when they don't have any constrained routes to exclude request that do have must match derived constraints present.
          for (const constraint in constrainer.strategies) {
            const strategy = constrainer.strategies[constraint];
            if (strategy.mustMatchWhenDerived && !this.constraints.includes(constraint)) {
              lines.push(`if (derivedConstraints.${constraint} !== undefined) return null`);
            }
          }

          // Return the first handler who's bit is set in the candidates https://stackoverflow.com/questions/18134985/how-to-find-index-of-first-set-bit
          lines.push('return this.handlers[Math.floor(Math.log2(candidates))]');
          this._getHandlerMatchingConstraints = new Function('derivedConstraints', lines.join('\n')); // eslint-disable-line
        }
      }

      module.exports = HandlerStorage;
    }, {}],
    29: [function (require, module, exports) {
      'use strict';

      /*
        Char codes:
          '!': 33 - !
          '#': 35 - %23
          '$': 36 - %24
          '%': 37 - %25
          '&': 38 - %26
          ''': 39 - '
          '(': 40 - (
          ')': 41 - )
          '*': 42 - *
          '+': 43 - %2B
          ',': 44 - %2C
          '-': 45 - -
          '.': 46 - .
          '/': 47 - %2F
          ':': 58 - %3A
          ';': 59 - %3B
          '=': 61 - %3D
          '?': 63 - %3F
          '@': 64 - %40
          '_': 95 - _
          '~': 126 - ~
      */
      const assert = require('assert');
      const querystring = require('fast-querystring');
      const isRegexSafe = require('safe-regex2');
      const deepEqual = require('fast-deep-equal');
      const {
        flattenNode,
        compressFlattenedNode,
        prettyPrintFlattenedNode,
        prettyPrintRoutesArray
      } = require('./lib/pretty-print');
      const {
        StaticNode,
        NODE_TYPES
      } = require('./custom_node');
      const Constrainer = require('./lib/constrainer');
      const httpMethods = require('./lib/http-methods');
      const {
        safeDecodeURI,
        safeDecodeURIComponent
      } = require('./lib/url-sanitizer');
      const FULL_PATH_REGEXP = /^https?:\/\/.*?\//;
      const OPTIONAL_PARAM_REGEXP = /(\/:[^/()]*?)\?(\/?)/;
      if (!isRegexSafe(FULL_PATH_REGEXP)) {
        throw new Error('the FULL_PATH_REGEXP is not safe, update this module');
      }
      if (!isRegexSafe(OPTIONAL_PARAM_REGEXP)) {
        throw new Error('the OPTIONAL_PARAM_REGEXP is not safe, update this module');
      }
      function Router(opts) {
        if (!(this instanceof Router)) {
          return new Router(opts);
        }
        opts = opts || {};
        if (opts.defaultRoute) {
          assert(typeof opts.defaultRoute === 'function', 'The default route must be a function');
          this.defaultRoute = opts.defaultRoute;
        } else {
          this.defaultRoute = null;
        }
        if (opts.onBadUrl) {
          assert(typeof opts.onBadUrl === 'function', 'The bad url handler must be a function');
          this.onBadUrl = opts.onBadUrl;
        } else {
          this.onBadUrl = null;
        }
        if (opts.buildPrettyMeta) {
          assert(typeof opts.buildPrettyMeta === 'function', 'buildPrettyMeta must be a function');
          this.buildPrettyMeta = opts.buildPrettyMeta;
        } else {
          this.buildPrettyMeta = defaultBuildPrettyMeta;
        }
        if (opts.querystringParser) {
          assert(typeof opts.querystringParser === 'function', 'querystringParser must be a function');
          this.querystringParser = opts.querystringParser;
        } else {
          this.querystringParser = query => query === '' ? {} : querystring.parse(query);
        }
        this.caseSensitive = opts.caseSensitive === undefined ? true : opts.caseSensitive;
        this.ignoreTrailingSlash = opts.ignoreTrailingSlash || false;
        this.ignoreDuplicateSlashes = opts.ignoreDuplicateSlashes || false;
        this.maxParamLength = opts.maxParamLength || 100;
        this.allowUnsafeRegex = opts.allowUnsafeRegex || false;
        this.routes = [];
        this.trees = {};
        this.constrainer = new Constrainer(opts.constraints);
        this._routesPatterns = {};
      }
      Router.prototype.on = function on(method, path, opts, handler, store) {
        if (typeof opts === 'function') {
          if (handler !== undefined) {
            store = handler;
          }
          handler = opts;
          opts = {};
        }
        // path validation
        assert(typeof path === 'string', 'Path should be a string');
        assert(path.length > 0, 'The path could not be empty');
        assert(path[0] === '/' || path[0] === '*', 'The first character of a path should be `/` or `*`');
        // handler validation
        assert(typeof handler === 'function', 'Handler should be a function');

        // path ends with optional parameter
        const optionalParamMatch = path.match(OPTIONAL_PARAM_REGEXP);
        if (optionalParamMatch) {
          assert(path.length === optionalParamMatch.index + optionalParamMatch[0].length, 'Optional Parameter needs to be the last parameter of the path');
          const pathFull = path.replace(OPTIONAL_PARAM_REGEXP, '$1$2');
          const pathOptional = path.replace(OPTIONAL_PARAM_REGEXP, '$2');
          this.on(method, pathFull, opts, handler, store);
          this.on(method, pathOptional, opts, handler, store);
          return;
        }
        const route = path;
        if (this.ignoreDuplicateSlashes) {
          path = removeDuplicateSlashes(path);
        }
        if (this.ignoreTrailingSlash) {
          path = trimLastSlash(path);
        }
        const methods = Array.isArray(method) ? method : [method];
        for (const method of methods) {
          this._on(method, path, opts, handler, store, route);
          this.routes.push({
            method,
            path,
            opts,
            handler,
            store
          });
        }
      };
      Router.prototype._on = function _on(method, path, opts, handler, store) {
        assert(typeof method === 'string', 'Method should be a string');
        assert(httpMethods.includes(method), `Method '${method}' is not an http method.`);
        let constraints = {};
        if (opts.constraints !== undefined) {
          assert(typeof opts.constraints === 'object' && opts.constraints !== null, 'Constraints should be an object');
          if (Object.keys(opts.constraints).length !== 0) {
            constraints = opts.constraints;
          }
        }
        this.constrainer.validateConstraints(constraints);
        // Let the constrainer know if any constraints are being used now
        this.constrainer.noteUsage(constraints);

        // Boot the tree for this method if it doesn't exist yet
        if (this.trees[method] === undefined) {
          this.trees[method] = new StaticNode('/');
          this._routesPatterns[method] = [];
        }
        if (path === '*' && this.trees[method].prefix.length !== 0) {
          const currentRoot = this.trees[method];
          this.trees[method] = new StaticNode('');
          this.trees[method].staticChildren['/'] = currentRoot;
        }
        let currentNode = this.trees[method];
        let parentNodePathIndex = currentNode.prefix.length;
        const params = [];
        for (let i = 0; i <= path.length; i++) {
          if (path.charCodeAt(i) === 58 && path.charCodeAt(i + 1) === 58) {
            // It's a double colon
            i++;
            continue;
          }
          const isParametricNode = path.charCodeAt(i) === 58 && path.charCodeAt(i + 1) !== 58;
          const isWildcardNode = path.charCodeAt(i) === 42;
          if (isParametricNode || isWildcardNode || i === path.length && i !== parentNodePathIndex) {
            let staticNodePath = path.slice(parentNodePathIndex, i);
            if (!this.caseSensitive) {
              staticNodePath = staticNodePath.toLowerCase();
            }
            staticNodePath = staticNodePath.split('::').join(':');
            staticNodePath = staticNodePath.split('%').join('%25');
            // add the static part of the route to the tree
            currentNode = currentNode.createStaticChild(staticNodePath);
          }
          if (isParametricNode) {
            let isRegexNode = false;
            const regexps = [];
            let lastParamStartIndex = i + 1;
            for (let j = lastParamStartIndex;; j++) {
              const charCode = path.charCodeAt(j);
              const isRegexParam = charCode === 40;
              const isStaticPart = charCode === 45 || charCode === 46;
              const isEndOfNode = charCode === 47 || j === path.length;
              if (isRegexParam || isStaticPart || isEndOfNode) {
                const paramName = path.slice(lastParamStartIndex, j);
                params.push(paramName);
                isRegexNode = isRegexNode || isRegexParam || isStaticPart;
                if (isRegexParam) {
                  const endOfRegexIndex = getClosingParenthensePosition(path, j);
                  const regexString = path.slice(j, endOfRegexIndex + 1);
                  if (!this.allowUnsafeRegex) {
                    assert(isRegexSafe(new RegExp(regexString)), `The regex '${regexString}' is not safe!`);
                  }
                  regexps.push(trimRegExpStartAndEnd(regexString));
                  j = endOfRegexIndex + 1;
                } else {
                  regexps.push('(.*?)');
                }
                const staticPartStartIndex = j;
                for (; j < path.length; j++) {
                  const charCode = path.charCodeAt(j);
                  if (charCode === 47) break;
                  if (charCode === 58) {
                    const nextCharCode = path.charCodeAt(j + 1);
                    if (nextCharCode === 58) j++;else break;
                  }
                }
                let staticPart = path.slice(staticPartStartIndex, j);
                if (staticPart) {
                  staticPart = staticPart.split('::').join(':');
                  staticPart = staticPart.split('%').join('%25');
                  regexps.push(escapeRegExp(staticPart));
                }
                lastParamStartIndex = j + 1;
                if (isEndOfNode || path.charCodeAt(j) === 47 || j === path.length) {
                  const nodePattern = isRegexNode ? '()' + staticPart : staticPart;
                  path = path.slice(0, i + 1) + nodePattern + path.slice(j);
                  i += nodePattern.length;
                  const regex = isRegexNode ? new RegExp('^' + regexps.join('') + '$') : null;
                  currentNode = currentNode.createParametricChild(regex, staticPart || null);
                  parentNodePathIndex = i + 1;
                  break;
                }
              }
            }
          } else if (isWildcardNode) {
            // add the wildcard parameter
            params.push('*');
            currentNode = currentNode.createWildcardChild();
            parentNodePathIndex = i + 1;
            if (i !== path.length - 1) {
              throw new Error('Wildcard must be the last character in the route');
            }
          }
        }
        if (!this.caseSensitive) {
          path = path.toLowerCase();
        }
        if (path === '*') {
          path = '/*';
        }
        for (const existRoute of this._routesPatterns[method]) {
          if (existRoute.path === path && deepEqual(existRoute.constraints, constraints)) {
            throw new Error(`Method '${method}' already declared for route '${path}' with constraints '${JSON.stringify(constraints)}'`);
          }
        }
        this._routesPatterns[method].push({
          path,
          params,
          constraints
        });
        currentNode.handlerStorage.addHandler(handler, params, store, this.constrainer, constraints);
      };
      Router.prototype.hasConstraintStrategy = function (strategyName) {
        return this.constrainer.hasConstraintStrategy(strategyName);
      };
      Router.prototype.addConstraintStrategy = function (constraints) {
        this.constrainer.addConstraintStrategy(constraints);
        this._rebuild(this.routes);
      };
      Router.prototype.reset = function reset() {
        this.trees = {};
        this.routes = [];
        this._routesPatterns = {};
      };
      Router.prototype.off = function off(method, path, constraints) {
        // path validation
        assert(typeof path === 'string', 'Path should be a string');
        assert(path.length > 0, 'The path could not be empty');
        assert(path[0] === '/' || path[0] === '*', 'The first character of a path should be `/` or `*`');
        // options validation
        assert(typeof constraints === 'undefined' || typeof constraints === 'object' && !Array.isArray(constraints) && constraints !== null, 'Constraints should be an object or undefined.');

        // path ends with optional parameter
        const optionalParamMatch = path.match(OPTIONAL_PARAM_REGEXP);
        if (optionalParamMatch) {
          assert(path.length === optionalParamMatch.index + optionalParamMatch[0].length, 'Optional Parameter needs to be the last parameter of the path');
          const pathFull = path.replace(OPTIONAL_PARAM_REGEXP, '$1$2');
          const pathOptional = path.replace(OPTIONAL_PARAM_REGEXP, '$2');
          this.off(method, pathFull, constraints);
          this.off(method, pathOptional, constraints);
          return;
        }
        if (this.ignoreDuplicateSlashes) {
          path = removeDuplicateSlashes(path);
        }
        if (this.ignoreTrailingSlash) {
          path = trimLastSlash(path);
        }
        const methods = Array.isArray(method) ? method : [method];
        for (const method of methods) {
          this._off(method, path, constraints);
        }
      };
      Router.prototype._off = function _off(method, path, constraints) {
        // method validation
        assert(typeof method === 'string', 'Method should be a string');
        assert(httpMethods.includes(method), `Method '${method}' is not an http method.`);
        function matcherWithoutConstraints(route) {
          return method !== route.method || path !== route.path;
        }
        function matcherWithConstraints(route) {
          return matcherWithoutConstraints(route) || !deepEqual(constraints, route.opts.constraints || {});
        }
        const predicate = constraints ? matcherWithConstraints : matcherWithoutConstraints;

        // Rebuild tree without the specific route
        const newRoutes = this.routes.filter(predicate);
        this._rebuild(newRoutes);
      };
      Router.prototype.lookup = function lookup(req, res, ctx, done) {
        if (typeof ctx === 'function') {
          done = ctx;
          ctx = undefined;
        }
        if (done === undefined) {
          const constraints = this.constrainer.deriveConstraints(req, ctx);
          const handle = this.find(req.method, req.url, constraints);
          return this.callHandler(handle, req, res, ctx);
        }
        this.constrainer.deriveConstraints(req, ctx, (err, constraints) => {
          if (err !== null) {
            done(err);
            return;
          }
          try {
            const handle = this.find(req.method, req.url, constraints);
            const result = this.callHandler(handle, req, res, ctx);
            done(null, result);
          } catch (err) {
            done(err);
          }
        });
      };
      Router.prototype.callHandler = function callHandler(handle, req, res, ctx) {
        if (handle === null) return this._defaultRoute(req, res, ctx);
        return ctx === undefined ? handle.handler(req, res, handle.params, handle.store, handle.searchParams) : handle.handler.call(ctx, req, res, handle.params, handle.store, handle.searchParams);
      };
      Router.prototype.find = function find(method, path, derivedConstraints) {
        let currentNode = this.trees[method];
        if (currentNode === undefined) return null;
        if (path.charCodeAt(0) !== 47) {
          // 47 is '/'
          path = path.replace(FULL_PATH_REGEXP, '/');
        }

        // This must be run before sanitizeUrl as the resulting function
        // .sliceParameter must be constructed with same URL string used
        // throughout the rest of this function.
        if (this.ignoreDuplicateSlashes) {
          path = removeDuplicateSlashes(path);
        }
        let sanitizedUrl;
        let querystring;
        let shouldDecodeParam;
        try {
          sanitizedUrl = safeDecodeURI(path);
          path = sanitizedUrl.path;
          querystring = sanitizedUrl.querystring;
          shouldDecodeParam = sanitizedUrl.shouldDecodeParam;
        } catch (error) {
          return this._onBadUrl(path);
        }
        if (this.ignoreTrailingSlash) {
          path = trimLastSlash(path);
        }
        const originPath = path;
        if (this.caseSensitive === false) {
          path = path.toLowerCase();
        }
        const maxParamLength = this.maxParamLength;
        let pathIndex = currentNode.prefix.length;
        const params = [];
        const pathLen = path.length;
        const brothersNodesStack = [];
        while (true) {
          if (pathIndex === pathLen) {
            const handle = currentNode.handlerStorage.getMatchingHandler(derivedConstraints);
            if (handle !== null) {
              return {
                handler: handle.handler,
                store: handle.store,
                params: handle._createParamsObject(params),
                searchParams: this.querystringParser(querystring)
              };
            }
          }
          let node = currentNode.getNextNode(path, pathIndex, brothersNodesStack, params.length);
          if (node === null) {
            if (brothersNodesStack.length === 0) {
              return null;
            }
            const brotherNodeState = brothersNodesStack.pop();
            pathIndex = brotherNodeState.brotherPathIndex;
            params.splice(brotherNodeState.paramsCount);
            node = brotherNodeState.brotherNode;
          }
          currentNode = node;

          // static route
          if (currentNode.kind === NODE_TYPES.STATIC) {
            pathIndex += currentNode.prefix.length;
            continue;
          }
          if (currentNode.kind === NODE_TYPES.WILDCARD) {
            let param = originPath.slice(pathIndex);
            if (shouldDecodeParam) {
              param = safeDecodeURIComponent(param);
            }
            params.push(param);
            pathIndex = pathLen;
            continue;
          }
          if (currentNode.kind === NODE_TYPES.PARAMETRIC) {
            let paramEndIndex = originPath.indexOf('/', pathIndex);
            if (paramEndIndex === -1) {
              paramEndIndex = pathLen;
            }
            let param = originPath.slice(pathIndex, paramEndIndex);
            if (shouldDecodeParam) {
              param = safeDecodeURIComponent(param);
            }
            if (currentNode.isRegex) {
              const matchedParameters = currentNode.regex.exec(param);
              if (matchedParameters === null) continue;
              for (let i = 1; i < matchedParameters.length; i++) {
                const matchedParam = matchedParameters[i];
                if (matchedParam.length > maxParamLength) {
                  return null;
                }
                params.push(matchedParam);
              }
            } else {
              if (param.length > maxParamLength) {
                return null;
              }
              params.push(param);
            }
            pathIndex = paramEndIndex;
          }
        }
      };
      Router.prototype._rebuild = function (routes) {
        this.reset();
        for (const route of routes) {
          const {
            method,
            path,
            opts,
            handler,
            store
          } = route;
          this._on(method, path, opts, handler, store);
          this.routes.push({
            method,
            path,
            opts,
            handler,
            store
          });
        }
      };
      Router.prototype._defaultRoute = function (req, res, ctx) {
        if (this.defaultRoute !== null) {
          return ctx === undefined ? this.defaultRoute(req, res) : this.defaultRoute.call(ctx, req, res);
        } else {
          res.statusCode = 404;
          res.end();
        }
      };
      Router.prototype._onBadUrl = function (path) {
        if (this.onBadUrl === null) {
          return null;
        }
        const onBadUrl = this.onBadUrl;
        return {
          handler: (req, res, ctx) => onBadUrl(path, req, res),
          params: {},
          store: null
        };
      };
      Router.prototype.prettyPrint = function (opts = {}) {
        opts.commonPrefix = opts.commonPrefix === undefined ? true : opts.commonPrefix; // default to original behaviour
        if (!opts.commonPrefix) return prettyPrintRoutesArray.call(this, this.routes, opts);
        const root = {
          prefix: '/',
          nodes: [],
          children: {}
        };
        for (const method in this.trees) {
          const node = this.trees[method];
          if (node) {
            flattenNode(root, node, method);
          }
        }
        compressFlattenedNode(root);
        return prettyPrintFlattenedNode.call(this, root, '', true, opts);
      };
      for (var i in httpMethods) {
        /* eslint no-prototype-builtins: "off" */
        if (!httpMethods.hasOwnProperty(i)) continue;
        const m = httpMethods[i];
        const methodName = m.toLowerCase();
        if (Router.prototype[methodName]) throw new Error('Method already exists: ' + methodName);
        Router.prototype[methodName] = function (path, handler, store) {
          return this.on(m, path, handler, store);
        };
      }
      Router.prototype.all = function (path, handler, store) {
        this.on(httpMethods, path, handler, store);
      };
      module.exports = Router;
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      function removeDuplicateSlashes(path) {
        return path.replace(/\/\/+/g, '/');
      }
      function trimLastSlash(path) {
        if (path.length > 1 && path.charCodeAt(path.length - 1) === 47) {
          return path.slice(0, -1);
        }
        return path;
      }
      function trimRegExpStartAndEnd(regexString) {
        // removes chars that marks start "^" and end "$" of regexp
        if (regexString.charCodeAt(1) === 94) {
          regexString = regexString.slice(0, 1) + regexString.slice(2);
        }
        if (regexString.charCodeAt(regexString.length - 2) === 36) {
          regexString = regexString.slice(0, regexString.length - 2) + regexString.slice(regexString.length - 1);
        }
        return regexString;
      }
      function getClosingParenthensePosition(path, idx) {
        // `path.indexOf()` will always return the first position of the closing parenthese,
        // but it's inefficient for grouped or wrong regexp expressions.
        // see issues #62 and #63 for more info

        var parentheses = 1;
        while (idx < path.length) {
          idx++;

          // ignore skipped chars
          if (path[idx] === '\\') {
            idx++;
            continue;
          }
          if (path[idx] === ')') {
            parentheses--;
          } else if (path[idx] === '(') {
            parentheses++;
          }
          if (!parentheses) return idx;
        }
        throw new TypeError('Invalid regexp expression in "' + path + '"');
      }
      function defaultBuildPrettyMeta(route) {
        // buildPrettyMeta function must return an object, which will be parsed into key/value pairs for display
        if (!route) return {};
        if (!route.store) return {};
        return Object.assign({}, route.store);
      }
    }, {
      "./custom_node": 27,
      "./lib/constrainer": 30,
      "./lib/http-methods": 31,
      "./lib/pretty-print": 32,
      "./lib/url-sanitizer": 35,
      "assert": 1,
      "fast-deep-equal": 22,
      "fast-querystring": 23,
      "safe-regex2": 43
    }],
    30: [function (require, module, exports) {
      'use strict';

      const acceptVersionStrategy = require('./strategies/accept-version');
      const acceptHostStrategy = require('./strategies/accept-host');
      const assert = require('assert');
      class Constrainer {
        constructor(customStrategies) {
          this.strategies = {
            version: acceptVersionStrategy,
            host: acceptHostStrategy
          };
          this.strategiesInUse = new Set();
          this.asyncStrategiesInUse = new Set();

          // validate and optimize prototypes of given custom strategies
          if (customStrategies) {
            for (const strategy of Object.values(customStrategies)) {
              this.addConstraintStrategy(strategy);
            }
          }
        }
        isStrategyUsed(strategyName) {
          return this.strategiesInUse.has(strategyName) || this.asyncStrategiesInUse.has(strategyName);
        }
        hasConstraintStrategy(strategyName) {
          const customConstraintStrategy = this.strategies[strategyName];
          if (customConstraintStrategy !== undefined) {
            return customConstraintStrategy.isCustom || this.isStrategyUsed(strategyName);
          }
          return false;
        }
        addConstraintStrategy(strategy) {
          assert(typeof strategy.name === 'string' && strategy.name !== '', 'strategy.name is required.');
          assert(strategy.storage && typeof strategy.storage === 'function', 'strategy.storage function is required.');
          assert(strategy.deriveConstraint && typeof strategy.deriveConstraint === 'function', 'strategy.deriveConstraint function is required.');
          if (this.strategies[strategy.name] && this.strategies[strategy.name].isCustom) {
            throw new Error(`There already exists a custom constraint with the name ${strategy.name}.`);
          }
          if (this.isStrategyUsed(strategy.name)) {
            throw new Error(`There already exists a route with ${strategy.name} constraint.`);
          }
          strategy.isCustom = true;
          strategy.isAsync = strategy.deriveConstraint.length === 3;
          this.strategies[strategy.name] = strategy;
          if (strategy.mustMatchWhenDerived) {
            this.noteUsage({
              [strategy.name]: strategy
            });
          }
        }
        deriveConstraints(req, ctx, done) {
          const constraints = this.deriveSyncConstraints(req, ctx);
          if (done === undefined) {
            return constraints;
          }
          this.deriveAsyncConstraints(constraints, req, ctx, done);
        }
        deriveSyncConstraints(req, ctx) {
          return undefined;
        }

        // When new constraints start getting used, we need to rebuild the deriver to derive them. Do so if we see novel constraints used.
        noteUsage(constraints) {
          if (constraints) {
            const beforeSize = this.strategiesInUse.size;
            for (const key in constraints) {
              const strategy = this.strategies[key];
              if (strategy.isAsync) {
                this.asyncStrategiesInUse.add(key);
              } else {
                this.strategiesInUse.add(key);
              }
            }
            if (beforeSize !== this.strategiesInUse.size) {
              this._buildDeriveConstraints();
            }
          }
        }
        newStoreForConstraint(constraint) {
          if (!this.strategies[constraint]) {
            throw new Error(`No strategy registered for constraint key ${constraint}`);
          }
          return this.strategies[constraint].storage();
        }
        validateConstraints(constraints) {
          for (const key in constraints) {
            const value = constraints[key];
            if (typeof value === 'undefined') {
              throw new Error('Can\'t pass an undefined constraint value, must pass null or no key at all');
            }
            const strategy = this.strategies[key];
            if (!strategy) {
              throw new Error(`No strategy registered for constraint key ${key}`);
            }
            if (strategy.validate) {
              strategy.validate(value);
            }
          }
        }
        deriveAsyncConstraints(constraints, req, ctx, done) {
          let asyncConstraintsCount = this.asyncStrategiesInUse.size;
          if (asyncConstraintsCount === 0) {
            done(null, constraints);
            return;
          }
          constraints = constraints || {};
          for (const key of this.asyncStrategiesInUse) {
            const strategy = this.strategies[key];
            strategy.deriveConstraint(req, ctx, (err, constraintValue) => {
              if (err !== null) {
                done(err);
                return;
              }
              constraints[key] = constraintValue;
              if (--asyncConstraintsCount === 0) {
                done(null, constraints);
              }
            });
          }
        }

        // Optimization: build a fast function for deriving the constraints for all the strategies at once. We inline the definitions of the version constraint and the host constraint for performance.
        // If no constraining strategies are in use (no routes constrain on host, or version, or any custom strategies) then we don't need to derive constraints for each route match, so don't do anything special, and just return undefined
        // This allows us to not allocate an object to hold constraint values if no constraints are defined.
        _buildDeriveConstraints() {
          if (this.strategiesInUse.size === 0) return;
          const lines = ['return {'];
          for (const key of this.strategiesInUse) {
            const strategy = this.strategies[key];
            // Optimization: inline the derivation for the common built in constraints
            if (!strategy.isCustom) {
              if (key === 'version') {
                lines.push('   version: req.headers[\'accept-version\'],');
              } else if (key === 'host') {
                lines.push('   host: req.headers.host || req.headers[\':authority\'],');
              } else {
                throw new Error('unknown non-custom strategy for compiling constraint derivation function');
              }
            } else {
              lines.push(`  ${strategy.name}: this.strategies.${key}.deriveConstraint(req, ctx),`);
            }
          }
          lines.push('}');
          this.deriveSyncConstraints = new Function('req', 'ctx', lines.join('\n')).bind(this); // eslint-disable-line
        }
      }

      module.exports = Constrainer;
    }, {
      "./strategies/accept-host": 33,
      "./strategies/accept-version": 34,
      "assert": 1
    }],
    31: [function (require, module, exports) {
      'use strict';

      // defined by Node.js http module, a snapshot from Node.js 18.12.0
      const httpMethods = ['ACL', 'BIND', 'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LINK', 'LOCK', 'M-SEARCH', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST', 'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'REBIND', 'REPORT', 'SEARCH', 'SOURCE', 'SUBSCRIBE', 'TRACE', 'UNBIND', 'UNLINK', 'UNLOCK', 'UNSUBSCRIBE'];
      module.exports = httpMethods;
    }, {}],
    32: [function (require, module, exports) {
      'use strict';

      /* eslint-disable no-multi-spaces */
      const indent = '    ';
      const branchIndent = '│   ';
      const midBranchIndent = '├── ';
      const endBranchIndent = '└── ';
      const wildcardDelimiter = '*';
      const pathDelimiter = '/';
      const pathRegExp = /(?=\/)/;
      /* eslint-enable */

      function parseFunctionName(fn) {
        let fName = fn.name || '';
        fName = fName.replace('bound', '').trim();
        fName = (fName || 'anonymous') + '()';
        return fName;
      }
      function parseMeta(meta) {
        if (Array.isArray(meta)) return meta.map(m => parseMeta(m));
        if (typeof meta === 'symbol') return meta.toString();
        if (typeof meta === 'function') return parseFunctionName(meta);
        return meta;
      }
      function buildMetaObject(route, metaArray) {
        const out = {};
        const cleanMeta = this.buildPrettyMeta(route);
        if (!Array.isArray(metaArray)) metaArray = cleanMeta ? Reflect.ownKeys(cleanMeta) : [];
        metaArray.forEach(m => {
          const metaKey = typeof m === 'symbol' ? m.toString() : m;
          if (cleanMeta && cleanMeta[m]) {
            out[metaKey] = parseMeta(cleanMeta[m]);
          }
        });
        return out;
      }
      function prettyPrintRoutesArray(routeArray, opts = {}) {
        if (!this.buildPrettyMeta) throw new Error('buildPrettyMeta not defined');
        opts.includeMeta = opts.includeMeta || null; // array of meta objects to display
        const mergedRouteArray = [];
        let tree = '';
        routeArray.sort((a, b) => {
          if (!a.path || !b.path) return 0;
          return a.path.localeCompare(b.path);
        });

        // merge alike paths
        for (let i = 0; i < routeArray.length; i++) {
          const route = routeArray[i];
          const pathExists = mergedRouteArray.find(r => route.path === r.path);
          if (pathExists) {
            // path already declared, add new method and break out of loop
            pathExists.handlers.push({
              method: route.method,
              opts: route.opts.constraints || undefined,
              meta: opts.includeMeta ? buildMetaObject.call(this, route, opts.includeMeta) : null
            });
            continue;
          }
          const routeHandler = {
            method: route.method,
            opts: route.opts.constraints || undefined,
            meta: opts.includeMeta ? buildMetaObject.call(this, route, opts.includeMeta) : null
          };
          mergedRouteArray.push({
            path: route.path,
            methods: [route.method],
            opts: [route.opts],
            handlers: [routeHandler]
          });
        }

        // insert root level path if none defined
        if (!mergedRouteArray.filter(r => r.path === pathDelimiter).length) {
          const rootPath = {
            path: pathDelimiter,
            truncatedPath: '',
            methods: [],
            opts: [],
            handlers: [{}]
          };

          // if wildcard route exists, insert root level after wildcard
          if (mergedRouteArray.filter(r => r.path === wildcardDelimiter).length) {
            mergedRouteArray.splice(1, 0, rootPath);
          } else {
            mergedRouteArray.unshift(rootPath);
          }
        }

        // build tree
        const routeTree = buildRouteTree(mergedRouteArray);

        // draw tree
        routeTree.forEach((rootBranch, idx) => {
          tree += drawBranch(rootBranch, null, idx === routeTree.length - 1, false, true);
          tree += '\n'; // newline characters inserted at beginning of drawing function to allow for nested paths
        });

        return tree;
      }
      function buildRouteTree(mergedRouteArray) {
        const result = [];
        const temp = {
          result
        };
        mergedRouteArray.forEach((route, idx) => {
          let splitPath = route.path.split(pathRegExp);

          // add preceding slash for proper nesting
          if (splitPath[0] !== pathDelimiter) {
            // handle wildcard route
            if (splitPath[0] !== wildcardDelimiter) splitPath = [pathDelimiter, splitPath[0].slice(1), ...splitPath.slice(1)];
          }

          // build tree
          splitPath.reduce((acc, path, pidx) => {
            if (!acc[path]) {
              acc[path] = {
                result: []
              };
              const pathSeg = {
                path,
                children: acc[path].result
              };
              if (pidx === splitPath.length - 1) pathSeg.handlers = route.handlers;
              acc.result.push(pathSeg);
            }
            return acc[path];
          }, temp);
        });

        // unfold root object from array
        return result;
      }
      function drawBranch(pathSeg, prefix, endBranch, noPrefix, rootBranch) {
        let branch = '';
        if (!noPrefix && !rootBranch) branch += '\n';
        if (!noPrefix) branch += `${prefix || ''}${endBranch ? endBranchIndent : midBranchIndent}`;
        branch += `${pathSeg.path}`;
        if (pathSeg.handlers) {
          const flatHandlers = pathSeg.handlers.reduce((acc, curr) => {
            const match = acc.findIndex(h => JSON.stringify(h.opts) === JSON.stringify(curr.opts));
            if (match !== -1) {
              acc[match].method = [acc[match].method, curr.method].join(', ');
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);
          flatHandlers.forEach((handler, idx) => {
            if (idx > 0) branch += `${noPrefix ? '' : prefix || ''}${endBranch ? indent : branchIndent}${pathSeg.path}`;
            branch += ` (${handler.method || '-'})`;
            if (handler.opts && JSON.stringify(handler.opts) !== '{}') branch += ` ${JSON.stringify(handler.opts)}`;
            if (handler.meta) {
              Reflect.ownKeys(handler.meta).forEach((m, hidx) => {
                branch += `\n${noPrefix ? '' : prefix || ''}${endBranch ? indent : branchIndent}`;
                branch += `• (${m}) ${JSON.stringify(handler.meta[m])}`;
              });
            }
            if (flatHandlers.length > 1 && idx !== flatHandlers.length - 1) branch += '\n';
          });
        } else {
          if (pathSeg.children.length > 1) branch += ' (-)';
        }
        if (!noPrefix) prefix = `${prefix || ''}${endBranch ? indent : branchIndent}`;
        pathSeg.children.forEach((child, idx) => {
          const endBranch = idx === pathSeg.children.length - 1;
          const skipPrefix = !pathSeg.handlers && pathSeg.children.length === 1;
          branch += drawBranch(child, prefix, endBranch, skipPrefix);
        });
        return branch;
      }
      function prettyPrintFlattenedNode(flattenedNode, prefix, tail, opts) {
        if (!this.buildPrettyMeta) throw new Error('buildPrettyMeta not defined');
        opts.includeMeta = opts.includeMeta || null; // array of meta items to display
        let paramName = '';
        const printHandlers = [];
        for (const {
          node,
          method
        } of flattenedNode.nodes) {
          for (const handler of node.handlerStorage.handlers) {
            printHandlers.push({
              method,
              ...handler
            });
          }
        }
        if (printHandlers.length) {
          printHandlers.forEach((handler, index) => {
            let suffix = `(${handler.method || '-'})`;
            if (Object.keys(handler.constraints).length > 0) {
              suffix += ' ' + JSON.stringify(handler.constraints);
            }
            let name = '';
            // find locations of parameters in prefix
            const paramIndices = flattenedNode.prefix.split('').map((ch, idx) => ch === ':' ? idx : null).filter(idx => idx !== null);
            if (paramIndices.length) {
              let prevLoc = 0;
              paramIndices.forEach((loc, idx) => {
                // find parameter in prefix
                name += flattenedNode.prefix.slice(prevLoc, loc + 1);
                // insert parameters
                name += handler.params[handler.params.length - paramIndices.length + idx];
                if (idx === paramIndices.length - 1) name += flattenedNode.prefix.slice(loc + 1);
                prevLoc = loc + 1;
              });
            } else {
              // there are no parameters, return full object
              name = flattenedNode.prefix;
            }
            if (index === 0) {
              paramName += `${name} ${suffix}`;
            } else {
              paramName += `\n${prefix}${tail ? indent : branchIndent}${name} ${suffix}`;
            }
            if (opts.includeMeta) {
              const meta = buildMetaObject.call(this, handler, opts.includeMeta);
              Object.keys(meta).forEach((m, hidx) => {
                paramName += `\n${prefix || ''}${tail ? indent : branchIndent}`;
                paramName += `• (${m}) ${JSON.stringify(meta[m])}`;
              });
            }
          });
        } else {
          paramName = flattenedNode.prefix;
        }
        let tree = `${prefix}${tail ? endBranchIndent : midBranchIndent}${paramName}\n`;
        prefix = `${prefix}${tail ? indent : branchIndent}`;
        const labels = Object.keys(flattenedNode.children);
        for (let i = 0; i < labels.length; i++) {
          const child = flattenedNode.children[labels[i]];
          tree += prettyPrintFlattenedNode.call(this, child, prefix, i === labels.length - 1, opts);
        }
        return tree;
      }
      function flattenNode(flattened, node, method) {
        if (node.handlerStorage.handlers.length !== 0) {
          flattened.nodes.push({
            method,
            node
          });
        }
        if (node.parametricChildren && node.parametricChildren[0]) {
          if (!flattened.children[':']) {
            flattened.children[':'] = {
              prefix: ':',
              nodes: [],
              children: {}
            };
          }
          flattenNode(flattened.children[':'], node.parametricChildren[0], method);
        }
        if (node.wildcardChild) {
          if (!flattened.children['*']) {
            flattened.children['*'] = {
              prefix: '*',
              nodes: [],
              children: {}
            };
          }
          flattenNode(flattened.children['*'], node.wildcardChild, method);
        }
        if (node.staticChildren) {
          for (const child of Object.values(node.staticChildren)) {
            // split on the slash separator but use a regex to lookahead and not actually match it, preserving it in the returned string segments
            const childPrefixSegments = child.prefix.split(pathRegExp);
            let cursor = flattened;
            let parent;
            for (const segment of childPrefixSegments) {
              parent = cursor;
              cursor = cursor.children[segment];
              if (!cursor) {
                cursor = {
                  prefix: segment,
                  nodes: [],
                  children: {}
                };
                parent.children[segment] = cursor;
              }
            }
            flattenNode(cursor, child, method);
          }
        }
      }
      function compressFlattenedNode(flattenedNode) {
        const childKeys = Object.keys(flattenedNode.children);
        if (flattenedNode.nodes.length === 0 && childKeys.length === 1) {
          const child = flattenedNode.children[childKeys[0]];
          if (child.nodes.length <= 1) {
            compressFlattenedNode(child);
            flattenedNode.nodes = child.nodes;
            flattenedNode.prefix += child.prefix;
            flattenedNode.children = child.children;
            return flattenedNode;
          }
        }
        for (const key of Object.keys(flattenedNode.children)) {
          compressFlattenedNode(flattenedNode.children[key]);
        }
        return flattenedNode;
      }
      module.exports = {
        flattenNode,
        compressFlattenedNode,
        prettyPrintFlattenedNode,
        prettyPrintRoutesArray
      };
    }, {}],
    33: [function (require, module, exports) {
      'use strict';

      const assert = require('assert');
      function HostStorage() {
        const hosts = {};
        const regexHosts = [];
        return {
          get: host => {
            const exact = hosts[host];
            if (exact) {
              return exact;
            }
            for (const regex of regexHosts) {
              if (regex.host.test(host)) {
                return regex.value;
              }
            }
          },
          set: (host, value) => {
            if (host instanceof RegExp) {
              regexHosts.push({
                host,
                value
              });
            } else {
              hosts[host] = value;
            }
          }
        };
      }
      module.exports = {
        name: 'host',
        mustMatchWhenDerived: false,
        storage: HostStorage,
        validate(value) {
          assert(typeof value === 'string' || Object.prototype.toString.call(value) === '[object RegExp]', 'Host should be a string or a RegExp');
        }
      };
    }, {
      "assert": 1
    }],
    34: [function (require, module, exports) {
      'use strict';

      const assert = require('assert');
      function SemVerStore() {
        if (!(this instanceof SemVerStore)) {
          return new SemVerStore();
        }
        this.store = {};
        this.maxMajor = 0;
        this.maxMinors = {};
        this.maxPatches = {};
      }
      SemVerStore.prototype.set = function (version, store) {
        if (typeof version !== 'string') {
          throw new TypeError('Version should be a string');
        }
        let [major, minor, patch] = version.split('.');
        major = Number(major) || 0;
        minor = Number(minor) || 0;
        patch = Number(patch) || 0;
        if (major >= this.maxMajor) {
          this.maxMajor = major;
          this.store.x = store;
          this.store['*'] = store;
          this.store['x.x'] = store;
          this.store['x.x.x'] = store;
        }
        if (minor >= (this.maxMinors[major] || 0)) {
          this.maxMinors[major] = minor;
          this.store[`${major}.x`] = store;
          this.store[`${major}.x.x`] = store;
        }
        if (patch >= (this.store[`${major}.${minor}`] || 0)) {
          this.maxPatches[`${major}.${minor}`] = patch;
          this.store[`${major}.${minor}.x`] = store;
        }
        this.store[`${major}.${minor}.${patch}`] = store;
        return this;
      };
      SemVerStore.prototype.get = function (version) {
        return this.store[version];
      };
      module.exports = {
        name: 'version',
        mustMatchWhenDerived: true,
        storage: SemVerStore,
        validate(value) {
          assert(typeof value === 'string', 'Version should be a string');
        }
      };
    }, {
      "assert": 1
    }],
    35: [function (require, module, exports) {
      'use strict';

      // It must spot all the chars where decodeURIComponent(x) !== decodeURI(x)
      // The chars are: # $ & + , / : ; = ? @
      function decodeComponentChar(highCharCode, lowCharCode) {
        if (highCharCode === 50) {
          if (lowCharCode === 53) return '%';
          if (lowCharCode === 51) return '#';
          if (lowCharCode === 52) return '$';
          if (lowCharCode === 54) return '&';
          if (lowCharCode === 66) return '+';
          if (lowCharCode === 98) return '+';
          if (lowCharCode === 67) return ',';
          if (lowCharCode === 99) return ',';
          if (lowCharCode === 70) return '/';
          if (lowCharCode === 102) return '/';
          return null;
        }
        if (highCharCode === 51) {
          if (lowCharCode === 65) return ':';
          if (lowCharCode === 97) return ':';
          if (lowCharCode === 66) return ';';
          if (lowCharCode === 98) return ';';
          if (lowCharCode === 68) return '=';
          if (lowCharCode === 100) return '=';
          if (lowCharCode === 70) return '?';
          if (lowCharCode === 102) return '?';
          return null;
        }
        if (highCharCode === 52 && lowCharCode === 48) {
          return '@';
        }
        return null;
      }
      function safeDecodeURI(path) {
        let shouldDecode = false;
        let shouldDecodeParam = false;
        let querystring = '';
        for (let i = 1; i < path.length; i++) {
          const charCode = path.charCodeAt(i);
          if (charCode === 37) {
            const highCharCode = path.charCodeAt(i + 1);
            const lowCharCode = path.charCodeAt(i + 2);
            if (decodeComponentChar(highCharCode, lowCharCode) === null) {
              shouldDecode = true;
            } else {
              shouldDecodeParam = true;
              // %25 - encoded % char. We need to encode one more time to prevent double decoding
              if (highCharCode === 50 && lowCharCode === 53) {
                shouldDecode = true;
                path = path.slice(0, i + 1) + '25' + path.slice(i + 1);
                i += 2;
              }
              i += 2;
            }
            // Some systems do not follow RFC and separate the path and query
            // string with a `;` character (code 59), e.g. `/foo;jsessionid=123456`.
            // Thus, we need to split on `;` as well as `?` and `#`.
          } else if (charCode === 63 || charCode === 59 || charCode === 35) {
            querystring = path.slice(i + 1);
            path = path.slice(0, i);
            break;
          }
        }
        const decodedPath = shouldDecode ? decodeURI(path) : path;
        return {
          path: decodedPath,
          querystring,
          shouldDecodeParam
        };
      }
      function safeDecodeURIComponent(uriComponent) {
        const startIndex = uriComponent.indexOf('%');
        if (startIndex === -1) return uriComponent;
        let decoded = '';
        let lastIndex = startIndex;
        for (let i = startIndex; i < uriComponent.length; i++) {
          if (uriComponent.charCodeAt(i) === 37) {
            const highCharCode = uriComponent.charCodeAt(i + 1);
            const lowCharCode = uriComponent.charCodeAt(i + 2);
            const decodedChar = decodeComponentChar(highCharCode, lowCharCode);
            decoded += uriComponent.slice(lastIndex, i) + decodedChar;
            lastIndex = i + 3;
          }
        }
        return uriComponent.slice(0, startIndex) + decoded + uriComponent.slice(lastIndex);
      }
      module.exports = {
        safeDecodeURI,
        safeDecodeURIComponent
      };
    }, {}],
    36: [function (require, module, exports) {
      /*
      object-assign
      (c) Sindre Sorhus
      @license MIT
      */

      'use strict';

      /* eslint-disable no-unused-vars */
      var getOwnPropertySymbols = Object.getOwnPropertySymbols;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var propIsEnumerable = Object.prototype.propertyIsEnumerable;
      function toObject(val) {
        if (val === null || val === undefined) {
          throw new TypeError('Object.assign cannot be called with null or undefined');
        }
        return Object(val);
      }
      function shouldUseNative() {
        try {
          if (!Object.assign) {
            return false;
          }

          // Detect buggy property enumeration order in older V8 versions.

          // https://bugs.chromium.org/p/v8/issues/detail?id=4118
          var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
          test1[5] = 'de';
          if (Object.getOwnPropertyNames(test1)[0] === '5') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          var test2 = {};
          for (var i = 0; i < 10; i++) {
            test2['_' + String.fromCharCode(i)] = i;
          }
          var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
            return test2[n];
          });
          if (order2.join('') !== '0123456789') {
            return false;
          }

          // https://bugs.chromium.org/p/v8/issues/detail?id=3056
          var test3 = {};
          'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
            test3[letter] = letter;
          });
          if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
            return false;
          }
          return true;
        } catch (err) {
          // We don't expect any of the above to throw, but better to be safe.
          return false;
        }
      }
      module.exports = shouldUseNative() ? Object.assign : function (target, source) {
        var from;
        var to = toObject(target);
        var symbols;
        for (var s = 1; s < arguments.length; s++) {
          from = Object(arguments[s]);
          for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
              to[key] = from[key];
            }
          }
          if (getOwnPropertySymbols) {
            symbols = getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
              if (propIsEnumerable.call(from, symbols[i])) {
                to[symbols[i]] = from[symbols[i]];
              }
            }
          }
        }
        return to;
      };
    }, {}],
    37: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function (name) {
        return [];
      };
      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}],
    38: [function (require, module, exports) {
      const util = require('./util');
      const types = require('./types');
      const sets = require('./sets');
      const positions = require('./positions');
      module.exports = regexpStr => {
        var i = 0,
          l,
          c,
          start = {
            type: types.ROOT,
            stack: []
          },
          // Keep track of last clause/group and stack.
          lastGroup = start,
          last = start.stack,
          groupStack = [];
        var repeatErr = i => {
          util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
        };

        // Decode a few escaped characters.
        var str = util.strToChars(regexpStr);
        l = str.length;

        // Iterate through each character in string.
        while (i < l) {
          c = str[i++];
          switch (c) {
            // Handle escaped characters, inclues a few sets.
            case '\\':
              c = str[i++];
              switch (c) {
                case 'b':
                  last.push(positions.wordBoundary());
                  break;
                case 'B':
                  last.push(positions.nonWordBoundary());
                  break;
                case 'w':
                  last.push(sets.words());
                  break;
                case 'W':
                  last.push(sets.notWords());
                  break;
                case 'd':
                  last.push(sets.ints());
                  break;
                case 'D':
                  last.push(sets.notInts());
                  break;
                case 's':
                  last.push(sets.whitespace());
                  break;
                case 'S':
                  last.push(sets.notWhitespace());
                  break;
                default:
                  // Check if c is integer.
                  // In which case it's a reference.
                  if (/\d/.test(c)) {
                    last.push({
                      type: types.REFERENCE,
                      value: parseInt(c, 10)
                    });

                    // Escaped character.
                  } else {
                    last.push({
                      type: types.CHAR,
                      value: c.charCodeAt(0)
                    });
                  }
              }
              break;

            // Positionals.
            case '^':
              last.push(positions.begin());
              break;
            case '$':
              last.push(positions.end());
              break;

            // Handle custom sets.
            case '[':
              // Check if this class is 'anti' i.e. [^abc].
              var not;
              if (str[i] === '^') {
                not = true;
                i++;
              } else {
                not = false;
              }

              // Get all the characters in class.
              var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

              // Increase index by length of class.
              i += classTokens[1];
              last.push({
                type: types.SET,
                set: classTokens[0],
                not
              });
              break;

            // Class of any character except \n.
            case '.':
              last.push(sets.anyChar());
              break;

            // Push group onto stack.
            case '(':
              // Create group.
              var group = {
                type: types.GROUP,
                stack: [],
                remember: true
              };
              c = str[i];

              // If if this is a special kind of group.
              if (c === '?') {
                c = str[i + 1];
                i += 2;

                // Match if followed by.
                if (c === '=') {
                  group.followedBy = true;

                  // Match if not followed by.
                } else if (c === '!') {
                  group.notFollowedBy = true;
                } else if (c !== ':') {
                  util.error(regexpStr, `Invalid group, character '${c}'` + ` after '?' at column ${i - 1}`);
                }
                group.remember = false;
              }

              // Insert subgroup into current group stack.
              last.push(group);

              // Remember the current group for when the group closes.
              groupStack.push(lastGroup);

              // Make this new group the current group.
              lastGroup = group;
              last = group.stack;
              break;

            // Pop group out of stack.
            case ')':
              if (groupStack.length === 0) {
                util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
              }
              lastGroup = groupStack.pop();

              // Check if this group has a PIPE.
              // To get back the correct last stack.
              last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
              break;

            // Use pipe character to give more choices.
            case '|':
              // Create array where options are if this is the first PIPE
              // in this clause.
              if (!lastGroup.options) {
                lastGroup.options = [lastGroup.stack];
                delete lastGroup.stack;
              }

              // Create a new stack and add to options for rest of clause.
              var stack = [];
              lastGroup.options.push(stack);
              last = stack;
              break;

            // Repetition.
            // For every repetition, remove last element from last stack
            // then insert back a RANGE object.
            // This design is chosen because there could be more than
            // one repetition symbols in a regex i.e. `a?+{2,3}`.
            case '{':
              var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)),
                min,
                max;
              if (rs !== null) {
                if (last.length === 0) {
                  repeatErr(i);
                }
                min = parseInt(rs[1], 10);
                max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
                i += rs[0].length;
                last.push({
                  type: types.REPETITION,
                  min,
                  max,
                  value: last.pop()
                });
              } else {
                last.push({
                  type: types.CHAR,
                  value: 123
                });
              }
              break;
            case '?':
              if (last.length === 0) {
                repeatErr(i);
              }
              last.push({
                type: types.REPETITION,
                min: 0,
                max: 1,
                value: last.pop()
              });
              break;
            case '+':
              if (last.length === 0) {
                repeatErr(i);
              }
              last.push({
                type: types.REPETITION,
                min: 1,
                max: Infinity,
                value: last.pop()
              });
              break;
            case '*':
              if (last.length === 0) {
                repeatErr(i);
              }
              last.push({
                type: types.REPETITION,
                min: 0,
                max: Infinity,
                value: last.pop()
              });
              break;

            // Default is a character that is not `\[](){}?+*^$`.
            default:
              last.push({
                type: types.CHAR,
                value: c.charCodeAt(0)
              });
          }
        }

        // Check if any groups have not been closed.
        if (groupStack.length !== 0) {
          util.error(regexpStr, 'Unterminated group');
        }
        return start;
      };
      module.exports.types = types;
    }, {
      "./positions": 39,
      "./sets": 40,
      "./types": 41,
      "./util": 42
    }],
    39: [function (require, module, exports) {
      const types = require('./types');
      exports.wordBoundary = () => ({
        type: types.POSITION,
        value: 'b'
      });
      exports.nonWordBoundary = () => ({
        type: types.POSITION,
        value: 'B'
      });
      exports.begin = () => ({
        type: types.POSITION,
        value: '^'
      });
      exports.end = () => ({
        type: types.POSITION,
        value: '$'
      });
    }, {
      "./types": 41
    }],
    40: [function (require, module, exports) {
      const types = require('./types');
      const INTS = () => [{
        type: types.RANGE,
        from: 48,
        to: 57
      }];
      const WORDS = () => {
        return [{
          type: types.CHAR,
          value: 95
        }, {
          type: types.RANGE,
          from: 97,
          to: 122
        }, {
          type: types.RANGE,
          from: 65,
          to: 90
        }].concat(INTS());
      };
      const WHITESPACE = () => {
        return [{
          type: types.CHAR,
          value: 9
        }, {
          type: types.CHAR,
          value: 10
        }, {
          type: types.CHAR,
          value: 11
        }, {
          type: types.CHAR,
          value: 12
        }, {
          type: types.CHAR,
          value: 13
        }, {
          type: types.CHAR,
          value: 32
        }, {
          type: types.CHAR,
          value: 160
        }, {
          type: types.CHAR,
          value: 5760
        }, {
          type: types.RANGE,
          from: 8192,
          to: 8202
        }, {
          type: types.CHAR,
          value: 8232
        }, {
          type: types.CHAR,
          value: 8233
        }, {
          type: types.CHAR,
          value: 8239
        }, {
          type: types.CHAR,
          value: 8287
        }, {
          type: types.CHAR,
          value: 12288
        }, {
          type: types.CHAR,
          value: 65279
        }];
      };
      const NOTANYCHAR = () => {
        return [{
          type: types.CHAR,
          value: 10
        }, {
          type: types.CHAR,
          value: 13
        }, {
          type: types.CHAR,
          value: 8232
        }, {
          type: types.CHAR,
          value: 8233
        }];
      };

      // Predefined class objects.
      exports.words = () => ({
        type: types.SET,
        set: WORDS(),
        not: false
      });
      exports.notWords = () => ({
        type: types.SET,
        set: WORDS(),
        not: true
      });
      exports.ints = () => ({
        type: types.SET,
        set: INTS(),
        not: false
      });
      exports.notInts = () => ({
        type: types.SET,
        set: INTS(),
        not: true
      });
      exports.whitespace = () => ({
        type: types.SET,
        set: WHITESPACE(),
        not: false
      });
      exports.notWhitespace = () => ({
        type: types.SET,
        set: WHITESPACE(),
        not: true
      });
      exports.anyChar = () => ({
        type: types.SET,
        set: NOTANYCHAR(),
        not: true
      });
    }, {
      "./types": 41
    }],
    41: [function (require, module, exports) {
      module.exports = {
        ROOT: 0,
        GROUP: 1,
        POSITION: 2,
        SET: 3,
        RANGE: 4,
        REPETITION: 5,
        REFERENCE: 6,
        CHAR: 7
      };
    }, {}],
    42: [function (require, module, exports) {
      const types = require('./types');
      const sets = require('./sets');
      const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
      const SLSH = {
        '0': 0,
        't': 9,
        'n': 10,
        'v': 11,
        'f': 12,
        'r': 13
      };

      /**
       * Finds character representations in str and convert all to
       * their respective characters
       *
       * @param {String} str
       * @return {String}
       */
      exports.strToChars = function (str) {
        /* jshint maxlen: false */
        var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
        str = str.replace(chars_regex, function (s, b, lbs, a16, b16, c8, dctrl, eslsh) {
          if (lbs) {
            return s;
          }
          var code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : c8 ? parseInt(c8, 8) : dctrl ? CTRL.indexOf(dctrl) : SLSH[eslsh];
          var c = String.fromCharCode(code);

          // Escape special regex characters.
          if (/[[\]{}^$.|?*+()]/.test(c)) {
            c = '\\' + c;
          }
          return c;
        });
        return str;
      };

      /**
       * turns class into tokens
       * reads str until it encounters a ] not preceeded by a \
       *
       * @param {String} str
       * @param {String} regexpStr
       * @return {Array.<Array.<Object>, Number>}
       */
      exports.tokenizeClass = (str, regexpStr) => {
        /* jshint maxlen: false */
        var tokens = [];
        var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
        var rs, c;
        while ((rs = regexp.exec(str)) != null) {
          if (rs[1]) {
            tokens.push(sets.words());
          } else if (rs[2]) {
            tokens.push(sets.ints());
          } else if (rs[3]) {
            tokens.push(sets.whitespace());
          } else if (rs[4]) {
            tokens.push(sets.notWords());
          } else if (rs[5]) {
            tokens.push(sets.notInts());
          } else if (rs[6]) {
            tokens.push(sets.notWhitespace());
          } else if (rs[7]) {
            tokens.push({
              type: types.RANGE,
              from: (rs[8] || rs[9]).charCodeAt(0),
              to: rs[10].charCodeAt(0)
            });
          } else if (c = rs[12]) {
            tokens.push({
              type: types.CHAR,
              value: c.charCodeAt(0)
            });
          } else {
            return [tokens, regexp.lastIndex];
          }
        }
        exports.error(regexpStr, 'Unterminated character class');
      };

      /**
       * Shortcut to throw errors.
       *
       * @param {String} regexp
       * @param {String} msg
       */
      exports.error = (regexp, msg) => {
        throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
      };
    }, {
      "./sets": 40,
      "./types": 41
    }],
    43: [function (require, module, exports) {
      'use strict';

      var parse = require('ret');
      var types = parse.types;
      module.exports = function (re, opts) {
        if (!opts) opts = {};
        var replimit = opts.limit === undefined ? 25 : opts.limit;
        if (isRegExp(re)) re = re.source;else if (typeof re !== 'string') re = String(re);
        try {
          re = parse(re);
        } catch (err) {
          return false;
        }
        var reps = 0;
        return function walk(node, starHeight) {
          var i;
          var ok;
          var len;
          if (node.type === types.REPETITION) {
            starHeight++;
            reps++;
            if (starHeight > 1) return false;
            if (reps > replimit) return false;
          }
          if (node.options) {
            for (i = 0, len = node.options.length; i < len; i++) {
              ok = walk({
                stack: node.options[i]
              }, starHeight);
              if (!ok) return false;
            }
          }
          var stack = node.stack || node.value && node.value.stack;
          if (!stack) return true;
          for (i = 0; i < stack.length; i++) {
            ok = walk(stack[i], starHeight);
            if (!ok) return false;
          }
          return true;
        }(re, 0);
      };
      function isRegExp(x) {
        return {}.toString.call(x) === '[object RegExp]';
      }
    }, {
      "ret": 38
    }],
    44: [function (require, module, exports) {
      (function (setImmediate, clearImmediate) {
        (function () {
          var nextTick = require('process/browser.js').nextTick;
          var apply = Function.prototype.apply;
          var slice = Array.prototype.slice;
          var immediateIds = {};
          var nextImmediateId = 0;

          // DOM APIs, for completeness

          exports.setTimeout = function () {
            return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
          };
          exports.setInterval = function () {
            return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
          };
          exports.clearTimeout = exports.clearInterval = function (timeout) {
            timeout.close();
          };
          function Timeout(id, clearFn) {
            this._id = id;
            this._clearFn = clearFn;
          }
          Timeout.prototype.unref = Timeout.prototype.ref = function () {};
          Timeout.prototype.close = function () {
            this._clearFn.call(window, this._id);
          };

          // Does not start the time, just sets up the members needed.
          exports.enroll = function (item, msecs) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = msecs;
          };
          exports.unenroll = function (item) {
            clearTimeout(item._idleTimeoutId);
            item._idleTimeout = -1;
          };
          exports._unrefActive = exports.active = function (item) {
            clearTimeout(item._idleTimeoutId);
            var msecs = item._idleTimeout;
            if (msecs >= 0) {
              item._idleTimeoutId = setTimeout(function onTimeout() {
                if (item._onTimeout) item._onTimeout();
              }, msecs);
            }
          };

          // That's not how node.js implements it but the exposed api is the same.
          exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
            var id = nextImmediateId++;
            var args = arguments.length < 2 ? false : slice.call(arguments, 1);
            immediateIds[id] = true;
            nextTick(function onNextTick() {
              if (immediateIds[id]) {
                // fn.call() is faster so we optimize for the common use-case
                // @see http://jsperf.com/call-apply-segu
                if (args) {
                  fn.apply(null, args);
                } else {
                  fn.call(null);
                }
                // Prevent ids from leaking
                exports.clearImmediate(id);
              }
            });
            return id;
          };
          exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
            delete immediateIds[id];
          };
        }).call(this);
      }).call(this, require("timers").setImmediate, require("timers").clearImmediate);
    }, {
      "process/browser.js": 37,
      "timers": 44
    }],
    45: [function (require, module, exports) {
      /**
      * Simple browser shim loader - assign the npm module to a window global automatically
      *
      * @license MIT
      * @author <steven@velozo.com>
      */
      var libNPMModuleWrapper = require('./Orator.js');
      if (typeof window === 'object' && !window.hasOwnProperty('Orator')) {
        window.Orator = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Orator.js": 52
    }],
    46: [function (require, module, exports) {
      // Simple default configuration for application, when none is provided

      module.exports = {
        "Product": "Unnamed_Service",
        "ProductVersion": "0.0.1",
        "ServicePort": 8080
      };
    }, {}],
    47: [function (require, module, exports) {
      /**
      * Default Service Server Function
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      // Return the servers that are available without extensions loaded
      getDefaultServiceServers = () => {
        let tmpDefaultServiceServers = {};
        tmpDefaultServiceServers.ipc = require('./Orator-ServiceServer-IPC.js');
        tmpDefaultServiceServers.default = tmpDefaultServiceServers.ipc;
        return tmpDefaultServiceServers;
      };
      module.exports = getDefaultServiceServers();
    }, {
      "./Orator-ServiceServer-IPC.js": 51
    }],
    48: [function (require, module, exports) {
      class OratorServiceServerBase {
        constructor(pOrator) {
          this.orator = pOrator;
          this.log = pOrator.log;
          this.Name = this.orator.settings.Product;
          this.URL = 'BASE_SERVICE_SERVER';
          this.Port = this.orator.settings.ServicePort;
          this.Active = false;
        }

        /*
         * Service Lifecycle Functions
         *************************************************************************/
        listen(pPort, fCallback) {
          // Sometimes, listen does not listen on network calls.
          this.Active = true;
          return fCallback();
        }
        close(fCallback) {
          this.Active = false;
          return fCallback();
        }
        /*************************************************************************
         * End of Service Lifecycle Functions
         */

        use(fHandlerFunction) {
          if (typeof fHandlerFunction != 'function') {
            this.log.error(`Orator USE global handler mapping failed -- parameter was expected to be a function with prototype function(Request, Response, Next) but type was ${typeof fHandlerFunction} instead of a string.`);
            return false;
          }
          return true;
        }

        /*
         * Service Route Creation Functions
         *
         * These base functions provide basic validation for the routes, but don't actually 
         * do anything with them.  The design intent here is to allow derived classes to call
         * these functions to validate that they conform to expected standards.
         *
         * Something like:
        		get (pRoute, ...fRouteProcessingFunctions)
        	{
        		if (!super.get(pRoute, ...fRouteProcessingFunctions))
        		{
        			this.log.error(`Restify provider failed to map route [${pRoute}]!`);
        			return false;
        		}
        			//...now we can do our actual get mapping function!....
        	}
        	 * This pattern and calling super is totally optional, obviously.
         *************************************************************************/
        get(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator GET Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        put(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator PUT Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        post(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator POST Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        del(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator DEL Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        patch(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator PATCH Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        opts(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator OPTS Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        head(pRoute, ...fRouteProcessingFunctions) {
          if (typeof pRoute != 'string') {
            this.log.error(`Orator HEAD Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);
            return false;
          }
          return true;
        }
        /*************************************************************************
         * End of Service Route Creation Functions
         */

        // Programmatically invoke a route
        invoke(pMethod, pRoute, pData, fCallback) {
          // The base class version of this does nothing
          this.log.debug(`Orator invoke called for route [${pRoute}] and landed on the base class; the service provider likely does not implement programmatic invoke capabilities.`, pData);
          return false;
        }
      }
      module.exports = OratorServiceServerBase;
    }, {}],
    49: [function (require, module, exports) {
      'use strict';

      // This is taken directly from the find-my-way documentation for custom constraints and only mildly edited
      const ipcResponseTypeStrategy = {
        // strategy name for referencing in the route handler `constraints` options
        name: 'ipc',
        isAsync: true,
        // storage factory for storing routes in the find-my-way route tree
        storage: () => {
          let handlers = {};
          return {
            get: type => {
              return handlers[type] || null;
            },
            set: (type, store) => {
              handlers[type] = store;
            }
          };
        },
        // function to get the value of the constraint from each incoming request
        deriveConstraint: (pRequest, pContext, fDone) => {
          // If we wanted to deny the IPC request based on a constraint, we would do:
          // fDone(new Error(`The request was denied because ____ in the Request object wasn't right...`));
          return fDone(null, 'IPC');
        },
        // optional flag marking if handlers without constraints can match requests that have a value for this constraint
        mustMatchWhenDerived: true
      };
      module.exports = ipcResponseTypeStrategy;
    }, {}],
    50: [function (require, module, exports) {
      class OratorServiceServerIPCSynthesizedResponse {
        constructor(pLog, pRequestGUID) {
          this.log = pLog;
          this.requestGUID = pRequestGUID;
          this.responseData = null;
          this.responseStatus = -1;
        }
        send(pData) {
          if (typeof pData == 'string') {
            // This is a string!  Append it to the responsedata.
            if (this.responseData === null) {
              this.responseData = pData;
              return true;
            } else if (typeof this.responseData == 'string') {
              this.responseData = this.responseData + pData;
              return true;
            } else {
              this.log(`Request ${this.requestGUID} has tried to send() a string value after send()ing data type ${typeof this.responseData}.`, pData);
              return false;
            }
          } else if (typeof pData == 'object') {
            if (this.responseData === null) {
              this.responseData = JSON.stringify(pData);
              return true;
            } else if (typeof this.responseData == 'string') {
              // TODO: Discuss best way to handle this / if to handle this
              this.responseData += this.responseData + JSON.stringify(pData);
              return true;
            } else {
              this.log(`Request ${this.requestGUID} has tried to send() an object value to be auto stringified after send()ing data type ${typeof this.responseData}.`, pData);
              return false;
            }
          }
        }
      }
      module.exports = OratorServiceServerIPCSynthesizedResponse;
    }, {}],
    51: [function (require, module, exports) {
      const libOratorServiceServerBase = require('./Orator-ServiceServer-Base.js');

      // A synthesized response object, for simple IPC.
      const libOratorServiceServerIPCSynthesizedResponse = require('./Orator-ServiceServer-IPC-SynthesizedResponse.js');
      // A simple constrainer for the find-my-way router since we aren't using any kind of headers to pass version or host
      const libOratorServiceServerIPCCustomConstrainer = require('./Orator-ServiceServer-IPC-RouterConstrainer.js');

      // This library is the default router for our services
      const libFindMyWay = require('find-my-way');
      //const libAsync = require('async');
      const libAsyncWaterfall = require("async/waterfall");
      const libAsyncEachOfSeries = require('async/eachOfSeries');
      class OratorServiceServerIPC extends libOratorServiceServerBase {
        constructor(pOrator) {
          super(pOrator);
          this.routerOptions = this.orator.settings.hasOwnProperty('router_options') && typeof this.orator.settings.router_options == 'object' ? this.orator.settings.router_options : {};
          this.router = libFindMyWay(this.routerOptions);
          this.router.addConstraintStrategy(libOratorServiceServerIPCCustomConstrainer);
          this.URL = 'IPC';
          this.preBehaviorFunctions = [];
          this.behaviorMap = {};
          this.postBehaviorFunctions = [];
        }
        use(fHandlerFunction) {
          if (!super.use(fHandlerFunction)) {
            this.log.error(`IPC provider failed to map USE handler function!`);
            return false;
          }
          this.preBehaviorFunctions.push(fHandlerFunction);
        }
        addPostBehaviorFunction(fHandlerFunction) {
          if (!super.use(fHandlerFunction)) {
            this.log.error(`IPC provider failed to map USE handler function!`);
            return false;
          }
          this.preBehaviorFunctions.push(fHandlerFunction);
        }
        executePreBehaviorFunctions(pRequest, pResponse, fNext) {
          libAsyncEachOfSeries(this.preBehaviorFunctions, (fBehaviorFunction, pFunctionIndex, fCallback) => {
            return fBehaviorFunction(pRequest, pResponse, fCallback);
          }, pError => {
            if (pError) {
              this.log.error(`IPC Provider preBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`, pError);
            }
            return fNext(pError);
          });
        }
        addPostBehaviorFunction(fHandlerFunction) {
          if (!super.use(fHandlerFunction)) {
            this.log.error(`IPC provider failed to map USE handler function!`);
            return false;
          }
          this.preBehaviorFunctions.push(fHandlerFunction);
        }
        executePostBehaviorFunctions(pRequest, pResponse, fNext) {
          libAsyncEachOfSeries(this.postBehaviorFunctions, (fBehaviorFunction, pFunctionIndex, fCallback) => {
            return fBehaviorFunction(pRequest, pResponse, fCallback);
          }, pError => {
            if (pError) {
              this.log.error(`IPC Provider postBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`, pError);
            }
            return fNext(pError);
          });
        }

        /*
         * Service Route Creation Functions
         *
         * These base functions provide basic validation for the routes, but don't actually 
         * do anything with them.  The design intent here is to allow derived classes to call
         * these functions to validate that they conform to expected standards.
         *
         * Something like:
        		get (pRoute, ...fRouteProcessingFunctions)
        	{
        		//...now we can do our actual get mapping function!....
        	}
        	 * This pattern and calling super is totally optional, obviously.
         *************************************************************************/
        addRouteProcessor(pMethod, pRoute, pRouteFunctionArray) {
          // We have a constrainer on IPC so we can control channels eventually, if we like.
          // For now it just makes sure it was added with an IPC service server.
          this.router.on(pMethod, pRoute, {
            constraints: {
              "ipc": "IPC"
            }
          }, (pRequest, pResponse, pParameters) => {
            libAsyncWaterfall([fStageComplete => {
              // Added to make this mimic what we saw with route parsing in the old restify
              pRequest.params = pParameters;
              return fStageComplete();
            }, fStageComplete => {
              return this.executePreBehaviorFunctions(pRequest, pResponse, fStageComplete);
            }, fStageComplete => {
              libAsyncEachOfSeries(pRouteFunctionArray, (fBehaviorFunction, pFunctionIndex, fCallback) => {
                return fBehaviorFunction(pRequest, pResponse, fCallback);
              }, pBehaviorFunctionError => {
                if (pBehaviorFunctionError) {
                  this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`, pBehaviorFunctionError);
                  return fNext(pError);
                }
              });
            }, fStageComplete => {
              return this.executePostBehaviorFunctions(pRequest, pResponse, fStageComplete);
            }], pRequestError => {
              if (pRequestError) {
                this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`, pBehaviorFunctionError);
              }
            });
          });
          return true;
        }
        get(pRoute, ...fRouteProcessingFunctions) {
          if (!super.get(pRoute, ...fRouteProcessingFunctions)) {
            this.log.error(`IPC provider failed to map GET route [${pRoute}]!`);
            return false;
          }
          return this.addRouteProcessor('GET', pRoute, Array.from(fRouteProcessingFunctions));
        }
        put(pRoute, ...fRouteProcessingFunctions) {
          if (!super.get(pRoute, ...fRouteProcessingFunctions)) {
            this.log.error(`IPC provider failed to map PUT route [${pRoute}]!`);
            return false;
          }
          return true;
        }
        post(pRoute, ...fRouteProcessingFunctions) {
          if (!super.get(pRoute, ...fRouteProcessingFunctions)) {
            this.log.error(`IPC provider failed to map POST route [${pRoute}]!`);
            return false;
          }
          return true;
        }
        del(pRoute, ...fRouteProcessingFunctions) {
          if (!super.get(pRoute, ...fRouteProcessingFunctions)) {
            this.log.error(`IPC provider failed to map DEL route [${pRoute}]!`);
            return false;
          }
          return true;
        }
        /*************************************************************************
         * End of Service Route Creation Functions
         */

        // Programmatically invoke a route
        invoke(pMethod, pRoute, pData, fCallback) {
          // If the data is skipped and a callback is parameter 3, do the right thing
          let tmpCallback = typeof fCallback == 'function' ? fCallback : typeof pData == 'function' ? pData :
          // This is here in case the developer passed no callback and just wants to fire and forget the IPC call which might not be async safe
          () => {};

          // Create a bare minimum request object for IPC to pass to our router
          let tmpRequest = {
            method: pMethod,
            url: pRoute,
            guid: this.orator.fable.getUUID()
          };

          // Create a container for the IPC response data to be aggregated to from send() methodds
          let tmpSynthesizedResponseData = new libOratorServiceServerIPCSynthesizedResponse(this.log, tmpRequest.guid);
          return this.router.lookup(tmpRequest, tmpSynthesizedResponseData, (pError, pResults) => {
            if (pError) {
              this.log.error(`IPC Request Error Request GUID [${tmpRequest.guid}] handling route [${pRoute}]: ${pError}`, {
                Error: pError,
                Route: pRoute,
                Data: pData
              });
            }

            // by default, send data back through
            return tmpCallback(pError, tmpSynthesizedResponseData.responseData, tmpSynthesizedResponseData, pResults);
          });
        }
      }
      module.exports = OratorServiceServerIPC;
    }, {
      "./Orator-ServiceServer-Base.js": 48,
      "./Orator-ServiceServer-IPC-RouterConstrainer.js": 49,
      "./Orator-ServiceServer-IPC-SynthesizedResponse.js": 50,
      "async/eachOfSeries": 7,
      "async/waterfall": 20,
      "find-my-way": 29
    }],
    52: [function (require, module, exports) {
      /**
      * Orator Service Abstraction
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module Orator Service
      */

      const defaultOratorConfiguration = require('./Orator-Default-Configuration.js');
      const defaultOratorServiceServers = require('./Orator-Default-ServiceServers-Node.js');
      class Orator {
        constructor(pFable, pServiceProvider) {
          // We were passed a fully operational fable -- use this
          this.fable = pFable;

          // Carry core application requirements into the orator object for simplicity
          this.settings = this.fable.settings;
          this.log = this.fable.log;

          // Create the empty, important logic containers
          this.serviceServer = false;
          this.serviceServerProvider = false;
          if (typeof pServiceProvider !== 'undefined') {
            this.serviceServerProvider = pServiceProvider;
          }

          // Now check to see that the ServicePort is set (this used to be APIServerPort)
          if (!this.settings.hasOwnProperty('ServicePort')) {
            if (this.settings.hasOwnProperty('APIServerPort')) {
              // Automatically migrate the legacy APIServerPort to ServicePort
              this.settings.ServicePort = this.fable.settings.APIServerPort;
            } else {
              // Default to whatever the ... default is!
              this.settings.ServicePort = defaultOratorConfiguration.ServicePort;
            }
          }

          // Now check to see that the Product name is set
          if (!this.settings.hasOwnProperty('Product')) {
            this.settings.Product = defaultOratorConfiguration.Product;
          }
        }
        initializeServiceServer(fNext) {
          var tmpNext = typeof fNext === 'function' ? fNext : () => {};
          if (!this.serviceServer) {
            // If the developer hasn't set this to a service provider class of their own choosing, 
            // use the built-in network-less one.
            if (!this.serviceServerProvider) {
              this.serviceServerProvider = defaultOratorServiceServers.default;
            }
            this.serviceServer = new this.serviceServerProvider(this);

            // For legacy reasons, we also will provide this under the "webServer" variable.
            this.webServer = this.serviceServer;
          } else {
            this.log.warn(`Orator attempting to initialize a service server after initialization has already completed.`);
          }
          return tmpNext();
        }
        _startServiceListener(fNext) {
          return this.serviceServer.listen(this.settings.ServicePort, pError => {
            this.log.info(`${this.serviceServer.Name} listening at ${this.serviceServer.URL} port ${this.serviceServer.Port}`);
            return fNext(pError);
          });
        }
        startService(fNext) {
          var tmpNext = typeof fNext === 'function' ? fNext : () => {};
          if (!this.serviceServer) {
            this.initializeServiceServer();
          }
          return this._startServiceListener(tmpNext);
        }
        stopService(fNext) {
          var tmpNext = typeof fNext === 'function' ? fNext : () => {};
          if (!this.serviceServer) {
            let tmpMessage = `Orator attempting to stop a service server but the service server has not been intialized yet.`;
            this.log.warn(tmpMessage);
            return tmpNext(tmpMessage);
          }
          if (!this.serviceServer.Active) {
            let tmpMessage = `Orator attempting to stop a service server but the service server is not actively running.`;
            this.log.warn(tmpMessage);
            return tmpNext(tmpMessage);
          }
          return this.serviceServer.close(tmpNext);
        }
        invoke(pMethod, pRoute, pData, fCallback) {
          return this.serviceServer.invoke(pMethod, pRoute, pData, fCallback);
        }

        /*
         * Legacy Orator Functions
         *************************************************************************/
        startWebServer(fNext) {
          return this.startService(fNext);
        }

        // For legacy purposes
        stopWebServer(fNext) {
          return this.stopService(fNext);
        }

        // For legacy purposes
        getWebServer() {
          // The old behavior was to lazily construct the service the first time 
          // this accessor function is called.
          if (!this.serviceServer) {
            this.initializeServiceServer();
          }
          return this.serviceServer;
        }
        /*************************************************************************
         * End of Legacy Orator Functions
         */
      }

      module.exports = Orator;
      module.exports.ServiceServerBase = require('./Orator-ServiceServer-Base.js');
    }, {
      "./Orator-Default-Configuration.js": 46,
      "./Orator-Default-ServiceServers-Node.js": 47,
      "./Orator-ServiceServer-Base.js": 48
    }]
  }, {}, [45])(45);
});
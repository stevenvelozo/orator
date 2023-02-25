(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else{var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else{g=this;}g.Orator=f();}})(function(){var define,module,exports;return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o;}return r;}()({1:[function(require,module,exports){(function(global){(function(){'use strict';var objectAssign=require('object-assign');// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */function compare(a,b){if(a===b){return 0;}var x=a.length;var y=b.length;for(var i=0,len=Math.min(x,y);i<len;++i){if(a[i]!==b[i]){x=a[i];y=b[i];break;}}if(x<y){return-1;}if(y<x){return 1;}return 0;}function isBuffer(b){if(global.Buffer&&typeof global.Buffer.isBuffer==='function'){return global.Buffer.isBuffer(b);}return!!(b!=null&&b._isBuffer);}// based on node assert, original notice:
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
var util=require('util/');var hasOwn=Object.prototype.hasOwnProperty;var pSlice=Array.prototype.slice;var functionsHaveNames=function(){return function foo(){}.name==='foo';}();function pToString(obj){return Object.prototype.toString.call(obj);}function isView(arrbuf){if(isBuffer(arrbuf)){return false;}if(typeof global.ArrayBuffer!=='function'){return false;}if(typeof ArrayBuffer.isView==='function'){return ArrayBuffer.isView(arrbuf);}if(!arrbuf){return false;}if(arrbuf instanceof DataView){return true;}if(arrbuf.buffer&&arrbuf.buffer instanceof ArrayBuffer){return true;}return false;}// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.
var assert=module.exports=ok;// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })
var regex=/\s*function\s+([^\(\s]*)\s*/;// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func){if(!util.isFunction(func)){return;}if(functionsHaveNames){return func.name;}var str=func.toString();var match=str.match(regex);return match&&match[1];}assert.AssertionError=function AssertionError(options){this.name='AssertionError';this.actual=options.actual;this.expected=options.expected;this.operator=options.operator;if(options.message){this.message=options.message;this.generatedMessage=false;}else{this.message=getMessage(this);this.generatedMessage=true;}var stackStartFunction=options.stackStartFunction||fail;if(Error.captureStackTrace){Error.captureStackTrace(this,stackStartFunction);}else{// non v8 browsers so we can have a stacktrace
var err=new Error();if(err.stack){var out=err.stack;// try to strip useless frames
var fn_name=getName(stackStartFunction);var idx=out.indexOf('\n'+fn_name);if(idx>=0){// once we have located the function frame
// we need to strip out everything before it (and its line)
var next_line=out.indexOf('\n',idx+1);out=out.substring(next_line+1);}this.stack=out;}}};// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError,Error);function truncate(s,n){if(typeof s==='string'){return s.length<n?s:s.slice(0,n);}else{return s;}}function inspect(something){if(functionsHaveNames||!util.isFunction(something)){return util.inspect(something);}var rawname=getName(something);var name=rawname?': '+rawname:'';return'[Function'+name+']';}function getMessage(self){return truncate(inspect(self.actual),128)+' '+self.operator+' '+truncate(inspect(self.expected),128);}// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.
// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
function fail(actual,expected,message,operator,stackStartFunction){throw new assert.AssertionError({message:message,actual:actual,expected:expected,operator:operator,stackStartFunction:stackStartFunction});}// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail=fail;// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.
function ok(value,message){if(!value)fail(value,true,message,'==',assert.ok);}assert.ok=ok;// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);
assert.equal=function equal(actual,expected,message){if(actual!=expected)fail(actual,expected,message,'==',assert.equal);};// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);
assert.notEqual=function notEqual(actual,expected,message){if(actual==expected){fail(actual,expected,message,'!=',assert.notEqual);}};// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);
assert.deepEqual=function deepEqual(actual,expected,message){if(!_deepEqual(actual,expected,false)){fail(actual,expected,message,'deepEqual',assert.deepEqual);}};assert.deepStrictEqual=function deepStrictEqual(actual,expected,message){if(!_deepEqual(actual,expected,true)){fail(actual,expected,message,'deepStrictEqual',assert.deepStrictEqual);}};function _deepEqual(actual,expected,strict,memos){// 7.1. All identical values are equivalent, as determined by ===.
if(actual===expected){return true;}else if(isBuffer(actual)&&isBuffer(expected)){return compare(actual,expected)===0;// 7.2. If the expected value is a Date object, the actual value is
// equivalent if it is also a Date object that refers to the same time.
}else if(util.isDate(actual)&&util.isDate(expected)){return actual.getTime()===expected.getTime();// 7.3 If the expected value is a RegExp object, the actual value is
// equivalent if it is also a RegExp object with the same source and
// properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
}else if(util.isRegExp(actual)&&util.isRegExp(expected)){return actual.source===expected.source&&actual.global===expected.global&&actual.multiline===expected.multiline&&actual.lastIndex===expected.lastIndex&&actual.ignoreCase===expected.ignoreCase;// 7.4. Other pairs that do not both pass typeof value == 'object',
// equivalence is determined by ==.
}else if((actual===null||typeof actual!=='object')&&(expected===null||typeof expected!=='object')){return strict?actual===expected:actual==expected;// If both values are instances of typed arrays, wrap their underlying
// ArrayBuffers in a Buffer each to increase performance
// This optimization requires the arrays to have the same type as checked by
// Object.prototype.toString (aka pToString). Never perform binary
// comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
// bit patterns are not identical.
}else if(isView(actual)&&isView(expected)&&pToString(actual)===pToString(expected)&&!(actual instanceof Float32Array||actual instanceof Float64Array)){return compare(new Uint8Array(actual.buffer),new Uint8Array(expected.buffer))===0;// 7.5 For all other Object pairs, including Array objects, equivalence is
// determined by having the same number of owned properties (as verified
// with Object.prototype.hasOwnProperty.call), the same set of keys
// (although not necessarily the same order), equivalent values for every
// corresponding key, and an identical 'prototype' property. Note: this
// accounts for both named and indexed properties on Arrays.
}else if(isBuffer(actual)!==isBuffer(expected)){return false;}else{memos=memos||{actual:[],expected:[]};var actualIndex=memos.actual.indexOf(actual);if(actualIndex!==-1){if(actualIndex===memos.expected.indexOf(expected)){return true;}}memos.actual.push(actual);memos.expected.push(expected);return objEquiv(actual,expected,strict,memos);}}function isArguments(object){return Object.prototype.toString.call(object)=='[object Arguments]';}function objEquiv(a,b,strict,actualVisitedObjects){if(a===null||a===undefined||b===null||b===undefined)return false;// if one is a primitive, the other must be same
if(util.isPrimitive(a)||util.isPrimitive(b))return a===b;if(strict&&Object.getPrototypeOf(a)!==Object.getPrototypeOf(b))return false;var aIsArgs=isArguments(a);var bIsArgs=isArguments(b);if(aIsArgs&&!bIsArgs||!aIsArgs&&bIsArgs)return false;if(aIsArgs){a=pSlice.call(a);b=pSlice.call(b);return _deepEqual(a,b,strict);}var ka=objectKeys(a);var kb=objectKeys(b);var key,i;// having the same number of owned properties (keys incorporates
// hasOwnProperty)
if(ka.length!==kb.length)return false;//the same set of keys (although not necessarily the same order),
ka.sort();kb.sort();//~~~cheap key test
for(i=ka.length-1;i>=0;i--){if(ka[i]!==kb[i])return false;}//equivalent values for every corresponding key, and
//~~~possibly expensive deep test
for(i=ka.length-1;i>=0;i--){key=ka[i];if(!_deepEqual(a[key],b[key],strict,actualVisitedObjects))return false;}return true;}// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
assert.notDeepEqual=function notDeepEqual(actual,expected,message){if(_deepEqual(actual,expected,false)){fail(actual,expected,message,'notDeepEqual',assert.notDeepEqual);}};assert.notDeepStrictEqual=notDeepStrictEqual;function notDeepStrictEqual(actual,expected,message){if(_deepEqual(actual,expected,true)){fail(actual,expected,message,'notDeepStrictEqual',notDeepStrictEqual);}}// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);
assert.strictEqual=function strictEqual(actual,expected,message){if(actual!==expected){fail(actual,expected,message,'===',assert.strictEqual);}};// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
assert.notStrictEqual=function notStrictEqual(actual,expected,message){if(actual===expected){fail(actual,expected,message,'!==',assert.notStrictEqual);}};function expectedException(actual,expected){if(!actual||!expected){return false;}if(Object.prototype.toString.call(expected)=='[object RegExp]'){return expected.test(actual);}try{if(actual instanceof expected){return true;}}catch(e){// Ignore.  The instanceof check doesn't work for arrow functions.
}if(Error.isPrototypeOf(expected)){return false;}return expected.call({},actual)===true;}function _tryBlock(block){var error;try{block();}catch(e){error=e;}return error;}function _throws(shouldThrow,block,expected,message){var actual;if(typeof block!=='function'){throw new TypeError('"block" argument must be a function');}if(typeof expected==='string'){message=expected;expected=null;}actual=_tryBlock(block);message=(expected&&expected.name?' ('+expected.name+').':'.')+(message?' '+message:'.');if(shouldThrow&&!actual){fail(actual,expected,'Missing expected exception'+message);}var userProvidedMessage=typeof message==='string';var isUnwantedException=!shouldThrow&&util.isError(actual);var isUnexpectedException=!shouldThrow&&actual&&!expected;if(isUnwantedException&&userProvidedMessage&&expectedException(actual,expected)||isUnexpectedException){fail(actual,expected,'Got unwanted exception'+message);}if(shouldThrow&&actual&&expected&&!expectedException(actual,expected)||!shouldThrow&&actual){throw actual;}}// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
assert.throws=function(block,/*optional*/error,/*optional*/message){_throws(true,block,error,message);};// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow=function(block,/*optional*/error,/*optional*/message){_throws(false,block,error,message);};assert.ifError=function(err){if(err)throw err;};// Expose a strict only variant of assert
function strict(value,message){if(!value)fail(value,true,message,'==',strict);}assert.strict=objectAssign(strict,assert,{equal:assert.strictEqual,deepEqual:assert.deepStrictEqual,notEqual:assert.notStrictEqual,notDeepEqual:assert.notDeepStrictEqual});assert.strict.strict=assert.strict;var objectKeys=Object.keys||function(obj){var keys=[];for(var key in obj){if(hasOwn.call(obj,key))keys.push(key);}return keys;};}).call(this);}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"object-assign":32,"util/":4}],2:[function(require,module,exports){if(typeof Object.create==='function'){// implementation from standard node.js 'util' module
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:false,writable:true,configurable:true}});};}else{// old school shim for old browsers
module.exports=function inherits(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor();ctor.prototype.constructor=ctor;};}},{}],3:[function(require,module,exports){module.exports=function isBuffer(arg){return arg&&typeof arg==='object'&&typeof arg.copy==='function'&&typeof arg.fill==='function'&&typeof arg.readUInt8==='function';};},{}],4:[function(require,module,exports){(function(process,global){(function(){// Copyright Joyent, Inc. and other Node contributors.
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
var formatRegExp=/%[sdj%]/g;exports.format=function(f){if(!isString(f)){var objects=[];for(var i=0;i<arguments.length;i++){objects.push(inspect(arguments[i]));}return objects.join(' ');}var i=1;var args=arguments;var len=args.length;var str=String(f).replace(formatRegExp,function(x){if(x==='%%')return'%';if(i>=len)return x;switch(x){case'%s':return String(args[i++]);case'%d':return Number(args[i++]);case'%j':try{return JSON.stringify(args[i++]);}catch(_){return'[Circular]';}default:return x;}});for(var x=args[i];i<len;x=args[++i]){if(isNull(x)||!isObject(x)){str+=' '+x;}else{str+=' '+inspect(x);}}return str;};// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate=function(fn,msg){// Allow for deprecating things in the process of starting up.
if(isUndefined(global.process)){return function(){return exports.deprecate(fn,msg).apply(this,arguments);};}if(process.noDeprecation===true){return fn;}var warned=false;function deprecated(){if(!warned){if(process.throwDeprecation){throw new Error(msg);}else if(process.traceDeprecation){console.trace(msg);}else{console.error(msg);}warned=true;}return fn.apply(this,arguments);}return deprecated;};var debugs={};var debugEnviron;exports.debuglog=function(set){if(isUndefined(debugEnviron))debugEnviron=process.env.NODE_DEBUG||'';set=set.toUpperCase();if(!debugs[set]){if(new RegExp('\\b'+set+'\\b','i').test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=exports.format.apply(exports,arguments);console.error('%s %d: %s',set,pid,msg);};}else{debugs[set]=function(){};}}return debugs[set];};/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */ /* legacy: obj, showHidden, depth, colors*/function inspect(obj,opts){// default options
var ctx={seen:[],stylize:stylizeNoColor};// legacy...
if(arguments.length>=3)ctx.depth=arguments[2];if(arguments.length>=4)ctx.colors=arguments[3];if(isBoolean(opts)){// legacy...
ctx.showHidden=opts;}else if(opts){// got an "options" object
exports._extend(ctx,opts);}// set default options
if(isUndefined(ctx.showHidden))ctx.showHidden=false;if(isUndefined(ctx.depth))ctx.depth=2;if(isUndefined(ctx.colors))ctx.colors=false;if(isUndefined(ctx.customInspect))ctx.customInspect=true;if(ctx.colors)ctx.stylize=stylizeWithColor;return formatValue(ctx,obj,ctx.depth);}exports.inspect=inspect;// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors={'bold':[1,22],'italic':[3,23],'underline':[4,24],'inverse':[7,27],'white':[37,39],'grey':[90,39],'black':[30,39],'blue':[34,39],'cyan':[36,39],'green':[32,39],'magenta':[35,39],'red':[31,39],'yellow':[33,39]};// Don't use 'blue' not visible on cmd.exe
inspect.styles={'special':'cyan','number':'yellow','boolean':'yellow','undefined':'grey','null':'bold','string':'green','date':'magenta',// "name": intentionally not styling
'regexp':'red'};function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];if(style){return'\u001b['+inspect.colors[style][0]+'m'+str+'\u001b['+inspect.colors[style][1]+'m';}else{return str;}}function stylizeNoColor(str,styleType){return str;}function arrayToHash(array){var hash={};array.forEach(function(val,idx){hash[val]=true;});return hash;}function formatValue(ctx,value,recurseTimes){// Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it
if(ctx.customInspect&&value&&isFunction(value.inspect)&&// Filter out the util module, it's inspect function is special
value.inspect!==exports.inspect&&// Also filter out any prototype objects using the circular check.
!(value.constructor&&value.constructor.prototype===value)){var ret=value.inspect(recurseTimes,ctx);if(!isString(ret)){ret=formatValue(ctx,ret,recurseTimes);}return ret;}// Primitive types cannot have properties
var primitive=formatPrimitive(ctx,value);if(primitive){return primitive;}// Look up the keys of the object.
var keys=Object.keys(value);var visibleKeys=arrayToHash(keys);if(ctx.showHidden){keys=Object.getOwnPropertyNames(value);}// IE doesn't make error fields non-enumerable
// http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
if(isError(value)&&(keys.indexOf('message')>=0||keys.indexOf('description')>=0)){return formatError(value);}// Some type of object without properties can be shortcutted.
if(keys.length===0){if(isFunction(value)){var name=value.name?': '+value.name:'';return ctx.stylize('[Function'+name+']','special');}if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}if(isDate(value)){return ctx.stylize(Date.prototype.toString.call(value),'date');}if(isError(value)){return formatError(value);}}var base='',array=false,braces=['{','}'];// Make Array say that they are Array
if(isArray(value)){array=true;braces=['[',']'];}// Make functions say that they are functions
if(isFunction(value)){var n=value.name?': '+value.name:'';base=' [Function'+n+']';}// Make RegExps say that they are RegExps
if(isRegExp(value)){base=' '+RegExp.prototype.toString.call(value);}// Make dates with properties first say the date
if(isDate(value)){base=' '+Date.prototype.toUTCString.call(value);}// Make error with message first say the error
if(isError(value)){base=' '+formatError(value);}if(keys.length===0&&(!array||value.length==0)){return braces[0]+base+braces[1];}if(recurseTimes<0){if(isRegExp(value)){return ctx.stylize(RegExp.prototype.toString.call(value),'regexp');}else{return ctx.stylize('[Object]','special');}}ctx.seen.push(value);var output;if(array){output=formatArray(ctx,value,recurseTimes,visibleKeys,keys);}else{output=keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array);});}ctx.seen.pop();return reduceToSingleString(output,base,braces);}function formatPrimitive(ctx,value){if(isUndefined(value))return ctx.stylize('undefined','undefined');if(isString(value)){var simple='\''+JSON.stringify(value).replace(/^"|"$/g,'').replace(/'/g,"\\'").replace(/\\"/g,'"')+'\'';return ctx.stylize(simple,'string');}if(isNumber(value))return ctx.stylize(''+value,'number');if(isBoolean(value))return ctx.stylize(''+value,'boolean');// For some reason typeof null is "object", so special case here.
if(isNull(value))return ctx.stylize('null','null');}function formatError(value){return'['+Error.prototype.toString.call(value)+']';}function formatArray(ctx,value,recurseTimes,visibleKeys,keys){var output=[];for(var i=0,l=value.length;i<l;++i){if(hasOwnProperty(value,String(i))){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),true));}else{output.push('');}}keys.forEach(function(key){if(!key.match(/^\d+$/)){output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,true));}});return output;}function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]};if(desc.get){if(desc.set){str=ctx.stylize('[Getter/Setter]','special');}else{str=ctx.stylize('[Getter]','special');}}else{if(desc.set){str=ctx.stylize('[Setter]','special');}}if(!hasOwnProperty(visibleKeys,key)){name='['+key+']';}if(!str){if(ctx.seen.indexOf(desc.value)<0){if(isNull(recurseTimes)){str=formatValue(ctx,desc.value,null);}else{str=formatValue(ctx,desc.value,recurseTimes-1);}if(str.indexOf('\n')>-1){if(array){str=str.split('\n').map(function(line){return'  '+line;}).join('\n').substr(2);}else{str='\n'+str.split('\n').map(function(line){return'   '+line;}).join('\n');}}}else{str=ctx.stylize('[Circular]','special');}}if(isUndefined(name)){if(array&&key.match(/^\d+$/)){return str;}name=JSON.stringify(''+key);if(name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){name=name.substr(1,name.length-2);name=ctx.stylize(name,'name');}else{name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");name=ctx.stylize(name,'string');}}return name+': '+str;}function reduceToSingleString(output,base,braces){var numLinesEst=0;var length=output.reduce(function(prev,cur){numLinesEst++;if(cur.indexOf('\n')>=0)numLinesEst++;return prev+cur.replace(/\u001b\[\d\d?m/g,'').length+1;},0);if(length>60){return braces[0]+(base===''?'':base+'\n ')+' '+output.join(',\n  ')+' '+braces[1];}return braces[0]+base+' '+output.join(', ')+' '+braces[1];}// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar){return Array.isArray(ar);}exports.isArray=isArray;function isBoolean(arg){return typeof arg==='boolean';}exports.isBoolean=isBoolean;function isNull(arg){return arg===null;}exports.isNull=isNull;function isNullOrUndefined(arg){return arg==null;}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(arg){return typeof arg==='number';}exports.isNumber=isNumber;function isString(arg){return typeof arg==='string';}exports.isString=isString;function isSymbol(arg){return typeof arg==='symbol';}exports.isSymbol=isSymbol;function isUndefined(arg){return arg===void 0;}exports.isUndefined=isUndefined;function isRegExp(re){return isObject(re)&&objectToString(re)==='[object RegExp]';}exports.isRegExp=isRegExp;function isObject(arg){return typeof arg==='object'&&arg!==null;}exports.isObject=isObject;function isDate(d){return isObject(d)&&objectToString(d)==='[object Date]';}exports.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==='[object Error]'||e instanceof Error);}exports.isError=isError;function isFunction(arg){return typeof arg==='function';}exports.isFunction=isFunction;function isPrimitive(arg){return arg===null||typeof arg==='boolean'||typeof arg==='number'||typeof arg==='string'||typeof arg==='symbol'||// ES6 symbol
typeof arg==='undefined';}exports.isPrimitive=isPrimitive;exports.isBuffer=require('./support/isBuffer');function objectToString(o){return Object.prototype.toString.call(o);}function pad(n){return n<10?'0'+n.toString(10):n.toString(10);}var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];// 26 Feb 16:19:34
function timestamp(){var d=new Date();var time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(':');return[d.getDate(),months[d.getMonth()],time].join(' ');}// log is just a thin wrapper to console.log that prepends a timestamp
exports.log=function(){console.log('%s - %s',timestamp(),exports.format.apply(exports,arguments));};/**
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
 */exports.inherits=require('inherits');exports._extend=function(origin,add){// Don't do anything if add isn't an object
if(!add||!isObject(add))return origin;var keys=Object.keys(add);var i=keys.length;while(i--){origin[keys[i]]=add[keys[i]];}return origin;};function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop);}}).call(this);}).call(this,require('_process'),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{"./support/isBuffer":3,"_process":37,"inherits":2}],5:[function(require,module,exports){(function(process,setImmediate){(function(){(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?factory(exports):typeof define==='function'&&define.amd?define(['exports'],factory):factory(global.async={});})(this,function(exports){'use strict';/**
     * Creates a continuation function with some arguments already applied.
     *
     * Useful as a shorthand when combined with other control flow functions. Any
     * arguments passed to the returned function are added to the arguments
     * originally passed to apply.
     *
     * @name apply
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {Function} fn - The function you want to eventually apply all
     * arguments to. Invokes with (arguments...).
     * @param {...*} arguments... - Any number of arguments to automatically apply
     * when the continuation is called.
     * @returns {Function} the partially-applied function
     * @example
     *
     * // using apply
     * async.parallel([
     *     async.apply(fs.writeFile, 'testfile1', 'test1'),
     *     async.apply(fs.writeFile, 'testfile2', 'test2')
     * ]);
     *
     *
     * // the same process without using apply
     * async.parallel([
     *     function(callback) {
     *         fs.writeFile('testfile1', 'test1', callback);
     *     },
     *     function(callback) {
     *         fs.writeFile('testfile2', 'test2', callback);
     *     }
     * ]);
     *
     * // It's possible to pass any number of additional arguments when calling the
     * // continuation:
     *
     * node> var fn = async.apply(sys.puts, 'one');
     * node> fn('two', 'three');
     * one
     * two
     * three
     */function apply(fn,...args){return(...callArgs)=>fn(...args,...callArgs);}function initialParams(fn){return function(...args/*, callback*/){var callback=args.pop();return fn.call(this,args,callback);};}/* istanbul ignore file */var hasQueueMicrotask=typeof queueMicrotask==='function'&&queueMicrotask;var hasSetImmediate=typeof setImmediate==='function'&&setImmediate;var hasNextTick=typeof process==='object'&&typeof process.nextTick==='function';function fallback(fn){setTimeout(fn,0);}function wrap(defer){return(fn,...args)=>defer(()=>fn(...args));}var _defer;if(hasQueueMicrotask){_defer=queueMicrotask;}else if(hasSetImmediate){_defer=setImmediate;}else if(hasNextTick){_defer=process.nextTick;}else{_defer=fallback;}var setImmediate$1=wrap(_defer);/**
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
     */function asyncify(func){if(isAsync(func)){return function(...args/*, callback*/){const callback=args.pop();const promise=func.apply(this,args);return handlePromise(promise,callback);};}return initialParams(function(args,callback){var result;try{result=func.apply(this,args);}catch(e){return callback(e);}// if result is Promise object
if(result&&typeof result.then==='function'){return handlePromise(result,callback);}else{callback(null,result);}});}function handlePromise(promise,callback){return promise.then(value=>{invokeCallback(callback,null,value);},err=>{invokeCallback(callback,err&&err.message?err:new Error(err));});}function invokeCallback(callback,error,value){try{callback(error,value);}catch(err){setImmediate$1(e=>{throw e;},err);}}function isAsync(fn){return fn[Symbol.toStringTag]==='AsyncFunction';}function isAsyncGenerator(fn){return fn[Symbol.toStringTag]==='AsyncGenerator';}function isAsyncIterable(obj){return typeof obj[Symbol.asyncIterator]==='function';}function wrapAsync(asyncFn){if(typeof asyncFn!=='function')throw new Error('expected a function');return isAsync(asyncFn)?asyncify(asyncFn):asyncFn;}// conditionally promisify a function.
// only return a promise if a callback is omitted
function awaitify(asyncFn,arity=asyncFn.length){if(!arity)throw new Error('arity is undefined');function awaitable(...args){if(typeof args[arity-1]==='function'){return asyncFn.apply(this,args);}return new Promise((resolve,reject)=>{args[arity-1]=(err,...cbArgs)=>{if(err)return reject(err);resolve(cbArgs.length>1?cbArgs:cbArgs[0]);};asyncFn.apply(this,args);});}return awaitable;}function applyEach(eachfn){return function applyEach(fns,...callArgs){const go=awaitify(function(callback){var that=this;return eachfn(fns,(fn,cb)=>{wrapAsync(fn).apply(that,callArgs.concat(cb));},callback);});return go;};}function _asyncMap(eachfn,arr,iteratee,callback){arr=arr||[];var results=[];var counter=0;var _iteratee=wrapAsync(iteratee);return eachfn(arr,(value,_,iterCb)=>{var index=counter++;_iteratee(value,(err,v)=>{results[index]=v;iterCb(err);});},err=>{callback(err,results);});}function isArrayLike(value){return value&&typeof value.length==='number'&&value.length>=0&&value.length%1===0;}// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
const breakLoop={};function once(fn){function wrapper(...args){if(fn===null)return;var callFn=fn;fn=null;callFn.apply(this,args);}Object.assign(wrapper,fn);return wrapper;}function getIterator(coll){return coll[Symbol.iterator]&&coll[Symbol.iterator]();}function createArrayIterator(coll){var i=-1;var len=coll.length;return function next(){return++i<len?{value:coll[i],key:i}:null;};}function createES2015Iterator(iterator){var i=-1;return function next(){var item=iterator.next();if(item.done)return null;i++;return{value:item.value,key:i};};}function createObjectIterator(obj){var okeys=obj?Object.keys(obj):[];var i=-1;var len=okeys.length;return function next(){var key=okeys[++i];if(key==='__proto__'){return next();}return i<len?{value:obj[key],key}:null;};}function createIterator(coll){if(isArrayLike(coll)){return createArrayIterator(coll);}var iterator=getIterator(coll);return iterator?createES2015Iterator(iterator):createObjectIterator(coll);}function onlyOnce(fn){return function(...args){if(fn===null)throw new Error("Callback was already called.");var callFn=fn;fn=null;callFn.apply(this,args);};}// for async generators
function asyncEachOfLimit(generator,limit,iteratee,callback){let done=false;let canceled=false;let awaiting=false;let running=0;let idx=0;function replenish(){//console.log('replenish')
if(running>=limit||awaiting||done)return;//console.log('replenish awaiting')
awaiting=true;generator.next().then(({value,done:iterDone})=>{//console.log('got value', value)
if(canceled||done)return;awaiting=false;if(iterDone){done=true;if(running<=0){//console.log('done nextCb')
callback(null);}return;}running++;iteratee(value,idx,iterateeCallback);idx++;replenish();}).catch(handleError);}function iterateeCallback(err,result){//console.log('iterateeCallback')
running-=1;if(canceled)return;if(err)return handleError(err);if(err===false){done=true;canceled=true;return;}if(result===breakLoop||done&&running<=0){done=true;//console.log('done iterCb')
return callback(null);}replenish();}function handleError(err){if(canceled)return;awaiting=false;done=true;callback(err);}replenish();}var eachOfLimit=limit=>{return(obj,iteratee,callback)=>{callback=once(callback);if(limit<=0){throw new RangeError('concurrency limit cannot be less than 1');}if(!obj){return callback(null);}if(isAsyncGenerator(obj)){return asyncEachOfLimit(obj,limit,iteratee,callback);}if(isAsyncIterable(obj)){return asyncEachOfLimit(obj[Symbol.asyncIterator](),limit,iteratee,callback);}var nextElem=createIterator(obj);var done=false;var canceled=false;var running=0;var looping=false;function iterateeCallback(err,value){if(canceled)return;running-=1;if(err){done=true;callback(err);}else if(err===false){done=true;canceled=true;}else if(value===breakLoop||done&&running<=0){done=true;return callback(null);}else if(!looping){replenish();}}function replenish(){looping=true;while(running<limit&&!done){var elem=nextElem();if(elem===null){done=true;if(running<=0){callback(null);}return;}running+=1;iteratee(elem.value,elem.key,onlyOnce(iterateeCallback));}looping=false;}replenish();};};/**
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
     */function eachOfLimit$1(coll,limit,iteratee,callback){return eachOfLimit(limit)(coll,wrapAsync(iteratee),callback);}var eachOfLimit$2=awaitify(eachOfLimit$1,4);// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll,iteratee,callback){callback=once(callback);var index=0,completed=0,{length}=coll,canceled=false;if(length===0){callback(null);}function iteratorCallback(err,value){if(err===false){canceled=true;}if(canceled===true)return;if(err){callback(err);}else if(++completed===length||value===breakLoop){callback(null);}}for(;index<length;index++){iteratee(coll[index],index,onlyOnce(iteratorCallback));}}// a generic version of eachOf which can handle array, object, and iterator cases.
function eachOfGeneric(coll,iteratee,callback){return eachOfLimit$2(coll,Infinity,iteratee,callback);}/**
     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
     * to the iteratee.
     *
     * @name eachOf
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEachOf
     * @category Collection
     * @see [async.each]{@link module:Collections.each}
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each
     * item in `coll`.
     * The `key` is the item's key, or index in the case of an array.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dev.json is a file containing a valid json object config for dev environment
     * // dev.json is a file containing a valid json object config for test environment
     * // prod.json is a file containing a valid json object config for prod environment
     * // invalid.json is a file with a malformed json object
     *
     * let configs = {}; //global variable
     * let validConfigFileMap = {dev: 'dev.json', test: 'test.json', prod: 'prod.json'};
     * let invalidConfigFileMap = {dev: 'dev.json', test: 'test.json', invalid: 'invalid.json'};
     *
     * // asynchronous function that reads a json file and parses the contents as json object
     * function parseFile(file, key, callback) {
     *     fs.readFile(file, "utf8", function(err, data) {
     *         if (err) return calback(err);
     *         try {
     *             configs[key] = JSON.parse(data);
     *         } catch (e) {
     *             return callback(e);
     *         }
     *         callback();
     *     });
     * }
     *
     * // Using callbacks
     * async.forEachOf(validConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *     } else {
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *         // JSON parse error exception
     *     } else {
     *         console.log(configs);
     *     }
     * });
     *
     * // Using Promises
     * async.forEachOf(validConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     *     // configs is now a map of JSON data, e.g.
     *     // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     * }).catch( err => {
     *     console.error(err);
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     * }).catch( err => {
     *     console.error(err);
     *     // JSON parse error exception
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.forEachOf(validConfigFileMap, parseFile);
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * //Error handing
     * async () => {
     *     try {
     *         let result = await async.forEachOf(invalidConfigFileMap, parseFile);
     *         console.log(configs);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // JSON parse error exception
     *     }
     * }
     *
     */function eachOf(coll,iteratee,callback){var eachOfImplementation=isArrayLike(coll)?eachOfArrayLike:eachOfGeneric;return eachOfImplementation(coll,wrapAsync(iteratee),callback);}var eachOf$1=awaitify(eachOf,3);/**
     * Produces a new collection of values by mapping each value in `coll` through
     * the `iteratee` function. The `iteratee` is called with an item from `coll`
     * and a callback for when it has finished processing. Each of these callbacks
     * takes 2 arguments: an `error`, and the transformed item from `coll`. If
     * `iteratee` passes an error to its callback, the main `callback` (for the
     * `map` function) is immediately called with the error.
     *
     * Note, that since this function applies the `iteratee` to each item in
     * parallel, there is no guarantee that the `iteratee` functions will complete
     * in order. However, the results array will be in the same order as the
     * original `coll`.
     *
     * If `map` is passed an Object, the results will be an Array.  The results
     * will roughly be in the order of the original Objects' keys (but this can
     * vary across JavaScript engines).
     *
     * @name map
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an Array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.map(fileList, getFileSizeInBytes, function(err, results) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(results);
     *         // results is now an array of the file size in bytes for each file, e.g.
     *         // [ 1000, 2000, 3000]
     *     }
     * });
     *
     * // Error Handling
     * async.map(withMissingFileList, getFileSizeInBytes, function(err, results) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(results);
     *     }
     * });
     *
     * // Using Promises
     * async.map(fileList, getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     *     // results is now an array of the file size in bytes for each file, e.g.
     *     // [ 1000, 2000, 3000]
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.map(withMissingFileList, getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.map(fileList, getFileSizeInBytes);
     *         console.log(results);
     *         // results is now an array of the file size in bytes for each file, e.g.
     *         // [ 1000, 2000, 3000]
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let results = await async.map(withMissingFileList, getFileSizeInBytes);
     *         console.log(results);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */function map(coll,iteratee,callback){return _asyncMap(eachOf$1,coll,iteratee,callback);}var map$1=awaitify(map,3);/**
     * Applies the provided arguments to each function in the array, calling
     * `callback` after all functions have completed. If you only provide the first
     * argument, `fns`, then it will return a function which lets you pass in the
     * arguments as if it were a single function call. If more arguments are
     * provided, `callback` is required while `args` is still optional. The results
     * for each of the applied async functions are passed to the final callback
     * as an array.
     *
     * @name applyEach
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s
     * to all call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {AsyncFunction} - Returns a function that takes no args other than
     * an optional callback, that is the result of applying the `args` to each
     * of the functions.
     * @example
     *
     * const appliedFn = async.applyEach([enableSearch, updateSchema], 'bucket')
     *
     * appliedFn((err, results) => {
     *     // results[0] is the results for `enableSearch`
     *     // results[1] is the results for `updateSchema`
     * });
     *
     * // partial application example:
     * async.each(
     *     buckets,
     *     async (bucket) => async.applyEach([enableSearch, updateSchema], bucket)(),
     *     callback
     * );
     */var applyEach$1=applyEach(map$1);/**
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
     */function eachOfSeries(coll,iteratee,callback){return eachOfLimit$2(coll,1,iteratee,callback);}var eachOfSeries$1=awaitify(eachOfSeries,3);/**
     * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
     *
     * @name mapSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */function mapSeries(coll,iteratee,callback){return _asyncMap(eachOfSeries$1,coll,iteratee,callback);}var mapSeries$1=awaitify(mapSeries,3);/**
     * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
     *
     * @name applyEachSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.applyEach]{@link module:ControlFlow.applyEach}
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} fns - A collection of {@link AsyncFunction}s to all
     * call with the same arguments
     * @param {...*} [args] - any number of separate arguments to pass to the
     * function.
     * @param {Function} [callback] - the final argument should be the callback,
     * called when all functions have completed processing.
     * @returns {AsyncFunction} - A function, that when called, is the result of
     * appling the `args` to the list of functions.  It takes no args, other than
     * a callback.
     */var applyEachSeries=applyEach(mapSeries$1);const PROMISE_SYMBOL=Symbol('promiseCallback');function promiseCallback(){let resolve,reject;function callback(err,...args){if(err)return reject(err);resolve(args.length>1?args:args[0]);}callback[PROMISE_SYMBOL]=new Promise((res,rej)=>{resolve=res,reject=rej;});return callback;}/**
     * Determines the best order for running the {@link AsyncFunction}s in `tasks`, based on
     * their requirements. Each function can optionally depend on other functions
     * being completed first, and each function is run as soon as its requirements
     * are satisfied.
     *
     * If any of the {@link AsyncFunction}s pass an error to their callback, the `auto` sequence
     * will stop. Further tasks will not execute (so any other functions depending
     * on it will not run), and the main `callback` is immediately called with the
     * error.
     *
     * {@link AsyncFunction}s also receive an object containing the results of functions which
     * have completed so far as the first argument, if they have dependencies. If a
     * task function has no dependencies, it will only be passed a callback.
     *
     * @name auto
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Object} tasks - An object. Each of its properties is either a
     * function or an array of requirements, with the {@link AsyncFunction} itself the last item
     * in the array. The object's key of a property serves as the name of the task
     * defined by that property, i.e. can be used when specifying requirements for
     * other tasks. The function receives one or two arguments:
     * * a `results` object, containing the results of the previously executed
     *   functions, only passed if the task has any dependencies,
     * * a `callback(err, result)` function, which must be called when finished,
     *   passing an `error` (which can be `null`) and the result of the function's
     *   execution.
     * @param {number} [concurrency=Infinity] - An optional `integer` for
     * determining the maximum number of tasks that can be run in parallel. By
     * default, as many as possible.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback. Results are always returned; however, if an
     * error occurs, no further `tasks` will be performed, and the results object
     * will only contain partial results. Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     * @example
     *
     * //Using Callbacks
     * async.auto({
     *     get_data: function(callback) {
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: ['get_data', 'make_folder', function(results, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(results, callback) {
     *         // once the file is written let's email a link to it...
     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *     }]
     * }, function(err, results) {
     *     if (err) {
     *         console.log('err = ', err);
     *     }
     *     console.log('results = ', results);
     *     // results = {
     *     //     get_data: ['data', 'converted to array']
     *     //     make_folder; 'folder',
     *     //     write_file: 'filename'
     *     //     email_link: { file: 'filename', email: 'user@example.com' }
     *     // }
     * });
     *
     * //Using Promises
     * async.auto({
     *     get_data: function(callback) {
     *         console.log('in get_data');
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         console.log('in make_folder');
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: ['get_data', 'make_folder', function(results, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(results, callback) {
     *         // once the file is written let's email a link to it...
     *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *     }]
     * }).then(results => {
     *     console.log('results = ', results);
     *     // results = {
     *     //     get_data: ['data', 'converted to array']
     *     //     make_folder; 'folder',
     *     //     write_file: 'filename'
     *     //     email_link: { file: 'filename', email: 'user@example.com' }
     *     // }
     * }).catch(err => {
     *     console.log('err = ', err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.auto({
     *             get_data: function(callback) {
     *                 // async code to get some data
     *                 callback(null, 'data', 'converted to array');
     *             },
     *             make_folder: function(callback) {
     *                 // async code to create a directory to store a file in
     *                 // this is run at the same time as getting the data
     *                 callback(null, 'folder');
     *             },
     *             write_file: ['get_data', 'make_folder', function(results, callback) {
     *                 // once there is some data and the directory exists,
     *                 // write the data to a file in the directory
     *                 callback(null, 'filename');
     *             }],
     *             email_link: ['write_file', function(results, callback) {
     *                 // once the file is written let's email a link to it...
     *                 callback(null, {'file':results.write_file, 'email':'user@example.com'});
     *             }]
     *         });
     *         console.log('results = ', results);
     *         // results = {
     *         //     get_data: ['data', 'converted to array']
     *         //     make_folder; 'folder',
     *         //     write_file: 'filename'
     *         //     email_link: { file: 'filename', email: 'user@example.com' }
     *         // }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function auto(tasks,concurrency,callback){if(typeof concurrency!=='number'){// concurrency is optional, shift the args.
callback=concurrency;concurrency=null;}callback=once(callback||promiseCallback());var numTasks=Object.keys(tasks).length;if(!numTasks){return callback(null);}if(!concurrency){concurrency=numTasks;}var results={};var runningTasks=0;var canceled=false;var hasError=false;var listeners=Object.create(null);var readyTasks=[];// for cycle detection:
var readyToCheck=[];// tasks that have been identified as reachable
// without the possibility of returning to an ancestor task
var uncheckedDependencies={};Object.keys(tasks).forEach(key=>{var task=tasks[key];if(!Array.isArray(task)){// no dependencies
enqueueTask(key,[task]);readyToCheck.push(key);return;}var dependencies=task.slice(0,task.length-1);var remainingDependencies=dependencies.length;if(remainingDependencies===0){enqueueTask(key,task);readyToCheck.push(key);return;}uncheckedDependencies[key]=remainingDependencies;dependencies.forEach(dependencyName=>{if(!tasks[dependencyName]){throw new Error('async.auto task `'+key+'` has a non-existent dependency `'+dependencyName+'` in '+dependencies.join(', '));}addListener(dependencyName,()=>{remainingDependencies--;if(remainingDependencies===0){enqueueTask(key,task);}});});});checkForDeadlocks();processQueue();function enqueueTask(key,task){readyTasks.push(()=>runTask(key,task));}function processQueue(){if(canceled)return;if(readyTasks.length===0&&runningTasks===0){return callback(null,results);}while(readyTasks.length&&runningTasks<concurrency){var run=readyTasks.shift();run();}}function addListener(taskName,fn){var taskListeners=listeners[taskName];if(!taskListeners){taskListeners=listeners[taskName]=[];}taskListeners.push(fn);}function taskComplete(taskName){var taskListeners=listeners[taskName]||[];taskListeners.forEach(fn=>fn());processQueue();}function runTask(key,task){if(hasError)return;var taskCallback=onlyOnce((err,...result)=>{runningTasks--;if(err===false){canceled=true;return;}if(result.length<2){[result]=result;}if(err){var safeResults={};Object.keys(results).forEach(rkey=>{safeResults[rkey]=results[rkey];});safeResults[key]=result;hasError=true;listeners=Object.create(null);if(canceled)return;callback(err,safeResults);}else{results[key]=result;taskComplete(key);}});runningTasks++;var taskFn=wrapAsync(task[task.length-1]);if(task.length>1){taskFn(results,taskCallback);}else{taskFn(taskCallback);}}function checkForDeadlocks(){// Kahn's algorithm
// https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
// http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
var currentTask;var counter=0;while(readyToCheck.length){currentTask=readyToCheck.pop();counter++;getDependents(currentTask).forEach(dependent=>{if(--uncheckedDependencies[dependent]===0){readyToCheck.push(dependent);}});}if(counter!==numTasks){throw new Error('async.auto cannot execute tasks due to a recursive dependency');}}function getDependents(taskName){var result=[];Object.keys(tasks).forEach(key=>{const task=tasks[key];if(Array.isArray(task)&&task.indexOf(taskName)>=0){result.push(key);}});return result;}return callback[PROMISE_SYMBOL];}var FN_ARGS=/^(?:async\s+)?(?:function)?\s*\w*\s*\(\s*([^)]+)\s*\)(?:\s*{)/;var ARROW_FN_ARGS=/^(?:async\s+)?\(?\s*([^)=]+)\s*\)?(?:\s*=>)/;var FN_ARG_SPLIT=/,/;var FN_ARG=/(=.+)?(\s*)$/;function stripComments(string){let stripped='';let index=0;let endBlockComment=string.indexOf('*/');while(index<string.length){if(string[index]==='/'&&string[index+1]==='/'){// inline comment
let endIndex=string.indexOf('\n',index);index=endIndex===-1?string.length:endIndex;}else if(endBlockComment!==-1&&string[index]==='/'&&string[index+1]==='*'){// block comment
let endIndex=string.indexOf('*/',index);if(endIndex!==-1){index=endIndex+2;endBlockComment=string.indexOf('*/',index);}else{stripped+=string[index];index++;}}else{stripped+=string[index];index++;}}return stripped;}function parseParams(func){const src=stripComments(func.toString());let match=src.match(FN_ARGS);if(!match){match=src.match(ARROW_FN_ARGS);}if(!match)throw new Error('could not parse args in autoInject\nSource:\n'+src);let[,args]=match;return args.replace(/\s/g,'').split(FN_ARG_SPLIT).map(arg=>arg.replace(FN_ARG,'').trim());}/**
     * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
     * tasks are specified as parameters to the function, after the usual callback
     * parameter, with the parameter names matching the names of the tasks it
     * depends on. This can provide even more readable task graphs which can be
     * easier to maintain.
     *
     * If a final callback is specified, the task results are similarly injected,
     * specified as named parameters after the initial error parameter.
     *
     * The autoInject function is purely syntactic sugar and its semantics are
     * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
     *
     * @name autoInject
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.auto]{@link module:ControlFlow.auto}
     * @category Control Flow
     * @param {Object} tasks - An object, each of whose properties is an {@link AsyncFunction} of
     * the form 'func([dependencies...], callback). The object's key of a property
     * serves as the name of the task defined by that property, i.e. can be used
     * when specifying requirements for other tasks.
     * * The `callback` parameter is a `callback(err, result)` which must be called
     *   when finished, passing an `error` (which can be `null`) and the result of
     *   the function's execution. The remaining parameters name other tasks on
     *   which the task is dependent, and the results from those tasks are the
     *   arguments of those parameters.
     * @param {Function} [callback] - An optional callback which is called when all
     * the tasks have been completed. It receives the `err` argument if any `tasks`
     * pass an error to their callback, and a `results` object with any completed
     * task results, similar to `auto`.
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * //  The example from `auto` can be rewritten as follows:
     * async.autoInject({
     *     get_data: function(callback) {
     *         // async code to get some data
     *         callback(null, 'data', 'converted to array');
     *     },
     *     make_folder: function(callback) {
     *         // async code to create a directory to store a file in
     *         // this is run at the same time as getting the data
     *         callback(null, 'folder');
     *     },
     *     write_file: function(get_data, make_folder, callback) {
     *         // once there is some data and the directory exists,
     *         // write the data to a file in the directory
     *         callback(null, 'filename');
     *     },
     *     email_link: function(write_file, callback) {
     *         // once the file is written let's email a link to it...
     *         // write_file contains the filename returned by write_file.
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     *
     * // If you are using a JS minifier that mangles parameter names, `autoInject`
     * // will not work with plain functions, since the parameter names will be
     * // collapsed to a single letter identifier.  To work around this, you can
     * // explicitly specify the names of the parameters your task function needs
     * // in an array, similar to Angular.js dependency injection.
     *
     * // This still has an advantage over plain `auto`, since the results a task
     * // depends on are still spread into arguments.
     * async.autoInject({
     *     //...
     *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
     *         callback(null, 'filename');
     *     }],
     *     email_link: ['write_file', function(write_file, callback) {
     *         callback(null, {'file':write_file, 'email':'user@example.com'});
     *     }]
     *     //...
     * }, function(err, results) {
     *     console.log('err = ', err);
     *     console.log('email_link = ', results.email_link);
     * });
     */function autoInject(tasks,callback){var newTasks={};Object.keys(tasks).forEach(key=>{var taskFn=tasks[key];var params;var fnIsAsync=isAsync(taskFn);var hasNoDeps=!fnIsAsync&&taskFn.length===1||fnIsAsync&&taskFn.length===0;if(Array.isArray(taskFn)){params=[...taskFn];taskFn=params.pop();newTasks[key]=params.concat(params.length>0?newTask:taskFn);}else if(hasNoDeps){// no dependencies, use the function as-is
newTasks[key]=taskFn;}else{params=parseParams(taskFn);if(taskFn.length===0&&!fnIsAsync&&params.length===0){throw new Error("autoInject task functions require explicit parameters.");}// remove callback param
if(!fnIsAsync)params.pop();newTasks[key]=params.concat(newTask);}function newTask(results,taskCb){var newArgs=params.map(name=>results[name]);newArgs.push(taskCb);wrapAsync(taskFn)(...newArgs);}});return auto(newTasks,callback);}// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
class DLL{constructor(){this.head=this.tail=null;this.length=0;}removeLink(node){if(node.prev)node.prev.next=node.next;else this.head=node.next;if(node.next)node.next.prev=node.prev;else this.tail=node.prev;node.prev=node.next=null;this.length-=1;return node;}empty(){while(this.head)this.shift();return this;}insertAfter(node,newNode){newNode.prev=node;newNode.next=node.next;if(node.next)node.next.prev=newNode;else this.tail=newNode;node.next=newNode;this.length+=1;}insertBefore(node,newNode){newNode.prev=node.prev;newNode.next=node;if(node.prev)node.prev.next=newNode;else this.head=newNode;node.prev=newNode;this.length+=1;}unshift(node){if(this.head)this.insertBefore(this.head,node);else setInitial(this,node);}push(node){if(this.tail)this.insertAfter(this.tail,node);else setInitial(this,node);}shift(){return this.head&&this.removeLink(this.head);}pop(){return this.tail&&this.removeLink(this.tail);}toArray(){return[...this];}*[Symbol.iterator](){var cur=this.head;while(cur){yield cur.data;cur=cur.next;}}remove(testFn){var curr=this.head;while(curr){var{next}=curr;if(testFn(curr)){this.removeLink(curr);}curr=next;}return this;}}function setInitial(dll,node){dll.length=1;dll.head=dll.tail=node;}function queue(worker,concurrency,payload){if(concurrency==null){concurrency=1;}else if(concurrency===0){throw new RangeError('Concurrency must not be zero');}var _worker=wrapAsync(worker);var numRunning=0;var workersList=[];const events={error:[],drain:[],saturated:[],unsaturated:[],empty:[]};function on(event,handler){events[event].push(handler);}function once(event,handler){const handleAndRemove=(...args)=>{off(event,handleAndRemove);handler(...args);};events[event].push(handleAndRemove);}function off(event,handler){if(!event)return Object.keys(events).forEach(ev=>events[ev]=[]);if(!handler)return events[event]=[];events[event]=events[event].filter(ev=>ev!==handler);}function trigger(event,...args){events[event].forEach(handler=>handler(...args));}var processingScheduled=false;function _insert(data,insertAtFront,rejectOnError,callback){if(callback!=null&&typeof callback!=='function'){throw new Error('task callback must be a function');}q.started=true;var res,rej;function promiseCallback(err,...args){// we don't care about the error, let the global error handler
// deal with it
if(err)return rejectOnError?rej(err):res();if(args.length<=1)return res(args[0]);res(args);}var item=q._createTaskItem(data,rejectOnError?promiseCallback:callback||promiseCallback);if(insertAtFront){q._tasks.unshift(item);}else{q._tasks.push(item);}if(!processingScheduled){processingScheduled=true;setImmediate$1(()=>{processingScheduled=false;q.process();});}if(rejectOnError||!callback){return new Promise((resolve,reject)=>{res=resolve;rej=reject;});}}function _createCB(tasks){return function(err,...args){numRunning-=1;for(var i=0,l=tasks.length;i<l;i++){var task=tasks[i];var index=workersList.indexOf(task);if(index===0){workersList.shift();}else if(index>0){workersList.splice(index,1);}task.callback(err,...args);if(err!=null){trigger('error',err,task.data);}}if(numRunning<=q.concurrency-q.buffer){trigger('unsaturated');}if(q.idle()){trigger('drain');}q.process();};}function _maybeDrain(data){if(data.length===0&&q.idle()){// call drain immediately if there are no tasks
setImmediate$1(()=>trigger('drain'));return true;}return false;}const eventMethod=name=>handler=>{if(!handler){return new Promise((resolve,reject)=>{once(name,(err,data)=>{if(err)return reject(err);resolve(data);});});}off(name);on(name,handler);};var isProcessing=false;var q={_tasks:new DLL(),_createTaskItem(data,callback){return{data,callback};},*[Symbol.iterator](){yield*q._tasks[Symbol.iterator]();},concurrency,payload,buffer:concurrency/4,started:false,paused:false,push(data,callback){if(Array.isArray(data)){if(_maybeDrain(data))return;return data.map(datum=>_insert(datum,false,false,callback));}return _insert(data,false,false,callback);},pushAsync(data,callback){if(Array.isArray(data)){if(_maybeDrain(data))return;return data.map(datum=>_insert(datum,false,true,callback));}return _insert(data,false,true,callback);},kill(){off();q._tasks.empty();},unshift(data,callback){if(Array.isArray(data)){if(_maybeDrain(data))return;return data.map(datum=>_insert(datum,true,false,callback));}return _insert(data,true,false,callback);},unshiftAsync(data,callback){if(Array.isArray(data)){if(_maybeDrain(data))return;return data.map(datum=>_insert(datum,true,true,callback));}return _insert(data,true,true,callback);},remove(testFn){q._tasks.remove(testFn);},process(){// Avoid trying to start too many processing operations. This can occur
// when callbacks resolve synchronously (#1267).
if(isProcessing){return;}isProcessing=true;while(!q.paused&&numRunning<q.concurrency&&q._tasks.length){var tasks=[],data=[];var l=q._tasks.length;if(q.payload)l=Math.min(l,q.payload);for(var i=0;i<l;i++){var node=q._tasks.shift();tasks.push(node);workersList.push(node);data.push(node.data);}numRunning+=1;if(q._tasks.length===0){trigger('empty');}if(numRunning===q.concurrency){trigger('saturated');}var cb=onlyOnce(_createCB(tasks));_worker(data,cb);}isProcessing=false;},length(){return q._tasks.length;},running(){return numRunning;},workersList(){return workersList;},idle(){return q._tasks.length+numRunning===0;},pause(){q.paused=true;},resume(){if(q.paused===false){return;}q.paused=false;setImmediate$1(q.process);}};// define these as fixed properties, so people get useful errors when updating
Object.defineProperties(q,{saturated:{writable:false,value:eventMethod('saturated')},unsaturated:{writable:false,value:eventMethod('unsaturated')},empty:{writable:false,value:eventMethod('empty')},drain:{writable:false,value:eventMethod('drain')},error:{writable:false,value:eventMethod('error')}});return q;}/**
     * Creates a `cargo` object with the specified payload. Tasks added to the
     * cargo will be processed altogether (up to the `payload` limit). If the
     * `worker` is in progress, the task is queued until it becomes available. Once
     * the `worker` has completed some tasks, each callback of those tasks is
     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
     * for how `cargo` and `queue` work.
     *
     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
     * at a time, cargo passes an array of tasks to a single worker, repeating
     * when the worker is finished.
     *
     * @name cargo
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {AsyncFunction} worker - An asynchronous function for processing an array
     * of queued tasks. Invoked with `(tasks, callback)`.
     * @param {number} [payload=Infinity] - An optional `integer` for determining
     * how many tasks should be processed per round; if omitted, the default is
     * unlimited.
     * @returns {module:ControlFlow.QueueObject} A cargo object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the cargo and inner queue.
     * @example
     *
     * // create a cargo object with payload 2
     * var cargo = async.cargo(function(tasks, callback) {
     *     for (var i=0; i<tasks.length; i++) {
     *         console.log('hello ' + tasks[i].name);
     *     }
     *     callback();
     * }, 2);
     *
     * // add some items
     * cargo.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * cargo.push({name: 'bar'}, function(err) {
     *     console.log('finished processing bar');
     * });
     * await cargo.push({name: 'baz'});
     * console.log('finished processing baz');
     */function cargo(worker,payload){return queue(worker,1,payload);}/**
     * Creates a `cargoQueue` object with the specified payload. Tasks added to the
     * cargoQueue will be processed together (up to the `payload` limit) in `concurrency` parallel workers.
     * If the all `workers` are in progress, the task is queued until one becomes available. Once
     * a `worker` has completed some tasks, each callback of those tasks is
     * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
     * for how `cargo` and `queue` work.
     *
     * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
     * at a time, and [`cargo`]{@link module:ControlFlow.cargo} passes an array of tasks to a single worker,
     * the cargoQueue passes an array of tasks to multiple parallel workers.
     *
     * @name cargoQueue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @see [async.cargo]{@link module:ControlFLow.cargo}
     * @category Control Flow
     * @param {AsyncFunction} worker - An asynchronous function for processing an array
     * of queued tasks. Invoked with `(tasks, callback)`.
     * @param {number} [concurrency=1] - An `integer` for determining how many
     * `worker` functions should be run in parallel.  If omitted, the concurrency
     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
     * @param {number} [payload=Infinity] - An optional `integer` for determining
     * how many tasks should be processed per round; if omitted, the default is
     * unlimited.
     * @returns {module:ControlFlow.QueueObject} A cargoQueue object to manage the tasks. Callbacks can
     * attached as certain properties to listen for specific events during the
     * lifecycle of the cargoQueue and inner queue.
     * @example
     *
     * // create a cargoQueue object with payload 2 and concurrency 2
     * var cargoQueue = async.cargoQueue(function(tasks, callback) {
     *     for (var i=0; i<tasks.length; i++) {
     *         console.log('hello ' + tasks[i].name);
     *     }
     *     callback();
     * }, 2, 2);
     *
     * // add some items
     * cargoQueue.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * cargoQueue.push({name: 'bar'}, function(err) {
     *     console.log('finished processing bar');
     * });
     * cargoQueue.push({name: 'baz'}, function(err) {
     *     console.log('finished processing baz');
     * });
     * cargoQueue.push({name: 'boo'}, function(err) {
     *     console.log('finished processing boo');
     * });
     */function cargo$1(worker,concurrency,payload){return queue(worker,concurrency,payload);}/**
     * Reduces `coll` into a single value using an async `iteratee` to return each
     * successive step. `memo` is the initial state of the reduction. This function
     * only operates in series.
     *
     * For performance reasons, it may make sense to split a call to this function
     * into a parallel map, and then use the normal `Array.prototype.reduce` on the
     * results. This function is for situations where each step in the reduction
     * needs to be async; if you can get the data before reducing it, then it's
     * probably a good idea to do so.
     *
     * @name reduce
     * @static
     * @memberOf module:Collections
     * @method
     * @alias inject
     * @alias foldl
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction.
     * The `iteratee` should complete with the next state of the reduction.
     * If the iteratee completes with an error, the reduction is stopped and the
     * main `callback` is immediately called with the error.
     * Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file3.txt', 'file4.txt'];
     *
     * // asynchronous function that computes the file size in bytes
     * // file size is added to the memoized value, then returned
     * function getFileSizeInBytes(memo, file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, memo + stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.reduce(fileList, 0, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // 6000
     *         // which is the sum of the file sizes of the three files
     *     }
     * });
     *
     * // Error Handling
     * async.reduce(withMissingFileList, 0, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(result);
     *     }
     * });
     *
     * // Using Promises
     * async.reduce(fileList, 0, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     *     // 6000
     *     // which is the sum of the file sizes of the three files
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.reduce(withMissingFileList, 0, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.reduce(fileList, 0, getFileSizeInBytes);
     *         console.log(result);
     *         // 6000
     *         // which is the sum of the file sizes of the three files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let result = await async.reduce(withMissingFileList, 0, getFileSizeInBytes);
     *         console.log(result);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */function reduce(coll,memo,iteratee,callback){callback=once(callback);var _iteratee=wrapAsync(iteratee);return eachOfSeries$1(coll,(x,i,iterCb)=>{_iteratee(memo,x,(err,v)=>{memo=v;iterCb(err);});},err=>callback(err,memo));}var reduce$1=awaitify(reduce,4);/**
     * Version of the compose function that is more natural to read. Each function
     * consumes the return value of the previous function. It is the equivalent of
     * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name seq
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.compose]{@link module:ControlFlow.compose}
     * @category Control Flow
     * @param {...AsyncFunction} functions - the asynchronous functions to compose
     * @returns {Function} a function that composes the `functions` in order
     * @example
     *
     * // Requires lodash (or underscore), express3 and dresende's orm2.
     * // Part of an app, that fetches cats of the logged user.
     * // This example uses `seq` function to avoid overnesting and error
     * // handling clutter.
     * app.get('/cats', function(request, response) {
     *     var User = request.models.User;
     *     async.seq(
     *         User.get.bind(User),  // 'User.get' has signature (id, callback(err, data))
     *         function(user, fn) {
     *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
     *         }
     *     )(req.session.user_id, function (err, cats) {
     *         if (err) {
     *             console.error(err);
     *             response.json({ status: 'error', message: err.message });
     *         } else {
     *             response.json({ status: 'ok', message: 'Cats found', data: cats });
     *         }
     *     });
     * });
     */function seq(...functions){var _functions=functions.map(wrapAsync);return function(...args){var that=this;var cb=args[args.length-1];if(typeof cb=='function'){args.pop();}else{cb=promiseCallback();}reduce$1(_functions,args,(newargs,fn,iterCb)=>{fn.apply(that,newargs.concat((err,...nextargs)=>{iterCb(err,nextargs);}));},(err,results)=>cb(err,...results));return cb[PROMISE_SYMBOL];};}/**
     * Creates a function which is a composition of the passed asynchronous
     * functions. Each function consumes the return value of the function that
     * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
     * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
     *
     * If the last argument to the composed function is not a function, a promise
     * is returned when you call it.
     *
     * Each function is executed with the `this` binding of the composed function.
     *
     * @name compose
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {...AsyncFunction} functions - the asynchronous functions to compose
     * @returns {Function} an asynchronous function that is the composed
     * asynchronous `functions`
     * @example
     *
     * function add1(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n + 1);
     *     }, 10);
     * }
     *
     * function mul3(n, callback) {
     *     setTimeout(function () {
     *         callback(null, n * 3);
     *     }, 10);
     * }
     *
     * var add1mul3 = async.compose(mul3, add1);
     * add1mul3(4, function (err, result) {
     *     // result now equals 15
     * });
     */function compose(...args){return seq(...args.reverse());}/**
     * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
     *
     * @name mapLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with the transformed item.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Results is an array of the
     * transformed items from the `coll`. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */function mapLimit(coll,limit,iteratee,callback){return _asyncMap(eachOfLimit(limit),coll,iteratee,callback);}var mapLimit$1=awaitify(mapLimit,4);/**
     * The same as [`concat`]{@link module:Collections.concat} but runs a maximum of `limit` async operations at a time.
     *
     * @name concatLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.concat]{@link module:Collections.concat}
     * @category Collection
     * @alias flatMapLimit
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
     * which should use an array as its result. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     */function concatLimit(coll,limit,iteratee,callback){var _iteratee=wrapAsync(iteratee);return mapLimit$1(coll,limit,(val,iterCb)=>{_iteratee(val,(err,...args)=>{if(err)return iterCb(err);return iterCb(err,args);});},(err,mapResults)=>{var result=[];for(var i=0;i<mapResults.length;i++){if(mapResults[i]){result=result.concat(...mapResults[i]);}}return callback(err,result);});}var concatLimit$1=awaitify(concatLimit,4);/**
     * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
     * the concatenated list. The `iteratee`s are called in parallel, and the
     * results are concatenated as they return. The results array will be returned in
     * the original order of `coll` passed to the `iteratee` function.
     *
     * @name concat
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @alias flatMap
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`,
     * which should use an array as its result. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * let directoryList = ['dir1','dir2','dir3'];
     * let withMissingDirectoryList = ['dir1','dir2','dir3', 'dir4'];
     *
     * // Using callbacks
     * async.concat(directoryList, fs.readdir, function(err, results) {
     *    if (err) {
     *        console.log(err);
     *    } else {
     *        console.log(results);
     *        // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     *    }
     * });
     *
     * // Error Handling
     * async.concat(withMissingDirectoryList, fs.readdir, function(err, results) {
     *    if (err) {
     *        console.log(err);
     *        // [ Error: ENOENT: no such file or directory ]
     *        // since dir4 does not exist
     *    } else {
     *        console.log(results);
     *    }
     * });
     *
     * // Using Promises
     * async.concat(directoryList, fs.readdir)
     * .then(results => {
     *     console.log(results);
     *     // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     * }).catch(err => {
     *      console.log(err);
     * });
     *
     * // Error Handling
     * async.concat(withMissingDirectoryList, fs.readdir)
     * .then(results => {
     *     console.log(results);
     * }).catch(err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4 does not exist
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.concat(directoryList, fs.readdir);
     *         console.log(results);
     *         // [ 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', file5.txt ]
     *     } catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let results = await async.concat(withMissingDirectoryList, fs.readdir);
     *         console.log(results);
     *     } catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *         // since dir4 does not exist
     *     }
     * }
     *
     */function concat(coll,iteratee,callback){return concatLimit$1(coll,Infinity,iteratee,callback);}var concat$1=awaitify(concat,3);/**
     * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
     *
     * @name concatSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.concat]{@link module:Collections.concat}
     * @category Collection
     * @alias flatMapSeries
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each item in `coll`.
     * The iteratee should complete with an array an array of results.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is an array
     * containing the concatenated results of the `iteratee` function. Invoked with
     * (err, results).
     * @returns A Promise, if no callback is passed
     */function concatSeries(coll,iteratee,callback){return concatLimit$1(coll,1,iteratee,callback);}var concatSeries$1=awaitify(concatSeries,3);/**
     * Returns a function that when called, calls-back with the values provided.
     * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
     * [`auto`]{@link module:ControlFlow.auto}.
     *
     * @name constant
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {...*} arguments... - Any number of arguments to automatically invoke
     * callback with.
     * @returns {AsyncFunction} Returns a function that when invoked, automatically
     * invokes the callback with the previous given arguments.
     * @example
     *
     * async.waterfall([
     *     async.constant(42),
     *     function (value, next) {
     *         // value === 42
     *     },
     *     //...
     * ], callback);
     *
     * async.waterfall([
     *     async.constant(filename, "utf8"),
     *     fs.readFile,
     *     function (fileData, next) {
     *         //...
     *     }
     *     //...
     * ], callback);
     *
     * async.auto({
     *     hostname: async.constant("https://server.net/"),
     *     port: findFreePort,
     *     launchServer: ["hostname", "port", function (options, cb) {
     *         startServer(options, cb);
     *     }],
     *     //...
     * }, callback);
     */function constant(...args){return function(...ignoredArgs/*, callback*/){var callback=ignoredArgs.pop();return callback(null,...args);};}function _createTester(check,getResult){return(eachfn,arr,_iteratee,cb)=>{var testPassed=false;var testResult;const iteratee=wrapAsync(_iteratee);eachfn(arr,(value,_,callback)=>{iteratee(value,(err,result)=>{if(err||err===false)return callback(err);if(check(result)&&!testResult){testPassed=true;testResult=getResult(true,value);return callback(null,breakLoop);}callback();});},err=>{if(err)return cb(err);cb(null,testPassed?testResult:getResult(false));});};}/**
     * Returns the first value in `coll` that passes an async truth test. The
     * `iteratee` is applied in parallel, meaning the first iteratee to return
     * `true` will fire the detect `callback` with that result. That means the
     * result might not be the first item in the original `coll` (in terms of order)
     * that passes the test.

     * If order within the original `coll` is important, then look at
     * [`detectSeries`]{@link module:Collections.detectSeries}.
     *
     * @name detect
     * @static
     * @memberOf module:Collections
     * @method
     * @alias find
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // dir1/file1.txt
     *        // result now equals the first file in the list that exists
     *    }
     *);
     *
     * // Using Promises
     * async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists)
     * .then(result => {
     *     console.log(result);
     *     // dir1/file1.txt
     *     // result now equals the first file in the list that exists
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.detect(['file3.txt','file2.txt','dir1/file1.txt'], fileExists);
     *         console.log(result);
     *         // dir1/file1.txt
     *         // result now equals the file in the list that exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function detect(coll,iteratee,callback){return _createTester(bool=>bool,(res,item)=>item)(eachOf$1,coll,iteratee,callback);}var detect$1=awaitify(detect,3);/**
     * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name detectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findLimit
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     */function detectLimit(coll,limit,iteratee,callback){return _createTester(bool=>bool,(res,item)=>item)(eachOfLimit(limit),coll,iteratee,callback);}var detectLimit$1=awaitify(detectLimit,4);/**
     * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
     *
     * @name detectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.detect]{@link module:Collections.detect}
     * @alias findSeries
     * @category Collections
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A truth test to apply to each item in `coll`.
     * The iteratee must complete with a boolean value as its result.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the `iteratee` functions have finished.
     * Result will be the first item in the array that passes the truth test
     * (iteratee) or the value `undefined` if none passed. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     */function detectSeries(coll,iteratee,callback){return _createTester(bool=>bool,(res,item)=>item)(eachOfLimit(1),coll,iteratee,callback);}var detectSeries$1=awaitify(detectSeries,3);function consoleFunc(name){return(fn,...args)=>wrapAsync(fn)(...args,(err,...resultArgs)=>{/* istanbul ignore else */if(typeof console==='object'){/* istanbul ignore else */if(err){/* istanbul ignore else */if(console.error){console.error(err);}}else if(console[name]){/* istanbul ignore else */resultArgs.forEach(x=>console[name](x));}}});}/**
     * Logs the result of an [`async` function]{@link AsyncFunction} to the
     * `console` using `console.dir` to display the properties of the resulting object.
     * Only works in Node.js or in browsers that support `console.dir` and
     * `console.error` (such as FF and Chrome).
     * If multiple arguments are returned from the async function,
     * `console.dir` is called on each argument in order.
     *
     * @name dir
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} function - The function you want to eventually apply
     * all arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, {hello: name});
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.dir(hello, 'world');
     * {hello: 'world'}
     */var dir=consoleFunc('dir');/**
     * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
     * the order of operations, the arguments `test` and `iteratee` are switched.
     *
     * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
     *
     * @name doWhilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {AsyncFunction} iteratee - A function which is called each time `test`
     * passes. Invoked with (callback).
     * @param {AsyncFunction} test - asynchronous truth test to perform after each
     * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
     * non-error args from the previous callback of `iteratee`.
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped.
     * `callback` will be passed an error and any arguments passed to the final
     * `iteratee`'s callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     */function doWhilst(iteratee,test,callback){callback=onlyOnce(callback);var _fn=wrapAsync(iteratee);var _test=wrapAsync(test);var results;function next(err,...args){if(err)return callback(err);if(err===false)return;results=args;_test(...args,check);}function check(err,truth){if(err)return callback(err);if(err===false)return;if(!truth)return callback(null,...results);_fn(next);}return check(null,true);}var doWhilst$1=awaitify(doWhilst,3);/**
     * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
     * argument ordering differs from `until`.
     *
     * @name doUntil
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
     * @category Control Flow
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` fails. Invoked with (callback).
     * @param {AsyncFunction} test - asynchronous truth test to perform after each
     * execution of `iteratee`. Invoked with (...args, callback), where `...args` are the
     * non-error args from the previous callback of `iteratee`
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     */function doUntil(iteratee,test,callback){const _test=wrapAsync(test);return doWhilst$1(iteratee,(...args)=>{const cb=args.pop();_test(...args,(err,truth)=>cb(err,!truth));},callback);}function _withoutIndex(iteratee){return(value,index,callback)=>iteratee(value,callback);}/**
     * Applies the function `iteratee` to each item in `coll`, in parallel.
     * The `iteratee` is called with an item from the list, and a callback for when
     * it has finished. If the `iteratee` passes an error to its `callback`, the
     * main `callback` (for the `each` function) is immediately called with the
     * error.
     *
     * Note, that since this function applies `iteratee` to each item in parallel,
     * there is no guarantee that the iteratee functions will complete in order.
     *
     * @name each
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEach
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to
     * each item in `coll`. Invoked with (item, callback).
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOf`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const fileList = [ 'dir1/file2.txt', 'dir2/file3.txt', 'dir/file5.txt'];
     * const withMissingFileList = ['dir1/file1.txt', 'dir4/file2.txt'];
     *
     * // asynchronous function that deletes a file
     * const deleteFile = function(file, callback) {
     *     fs.unlink(file, callback);
     * };
     *
     * // Using callbacks
     * async.each(fileList, deleteFile, function(err) {
     *     if( err ) {
     *         console.log(err);
     *     } else {
     *         console.log('All files have been deleted successfully');
     *     }
     * });
     *
     * // Error Handling
     * async.each(withMissingFileList, deleteFile, function(err){
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using Promises
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         await async.each(files, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         await async.each(withMissingFileList, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *         // since dir4/file2.txt does not exist
     *         // dir1/file1.txt could have been deleted
     *     }
     * }
     *
     */function eachLimit(coll,iteratee,callback){return eachOf$1(coll,_withoutIndex(wrapAsync(iteratee)),callback);}var each=awaitify(eachLimit,3);/**
     * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
     *
     * @name eachLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOfLimit`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */function eachLimit$1(coll,limit,iteratee,callback){return eachOfLimit(limit)(coll,_withoutIndex(wrapAsync(iteratee)),callback);}var eachLimit$2=awaitify(eachLimit$1,4);/**
     * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
     *
     * Note, that unlike [`each`]{@link module:Collections.each}, this function applies iteratee to each item
     * in series and therefore the iteratee functions will complete in order.

     * @name eachSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.each]{@link module:Collections.each}
     * @alias forEachSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each
     * item in `coll`.
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOfSeries`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */function eachSeries(coll,iteratee,callback){return eachLimit$2(coll,1,iteratee,callback);}var eachSeries$1=awaitify(eachSeries,3);/**
     * Wrap an async function and ensure it calls its callback on a later tick of
     * the event loop.  If the function already calls its callback on a next tick,
     * no extra deferral is added. This is useful for preventing stack overflows
     * (`RangeError: Maximum call stack size exceeded`) and generally keeping
     * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
     * contained. ES2017 `async` functions are returned as-is -- they are immune
     * to Zalgo's corrupting influences, as they always resolve on a later tick.
     *
     * @name ensureAsync
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - an async function, one that expects a node-style
     * callback as its last argument.
     * @returns {AsyncFunction} Returns a wrapped function with the exact same call
     * signature as the function passed in.
     * @example
     *
     * function sometimesAsync(arg, callback) {
     *     if (cache[arg]) {
     *         return callback(null, cache[arg]); // this would be synchronous!!
     *     } else {
     *         doSomeIO(arg, callback); // this IO would be asynchronous
     *     }
     * }
     *
     * // this has a risk of stack overflows if many results are cached in a row
     * async.mapSeries(args, sometimesAsync, done);
     *
     * // this will defer sometimesAsync's callback if necessary,
     * // preventing stack overflows
     * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
     */function ensureAsync(fn){if(isAsync(fn))return fn;return function(...args/*, callback*/){var callback=args.pop();var sync=true;args.push((...innerArgs)=>{if(sync){setImmediate$1(()=>callback(...innerArgs));}else{callback(...innerArgs);}});fn.apply(this,args);sync=false;};}/**
     * Returns `true` if every element in `coll` satisfies an async test. If any
     * iteratee call returns `false`, the main `callback` is immediately called.
     *
     * @name every
     * @static
     * @memberOf module:Collections
     * @method
     * @alias all
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in parallel.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file5.txt'];
     * const withMissingFileList = ['file1.txt','file2.txt','file4.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.every(fileList, fileExists, function(err, result) {
     *     console.log(result);
     *     // true
     *     // result is true since every file exists
     * });
     *
     * async.every(withMissingFileList, fileExists, function(err, result) {
     *     console.log(result);
     *     // false
     *     // result is false since NOT every file exists
     * });
     *
     * // Using Promises
     * async.every(fileList, fileExists)
     * .then( result => {
     *     console.log(result);
     *     // true
     *     // result is true since every file exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * async.every(withMissingFileList, fileExists)
     * .then( result => {
     *     console.log(result);
     *     // false
     *     // result is false since NOT every file exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.every(fileList, fileExists);
     *         console.log(result);
     *         // true
     *         // result is true since every file exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * async () => {
     *     try {
     *         let result = await async.every(withMissingFileList, fileExists);
     *         console.log(result);
     *         // false
     *         // result is false since NOT every file exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function every(coll,iteratee,callback){return _createTester(bool=>!bool,res=>!res)(eachOf$1,coll,iteratee,callback);}var every$1=awaitify(every,3);/**
     * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
     *
     * @name everyLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in parallel.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */function everyLimit(coll,limit,iteratee,callback){return _createTester(bool=>!bool,res=>!res)(eachOfLimit(limit),coll,iteratee,callback);}var everyLimit$1=awaitify(everyLimit,4);/**
     * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
     *
     * @name everySeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.every]{@link module:Collections.every}
     * @alias allSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collection in series.
     * The iteratee must complete with a boolean result value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result will be either `true` or `false`
     * depending on the values of the async tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */function everySeries(coll,iteratee,callback){return _createTester(bool=>!bool,res=>!res)(eachOfSeries$1,coll,iteratee,callback);}var everySeries$1=awaitify(everySeries,3);function filterArray(eachfn,arr,iteratee,callback){var truthValues=new Array(arr.length);eachfn(arr,(x,index,iterCb)=>{iteratee(x,(err,v)=>{truthValues[index]=!!v;iterCb(err);});},err=>{if(err)return callback(err);var results=[];for(var i=0;i<arr.length;i++){if(truthValues[i])results.push(arr[i]);}callback(null,results);});}function filterGeneric(eachfn,coll,iteratee,callback){var results=[];eachfn(coll,(x,index,iterCb)=>{iteratee(x,(err,v)=>{if(err)return iterCb(err);if(v){results.push({index,value:x});}iterCb(err);});},err=>{if(err)return callback(err);callback(null,results.sort((a,b)=>a.index-b.index).map(v=>v.value));});}function _filter(eachfn,coll,iteratee,callback){var filter=isArrayLike(coll)?filterArray:filterGeneric;return filter(eachfn,coll,wrapAsync(iteratee),callback);}/**
     * Returns a new array of all the values in `coll` which pass an async truth
     * test. This operation is performed in parallel, but the results array will be
     * in the same order as the original.
     *
     * @name filter
     * @static
     * @memberOf module:Collections
     * @method
     * @alias select
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * const files = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.filter(files, fileExists, function(err, results) {
     *    if(err) {
     *        console.log(err);
     *    } else {
     *        console.log(results);
     *        // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *        // results is now an array of the existing files
     *    }
     * });
     *
     * // Using Promises
     * async.filter(files, fileExists)
     * .then(results => {
     *     console.log(results);
     *     // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *     // results is now an array of the existing files
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.filter(files, fileExists);
     *         console.log(results);
     *         // [ 'dir1/file1.txt', 'dir2/file3.txt' ]
     *         // results is now an array of the existing files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function filter(coll,iteratee,callback){return _filter(eachOf$1,coll,iteratee,callback);}var filter$1=awaitify(filter,3);/**
     * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name filterLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback provided
     */function filterLimit(coll,limit,iteratee,callback){return _filter(eachOfLimit(limit),coll,iteratee,callback);}var filterLimit$1=awaitify(filterLimit,4);/**
     * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
     *
     * @name filterSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @alias selectSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - A truth test to apply to each item in `coll`.
     * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
     * with a boolean argument once it has completed. Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results)
     * @returns {Promise} a promise, if no callback provided
     */function filterSeries(coll,iteratee,callback){return _filter(eachOfSeries$1,coll,iteratee,callback);}var filterSeries$1=awaitify(filterSeries,3);/**
     * Calls the asynchronous function `fn` with a callback parameter that allows it
     * to call itself again, in series, indefinitely.

     * If an error is passed to the callback then `errback` is called with the
     * error, and execution stops, otherwise it will never be called.
     *
     * @name forever
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} fn - an async function to call repeatedly.
     * Invoked with (next).
     * @param {Function} [errback] - when `fn` passes an error to it's callback,
     * this function will be called, and execution stops. Invoked with (err).
     * @returns {Promise} a promise that rejects if an error occurs and an errback
     * is not passed
     * @example
     *
     * async.forever(
     *     function(next) {
     *         // next is suitable for passing to things that need a callback(err [, whatever]);
     *         // it will result in this function being called again.
     *     },
     *     function(err) {
     *         // if next is called with a value in its first parameter, it will appear
     *         // in here as 'err', and execution will stop.
     *     }
     * );
     */function forever(fn,errback){var done=onlyOnce(errback);var task=wrapAsync(ensureAsync(fn));function next(err){if(err)return done(err);if(err===false)return;task(next);}return next();}var forever$1=awaitify(forever,2);/**
     * The same as [`groupBy`]{@link module:Collections.groupBy} but runs a maximum of `limit` async operations at a time.
     *
     * @name groupByLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.groupBy]{@link module:Collections.groupBy}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whoses
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     */function groupByLimit(coll,limit,iteratee,callback){var _iteratee=wrapAsync(iteratee);return mapLimit$1(coll,limit,(val,iterCb)=>{_iteratee(val,(err,key)=>{if(err)return iterCb(err);return iterCb(err,{key,val});});},(err,mapResults)=>{var result={};// from MDN, handle object having an `hasOwnProperty` prop
var{hasOwnProperty}=Object.prototype;for(var i=0;i<mapResults.length;i++){if(mapResults[i]){var{key}=mapResults[i];var{val}=mapResults[i];if(hasOwnProperty.call(result,key)){result[key].push(val);}else{result[key]=[val];}}}return callback(err,result);});}var groupByLimit$1=awaitify(groupByLimit,4);/**
     * Returns a new object, where each value corresponds to an array of items, from
     * `coll`, that returned the corresponding key. That is, the keys of the object
     * correspond to the values passed to the `iteratee` callback.
     *
     * Note: Since this function applies the `iteratee` to each item in parallel,
     * there is no guarantee that the `iteratee` functions will complete in order.
     * However, the values for each key in the `result` will be in the same order as
     * the original `coll`. For Objects, the values will roughly be in the order of
     * the original Objects' keys (but this can vary across JavaScript engines).
     *
     * @name groupBy
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whoses
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const files = ['dir1/file1.txt','dir2','dir4']
     *
     * // asynchronous function that detects file type as none, file, or directory
     * function detectFile(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(null, 'none');
     *         }
     *         callback(null, stat.isDirectory() ? 'directory' : 'file');
     *     });
     * }
     *
     * //Using callbacks
     * async.groupBy(files, detectFile, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *	       console.log(result);
     *         // {
     *         //     file: [ 'dir1/file1.txt' ],
     *         //     none: [ 'dir4' ],
     *         //     directory: [ 'dir2']
     *         // }
     *         // result is object containing the files grouped by type
     *     }
     * });
     *
     * // Using Promises
     * async.groupBy(files, detectFile)
     * .then( result => {
     *     console.log(result);
     *     // {
     *     //     file: [ 'dir1/file1.txt' ],
     *     //     none: [ 'dir4' ],
     *     //     directory: [ 'dir2']
     *     // }
     *     // result is object containing the files grouped by type
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.groupBy(files, detectFile);
     *         console.log(result);
     *         // {
     *         //     file: [ 'dir1/file1.txt' ],
     *         //     none: [ 'dir4' ],
     *         //     directory: [ 'dir2']
     *         // }
     *         // result is object containing the files grouped by type
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function groupBy(coll,iteratee,callback){return groupByLimit$1(coll,Infinity,iteratee,callback);}/**
     * The same as [`groupBy`]{@link module:Collections.groupBy} but runs only a single async operation at a time.
     *
     * @name groupBySeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.groupBy]{@link module:Collections.groupBy}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a `key` to group the value under.
     * Invoked with (value, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Result is an `Object` whose
     * properties are arrays of values which returned the corresponding key.
     * @returns {Promise} a promise, if no callback is passed
     */function groupBySeries(coll,iteratee,callback){return groupByLimit$1(coll,1,iteratee,callback);}/**
     * Logs the result of an `async` function to the `console`. Only works in
     * Node.js or in browsers that support `console.log` and `console.error` (such
     * as FF and Chrome). If multiple arguments are returned from the async
     * function, `console.log` is called on each argument in order.
     *
     * @name log
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} function - The function you want to eventually apply
     * all arguments to.
     * @param {...*} arguments... - Any number of arguments to apply to the function.
     * @example
     *
     * // in a module
     * var hello = function(name, callback) {
     *     setTimeout(function() {
     *         callback(null, 'hello ' + name);
     *     }, 1000);
     * };
     *
     * // in the node repl
     * node> async.log(hello, 'world');
     * 'hello world'
     */var log=consoleFunc('log');/**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name mapValuesLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */function mapValuesLimit(obj,limit,iteratee,callback){callback=once(callback);var newObj={};var _iteratee=wrapAsync(iteratee);return eachOfLimit(limit)(obj,(val,key,next)=>{_iteratee(val,key,(err,result)=>{if(err)return next(err);newObj[key]=result;next(err);});},err=>callback(err,newObj));}var mapValuesLimit$1=awaitify(mapValuesLimit,4);/**
     * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
     *
     * Produces a new Object by mapping each value of `obj` through the `iteratee`
     * function. The `iteratee` is called each `value` and `key` from `obj` and a
     * callback for when it has finished processing. Each of these callbacks takes
     * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
     * passes an error to its callback, the main `callback` (for the `mapValues`
     * function) is immediately called with the error.
     *
     * Note, the order of the keys in the result is not guaranteed.  The keys will
     * be roughly in the order they complete, (but this is very engine-specific)
     *
     * @name mapValues
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     * // file4.txt does not exist
     *
     * const fileMap = {
     *     f1: 'file1.txt',
     *     f2: 'file2.txt',
     *     f3: 'file3.txt'
     * };
     *
     * const withMissingFileMap = {
     *     f1: 'file1.txt',
     *     f2: 'file2.txt',
     *     f3: 'file4.txt'
     * };
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, key, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.mapValues(fileMap, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // result is now a map of file size in bytes for each file, e.g.
     *         // {
     *         //     f1: 1000,
     *         //     f2: 2000,
     *         //     f3: 3000
     *         // }
     *     }
     * });
     *
     * // Error handling
     * async.mapValues(withMissingFileMap, getFileSizeInBytes, function(err, result) {
     *     if (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     } else {
     *         console.log(result);
     *     }
     * });
     *
     * // Using Promises
     * async.mapValues(fileMap, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     *     // result is now a map of file size in bytes for each file, e.g.
     *     // {
     *     //     f1: 1000,
     *     //     f2: 2000,
     *     //     f3: 3000
     *     // }
     * }).catch (err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.mapValues(withMissingFileMap, getFileSizeInBytes)
     * .then( result => {
     *     console.log(result);
     * }).catch (err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.mapValues(fileMap, getFileSizeInBytes);
     *         console.log(result);
     *         // result is now a map of file size in bytes for each file, e.g.
     *         // {
     *         //     f1: 1000,
     *         //     f2: 2000,
     *         //     f3: 3000
     *         // }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         let result = await async.mapValues(withMissingFileMap, getFileSizeInBytes);
     *         console.log(result);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */function mapValues(obj,iteratee,callback){return mapValuesLimit$1(obj,Infinity,iteratee,callback);}/**
     * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
     *
     * @name mapValuesSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.mapValues]{@link module:Collections.mapValues}
     * @category Collection
     * @param {Object} obj - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each value and key
     * in `coll`.
     * The iteratee should complete with the transformed value as its result.
     * Invoked with (value, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. `result` is a new object consisting
     * of each key from `obj`, with each transformed value on the right-hand side.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */function mapValuesSeries(obj,iteratee,callback){return mapValuesLimit$1(obj,1,iteratee,callback);}/**
     * Caches the results of an async function. When creating a hash to store
     * function results against, the callback is omitted from the hash and an
     * optional hash function can be used.
     *
     * **Note: if the async function errs, the result will not be cached and
     * subsequent calls will call the wrapped function.**
     *
     * If no hash function is specified, the first argument is used as a hash key,
     * which may work reasonably if it is a string or a data type that converts to a
     * distinct string. Note that objects and arrays will not behave reasonably.
     * Neither will cases where the other arguments are significant. In such cases,
     * specify your own hash function.
     *
     * The cache of results is exposed as the `memo` property of the function
     * returned by `memoize`.
     *
     * @name memoize
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - The async function to proxy and cache results from.
     * @param {Function} hasher - An optional function for generating a custom hash
     * for storing results. It has all the arguments applied to it apart from the
     * callback, and must be synchronous.
     * @returns {AsyncFunction} a memoized version of `fn`
     * @example
     *
     * var slow_fn = function(name, callback) {
     *     // do something
     *     callback(null, result);
     * };
     * var fn = async.memoize(slow_fn);
     *
     * // fn can now be used as if it were slow_fn
     * fn('some name', function() {
     *     // callback
     * });
     */function memoize(fn,hasher=v=>v){var memo=Object.create(null);var queues=Object.create(null);var _fn=wrapAsync(fn);var memoized=initialParams((args,callback)=>{var key=hasher(...args);if(key in memo){setImmediate$1(()=>callback(null,...memo[key]));}else if(key in queues){queues[key].push(callback);}else{queues[key]=[callback];_fn(...args,(err,...resultArgs)=>{// #1465 don't memoize if an error occurred
if(!err){memo[key]=resultArgs;}var q=queues[key];delete queues[key];for(var i=0,l=q.length;i<l;i++){q[i](err,...resultArgs);}});}});memoized.memo=memo;memoized.unmemoized=fn;return memoized;}/* istanbul ignore file */ /**
     * Calls `callback` on a later loop around the event loop. In Node.js this just
     * calls `process.nextTick`.  In the browser it will use `setImmediate` if
     * available, otherwise `setTimeout(callback, 0)`, which means other higher
     * priority events may precede the execution of `callback`.
     *
     * This is used internally for browser-compatibility purposes.
     *
     * @name nextTick
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.setImmediate]{@link module:Utils.setImmediate}
     * @category Util
     * @param {Function} callback - The function to call on a later loop around
     * the event loop. Invoked with (args...).
     * @param {...*} args... - any number of additional arguments to pass to the
     * callback on the next tick.
     * @example
     *
     * var call_order = [];
     * async.nextTick(function() {
     *     call_order.push('two');
     *     // call_order now equals ['one','two']
     * });
     * call_order.push('one');
     *
     * async.setImmediate(function (a, b, c) {
     *     // a, b, and c equal 1, 2, and 3
     * }, 1, 2, 3);
     */var _defer$1;if(hasNextTick){_defer$1=process.nextTick;}else if(hasSetImmediate){_defer$1=setImmediate;}else{_defer$1=fallback;}var nextTick=wrap(_defer$1);var parallel=awaitify((eachfn,tasks,callback)=>{var results=isArrayLike(tasks)?[]:{};eachfn(tasks,(task,key,taskCb)=>{wrapAsync(task)((err,...result)=>{if(result.length<2){[result]=result;}results[key]=result;taskCb(err);});},err=>callback(err,results));},3);/**
     * Run the `tasks` collection of functions in parallel, without waiting until
     * the previous function has completed. If any of the functions pass an error to
     * its callback, the main `callback` is immediately called with the value of the
     * error. Once the `tasks` have completed, the results are passed to the final
     * `callback` as an array.
     *
     * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
     * parallel execution of code.  If your tasks do not use any timers or perform
     * any I/O, they will actually be executed in series.  Any synchronous setup
     * sections for each task will happen one after the other.  JavaScript remains
     * single-threaded.
     *
     * **Hint:** Use [`reflect`]{@link module:Utils.reflect} to continue the
     * execution of other tasks when a task fails.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     * results from {@link async.parallel}.
     *
     * @name parallel
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
     * [async functions]{@link AsyncFunction} to run.
     * Each async function can complete with any number of optional `result` values.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     *
     * @example
     *
     * //Using Callbacks
     * async.parallel([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ], function(err, results) {
     *     console.log(results);
     *     // results is equal to ['one','two'] even though
     *     // the second function had a shorter timeout.
     * });
     *
     * // an example using an object instead of an array
     * async.parallel({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * });
     *
     * //Using Promises
     * async.parallel([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ]).then(results => {
     *     console.log(results);
     *     // results is equal to ['one','two'] even though
     *     // the second function had a shorter timeout.
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // an example using an object instead of an array
     * async.parallel({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }).then(results => {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.parallel([
     *             function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 'one');
     *                 }, 200);
     *             },
     *             function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 'two');
     *                 }, 100);
     *             }
     *         ]);
     *         console.log(results);
     *         // results is equal to ['one','two'] even though
     *         // the second function had a shorter timeout.
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // an example using an object instead of an array
     * async () => {
     *     try {
     *         let results = await async.parallel({
     *             one: function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 1);
     *                 }, 200);
     *             },
     *            two: function(callback) {
     *                 setTimeout(function() {
     *                     callback(null, 2);
     *                 }, 100);
     *            }
     *         });
     *         console.log(results);
     *         // results is equal to: { one: 1, two: 2 }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function parallel$1(tasks,callback){return parallel(eachOf$1,tasks,callback);}/**
     * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name parallelLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.parallel]{@link module:ControlFlow.parallel}
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection of
     * [async functions]{@link AsyncFunction} to run.
     * Each async function can complete with any number of optional `result` values.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed successfully. This function gets a results array
     * (or object) containing all the result arguments passed to the task callbacks.
     * Invoked with (err, results).
     * @returns {Promise} a promise, if a callback is not passed
     */function parallelLimit(tasks,limit,callback){return parallel(eachOfLimit(limit),tasks,callback);}/**
     * A queue of tasks for the worker function to complete.
     * @typedef {Iterable} QueueObject
     * @memberOf module:ControlFlow
     * @property {Function} length - a function returning the number of items
     * waiting to be processed. Invoke with `queue.length()`.
     * @property {boolean} started - a boolean indicating whether or not any
     * items have been pushed and processed by the queue.
     * @property {Function} running - a function returning the number of items
     * currently being processed. Invoke with `queue.running()`.
     * @property {Function} workersList - a function returning the array of items
     * currently being processed. Invoke with `queue.workersList()`.
     * @property {Function} idle - a function returning false if there are items
     * waiting or being processed, or true if not. Invoke with `queue.idle()`.
     * @property {number} concurrency - an integer for determining how many `worker`
     * functions should be run in parallel. This property can be changed after a
     * `queue` is created to alter the concurrency on-the-fly.
     * @property {number} payload - an integer that specifies how many items are
     * passed to the worker function at a time. only applies if this is a
     * [cargo]{@link module:ControlFlow.cargo} object
     * @property {AsyncFunction} push - add a new task to the `queue`. Calls `callback`
     * once the `worker` has finished processing the task. Instead of a single task,
     * a `tasks` array can be submitted. The respective callback is used for every
     * task in the list. Invoke with `queue.push(task, [callback])`,
     * @property {AsyncFunction} unshift - add a new task to the front of the `queue`.
     * Invoke with `queue.unshift(task, [callback])`.
     * @property {AsyncFunction} pushAsync - the same as `q.push`, except this returns
     * a promise that rejects if an error occurs.
     * @property {AsyncFunction} unshiftAsync - the same as `q.unshift`, except this returns
     * a promise that rejects if an error occurs.
     * @property {Function} remove - remove items from the queue that match a test
     * function.  The test function will be passed an object with a `data` property,
     * and a `priority` property, if this is a
     * [priorityQueue]{@link module:ControlFlow.priorityQueue} object.
     * Invoked with `queue.remove(testFn)`, where `testFn` is of the form
     * `function ({data, priority}) {}` and returns a Boolean.
     * @property {Function} saturated - a function that sets a callback that is
     * called when the number of running workers hits the `concurrency` limit, and
     * further tasks will be queued.  If the callback is omitted, `q.saturated()`
     * returns a promise for the next occurrence.
     * @property {Function} unsaturated - a function that sets a callback that is
     * called when the number of running workers is less than the `concurrency` &
     * `buffer` limits, and further tasks will not be queued. If the callback is
     * omitted, `q.unsaturated()` returns a promise for the next occurrence.
     * @property {number} buffer - A minimum threshold buffer in order to say that
     * the `queue` is `unsaturated`.
     * @property {Function} empty - a function that sets a callback that is called
     * when the last item from the `queue` is given to a `worker`. If the callback
     * is omitted, `q.empty()` returns a promise for the next occurrence.
     * @property {Function} drain - a function that sets a callback that is called
     * when the last item from the `queue` has returned from the `worker`. If the
     * callback is omitted, `q.drain()` returns a promise for the next occurrence.
     * @property {Function} error - a function that sets a callback that is called
     * when a task errors. Has the signature `function(error, task)`. If the
     * callback is omitted, `error()` returns a promise that rejects on the next
     * error.
     * @property {boolean} paused - a boolean for determining whether the queue is
     * in a paused state.
     * @property {Function} pause - a function that pauses the processing of tasks
     * until `resume()` is called. Invoke with `queue.pause()`.
     * @property {Function} resume - a function that resumes the processing of
     * queued tasks when the queue is paused. Invoke with `queue.resume()`.
     * @property {Function} kill - a function that removes the `drain` callback and
     * empties remaining tasks from the queue forcing it to go idle. No more tasks
     * should be pushed to the queue after calling this function. Invoke with `queue.kill()`.
     *
     * @example
     * const q = async.queue(worker, 2)
     * q.push(item1)
     * q.push(item2)
     * q.push(item3)
     * // queues are iterable, spread into an array to inspect
     * const items = [...q] // [item1, item2, item3]
     * // or use for of
     * for (let item of q) {
     *     console.log(item)
     * }
     *
     * q.drain(() => {
     *     console.log('all done')
     * })
     * // or
     * await q.drain()
     */ /**
     * Creates a `queue` object with the specified `concurrency`. Tasks added to the
     * `queue` are processed in parallel (up to the `concurrency` limit). If all
     * `worker`s are in progress, the task is queued until one becomes available.
     * Once a `worker` completes a `task`, that `task`'s callback is called.
     *
     * @name queue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} worker - An async function for processing a queued task.
     * If you want to handle errors from an individual task, pass a callback to
     * `q.push()`. Invoked with (task, callback).
     * @param {number} [concurrency=1] - An `integer` for determining how many
     * `worker` functions should be run in parallel.  If omitted, the concurrency
     * defaults to `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can be
     * attached as certain properties to listen for specific events during the
     * lifecycle of the queue.
     * @example
     *
     * // create a queue object with concurrency 2
     * var q = async.queue(function(task, callback) {
     *     console.log('hello ' + task.name);
     *     callback();
     * }, 2);
     *
     * // assign a callback
     * q.drain(function() {
     *     console.log('all items have been processed');
     * });
     * // or await the end
     * await q.drain()
     *
     * // assign an error callback
     * q.error(function(err, task) {
     *     console.error('task experienced an error');
     * });
     *
     * // add some items to the queue
     * q.push({name: 'foo'}, function(err) {
     *     console.log('finished processing foo');
     * });
     * // callback is optional
     * q.push({name: 'bar'});
     *
     * // add some items to the queue (batch-wise)
     * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
     *     console.log('finished processing item');
     * });
     *
     * // add some items to the front of the queue
     * q.unshift({name: 'bar'}, function (err) {
     *     console.log('finished processing bar');
     * });
     */function queue$1(worker,concurrency){var _worker=wrapAsync(worker);return queue((items,cb)=>{_worker(items[0],cb);},concurrency,1);}// Binary min-heap implementation used for priority queue.
// Implementation is stable, i.e. push time is considered for equal priorities
class Heap{constructor(){this.heap=[];this.pushCount=Number.MIN_SAFE_INTEGER;}get length(){return this.heap.length;}empty(){this.heap=[];return this;}percUp(index){let p;while(index>0&&smaller(this.heap[index],this.heap[p=parent(index)])){let t=this.heap[index];this.heap[index]=this.heap[p];this.heap[p]=t;index=p;}}percDown(index){let l;while((l=leftChi(index))<this.heap.length){if(l+1<this.heap.length&&smaller(this.heap[l+1],this.heap[l])){l=l+1;}if(smaller(this.heap[index],this.heap[l])){break;}let t=this.heap[index];this.heap[index]=this.heap[l];this.heap[l]=t;index=l;}}push(node){node.pushCount=++this.pushCount;this.heap.push(node);this.percUp(this.heap.length-1);}unshift(node){return this.heap.push(node);}shift(){let[top]=this.heap;this.heap[0]=this.heap[this.heap.length-1];this.heap.pop();this.percDown(0);return top;}toArray(){return[...this];}*[Symbol.iterator](){for(let i=0;i<this.heap.length;i++){yield this.heap[i].data;}}remove(testFn){let j=0;for(let i=0;i<this.heap.length;i++){if(!testFn(this.heap[i])){this.heap[j]=this.heap[i];j++;}}this.heap.splice(j);for(let i=parent(this.heap.length-1);i>=0;i--){this.percDown(i);}return this;}}function leftChi(i){return(i<<1)+1;}function parent(i){return(i+1>>1)-1;}function smaller(x,y){if(x.priority!==y.priority){return x.priority<y.priority;}else{return x.pushCount<y.pushCount;}}/**
     * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
     * completed in ascending priority order.
     *
     * @name priorityQueue
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.queue]{@link module:ControlFlow.queue}
     * @category Control Flow
     * @param {AsyncFunction} worker - An async function for processing a queued task.
     * If you want to handle errors from an individual task, pass a callback to
     * `q.push()`.
     * Invoked with (task, callback).
     * @param {number} concurrency - An `integer` for determining how many `worker`
     * functions should be run in parallel.  If omitted, the concurrency defaults to
     * `1`.  If the concurrency is `0`, an error is thrown.
     * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are three
     * differences between `queue` and `priorityQueue` objects:
     * * `push(task, priority, [callback])` - `priority` should be a number. If an
     *   array of `tasks` is given, all tasks will be assigned the same priority.
     * * `pushAsync(task, priority, [callback])` - the same as `priorityQueue.push`,
     *   except this returns a promise that rejects if an error occurs.
     * * The `unshift` and `unshiftAsync` methods were removed.
     */function priorityQueue(worker,concurrency){// Start with a normal queue
var q=queue$1(worker,concurrency);var{push,pushAsync}=q;q._tasks=new Heap();q._createTaskItem=({data,priority},callback)=>{return{data,priority,callback};};function createDataItems(tasks,priority){if(!Array.isArray(tasks)){return{data:tasks,priority};}return tasks.map(data=>{return{data,priority};});}// Override push to accept second parameter representing priority
q.push=function(data,priority=0,callback){return push(createDataItems(data,priority),callback);};q.pushAsync=function(data,priority=0,callback){return pushAsync(createDataItems(data,priority),callback);};// Remove unshift functions
delete q.unshift;delete q.unshiftAsync;return q;}/**
     * Runs the `tasks` array of functions in parallel, without waiting until the
     * previous function has completed. Once any of the `tasks` complete or pass an
     * error to its callback, the main `callback` is immediately called. It's
     * equivalent to `Promise.race()`.
     *
     * @name race
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array} tasks - An array containing [async functions]{@link AsyncFunction}
     * to run. Each function can complete with an optional `result` value.
     * @param {Function} callback - A callback to run once any of the functions have
     * completed. This function gets an error or result from the first function that
     * completed. Invoked with (err, result).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * async.race([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ],
     * // main callback
     * function(err, result) {
     *     // the result will be equal to 'two' as it finishes earlier
     * });
     */function race(tasks,callback){callback=once(callback);if(!Array.isArray(tasks))return callback(new TypeError('First argument to race must be an array of functions'));if(!tasks.length)return callback();for(var i=0,l=tasks.length;i<l;i++){wrapAsync(tasks[i])(callback);}}var race$1=awaitify(race,2);/**
     * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
     *
     * @name reduceRight
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reduce]{@link module:Collections.reduce}
     * @alias foldr
     * @category Collection
     * @param {Array} array - A collection to iterate over.
     * @param {*} memo - The initial state of the reduction.
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * array to produce the next step in the reduction.
     * The `iteratee` should complete with the next state of the reduction.
     * If the iteratee completes with an error, the reduction is stopped and the
     * main `callback` is immediately called with the error.
     * Invoked with (memo, item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the reduced value. Invoked with
     * (err, result).
     * @returns {Promise} a promise, if no callback is passed
     */function reduceRight(array,memo,iteratee,callback){var reversed=[...array].reverse();return reduce$1(reversed,memo,iteratee,callback);}/**
     * Wraps the async function in another function that always completes with a
     * result object, even when it errors.
     *
     * The result object has either the property `error` or `value`.
     *
     * @name reflect
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} fn - The async function you want to wrap
     * @returns {Function} - A function that always passes null to it's callback as
     * the error. The second argument to the callback will be an `object` with
     * either an `error` or a `value` property.
     * @example
     *
     * async.parallel([
     *     async.reflect(function(callback) {
     *         // do some stuff ...
     *         callback(null, 'one');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff but error ...
     *         callback('bad stuff happened');
     *     }),
     *     async.reflect(function(callback) {
     *         // do some more stuff ...
     *         callback(null, 'two');
     *     })
     * ],
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = 'bad stuff happened'
     *     // results[2].value = 'two'
     * });
     */function reflect(fn){var _fn=wrapAsync(fn);return initialParams(function reflectOn(args,reflectCallback){args.push((error,...cbArgs)=>{let retVal={};if(error){retVal.error=error;}if(cbArgs.length>0){var value=cbArgs;if(cbArgs.length<=1){[value]=cbArgs;}retVal.value=value;}reflectCallback(null,retVal);});return _fn.apply(this,args);});}/**
     * A helper function that wraps an array or an object of functions with `reflect`.
     *
     * @name reflectAll
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.reflect]{@link module:Utils.reflect}
     * @category Util
     * @param {Array|Object|Iterable} tasks - The collection of
     * [async functions]{@link AsyncFunction} to wrap in `async.reflect`.
     * @returns {Array} Returns an array of async functions, each wrapped in
     * `async.reflect`
     * @example
     *
     * let tasks = [
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         // do some more stuff but error ...
     *         callback(new Error('bad stuff happened'));
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ];
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results[0].value = 'one'
     *     // results[1].error = Error('bad stuff happened')
     *     // results[2].value = 'two'
     * });
     *
     * // an example using an object instead of an array
     * let tasks = {
     *     one: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         callback('two');
     *     },
     *     three: function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'three');
     *         }, 100);
     *     }
     * };
     *
     * async.parallel(async.reflectAll(tasks),
     * // optional callback
     * function(err, results) {
     *     // values
     *     // results.one.value = 'one'
     *     // results.two.error = 'two'
     *     // results.three.value = 'three'
     * });
     */function reflectAll(tasks){var results;if(Array.isArray(tasks)){results=tasks.map(reflect);}else{results={};Object.keys(tasks).forEach(key=>{results[key]=reflect.call(this,tasks[key]);});}return results;}function reject(eachfn,arr,_iteratee,callback){const iteratee=wrapAsync(_iteratee);return _filter(eachfn,arr,(value,cb)=>{iteratee(value,(err,v)=>{cb(err,!v);});},callback);}/**
     * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
     *
     * @name reject
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.filter]{@link module:Collections.filter}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     *
     * const fileList = ['dir1/file1.txt','dir2/file3.txt','dir3/file6.txt'];
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.reject(fileList, fileExists, function(err, results) {
     *    // [ 'dir3/file6.txt' ]
     *    // results now equals an array of the non-existing files
     * });
     *
     * // Using Promises
     * async.reject(fileList, fileExists)
     * .then( results => {
     *     console.log(results);
     *     // [ 'dir3/file6.txt' ]
     *     // results now equals an array of the non-existing files
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let results = await async.reject(fileList, fileExists);
     *         console.log(results);
     *         // [ 'dir3/file6.txt' ]
     *         // results now equals an array of the non-existing files
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function reject$1(coll,iteratee,callback){return reject(eachOf$1,coll,iteratee,callback);}var reject$2=awaitify(reject$1,3);/**
     * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name rejectLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */function rejectLimit(coll,limit,iteratee,callback){return reject(eachOfLimit(limit),coll,iteratee,callback);}var rejectLimit$1=awaitify(rejectLimit,4);/**
     * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
     *
     * @name rejectSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.reject]{@link module:Collections.reject}
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {Function} iteratee - An async truth test to apply to each item in
     * `coll`.
     * The should complete with a boolean value as its `result`.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback is passed
     */function rejectSeries(coll,iteratee,callback){return reject(eachOfSeries$1,coll,iteratee,callback);}var rejectSeries$1=awaitify(rejectSeries,3);function constant$1(value){return function(){return value;};}/**
     * Attempts to get a successful response from `task` no more than `times` times
     * before returning an error. If the task is successful, the `callback` will be
     * passed the result of the successful task. If all attempts fail, the callback
     * will be passed the error and result (if any) of the final attempt.
     *
     * @name retry
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @see [async.retryable]{@link module:ControlFlow.retryable}
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
     * object with `times` and `interval` or a number.
     * * `times` - The number of attempts to make before giving up.  The default
     *   is `5`.
     * * `interval` - The time to wait between retries, in milliseconds.  The
     *   default is `0`. The interval may also be specified as a function of the
     *   retry count (see example).
     * * `errorFilter` - An optional synchronous function that is invoked on
     *   erroneous result. If it returns `true` the retry attempts will continue;
     *   if the function returns `false` the retry flow is aborted with the current
     *   attempt's error and result being returned to the final callback.
     *   Invoked with (err).
     * * If `opts` is a number, the number specifies the number of times to retry,
     *   with the default interval of `0`.
     * @param {AsyncFunction} task - An async function to retry.
     * Invoked with (callback).
     * @param {Function} [callback] - An optional callback which is called when the
     * task has succeeded, or after the final failed attempt. It receives the `err`
     * and `result` arguments of the last attempt at completing the `task`. Invoked
     * with (err, results).
     * @returns {Promise} a promise if no callback provided
     *
     * @example
     *
     * // The `retry` function can be used as a stand-alone control flow by passing
     * // a callback, as shown below:
     *
     * // try calling apiMethod 3 times
     * async.retry(3, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 3 times, waiting 200 ms between each retry
     * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod 10 times with exponential backoff
     * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
     * async.retry({
     *   times: 10,
     *   interval: function(retryCount) {
     *     return 50 * Math.pow(2, retryCount);
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod the default 5 times no delay between each retry
     * async.retry(apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // try calling apiMethod only when error condition satisfies, all other
     * // errors will abort the retry control flow and return to final callback
     * async.retry({
     *   errorFilter: function(err) {
     *     return err.message === 'Temporary error'; // only retry on a specific error
     *   }
     * }, apiMethod, function(err, result) {
     *     // do something with the result
     * });
     *
     * // to retry individual methods that are not as reliable within other
     * // control flow functions, use the `retryable` wrapper:
     * async.auto({
     *     users: api.getUsers.bind(api),
     *     payments: async.retryable(3, api.getPayments.bind(api))
     * }, function(err, results) {
     *     // do something with the results
     * });
     *
     */const DEFAULT_TIMES=5;const DEFAULT_INTERVAL=0;function retry(opts,task,callback){var options={times:DEFAULT_TIMES,intervalFunc:constant$1(DEFAULT_INTERVAL)};if(arguments.length<3&&typeof opts==='function'){callback=task||promiseCallback();task=opts;}else{parseTimes(options,opts);callback=callback||promiseCallback();}if(typeof task!=='function'){throw new Error("Invalid arguments for async.retry");}var _task=wrapAsync(task);var attempt=1;function retryAttempt(){_task((err,...args)=>{if(err===false)return;if(err&&attempt++<options.times&&(typeof options.errorFilter!='function'||options.errorFilter(err))){setTimeout(retryAttempt,options.intervalFunc(attempt-1));}else{callback(err,...args);}});}retryAttempt();return callback[PROMISE_SYMBOL];}function parseTimes(acc,t){if(typeof t==='object'){acc.times=+t.times||DEFAULT_TIMES;acc.intervalFunc=typeof t.interval==='function'?t.interval:constant$1(+t.interval||DEFAULT_INTERVAL);acc.errorFilter=t.errorFilter;}else if(typeof t==='number'||typeof t==='string'){acc.times=+t||DEFAULT_TIMES;}else{throw new Error("Invalid arguments for async.retry");}}/**
     * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method
     * wraps a task and makes it retryable, rather than immediately calling it
     * with retries.
     *
     * @name retryable
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.retry]{@link module:ControlFlow.retry}
     * @category Control Flow
     * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
     * options, exactly the same as from `retry`, except for a `opts.arity` that
     * is the arity of the `task` function, defaulting to `task.length`
     * @param {AsyncFunction} task - the asynchronous function to wrap.
     * This function will be passed any arguments passed to the returned wrapper.
     * Invoked with (...args, callback).
     * @returns {AsyncFunction} The wrapped function, which when invoked, will
     * retry on an error, based on the parameters specified in `opts`.
     * This function will accept the same parameters as `task`.
     * @example
     *
     * async.auto({
     *     dep1: async.retryable(3, getFromFlakyService),
     *     process: ["dep1", async.retryable(3, function (results, cb) {
     *         maybeProcessData(results.dep1, cb);
     *     })]
     * }, callback);
     */function retryable(opts,task){if(!task){task=opts;opts=null;}let arity=opts&&opts.arity||task.length;if(isAsync(task)){arity+=1;}var _task=wrapAsync(task);return initialParams((args,callback)=>{if(args.length<arity-1||callback==null){args.push(callback);callback=promiseCallback();}function taskFn(cb){_task(...args,cb);}if(opts)retry(opts,taskFn,callback);else retry(taskFn,callback);return callback[PROMISE_SYMBOL];});}/**
     * Run the functions in the `tasks` collection in series, each one running once
     * the previous function has completed. If any functions in the series pass an
     * error to its callback, no more functions are run, and `callback` is
     * immediately called with the value of the error. Otherwise, `callback`
     * receives an array of results when `tasks` have completed.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function, and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     *  results from {@link async.series}.
     *
     * **Note** that while many implementations preserve the order of object
     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
     * explicitly states that
     *
     * > The mechanics and order of enumerating the properties is not specified.
     *
     * So if you rely on the order in which your series of functions are executed,
     * and want this to work on all platforms, consider using an array.
     *
     * @name series
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing
     * [async functions]{@link AsyncFunction} to run in series.
     * Each function can complete with any number of optional `result` values.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This function gets a results array (or object)
     * containing all the result arguments passed to the `task` callbacks. Invoked
     * with (err, result).
     * @return {Promise} a promise, if no callback is passed
     * @example
     *
     * //Using Callbacks
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ], function(err, results) {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * });
     *
     * // an example using objects instead of arrays
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * });
     *
     * //Using Promises
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ]).then(results => {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // an example using an object instead of an array
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }).then(results => {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.series([
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 'one');
     *                 }, 200);
     *             },
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 'two');
     *                 }, 100);
     *             }
     *         ]);
     *         console.log(results);
     *         // results is equal to ['one','two']
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // an example using an object instead of an array
     * async () => {
     *     try {
     *         let results = await async.parallel({
     *             one: function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 1);
     *                 }, 200);
     *             },
     *            two: function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 2);
     *                 }, 100);
     *            }
     *         });
     *         console.log(results);
     *         // results is equal to: { one: 1, two: 2 }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function series(tasks,callback){return parallel(eachOfSeries$1,tasks,callback);}/**
     * Returns `true` if at least one element in the `coll` satisfies an async test.
     * If any iteratee call returns `true`, the main `callback` is immediately
     * called.
     *
     * @name some
     * @static
     * @memberOf module:Collections
     * @method
     * @alias any
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in parallel.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * // asynchronous function that checks if a file exists
     * function fileExists(file, callback) {
     *    fs.access(file, fs.constants.F_OK, (err) => {
     *        callback(null, !err);
     *    });
     * }
     *
     * // Using callbacks
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // true
     *        // result is true since some file in the list exists
     *    }
     *);
     *
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists,
     *    function(err, result) {
     *        console.log(result);
     *        // false
     *        // result is false since none of the files exists
     *    }
     *);
     *
     * // Using Promises
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists)
     * .then( result => {
     *     console.log(result);
     *     // true
     *     // result is true since some file in the list exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists)
     * .then( result => {
     *     console.log(result);
     *     // false
     *     // result is false since none of the files exists
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir3/file5.txt'], fileExists);
     *         console.log(result);
     *         // true
     *         // result is true since some file in the list exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * async () => {
     *     try {
     *         let result = await async.some(['dir1/missing.txt','dir2/missing.txt','dir4/missing.txt'], fileExists);
     *         console.log(result);
     *         // false
     *         // result is false since none of the files exists
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function some(coll,iteratee,callback){return _createTester(Boolean,res=>res)(eachOf$1,coll,iteratee,callback);}var some$1=awaitify(some,3);/**
     * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
     *
     * @name someLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anyLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in parallel.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */function someLimit(coll,limit,iteratee,callback){return _createTester(Boolean,res=>res)(eachOfLimit(limit),coll,iteratee,callback);}var someLimit$1=awaitify(someLimit,4);/**
     * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
     *
     * @name someSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.some]{@link module:Collections.some}
     * @alias anySeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async truth test to apply to each item
     * in the collections in series.
     * The iteratee should complete with a boolean `result` value.
     * Invoked with (item, callback).
     * @param {Function} [callback] - A callback which is called as soon as any
     * iteratee returns `true`, or after all the iteratee functions have finished.
     * Result will be either `true` or `false` depending on the values of the async
     * tests. Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     */function someSeries(coll,iteratee,callback){return _createTester(Boolean,res=>res)(eachOfSeries$1,coll,iteratee,callback);}var someSeries$1=awaitify(someSeries,3);/**
     * Sorts a list by the results of running each `coll` value through an async
     * `iteratee`.
     *
     * @name sortBy
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * The iteratee should complete with a value to use as the sort criteria as
     * its `result`.
     * Invoked with (item, callback).
     * @param {Function} callback - A callback which is called after all the
     * `iteratee` functions have finished, or an error occurs. Results is the items
     * from the original `coll` sorted by the values returned by the `iteratee`
     * calls. Invoked with (err, results).
     * @returns {Promise} a promise, if no callback passed
     * @example
     *
     * // bigfile.txt is a file that is 251100 bytes in size
     * // mediumfile.txt is a file that is 11000 bytes in size
     * // smallfile.txt is a file that is 121 bytes in size
     *
     * // asynchronous function that returns the file size in bytes
     * function getFileSizeInBytes(file, callback) {
     *     fs.stat(file, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         callback(null, stat.size);
     *     });
     * }
     *
     * // Using callbacks
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes,
     *     function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *         }
     *     }
     * );
     *
     * // By modifying the callback parameter the
     * // sorting order can be influenced:
     *
     * // ascending order
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], function(file, callback) {
     *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
     *         if (getFileSizeErr) return callback(getFileSizeErr);
     *         callback(null, fileSize);
     *     });
     * }, function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *         }
     *     }
     * );
     *
     * // descending order
     * async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], function(file, callback) {
     *     getFileSizeInBytes(file, function(getFileSizeErr, fileSize) {
     *         if (getFileSizeErr) {
     *             return callback(getFileSizeErr);
     *         }
     *         callback(null, fileSize * -1);
     *     });
     * }, function(err, results) {
     *         if (err) {
     *             console.log(err);
     *         } else {
     *             console.log(results);
     *             // results is now the original array of files sorted by
     *             // file size (ascending by default), e.g.
     *             // [ 'bigfile.txt', 'mediumfile.txt', 'smallfile.txt']
     *         }
     *     }
     * );
     *
     * // Error handling
     * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes,
     *     function(err, results) {
     *         if (err) {
     *             console.log(err);
     *             // [ Error: ENOENT: no such file or directory ]
     *         } else {
     *             console.log(results);
     *         }
     *     }
     * );
     *
     * // Using Promises
     * async.sortBy(['mediumfile.txt','smallfile.txt','bigfile.txt'], getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     *     // results is now the original array of files sorted by
     *     // file size (ascending by default), e.g.
     *     // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error handling
     * async.sortBy(['mediumfile.txt','smallfile.txt','missingfile.txt'], getFileSizeInBytes)
     * .then( results => {
     *     console.log(results);
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     * });
     *
     * // Using async/await
     * (async () => {
     *     try {
     *         let results = await async.sortBy(['bigfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
     *         console.log(results);
     *         // results is now the original array of files sorted by
     *         // file size (ascending by default), e.g.
     *         // [ 'smallfile.txt', 'mediumfile.txt', 'bigfile.txt']
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * })();
     *
     * // Error handling
     * async () => {
     *     try {
     *         let results = await async.sortBy(['missingfile.txt','mediumfile.txt','smallfile.txt'], getFileSizeInBytes);
     *         console.log(results);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *     }
     * }
     *
     */function sortBy(coll,iteratee,callback){var _iteratee=wrapAsync(iteratee);return map$1(coll,(x,iterCb)=>{_iteratee(x,(err,criteria)=>{if(err)return iterCb(err);iterCb(err,{value:x,criteria});});},(err,results)=>{if(err)return callback(err);callback(null,results.sort(comparator).map(v=>v.value));});function comparator(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}}var sortBy$1=awaitify(sortBy,3);/**
     * Sets a time limit on an asynchronous function. If the function does not call
     * its callback within the specified milliseconds, it will be called with a
     * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
     *
     * @name timeout
     * @static
     * @memberOf module:Utils
     * @method
     * @category Util
     * @param {AsyncFunction} asyncFn - The async function to limit in time.
     * @param {number} milliseconds - The specified time limit.
     * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
     * to timeout Error for more information..
     * @returns {AsyncFunction} Returns a wrapped function that can be used with any
     * of the control flow functions.
     * Invoke this function with the same parameters as you would `asyncFunc`.
     * @example
     *
     * function myFunction(foo, callback) {
     *     doAsyncTask(foo, function(err, data) {
     *         // handle errors
     *         if (err) return callback(err);
     *
     *         // do some stuff ...
     *
     *         // return processed data
     *         return callback(null, data);
     *     });
     * }
     *
     * var wrapped = async.timeout(myFunction, 1000);
     *
     * // call `wrapped` as you would `myFunction`
     * wrapped({ bar: 'bar' }, function(err, data) {
     *     // if `myFunction` takes < 1000 ms to execute, `err`
     *     // and `data` will have their expected values
     *
     *     // else `err` will be an Error with the code 'ETIMEDOUT'
     * });
     */function timeout(asyncFn,milliseconds,info){var fn=wrapAsync(asyncFn);return initialParams((args,callback)=>{var timedOut=false;var timer;function timeoutCallback(){var name=asyncFn.name||'anonymous';var error=new Error('Callback function "'+name+'" timed out.');error.code='ETIMEDOUT';if(info){error.info=info;}timedOut=true;callback(error);}args.push((...cbArgs)=>{if(!timedOut){callback(...cbArgs);clearTimeout(timer);}});// setup timer and call original function
timer=setTimeout(timeoutCallback,milliseconds);fn(...args);});}function range(size){var result=Array(size);while(size--){result[size]=size;}return result;}/**
     * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name timesLimit
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} count - The number of times to run the function.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see [async.map]{@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     */function timesLimit(count,limit,iteratee,callback){var _iteratee=wrapAsync(iteratee);return mapLimit$1(range(count),limit,_iteratee,callback);}/**
     * Calls the `iteratee` function `n` times, and accumulates results in the same
     * manner you would use with [map]{@link module:Collections.map}.
     *
     * @name times
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.map]{@link module:Collections.map}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     * @example
     *
     * // Pretend this is some complicated async factory
     * var createUser = function(id, callback) {
     *     callback(null, {
     *         id: 'user' + id
     *     });
     * };
     *
     * // generate 5 users
     * async.times(5, function(n, next) {
     *     createUser(n, function(err, user) {
     *         next(err, user);
     *     });
     * }, function(err, users) {
     *     // we should now have 5 users
     * });
     */function times(n,iteratee,callback){return timesLimit(n,Infinity,iteratee,callback);}/**
     * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
     *
     * @name timesSeries
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.times]{@link module:ControlFlow.times}
     * @category Control Flow
     * @param {number} n - The number of times to run the function.
     * @param {AsyncFunction} iteratee - The async function to call `n` times.
     * Invoked with the iteration index and a callback: (n, next).
     * @param {Function} callback - see {@link module:Collections.map}.
     * @returns {Promise} a promise, if no callback is provided
     */function timesSeries(n,iteratee,callback){return timesLimit(n,1,iteratee,callback);}/**
     * A relative of `reduce`.  Takes an Object or Array, and iterates over each
     * element in parallel, each step potentially mutating an `accumulator` value.
     * The type of the accumulator defaults to the type of collection passed in.
     *
     * @name transform
     * @static
     * @memberOf module:Collections
     * @method
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {*} [accumulator] - The initial state of the transform.  If omitted,
     * it will default to an empty Object or Array, depending on the type of `coll`
     * @param {AsyncFunction} iteratee - A function applied to each item in the
     * collection that potentially modifies the accumulator.
     * Invoked with (accumulator, item, key, callback).
     * @param {Function} [callback] - A callback which is called after all the
     * `iteratee` functions have finished. Result is the transformed accumulator.
     * Invoked with (err, result).
     * @returns {Promise} a promise, if no callback provided
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     *
     * // helper function that returns human-readable size format from bytes
     * function formatBytes(bytes, decimals = 2) {
     *   // implementation not included for brevity
     *   return humanReadbleFilesize;
     * }
     *
     * const fileList = ['file1.txt','file2.txt','file3.txt'];
     *
     * // asynchronous function that returns the file size, transformed to human-readable format
     * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
     * function transformFileSize(acc, value, key, callback) {
     *     fs.stat(value, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         acc[key] = formatBytes(stat.size);
     *         callback(null);
     *     });
     * }
     *
     * // Using callbacks
     * async.transform(fileList, transformFileSize, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     *     }
     * });
     *
     * // Using Promises
     * async.transform(fileList, transformFileSize)
     * .then(result => {
     *     console.log(result);
     *     // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * (async () => {
     *     try {
     *         let result = await async.transform(fileList, transformFileSize);
     *         console.log(result);
     *         // [ '1000 Bytes', '1.95 KB', '2.93 KB' ]
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * })();
     *
     * @example
     *
     * // file1.txt is a file that is 1000 bytes in size
     * // file2.txt is a file that is 2000 bytes in size
     * // file3.txt is a file that is 3000 bytes in size
     *
     * // helper function that returns human-readable size format from bytes
     * function formatBytes(bytes, decimals = 2) {
     *   // implementation not included for brevity
     *   return humanReadbleFilesize;
     * }
     *
     * const fileMap = { f1: 'file1.txt', f2: 'file2.txt', f3: 'file3.txt' };
     *
     * // asynchronous function that returns the file size, transformed to human-readable format
     * // e.g. 1024 bytes = 1KB, 1234 bytes = 1.21 KB, 1048576 bytes = 1MB, etc.
     * function transformFileSize(acc, value, key, callback) {
     *     fs.stat(value, function(err, stat) {
     *         if (err) {
     *             return callback(err);
     *         }
     *         acc[key] = formatBytes(stat.size);
     *         callback(null);
     *     });
     * }
     *
     * // Using callbacks
     * async.transform(fileMap, transformFileSize, function(err, result) {
     *     if(err) {
     *         console.log(err);
     *     } else {
     *         console.log(result);
     *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     *     }
     * });
     *
     * // Using Promises
     * async.transform(fileMap, transformFileSize)
     * .then(result => {
     *     console.log(result);
     *     // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.transform(fileMap, transformFileSize);
     *         console.log(result);
     *         // { f1: '1000 Bytes', f2: '1.95 KB', f3: '2.93 KB' }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */function transform(coll,accumulator,iteratee,callback){if(arguments.length<=3&&typeof accumulator==='function'){callback=iteratee;iteratee=accumulator;accumulator=Array.isArray(coll)?[]:{};}callback=once(callback||promiseCallback());var _iteratee=wrapAsync(iteratee);eachOf$1(coll,(v,k,cb)=>{_iteratee(accumulator,v,k,cb);},err=>callback(err,accumulator));return callback[PROMISE_SYMBOL];}/**
     * It runs each task in series but stops whenever any of the functions were
     * successful. If one of the tasks were successful, the `callback` will be
     * passed the result of the successful task. If all tasks fail, the callback
     * will be passed the error and result (if any) of the final attempt.
     *
     * @name tryEach
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing functions to
     * run, each function is passed a `callback(err, result)` it must call on
     * completion with an error `err` (which can be `null`) and an optional `result`
     * value.
     * @param {Function} [callback] - An optional callback which is called when one
     * of the tasks has succeeded, or all have failed. It receives the `err` and
     * `result` arguments of the last attempt at completing the `task`. Invoked with
     * (err, results).
     * @returns {Promise} a promise, if no callback is passed
     * @example
     * async.tryEach([
     *     function getDataFromFirstWebsite(callback) {
     *         // Try getting the data from the first website
     *         callback(err, data);
     *     },
     *     function getDataFromSecondWebsite(callback) {
     *         // First website failed,
     *         // Try getting the data from the backup website
     *         callback(err, data);
     *     }
     * ],
     * // optional callback
     * function(err, results) {
     *     Now do something with the data.
     * });
     *
     */function tryEach(tasks,callback){var error=null;var result;return eachSeries$1(tasks,(task,taskCb)=>{wrapAsync(task)((err,...args)=>{if(err===false)return taskCb(err);if(args.length<2){[result]=args;}else{result=args;}error=err;taskCb(err?null:{});});},()=>callback(error,result));}var tryEach$1=awaitify(tryEach);/**
     * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
     * unmemoized form. Handy for testing.
     *
     * @name unmemoize
     * @static
     * @memberOf module:Utils
     * @method
     * @see [async.memoize]{@link module:Utils.memoize}
     * @category Util
     * @param {AsyncFunction} fn - the memoized function
     * @returns {AsyncFunction} a function that calls the original unmemoized function
     */function unmemoize(fn){return(...args)=>{return(fn.unmemoized||fn)(...args);};}/**
     * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs.
     *
     * @name whilst
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {AsyncFunction} test - asynchronous truth test to perform before each
     * execution of `iteratee`. Invoked with ().
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` passes. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has failed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if no callback is passed
     * @example
     *
     * var count = 0;
     * async.whilst(
     *     function test(cb) { cb(null, count < 5); },
     *     function iter(callback) {
     *         count++;
     *         setTimeout(function() {
     *             callback(null, count);
     *         }, 1000);
     *     },
     *     function (err, n) {
     *         // 5 seconds have passed, n = 5
     *     }
     * );
     */function whilst(test,iteratee,callback){callback=onlyOnce(callback);var _fn=wrapAsync(iteratee);var _test=wrapAsync(test);var results=[];function next(err,...rest){if(err)return callback(err);results=rest;if(err===false)return;_test(check);}function check(err,truth){if(err)return callback(err);if(err===false)return;if(!truth)return callback(null,...results);_fn(next);}return _test(check);}var whilst$1=awaitify(whilst,3);/**
     * Repeatedly call `iteratee` until `test` returns `true`. Calls `callback` when
     * stopped, or an error occurs. `callback` will be passed an error and any
     * arguments passed to the final `iteratee`'s callback.
     *
     * The inverse of [whilst]{@link module:ControlFlow.whilst}.
     *
     * @name until
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @see [async.whilst]{@link module:ControlFlow.whilst}
     * @category Control Flow
     * @param {AsyncFunction} test - asynchronous truth test to perform before each
     * execution of `iteratee`. Invoked with (callback).
     * @param {AsyncFunction} iteratee - An async function which is called each time
     * `test` fails. Invoked with (callback).
     * @param {Function} [callback] - A callback which is called after the test
     * function has passed and repeated execution of `iteratee` has stopped. `callback`
     * will be passed an error and any arguments passed to the final `iteratee`'s
     * callback. Invoked with (err, [results]);
     * @returns {Promise} a promise, if a callback is not passed
     *
     * @example
     * const results = []
     * let finished = false
     * async.until(function test(cb) {
     *     cb(null, finished)
     * }, function iter(next) {
     *     fetchPage(url, (err, body) => {
     *         if (err) return next(err)
     *         results = results.concat(body.objects)
     *         finished = !!body.next
     *         next(err)
     *     })
     * }, function done (err) {
     *     // all pages have been fetched
     * })
     */function until(test,iteratee,callback){const _test=wrapAsync(test);return whilst$1(cb=>_test((err,truth)=>cb(err,!truth)),iteratee,callback);}/**
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
     */function waterfall(tasks,callback){callback=once(callback);if(!Array.isArray(tasks))return callback(new Error('First argument to waterfall must be an array of functions'));if(!tasks.length)return callback();var taskIndex=0;function nextTask(args){var task=wrapAsync(tasks[taskIndex++]);task(...args,onlyOnce(next));}function next(err,...args){if(err===false)return;if(err||taskIndex===tasks.length){return callback(err,...args);}nextTask(args);}nextTask([]);}var waterfall$1=awaitify(waterfall);/**
     * An "async function" in the context of Async is an asynchronous function with
     * a variable number of parameters, with the final parameter being a callback.
     * (`function (arg1, arg2, ..., callback) {}`)
     * The final callback is of the form `callback(err, results...)`, which must be
     * called once the function is completed.  The callback should be called with a
     * Error as its first argument to signal that an error occurred.
     * Otherwise, if no error occurred, it should be called with `null` as the first
     * argument, and any additional `result` arguments that may apply, to signal
     * successful completion.
     * The callback must be called exactly once, ideally on a later tick of the
     * JavaScript event loop.
     *
     * This type of function is also referred to as a "Node-style async function",
     * or a "continuation passing-style function" (CPS). Most of the methods of this
     * library are themselves CPS/Node-style async functions, or functions that
     * return CPS/Node-style async functions.
     *
     * Wherever we accept a Node-style async function, we also directly accept an
     * [ES2017 `async` function]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function}.
     * In this case, the `async` function will not be passed a final callback
     * argument, and any thrown error will be used as the `err` argument of the
     * implicit callback, and the return value will be used as the `result` value.
     * (i.e. a `rejected` of the returned Promise becomes the `err` callback
     * argument, and a `resolved` value becomes the `result`.)
     *
     * Note, due to JavaScript limitations, we can only detect native `async`
     * functions and not transpilied implementations.
     * Your environment must have `async`/`await` support for this to work.
     * (e.g. Node > v7.6, or a recent version of a modern browser).
     * If you are using `async` functions through a transpiler (e.g. Babel), you
     * must still wrap the function with [asyncify]{@link module:Utils.asyncify},
     * because the `async function` will be compiled to an ordinary function that
     * returns a promise.
     *
     * @typedef {Function} AsyncFunction
     * @static
     */var index={apply,applyEach:applyEach$1,applyEachSeries,asyncify,auto,autoInject,cargo,cargoQueue:cargo$1,compose,concat:concat$1,concatLimit:concatLimit$1,concatSeries:concatSeries$1,constant,detect:detect$1,detectLimit:detectLimit$1,detectSeries:detectSeries$1,dir,doUntil,doWhilst:doWhilst$1,each,eachLimit:eachLimit$2,eachOf:eachOf$1,eachOfLimit:eachOfLimit$2,eachOfSeries:eachOfSeries$1,eachSeries:eachSeries$1,ensureAsync,every:every$1,everyLimit:everyLimit$1,everySeries:everySeries$1,filter:filter$1,filterLimit:filterLimit$1,filterSeries:filterSeries$1,forever:forever$1,groupBy,groupByLimit:groupByLimit$1,groupBySeries,log,map:map$1,mapLimit:mapLimit$1,mapSeries:mapSeries$1,mapValues,mapValuesLimit:mapValuesLimit$1,mapValuesSeries,memoize,nextTick,parallel:parallel$1,parallelLimit,priorityQueue,queue:queue$1,race:race$1,reduce:reduce$1,reduceRight,reflect,reflectAll,reject:reject$2,rejectLimit:rejectLimit$1,rejectSeries:rejectSeries$1,retry,retryable,seq,series,setImmediate:setImmediate$1,some:some$1,someLimit:someLimit$1,someSeries:someSeries$1,sortBy:sortBy$1,timeout,times,timesLimit,timesSeries,transform,tryEach:tryEach$1,unmemoize,until,waterfall:waterfall$1,whilst:whilst$1,// aliases
all:every$1,allLimit:everyLimit$1,allSeries:everySeries$1,any:some$1,anyLimit:someLimit$1,anySeries:someSeries$1,find:detect$1,findLimit:detectLimit$1,findSeries:detectSeries$1,flatMap:concat$1,flatMapLimit:concatLimit$1,flatMapSeries:concatSeries$1,forEach:each,forEachSeries:eachSeries$1,forEachLimit:eachLimit$2,forEachOf:eachOf$1,forEachOfSeries:eachOfSeries$1,forEachOfLimit:eachOfLimit$2,inject:reduce$1,foldl:reduce$1,foldr:reduceRight,select:filter$1,selectLimit:filterLimit$1,selectSeries:filterSeries$1,wrapSync:asyncify,during:whilst$1,doDuring:doWhilst$1};exports.default=index;exports.apply=apply;exports.applyEach=applyEach$1;exports.applyEachSeries=applyEachSeries;exports.asyncify=asyncify;exports.auto=auto;exports.autoInject=autoInject;exports.cargo=cargo;exports.cargoQueue=cargo$1;exports.compose=compose;exports.concat=concat$1;exports.concatLimit=concatLimit$1;exports.concatSeries=concatSeries$1;exports.constant=constant;exports.detect=detect$1;exports.detectLimit=detectLimit$1;exports.detectSeries=detectSeries$1;exports.dir=dir;exports.doUntil=doUntil;exports.doWhilst=doWhilst$1;exports.each=each;exports.eachLimit=eachLimit$2;exports.eachOf=eachOf$1;exports.eachOfLimit=eachOfLimit$2;exports.eachOfSeries=eachOfSeries$1;exports.eachSeries=eachSeries$1;exports.ensureAsync=ensureAsync;exports.every=every$1;exports.everyLimit=everyLimit$1;exports.everySeries=everySeries$1;exports.filter=filter$1;exports.filterLimit=filterLimit$1;exports.filterSeries=filterSeries$1;exports.forever=forever$1;exports.groupBy=groupBy;exports.groupByLimit=groupByLimit$1;exports.groupBySeries=groupBySeries;exports.log=log;exports.map=map$1;exports.mapLimit=mapLimit$1;exports.mapSeries=mapSeries$1;exports.mapValues=mapValues;exports.mapValuesLimit=mapValuesLimit$1;exports.mapValuesSeries=mapValuesSeries;exports.memoize=memoize;exports.nextTick=nextTick;exports.parallel=parallel$1;exports.parallelLimit=parallelLimit;exports.priorityQueue=priorityQueue;exports.queue=queue$1;exports.race=race$1;exports.reduce=reduce$1;exports.reduceRight=reduceRight;exports.reflect=reflect;exports.reflectAll=reflectAll;exports.reject=reject$2;exports.rejectLimit=rejectLimit$1;exports.rejectSeries=rejectSeries$1;exports.retry=retry;exports.retryable=retryable;exports.seq=seq;exports.series=series;exports.setImmediate=setImmediate$1;exports.some=some$1;exports.someLimit=someLimit$1;exports.someSeries=someSeries$1;exports.sortBy=sortBy$1;exports.timeout=timeout;exports.times=times;exports.timesLimit=timesLimit;exports.timesSeries=timesSeries;exports.transform=transform;exports.tryEach=tryEach$1;exports.unmemoize=unmemoize;exports.until=until;exports.waterfall=waterfall$1;exports.whilst=whilst$1;exports.all=every$1;exports.allLimit=everyLimit$1;exports.allSeries=everySeries$1;exports.any=some$1;exports.anyLimit=someLimit$1;exports.anySeries=someSeries$1;exports.find=detect$1;exports.findLimit=detectLimit$1;exports.findSeries=detectSeries$1;exports.flatMap=concat$1;exports.flatMapLimit=concatLimit$1;exports.flatMapSeries=concatSeries$1;exports.forEach=each;exports.forEachSeries=eachSeries$1;exports.forEachLimit=eachLimit$2;exports.forEachOf=eachOf$1;exports.forEachOfSeries=eachOfSeries$1;exports.forEachOfLimit=eachOfLimit$2;exports.inject=reduce$1;exports.foldl=reduce$1;exports.foldr=reduceRight;exports.select=filter$1;exports.selectLimit=filterLimit$1;exports.selectSeries=filterSeries$1;exports.wrapSync=asyncify;exports.during=whilst$1;exports.doDuring=doWhilst$1;Object.defineProperty(exports,'__esModule',{value:true});});}).call(this);}).call(this,require('_process'),require("timers").setImmediate);},{"_process":37,"timers":44}],6:[function(require,module,exports){/**
* Base Logger Class
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/class BaseLogger{constructor(pLogStreamSettings,pFableLog){// This should not possibly be able to be instantiated without a settings object
this._Settings=pLogStreamSettings;// The base logger does nothing but associate a UUID with itself
// We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
// to the same provider.
this.loggerUUID=this.generateInsecureUUID();// Eventually we can use this array to ompute which levels the provider allows.
// For now it's just used to precompute some string concatenations.
this.levels=["trace","debug","info","warn","error","fatal"];}// This is meant to generate programmatically insecure UUIDs to identify loggers
generateInsecureUUID(){let tmpDate=new Date().getTime();let tmpUUID='LOGSTREAM-xxxxxx-yxxxxx'.replace(/[xy]/g,pCharacter=>{// Funny algorithm from w3resource that is twister-ish without the deep math and security
// ..but good enough for unique log stream identifiers
let tmpRandomData=(tmpDate+Math.random()*16)%16|0;tmpDate=Math.floor(tmpDate/16);return(pCharacter=='x'?tmpRandomData:tmpRandomData&0x3|0x8).toString(16);});return tmpUUID;}initialize(){// No operation.
}trace(pLogText,pLogObject){this.write("trace",pLogText,pLogObject);}debug(pLogText,pLogObject){this.write("debug",pLogText,pLogObject);}info(pLogText,pLogObject){this.write("info",pLogText,pLogObject);}warn(pLogText,pLogObject){this.write("warn",pLogText,pLogObject);}error(pLogText,pLogObject){this.write("error",pLogText,pLogObject);}fatal(pLogText,pLogObject){this.write("fatal",pLogText,pLogObject);}write(pLogLevel,pLogText,pLogObject){// The base logger does nothing.
return true;}}module.exports=BaseLogger;},{}],7:[function(require,module,exports){/**
* Default Logger Provider Function
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/ // Return the providers that are available without extensions loaded
getDefaultProviders=()=>{let tmpDefaultProviders={};tmpDefaultProviders.console=require('./Fable-Log-Logger-Console.js');tmpDefaultProviders.default=tmpDefaultProviders.console;return tmpDefaultProviders;};module.exports=getDefaultProviders();},{"./Fable-Log-Logger-Console.js":9}],8:[function(require,module,exports){module.exports=[{"loggertype":"console","streamtype":"console","level":"trace"}];},{}],9:[function(require,module,exports){let libBaseLogger=require('./Fable-Log-BaseLogger.js');class ConsoleLogger extends libBaseLogger{constructor(pLogStreamSettings,pFableLog){super(pLogStreamSettings);this._ShowTimeStamps=pLogStreamSettings.hasOwnProperty('showtimestamps')?pLogStreamSettings.showtimestamps==true:false;this._FormattedTimeStamps=pLogStreamSettings.hasOwnProperty('formattedtimestamps')?pLogStreamSettings.formattedtimestamps==true:false;this._ContextMessage=pLogStreamSettings.hasOwnProperty('Context')?`(${pLogStreamSettings.Context})`:pFableLog._Settings.hasOwnProperty('Product')?`(${pFableLog._Settings.Product})`:'Unnamed_Log_Context';// Allow the user to decide what gets output to the console
this._OutputLogLinesToConsole=pLogStreamSettings.hasOwnProperty('outputloglinestoconsole')?pLogStreamSettings.outputloglinestoconsole:true;this._OutputObjectsToConsole=pLogStreamSettings.hasOwnProperty('outputobjectstoconsole')?pLogStreamSettings.outputobjectstoconsole:true;// Precompute the prefix for each level
this.prefixCache={};for(let i=0;i<=this.levels.length;i++){this.prefixCache[this.levels[i]]=`[${this.levels[i]}] ${this._ContextMessage}: `;if(this._ShowTimeStamps){// If there is a timestamp we need a to prepend space before the prefixcache string, since the timestamp comes first
this.prefixCache[this.levels[i]]=' '+this.prefixCache[this.levels[i]];}}}write(pLevel,pLogText,pObject){let tmpTimeStamp='';if(this._ShowTimeStamps&&this._FormattedTimeStamps){tmpTimeStamp=new Date().toISOString();}else if(this._ShowTimeStamps){tmpTimeStamp=+new Date();}let tmpLogLine=`${tmpTimeStamp}${this.prefixCache[pLevel]}${pLogText}`;if(this._OutputLogLinesToConsole){console.log(tmpLogLine);}// Write out the object on a separate line if it is passed in
if(this._OutputObjectsToConsole&&typeof pObject!=='undefined'){console.log(JSON.stringify(pObject,null,2));}// Provide an easy way to be overridden and be consistent
return tmpLogLine;}}module.exports=ConsoleLogger;},{"./Fable-Log-BaseLogger.js":6}],10:[function(require,module,exports){/**
* Fable Logging Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Logger
*/ /**
* Fable Solution Log Wrapper Main Class
*
* @class FableLog
* @constructor
*/class FableLog{constructor(pFableSettings,pFable){let tmpSettings=typeof pFableSettings==='object'?pFableSettings:{};this._Settings=tmpSettings;this._Providers=require('./Fable-Log-DefaultProviders-Node.js');this._StreamDefinitions=tmpSettings.hasOwnProperty('LogStreams')?tmpSettings.LogStreams:require('./Fable-Log-DefaultStreams.json');this.logStreams=[];// This object gets decorated for one-time instantiated providers that
//  have multiple outputs, such as bunyan.
this.logProviders={};// A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
this.activeLogStreams={};this.logStreamsTrace=[];this.logStreamsDebug=[];this.logStreamsInfo=[];this.logStreamsWarn=[];this.logStreamsError=[];this.logStreamsFatal=[];this.datumDecorator=pDatum=>pDatum;this.uuid=typeof tmpSettings.Product==='string'?tmpSettings.Product:'Default';}addLogger(pLogger,pLevel){// Bail out if we've already created one.
if(this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID)){return false;}// Add it to the streams and to the mutex
this.logStreams.push(pLogger);this.activeLogStreams[pLogger.loggerUUID]=true;// Make sure a kosher level was passed in
switch(pLevel){case'trace':this.logStreamsTrace.push(pLogger);case'debug':this.logStreamsDebug.push(pLogger);case'info':this.logStreamsInfo.push(pLogger);case'warn':this.logStreamsWarn.push(pLogger);case'error':this.logStreamsError.push(pLogger);case'fatal':this.logStreamsFatal.push(pLogger);break;}return true;}setDatumDecorator(fDatumDecorator){if(typeof fDatumDecorator==='function'){this.datumDecorator=fDatumDecorator;}else{this.datumDecorator=pDatum=>pDatum;}}trace(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsTrace.length;i++){this.logStreamsTrace[i].trace(pMessage,tmpDecoratedDatum);}}debug(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsDebug.length;i++){this.logStreamsDebug[i].debug(pMessage,tmpDecoratedDatum);}}info(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsInfo.length;i++){this.logStreamsInfo[i].info(pMessage,tmpDecoratedDatum);}}warn(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsWarn.length;i++){this.logStreamsWarn[i].warn(pMessage,tmpDecoratedDatum);}}error(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsError.length;i++){this.logStreamsError[i].error(pMessage,tmpDecoratedDatum);}}fatal(pMessage,pDatum){const tmpDecoratedDatum=this.datumDecorator(pDatum);for(let i=0;i<this.logStreamsFatal.length;i++){this.logStreamsFatal[i].fatal(pMessage,tmpDecoratedDatum);}}initialize(){// "initialize" each logger as defined in the logging parameters
for(let i=0;i<this._StreamDefinitions.length;i++){let tmpStreamDefinition=Object.assign({loggertype:'default',streamtype:'console',level:'info'},this._StreamDefinitions[i]);if(!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype)){console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);}else{this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition,this),tmpStreamDefinition.level);}}// Now initialize each one.
for(let i=0;i<this.logStreams.length;i++){this.logStreams[i].initialize();}}logTime(pMessage,pDatum){let tmpMessage=typeof pMessage!=='undefined'?pMessage:'Time';let tmpTime=new Date();this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`,pDatum);}// Get a timestamp
getTimeStamp(){return+new Date();}getTimeDelta(pTimeStamp){let tmpEndTime=+new Date();return tmpEndTime-pTimeStamp;}// Log the delta between a timestamp, and now with a message
logTimeDelta(pTimeDelta,pMessage,pDatum){let tmpMessage=typeof pMessage!=='undefined'?pMessage:'Time Measurement';let tmpDatum=typeof pDatum==='object'?pDatum:{};let tmpEndTime=+new Date();this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`,pDatum);}logTimeDeltaHuman(pTimeDelta,pMessage,pDatum){let tmpMessage=typeof pMessage!=='undefined'?pMessage:'Time Measurement';let tmpEndTime=+new Date();let tmpMs=parseInt(pTimeDelta%1000);let tmpSeconds=parseInt(pTimeDelta/1000%60);let tmpMinutes=parseInt(pTimeDelta/(1000*60)%60);let tmpHours=parseInt(pTimeDelta/(1000*60*60));tmpMs=tmpMs<10?"00"+tmpMs:tmpMs<100?"0"+tmpMs:tmpMs;tmpSeconds=tmpSeconds<10?"0"+tmpSeconds:tmpSeconds;tmpMinutes=tmpMinutes<10?"0"+tmpMinutes:tmpMinutes;tmpHours=tmpHours<10?"0"+tmpHours:tmpHours;this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`,pDatum);}logTimeDeltaRelative(pStartTime,pMessage,pDatum){this.logTimeDelta(this.getTimeDelta(pStartTime),pMessage,pDatum);}logTimeDeltaRelativeHuman(pStartTime,pMessage,pDatum){this.logTimeDeltaHuman(this.getTimeDelta(pStartTime),pMessage,pDatum);}}// This is for backwards compatibility
function autoConstruct(pSettings){return new FableLog(pSettings);}module.exports={new:autoConstruct,FableLog:FableLog};},{"./Fable-Log-DefaultProviders-Node.js":7,"./Fable-Log-DefaultStreams.json":8}],11:[function(require,module,exports){module.exports={"Product":"ApplicationNameHere","ProductVersion":"0.0.0","ConfigFile":false,"LogStreams":[{"level":"trace"}]};},{}],12:[function(require,module,exports){(function(process){(function(){/**
* Fable Settings Template Processor
*
* This class allows environment variables to come in via templated expressions, and defaults to be set.
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/class FableSettingsTemplateProcessor{constructor(pDependencies){// Use a no-dependencies templating engine to parse out environment variables
this.templateProcessor=new pDependencies.precedent();// TODO: Make the environment variable wrap expression demarcation characters configurable?
this.templateProcessor.addPattern('${','}',pTemplateValue=>{let tmpTemplateValue=pTemplateValue.trim();let tmpSeparatorIndex=tmpTemplateValue.indexOf('|');// If there is no pipe, the default value will end up being whatever the variable name is.
let tmpDefaultValue=tmpTemplateValue.substring(tmpSeparatorIndex+1);let tmpEnvironmentVariableName=tmpSeparatorIndex>-1?tmpTemplateValue.substring(0,tmpSeparatorIndex):tmpTemplateValue;if(process.env.hasOwnProperty(tmpEnvironmentVariableName)){return process.env[tmpEnvironmentVariableName];}else{return tmpDefaultValue;}});}parseSetting(pString){return this.templateProcessor.parseString(pString);}}module.exports=FableSettingsTemplateProcessor;}).call(this);}).call(this,require('_process'));},{"_process":37}],13:[function(require,module,exports){/**
* Fable Settings Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Settings
*/const libPrecedent=require('precedent');const libFableSettingsTemplateProcessor=require('./Fable-Settings-TemplateProcessor.js');class FableSettings{constructor(pFableSettings){// Expose the dependencies for downstream re-use
this.dependencies={precedent:libPrecedent};// Initialize the settings value template processor
this.settingsTemplateProcessor=new libFableSettingsTemplateProcessor(this.dependencies);// set straight away so anything that uses it respects the initial setting
this._configureEnvTemplating(pFableSettings);this.default=this.buildDefaultSettings();// Construct a new settings object
let tmpSettings=this.merge(pFableSettings,this.buildDefaultSettings());// The base settings object (what they were on initialization, before other actors have altered them)
this.base=JSON.parse(JSON.stringify(tmpSettings));if(tmpSettings.DefaultConfigFile){try{// If there is a DEFAULT configuration file, try to load and merge it.
tmpSettings=this.merge(require(tmpSettings.DefaultConfigFile),tmpSettings);}catch(pException){// Why this?  Often for an app we want settings to work out of the box, but
// would potentially want to have a config file for complex settings.
console.log('Fable-Settings Warning: Default configuration file specified but there was a problem loading it.  Falling back to base.');console.log('     Loading Exception: '+pException);}}if(tmpSettings.ConfigFile){try{// If there is a configuration file, try to load and merge it.
tmpSettings=this.merge(require(tmpSettings.ConfigFile),tmpSettings);}catch(pException){// Why this?  Often for an app we want settings to work out of the box, but
// would potentially want to have a config file for complex settings.
console.log('Fable-Settings Warning: Configuration file specified but there was a problem loading it.  Falling back to base.');console.log('     Loading Exception: '+pException);}}this.settings=tmpSettings;}// Build a default settings object.  Use the JSON jimmy to ensure it is always a new object.
buildDefaultSettings(){return JSON.parse(JSON.stringify(require('./Fable-Settings-Default')));}// Update the configuration for environment variable templating based on the current settings object
_configureEnvTemplating(pSettings){// default environment variable templating to on
this._PerformEnvTemplating=!pSettings||pSettings.NoEnvReplacement!==true;}// Resolve (recursive) any environment variables found in settings object.
_resolveEnv(pSettings){for(const tmpKey in pSettings){if(typeof pSettings[tmpKey]==='object'){this._resolveEnv(pSettings[tmpKey]);}else if(typeof pSettings[tmpKey]==='string'){pSettings[tmpKey]=this.settingsTemplateProcessor.parseSetting(pSettings[tmpKey]);}}}/**
	 * Check to see if a value is an object (but not an array).
	 */_isObject(value){return typeof value==='object'&&!Array.isArray(value);}/**
	 * Merge two plain objects. Keys that are objects in both will be merged property-wise.
	 */_deepMergeObjects(toObject,fromObject){if(!fromObject||!this._isObject(fromObject)){return;}Object.keys(fromObject).forEach(key=>{const fromValue=fromObject[key];if(this._isObject(fromValue)){const toValue=toObject[key];if(toValue&&this._isObject(toValue)){// both are objects, so do a recursive merge
this._deepMergeObjects(toValue,fromValue);return;}}toObject[key]=fromValue;});return toObject;}// Merge some new object into the existing settings.
merge(pSettingsFrom,pSettingsTo){// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
let tmpSettingsFrom=typeof pSettingsFrom==='object'?pSettingsFrom:{};// Default to the settings object if none is passed in for the merge.
let tmpSettingsTo=typeof pSettingsTo==='object'?pSettingsTo:this.settings;// do not mutate the From object property values
let tmpSettingsFromCopy=JSON.parse(JSON.stringify(tmpSettingsFrom));tmpSettingsTo=this._deepMergeObjects(tmpSettingsTo,tmpSettingsFromCopy);if(this._PerformEnvTemplating){this._resolveEnv(tmpSettingsTo);}// Update env tempating config, since we just updated the config object, and it may have changed
this._configureEnvTemplating(tmpSettingsTo);return tmpSettingsTo;}// Fill in settings gaps without overwriting settings that are already there
fill(pSettingsFrom){// If an invalid settings from object is passed in (e.g. object constructor without passing in anything) this should still work
let tmpSettingsFrom=typeof pSettingsFrom==='object'?pSettingsFrom:{};// do not mutate the From object property values
let tmpSettingsFromCopy=JSON.parse(JSON.stringify(tmpSettingsFrom));this.settings=this._deepMergeObjects(tmpSettingsFromCopy,this.settings);return this.settings;}};// This is for backwards compatibility
function autoConstruct(pSettings){return new FableSettings(pSettings);}module.exports={new:autoConstruct,FableSettings:FableSettings};},{"./Fable-Settings-Default":11,"./Fable-Settings-TemplateProcessor.js":12,"precedent":34}],14:[function(require,module,exports){/**
* Random Byte Generator - Browser version
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/ // Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
class RandomBytes{constructor(){// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
this.getRandomValues=typeof crypto!='undefined'&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||typeof msCrypto!='undefined'&&typeof window.msCrypto.getRandomValues=='function'&&msCrypto.getRandomValues.bind(msCrypto);}// WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
generateWhatWGBytes(){let tmpBuffer=new Uint8Array(16);// eslint-disable-line no-undef
this.getRandomValues(tmpBuffer);return tmpBuffer;}// Math.random()-based (RNG)
generateRandomBytes(){// If all else fails, use Math.random().  It's fast, but is of unspecified
// quality.
let tmpBuffer=new Uint8Array(16);// eslint-disable-line no-undef
for(let i=0,tmpValue;i<16;i++){if((i&0x03)===0){tmpValue=Math.random()*0x100000000;}tmpBuffer[i]=tmpValue>>>((i&0x03)<<3)&0xff;}return tmpBuffer;}generate(){if(this.getRandomValues){return this.generateWhatWGBytes();}else{return this.generateRandomBytes();}}}module.exports=RandomBytes;},{}],15:[function(require,module,exports){/**
* Fable UUID Generator
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable UUID
*/ /**
* Fable Solution UUID Generation Main Class
*
* @class FableUUID
* @constructor
*/var libRandomByteGenerator=require('./Fable-UUID-Random.js');class FableUUID{constructor(pSettings){// Determine if the module is in "Random UUID Mode" which means just use the random character function rather than the v4 random UUID spec.
// Note this allows UUIDs of various lengths (including very short ones) although guaranteed uniqueness goes downhill fast.
this._UUIDModeRandom=typeof pSettings==='object'&&pSettings.hasOwnProperty('UUIDModeRandom')?pSettings.UUIDModeRandom==true:false;// These two properties are only useful if we are in Random mode.  Otherwise it generates a v4 spec
// Length for "Random UUID Mode" is set -- if not set it to 8
this._UUIDLength=typeof pSettings==='object'&&pSettings.hasOwnProperty('UUIDLength')?pSettings.UUIDLength+0:8;// Dictionary for "Random UUID Mode"
this._UUIDRandomDictionary=typeof pSettings==='object'&&pSettings.hasOwnProperty('UUIDDictionary')?pSettings.UUIDDictionary+0:'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';this.randomByteGenerator=new libRandomByteGenerator();// Lookup table for hex codes
this._HexLookup=[];for(let i=0;i<256;++i){this._HexLookup[i]=(i+0x100).toString(16).substr(1);}}// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
bytesToUUID(pBuffer){let i=0;// join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
return[this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],'-',this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],'-',this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],'-',this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],'-',this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]],this._HexLookup[pBuffer[i++]]].join('');}// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
generateUUIDv4(){let tmpBuffer=new Array(16);var tmpRandomBytes=this.randomByteGenerator.generate();// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
tmpRandomBytes[6]=tmpRandomBytes[6]&0x0f|0x40;tmpRandomBytes[8]=tmpRandomBytes[8]&0x3f|0x80;return this.bytesToUUID(tmpRandomBytes);}// Simple random UUID generation
generateRandom(){let tmpUUID='';for(let i=0;i<this._UUIDLength;i++){tmpUUID+=this._UUIDRandomDictionary.charAt(Math.floor(Math.random()*(this._UUIDRandomDictionary.length-1)));}return tmpUUID;}// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
getUUID(){if(this._UUIDModeRandom){return this.generateRandom();}else{return this.generateUUIDv4();}}}// This is for backwards compatibility
function autoConstruct(pSettings){return new FableUUID(pSettings);}module.exports={new:autoConstruct,FableUUID:FableUUID};},{"./Fable-UUID-Random.js":14}],16:[function(require,module,exports){// ##### Part of the **[retold](https://stevenvelozo.github.io/retold/)** system
/**
* @license MIT
* @author <steven@velozo.com>
*/const libFableSettings=require('fable-settings').FableSettings;const libFableUUID=require('fable-uuid').FableUUID;const libFableLog=require('fable-log').FableLog;/**
* Fable Application Services Support Library
*
* @class Fable
*/class Fable{constructor(pSettings){let tmpSettings=new libFableSettings(pSettings);this.settingsManager=tmpSettings;// Instantiate the UUID generator
this.libUUID=new libFableUUID(this.settingsManager.settings);this.log=new libFableLog(this.settingsManager.settings);this.log.initialize();}get settings(){return this.settingsManager.settings;}get fable(){return this;}getUUID(){return this.libUUID.getUUID();}}// This is for backwards compatibility
function autoConstruct(pSettings){return new Fable(pSettings);}module.exports=Fable;},{"fable-log":10,"fable-settings":13,"fable-uuid":15}],17:[function(require,module,exports){'use strict';var UTF8_ACCEPT=12;var UTF8_REJECT=0;var UTF8_DATA=[// The first part of the table maps bytes to character to a transition.
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,7,7,7,7,7,7,7,7,7,7,7,7,8,7,7,10,9,9,9,11,4,4,4,4,4,4,4,4,4,4,4,// The second part of the table maps a state to a new state when adding a
// transition.
0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,24,36,48,60,72,84,96,0,12,12,12,0,0,0,0,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,0,0,24,24,24,0,0,0,0,0,0,0,0,0,24,24,0,0,0,0,0,0,0,0,0,0,48,48,48,0,0,0,0,0,0,0,0,0,0,48,48,0,0,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,0,0,0,// The third part maps the current transition to a mask that needs to apply
// to the byte.
0x7F,0x3F,0x3F,0x3F,0x00,0x1F,0x0F,0x0F,0x0F,0x07,0x07,0x07];function decodeURIComponent(uri){var percentPosition=uri.indexOf('%');if(percentPosition===-1)return uri;var length=uri.length;var decoded='';var last=0;var codepoint=0;var startOfOctets=percentPosition;var state=UTF8_ACCEPT;while(percentPosition>-1&&percentPosition<length){var high=hexCodeToInt(uri[percentPosition+1],4);var low=hexCodeToInt(uri[percentPosition+2],0);var byte=high|low;var type=UTF8_DATA[byte];state=UTF8_DATA[256+state+type];codepoint=codepoint<<6|byte&UTF8_DATA[364+type];if(state===UTF8_ACCEPT){decoded+=uri.slice(last,startOfOctets);decoded+=codepoint<=0xFFFF?String.fromCharCode(codepoint):String.fromCharCode(0xD7C0+(codepoint>>10),0xDC00+(codepoint&0x3FF));codepoint=0;last=percentPosition+3;percentPosition=startOfOctets=uri.indexOf('%',last);}else if(state===UTF8_REJECT){return null;}else{percentPosition+=3;if(percentPosition<length&&uri.charCodeAt(percentPosition)===37)continue;return null;}}return decoded+uri.slice(last);}var HEX={'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'a':10,'A':10,'b':11,'B':11,'c':12,'C':12,'d':13,'D':13,'e':14,'E':14,'f':15,'F':15};function hexCodeToInt(c,shift){var i=HEX[c];return i===undefined?255:i<<shift;}module.exports=decodeURIComponent;},{}],18:[function(require,module,exports){'use strict';// do not edit .js files directly - edit src/index.jst
module.exports=function equal(a,b){if(a===b)return true;if(a&&b&&typeof a=='object'&&typeof b=='object'){if(a.constructor!==b.constructor)return false;var length,i,keys;if(Array.isArray(a)){length=a.length;if(length!=b.length)return false;for(i=length;i--!==0;)if(!equal(a[i],b[i]))return false;return true;}if(a.constructor===RegExp)return a.source===b.source&&a.flags===b.flags;if(a.valueOf!==Object.prototype.valueOf)return a.valueOf()===b.valueOf();if(a.toString!==Object.prototype.toString)return a.toString()===b.toString();keys=Object.keys(a);length=keys.length;if(length!==Object.keys(b).length)return false;for(i=length;i--!==0;)if(!Object.prototype.hasOwnProperty.call(b,keys[i]))return false;for(i=length;i--!==0;){var key=keys[i];if(!equal(a[key],b[key]))return false;}return true;}// true if both NaN, false otherwise
return a!==a&&b!==b;};},{}],19:[function(require,module,exports){"use strict";const parse=require("./parse");const stringify=require("./stringify");const fastQuerystring={parse,stringify};/**
 * Enable TS and JS support
 *
 * - `const qs = require('fast-querystring')`
 * - `import qs from 'fast-querystring'`
 */module.exports=fastQuerystring;module.exports.default=fastQuerystring;module.exports.parse=parse;module.exports.stringify=stringify;},{"./parse":21,"./stringify":22}],20:[function(require,module,exports){// This file is taken from Node.js project.
// Full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js
const hexTable=Array.from({length:256},(_,i)=>"%"+((i<16?"0":"")+i.toString(16)).toUpperCase());// These characters do not need escaping when generating query strings:
// ! - . _ ~
// ' ( ) *
// digits
// alpha (uppercase)
// alpha (lowercase)
// rome-ignore format: the array should not be formatted
const noEscape=new Int8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,// 0 - 15
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,// 16 - 31
0,1,0,0,0,0,0,1,1,1,1,0,0,1,1,0,// 32 - 47
1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,// 48 - 63
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,// 64 - 79
1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,// 80 - 95
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,// 96 - 111
1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0// 112 - 127
]);/**
 * @param {string} str
 * @returns {string}
 */function encodeString(str){const len=str.length;if(len===0)return"";let out="";let lastPos=0;let i=0;outer:for(;i<len;i++){let c=str.charCodeAt(i);// ASCII
while(c<0x80){if(noEscape[c]!==1){if(lastPos<i)out+=str.slice(lastPos,i);lastPos=i+1;out+=hexTable[c];}if(++i===len)break outer;c=str.charCodeAt(i);}if(lastPos<i)out+=str.slice(lastPos,i);// Multi-byte characters ...
if(c<0x800){lastPos=i+1;out+=hexTable[0xc0|c>>6]+hexTable[0x80|c&0x3f];continue;}if(c<0xd800||c>=0xe000){lastPos=i+1;out+=hexTable[0xe0|c>>12]+hexTable[0x80|c>>6&0x3f]+hexTable[0x80|c&0x3f];continue;}// Surrogate pair
++i;// This branch should never happen because all URLSearchParams entries
// should already be converted to USVString. But, included for
// completion's sake anyway.
if(i>=len){throw new Error("URI malformed");}const c2=str.charCodeAt(i)&0x3ff;lastPos=i+1;c=0x10000+((c&0x3ff)<<10|c2);out+=hexTable[0xf0|c>>18]+hexTable[0x80|c>>12&0x3f]+hexTable[0x80|c>>6&0x3f]+hexTable[0x80|c&0x3f];}if(lastPos===0)return str;if(lastPos<len)return out+str.slice(lastPos);return out;}module.exports={encodeString};},{}],21:[function(require,module,exports){"use strict";const fastDecode=require("fast-decode-uri-component");const plusRegex=/\+/g;const Empty=function(){};Empty.prototype=Object.create(null);/**
 * @callback parse
 * @param {string} input
 */function parse(input){// Optimization: Use new Empty() instead of Object.create(null) for performance
// v8 has a better optimization for initializing functions compared to Object
const result=new Empty();if(typeof input!=="string"){return result;}let inputLength=input.length;let key="";let value="";let startingIndex=-1;let equalityIndex=-1;let shouldDecodeKey=false;let shouldDecodeValue=false;let keyHasPlus=false;let valueHasPlus=false;let hasBothKeyValuePair=false;let c=0;// Have a boundary of input.length + 1 to access last pair inside the loop.
for(let i=0;i<inputLength+1;i++){c=i!==inputLength?input.charCodeAt(i):38;// Handle '&' and end of line to pass the current values to result
if(c===38){hasBothKeyValuePair=equalityIndex>startingIndex;// Optimization: Reuse equality index to store the end of key
if(!hasBothKeyValuePair){equalityIndex=i;}key=input.slice(startingIndex+1,equalityIndex);// Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
if(hasBothKeyValuePair||key.length>0){// Optimization: Replace '+' with space
if(keyHasPlus){key=key.replace(plusRegex," ");}// Optimization: Do not decode if it's not necessary.
if(shouldDecodeKey){key=fastDecode(key)||key;}if(hasBothKeyValuePair){value=input.slice(equalityIndex+1,i);if(valueHasPlus){value=value.replace(plusRegex," ");}if(shouldDecodeValue){value=fastDecode(value)||value;}}const currentValue=result[key];if(currentValue===undefined){result[key]=value;}else{// Optimization: value.pop is faster than Array.isArray(value)
if(currentValue.pop){currentValue.push(value);}else{result[key]=[currentValue,value];}}}// Reset reading key value pairs
value="";startingIndex=i;equalityIndex=i;shouldDecodeKey=false;shouldDecodeValue=false;keyHasPlus=false;valueHasPlus=false;}// Check '='
else if(c===61){if(equalityIndex<=startingIndex){equalityIndex=i;}// If '=' character occurs again, we should decode the input.
else{shouldDecodeValue=true;}}// Check '+', and remember to replace it with empty space.
else if(c===43){if(equalityIndex>startingIndex){valueHasPlus=true;}else{keyHasPlus=true;}}// Check '%' character for encoding
else if(c===37){if(equalityIndex>startingIndex){shouldDecodeValue=true;}else{shouldDecodeKey=true;}}}return result;}module.exports=parse;},{"fast-decode-uri-component":17}],22:[function(require,module,exports){"use strict";const{encodeString}=require("./internals/querystring");function getAsPrimitive(value){const type=typeof value;if(type==="string"){// Length check is handled inside encodeString function
return encodeString(value);}else if(type==="bigint"){return value.toString();}else if(type==="boolean"){return value?"true":"false";}else if(type==="number"&&Number.isFinite(value)){return value<1e21?""+value:encodeString(""+value);}return"";}/**
 * @param {Record<string, string | number | boolean
 * | ReadonlyArray<string | number | boolean> | null>} input
 * @returns {string}
 */function stringify(input){let result="";if(input===null||typeof input!=="object"){return result;}const separator="&";const keys=Object.keys(input);const keyLength=keys.length;let valueLength=0;for(let i=0;i<keyLength;i++){const key=keys[i];const value=input[key];const encodedKey=encodeString(key)+"=";if(i){result+=separator;}if(Array.isArray(value)){valueLength=value.length;for(let j=0;j<valueLength;j++){if(j){result+=separator;}// Optimization: Dividing into multiple lines improves the performance.
// Since v8 does not need to care about the '+' character if it was one-liner.
result+=encodedKey;result+=getAsPrimitive(value[j]);}}else{result+=encodedKey;result+=getAsPrimitive(value);}}return result;}module.exports=stringify;},{"./internals/querystring":20}],23:[function(require,module,exports){'use strict';const HandlerStorage=require('./handler_storage');const NODE_TYPES={STATIC:0,PARAMETRIC:1,WILDCARD:2};class Node{constructor(){this.handlerStorage=new HandlerStorage();}}class ParentNode extends Node{constructor(){super();this.staticChildren={};}findStaticMatchingChild(path,pathIndex){const staticChild=this.staticChildren[path.charAt(pathIndex)];if(staticChild===undefined||!staticChild.matchPrefix(path,pathIndex)){return null;}return staticChild;}createStaticChild(path){if(path.length===0){return this;}let staticChild=this.staticChildren[path.charAt(0)];if(staticChild){let i=1;for(;i<staticChild.prefix.length;i++){if(path.charCodeAt(i)!==staticChild.prefix.charCodeAt(i)){staticChild=staticChild.split(this,i);break;}}return staticChild.createStaticChild(path.slice(i));}const label=path.charAt(0);this.staticChildren[label]=new StaticNode(path);return this.staticChildren[label];}}class StaticNode extends ParentNode{constructor(prefix){super();this.prefix=prefix;this.wildcardChild=null;this.parametricChildren=[];this.kind=NODE_TYPES.STATIC;this._compilePrefixMatch();}createParametricChild(regex,staticSuffix){const regexpSource=regex&&regex.source;let parametricChild=this.parametricChildren.find(child=>{const childRegexSource=child.regex&&child.regex.source;return childRegexSource===regexpSource;});if(parametricChild){return parametricChild;}parametricChild=new ParametricNode(regex,staticSuffix);this.parametricChildren.push(parametricChild);this.parametricChildren.sort((child1,child2)=>{if(!child1.isRegex)return 1;if(!child2.isRegex)return-1;if(child1.staticSuffix===null)return 1;if(child2.staticSuffix===null)return-1;if(child2.staticSuffix.endsWith(child1.staticSuffix))return 1;if(child1.staticSuffix.endsWith(child2.staticSuffix))return-1;return 0;});return parametricChild;}createWildcardChild(){if(this.wildcardChild){return this.wildcardChild;}this.wildcardChild=new WildcardNode();return this.wildcardChild;}split(parentNode,length){const parentPrefix=this.prefix.slice(0,length);const childPrefix=this.prefix.slice(length);this.prefix=childPrefix;this._compilePrefixMatch();const staticNode=new StaticNode(parentPrefix);staticNode.staticChildren[childPrefix.charAt(0)]=this;parentNode.staticChildren[parentPrefix.charAt(0)]=staticNode;return staticNode;}getNextNode(path,pathIndex,nodeStack,paramsCount){let node=this.findStaticMatchingChild(path,pathIndex);let parametricBrotherNodeIndex=0;if(node===null){if(this.parametricChildren.length===0){return this.wildcardChild;}node=this.parametricChildren[0];parametricBrotherNodeIndex=1;}if(this.wildcardChild!==null){nodeStack.push({paramsCount,brotherPathIndex:pathIndex,brotherNode:this.wildcardChild});}for(let i=this.parametricChildren.length-1;i>=parametricBrotherNodeIndex;i--){nodeStack.push({paramsCount,brotherPathIndex:pathIndex,brotherNode:this.parametricChildren[i]});}return node;}_compilePrefixMatch(){if(this.prefix.length===1){this.matchPrefix=()=>true;return;}const lines=[];for(let i=1;i<this.prefix.length;i++){const charCode=this.prefix.charCodeAt(i);lines.push(`path.charCodeAt(i + ${i}) === ${charCode}`);}this.matchPrefix=new Function('path','i',`return ${lines.join(' && ')}`);// eslint-disable-line
}}class ParametricNode extends ParentNode{constructor(regex,staticSuffix){super();this.isRegex=!!regex;this.regex=regex||null;this.staticSuffix=staticSuffix||null;this.kind=NODE_TYPES.PARAMETRIC;}getNextNode(path,pathIndex){return this.findStaticMatchingChild(path,pathIndex);}}class WildcardNode extends Node{constructor(){super();this.kind=NODE_TYPES.WILDCARD;}getNextNode(){return null;}}module.exports={StaticNode,ParametricNode,WildcardNode,NODE_TYPES};},{"./handler_storage":24}],24:[function(require,module,exports){'use strict';class HandlerStorage{constructor(){this.unconstrainedHandler=null;// optimized reference to the handler that will match most of the time
this.constraints=[];this.handlers=[];// unoptimized list of handler objects for which the fast matcher function will be compiled
this.constrainedHandlerStores=null;}// This is the hot path for node handler finding -- change with care!
getMatchingHandler(derivedConstraints){if(derivedConstraints===undefined){return this.unconstrainedHandler;}return this._getHandlerMatchingConstraints(derivedConstraints);}addHandler(handler,params,store,constrainer,constraints){const handlerObject={handler,params,constraints,store:store||null,_createParamsObject:this._compileCreateParamsObject(params)};if(Object.keys(constraints).length===0){this.unconstrainedHandler=handlerObject;}for(const constraint of Object.keys(constraints)){if(!this.constraints.includes(constraint)){if(constraint==='version'){// always check the version constraint first as it is the most selective
this.constraints.unshift(constraint);}else{this.constraints.push(constraint);}}}if(this.handlers.length>=32){throw new Error('find-my-way supports a maximum of 32 route handlers per node when there are constraints, limit reached');}this.handlers.push(handlerObject);// Sort the most constrained handlers to the front of the list of handlers so they are tested first.
this.handlers.sort((a,b)=>Object.keys(a.constraints).length-Object.keys(b.constraints).length);this._compileGetHandlerMatchingConstraints(constrainer,constraints);}_compileCreateParamsObject(params){const lines=[];for(let i=0;i<params.length;i++){lines.push(`'${params[i]}': paramsArray[${i}]`);}return new Function('paramsArray',`return {${lines.join(',')}}`);// eslint-disable-line
}_getHandlerMatchingConstraints(){return null;}// Builds a store object that maps from constraint values to a bitmap of handler indexes which pass the constraint for a value
// So for a host constraint, this might look like { "fastify.io": 0b0010, "google.ca": 0b0101 }, meaning the 3rd handler is constrainted to fastify.io, and the 2nd and 4th handlers are constrained to google.ca.
// The store's implementation comes from the strategies provided to the Router.
_buildConstraintStore(store,constraint){for(let i=0;i<this.handlers.length;i++){const handler=this.handlers[i];const constraintValue=handler.constraints[constraint];if(constraintValue!==undefined){let indexes=store.get(constraintValue)||0;indexes|=1<<i;// set the i-th bit for the mask because this handler is constrained by this value https://stackoverflow.com/questions/1436438/how-do-you-set-clear-and-toggle-a-single-bit-in-javascrip
store.set(constraintValue,indexes);}}}// Builds a bitmask for a given constraint that has a bit for each handler index that is 0 when that handler *is* constrained and 1 when the handler *isnt* constrainted. This is opposite to what might be obvious, but is just for convienience when doing the bitwise operations.
_constrainedIndexBitmask(constraint){let mask=0;for(let i=0;i<this.handlers.length;i++){const handler=this.handlers[i];const constraintValue=handler.constraints[constraint];if(constraintValue!==undefined){mask|=1<<i;}}return~mask;}// Compile a fast function to match the handlers for this node
// The function implements a general case multi-constraint matching algorithm.
// The general idea is this: we have a bunch of handlers, each with a potentially different set of constraints, and sometimes none at all. We're given a list of constraint values and we have to use the constraint-value-comparison strategies to see which handlers match the constraint values passed in.
// We do this by asking each constraint store which handler indexes match the given constraint value for each store. Trickily, the handlers that a store says match are the handlers constrained by that store, but handlers that aren't constrained at all by that store could still match just fine. So, each constraint store can only describe matches for it, and it won't have any bearing on the handlers it doesn't care about. For this reason, we have to ask each stores which handlers match and track which have been matched (or not cared about) by all of them.
// We use bitmaps to represent these lists of matches so we can use bitwise operations to implement this efficiently. Bitmaps are cheap to allocate, let us implement this masking behaviour in one CPU instruction, and are quite compact in memory. We start with a bitmap set to all 1s representing every handler that is a match candidate, and then for each constraint, see which handlers match using the store, and then mask the result by the mask of handlers that that store applies to, and bitwise AND with the candidate list. Phew.
// We consider all this compiling function complexity to be worth it, because the naive implementation that just loops over the handlers asking which stores match is quite a bit slower.
_compileGetHandlerMatchingConstraints(constrainer){this.constrainedHandlerStores={};for(const constraint of this.constraints){const store=constrainer.newStoreForConstraint(constraint);this.constrainedHandlerStores[constraint]=store;this._buildConstraintStore(store,constraint);}const lines=[];lines.push(`
    let candidates = ${(1<<this.handlers.length)-1}
    let mask, matches
    `);for(const constraint of this.constraints){// Setup the mask for indexes this constraint applies to. The mask bits are set to 1 for each position if the constraint applies.
lines.push(`
      mask = ${this._constrainedIndexBitmask(constraint)}
      value = derivedConstraints.${constraint}
      `);// If there's no constraint value, none of the handlers constrained by this constraint can match. Remove them from the candidates.
// If there is a constraint value, get the matching indexes bitmap from the store, and mask it down to only the indexes this constraint applies to, and then bitwise and with the candidates list to leave only matching candidates left.
const strategy=constrainer.strategies[constraint];const matchMask=strategy.mustMatchWhenDerived?'matches':'(matches | mask)';lines.push(`
      if (value === undefined) {
        candidates &= mask
      } else {
        matches = this.constrainedHandlerStores.${constraint}.get(value) || 0
        candidates &= ${matchMask}
      }
      if (candidates === 0) return null;
      `);}// There are some constraints that can be derived and marked as "must match", where if they are derived, they only match routes that actually have a constraint on the value, like the SemVer version constraint.
// An example: a request comes in for version 1.x, and this node has a handler that matches the path, but there's no version constraint. For SemVer, the find-my-way semantics do not match this handler to that request.
// This function is used by Nodes with handlers to match when they don't have any constrained routes to exclude request that do have must match derived constraints present.
for(const constraint in constrainer.strategies){const strategy=constrainer.strategies[constraint];if(strategy.mustMatchWhenDerived&&!this.constraints.includes(constraint)){lines.push(`if (derivedConstraints.${constraint} !== undefined) return null`);}}// Return the first handler who's bit is set in the candidates https://stackoverflow.com/questions/18134985/how-to-find-index-of-first-set-bit
lines.push('return this.handlers[Math.floor(Math.log2(candidates))]');this._getHandlerMatchingConstraints=new Function('derivedConstraints',lines.join('\n'));// eslint-disable-line
}}module.exports=HandlerStorage;},{}],25:[function(require,module,exports){'use strict';/*
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
*/const assert=require('assert');const querystring=require('fast-querystring');const isRegexSafe=require('safe-regex2');const deepEqual=require('fast-deep-equal');const{flattenNode,compressFlattenedNode,prettyPrintFlattenedNode,prettyPrintRoutesArray}=require('./lib/pretty-print');const{StaticNode,NODE_TYPES}=require('./custom_node');const Constrainer=require('./lib/constrainer');const httpMethods=require('./lib/http-methods');const{safeDecodeURI,safeDecodeURIComponent}=require('./lib/url-sanitizer');const FULL_PATH_REGEXP=/^https?:\/\/.*?\//;const OPTIONAL_PARAM_REGEXP=/(\/:[^/()]*?)\?(\/?)/;if(!isRegexSafe(FULL_PATH_REGEXP)){throw new Error('the FULL_PATH_REGEXP is not safe, update this module');}if(!isRegexSafe(OPTIONAL_PARAM_REGEXP)){throw new Error('the OPTIONAL_PARAM_REGEXP is not safe, update this module');}function Router(opts){if(!(this instanceof Router)){return new Router(opts);}opts=opts||{};if(opts.defaultRoute){assert(typeof opts.defaultRoute==='function','The default route must be a function');this.defaultRoute=opts.defaultRoute;}else{this.defaultRoute=null;}if(opts.onBadUrl){assert(typeof opts.onBadUrl==='function','The bad url handler must be a function');this.onBadUrl=opts.onBadUrl;}else{this.onBadUrl=null;}if(opts.buildPrettyMeta){assert(typeof opts.buildPrettyMeta==='function','buildPrettyMeta must be a function');this.buildPrettyMeta=opts.buildPrettyMeta;}else{this.buildPrettyMeta=defaultBuildPrettyMeta;}if(opts.querystringParser){assert(typeof opts.querystringParser==='function','querystringParser must be a function');this.querystringParser=opts.querystringParser;}else{this.querystringParser=query=>query===''?{}:querystring.parse(query);}this.caseSensitive=opts.caseSensitive===undefined?true:opts.caseSensitive;this.ignoreTrailingSlash=opts.ignoreTrailingSlash||false;this.ignoreDuplicateSlashes=opts.ignoreDuplicateSlashes||false;this.maxParamLength=opts.maxParamLength||100;this.allowUnsafeRegex=opts.allowUnsafeRegex||false;this.routes=[];this.trees={};this.constrainer=new Constrainer(opts.constraints);this._routesPatterns={};}Router.prototype.on=function on(method,path,opts,handler,store){if(typeof opts==='function'){if(handler!==undefined){store=handler;}handler=opts;opts={};}// path validation
assert(typeof path==='string','Path should be a string');assert(path.length>0,'The path could not be empty');assert(path[0]==='/'||path[0]==='*','The first character of a path should be `/` or `*`');// handler validation
assert(typeof handler==='function','Handler should be a function');// path ends with optional parameter
const optionalParamMatch=path.match(OPTIONAL_PARAM_REGEXP);if(optionalParamMatch){assert(path.length===optionalParamMatch.index+optionalParamMatch[0].length,'Optional Parameter needs to be the last parameter of the path');const pathFull=path.replace(OPTIONAL_PARAM_REGEXP,'$1$2');const pathOptional=path.replace(OPTIONAL_PARAM_REGEXP,'$2');this.on(method,pathFull,opts,handler,store);this.on(method,pathOptional,opts,handler,store);return;}const route=path;if(this.ignoreDuplicateSlashes){path=removeDuplicateSlashes(path);}if(this.ignoreTrailingSlash){path=trimLastSlash(path);}const methods=Array.isArray(method)?method:[method];for(const method of methods){this._on(method,path,opts,handler,store,route);this.routes.push({method,path,opts,handler,store});}};Router.prototype._on=function _on(method,path,opts,handler,store){assert(typeof method==='string','Method should be a string');assert(httpMethods.includes(method),`Method '${method}' is not an http method.`);let constraints={};if(opts.constraints!==undefined){assert(typeof opts.constraints==='object'&&opts.constraints!==null,'Constraints should be an object');if(Object.keys(opts.constraints).length!==0){constraints=opts.constraints;}}this.constrainer.validateConstraints(constraints);// Let the constrainer know if any constraints are being used now
this.constrainer.noteUsage(constraints);// Boot the tree for this method if it doesn't exist yet
if(this.trees[method]===undefined){this.trees[method]=new StaticNode('/');this._routesPatterns[method]=[];}if(path==='*'&&this.trees[method].prefix.length!==0){const currentRoot=this.trees[method];this.trees[method]=new StaticNode('');this.trees[method].staticChildren['/']=currentRoot;}let currentNode=this.trees[method];let parentNodePathIndex=currentNode.prefix.length;const params=[];for(let i=0;i<=path.length;i++){if(path.charCodeAt(i)===58&&path.charCodeAt(i+1)===58){// It's a double colon
i++;continue;}const isParametricNode=path.charCodeAt(i)===58&&path.charCodeAt(i+1)!==58;const isWildcardNode=path.charCodeAt(i)===42;if(isParametricNode||isWildcardNode||i===path.length&&i!==parentNodePathIndex){let staticNodePath=path.slice(parentNodePathIndex,i);if(!this.caseSensitive){staticNodePath=staticNodePath.toLowerCase();}staticNodePath=staticNodePath.split('::').join(':');staticNodePath=staticNodePath.split('%').join('%25');// add the static part of the route to the tree
currentNode=currentNode.createStaticChild(staticNodePath);}if(isParametricNode){let isRegexNode=false;const regexps=[];let lastParamStartIndex=i+1;for(let j=lastParamStartIndex;;j++){const charCode=path.charCodeAt(j);const isRegexParam=charCode===40;const isStaticPart=charCode===45||charCode===46;const isEndOfNode=charCode===47||j===path.length;if(isRegexParam||isStaticPart||isEndOfNode){const paramName=path.slice(lastParamStartIndex,j);params.push(paramName);isRegexNode=isRegexNode||isRegexParam||isStaticPart;if(isRegexParam){const endOfRegexIndex=getClosingParenthensePosition(path,j);const regexString=path.slice(j,endOfRegexIndex+1);if(!this.allowUnsafeRegex){assert(isRegexSafe(new RegExp(regexString)),`The regex '${regexString}' is not safe!`);}regexps.push(trimRegExpStartAndEnd(regexString));j=endOfRegexIndex+1;}else{regexps.push('(.*?)');}const staticPartStartIndex=j;for(;j<path.length;j++){const charCode=path.charCodeAt(j);if(charCode===47)break;if(charCode===58){const nextCharCode=path.charCodeAt(j+1);if(nextCharCode===58)j++;else break;}}let staticPart=path.slice(staticPartStartIndex,j);if(staticPart){staticPart=staticPart.split('::').join(':');staticPart=staticPart.split('%').join('%25');regexps.push(escapeRegExp(staticPart));}lastParamStartIndex=j+1;if(isEndOfNode||path.charCodeAt(j)===47||j===path.length){const nodePattern=isRegexNode?'()'+staticPart:staticPart;path=path.slice(0,i+1)+nodePattern+path.slice(j);i+=nodePattern.length;const regex=isRegexNode?new RegExp('^'+regexps.join('')+'$'):null;currentNode=currentNode.createParametricChild(regex,staticPart||null);parentNodePathIndex=i+1;break;}}}}else if(isWildcardNode){// add the wildcard parameter
params.push('*');currentNode=currentNode.createWildcardChild();parentNodePathIndex=i+1;if(i!==path.length-1){throw new Error('Wildcard must be the last character in the route');}}}if(!this.caseSensitive){path=path.toLowerCase();}if(path==='*'){path='/*';}for(const existRoute of this._routesPatterns[method]){if(existRoute.path===path&&deepEqual(existRoute.constraints,constraints)){throw new Error(`Method '${method}' already declared for route '${path}' with constraints '${JSON.stringify(constraints)}'`);}}this._routesPatterns[method].push({path,params,constraints});currentNode.handlerStorage.addHandler(handler,params,store,this.constrainer,constraints);};Router.prototype.hasConstraintStrategy=function(strategyName){return this.constrainer.hasConstraintStrategy(strategyName);};Router.prototype.addConstraintStrategy=function(constraints){this.constrainer.addConstraintStrategy(constraints);this._rebuild(this.routes);};Router.prototype.reset=function reset(){this.trees={};this.routes=[];this._routesPatterns={};};Router.prototype.off=function off(method,path,constraints){// path validation
assert(typeof path==='string','Path should be a string');assert(path.length>0,'The path could not be empty');assert(path[0]==='/'||path[0]==='*','The first character of a path should be `/` or `*`');// options validation
assert(typeof constraints==='undefined'||typeof constraints==='object'&&!Array.isArray(constraints)&&constraints!==null,'Constraints should be an object or undefined.');// path ends with optional parameter
const optionalParamMatch=path.match(OPTIONAL_PARAM_REGEXP);if(optionalParamMatch){assert(path.length===optionalParamMatch.index+optionalParamMatch[0].length,'Optional Parameter needs to be the last parameter of the path');const pathFull=path.replace(OPTIONAL_PARAM_REGEXP,'$1$2');const pathOptional=path.replace(OPTIONAL_PARAM_REGEXP,'$2');this.off(method,pathFull,constraints);this.off(method,pathOptional,constraints);return;}if(this.ignoreDuplicateSlashes){path=removeDuplicateSlashes(path);}if(this.ignoreTrailingSlash){path=trimLastSlash(path);}const methods=Array.isArray(method)?method:[method];for(const method of methods){this._off(method,path,constraints);}};Router.prototype._off=function _off(method,path,constraints){// method validation
assert(typeof method==='string','Method should be a string');assert(httpMethods.includes(method),`Method '${method}' is not an http method.`);function matcherWithoutConstraints(route){return method!==route.method||path!==route.path;}function matcherWithConstraints(route){return matcherWithoutConstraints(route)||!deepEqual(constraints,route.opts.constraints||{});}const predicate=constraints?matcherWithConstraints:matcherWithoutConstraints;// Rebuild tree without the specific route
const newRoutes=this.routes.filter(predicate);this._rebuild(newRoutes);};Router.prototype.lookup=function lookup(req,res,ctx,done){if(typeof ctx==='function'){done=ctx;ctx=undefined;}if(done===undefined){const constraints=this.constrainer.deriveConstraints(req,ctx);const handle=this.find(req.method,req.url,constraints);return this.callHandler(handle,req,res,ctx);}this.constrainer.deriveConstraints(req,ctx,(err,constraints)=>{if(err!==null){done(err);return;}try{const handle=this.find(req.method,req.url,constraints);const result=this.callHandler(handle,req,res,ctx);done(null,result);}catch(err){done(err);}});};Router.prototype.callHandler=function callHandler(handle,req,res,ctx){if(handle===null)return this._defaultRoute(req,res,ctx);return ctx===undefined?handle.handler(req,res,handle.params,handle.store,handle.searchParams):handle.handler.call(ctx,req,res,handle.params,handle.store,handle.searchParams);};Router.prototype.find=function find(method,path,derivedConstraints){let currentNode=this.trees[method];if(currentNode===undefined)return null;if(path.charCodeAt(0)!==47){// 47 is '/'
path=path.replace(FULL_PATH_REGEXP,'/');}// This must be run before sanitizeUrl as the resulting function
// .sliceParameter must be constructed with same URL string used
// throughout the rest of this function.
if(this.ignoreDuplicateSlashes){path=removeDuplicateSlashes(path);}let sanitizedUrl;let querystring;let shouldDecodeParam;try{sanitizedUrl=safeDecodeURI(path);path=sanitizedUrl.path;querystring=sanitizedUrl.querystring;shouldDecodeParam=sanitizedUrl.shouldDecodeParam;}catch(error){return this._onBadUrl(path);}if(this.ignoreTrailingSlash){path=trimLastSlash(path);}const originPath=path;if(this.caseSensitive===false){path=path.toLowerCase();}const maxParamLength=this.maxParamLength;let pathIndex=currentNode.prefix.length;const params=[];const pathLen=path.length;const brothersNodesStack=[];while(true){if(pathIndex===pathLen){const handle=currentNode.handlerStorage.getMatchingHandler(derivedConstraints);if(handle!==null){return{handler:handle.handler,store:handle.store,params:handle._createParamsObject(params),searchParams:this.querystringParser(querystring)};}}let node=currentNode.getNextNode(path,pathIndex,brothersNodesStack,params.length);if(node===null){if(brothersNodesStack.length===0){return null;}const brotherNodeState=brothersNodesStack.pop();pathIndex=brotherNodeState.brotherPathIndex;params.splice(brotherNodeState.paramsCount);node=brotherNodeState.brotherNode;}currentNode=node;// static route
if(currentNode.kind===NODE_TYPES.STATIC){pathIndex+=currentNode.prefix.length;continue;}if(currentNode.kind===NODE_TYPES.WILDCARD){let param=originPath.slice(pathIndex);if(shouldDecodeParam){param=safeDecodeURIComponent(param);}params.push(param);pathIndex=pathLen;continue;}if(currentNode.kind===NODE_TYPES.PARAMETRIC){let paramEndIndex=originPath.indexOf('/',pathIndex);if(paramEndIndex===-1){paramEndIndex=pathLen;}let param=originPath.slice(pathIndex,paramEndIndex);if(shouldDecodeParam){param=safeDecodeURIComponent(param);}if(currentNode.isRegex){const matchedParameters=currentNode.regex.exec(param);if(matchedParameters===null)continue;for(let i=1;i<matchedParameters.length;i++){const matchedParam=matchedParameters[i];if(matchedParam.length>maxParamLength){return null;}params.push(matchedParam);}}else{if(param.length>maxParamLength){return null;}params.push(param);}pathIndex=paramEndIndex;}}};Router.prototype._rebuild=function(routes){this.reset();for(const route of routes){const{method,path,opts,handler,store}=route;this._on(method,path,opts,handler,store);this.routes.push({method,path,opts,handler,store});}};Router.prototype._defaultRoute=function(req,res,ctx){if(this.defaultRoute!==null){return ctx===undefined?this.defaultRoute(req,res):this.defaultRoute.call(ctx,req,res);}else{res.statusCode=404;res.end();}};Router.prototype._onBadUrl=function(path){if(this.onBadUrl===null){return null;}const onBadUrl=this.onBadUrl;return{handler:(req,res,ctx)=>onBadUrl(path,req,res),params:{},store:null};};Router.prototype.prettyPrint=function(opts={}){opts.commonPrefix=opts.commonPrefix===undefined?true:opts.commonPrefix;// default to original behaviour
if(!opts.commonPrefix)return prettyPrintRoutesArray.call(this,this.routes,opts);const root={prefix:'/',nodes:[],children:{}};for(const method in this.trees){const node=this.trees[method];if(node){flattenNode(root,node,method);}}compressFlattenedNode(root);return prettyPrintFlattenedNode.call(this,root,'',true,opts);};for(var i in httpMethods){/* eslint no-prototype-builtins: "off" */if(!httpMethods.hasOwnProperty(i))continue;const m=httpMethods[i];const methodName=m.toLowerCase();if(Router.prototype[methodName])throw new Error('Method already exists: '+methodName);Router.prototype[methodName]=function(path,handler,store){return this.on(m,path,handler,store);};}Router.prototype.all=function(path,handler,store){this.on(httpMethods,path,handler,store);};module.exports=Router;function escapeRegExp(string){return string.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}function removeDuplicateSlashes(path){return path.replace(/\/\/+/g,'/');}function trimLastSlash(path){if(path.length>1&&path.charCodeAt(path.length-1)===47){return path.slice(0,-1);}return path;}function trimRegExpStartAndEnd(regexString){// removes chars that marks start "^" and end "$" of regexp
if(regexString.charCodeAt(1)===94){regexString=regexString.slice(0,1)+regexString.slice(2);}if(regexString.charCodeAt(regexString.length-2)===36){regexString=regexString.slice(0,regexString.length-2)+regexString.slice(regexString.length-1);}return regexString;}function getClosingParenthensePosition(path,idx){// `path.indexOf()` will always return the first position of the closing parenthese,
// but it's inefficient for grouped or wrong regexp expressions.
// see issues #62 and #63 for more info
var parentheses=1;while(idx<path.length){idx++;// ignore skipped chars
if(path[idx]==='\\'){idx++;continue;}if(path[idx]===')'){parentheses--;}else if(path[idx]==='('){parentheses++;}if(!parentheses)return idx;}throw new TypeError('Invalid regexp expression in "'+path+'"');}function defaultBuildPrettyMeta(route){// buildPrettyMeta function must return an object, which will be parsed into key/value pairs for display
if(!route)return{};if(!route.store)return{};return Object.assign({},route.store);}},{"./custom_node":23,"./lib/constrainer":26,"./lib/http-methods":27,"./lib/pretty-print":28,"./lib/url-sanitizer":31,"assert":1,"fast-deep-equal":18,"fast-querystring":19,"safe-regex2":38}],26:[function(require,module,exports){'use strict';const acceptVersionStrategy=require('./strategies/accept-version');const acceptHostStrategy=require('./strategies/accept-host');const assert=require('assert');class Constrainer{constructor(customStrategies){this.strategies={version:acceptVersionStrategy,host:acceptHostStrategy};this.strategiesInUse=new Set();this.asyncStrategiesInUse=new Set();// validate and optimize prototypes of given custom strategies
if(customStrategies){for(const strategy of Object.values(customStrategies)){this.addConstraintStrategy(strategy);}}}isStrategyUsed(strategyName){return this.strategiesInUse.has(strategyName)||this.asyncStrategiesInUse.has(strategyName);}hasConstraintStrategy(strategyName){const customConstraintStrategy=this.strategies[strategyName];if(customConstraintStrategy!==undefined){return customConstraintStrategy.isCustom||this.isStrategyUsed(strategyName);}return false;}addConstraintStrategy(strategy){assert(typeof strategy.name==='string'&&strategy.name!=='','strategy.name is required.');assert(strategy.storage&&typeof strategy.storage==='function','strategy.storage function is required.');assert(strategy.deriveConstraint&&typeof strategy.deriveConstraint==='function','strategy.deriveConstraint function is required.');if(this.strategies[strategy.name]&&this.strategies[strategy.name].isCustom){throw new Error(`There already exists a custom constraint with the name ${strategy.name}.`);}if(this.isStrategyUsed(strategy.name)){throw new Error(`There already exists a route with ${strategy.name} constraint.`);}strategy.isCustom=true;strategy.isAsync=strategy.deriveConstraint.length===3;this.strategies[strategy.name]=strategy;if(strategy.mustMatchWhenDerived){this.noteUsage({[strategy.name]:strategy});}}deriveConstraints(req,ctx,done){const constraints=this.deriveSyncConstraints(req,ctx);if(done===undefined){return constraints;}this.deriveAsyncConstraints(constraints,req,ctx,done);}deriveSyncConstraints(req,ctx){return undefined;}// When new constraints start getting used, we need to rebuild the deriver to derive them. Do so if we see novel constraints used.
noteUsage(constraints){if(constraints){const beforeSize=this.strategiesInUse.size;for(const key in constraints){const strategy=this.strategies[key];if(strategy.isAsync){this.asyncStrategiesInUse.add(key);}else{this.strategiesInUse.add(key);}}if(beforeSize!==this.strategiesInUse.size){this._buildDeriveConstraints();}}}newStoreForConstraint(constraint){if(!this.strategies[constraint]){throw new Error(`No strategy registered for constraint key ${constraint}`);}return this.strategies[constraint].storage();}validateConstraints(constraints){for(const key in constraints){const value=constraints[key];if(typeof value==='undefined'){throw new Error('Can\'t pass an undefined constraint value, must pass null or no key at all');}const strategy=this.strategies[key];if(!strategy){throw new Error(`No strategy registered for constraint key ${key}`);}if(strategy.validate){strategy.validate(value);}}}deriveAsyncConstraints(constraints,req,ctx,done){let asyncConstraintsCount=this.asyncStrategiesInUse.size;if(asyncConstraintsCount===0){done(null,constraints);return;}constraints=constraints||{};for(const key of this.asyncStrategiesInUse){const strategy=this.strategies[key];strategy.deriveConstraint(req,ctx,(err,constraintValue)=>{if(err!==null){done(err);return;}constraints[key]=constraintValue;if(--asyncConstraintsCount===0){done(null,constraints);}});}}// Optimization: build a fast function for deriving the constraints for all the strategies at once. We inline the definitions of the version constraint and the host constraint for performance.
// If no constraining strategies are in use (no routes constrain on host, or version, or any custom strategies) then we don't need to derive constraints for each route match, so don't do anything special, and just return undefined
// This allows us to not allocate an object to hold constraint values if no constraints are defined.
_buildDeriveConstraints(){if(this.strategiesInUse.size===0)return;const lines=['return {'];for(const key of this.strategiesInUse){const strategy=this.strategies[key];// Optimization: inline the derivation for the common built in constraints
if(!strategy.isCustom){if(key==='version'){lines.push('   version: req.headers[\'accept-version\'],');}else if(key==='host'){lines.push('   host: req.headers.host || req.headers[\':authority\'],');}else{throw new Error('unknown non-custom strategy for compiling constraint derivation function');}}else{lines.push(`  ${strategy.name}: this.strategies.${key}.deriveConstraint(req, ctx),`);}}lines.push('}');this.deriveSyncConstraints=new Function('req','ctx',lines.join('\n')).bind(this);// eslint-disable-line
}}module.exports=Constrainer;},{"./strategies/accept-host":29,"./strategies/accept-version":30,"assert":1}],27:[function(require,module,exports){'use strict';// defined by Node.js http module, a snapshot from Node.js 18.12.0
const httpMethods=['ACL','BIND','CHECKOUT','CONNECT','COPY','DELETE','GET','HEAD','LINK','LOCK','M-SEARCH','MERGE','MKACTIVITY','MKCALENDAR','MKCOL','MOVE','NOTIFY','OPTIONS','PATCH','POST','PROPFIND','PROPPATCH','PURGE','PUT','REBIND','REPORT','SEARCH','SOURCE','SUBSCRIBE','TRACE','UNBIND','UNLINK','UNLOCK','UNSUBSCRIBE'];module.exports=httpMethods;},{}],28:[function(require,module,exports){'use strict';/* eslint-disable no-multi-spaces */const indent='    ';const branchIndent='│   ';const midBranchIndent='├── ';const endBranchIndent='└── ';const wildcardDelimiter='*';const pathDelimiter='/';const pathRegExp=/(?=\/)/;/* eslint-enable */function parseFunctionName(fn){let fName=fn.name||'';fName=fName.replace('bound','').trim();fName=(fName||'anonymous')+'()';return fName;}function parseMeta(meta){if(Array.isArray(meta))return meta.map(m=>parseMeta(m));if(typeof meta==='symbol')return meta.toString();if(typeof meta==='function')return parseFunctionName(meta);return meta;}function buildMetaObject(route,metaArray){const out={};const cleanMeta=this.buildPrettyMeta(route);if(!Array.isArray(metaArray))metaArray=cleanMeta?Reflect.ownKeys(cleanMeta):[];metaArray.forEach(m=>{const metaKey=typeof m==='symbol'?m.toString():m;if(cleanMeta&&cleanMeta[m]){out[metaKey]=parseMeta(cleanMeta[m]);}});return out;}function prettyPrintRoutesArray(routeArray,opts={}){if(!this.buildPrettyMeta)throw new Error('buildPrettyMeta not defined');opts.includeMeta=opts.includeMeta||null;// array of meta objects to display
const mergedRouteArray=[];let tree='';routeArray.sort((a,b)=>{if(!a.path||!b.path)return 0;return a.path.localeCompare(b.path);});// merge alike paths
for(let i=0;i<routeArray.length;i++){const route=routeArray[i];const pathExists=mergedRouteArray.find(r=>route.path===r.path);if(pathExists){// path already declared, add new method and break out of loop
pathExists.handlers.push({method:route.method,opts:route.opts.constraints||undefined,meta:opts.includeMeta?buildMetaObject.call(this,route,opts.includeMeta):null});continue;}const routeHandler={method:route.method,opts:route.opts.constraints||undefined,meta:opts.includeMeta?buildMetaObject.call(this,route,opts.includeMeta):null};mergedRouteArray.push({path:route.path,methods:[route.method],opts:[route.opts],handlers:[routeHandler]});}// insert root level path if none defined
if(!mergedRouteArray.filter(r=>r.path===pathDelimiter).length){const rootPath={path:pathDelimiter,truncatedPath:'',methods:[],opts:[],handlers:[{}]};// if wildcard route exists, insert root level after wildcard
if(mergedRouteArray.filter(r=>r.path===wildcardDelimiter).length){mergedRouteArray.splice(1,0,rootPath);}else{mergedRouteArray.unshift(rootPath);}}// build tree
const routeTree=buildRouteTree(mergedRouteArray);// draw tree
routeTree.forEach((rootBranch,idx)=>{tree+=drawBranch(rootBranch,null,idx===routeTree.length-1,false,true);tree+='\n';// newline characters inserted at beginning of drawing function to allow for nested paths
});return tree;}function buildRouteTree(mergedRouteArray){const result=[];const temp={result};mergedRouteArray.forEach((route,idx)=>{let splitPath=route.path.split(pathRegExp);// add preceding slash for proper nesting
if(splitPath[0]!==pathDelimiter){// handle wildcard route
if(splitPath[0]!==wildcardDelimiter)splitPath=[pathDelimiter,splitPath[0].slice(1),...splitPath.slice(1)];}// build tree
splitPath.reduce((acc,path,pidx)=>{if(!acc[path]){acc[path]={result:[]};const pathSeg={path,children:acc[path].result};if(pidx===splitPath.length-1)pathSeg.handlers=route.handlers;acc.result.push(pathSeg);}return acc[path];},temp);});// unfold root object from array
return result;}function drawBranch(pathSeg,prefix,endBranch,noPrefix,rootBranch){let branch='';if(!noPrefix&&!rootBranch)branch+='\n';if(!noPrefix)branch+=`${prefix||''}${endBranch?endBranchIndent:midBranchIndent}`;branch+=`${pathSeg.path}`;if(pathSeg.handlers){const flatHandlers=pathSeg.handlers.reduce((acc,curr)=>{const match=acc.findIndex(h=>JSON.stringify(h.opts)===JSON.stringify(curr.opts));if(match!==-1){acc[match].method=[acc[match].method,curr.method].join(', ');}else{acc.push(curr);}return acc;},[]);flatHandlers.forEach((handler,idx)=>{if(idx>0)branch+=`${noPrefix?'':prefix||''}${endBranch?indent:branchIndent}${pathSeg.path}`;branch+=` (${handler.method||'-'})`;if(handler.opts&&JSON.stringify(handler.opts)!=='{}')branch+=` ${JSON.stringify(handler.opts)}`;if(handler.meta){Reflect.ownKeys(handler.meta).forEach((m,hidx)=>{branch+=`\n${noPrefix?'':prefix||''}${endBranch?indent:branchIndent}`;branch+=`• (${m}) ${JSON.stringify(handler.meta[m])}`;});}if(flatHandlers.length>1&&idx!==flatHandlers.length-1)branch+='\n';});}else{if(pathSeg.children.length>1)branch+=' (-)';}if(!noPrefix)prefix=`${prefix||''}${endBranch?indent:branchIndent}`;pathSeg.children.forEach((child,idx)=>{const endBranch=idx===pathSeg.children.length-1;const skipPrefix=!pathSeg.handlers&&pathSeg.children.length===1;branch+=drawBranch(child,prefix,endBranch,skipPrefix);});return branch;}function prettyPrintFlattenedNode(flattenedNode,prefix,tail,opts){if(!this.buildPrettyMeta)throw new Error('buildPrettyMeta not defined');opts.includeMeta=opts.includeMeta||null;// array of meta items to display
let paramName='';const printHandlers=[];for(const{node,method}of flattenedNode.nodes){for(const handler of node.handlerStorage.handlers){printHandlers.push({method,...handler});}}if(printHandlers.length){printHandlers.forEach((handler,index)=>{let suffix=`(${handler.method||'-'})`;if(Object.keys(handler.constraints).length>0){suffix+=' '+JSON.stringify(handler.constraints);}let name='';// find locations of parameters in prefix
const paramIndices=flattenedNode.prefix.split('').map((ch,idx)=>ch===':'?idx:null).filter(idx=>idx!==null);if(paramIndices.length){let prevLoc=0;paramIndices.forEach((loc,idx)=>{// find parameter in prefix
name+=flattenedNode.prefix.slice(prevLoc,loc+1);// insert parameters
name+=handler.params[handler.params.length-paramIndices.length+idx];if(idx===paramIndices.length-1)name+=flattenedNode.prefix.slice(loc+1);prevLoc=loc+1;});}else{// there are no parameters, return full object
name=flattenedNode.prefix;}if(index===0){paramName+=`${name} ${suffix}`;}else{paramName+=`\n${prefix}${tail?indent:branchIndent}${name} ${suffix}`;}if(opts.includeMeta){const meta=buildMetaObject.call(this,handler,opts.includeMeta);Object.keys(meta).forEach((m,hidx)=>{paramName+=`\n${prefix||''}${tail?indent:branchIndent}`;paramName+=`• (${m}) ${JSON.stringify(meta[m])}`;});}});}else{paramName=flattenedNode.prefix;}let tree=`${prefix}${tail?endBranchIndent:midBranchIndent}${paramName}\n`;prefix=`${prefix}${tail?indent:branchIndent}`;const labels=Object.keys(flattenedNode.children);for(let i=0;i<labels.length;i++){const child=flattenedNode.children[labels[i]];tree+=prettyPrintFlattenedNode.call(this,child,prefix,i===labels.length-1,opts);}return tree;}function flattenNode(flattened,node,method){if(node.handlerStorage.handlers.length!==0){flattened.nodes.push({method,node});}if(node.parametricChildren&&node.parametricChildren[0]){if(!flattened.children[':']){flattened.children[':']={prefix:':',nodes:[],children:{}};}flattenNode(flattened.children[':'],node.parametricChildren[0],method);}if(node.wildcardChild){if(!flattened.children['*']){flattened.children['*']={prefix:'*',nodes:[],children:{}};}flattenNode(flattened.children['*'],node.wildcardChild,method);}if(node.staticChildren){for(const child of Object.values(node.staticChildren)){// split on the slash separator but use a regex to lookahead and not actually match it, preserving it in the returned string segments
const childPrefixSegments=child.prefix.split(pathRegExp);let cursor=flattened;let parent;for(const segment of childPrefixSegments){parent=cursor;cursor=cursor.children[segment];if(!cursor){cursor={prefix:segment,nodes:[],children:{}};parent.children[segment]=cursor;}}flattenNode(cursor,child,method);}}}function compressFlattenedNode(flattenedNode){const childKeys=Object.keys(flattenedNode.children);if(flattenedNode.nodes.length===0&&childKeys.length===1){const child=flattenedNode.children[childKeys[0]];if(child.nodes.length<=1){compressFlattenedNode(child);flattenedNode.nodes=child.nodes;flattenedNode.prefix+=child.prefix;flattenedNode.children=child.children;return flattenedNode;}}for(const key of Object.keys(flattenedNode.children)){compressFlattenedNode(flattenedNode.children[key]);}return flattenedNode;}module.exports={flattenNode,compressFlattenedNode,prettyPrintFlattenedNode,prettyPrintRoutesArray};},{}],29:[function(require,module,exports){'use strict';const assert=require('assert');function HostStorage(){const hosts={};const regexHosts=[];return{get:host=>{const exact=hosts[host];if(exact){return exact;}for(const regex of regexHosts){if(regex.host.test(host)){return regex.value;}}},set:(host,value)=>{if(host instanceof RegExp){regexHosts.push({host,value});}else{hosts[host]=value;}}};}module.exports={name:'host',mustMatchWhenDerived:false,storage:HostStorage,validate(value){assert(typeof value==='string'||Object.prototype.toString.call(value)==='[object RegExp]','Host should be a string or a RegExp');}};},{"assert":1}],30:[function(require,module,exports){'use strict';const assert=require('assert');function SemVerStore(){if(!(this instanceof SemVerStore)){return new SemVerStore();}this.store={};this.maxMajor=0;this.maxMinors={};this.maxPatches={};}SemVerStore.prototype.set=function(version,store){if(typeof version!=='string'){throw new TypeError('Version should be a string');}let[major,minor,patch]=version.split('.');major=Number(major)||0;minor=Number(minor)||0;patch=Number(patch)||0;if(major>=this.maxMajor){this.maxMajor=major;this.store.x=store;this.store['*']=store;this.store['x.x']=store;this.store['x.x.x']=store;}if(minor>=(this.maxMinors[major]||0)){this.maxMinors[major]=minor;this.store[`${major}.x`]=store;this.store[`${major}.x.x`]=store;}if(patch>=(this.store[`${major}.${minor}`]||0)){this.maxPatches[`${major}.${minor}`]=patch;this.store[`${major}.${minor}.x`]=store;}this.store[`${major}.${minor}.${patch}`]=store;return this;};SemVerStore.prototype.get=function(version){return this.store[version];};module.exports={name:'version',mustMatchWhenDerived:true,storage:SemVerStore,validate(value){assert(typeof value==='string','Version should be a string');}};},{"assert":1}],31:[function(require,module,exports){'use strict';// It must spot all the chars where decodeURIComponent(x) !== decodeURI(x)
// The chars are: # $ & + , / : ; = ? @
function decodeComponentChar(highCharCode,lowCharCode){if(highCharCode===50){if(lowCharCode===53)return'%';if(lowCharCode===51)return'#';if(lowCharCode===52)return'$';if(lowCharCode===54)return'&';if(lowCharCode===66)return'+';if(lowCharCode===98)return'+';if(lowCharCode===67)return',';if(lowCharCode===99)return',';if(lowCharCode===70)return'/';if(lowCharCode===102)return'/';return null;}if(highCharCode===51){if(lowCharCode===65)return':';if(lowCharCode===97)return':';if(lowCharCode===66)return';';if(lowCharCode===98)return';';if(lowCharCode===68)return'=';if(lowCharCode===100)return'=';if(lowCharCode===70)return'?';if(lowCharCode===102)return'?';return null;}if(highCharCode===52&&lowCharCode===48){return'@';}return null;}function safeDecodeURI(path){let shouldDecode=false;let shouldDecodeParam=false;let querystring='';for(let i=1;i<path.length;i++){const charCode=path.charCodeAt(i);if(charCode===37){const highCharCode=path.charCodeAt(i+1);const lowCharCode=path.charCodeAt(i+2);if(decodeComponentChar(highCharCode,lowCharCode)===null){shouldDecode=true;}else{shouldDecodeParam=true;// %25 - encoded % char. We need to encode one more time to prevent double decoding
if(highCharCode===50&&lowCharCode===53){shouldDecode=true;path=path.slice(0,i+1)+'25'+path.slice(i+1);i+=2;}i+=2;}// Some systems do not follow RFC and separate the path and query
// string with a `;` character (code 59), e.g. `/foo;jsessionid=123456`.
// Thus, we need to split on `;` as well as `?` and `#`.
}else if(charCode===63||charCode===59||charCode===35){querystring=path.slice(i+1);path=path.slice(0,i);break;}}const decodedPath=shouldDecode?decodeURI(path):path;return{path:decodedPath,querystring,shouldDecodeParam};}function safeDecodeURIComponent(uriComponent){const startIndex=uriComponent.indexOf('%');if(startIndex===-1)return uriComponent;let decoded='';let lastIndex=startIndex;for(let i=startIndex;i<uriComponent.length;i++){if(uriComponent.charCodeAt(i)===37){const highCharCode=uriComponent.charCodeAt(i+1);const lowCharCode=uriComponent.charCodeAt(i+2);const decodedChar=decodeComponentChar(highCharCode,lowCharCode);decoded+=uriComponent.slice(lastIndex,i)+decodedChar;lastIndex=i+3;}}return uriComponent.slice(0,startIndex)+decoded+uriComponent.slice(lastIndex);}module.exports={safeDecodeURI,safeDecodeURIComponent};},{}],32:[function(require,module,exports){/*
object-assign
(c) Sindre Sorhus
@license MIT
*/'use strict';/* eslint-disable no-unused-vars */var getOwnPropertySymbols=Object.getOwnPropertySymbols;var hasOwnProperty=Object.prototype.hasOwnProperty;var propIsEnumerable=Object.prototype.propertyIsEnumerable;function toObject(val){if(val===null||val===undefined){throw new TypeError('Object.assign cannot be called with null or undefined');}return Object(val);}function shouldUseNative(){try{if(!Object.assign){return false;}// Detect buggy property enumeration order in older V8 versions.
// https://bugs.chromium.org/p/v8/issues/detail?id=4118
var test1=new String('abc');// eslint-disable-line no-new-wrappers
test1[5]='de';if(Object.getOwnPropertyNames(test1)[0]==='5'){return false;}// https://bugs.chromium.org/p/v8/issues/detail?id=3056
var test2={};for(var i=0;i<10;i++){test2['_'+String.fromCharCode(i)]=i;}var order2=Object.getOwnPropertyNames(test2).map(function(n){return test2[n];});if(order2.join('')!=='0123456789'){return false;}// https://bugs.chromium.org/p/v8/issues/detail?id=3056
var test3={};'abcdefghijklmnopqrst'.split('').forEach(function(letter){test3[letter]=letter;});if(Object.keys(Object.assign({},test3)).join('')!=='abcdefghijklmnopqrst'){return false;}return true;}catch(err){// We don't expect any of the above to throw, but better to be safe.
return false;}}module.exports=shouldUseNative()?Object.assign:function(target,source){var from;var to=toObject(target);var symbols;for(var s=1;s<arguments.length;s++){from=Object(arguments[s]);for(var key in from){if(hasOwnProperty.call(from,key)){to[key]=from[key];}}if(getOwnPropertySymbols){symbols=getOwnPropertySymbols(from);for(var i=0;i<symbols.length;i++){if(propIsEnumerable.call(from,symbols[i])){to[symbols[i]]=from[symbols[i]];}}}}return to;};},{}],33:[function(require,module,exports){class OratorServiceServerBase{constructor(pOrator){this.orator=pOrator;this.log=pOrator.log;this.Name=this.orator.settings.Product;this.URL='BASE_SERVICE_SERVER';this.Port=this.orator.settings.ServicePort;this.Active=false;}/*
	 * Service Lifecycle Functions
	 *************************************************************************/listen(pPort,fCallback){// Sometimes, listen does not listen on network calls.
this.Active=true;return fCallback();}close(fCallback){this.Active=false;return fCallback();}/*************************************************************************
	 * End of Service Lifecycle Functions
	 */ /*
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
	 *************************************************************************/get(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator GET Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}put(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator PUT Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}post(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator POST Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}del(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator DEL Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}patch(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator PATCH Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}opts(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator OPTS Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}head(pRoute,...fRouteProcessingFunctions){if(typeof pRoute!='string'){this.log.error(`Orator HEAD Route mapping failed -- route parameter was ${typeof pRoute} instead of a string.`);return false;}return true;}/*************************************************************************
	 * End of Service Route Creation Functions
	 */ // Programmatically invoke a route
invoke(pMethod,pRoute,pData,fCallback){// The base class version of this does nothing
this.log.debug(`Orator invoke called for route [${pRoute}] and landed on the base class; the service provider likely does not implement programmatic invoke capabilities.`,pData);return false;}}module.exports=OratorServiceServerBase;},{}],34:[function(require,module,exports){/**
* Precedent Meta-Templating
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Process text streams, parsing out meta-template expressions.
*/var libWordTree=require(`./WordTree.js`);var libStringParser=require(`./StringParser.js`);class Precedent{/**
	 * Precedent Constructor
	 */constructor(){this.WordTree=new libWordTree();this.StringParser=new libStringParser();this.ParseTree=this.WordTree.ParseTree;}/**
	 * Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pTree - A node on the parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - callback function
	 * @return {bool} True if adding the pattern was successful
	 */addPattern(pPatternStart,pPatternEnd,pParser){return this.WordTree.addPattern(pPatternStart,pPatternEnd,pParser);}/**
	 * Parse a string with the existing parse tree
	 * @method parseString
	 * @param {string} pString - The string to parse
	 * @return {string} The result from the parser
	 */parseString(pString){return this.StringParser.parseString(pString,this.ParseTree);}}module.exports=Precedent;},{"./StringParser.js":35,"./WordTree.js":36}],35:[function(require,module,exports){/**
* String Parser
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Parse a string, properly processing each matched token in the word tree.
*/class StringParser{/**
	 * StringParser Constructor
	 */constructor(){}/**
	 * Create a fresh parsing state object to work with.
	 * @method newParserState
	 * @param {Object} pParseTree - A node on the parse tree to begin parsing from (usually root)
	 * @return {Object} A new parser state object for running a character parser on
	 * @private
	 */newParserState(pParseTree){return{ParseTree:pParseTree,Output:'',OutputBuffer:'',Pattern:false,PatternMatch:false,PatternMatchOutputBuffer:''};}/**
	 * Assign a node of the parser tree to be the next potential match.
	 * If the node has a PatternEnd property, it is a valid match and supercedes the last valid match (or becomes the initial match).
	 * @method assignNode
	 * @param {Object} pNode - A node on the parse tree to assign
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */assignNode(pNode,pParserState){pParserState.PatternMatch=pNode;// If the pattern has a END we can assume it has a parse function...
if(pParserState.PatternMatch.hasOwnProperty('PatternEnd')){// ... this is the legitimate start of a pattern.
pParserState.Pattern=pParserState.PatternMatch;}}/**
	 * Append a character to the output buffer in the parser state.
	 * This output buffer is used when a potential match is being explored, or a match is being explored.
	 * @method appendOutputBuffer
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */appendOutputBuffer(pCharacter,pParserState){pParserState.OutputBuffer+=pCharacter;}/**
	 * Flush the output buffer to the output and clear it.
	 * @method flushOutputBuffer
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */flushOutputBuffer(pParserState){pParserState.Output+=pParserState.OutputBuffer;pParserState.OutputBuffer='';}/**
	 * Check if the pattern has ended.  If it has, properly flush the buffer and start looking for new patterns.
	 * @method checkPatternEnd
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */checkPatternEnd(pParserState){if(pParserState.OutputBuffer.length>=pParserState.Pattern.PatternEnd.length+pParserState.Pattern.PatternStart.length&&pParserState.OutputBuffer.substr(-pParserState.Pattern.PatternEnd.length)===pParserState.Pattern.PatternEnd){// ... this is the end of a pattern, cut off the end tag and parse it.
// Trim the start and end tags off the output buffer now
pParserState.OutputBuffer=pParserState.Pattern.Parse(pParserState.OutputBuffer.substr(pParserState.Pattern.PatternStart.length,pParserState.OutputBuffer.length-(pParserState.Pattern.PatternStart.length+pParserState.Pattern.PatternEnd.length)));// Flush the output buffer.
this.flushOutputBuffer(pParserState);// End pattern mode
pParserState.Pattern=false;pParserState.PatternMatch=false;}}/**
	 * Parse a character in the buffer.
	 * @method parseCharacter
	 * @param {string} pCharacter - The character to append
	 * @param {Object} pParserState - The state object for the current parsing task
	 * @private
	 */parseCharacter(pCharacter,pParserState){// (1) If we aren't in a pattern match, and we aren't potentially matching, and this may be the start of a new pattern....
if(!pParserState.PatternMatch&&pParserState.ParseTree.hasOwnProperty(pCharacter)){// ... assign the node as the matched node.
this.assignNode(pParserState.ParseTree[pCharacter],pParserState);this.appendOutputBuffer(pCharacter,pParserState);}// (2) If we are in a pattern match (actively seeing if this is part of a new pattern token)
else if(pParserState.PatternMatch){// If the pattern has a subpattern with this key
if(pParserState.PatternMatch.hasOwnProperty(pCharacter)){// Continue matching patterns.
this.assignNode(pParserState.PatternMatch[pCharacter],pParserState);}this.appendOutputBuffer(pCharacter,pParserState);if(pParserState.Pattern){// ... Check if this is the end of the pattern (if we are matching a valid pattern)...
this.checkPatternEnd(pParserState);}}// (3) If we aren't in a pattern match or pattern, and this isn't the start of a new pattern (RAW mode)....
else{pParserState.Output+=pCharacter;}}/**
	 * Parse a string for matches, and process any template segments that occur.
	 * @method parseString
	 * @param {string} pString - The string to parse.
	 * @param {Object} pParseTree - The parse tree to begin parsing from (usually root)
	 */parseString(pString,pParseTree){let tmpParserState=this.newParserState(pParseTree);for(var i=0;i<pString.length;i++){// TODO: This is not fast.
this.parseCharacter(pString[i],tmpParserState);}this.flushOutputBuffer(tmpParserState);return tmpParserState.Output;}}module.exports=StringParser;},{}],36:[function(require,module,exports){/**
* Word Tree
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*
* @description Create a tree (directed graph) of Javascript objects, one character per object.
*/class WordTree{/**
	 * WordTree Constructor
	 */constructor(){this.ParseTree={};}/** 
	 * Add a child character to a Parse Tree node
	 * @method addChild
	 * @param {Object} pTree - A parse tree to push the characters into
	 * @param {string} pPattern - The string to add to the tree
	 * @param {number} pIndex - The index of the character in the pattern
	 * @returns {Object} The resulting leaf node that was added (or found)
	 * @private
	 */addChild(pTree,pPattern,pIndex){if(!pTree.hasOwnProperty(pPattern[pIndex]))pTree[pPattern[pIndex]]={};return pTree[pPattern[pIndex]];}/** Add a Pattern to the Parse Tree
	 * @method addPattern
	 * @param {Object} pPatternStart - The starting string for the pattern (e.g. "${")
	 * @param {string} pPatternEnd - The ending string for the pattern (e.g. "}")
	 * @param {number} pParser - The function to parse if this is the matched pattern, once the Pattern End is met.  If this is a string, a simple replacement occurs.
	 * @return {bool} True if adding the pattern was successful
	 */addPattern(pPatternStart,pPatternEnd,pParser){if(pPatternStart.length<1)return false;if(typeof pPatternEnd==='string'&&pPatternEnd.length<1)return false;let tmpLeaf=this.ParseTree;// Add the tree of leaves iteratively
for(var i=0;i<pPatternStart.length;i++)tmpLeaf=this.addChild(tmpLeaf,pPatternStart,i);tmpLeaf.PatternStart=pPatternStart;tmpLeaf.PatternEnd=typeof pPatternEnd==='string'&&pPatternEnd.length>0?pPatternEnd:pPatternStart;tmpLeaf.Parse=typeof pParser==='function'?pParser:typeof pParser==='string'?()=>{return pParser;}:pData=>{return pData;};return true;}}module.exports=WordTree;},{}],37:[function(require,module,exports){// shim for using process in browser
var process=module.exports={};// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error('setTimeout has not been defined');}function defaultClearTimeout(){throw new Error('clearTimeout has not been defined');}(function(){try{if(typeof setTimeout==='function'){cachedSetTimeout=setTimeout;}else{cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}try{if(typeof clearTimeout==='function'){cachedClearTimeout=clearTimeout;}else{cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){//normal enviroments in sane situations
return setTimeout(fun,0);}// if setTimeout wasn't available but was latter defined
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0);}try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedSetTimeout(fun,0);}catch(e){try{// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
return cachedSetTimeout.call(null,fun,0);}catch(e){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
return cachedSetTimeout.call(this,fun,0);}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){//normal enviroments in sane situations
return clearTimeout(marker);}// if clearTimeout wasn't available but was latter defined
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker);}try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedClearTimeout(marker);}catch(e){try{// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
return cachedClearTimeout.call(null,marker);}catch(e){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
// Some versions of I.E. have different rules for clearTimeout vs setTimeout
return cachedClearTimeout.call(this,marker);}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return;}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else{queueIndex=-1;}if(queue.length){drainQueue();}}function drainQueue(){if(draining){return;}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}queueIndex=-1;len=queue.length;}currentQueue=null;draining=false;runClearTimeout(timeout);}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};// v8 likes predictible objects
function Item(fun,array){this.fun=fun;this.array=array;}Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title='browser';process.browser=true;process.env={};process.argv=[];process.version='';// empty string to avoid regexp issues
process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[];};process.binding=function(name){throw new Error('process.binding is not supported');};process.cwd=function(){return'/';};process.chdir=function(dir){throw new Error('process.chdir is not supported');};process.umask=function(){return 0;};},{}],38:[function(require,module,exports){'use strict';var parse=require('ret');var types=parse.types;module.exports=function(re,opts){if(!opts)opts={};var replimit=opts.limit===undefined?25:opts.limit;if(isRegExp(re))re=re.source;else if(typeof re!=='string')re=String(re);try{re=parse(re);}catch(err){return false;}var reps=0;return function walk(node,starHeight){var i;var ok;var len;if(node.type===types.REPETITION){starHeight++;reps++;if(starHeight>1)return false;if(reps>replimit)return false;}if(node.options){for(i=0,len=node.options.length;i<len;i++){ok=walk({stack:node.options[i]},starHeight);if(!ok)return false;}}var stack=node.stack||node.value&&node.value.stack;if(!stack)return true;for(i=0;i<stack.length;i++){ok=walk(stack[i],starHeight);if(!ok)return false;}return true;}(re,0);};function isRegExp(x){return{}.toString.call(x)==='[object RegExp]';}},{"ret":39}],39:[function(require,module,exports){const util=require('./util');const types=require('./types');const sets=require('./sets');const positions=require('./positions');module.exports=regexpStr=>{var i=0,l,c,start={type:types.ROOT,stack:[]},// Keep track of last clause/group and stack.
lastGroup=start,last=start.stack,groupStack=[];var repeatErr=i=>{util.error(regexpStr,`Nothing to repeat at column ${i-1}`);};// Decode a few escaped characters.
var str=util.strToChars(regexpStr);l=str.length;// Iterate through each character in string.
while(i<l){c=str[i++];switch(c){// Handle escaped characters, inclues a few sets.
case'\\':c=str[i++];switch(c){case'b':last.push(positions.wordBoundary());break;case'B':last.push(positions.nonWordBoundary());break;case'w':last.push(sets.words());break;case'W':last.push(sets.notWords());break;case'd':last.push(sets.ints());break;case'D':last.push(sets.notInts());break;case's':last.push(sets.whitespace());break;case'S':last.push(sets.notWhitespace());break;default:// Check if c is integer.
// In which case it's a reference.
if(/\d/.test(c)){last.push({type:types.REFERENCE,value:parseInt(c,10)});// Escaped character.
}else{last.push({type:types.CHAR,value:c.charCodeAt(0)});}}break;// Positionals.
case'^':last.push(positions.begin());break;case'$':last.push(positions.end());break;// Handle custom sets.
case'[':// Check if this class is 'anti' i.e. [^abc].
var not;if(str[i]==='^'){not=true;i++;}else{not=false;}// Get all the characters in class.
var classTokens=util.tokenizeClass(str.slice(i),regexpStr);// Increase index by length of class.
i+=classTokens[1];last.push({type:types.SET,set:classTokens[0],not});break;// Class of any character except \n.
case'.':last.push(sets.anyChar());break;// Push group onto stack.
case'(':// Create group.
var group={type:types.GROUP,stack:[],remember:true};c=str[i];// If if this is a special kind of group.
if(c==='?'){c=str[i+1];i+=2;// Match if followed by.
if(c==='='){group.followedBy=true;// Match if not followed by.
}else if(c==='!'){group.notFollowedBy=true;}else if(c!==':'){util.error(regexpStr,`Invalid group, character '${c}'`+` after '?' at column ${i-1}`);}group.remember=false;}// Insert subgroup into current group stack.
last.push(group);// Remember the current group for when the group closes.
groupStack.push(lastGroup);// Make this new group the current group.
lastGroup=group;last=group.stack;break;// Pop group out of stack.
case')':if(groupStack.length===0){util.error(regexpStr,`Unmatched ) at column ${i-1}`);}lastGroup=groupStack.pop();// Check if this group has a PIPE.
// To get back the correct last stack.
last=lastGroup.options?lastGroup.options[lastGroup.options.length-1]:lastGroup.stack;break;// Use pipe character to give more choices.
case'|':// Create array where options are if this is the first PIPE
// in this clause.
if(!lastGroup.options){lastGroup.options=[lastGroup.stack];delete lastGroup.stack;}// Create a new stack and add to options for rest of clause.
var stack=[];lastGroup.options.push(stack);last=stack;break;// Repetition.
// For every repetition, remove last element from last stack
// then insert back a RANGE object.
// This design is chosen because there could be more than
// one repetition symbols in a regex i.e. `a?+{2,3}`.
case'{':var rs=/^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)),min,max;if(rs!==null){if(last.length===0){repeatErr(i);}min=parseInt(rs[1],10);max=rs[2]?rs[3]?parseInt(rs[3],10):Infinity:min;i+=rs[0].length;last.push({type:types.REPETITION,min,max,value:last.pop()});}else{last.push({type:types.CHAR,value:123});}break;case'?':if(last.length===0){repeatErr(i);}last.push({type:types.REPETITION,min:0,max:1,value:last.pop()});break;case'+':if(last.length===0){repeatErr(i);}last.push({type:types.REPETITION,min:1,max:Infinity,value:last.pop()});break;case'*':if(last.length===0){repeatErr(i);}last.push({type:types.REPETITION,min:0,max:Infinity,value:last.pop()});break;// Default is a character that is not `\[](){}?+*^$`.
default:last.push({type:types.CHAR,value:c.charCodeAt(0)});}}// Check if any groups have not been closed.
if(groupStack.length!==0){util.error(regexpStr,'Unterminated group');}return start;};module.exports.types=types;},{"./positions":40,"./sets":41,"./types":42,"./util":43}],40:[function(require,module,exports){const types=require('./types');exports.wordBoundary=()=>({type:types.POSITION,value:'b'});exports.nonWordBoundary=()=>({type:types.POSITION,value:'B'});exports.begin=()=>({type:types.POSITION,value:'^'});exports.end=()=>({type:types.POSITION,value:'$'});},{"./types":42}],41:[function(require,module,exports){const types=require('./types');const INTS=()=>[{type:types.RANGE,from:48,to:57}];const WORDS=()=>{return[{type:types.CHAR,value:95},{type:types.RANGE,from:97,to:122},{type:types.RANGE,from:65,to:90}].concat(INTS());};const WHITESPACE=()=>{return[{type:types.CHAR,value:9},{type:types.CHAR,value:10},{type:types.CHAR,value:11},{type:types.CHAR,value:12},{type:types.CHAR,value:13},{type:types.CHAR,value:32},{type:types.CHAR,value:160},{type:types.CHAR,value:5760},{type:types.RANGE,from:8192,to:8202},{type:types.CHAR,value:8232},{type:types.CHAR,value:8233},{type:types.CHAR,value:8239},{type:types.CHAR,value:8287},{type:types.CHAR,value:12288},{type:types.CHAR,value:65279}];};const NOTANYCHAR=()=>{return[{type:types.CHAR,value:10},{type:types.CHAR,value:13},{type:types.CHAR,value:8232},{type:types.CHAR,value:8233}];};// Predefined class objects.
exports.words=()=>({type:types.SET,set:WORDS(),not:false});exports.notWords=()=>({type:types.SET,set:WORDS(),not:true});exports.ints=()=>({type:types.SET,set:INTS(),not:false});exports.notInts=()=>({type:types.SET,set:INTS(),not:true});exports.whitespace=()=>({type:types.SET,set:WHITESPACE(),not:false});exports.notWhitespace=()=>({type:types.SET,set:WHITESPACE(),not:true});exports.anyChar=()=>({type:types.SET,set:NOTANYCHAR(),not:true});},{"./types":42}],42:[function(require,module,exports){module.exports={ROOT:0,GROUP:1,POSITION:2,SET:3,RANGE:4,REPETITION:5,REFERENCE:6,CHAR:7};},{}],43:[function(require,module,exports){const types=require('./types');const sets=require('./sets');const CTRL='@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';const SLSH={'0':0,'t':9,'n':10,'v':11,'f':12,'r':13};/**
 * Finds character representations in str and convert all to
 * their respective characters
 *
 * @param {String} str
 * @return {String}
 */exports.strToChars=function(str){/* jshint maxlen: false */var chars_regex=/(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;str=str.replace(chars_regex,function(s,b,lbs,a16,b16,c8,dctrl,eslsh){if(lbs){return s;}var code=b?8:a16?parseInt(a16,16):b16?parseInt(b16,16):c8?parseInt(c8,8):dctrl?CTRL.indexOf(dctrl):SLSH[eslsh];var c=String.fromCharCode(code);// Escape special regex characters.
if(/[[\]{}^$.|?*+()]/.test(c)){c='\\'+c;}return c;});return str;};/**
 * turns class into tokens
 * reads str until it encounters a ] not preceeded by a \
 *
 * @param {String} str
 * @param {String} regexpStr
 * @return {Array.<Array.<Object>, Number>}
 */exports.tokenizeClass=(str,regexpStr)=>{/* jshint maxlen: false */var tokens=[];var regexp=/\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;var rs,c;while((rs=regexp.exec(str))!=null){if(rs[1]){tokens.push(sets.words());}else if(rs[2]){tokens.push(sets.ints());}else if(rs[3]){tokens.push(sets.whitespace());}else if(rs[4]){tokens.push(sets.notWords());}else if(rs[5]){tokens.push(sets.notInts());}else if(rs[6]){tokens.push(sets.notWhitespace());}else if(rs[7]){tokens.push({type:types.RANGE,from:(rs[8]||rs[9]).charCodeAt(0),to:rs[10].charCodeAt(0)});}else if(c=rs[12]){tokens.push({type:types.CHAR,value:c.charCodeAt(0)});}else{return[tokens,regexp.lastIndex];}}exports.error(regexpStr,'Unterminated character class');};/**
 * Shortcut to throw errors.
 *
 * @param {String} regexp
 * @param {String} msg
 */exports.error=(regexp,msg)=>{throw new SyntaxError('Invalid regular expression: /'+regexp+'/: '+msg);};},{"./sets":41,"./types":42}],44:[function(require,module,exports){(function(setImmediate,clearImmediate){(function(){var nextTick=require('process/browser.js').nextTick;var apply=Function.prototype.apply;var slice=Array.prototype.slice;var immediateIds={};var nextImmediateId=0;// DOM APIs, for completeness
exports.setTimeout=function(){return new Timeout(apply.call(setTimeout,window,arguments),clearTimeout);};exports.setInterval=function(){return new Timeout(apply.call(setInterval,window,arguments),clearInterval);};exports.clearTimeout=exports.clearInterval=function(timeout){timeout.close();};function Timeout(id,clearFn){this._id=id;this._clearFn=clearFn;}Timeout.prototype.unref=Timeout.prototype.ref=function(){};Timeout.prototype.close=function(){this._clearFn.call(window,this._id);};// Does not start the time, just sets up the members needed.
exports.enroll=function(item,msecs){clearTimeout(item._idleTimeoutId);item._idleTimeout=msecs;};exports.unenroll=function(item){clearTimeout(item._idleTimeoutId);item._idleTimeout=-1;};exports._unrefActive=exports.active=function(item){clearTimeout(item._idleTimeoutId);var msecs=item._idleTimeout;if(msecs>=0){item._idleTimeoutId=setTimeout(function onTimeout(){if(item._onTimeout)item._onTimeout();},msecs);}};// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate=typeof setImmediate==="function"?setImmediate:function(fn){var id=nextImmediateId++;var args=arguments.length<2?false:slice.call(arguments,1);immediateIds[id]=true;nextTick(function onNextTick(){if(immediateIds[id]){// fn.call() is faster so we optimize for the common use-case
// @see http://jsperf.com/call-apply-segu
if(args){fn.apply(null,args);}else{fn.call(null);}// Prevent ids from leaking
exports.clearImmediate(id);}});return id;};exports.clearImmediate=typeof clearImmediate==="function"?clearImmediate:function(id){delete immediateIds[id];};}).call(this);}).call(this,require("timers").setImmediate,require("timers").clearImmediate);},{"process/browser.js":37,"timers":44}],45:[function(require,module,exports){/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @license MIT
* @author <steven@velozo.com>
*/var libNPMModuleWrapper=require('./Orator.js');if(typeof window==='object'&&!window.hasOwnProperty('Orator')){window.Orator=libNPMModuleWrapper;}module.exports=libNPMModuleWrapper;},{"./Orator.js":51}],46:[function(require,module,exports){// Simple default configuration for application, when none is provided
module.exports={"Product":"Unnamed_Service","ProductVersion":"0.0.1","ServicePort":8080};},{}],47:[function(require,module,exports){/**
* Default Service Server Function
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/ // Return the servers that are available without extensions loaded
getDefaultServiceServers=()=>{let tmpDefaultServiceServers={};tmpDefaultServiceServers.ipc=require('./Orator-ServiceServer-IPC.js');tmpDefaultServiceServers.default=tmpDefaultServiceServers.ipc;return tmpDefaultServiceServers;};module.exports=getDefaultServiceServers();},{"./Orator-ServiceServer-IPC.js":50}],48:[function(require,module,exports){'use strict';// This is taken directly from the find-my-way documentation for custom constraints and only mildly edited
const ipcResponseTypeStrategy={// strategy name for referencing in the route handler `constraints` options
name:'ipc',isAsync:true,// storage factory for storing routes in the find-my-way route tree
storage:()=>{let handlers={};return{get:type=>{return handlers[type]||null;},set:(type,store)=>{handlers[type]=store;}};},// function to get the value of the constraint from each incoming request
deriveConstraint:(pRequest,pContext,fDone)=>{// If we wanted to deny the IPC request based on a constraint, we would do:
// fDone(new Error(`The request was denied because ____ in the Request object wasn't right...`));
return fDone(null,'IPC');},// optional flag marking if handlers without constraints can match requests that have a value for this constraint
mustMatchWhenDerived:true};module.exports=ipcResponseTypeStrategy;},{}],49:[function(require,module,exports){class OratorServiceServerIPCSynthesizedResponse{constructor(pLog,pRequestGUID){this.log=pLog;this.requestGUID=pRequestGUID;this.responseData=null;this.responseStatus=-1;}send(pData){if(typeof pData=='string'){// This is a string!  Append it to the responsedata.
if(this.responseData===null){this.responseData=pData;return true;}else if(typeof this.responseData=='string'){this.responseData=this.responseData+pData;return true;}else{this.log(`Request ${this.requestGUID} has tried to send() a string value after send()ing data type ${typeof this.responseData}.`,pData);return false;}}else if(typeof pData=='object'){if(this.responseData===null){this.responseData=JSON.stringify(pData);return true;}else if(typeof this.responseData=='string'){// TODO: Discuss best way to handle this / if to handle this
this.responseData+=this.responseData+JSON.stringify(pData);return true;}else{this.log(`Request ${this.requestGUID} has tried to send() an object value to be auto stringified after send()ing data type ${typeof this.responseData}.`,pData);return false;}}}}module.exports=OratorServiceServerIPCSynthesizedResponse;},{}],50:[function(require,module,exports){const libOratorServiceServerBase=require('orator-serviceserver');// A synthesized response object, for simple IPC.
const libOratorServiceServerIPCSynthesizedResponse=require('./Orator-ServiceServer-IPC-SynthesizedResponse.js');// A simple constrainer for the find-my-way router since we aren't using any kind of headers to pass version or host
const libOratorServiceServerIPCCustomConstrainer=require('./Orator-ServiceServer-IPC-RouterConstrainer.js');// This library is the default router for our services
const libFindMyWay=require('find-my-way');const libAsync=require('async');class OratorServiceServerIPC extends libOratorServiceServerBase{constructor(pOrator){super(pOrator);this.routerOptions=this.orator.settings.hasOwnProperty('router_options')&&typeof this.orator.settings.router_options=='object'?this.orator.settings.router_options:{};this.router=libFindMyWay(this.routerOptions);this.router.addConstraintStrategy(libOratorServiceServerIPCCustomConstrainer);this.URL='IPC';this.preBehaviorFunctions=[];this.behaviorMap={};this.postBehaviorFunctions=[];}executePreBehaviorFunctions(pRequest,pResponse,fNext){libAsync.eachOfSeries(this.preBehaviorFunctions,(fBehaviorFunction,pFunctionIndex,fCallback)=>{return fBehaviorFunction(pRequest,pResponse,fCallback);},pError=>{if(pError){this.log.error(`IPC Provider preBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`,pError);}return fNext(pError);});}executePostBehaviorFunctions(pRequest,pResponse,fNext){libAsync.eachOfSeries(this.postBehaviorFunctions,(fBehaviorFunction,pFunctionIndex,fCallback)=>{return fBehaviorFunction(pRequest,pResponse,fCallback);},pError=>{if(pError){this.log.error(`IPC Provider postBehaviorFunction ${pFunctionIndex} failed with error: ${pError}`,pError);}return fNext(pError);});}/*
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
	 *************************************************************************/addRouteProcessor(pMethod,pRoute,pRouteFunctionArray){// We have a constrainer on IPC so we can control channels eventually, if we like.
// For now it just makes sure it was added with an IPC service server.
this.router.on(pMethod,pRoute,{constraints:{"ipc":"IPC"}},(pRequest,pResponse,pParameters)=>{libAsync.waterfall([fStageComplete=>{// Added to make this mimic what we saw with route parsing in the old restify
pRequest.params=pParameters;return fStageComplete();},fStageComplete=>{return this.executePreBehaviorFunctions(pRequest,pResponse,fStageComplete);},fStageComplete=>{libAsync.eachOfSeries(pRouteFunctionArray,(fBehaviorFunction,pFunctionIndex,fCallback)=>{return fBehaviorFunction(pRequest,pResponse,fCallback);},pBehaviorFunctionError=>{if(pBehaviorFunctionError){this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`,pBehaviorFunctionError);return fNext(pError);}});},fStageComplete=>{return this.executePostBehaviorFunctions(pRequest,pResponse,fStageComplete);}],pRequestError=>{if(pRequestError){this.log.error(`IPC Provider behavior function ${pFunctionIndex} failed with error: ${pBehaviorFunctionError}`,pBehaviorFunctionError);}});});return true;}get(pRoute,...fRouteProcessingFunctions){if(!super.get(pRoute,...fRouteProcessingFunctions)){this.log.error(`IPC provider failed to map GET route [${pRoute}]!`);return false;}return this.addRouteProcessor('GET',pRoute,Array.from(fRouteProcessingFunctions));}put(pRoute,...fRouteProcessingFunctions){if(!super.get(pRoute,...fRouteProcessingFunctions)){this.log.error(`IPC provider failed to map PUT route [${pRoute}]!`);return false;}return true;}post(pRoute,...fRouteProcessingFunctions){if(!super.get(pRoute,...fRouteProcessingFunctions)){this.log.error(`IPC provider failed to map POST route [${pRoute}]!`);return false;}return true;}del(pRoute,...fRouteProcessingFunctions){if(!super.get(pRoute,...fRouteProcessingFunctions)){this.log.error(`IPC provider failed to map DEL route [${pRoute}]!`);return false;}return true;}/*************************************************************************
	 * End of Service Route Creation Functions
	 */ // Programmatically invoke a route
invoke(pMethod,pRoute,pData,fCallback){// If the data is skipped and a callback is parameter 3, do the right thing
let tmpCallback=typeof fCallback=='function'?fCallback:typeof pData=='function'?pData:// This is here in case the developer passed no callback and just wants to fire and forget the IPC call which might not be async safe
()=>{};// Create a bare minimum request object for IPC to pass to our router
let tmpRequest={method:pMethod,url:pRoute,guid:this.orator.fable.getUUID()};// Create a container for the IPC response data to be aggregated to from send() methodds
let tmpSynthesizedResponseData=new libOratorServiceServerIPCSynthesizedResponse(this.log,tmpRequest.guid);return this.router.lookup(tmpRequest,tmpSynthesizedResponseData,(pError,pResults)=>{if(pError){this.log.error(`IPC Request Error Request GUID [${tmpRequest.guid}] handling route [${pRoute}]: ${pError}`,{Error:pError,Route:pRoute,Data:pData});}// by default, send data back through 
return tmpCallback(pError,tmpSynthesizedResponseData.responseData,tmpSynthesizedResponseData,pResults);});}}module.exports=OratorServiceServerIPC;},{"./Orator-ServiceServer-IPC-RouterConstrainer.js":48,"./Orator-ServiceServer-IPC-SynthesizedResponse.js":49,"async":5,"find-my-way":25,"orator-serviceserver":33}],51:[function(require,module,exports){/**
* Orator Service Abstraction
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Orator Service
*/const libFable=require('fable');const defaultOratorConfiguration=require('./Orator-Default-Configuration.js');const defaultOratorServiceServers=require('./Orator-Default-ServiceServers-Node.js');class Orator{constructor(pFable,pServiceProvider){// Need to figure out if pFable is a Fable object or a Settings object or neither
if(typeof pFable==='object'&&pFable instanceof libFable){// We were passed a fully operational fable -- use this
this.fable=pFable;}else if(typeof pFable=='object'){this.fable=new libFable(pFable);}else{this.fable=new libFable(defaultOratorConfiguration);}// Carry core application requirements into the orator object for simplicity
this.settings=this.fable.settings;this.log=this.fable.log;// Create the empty, important logic containers
this.serviceServer=false;this.serviceServerProvider=false;if(typeof pServiceProvider!=='undefined'){this.serviceServerProvider=pServiceProvider;}// Now check to see that the ServicePort is set (this used to be APIServerPort)
if(!this.settings.hasOwnProperty('ServicePort')){if(this.settings.hasOwnProperty('APIServerPort')){// Automatically migrate the legacy APIServerPort to ServicePort
this.settings.ServicePort=this.fable.settings.APIServerPort;}else{// Default to whatever the ... default is!
this.settings.ServicePort=defaultOratorConfiguration.ServicePort;}}// Now check to see that the Product name is set
if(!this.settings.hasOwnProperty('Product')){this.settings.Product=defaultOratorConfiguration.Product;}}initializeServiceServer(fNext){var tmpNext=typeof fNext==='function'?fNext:()=>{};if(!this.serviceServer){// If the developer hasn't set this to a service provider class of their own choosing, 
// use the built-in network-less one.
if(!this.serviceServerProvider){this.serviceServerProvider=defaultOratorServiceServers.default;}this.serviceServer=new this.serviceServerProvider(this);// For legacy reasons, we also will provide this under the "webServer" variable.
this.webServer=this.serviceServer;}else{this.log.warn(`Orator attempting to initialize a service server after initialization has already completed.`);}}_startServiceListener(fNext){return this.serviceServer.listen(this.settings.ServicePort,pError=>{this.log.info(`${this.serviceServer.Name} listening at ${this.serviceServer.URL} port ${this.serviceServer.Port}`);return fNext(pError);});}startService(fNext){var tmpNext=typeof fNext==='function'?fNext:()=>{};if(!this.serviceServer){this.initializeServiceServer();}return this._startServiceListener(tmpNext);}stopService(fNext){var tmpNext=typeof fNext==='function'?fNext:()=>{};if(!this.serviceServer){let tmpMessage=`Orator attempting to stop a service server but the service server has not been intialized yet.`;this.log.warn(tmpMessage);return tmpNext(tmpMessage);}if(!this.serviceServer.Active){let tmpMessage=`Orator attempting to stop a service server but the service server is not actively running.`;this.log.warn(tmpMessage);return tmpNext(tmpMessage);}return this.serviceServer.close(tmpNext);}invoke(pMethod,pRoute,pData,fCallback){return this.serviceServer.invoke(pMethod,pRoute,pData,fCallback);}/*
	 * Legacy Orator Functions
	 *************************************************************************/startWebServer(fNext){return this.startService(fNext);}// For legacy purposes
stopWebServer(fNext){return this.stopService(fNext);}// For legacy purposes
getWebServer(){// The old behavior was to lazily construct the service the first time 
// this accessor function is called.
if(!this.serviceServer){this.initializeServiceServer();}return this.serviceServer;}/*************************************************************************
	 * End of Legacy Orator Functions
	 */}module.exports=Orator;},{"./Orator-Default-Configuration.js":46,"./Orator-Default-ServiceServers-Node.js":47,"fable":16}]},{},[45])(45);});
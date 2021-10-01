"use strict";function e(n){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(n)}function n(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function t(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var o="undefined"!=typeof window?window:global||{},r={number:{save:function(e){return e},parse:function(e){return Number.parseFloat(e)}},object:{save:function(e){return JSON.stringify(e)},parse:function(e){return JSON.parse(e)}},undefined:{save:function(e){return e},parse:function(){}},default:{save:function(e){return e},parse:function(e){return e}}};function a(e){return r[e]||r.default}var i=function(){function t(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t)}var r,i,s;return r=t,i=[{key:"get",value:function(e){var n=t.storage.getItem(t.options.namespace+e);if(n){var o=n.split("$@"),r=Date.now();if(o.length>2&&o[2]<r)return this.remove(e),null;var i=decodeURIComponent(o[1]);return a(o[0]).parse(i)}return null}},{key:"set",value:function(n,o,r){if((r=Object.assign({expires:0,encode:!0},r)).expires&&"number"!=typeof r.expires)throw new Error("The Expires setting must be a number");var i=e(o),s=a(i),u=r.encode?encodeURIComponent(s.save(o)):s.save(o);o=r.expires<=0?i+"$@"+u:i+"$@"+u+"$@"+(24*r.expires*60*60*1e3+(new Date).getTime()),t.storage.setItem(t.options.namespace+n,o)}},{key:"clear",value:function(){t.storage.clear()}},{key:"remove",value:function(e){t.storage.removeItem(t.options.namespace+e)}},{key:"setOptions",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};t.options=Object.assign(t.options,e),t.storage="session"===t.options.storage?o.sessionStorage:o.localStorage}}],i&&n(r.prototype,i),s&&n(r,s),t}();t(i,"storage",o.localStorage),t(i,"options",{namespace:"",storage:"local"});var s=new i;o.hStorage=s,module.exports=s;

/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
var __extends=this&&this.__extends||function(t,o){function r(){this.constructor=t}for(var a in o)o.hasOwnProperty(a)&&(t[a]=o[a]);t.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)};define("vs/languages/razor/common/razorWorker",["require","exports","vs/languages/html/common/htmlWorker"],function(t,o,r){"use strict";function a(){var t={a:["asp-action","asp-controller","asp-fragment","asp-host","asp-protocol","asp-route"],div:["asp-validation-summary"],form:["asp-action","asp-controller","asp-anti-forgery"],input:["asp-for","asp-format"],label:["asp-for"],select:["asp-for","asp-items"],span:["asp-validation-for"]};return{collectTags:function(t){},collectAttributes:function(o,r){if(o){var a=t[o];a&&a.forEach(function(t){return r(t,null)})}},collectValues:function(t,o,r){}}}o.getRazorTagProvider=a;var n=function(t){function o(){t.apply(this,arguments)}return __extends(o,t),o.prototype.addCustomTagProviders=function(t){t.push(a())},o}(r.HTMLWorker);o.RAZORWorker=n});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75/vs\languages\razor\common\razorWorker.js.map

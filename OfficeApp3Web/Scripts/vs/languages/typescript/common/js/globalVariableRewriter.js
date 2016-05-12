/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
define("vs/languages/typescript/common/js/globalVariableRewriter",["require","exports","vs/base/common/strings"],function(e,t,r){"use strict";var n=function(){function e(){this._pattern=/(\/\* ?globals? )([\s\S]+?)\*\//gm}return Object.defineProperty(e.prototype,"name",{get:function(){return"rewriter.globalVariables"},enumerable:!0,configurable:!0}),e.prototype.computeEdits=function(e){this._pattern.lastIndex=0;for(var t,n=e.sourceFile.getFullText(),o=[];t=this._pattern.exec(n);)t[2].split(",").forEach(function(e){e=e.trim();var t=e.indexOf(":");e=e.substring(0,~t?t:void 0),o.push(r.format("declare var {0}:any;\n",e))}),e.newAppend(o.join(r.empty))},e}();t.GlobalVariableCollector=n});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75/vs\languages\typescript\common\js\globalVariableRewriter.js.map

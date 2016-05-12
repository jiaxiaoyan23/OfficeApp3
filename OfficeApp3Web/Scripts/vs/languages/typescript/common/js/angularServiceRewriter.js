/*!-----------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.1.0(6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75)
 * Released under the MIT license
 * https://github.com/Microsoft/vscode/blob/master/LICENSE.txt
 *-----------------------------------------------------------*/
define("vs/languages/typescript/common/js/angularServiceRewriter",["require","exports","vs/languages/typescript/common/lib/typescriptServices"],function(e,r,t){"use strict";var n=function(){function e(){}return Object.defineProperty(e.prototype,"name",{get:function(){return"rewriter.angular"},enumerable:!0,configurable:!0}),e.prototype.computeEdits=function(e){for(var r=0,n=e.sourceFile.getFullText();-1!==(r=n.indexOf("$",r));){var i=t.getTokenAtPosition(e.sourceFile,r);if(i&&(r+=i.getFullWidth(),65===i.kind&&i.parent&&131===i.parent.kind)){var a=i.parent,o=a.name.getText();if(o.length>1){var u=" :angular.I"+o[1].toUpperCase()+o.substr(2)+"Service";e.newInsert(a.name.end,u)}}}},e}();r.AngularServiceRewriter=n});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/6c0fe2014e7a7d596ac1af21f25bf2fc17da8a75/vs\languages\typescript\common\js\angularServiceRewriter.js.map

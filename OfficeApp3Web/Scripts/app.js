var officeJsSnippetApp = angular.module("officeJsSnippetApp", ['ngRoute']);
var insideOffice = false;
var consoleErrorFunction;
var isSnippet = false;
var rootUrl = document.location;
var hostName = "";

var logComment = function(message) {
	//var consoleElement;
	//consoleElement = document.getElementById('console');
	//consoleElement.innerHTML += message + '\n';
	//consoleElement.scrollTop = consoleElement.scrollHeight;

	showMessage(message);
}

function GetAppHostInfo() {
    var search = window.location.search.toLowerCase();
    try {
        var info = search.split("host_info=");
        if (info.length > 1) {
            var infoBits = info[1].split("|", 3);
            if (infoBits.length == 1) {
                //didn't find info using |, trying $
                var infoBits = info[1].split("$", 3);
            }
            
            //currently code snippets only support excel and word
            if (infoBits[0].toLowerCase() == "excel" || infoBits[0].toLowerCase() == "word") {
                hostName = infoBits[0];
            }
            
            //_appBitness = infoBits[1];
            //_appVersion = infoBits[2];
        }

        if (hostName == "" && window.external && window.external.GetContext) {
            var appType = window.external.GetContext().GetAppType()
            switch (appType) {
                case 1:
                    hostName = "excel"; break;
                case 2:
                    hostName = "word"; break;
                default:
                    hostName = ""; break;
            }
        }

    } catch (e) {        
    }
}

//Office.initialize = function (reason) {
function CodeSnippetsInit(reason) { 
	insideOffice = true;	
	console.log('Add-in initialized, redirecting console.log() to console textArea');
	consoleErrorFunction = console.error;
	console.error = logComment;
	GetAppHostInfo();
	// get Angular scope from the known DOM element
    var e = document.getElementById('samplesContainer');
    var scope = angular.element(e).scope();
    // update the model with a wrap in $apply(fn) which will refresh the view for us
    //scope.$apply(function() {
    //    scope.insideOffice = true;
    //}); 
};

officeJsSnippetApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.when('/snippets/:app',
			{
				controller: 'SamplesController',
				templateUrl: 'partials/snippet-browser.html'
			})
		.when('/add-in/:app',
			{
				controller: 'SamplesController',
				templateUrl: 'partials/add-in.html'
			})
		.when('/testAll',
			{
				controller: 'TestAllController',
				templateUrl: 'partials/testAll.html'
			})
		.otherwise({redirectTo: '/add-in/excel' });
}]);

officeJsSnippetApp.factory("snippetFactory", ['$http', function ($http) {
	var factory = {};
	
	factory.getSamples = function () {
	    GetAppHostInfo();	   
	    return $http.get(hostName + '-snippets/samples.json');
	};
	
	factory.getSampleCode = function (filename) {
	    return $http.get(hostName + '-snippets/' + filename);
	};

	return factory;
}]);

officeJsSnippetApp.controller("SamplesController", function ($scope, $routeParams, snippetFactory) {
    $scope.samples = [{ name: "Loading..." }];
    $scope.selectedSample = { description: "(Please choose a group and sample above.)" };
    $scope.insideOffice = insideOffice;
    $scope.selectedGroup = {};
    $scope.isSnippet = isSnippet;
	
    CodeEditorIntegration.initializeJsEditor('TxtRichApiScript', [
			"/editorIntelliSense/ExcelLatest.txt",
			"/editorIntelliSense/WordLatest.txt",
			"/editorIntelliSense/OfficeCommon.txt",
			"/editorIntelliSense/OfficeDocument.txt"
    ]);
	
    CodeEditorIntegration.setDirty = function () {
        if ($scope.selectedSample.code) {
            $scope.selectedSample = { description: $scope.selectedSample.description + " (modified)" };
            $scope.$apply();
        }
    }
	
    snippetFactory.getSamples().then(function (response) {//_appHost  $routeParams["app"]
        $scope.samples = response.data.values;
        $scope.groups = response.data.groups;
    });

    $scope.loadSampleCode = function () {
        if (($scope.selectedSample == null || !($scope.selectedSample.description)) && $scope.isSnippet) {        
            $("#TxtRichApiScript").addClass("hidden");
        }
        else {
            if ($scope.selectedSample == null) {
                $scope.selectedSample = { description: "(Please choose a group and sample above.)" };
                $("#TxtRichApiScript").addClass("hidden");
            }

           
            //appInsights.trackEvent("SampleLoaded", { name: $scope.selectedSample.name });
            writeLog("Try to load code sample " + { name: $scope.selectedSample.name });
            $scope.isSnippet = true;
            $("#TxtRichApiScript").removeClass("hidden");;
            $("#headercontent").empty();
            $("#tutorial").hide();
            $("#headerString").hide();
            $("#groupSelector").addClass("codeSnippetsMenu");
            $("#sampleSelector").addClass("codeSnippetsMenu");
            $("#samplesContainer select").css({
                "background": "url('/Images/arrowWhite.png')",
                "background-repeat": "no-repeat",
                "background-position": "right",
                "padding-right": "14px"});
            $("#samplesContainer").addClass("mainMenu");
            $("#mainBtn").removeClass("hidden");
            $("#placeholder1").removeClass("hidden");
            $("#placeholder2").removeClass("hidden");

            if ($scope.selectedSample != null &&
                ($scope.selectedSample.description != "(Please choose a group and sample above.)")) {
                $("#codeSnippet").removeClass("hidden");
            }
   
            snippetFactory.getSampleCode($scope.selectedSample.filename).then(function (response) {
	            $scope.selectedSample.code = addErrorHandlingIfNeeded(response.data);
	            $scope.insideOffice = insideOffice;
	            $("#TxtRichApiScript").empty();
	            CodeEditorIntegration.initializeJsEditor('TxtRichApiScript', [
                            "/editorIntelliSense/ExcelLatest.txt",
                            "/editorIntelliSense/WordLatest.txt",
                            "/editorIntelliSense/OfficeCommon.txt",
                            "/editorIntelliSense/OfficeDocument.txt"
	            ]);
	            CodeEditorIntegration.setJavaScriptText($scope.selectedSample.code);
	            CodeEditorIntegration.resizeEditor();
	            writeLog("Code sample loaded successfully for " + { name: $scope.selectedSample.name });
	        });
        }
	};

	$scope.backToMain = function () {
	    $scope.isSnippet = false;
	    $("#codeSnippet").addClass("hidden");
	    $("#tutorial").show();
	    $("#tutorialList").removeClass("hidden");
	    $("#groupSelector").removeClass("codeSnippetsMenu");	    
	    $("#sampleSelector").removeClass("codeSnippetsMenu");
	    $("#samplesContainer").removeClass("mainMenu");
	    $("#samplesContainer select").css({
	        "background": "url('/Images/arrow.png')",
	        "background-repeat": "no-repeat",
	        "background-position": "right",
	        "padding-right": "14px"
	    });
	    $("#mainBtn").addClass("hidden");
	    $("#placeholder1").addClass("hidden");
	    $("#placeholder2").addClass("hidden");
	    $("#headerString").show();
	    InteractiveTutorial.App.showList();
	}

	$scope.runSelectedSample = function () {
	    writeLog("Run sample " + { name: $scope.selectedSample.name });
		var script = CodeEditorIntegration.getJavaScriptToRun().replace(/console.log/g, "logComment");
		
		if (isTrulyJavaScript(script)) {
			try {
				eval(script);
			} catch (e) {
				logComment(e.name + ": " + e.message);
			}	
		} else {
			CodeEditorIntegration.getEditorTextAsJavaScript().then(function (output) {
				if (output == null) {
					logComment("Invalid JavaScript / TypeScript. Please fix the errors shown in the code editor and try again.");
				} else {
					eval(output.content);
				}
			});
		}	
	}
});

officeJsSnippetApp.controller("TestAllController", function($scope, $q, snippetFactory) {
	$scope.insideOffice = insideOffice;

	snippetFactory.getSamples().then(function (response) {
		$scope.samples = response.data.values;
		$scope.groups = response.data.groups;
	});

	$scope.loadSampleCode = function() {
	    appInsights.trackEvent("SampleLoaded", { name: $scope.selectedSample.name });
	};

	$scope.runSamples = function() {
		
		var promiseProducingSampleFunctions = new Array();
		
		for (var i = 1; i < $scope.samples.length; i++) {
			promiseProducingSampleFunctions.push(createRunSample(i));
		}
		
		var result = createRunSample(0);
		result = result();
		promiseProducingSampleFunctions.forEach(function (f) {
			result = result.then(f);
		});
		
		function createRunSample(sampleIndex) {
			
			var sample = $scope.samples[sampleIndex];
			
			return function() {
				var deferred = $q.defer();
				//logComment("running next call");
				sample.runStatus = "Loading";
				snippetFactory.getSampleCode(sample.filename).then(function (response) {
					sample.code = addTestResults(addDeferredErrorHandling(response.data)).replace(/console.log/g, "logComment");
					sample.runStatus = "Running";
					try {
						//logComment(sample.code);
						eval(sample.code);
					} catch (e) {
						sample.runStatus = "Error: " + e.name + ": " + e.message;
						deferred.resolve();
					}
				});
				
				return deferred.promise;
			}
		}
	}
	
	$scope.refreshResults = function() {
		$scope.$apply();
	}

});

function addTestResults(sampleCode) {
	return sampleCode.replace("console.log(\"done\");", "sample.runStatus = \"Success\"; deferred.resolve();");
}

function addDeferredErrorHandling(sampleCode) {
	return sampleCode.replace("ctx.executeAsync().then();", "ctx.executeAsync().then(function() {\r\n    console.log(\"done\");\r\n}, function(error) {\r\n    sample.runStatus = \"Error: \" + error.errorCode + \":\" + error.errorMessage; deferred.resolve(); });");
}

function addErrorHandling(sampleCode) {
	return sampleCode.replace("\r\n}).catch(function (error) {\r\n	console.log(error);\r\n});", "\r\n}).catch(function(error) {\r\n    console.log(\"Error: \" + error);\r\n    if (error instanceof OfficeExtension.Error) {\r\n        console.log(\"Debug info: \" + JSON.stringify(error.debugInfo));\r\n    }\r\n});");
}

function addErrorHandlingIfNeeded(sampleCode) {
	if (!insideOffice) return sampleCode;
	return addErrorHandling(sampleCode);	
}

/** returns whether the text is truly javascript (as opposed to typescript) */
function isTrulyJavaScript(text) {
	try {
		new Function(text);
		return true;
	} catch (syntaxError) {
		return false;
	}
}
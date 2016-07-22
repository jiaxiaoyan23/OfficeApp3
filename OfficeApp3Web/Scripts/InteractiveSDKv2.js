//Declare namespace
var InteractiveTutorial = {};
var Globals = {};
var appName = "API Tutorial";
var _appHost = "";
var _appBitness = "";
var _appVersion = "";
var _detectOutlook = false;

InteractiveTutorial.App = new function () {
    var _codeXml = null;
    var _contentXml = null;
    var _currentNodeId = null;
    var _currentTask = null;
    var _currentTaskIndex = null;
    var _currentContentIndex = null;
    var _currentScenario = null;
    var _currentScenarioIndex = null;
    var _tasks = null;
    var _checked = null;
    var _currentLink = null;
    var _contentList = null;
    var _editor = null;
    var self = this;
    var _firstRun = true;

    this.init = function InteractiveTutorial_App$init() {
        $("#navigation").hide();
        $("#content").addClass("loading");

        _checked = {};
        _contentList = [];

        AppsTelemetry.perfStart("Initialize");

        //Get app host info
        initAppHostInfo();

        //Update to colors for host
        updateCSSforHost();

        //Get the document location
        getDocLocation();

        //Resize code editor when window is resized
        $(window).resize(function () {
            self.sizeCodeEditor();
        });

        //Populates the _contentList from tutorial.xml file.
        self.getTutorials();

        //Start a perf marker for the first run time
        AppsTelemetry.perfStart("Time to first Run");

        var hideToast = function () {
            $("#toastMessage").slideUp();
        };

        $('body').click(function (clickEvent) {
            if (clickEvent.target.id != "run") {
                $("#toastMessage").slideUp();
            }
        })
        $("#run").click(self.executeCode);
        $("#next").click(self.nextStep);
        
        /*
        Escape key will move focus to the run code button.  
        Elements with a role of button will also react to enter and space keydown events like a input button
        */
        $("body").keydown(function (event) {
            if (event.which == 27) {
                $("#run").focus();
                $('#toastMessage').hide();
            } //Check for enter and space to mimic the behavior of buttons
            else if (event.which == 13 || event.which == 32) {
                var element = $(event.srcElement);
                if (element.attr("role") == "button") {
                    $(event.srcElement).click();
                }
            }
        });

        CodeEditorIntegration.initializeJsEditor('codeWindow', [
           "/editorIntelliSense/ExcelLatest.txt",
           "/editorIntelliSense/WordLatest.txt",
           "/editorIntelliSense/OfficeCommon.txt",
           "/editorIntelliSense/OfficeDocument.txt"
        ]);

        AppsTelemetry.perfEnd("Initialize");
    }

    //Shows tutorial list.
    this.showList = function InteractiveTutorial_App$showList() {
        var iTutorialCount = _contentList.length;
        writeLog("ShowList: Tutorial count=" + iTutorialCount);
        if (iTutorialCount == 0) {
            writeError("ShowList: No Supported Scenarios for host " + _appHost)
            console.log("Bummer! It doesn't look like any tutorials have been written for this application yet.");
        }
        else
        {
            // $("#content").empty();
            $("#APILayout").addClass("hidden");
            $("#headercontent").empty();
            $("#tutorialList").attr("class", "listPageContent");
            if (_detectOutlook) {
                if (self.objExists("Office.context.mailbox.item.displayReplyForm")) {
                    $("#headercontent").append('<h1 >Select a Tutorial (Read)</h1>');
                } else {
                    $("#headercontent").append('<h1 >Select a Tutorial (Compose)</h1>');
                }
            } else {
                $("#headercontent").append("<h2>New to Office add-ins? Get started with step-by-step tutorials:</h2>");
            }
            $("#headercontent").attr("class", "listHeader");
            $("#navigation").hide();
            $("#tutorialList").empty();
            $("#tutorialList").append("<ul id='scenarioList'></ul>");
            var list = $("#scenarioList");
            for (var i = 0; i < iTutorialCount; i++) {
                var scenario = _contentList[i].scenario;
                var listItem = $("<li class='listItem' role='button' tabindex='0'><div class='listText checked'><h2>" + self.htmlEncode(scenario) + "</h2></div><img src='Images/checkwhite.png' height='10px' alt='Check' /></li>");
                listItem.appendTo(list).click({ "content": _contentList, "index": i }, self.showAPIPage);
                if (!(_checked[scenario])) {
                    listItem.find('.listText').removeClass('checked');
                    listItem.find('img').hide();
                }
                else {
                    //make background appear hovered and checked
                    var backColor = listItem.css("background-color");
                    backColor = backColor.replace("rgb", "rgba").replace(")", ",0.75)") 
                    listItem.css("background-color", backColor);  
                }
            }
        }
        $("#tutorialList").removeClass("loading");
        
        if ((_appHost.toLowerCase() == "excel" || _appHost.toLowerCase() == "word") && _appVersion == "16") {
            $("#tutorialMain").attr("class", "divWrapperInside");
            $("#bottomMenu").removeClass("hidden");
            writeLog("ShowCodeSnippets for " + _appHost + ", " + _appBitness + ", " + _appVersion);
        }
        else {
            $("#tutorialMain").attr("class", "divWrapperInsideFull");
        }
    }

    this.navigateToDefaultStartLocation = function InteractiveTutorial_App$navigateToDefaultStartLocation() {
        var scenarioTitle = "";
        var taskTitle = "";
        var firstTryItOut = true;
        var cookieList = (document.cookie) ? document.cookie.split('; ') : [];
        for (var i = 0, n = cookieList.length; i != n; ++i) {
            if (cookieList[i][0] === " ") {
                cookieList[i] = cookieList[i].substring(1);
            }
            var cookie = cookieList[i];
            var f = cookie.indexOf('=');
            if (f >= 0) {
                var cookieName = cookie.substring(0, f);
                var cookieValue = cookie.substring(f + 1);
                if (cookieName === "scenario") {
                    scenarioTitle = cookieValue;
                    document.cookie = cookieName + "=" + cookieValue + ";expires=" + new Date(0).toGMTString();
                } else if (cookieName === "task") {
                    taskTitle = cookieValue;
                    document.cookie = cookieName + "=" + cookieValue + ";expires=" + new Date(0).toGMTString();
                }
                else if (cookieName === "firstTryItOut") {
                    firstTryItOut = false;
                }
            }
        }

        if (scenarioTitle === "") {
            writeLog("no cookies");
            InteractiveTutorial.App.showList();
            return;
        }

        scenarioTitle = scenarioTitle.split('+').join(' ');
        scenarioTitle = scenarioTitle.split('%20').join(' ');
        var numTutorials = _contentList.length;
        var scenario, scenarioNumber = -1;
        for (var i = 0; i < numTutorials; i++) {
            if (scenarioTitle == _contentList[i].scenario) {
                scenario = _contentList[i];
                scenarioNumber = i;
                break;
            }
        }

        if (scenarioNumber == -1) {
            writeLog("Invalid scenario name in cookies")
            InteractiveTutorial.App.showList();
            return;
        }
        if (taskTitle !== "") {
            var task, taskNumber = -1;
            for (var i = 0; i < scenario.tasks.length; i++) {
                if (taskTitle == scenario.tasks[i].id) {
                    task = scenario.tasks[i];
                    taskNumber = i;
                    break;
                }
            }
            if (taskNumber == -1) {
                writeLog("Invalid task name in cookies");
                InteractiveTutorial.App.showList();
                return;
            }
        }

        //Set cookie to ensure firstTryItOut is set to false in future, expires after 365 days
        document.cookie = "firstTryItOut=false;expires=" + new Date(Date.now() + 365*86400000).toGMTString();

        $("#headercontent").attr("class", "apiPageHeader");
        $("#tutorialList").attr("class", "apiPageContent");
        _currentContentIndex = scenarioNumber;
        _currentScenario = _contentList[scenarioNumber].scenario;
        _currentLink = _contentList[scenarioNumber].link;
        _tasks = _contentList[scenarioNumber].tasks;
        if(taskTitle){
            _currentTaskIndex = taskNumber;
        }else{
            _currentTaskIndex = 0;
        }
        $("#headercontent").html("<div id='scenario'><span id='scenarioimg'><img src='Images/backwhite.png' role='button' tabindex='0' title='Back to Tutorial List' height='30px' alt='Back' /></span><span><div id='scenariolabel'><h4>" + self.htmlEncode(_currentScenario) + "</h4></div><div id='task'></div></span></div>").show();
       
        $("#mainBtn").click(self.showList);
        self.showTask();
        if (firstTryItOut) {
            setAndShowFancyBox();
        }
        writeLog("Try It Out, scenario: " + _currentScenario + ", task: " + _currentTask);
    }

    //Execute code in text area. 
    this.executeCode = function InteractiveTutorial_App$executeCode() {
        try {
            // Execute the code found in the code textarea
            AppsTelemetry.perfStart("RunCode [" + _currentScenario +", " + _currentTask + "]");
            // eval(_editor.getValue());
            //  eval($.trim(_tasks[_currentTaskIndex].code));
            var script = CodeEditorIntegration.getJavaScriptToRun();

            if (isTrulyJavaScript(script)) {
                try {
                    eval(script);
                } catch (e) {
                    console.log(e.name + ": " + e.message);
                }
            } else {
                console.log("Invalid JavaScript / TypeScript. Please fix the errors in the code editor and try again.");
            }

            AppsTelemetry.perfEnd("RunCode [" + _currentScenario + ", " + _currentTask + "]");
            if (_firstRun) { AppsTelemetry.perfEnd("Time to first Run"); _firstRun = false; }
            writeLog("RunTask: Succeeded [" + _currentScenario + ", " + _currentTask + "]");
        }
        catch (err) {
            // Catch syntax and runtime errors
            writeError("RunTask: Error [" + err + "]");
            console.log('Error executing code: ' + err);
        }

    }

    //Uses third party library for code formatting and styling of code snippet
    this.setCodeWindow = function InteractiveTutorial_App$setCodeWindow(code) {
        $("#codeWindow").empty();
        CodeEditorIntegration.initializeJsEditor('codeWindow', [
                            "/editorIntelliSense/ExcelLatest.txt",
                            "/editorIntelliSense/WordLatest.txt",
                            "/editorIntelliSense/OfficeCommon.txt",
                            "/editorIntelliSense/OfficeDocument.txt"
        ]);
        CodeEditorIntegration.setJavaScriptText($.trim(code));           
        CodeEditorIntegration.resizeEditor();
    }

    //Check existence of the method/object
    this.objExists = function InteractiveTutorial_App$objExists(ref) {
        if (_appVersion == "16" && (_appHost == "word" || _appHost == "excel") ) {
            return true;
        }
        var parts = ref.split(".");
        var expr = "";
        var result;
        for (var i = 0; i < parts.length; i++) {
            expr += parts[i];
            result = eval("typeof(" + expr + ")");
            if (result == 'undefined') { return false; }
            if (i < parts.length - 1) { expr += "."; }
        }
        return true;
    }

    //Returns true if the host supports the methods used in the code snippet
    this.hostSupportsMethodsForCode = function InteractiveTutorial_App$hostSupportsMethodsForCode(code) {        
        if (_appVersion == "16" && (_appHost == "word" || _appHost == "excel")) {
            return true;
        }
        //find the methods in the code, like Office.context.document.getSelectedDataAsync
        var pattern = /Office\.([A-Za-z0-9\\.]+)/gi;
        var codeText = code;
        var methods = codeText.match(pattern);
        for (var i = 0; i < methods.length; i++) {
            if(methods[i][0] === "("){
                methods[i] = methods[i].substring(1);
            }
            if (!self.objExists(methods[i])) {
                return false;
            }
            //keep looping while method is supported
        }
        return true;
    }

    //Gets the content from tutorial.xml and adds to an array.
    this.getTutorials = function InteractiveTutorial_App$getTutorials() {
        var xmlPath = "";
        if (_appVersion == "16") {
            switch(_appHost){
                case "word":
                    xmlPath = "tutorials_16_word.xml";
                    break;
                case "excel":
                    xmlPath = "tutorials_16_excel.xml";
                    break;
                case "powerpoint":
                default:
                    xmlPath = "tutorials_15.xml";
                    break;
            }                         
        }
        else {
            xmlPath = "tutorials_15.xml";
        }
        self.getXml(xmlPath, function (xml) {
            _contentXml = xml;
            var tutorial = _contentXml.find('scenario').each(function () {
                var scenarioObject = {};
                var title = $(this).attr("title");
                var link = $(this).attr("link");
                var tasks = [];
                var hasSupport = true;
                $(this).find("tasks").find("task").each(function () {
                    //get the code block associated with the task and add the task only if supported by the host application
                    var code = $(this).find("code").context.textContent;
                    if (code == undefined) {
                        //IE9 fails for textContent, so fallback
                        var code = $(this).find("code").context.text;
                        if (code == undefined) {
                            //still failing, so just return so loading can continue
                            return;
                        }
                    }
                    if (self.hostSupportsMethodsForCode(code)) {
                        var taskId = $(this).attr("id");
                        var taskObject = {};
                        var taskTitle = $(this).attr("title");
                       // var taskDescription = $(this).attr("description");
                        taskObject = { "title": taskTitle, "id": taskId, "code" : code };
                        tasks.push(taskObject);
                        }
                    else {
                        hasSupport = false;
                        return false;  //break out of the loop
                    }
                });
                //Only add the scenario if there were supported tasks 
                if (hasSupport) {
                    scenarioObject = { "scenario": title, "link": link, "tasks": tasks };
                    _contentList.push(scenarioObject);
                }
            });
            //Load the tutorial list, or navigate to a default tutorial based on cookies, after the data has been read
            //InteractiveTutorial.App.showList();
            InteractiveTutorial.App.navigateToDefaultStartLocation();
        });
    }

    //Gets xml from file.
    this.getXml = function InteractiveTutorial_App$getXml(url, callback) {
        // Get xml for the code and content
        $.ajax({
            url: url,
            cache: false,
            dataType: 'xml',
        }).error(function (jqXHR, textStatus, errorThrown) {
            writeError("Error retrieving XML [" + errorThrown + "]");
            console.log(textStatus + " : " + errorThrown);
        }).success(function (xml) {
            callback($(xml));
        });
    }

    //Loads current tutorial and associated next steps.
    this.showAPIPage = function InteractiveTutorial_App$showAPIPage(event) {
        $("#headercontent").attr("class", "apiPageHeader");
        // $("#content").attr("class", "apiPageContent");
        $("#tutorialList").addClass("hidden");
        $("#APILayout").removeClass("hidden");

        $("#bottomMenu").addClass("hidden");
        _currentContentIndex = event.data.index;
        _currentScenario = event.data.content[_currentContentIndex].scenario;
        _currentLink = event.data.content[_currentContentIndex].link;
        _tasks = event.data.content[_currentContentIndex].tasks;
        _currentTaskIndex = 0;
        writeLog("Show Scenario [" + _currentScenario + "]");
        
        $("#headercontent").html("<div id='scenario'><button id='mainBtnInTutorial' class='codeSnippetsMenu' >Main </button><span class='codeSnippetsMenu'>&nbsp; > </span><select id='scenariolabel' class='codeSnippetsMenu'></span>").show(); 

        var html = '';
        for (var i = 0; i < event.data.content.length; i++) {
            html += '<option value="' + event.data.content[i].scenario + '">' + event.data.content[i].scenario + '</option>';
        }    
        $("#scenariolabel").append(html);
        $("#scenariolabel").change(self.changeTutorial);
        $("#scenariolabel")[0].options[_currentContentIndex].selected = true;
        $("#mainBtnInTutorial").click(self.showList);
                
        $("#tutorialMain").attr("class", "divWrapperInsideFull");
        self.showTask();
    }

    //Show current step code and description.
    this.showTask = function InteractiveTutorial_App$showTask() {

        // $("#content").html("");
        $("#tutorialList").addClass("hidden");
        $("#task").empty();
        //var APILayout = $("<div id='APILayout'></div>").appendTo("#tutorialList");
        var navigation = $("#navigation").html("").show();
        var hasNapaLink = (typeof _currentLink != "undefined");
        var isOnlyStep = (_currentTaskIndex == 0) && (_tasks.length == 1);
        var isLastStep = (_currentTaskIndex == _tasks.length) || (_currentTaskIndex == _tasks.length && !hasNapaLink);

        if (isOnlyStep) {
            _checked[_currentScenario] = true;
        }

        if (!isLastStep) {
            var taskTitle = _tasks[_currentTaskIndex].title;
            //$("#task").html("<h3>" + self.htmlEncode(taskTitle) + "</h3>");
            var taskId = _currentTask = _tasks[_currentTaskIndex].id;
            var taskDescription = _tasks[_currentTaskIndex].description;
            writeLog("ShowTask [" + taskId + "]");
            //var menu = $("<div id='tabs'><ul'><li id='codeMenu' class='tabSelected'><a href='#' tabindex='0' title='View the code window'>CODE</a></li><li id='descriptionMenu'><a href='#' tabindex='0' title='View the description window'>DESCRIPTION</a></li></ul>").appendTo(APILayout);

            // var menu = $("<div id='task'><h3>"+self.htmlEncode(taskTitle)+"</h3></div>").appendTo(APILayout);
            var menu = $("<h3>" + self.htmlEncode(taskTitle) + "</h3>").appendTo("#task");

            //var codeMenu = $("#codeMenu").click(self.showCode);
            //var descriptionMenu = $("#descriptionMenu").click(self.showDescription);
            //  var code = $("<div id='codeLayout'><div id='codeWindow' name='codeWindow' spellcheck='false'></div></div>").appendTo(APILayout);
           // var code = $("<div id='codeLayout'><div id='codeWindow' style='height:800px; padding-top:10px;'></div></div>").appendTo(APILayout);

            self.setCodeWindow(_tasks[_currentTaskIndex].code);
            //var description = $("<div id='description'>" + self.htmlEncode(taskDescription, true) + "</div>").hide().appendTo(APILayout);

            var run = $("<button id='run' class='buttonclass' accesskey='R'><u>R</u>un Code</button>").appendTo(navigation).click(self.executeCode);

            //Loading last task with no Napa, show list button. Last step with Napa after, show next button 
            if (_currentTaskIndex == _tasks.length - 1 && !hasNapaLink) {
                //show Next button as Tutorial List icon
                $("<div class='navigationButtons'><div id='previous' role='button' title='Go to the previous step'></div><div id='next' role='button' tabindex='0' title='Go to tutorial list'><img id='imgNext_WhiteBackground' src='Images/list-translucent.png' alt='Go to tutorial list' /><img id='imgNext_BlackBackground' src='/Images/list-translucent-highContrast.png' alt='Go to tutorial list' /></div></div>").appendTo(navigation);
                _checked[_currentScenario] = true;
            } else {
                //show Next button as Next icon
                $("<div class='navigationButtons'><div id='previous' role='button' title='Go to the previous step'></div><div id='next' role='button' tabindex='0' title='Go to the next step'><img id='imgNext_WhiteBackground' src='Images/next-translucent.png' alt='Next' /><img id='imgNext_BlackBackground' src='/Images/next-translucent-highContrast.png' alt='Next' /></div></div>").appendTo(navigation);
            }

            $("#next").click(function () {
                $("#toastMessage").slideUp();
                _currentTaskIndex++;
                self.showTask();
            });
        }

            //Go to Full Example page.
        else {
            _checked[_currentScenario] = true;
            //No Napa, back to main list
            if (!hasNapaLink) {
                self.showList();
            }
            //Show Napa page and list button
            else {
                writeLog("ShowNapaTask [" + _currentLink + "]");

                $("#task").html('<h3>Add-ins Playground</h3>');
                var summary = $('<div id="summary"><p>The Add-ins playground is a great way to get started building apps for Office or SharePoint directly out of a browser window. Click "View Tutorial" to view the full tutorial in Napa or click <a href="https://www.napacloudapp.com" target="_blank">here</a> to create a new Add-in in Napa.</p><button id="opennapa" class="buttonclass">View Tutorial</button></div>').appendTo(APILayout);
                $("#opennapa").click(function () {
                    writeLog("Open NapaTask clicked [" + _currentLink + "]");
                    window.open(_currentLink, "_blank");
                });
                navigation.append("<div class='navigationButtons'><div id='previous' role='button' tabindex='0' title='Go to the previous step'></div><div id='next' role='button' tabindex='0' title='Go back to tutorial list'><img id='imgNext_WhiteBackground' src='Images/list-translucent.png' alt='Go to tutorial list' /><img id='imgNext_BlackBackground' src='/Images/list-translucent-highContrast.png' alt='Go to tutorial list' /></div></div>");
                $('#next').click(function () {
                    $("#toastMessage").slideUp();
                    self.showList();
                })
            }
        }
        //If not the 0th task, show previous button
        if (_currentTaskIndex != 0) {
            $("<img id='imgBack_WhiteBackground' src='Images/back-translucent.png' alt='Previous' /><img id='imgBack_BlackBackground' src='/Images/back-translucent-highContrast.png' alt='Previous' /></div>").appendTo("#previous");
            $("#previous").click(function () {
                $("#toastMessage").slideUp();
                _currentTaskIndex--;
                self.showTask();

            }).attr("tabindex", "0");
        }
    }

    //Shows the code area tab.
    this.showCode = function InteractiveTutorial_App$showCode() {
        writeLog("showCode, scenario: " + _currentScenario + ", task: " + _currentTask);
        $("#codeMenu").attr("class", "tabSelected");
        $("#descriptionMenu").attr("class", "");
        $("#action").show();
        $("#description").hide();
        $("#codeLayout").show();

    }

    //Shows the description tab.
    this.showDescription = function InteractiveTutorial_App$showDescription() {
        writeLog("showDescription, scenario: " + _currentScenario + ", task: " + _currentTask);
        $("#codeMenu").attr("class", "");
        $("#descriptionMenu").attr("class", "tabSelected");
        $("#action").hide();
        $("#codeLayout").hide();
        $("#description").show()

    }

    //Resizing code editor.
    this.sizeCodeEditor = function InteractiveTutorial_App$sizeCodeEditor() {
      // $(".CodeMirror-scroll, #description").css("height", $("#content").height() - $("#tabs").height() - 10 + "px");
    }

    this.htmlEncode = function InteractiveTutorial_App$htmlEncode(value, allowLinks) {
        var allowedTags = ["<br />", "<br>", "<i>", "</i>", "<b>", "</b>"];
        var links = [];

        var encodedHTML = $("<div/>").html(value);
        if (allowLinks == true) {
            encodedHTML.find("a[href]").replaceWith(function (index, element) {
                var linkText = this.innerText;
                if (linkText == undefined) {
                    linkText = this.text;
                }
                links.push({ href: this.href, target: this.target, text: linkText, title: this.title });
                return "LINKPLACEHOLDER" + index;
            });
        }

        encodedHTML = $("<div/>").text(encodedHTML.html()).html();

        $.each(allowedTags, function (index, tag) {
            var regex = new RegExp($('<div/>').text(tag).html(), "gi");
            encodedHTML = encodedHTML.replace(regex, tag);
        }
         );

        $.each(links, function (index, element) {
            encodedHTML = encodedHTML.replace("LINKPLACEHOLDER" + index, "<a href='" + element.href + "' title='" + element.title + "' target='" + element.target + "'>" + element.text + "</a>");
        });

        return encodedHTML;
    }


    this.changeTutorial = function InteractiveTutorial_App$changeTutorial() {

        var scenarioTitle = $("#scenariolabel option:selected").text();
        var taskTitle = '';
        var scenarioList = $("#scenariolabel")[0];
        var numTutorials = scenarioList.length;
        var scenario, scenarioNumber = -1;
        
        for (var i = 0; i < numTutorials; i++) {
            if (scenarioTitle == scenarioList.options[i].value) {
                scenario = _contentList[i];
                scenarioNumber = i;
                break;
            }
        }

        if (scenarioNumber == -1) {
            writeLog("Invalid scenario name in cookies")
            InteractiveTutorial.App.showList();
            return;
        }
        _tasks = scenario.tasks;
        _currentTaskIndex = 0;

        _currentContentIndex = scenarioNumber;
        _currentScenario = scenarioTitle;
        //_currentLink = $("#scenariolabel")[0][scenarioNumber].link;
        
        InteractiveTutorial.App.showTask();
    }


    var console = {};
    console.log = function (text) {
        if (text.indexOf('arrow button') > -1) {
            text = text.replace('arrow button', '<span class="arrow">arrow button</span>');
        }
        $("#message").html(text);
        $("#toastMessage").slideDown();
        $("#closeImage")[0].focus();
    };
}

//FancyBox appears over content, triggered upon first use of TryitOut
function setAndShowFancyBox() {
    $("#fancyHolder").html("<a class='fancybox'><h1 style='text-align:center'>Welcome to the API Tutorial</h1><p>This add-in helps you try out the selected API call against Excel Online in real time. To use it:</p><p> 1. Read the code and description for the API call you selected (Note: the API call itself may be in one of the next steps)</p><p>2. Click <span class='fancyboxbuttonclass'><u>R</u>un Code</span> to see the API calls in action</p><p> 3. Click <img src='../Images/next-translucent.png' class='fancyImage' /> to move on to the next step in the tutorial</p><p> 4. When completed, click <img src='../Images/list-translucent.png' class='fancyImage' /> to see a menu of other API calls to explore</p></a>");
    $.fancybox({
        href: "#fancyHolder",
        closeBtn: true,
        maxWidth: 800,
        maxHeight: 600,
        fitToView: true,
        width: '80%',
        height: '80%',
        autoSize: false,
        closeClick: false,
        openEffect: 'elastic',
        closeEffect: 'none'
    });
}

// Display a message at the bottom of the task pane - called when code is executed in the window. Use console.log (overriding the browser console.log so that if users copy code snippets, they can still run it without modifying
//function showMessage(text) {
//    $("#message").text(text);
//    $("#toastMessage").slideDown();
//    $("#closeImage")[0].focus();
//}


function writeLog(msg) {
    AppsTelemetry.sendLog(AppsTelemetry.TraceLevel.info, msg);
}

function writeError(msg) {
    AppsTelemetry.sendLog(AppsTelemetry.TraceLevel.error, msg);
}

function initAppHostInfo() {
    //Try to determine the app host using the query string
    //search: "?_host_Info=Excel|Win32|16.00", some hosts use $ for querystring delim instead of |
    var search = window.location.search.toLowerCase();
    try {
        var info = search.split("host_info=");
        if (info.length > 1) {
            var infoBits = info[1].split("|", 3);
            if (infoBits.length == 1){
                //didn't find info using |, trying $
                var infoBits = info[1].split("$", 3);
            }
            _appHost = infoBits[0];
            _appBitness = infoBits[1];
            _appVersion = infoBits[2];
        }

        if (_appHost == "" && window.external != "undefined" && window.external.GetContext != "undefined") {
            var appType = window.external.GetContext().GetAppType()
            switch (appType) {
                case 1:
                    _appHost = "excel"; break;
                case 2:
                    _appHost = "word"; break;
                case 4: "powerpoint"
                    _appHost = "powerpoint"; break;
                case 8:
                    _appHost = "outlook"; break;
                case 4:
                    _appHost = "project"; break;
            }
        }

        if (_appVersion.search("16.") == 0) {
            _appVersion = "16";                
        }
        else {
            _appVersion = "15";
        }

        if ((_appHost.toLowerCase() == "excel" || _appHost.toLowerCase() == "word") && _appVersion == "16") {
            $('#bottomMenu').removeClass("hidden");            
        }

    } catch(e) {
        //there was a problem with the querystring, leave variables blank if info can't be determined
    }
    writeLog("Host info: [apphost=" + _appHost + "], [appbitness=" + _appBitness + "], [appversion=" + _appVersion + "]");
}

function getDocLocation() {
    if (Office.context.document && typeof Office.context.document.getFilePropertiesAsync != "undefined") {
        Office.context.document.getFilePropertiesAsync(
            function (asyncResult) {
                if (asyncResult.status == "failed") {
                    writeError("Could not get document location: " + asyncResult.error.message);
                }
                else {
                    var docUrl = asyncResult.value.url;
                    if (docUrl) {
                        var parts = docUrl.split("/");
                        if (parts.length > 2) {
                            //if a local file, the returned path will just be the full local path
                            //if http(s), the 3 item in the array will be the host--only log that for pii reasons
                            writeLog("Document location: " + parts[2]);
                        }
                        else {
                            writeLog("Document location: local");
                        }
                    } else {
                        writeLog("Embedded");
                    }
                }
            });
    }
}

//Add stylesheets for app host specific color elements
//app.css will have default values for those elements being modified by app specific css
function updateCSSforHost() {
    switch (_appHost.toLowerCase()) {
        case "excel":
            // hostColor is "#337147"; 
            $('head').append('<link rel="stylesheet" href="Content/AppXL.css" type="text/css" />');
            break;
        case "powerpoint":
            // hostColor is "#b7472a";
            $('head').append('<link rel="stylesheet" href="Content/AppPPT.css" type="text/css" />');
            break;
        case "word":
            // hostcolor is "#2b579a";
            $('head').append('<link rel="stylesheet" href="Content/AppWord.css" type="text/css" />');
            break;
        case "access":
            // hostcolor is "#a4373a";
            $('head').append('<link rel="stylesheet" href="Content/AppAccess.css" type="text/css" />');
            break;
        case "project":
            // hostcolor is "#31752f";
            $('head').append('<link rel="stylesheet" href="Content/AppProject.css" type="text/css" />');
            break;
        case "outlook":
            // hostcolor is "#2873C9";
            $('head').append('<link rel="stylesheet" href="Content/AppOutlook.css" type="text/css" />');
            _detectOutlook = true;
        }
}

Office.initialize = function (reason) {    
    $(document).ready(function () {       
        //Init telemetry
        var telemetryOptions = {};
        telemetryOptions["appVersion"] = "1.1";
        telemetryOptions["appLoadReason"] = reason;
        AppsTelemetry.initialize(appName, telemetryOptions);

        //Init app
        InteractiveTutorial.App.init();

        //Init code snippet 
        CodeSnippetsInit();

   });
}
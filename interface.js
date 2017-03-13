var isLocalStorage = true;
var launchCount = 0;

function RunScript() {
    var newjs = document.createElement("script");
    var file = document.getElementById("scriptFile").value;
    newjs.src = file;
    if (isLocalStorage) window.localStorage.jsname = file;
    newjs.onload = wrappedLaunch;
    document.head.appendChild(newjs);
    document.getElementById("buttonRun").onclick = wrappedLaunch;
    document.getElementById("scriptFile").disabled = "disabled";
}

function printf(str) {
    var array_str = String(str).split("");
    var result_str = new String;
    for(var i = 0, len = array_str.length; i < len; i++) {
        switch(array_str[i]) {
            case '<': result_str += "&lt;"; break;
            case '>': result_str += "&gt;"; break;
            default: result_str += array_str[i];
        }
    }
    
    var tout = document.getElementById("textOut");
    tout.innerHTML += result_str;
    if (isLocalStorage) window.sessionStorage.textout = tout.innerHTML;
}

function ClearScreen() {
    document.getElementById("textOut").innerHTML = "";
    if (isLocalStorage) window.sessionStorage.textout = "";
}

function ReloadScript() {
    if (isLocalStorage) {
        window.localStorage.jsname = document.getElementById("scriptFile").value;
        window.localStorage.isReloadScript = "true";
    }
    location.reload(true);
}

function init() {
    try {
        var storage = window.localStorage;
    } catch (e) {
        //IE and Edge disable LocalStorage in local files
        isLocalStorage = false;
    }

    if (!storage) {
        isLocalStorage = false;
        document.getElementById("errorMsg").innerHTML = "HTML5 LocalStorage is not supported, or is disabled by Internet Explorer or Microsoft Edge in local files. Functionality is limited.";
        document.getElementById("subTitle").innerHTML = "LocalStorage: Disabled";
    }
    else {
        isLocalStorage = true;
        document.getElementById("errorMsg").innerHTML = "";
        document.getElementById("subTitle").innerHTML = "LocalStorage: Enabled";
        //localStorage
        if (!storage.jsname) storage.jsname = "src/main.js";
        document.getElementById("scriptFile").value = storage.jsname;
        //sessionStorage
        var s_storage = window.sessionStorage;
        if (!s_storage.textout) s_storage.textout = 'Click "Run Script" to run your script...\n\n';
        document.getElementById("textOut").innerHTML = s_storage.textout;
        //ReloadScript
        if (storage.isReloadScript == "true") {
            storage.isReloadScript = "false";
            RunScript();
        }
    }
}

function wrappedLaunch() {
    launchCount ++;
    var filename = "Run";
    if (isLocalStorage) filename = window.localStorage.jsname;
    printf(filename + ' ' + launchCount + ' ' + '>');
    var rv = main();
    printf("\n\n=================================\nScript ended");
    if (rv != null) printf(" with return value '" + rv +"'\n\n");
    else printf (" with no return value\n\n");
}

(function () {
    function toRequestParams(params) {
        var requestParams = "";
        if (params) {
            for (var key in params) {
                requestParams += "&" + key + "=" + params[key];
            }
            requestParams.substr(1);
        }
        return requestParams;
    }

    function toRequestUrl(url, params, cache) {
        var requestUrl = "";
        if (url) {
            if (cache) {
                if (toRequestParams(params)) {
                    requestUrl = url + "?" + toRequestParams(params);
                }
            } else {
                requestUrl = url + "?" + "t=" + Math.random();
                if (toRequestParams(params)) {
                    requestUrl += "&" + toRequestParams(params);
                }
            }
        }
        return requestUrl;
    }

    var jAjax = {};

    jAjax.request = function (method, url, async, cache, params, onsuccess, onerror) {
        var xhr = new XMLHttpRequest();
        var response = {};
        if (method.toUpperCase() == "GET") {
            xhr.open("GET", encodeURI(toRequestUrl(url, params, cache)), async);
            xhr.send();
            if (!async) {
                if (xhr.status == 200) {
                    response = JSON.parse(xhr.responseText);
                    onsuccess(response);
                } else {
                    onerror();
                }
            }
        } else if (method.toUpperCase() == "POST") {
            xhr.open("POST", encodeURI(url), async);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(params));
            if (!async) {
                if (xhr.status == 200) {
                    response = JSON.parse(xhr.responseText);
                    onsuccess(response);
                } else {
                    onerror();
                }
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    response = JSON.parse(xhr.responseText);
                    onsuccess(response);
                } else {
                    onerror();
                }
            }
        }
    };

    jAjax.get = function (url, params, onsuccess) {
        jAjax.request("GET", url, true, false, params, onsuccess, null);
    };

    jAjax.post = function (url, params, onsuccess) {
        jAjax.request("POST", url, true, false, params, onsuccess, null);
    };

    jAjax.upload = function (url, fileinputid, onsuccess, onerror) {
        var formData = new FormData();
        var name = document.getElementById(fileinputid).getAttribute("name");
        var value = document.getElementById(fileinputid).files[0];
        formData.append(name, value);
        var xhr = new XMLHttpRequest();
        var response = {};
        xhr.open("POST", encodeURI(url), true);
        xhr.send(formData);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    response = JSON.parse(xhr.responseText);
                    onsuccess(response);
                } else {
                    onerror();
                }
            }
        }
    };

    window.jAjax = jAjax;
})();

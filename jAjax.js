(function (window) {
    function toRequestParams(params) {
        var requestParams = "";
        var paramsStr = "";
        if (params) {
            paramsStr = JSON.stringify(params);
            requestParams = paramsStr.substr(1, paramsStr.length - 2).replace(/"/g, "").replace(/:/g, "=").replace(/,/g, "&");
        }
        return requestParams;
    }

    function toRequestUrl(url, params, cache) {
        var requestUrl = "";
        if (url) {
            if (!cache) {
                requestUrl = url + "?" + "t=" + Math.random();
                if (toRequestParams(params)) {
                    requestUrl = requestUrl + "&" + toRequestParams(params);
                }
            } else {
                if (toRequestParams(params)) {
                    requestUrl = requestUrl + "?" + toRequestParams(params);
                }
            }
        }
        return requestUrl;
    }

    var jAjax = {};

    jAjax.request = function (method, url, async, cache, params, onsuccess, onerror) {
        var xhr = new XMLHttpRequest();
        var data = {};
        if (method.toUpperCase() == "GET") {
            xhr.open("GET", encodeURI(toRequestUrl(url, params, cache)), async);
            xhr.send();
            if (!async) {
                if (xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    onsuccess(data);
                } else {
                    onerror();
                }
            }
        } else if (method.toUpperCase() == "POST") {
            xhr.open("POST", encodeURI(url), async);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(toRequestParams(params));
            if (!async) {
                if (xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    onsuccess(data);
                } else {
                    onerror();
                }
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                    onsuccess(data);
                } else {
                    onerror();
                }
            }
        }
    }

    jAjax.get = function (url, params, callback) {
        jAjax.request("GET", url, true, false, params, callback, null);
    }

    jAjax.post = function (url, params, callback) {
        jAjax.request("POST", url, true, false, params, callback, null);
    }

    window.jAjax = jAjax;
})(window);

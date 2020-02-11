// var x = document.querySelectorAll("a");
// var l = [];
// var i;
// for (i = 0; i < x.length; i++) {
//   l.push(x[i].getAttribute('href'));
// };
// console.log(l.sort());

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

var pageSession = uuidv4();

window.addEventListener('locationchange', function() {
    pageSession = uuidv4();
});

var contentLinkPatterns = new RegExp('/experiences/.*|/rooms/.*|/s/.*');

function getPageDescription(url) {
    return url;
    // if (url.match(contentLinkPatterns)) {
    //     return 'content';
    // } else {
    //     return url;
    // }
}

function isBlank(str) {
    return !str || /^\s*$/.test(str);
}

function getAriaLabel(element) {
    var role = element.getAttribute('role');
    if (!isBlank(role)) {
        return role;
    }
    var ariaLabel = element.getAttribute('aria-label');
    return ariaLabel;
}

function getTargetLabel(element) {
    var labels = element.labels;
    if (labels && labels.length > 0) {
        var textContent = labels[0].innerText;
        if (!isBlank(textContent)) {
            return textContent;
        }
    }
    var tagName = element.tagName.toUpperCase();
    if (tagName === 'BUTTON') {
        var textContent = element.innerText;
        if (!isBlank(textContent)) {
            return textContent;
        }
    }
    if (tagName === 'A') {
        // var link = element.getAttribute('href');
        // if (link.match(contentLinkPatterns)) {
        //     return 'content';
        // }
        var textContent = element.innerText;
        if (!isBlank(textContent)) {
            return textContent;
        }
    }
    if (tagName !== 'SVG') {
        var ariaLabel = getAriaLabel(element);
        if (ariaLabel) {
            return ariaLabel;
        }
    }
    var parentElement = element.parentElement;
    if (parentElement) {
        return getTargetLabel(parentElement);
    } else {
        return "";
    }
}

var action = 'click';
this.window.document.addEventListener(
    action,
    function (e) {
        var element = e.target;
        var textContent = getTargetLabel(element);
        console.log(textContent);
        var data = {
            action: action,
            page_session: pageSession,
            target: textContent
        };
        sendData(data);
    },
    true);

function sendData(data) {
    if (isBlank(data.target)) {
        return;
    }
    data.time = new Date().getTime();
    chrome.runtime.sendMessage({
        contentScriptQuery: 'record',
        data: data
    }, function (response) {
        console.log('Sent.');
    });
}

sendData({
    action: 'load',
    page_session: pageSession,
    target: getPageDescription(location.pathname)
});

window.addEventListener('locationchange', function() {
    sendData({
        action: 'load',
        page_session: pageSession,
        target: getPageDescription(location.pathname)
    });
});
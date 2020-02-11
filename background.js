chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request);
        if (request.contentScriptQuery === 'record') {
            fetch('http://localhost:3000/record', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request.data)
            }).then(function(response) {
                console.log('Sent.');
                sendResponse()
            });
            return true;
        }
    });
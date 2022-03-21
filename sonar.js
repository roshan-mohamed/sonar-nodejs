const fs = require('fs');
const request = require('request');
const { buffer } = require('buffer')

function parseFile(data) {
    var array = data.toString().split("\n");
    for(index in array) {
        var line = array[index]
        if (line && line.startsWith('ceTaskUrl')) {
            var url = line.substring(line.indexOf("=") + 1)
            url = url.trim()
            console.log("url: " + url);
            var auth = 'Basic ' + Buffer.from('admin:sonar').toString("base64")

            const requestOptions = {
                url: url,
                method: 'GET',
                headers: {
                    'Authorization': auth
                }
            };

            request(requestOptions, (err, response, body) => {
                if (err) {
                    console.log("Error retrieving sonarqube status: " + err);
                } else if (response.statusCode === 200) {
                    console.log(body)
                    const result = JSON.parse(body)
                    console.log("analysisId = " + result.task.analysisId)

                } else {
                    console.log("Received status code from sonarqube: " + response.statusCode)
                }

            })
        }

    }

}

fs.readFile('report-task.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    parseFile(data)
});

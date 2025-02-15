const URL = "https://comp4537-lab5-10kt.onrender.com/";  // Change this to adams render url ##########################

// const a = [{
//     name: 'Sara Brown',
//     dateOfBirth: '1990-01-01'
// },
// {
//     name: 'John Smith',
//     dateOfBirth: '1941-01-01'
// },
// {
//     name: 'Jack Ma',
//     dateOfBirth: '1961-01-30'
// },
// {
//     name: 'Elon Musk',
//     dateOfBirth: '1999-01-01'
// }]

async function queryA() {
    try {
        let response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Sara Brown',
                dateOfBirth: '1990-01-01'
            })
        });
        response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'John Smith',
                dateOfBirth: '1941-01-01'
            })
        });
        response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Jack Ma',
                dateOfBirth: '1961-01-30'
            })
        });
        response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Elon Musk',
                dateOfBirth: '1999-01-01'
            })
        });
        const result = await response.json();
        document.getElementById("result").innerHTML = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("result").innerHTML = message.err;
    }
}

async function queryB() {
    try {
        const query = document.getElementById("query").value;

        let response;

        if (query.trim().toLowerCase().startsWith("insert")) {
            const regex = /insert\s+into\s+patients\s*\(name,\s*dateOfBirth\)\s*values\s*\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/i;
            const match = query.match(regex);
            let jsonData;
            if (match) {
                const name = match[1];
                const dateOfBirth = match[2];
                jsonData = { name, dateOfBirth };
                console.log(jsonData);

                response = await fetch(`${URL}/lab5/api/v1/sql/query`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(jsonData)
                });

                const data = await response.json();
                document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
            } else {
                document.getElementById("result").innerHTML = message.invalidQuery;
            }
        } else if (query.trim().toLowerCase().startsWith("select")) {
            const encodedQuery = encodeURIComponent(query);
            response = await fetch(`${URL}/data?query=${encodedQuery}`);
            const data = await response.json();
            document.getElementById("result").innerHTML = JSON.stringify(data, null, 2);
        } else {
            document.getElementById("result").innerHTML = message.invalidQuery;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("result").innerHTML = message.err;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnA").addEventListener("click", queryA);
    document.getElementById("btnB").addEventListener("click", queryB);
});
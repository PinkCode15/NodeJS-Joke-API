const http = require('http');

/**
 * db array of objects format -
    {
      "title": "Marvel",
      "comedian": "Kevin Hart",
      "year": "2024",
      "id": 5
    },
 */
let db = [];
  
const server = http.createServer((req, res) => {
    
    if (req.url === '/' && req.method === 'GET') {
        getJokes(req, res);
    } else if (req.url === '/' && req.method === 'POST') {
        postJoke(req, res); 
    } else if (req.url.startsWith('/joke/') && req.method === 'PATCH') {
       updateJoke(req, res);
    } else if (req.url.startsWith('/joke/') && req.method === 'DELETE') {
        deleteJoke(req, res); 
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({"error": true, "message": "Not found"}));
    }
});


function getJokes(req, res) {
    res.writeHead(200);
    res.end(JSON.stringify({"data": db, message: "Jokes fetched successfully"}));
}

function postJoke(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const joke = JSON.parse(body);
        joke.id = db.length + 1; 
        db.push(joke);

        res.writeHead(201);
        res.end(JSON.stringify({"data": db, message: "Joke created successfully"}));
    });
}

function updateJoke(req, res) {
    const id = parseInt(req.url.split('/')[2]);
    let body = '';

    req.on("data", (chunk) => {
        body += chunk.toString();
    })

    req.on("end", () => {
        const joke = JSON.parse(body);

        db = db.map(item => {
            if (item.id === id) {
                return {...item, ...joke};
            }
            else return item;
        });

        const updatedDB = db.find(joke => joke.id === id);

        res.writeHead(200);
        res.end(JSON.stringify({"data": updatedDB, message: "Joke updated successfully"}));
    });
   
}

function deleteJoke (req, res) {
    const id =  parseInt(req.url.split('/')[2]);
    const deletedJoke = db.find(joke => joke.id === id);
    db = db.filter(joke => joke.id !== id);

    res.writeHead(200);
    res.end(JSON.stringify({"data": deletedJoke, message: "Joke deleted successfully"})); 
}

server.listen(3000, '127.0.0.1', () => {
    console.log("server is running");
})
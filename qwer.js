const http = require("http");
const url = require("url");
const { pool } = require("./db");
const PORT = process.env.PORT || 8000;
const messages = require("./en/en");

pool.connect((err) => {
  if (err) {
    console.error(messages.message.dbConnectFail, err);
  } else {
    console.log(messages.message.dbConnectSuccess);
  }
});

const requestHandler = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const tableName = parsedUrl.query.table;

  if (
    req.method === "POST" &&
    parsedUrl.pathname === "/lab5/api/v1/sql/query"
  ) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { name, dateOfBirth } = data;

        if (!name || !dateOfBirth) {
          res.writeHead(400, { "Content-Type": "text/html" });
          return res.end(messages.message.lackParams);
        }

        const insertQuery = `INSERT INTO patients (name, dateOfBirth) VALUES ($1, $2) RETURNING *`;
        const values = [name, dateOfBirth];

        const result = await pool.query(insertQuery, values);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: messages.message.insertSuccess,
            patient: result.rows[0],
          })
        );
      } catch (err) {
        console.error("INSERT Error:", err);
        res.writeHead(500, { "Content-Type": "text/html" });
        return res.end(messages.message[500]);
      }
    });
  } else if (
    req.method === "GET" &&
    parsedUrl.pathname === "/lab5/api/v1/sql/getAll" &&
    tableName
  ) {
    if (tableName !== "patients") {
      res.writeHead(400, { "Content-Type": "text/html" });
      return res.end(messages.message[400]);
    }

    const getAllFromTable = `SELECT * FROM ${tableName}`;

    try {
      const result = await pool.query(getAllFromTable);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.rows));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/html" });
      return res.end(messages.message[500]);
    }
  } else {
    res.writeHead(405, { "Content-Type": "text/html" });
    return res.end(messages.message[405]);
  }
};

const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
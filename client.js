import net from "net";
import fs from "fs";

const SERVER_HOST = "localhost";
const SERVER_PORT = 4000;

function sendFile(filePath) {
    const filename = filePath.split("/").pop();
    const client = net.createConnection({ host: SERVER_HOST, port: SERVER_PORT }, () => {
        console.log("Connected to TCP Server.");
        client.write(filename + "\n");

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(client);
    });

    client.on("data", (data) => {
        console.log("Server:", data.toString());
        client.end();
    });

    client.on("error", (err) => console.error(`Client error: ${err.message}`));
}

// Example usage: sendFile("uploads/test.txt");

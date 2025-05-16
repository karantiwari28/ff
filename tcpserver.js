import net from "net";
import fs from "fs";
import path from "path";

const TCP_PORT = 4000;
const UPLOADS_DIR = "./uploads/";

export function startTCPServer() {
    const server = net.createServer((socket) => {
        console.log("TCP Client connected.");

        let filename = "";
        let fileStream;

        socket.on("data", (data) => {
            if (!filename) {
                filename = data.toString().trim();
                fileStream = fs.createWriteStream(path.join(UPLOADS_DIR, filename));
            } else {
                fileStream.write(data);
            }
        });

        socket.on("end", () => {
            console.log(`File received: ${filename}`);
            fileStream.end();
            socket.write(`File uploaded successfully: ${filename}`);
            socket.end();
        });

        socket.on("error", (err) => console.error(`TCP Error: ${err.message}`));
    });

    server.listen(TCP_PORT, () => {
        console.log(`TCP Server running on port ${TCP_PORT}`);
    });
}

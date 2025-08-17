import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHello(): string {
    const serverUrl = `https://${process.env.SERVER}:${process.env.PORT}`;
    return `
      <html>
        <head><title>Server Status</title></head>
        <body>
          <h1>Taro services is online</h1>
          <p>The server is up and running at <strong>${serverUrl}</strong></p>
        </body>
      </html>
    `;
  }
}

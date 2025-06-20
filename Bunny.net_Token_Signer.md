# Bunny.net Token Signer

A secure Node.js web application for generating signed video playback URLs using Bunny.net's HMAC SHA256 token signing method.

## Features

- Secure token generation using HMAC SHA256
- RESTful API endpoint for token signing
- Docker support for easy deployment
- CORS enabled for cross-origin requests
- Environment-based configuration
- Health check endpoint
- Error handling and validation

## Project Structure

```
📁 bunny-token-signer
 ┣ 📄 server.js          # Main application server
 ┣ 📄 Dockerfile         # Docker configuration
 ┣ 📄 package.json       # Node.js dependencies
 ┣ 📄 .env              # Environment variables
 ┣ 📄 .dockerignore     # Docker ignore file
 └ 📄 README.md         # This file
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
PORT=3000
BUNNY_SIGNING_KEY=your_bunny_signing_key_here
BUNNY_BASE_URL=https://video.b-cdn.net
```

- `PORT`: Server port (defaults to 3000)
- `BUNNY_SIGNING_KEY`: Your Bunny.net token signing key
- `BUNNY_BASE_URL`: Your Bunny.net CDN base URL

## Installation

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`
4. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t bunny-token-signer .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e BUNNY_SIGNING_KEY=your_key_here \
     -e BUNNY_BASE_URL=https://video.b-cdn.net \
     bunny-token-signer
   ```

## API Endpoints

### Health Check
```
GET /
```
Returns service status and version information.

### Sign Video URL
```
GET /sign?path=/yourfile.mp4
```

**Parameters:**
- `path` (required): The video file path to sign

**Response:**
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://video.b-cdn.net/yourfile.mp4?token=abc123&expires=1234567890",
    "path": "/yourfile.mp4",
    "expires": 1234567890,
    "expiresAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "error": "Missing required parameter: path",
  "message": "Please provide a path parameter (e.g., ?path=/yourfile.mp4)"
}
```

## Usage Examples

### cURL
```bash
curl "http://localhost:3000/sign?path=/video.mp4"
```

### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3000/sign?path=/video.mp4');
const data = await response.json();
console.log(data.data.signedUrl);
```

### Python (Requests)
```python
import requests

response = requests.get('http://localhost:3000/sign?path=/video.mp4')
data = response.json()
print(data['data']['signedUrl'])
```

## Security Features

- HMAC SHA256 token generation
- Token expiration (1 hour by default)
- Input validation and sanitization
- Error handling without sensitive data exposure
- Non-root user in Docker container

## Deployment on Bunny.net

This application is ready for deployment on Bunny.net's container platform:

1. Push your code to a GitHub public repository
2. Configure the environment variables in your Bunny.net deployment
3. The Dockerfile will automatically build and run the application

## License

MIT License


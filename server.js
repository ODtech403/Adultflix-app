const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bunny.net Token Signer Service',
    status: 'running',
    version: '1.0.0'
  });
});

// Token signing endpoint
app.get('/sign', (req, res) => {
  try {
    const { path } = req.query;
    
    // Validate required parameters
    if (!path) {
      return res.status(400).json({
        error: 'Missing required parameter: path',
        message: 'Please provide a path parameter (e.g., ?path=/yourfile.mp4)'
      });
    }

    // Validate environment variables
    const signingKey = process.env.BUNNY_SIGNING_KEY;
    const baseUrl = process.env.BUNNY_BASE_URL;

    if (!signingKey) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'BUNNY_SIGNING_KEY environment variable is not set'
      });
    }

    if (!baseUrl) {
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'BUNNY_BASE_URL environment variable is not set'
      });
    }

    // Generate expiration timestamp (1 hour from now)
    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    
    // Create the string to sign
    // Format: signing_key + path + expiration_time
    const stringToSign = signingKey + path + expirationTime;
    
    // Generate HMAC SHA256 hash
    const hash = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex');
    
    // Create the signed URL
    const signedUrl = `${baseUrl}${path}?token=${hash}&expires=${expirationTime}`;
    
    // Return the response
    res.json({
      success: true,
      data: {
        signedUrl: signedUrl,
        path: path,
        expires: expirationTime,
        expiresAt: new Date(expirationTime * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('Error signing token:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate signed URL'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bunny.net Token Signer running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
  console.log(`Sign endpoint: http://localhost:${PORT}/sign?path=/yourfile.mp4`);
});

module.exports = app;


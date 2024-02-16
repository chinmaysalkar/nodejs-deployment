const { google } = require('googleapis');
const fs = require('fs');
const stream = require('stream');
// Load the service account key file
const keyFile = require('../epicHR.json');

// Authenticate with Google Drive using service account credentials
const auth = new google.auth.GoogleAuth({
  credentials: keyFile,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Create a Google Drive API client
const drive = google.drive({ version: 'v3', auth });

//Function to upload profile photo to Google Drive
const uploadProfilePhotoToDrive = async function (userId, photoPath) {
  try {
    // Upload the photo to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: `${userId}_profilePhoto_${Date.now()}.jpg`, // Set file name
        parents: ['1uNJcAbumk1x13WhMF71jZE6L3QCWzB3D'], // Set folder ID where you want to upload
      },
      media: {
        mimeType: 'image/jpeg', // Set the MIME type of the file
        body: fs.createReadStream(photoPath), // Read the file from disk
        
      },
    });

    // Return the file ID or URL for later use
    return response.data.id; // You can also return response.data.webViewLink if you want to get the file URL
  } catch (error) {
    console.error('Error uploading profile photo to Google Drive:', error);
    throw error;
  }
}






module.exports = {
    uploadProfilePhotoToDrive
}
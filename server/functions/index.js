const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.createProfile = functions.auth.user().onCreate( event => {
    console.log('user event', event);
    return admin.database().ref(`/userProfile/${event.data.uid}`).set({
      email: event.data.email
    });
  });
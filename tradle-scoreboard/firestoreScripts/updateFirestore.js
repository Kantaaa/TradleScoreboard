const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Function to calculate points
function calculatePoints(attempts) {
  const pointsMap = {
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 0
  };
  return pointsMap[attempts] || 0;
}

// Main function to update Firestore
async function updateFirestore() {
  const scoresRef = db.collection('scores');
  const querySnapshot = await scoresRef.get();

  // Start batch
  const batch = db.batch();

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const points = calculatePoints(data.attempts);
    const docRef = scoresRef.doc(doc.id);
    batch.update(docRef, { points });
  });

  // Commit the batch
  await batch.commit();
  console.log('Firestore updated successfully');
}

// Run the function
updateFirestore().catch(console.error);

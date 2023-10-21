// Import the functions you need from the SDKs you need
const firebase = require("firebase/app");
const { getFirestore, addDoc, collection } = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);


// Function to calculate points
function calculatePoints(attempts) {
  const pointsMap = {
    1: 7,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 0 // Assuming 7 means "no luck"
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









// const addScore = async (score) => {
//   console.log("Adding score:", score);  // Debugging line
//   try {
//     await addDoc(collection(db, "scores"), score);
//     console.log("Score added successfully");
//   } catch (error) {
//     console.error("Error adding score:", error);
//     if (error.details) {
//       console.error("Error details:", error.details);
//     }
//   }
// };

// const getDateString = (daysToAdd) => {
//   const date = new Date();
//   date.setDate(date.getDate() + daysToAdd);
//   return date.toISOString().split('T')[0];
// };

// // Let's try with just one player first
// const player = "Kevin";

// // Generate scores for each day from Monday to Friday
// for (let day = 0; day < 5; day++) {
//   const date = getDateString(day);
//   const attempts = Math.floor(Math.random() * 6) + 1; // Random attempts between 1 and 6
//   const rank = 0;
//   addScore({ name: player, attempts, rank, date });
// }


// module.exports = { db };

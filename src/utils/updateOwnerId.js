import { getDocs, updateDoc, doc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase-config';

export const addOwnerIdToExistingDocs = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('❌ You must be logged in to update documents!');
    return;
  }

  const uid = user.uid;
  const studentsCol = collection(db, 'students');

  try {
    const snapshot = await getDocs(studentsCol);
    let updatedCount = 0;

    for (const studentDoc of snapshot.docs) {
      const data = studentDoc.data();

      if (!data.ownerId) {
        await updateDoc(doc(db, 'students', studentDoc.id), { ownerId: uid });
        updatedCount++;
        console.log(`✅ Updated ${studentDoc.id}`);
      }
    }

    if (updatedCount === 0) {
      console.log('ℹ️ All documents already have ownerId fields.');
    } else {
      console.log(`🎉 Updated ${updatedCount} documents successfully!`);
    }
  } catch (error) {
    console.error('🔥 Error updating documents:', error);
  }
};

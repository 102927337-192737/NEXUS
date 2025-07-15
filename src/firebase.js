import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC6inbBuS4oTGl5m6r4FWuVRRIHG4DTyU4",
  authDomain: "nexusweb-76266.firebaseapp.com",
  projectId: "nexusweb-76266",
  storageBucket: "nexusweb-76266.appspot.com",
  messagingSenderId: "275937342660",
  appId: "1:275937342660:web:292aa3addbdc2082f94591",
  measurementId: "G-SGCBPWT4DS"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app) 
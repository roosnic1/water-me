import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

import 'firebase/firestore'
import { FirebaseAppProvider, useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

function HelloMessage() {
    const helloRef = useFirestore().collection('hello').doc('test')

    const {data} = useFirestoreDocData(helloRef)

    // @ts-ignore
    return <p>{data.text}</p>
}

ReactDOM.render(
  <React.StrictMode>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} suspense={true}>
          <SuspenseWithPerf fallback={'loading burrito status...'} traceId={'load-test-status'}>
            <HelloMessage />
          </SuspenseWithPerf>
      </FirebaseAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import './App.css';
import {SuspenseWithPerf, useFirestore, useFirestoreDocData} from "reactfire";
import CreatePlant from "./CreatePlant";

function HelloMessage() {
  const helloRef = useFirestore().collection('hello').doc('test')

  const {data} = useFirestoreDocData(helloRef)

  // @ts-ignore
  return <p>{data.text}</p>
}

function App() {
  return (
    <div className="sm:container sm:mx-auto">
      <SuspenseWithPerf fallback={'loading burrito status...'} traceId={'load-test-status'}>
        <HelloMessage />
      </SuspenseWithPerf>
      <CreatePlant />
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import {SuspenseWithPerf, useFirestore, useFirestoreDocData} from "reactfire";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import CreatePlant from "./CreatePlant";

function HelloMessage() {
  const helloRef = useFirestore().collection('hello').doc('test')

  const {data} = useFirestoreDocData(helloRef)

  // @ts-ignore
  return <p>{data.text}</p>
}

function App() {
  return (
      <Router>
          <div className="sm:container sm:mx-auto">
              <Switch>
                  <Route path="/create">
                      <h1>Create Plant</h1>
                  </Route>
                  <Route path="/identify">
                      <CreatePlant />
                  </Route>
                  <Route path="/">
                      <SuspenseWithPerf fallback={'loading burrito status...'} traceId={'load-test-status'}>
                          <HelloMessage />
                      </SuspenseWithPerf>
                  </Route>
              </Switch>
          </div>
      </Router>

  );
}

export default App;

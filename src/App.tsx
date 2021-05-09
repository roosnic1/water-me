import React from 'react';
import './App.css';
import {SuspenseWithPerf, useFirestore, useFirestoreDocData} from "reactfire";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Container, theming} from '@mantine/core';
import IdentifyPlant from "./IdentifyPlant";
import {createUseStyles} from "react-jss";


function HelloMessage() {
  const helloRef = useFirestore().collection('hello').doc('test')

  const {data} = useFirestoreDocData(helloRef)

  // @ts-ignore
  return <p>{data.text}</p>
}

const useStyles = createUseStyles(
  (theme) => ({
    '@global': {
      body: {
        // @ts-ignore
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        // @ts-ignore
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      },
    },
  }),
  {theming}
);

function App() {
  useStyles();
  return (
    <Router>
      <Container
        size="xs"
        padding="xs">
        <Switch>
          <Route path="/create">
            <h1>Create Plant</h1>
          </Route>
          <Route path="/identify">
            <IdentifyPlant/>
          </Route>
          <Route path="/">
            <SuspenseWithPerf fallback={'loading burrito status...'} traceId={'load-test-status'}>
              <HelloMessage/>
            </SuspenseWithPerf>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

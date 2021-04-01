import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import Todos from "./Todos";

const queryClient = new QueryClient();

const reactQueryConfig = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 0,
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient} config={reactQueryConfig}>
      <div className="App">
        <Router>
          <Switch>
            <Route path="/:id">
              <Todos />
            </Route>
            <Redirect from="/" to="/1" />
          </Switch>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;

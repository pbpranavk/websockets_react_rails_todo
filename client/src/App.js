import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";

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
        <Todos />
      </div>
    </QueryClientProvider>
  );
}

export default App;

import { QueryClient, QueryClientProvider } from "react-query";
import { ActionCableProvider } from "react-actioncable-provider";
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
    <ActionCableProvider url={"ws://localhost:8000/cable"}>
      <QueryClientProvider client={queryClient} config={reactQueryConfig}>
        <div className="App">
          <Todos />
        </div>
      </QueryClientProvider>
    </ActionCableProvider>
  );
}

export default App;

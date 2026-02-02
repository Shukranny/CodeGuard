import React from "react";
import Routes from "./Routes";
import { ScanProgressProvider } from "./context/ScanProgressContext";

function App() {
  return (
    <ScanProgressProvider>
      <Routes />
    </ScanProgressProvider>
  );
}

export default App;


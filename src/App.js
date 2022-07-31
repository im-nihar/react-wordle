import React, { Suspense } from "react";
// import Wordle from "./wordle/wordle";

const Wordle = React.lazy(() => import("./wordle/wordle"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Wordle />
      </Suspense>
    </div>
  );
}

export default App;

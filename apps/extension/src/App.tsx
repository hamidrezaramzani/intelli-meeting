import { Route, Routes } from "react-router";
import { LoginPage } from "./pages";

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
    </Routes>
  );
}

export default App;

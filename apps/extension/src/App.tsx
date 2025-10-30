import { Route, Routes } from "react-router";

import { ProtectRoute } from "./components";
import { LoginPage, RecordPage } from "./pages";

function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectRoute>
            <RecordPage />
          </ProtectRoute>
        }
      />
      <Route element={<LoginPage />} path="/login" />
    </Routes>
  );
}

export default App;

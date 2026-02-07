import { Toaster } from "react-hot-toast";
import ShipmentsEntry from "./components/shipments-entry/ShipmentsEntry";
function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ShipmentsEntry />

    </>
  );
}

export default App;

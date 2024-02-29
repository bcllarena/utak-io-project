import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/Toaster";
import Header from "./components-custom/Header";
import Footer from "./components-custom/Footer";
import ItemList from "./components-custom/ItemList";
import Categories from "./components-custom/Categories";
import AddOns from "./components-custom/AddOns";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ItemList />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/addons" element={<AddOns />} />
            <Route path="*" element={"Page not found"} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;

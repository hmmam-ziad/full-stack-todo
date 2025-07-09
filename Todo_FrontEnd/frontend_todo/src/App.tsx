import { RouterProvider } from "react-router-dom"
import router from "./router"
import { Toaster } from "react-hot-toast"


function App() {
  

  return (
    <>
      <main>
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </main>
    </>
  )
}

export default App

import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/home";
import { Detail } from "./pages/detail";
import { NotFounded } from "./pages/notFounded";

import { Layout } from "./components";

const router = createBrowserRouter([
    {
        element:<Layout/>,
        children:[
            {
                path: "/",
                element:<Home/>
            },
            {
                path:"/detail/:cripto",
                element:<Detail/>
            },
            {
                path:"*",
                element:<NotFounded/>
            }
        ]
    }
])

export {router}
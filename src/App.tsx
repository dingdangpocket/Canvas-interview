import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { RoutesItems } from "@/routerConfig/routerConfig";
import { ContentContext } from "./context/ContextProvider";
interface Props {
  name: string;
}
const App = (props: Props) => {
  const { state } = useContext(ContentContext);
  const renderRoutes = (routes: RoutesItems[]) => {
    return routes.map((item: RoutesItems, index: number) => {
      if (item && item.children) {
        return (
          <Route path={item.path} element={item.element} key={index}>
            {renderRoutes(item.children)}
          </Route>
        );
      } else {
        return (
          <Route path={item.path} element={item.element} key={index}></Route>
        );
      }
    });
  };
  return (
    <>
      <Routes>{renderRoutes(state.routerConfig)}</Routes>
    </>
  );
};
export default App;

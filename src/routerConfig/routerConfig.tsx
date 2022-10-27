import Loadable from "react-loadable";
const LoadingTip = () => <div>加载路由ing...</div>;
const Canvas = Loadable({
  loader: () => import("@/pages/Canvas"),
  loading: LoadingTip,
});

export type RoutesItems = {
  path: string;
  element: React.ReactElement;
  children?: RoutesItems[];
};
export const rootRouterConfig: RoutesItems[] = [
  {
    path: "/",
    element: <Canvas />,
  },
  { path: "*", element: <p>ERROR-PAGE;</p> },
  { path: "error", element: <p>ERROR-PAGE-对不起-您没有该路由权限;</p> },
];
// eslint-disable-next-line react-hooks/rules-of-hooks

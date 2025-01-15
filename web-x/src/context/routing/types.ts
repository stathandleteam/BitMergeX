export interface RouteParams {
  [key: string]: string | number | any;
}

export interface RouterContextType {
  previousRoute: string | null;
  currentRoute: string;
  params?: RouteParams | null;
  navigate: (route: string, params?: RouteParams) => void;
}
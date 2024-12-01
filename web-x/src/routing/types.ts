export interface RouteParams {
  [key: string]: string | number;
}

export interface RouterContextType {
  previousRoute: string | null;
  currentRoute: string;
  params?: RouteParams | null;
  navigate: (route: string, params?: RouteParams) => void;
}
export interface RouteParams {
    [key: string]: string | number;
  }

export interface RouterContextType {
    currentRoute: string;
    params?: RouteParams;
    navigate: (route: string, params?: RouteParams) => void;
}
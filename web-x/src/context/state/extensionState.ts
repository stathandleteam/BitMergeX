import { proxy } from "valtio";
import { ROUTES } from "../routing/constants";

export enum Actions {
  GET_ROUTER_STATE = "get-router-state",
  SET_ROUTER_STATE = "set-router-state",
}
export type Action = `${Actions}`;

export const state = proxy({
    beforeLastRoute: '',//previousRoute,
    lastRoute: ROUTES.HOME,
    routeParams: {} //typeof newParams === 'object' ? { ...params, ...newParams } : params
  });

export type ExtensionState = typeof state;

export const updateRouter = (payload: Partial<typeof state>) => {
  chrome.runtime.sendMessage({ type: Actions.SET_ROUTER_STATE, payload });
};
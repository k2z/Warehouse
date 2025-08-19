import { ClientsState } from "./clients/clients.reducer";
import { MeasuresState } from "./measures/measures.reducer";
import { ResourcesState } from "./resources/resources.reducer";

export type ApplicationState = {
  resources: ResourcesState;
  measures: MeasuresState;
  clients: ClientsState;
};

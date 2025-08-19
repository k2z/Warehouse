import { MeasuresState } from "./measures/measures.reducer";
import { ResourcesState } from "./resources/resources.reducer";

export type ApplicationState = {
  resources: ResourcesState;
  measures: MeasuresState;
};

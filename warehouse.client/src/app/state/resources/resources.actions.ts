import { Resource } from "./resource";
import { createActionGroup, props } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";

export const ResourcesActions = createActionGroup({
  source: 'Resources',
  events: {
    'Add Resource': props<{ item: Resource }>(),
    'Update Resource': props<{ item: Resource }>(),
    'Delete Resource': props<{ id: number }>(),
    'Loading Resources': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Resources': props<{ items: ReadonlyArray<Resource> }>(),
    'Unload Resources': props<{ optional?: string }>(),
    'Edit Resource': props<{ item: Resource }>(),
    'Reset Edit Resource': props<{ optional?: string }>(),
  },
});

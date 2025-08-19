
import { createActionGroup, props } from "@ngrx/store";
import { GridPageParams } from "../../utils/utils";
import { Client } from "./client";

export const ClientsActions = createActionGroup({
  source: 'Clients',
  events: {
    'Add Client': props<{ item: Client }>(),
    'Update Client': props<{ item: Client }>(),
    'Delete Client': props<{ id: number }>(),
    'Loading Clients': props<{ gridPageParams?: GridPageParams }>(),
    'Loaded Clients': props<{ items: ReadonlyArray<Client> }>(),
    'Unload Clients': props<{ optional?: string }>(),
    'Edit Client': props<{ item: Client }>(),
    'Reset Edit Client': props<{ optional?: string }>(),
  },
});

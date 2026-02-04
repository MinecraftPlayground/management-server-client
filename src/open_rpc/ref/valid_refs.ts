import type { Components, OpenRpcDocument } from '../open_rpc_document.ts';
import type { ValidRefForComponent } from './valid_ref_for_component.ts';

/**
 * Union of all valid $ref strings for a schema.
 * 
 * @template Schema OpenRPC document schema
 */
export type ValidRefs<Schema extends OpenRpcDocument> = {
  [ComponentKey in keyof Components] : ValidRefForComponent<Schema, ComponentKey>
}[keyof Components];

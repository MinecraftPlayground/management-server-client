import type { Components, OpenRpcDocument } from '../spec.ts';
import type { ValidRefForComponent } from './valid_ref_for_component.ts';

/**
 * Union of all valid $ref strings for a schema.
 * 
 * @template Schema - The OpenRPC document schema
 */
export type ValidRefs<Schema extends OpenRpcDocument> = {
  [ComponentKey in keyof Components] : ValidRefForComponent<Schema, ComponentKey>
}[keyof Components];

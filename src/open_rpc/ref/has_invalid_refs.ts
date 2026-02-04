import type { OpenRpcDocument } from '../spec.ts';
import type { CollectInvalidRefs } from './collect_invalid_refs.ts';


/**
 * Checks if a schema contains any invalid $refs.
 * 
 * @template Schema OpenRPC document schema
 */
export type HasInvalidRefs<Schema extends OpenRpcDocument> = [CollectInvalidRefs<Schema>] extends [never]
  ? false
  : true;

import type { $Ref, OpenRpcDocument } from '../spec.ts';
import type { ValidRefs } from './valid_refs.ts';

/**
 * Checks if a $ref string is valid for the schema.
 * 
 * @template Schema OpenRPC document schema
 * @template Ref $ref string to validate
 */
export type IsValidRef<
  Schema extends OpenRpcDocument,
  Ref extends $Ref
> = Ref extends ValidRefs<Schema>
  ? true
  : false;

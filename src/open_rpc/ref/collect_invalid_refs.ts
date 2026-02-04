import type { OpenRpcDocument } from '../open_rpc_document.ts';
import type { IsValidRef } from './is_valid_ref.ts';


/**
 * Recursively collects all invalid $ref strings from a type.
 * 
 * @template Schema OpenRPC document schema
 * @template Value Value to scan for invalid refs
 */
export type CollectInvalidRefs<
  Schema extends OpenRpcDocument,
  Value = Schema
> = 
  Value extends { $ref : infer Ref }
    ? Ref extends string
      ? IsValidRef<Schema, Ref> extends false
        ? Ref
        : never
      : never
    : Value extends readonly (infer ArrayItem)[]
      ? CollectInvalidRefs<Schema, ArrayItem>
      : Value extends object
        ? { [Key in keyof Value] : CollectInvalidRefs<Schema, Value[Key]> }[keyof Value]
        : never;

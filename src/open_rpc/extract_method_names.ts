import {OpenRpcDocument} from './spec.ts';


/**
 * This type generic extracts all method names from the given `Schema`.
 * 
 * @template Schema Schema document
 */
export type ExtractMethodNames<Schema extends OpenRpcDocument> = Schema extends {methods : readonly (infer Methods)[]}
  ? Methods extends {name : infer MethodName extends string}
    ? MethodName
    : never
  : never;

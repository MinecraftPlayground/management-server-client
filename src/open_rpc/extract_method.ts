import type {ExtractMethodNames} from './extract_method_names.ts';
import type {OpenRpcDocument} from './spec.ts';

/**
 * This type generic extracts a specific method from the given `Schema`.
 * 
 * @template Schema Schema document
 * @template MethodName Name of the method to extract
 */
export type ExtractMethod<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractMethodNames<Schema>
> = Schema extends {methods : readonly (infer MethodsArray)[]}
  ? Extract<MethodsArray, {name : MethodName}>
  : never;

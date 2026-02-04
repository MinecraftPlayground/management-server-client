import type { MethodObjectName, OpenRpcDocument } from './spec.ts';

/**
 * Extracts all method names from an OpenRPC schema as a union type.
 * 
 * @template Schema OpenRPC document schema
 * 
 * @example
 * ```
 * type Methods = ExtractMethodNames<Schema>
 * // => "method1" | "method2" | ...
 * ```
 */
export type ExtractMethodNames<
  Schema extends OpenRpcDocument
> = Schema extends { methods : readonly (infer Methods)[] }
  ? Methods extends { name : infer MethodName extends MethodObjectName }
    ? MethodName
    : never
  : never;

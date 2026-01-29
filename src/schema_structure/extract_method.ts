import { ExtractMethodNames } from './extract_method_names.ts';
import { OpenRpcSchema } from './open_rpc_schema.ts';

// export type ExtractMethod<
//   Schema,
//   MethodName extends ExtractMethodNames<Schema>
// > = Schema extends { methods: readonly (infer M)[] }
//   ? Extract<M, { name: MethodName }>
//   : never;

export type ExtractMethod<
  Schema,
  MethodName extends ExtractMethodNames<Schema>
> = Schema extends OpenRpcSchema<readonly (infer Method)[]>
  ? Extract<Method, { name: MethodName }>
  : never;

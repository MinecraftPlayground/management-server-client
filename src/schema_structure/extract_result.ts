// import { MethodObject, ParamObject, ResultObject } from './open_rpc_schema.ts';
import type { ResolveSchema } from './resolve_schema.ts';

export type ExtractResult<
  Schema,
  Method
> = Method extends { result : { schema : infer S } }
  ? ResolveSchema<Schema, S>
  : void;

// export type ExtractResult<
//   Schema,
//   Method
// > = Method extends MethodObject<string, readonly ParamObject[], ResultObject<infer SchemaValue>>
//   ? ResolveSchema<Schema, SchemaValue>
//   : void;

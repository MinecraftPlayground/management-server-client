import { ResolveMethodType } from './resolve_method_types.ts';
import { OpenRpcDocument } from './spec.ts';


export type ExtractResult<
  Schema extends OpenRpcDocument,
  Method
> = Method extends { result : { schema : infer S } }
  ? ResolveMethodType<Schema, S>
  : void;

// export type ExtractResult<
//   Schema,
//   Method
// > = Method extends MethodObject<string, readonly ParamObject[], ResultObject<infer SchemaValue>>
//   ? ResolveSchema<Schema, SchemaValue>
//   : void;

import type {ResolveMethodType} from './resolve_method_types.ts';
import type {OpenRpcDocument} from './spec.ts';

export type ExtractParams<
  Schema extends OpenRpcDocument,
  Method
> = Method extends {params : infer Params extends readonly unknown[]}
  ? { 
    [Item in keyof Params] : Params[Item] extends {schema : infer SchemaValue, required : true}
      ? ResolveMethodType<Schema, SchemaValue>
      : Params[Item] extends {schema : infer SchemaValue}
        ? ResolveMethodType<Schema, SchemaValue> | undefined
        : never
  }
  : [];

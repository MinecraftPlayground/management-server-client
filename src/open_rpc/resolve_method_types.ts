import type {ResolveRef} from './resolve_ref.ts';
import type {OpenRpcDocument} from './spec.ts';

/**
 * This type generic extracts a specific method from the given `Schema`.
 * 
 * @template Schema Schema document
 * @template Method Name of the method to extract
 */
export type ResolveMethodType<
  Schema extends OpenRpcDocument,
  Method
> = Method extends {$ref: infer Ref extends string}
  ? ResolveMethodType<Schema, ResolveRef<Schema, Ref>>
  : Method extends {type: "string", enum: ReadonlyArray<infer EnumItem>}
    ? EnumItem
    : Method extends {type: "string"}
      ? string
      : Method extends {type: "integer" | "number"}
        ? number
        : Method extends {type: "boolean"}
          ? boolean
          : Method extends {type: "null"}
            ? null
            : Method extends {type: "array", items: infer Items}
              ? Array<ResolveMethodType<Schema, Items>>
              : Method extends {type: readonly ("boolean" | "integer")[]}
                ? boolean | number
                : Method extends {type: "object"; properties: infer Properties}
                  ? {[Key in keyof Properties]?: ResolveMethodType<Schema, Properties[Key]>}
                  : unknown;

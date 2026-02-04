import type {OpenRpcDocument} from './spec.ts';

/**
 * This type generic resolves the given $ref from the components
 */
export type ResolveRef<
  Schema extends OpenRpcDocument,
  Ref extends string
> = Ref extends `#/components/${"schemas" | "contentDescriptors" | "errors" | "examples" | "examplePairings" | "links" | "tags"}/${infer SchemaName}`
  ? Schema extends { components: { schemas: infer Schemas } }
    ? SchemaName extends keyof Schemas
      ? Schemas[SchemaName]
      : never
    : never
  : never;

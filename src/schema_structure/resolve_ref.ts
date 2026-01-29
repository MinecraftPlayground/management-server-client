/**
 * This type generic resolves the given $ref from the components
 */
export type ResolveRef<
  Schema,
  Ref extends string
> = Ref extends `#/components/schemas/${infer SchemaName}`
  ? Schema extends { components: { schemas: infer Schemas } }
    ? SchemaName extends keyof Schemas
      ? Schemas[SchemaName]
      : never
    : never
  : never;

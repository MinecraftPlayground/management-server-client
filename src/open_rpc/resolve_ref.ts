import type { $Ref, OpenRpcDocument } from './spec.ts';

/**
 * Resolves a JSON Schema $ref string to its actual type definition.
 * Supports references to any component type in the OpenRPC schema.
 * 
 * @template Schema OpenRPC document schema
 * @template Ref $ref string to resolve (e.g., "#/components/schemas/player")
 * 
 * @example
 * ```ts
 * type UserRef = ResolveRef<Schema, "#/components/schemas/user">
 * ```
 */
export type ResolveRef<
  Schema extends OpenRpcDocument,
  Ref extends $Ref
> = Ref extends `#/components/${infer ComponentType}/${infer ComponentName}`
  ? ComponentType extends keyof NonNullable<Schema['components']>
    ? NonNullable<Schema['components']>[ComponentType] extends infer Components
      ? ComponentName extends keyof Components
        ? Components[ComponentName]
        : never
      : never
    : never
  : never;

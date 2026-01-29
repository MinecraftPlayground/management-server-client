// import { MethodObject, OpenRpcSchema } from './open_rpc_schema.ts';


export type ExtractMethodNames<Schema> = Schema extends { methods : readonly (infer Methods)[] }
  ? Methods extends { name : infer MethodName extends string }
    ? MethodName
    : never
  : never;

// export type ExtractMethodNames<Schema> = Schema extends OpenRpcSchema<(infer Methods)[]>
//   ? Methods extends MethodObject<infer MethodName>
//     ? MethodName
//     : never
//   : never;

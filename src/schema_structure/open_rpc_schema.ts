export interface RefType<Ref extends string = string> {
  $ref : Ref;
};

export interface StringType {
  type : "string"
};
export interface NullType {
  type : "null"
};

export interface EnumType<EnumItems = readonly string[]> {
  type : "string",
  enum : EnumItems
};

export interface IntegerType {
  type : "integer"
};

export interface BooleanType {
  type : "boolean"
};

export interface ObjectType<ObjectProperties = {
  [key : string] : SchemaObject
}> {
  type : "object",
  properties : ObjectProperties,
  required? : readonly string[]
};

export interface ArrayType<ArrayItems = SchemaObject> {
  type : "array",
  items : ArrayItems
};

export type PrimitiveSchemaObject =
  | EnumType
  | StringType
  | NullType
  | IntegerType
  | BooleanType
  | ArrayType
  | ObjectType


export interface UnionArrayType<Type extends PrimitiveSchemaObject> {
  type : (Type['type'])[];
};

export type SchemaObject =
  | PrimitiveSchemaObject
  | RefType
  | UnionArrayType<BooleanType | IntegerType>

export interface ParamObject {
  name : string;
  required? : true;
  schema : SchemaObject;
};

export interface ResultObject<Schema = SchemaObject> {
  name? : string;
  schema : Schema;
};

export interface MethodObject<
  Name = string,
  Params = readonly ParamObject[],
  Result = ResultObject
> {
  name : Name,
  description? : string,
  params : Params,
  result? : Result
}

export interface OpenRpcSchema<Methods = readonly MethodObject[]> {
  openrpc : string,
  info : {
    title : string,
    version : string
  },
  components : {
    schemas : {
      [key : string] : SchemaObject
    }
  },
  methods : Methods
};


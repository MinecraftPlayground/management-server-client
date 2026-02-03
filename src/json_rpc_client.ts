import { ExtractMethod } from './open_rpc/extract_method.ts';
import { ExtractMethodNames } from './open_rpc/extract_method_names.ts';
import { OpenRpcDocument } from './open_rpc/spec.ts';
import { ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';

interface JsonRpcClientOptions {
  token? : string
}

export class JsonRpcClient<Schema extends OpenRpcDocument> extends EventTarget {
  private readonly ws : WebSocket;
  private readonly schema : ValidatedOpenRpcDocument<Schema>;
  
  constructor(
    url : string,
    schema : ValidatedOpenRpcDocument<Schema>,
    options : JsonRpcClientOptions
  ) {
    super();

    this.schema = schema

    this.ws = new WebSocket(url, {
      headers: options.token ? { Authorization: `Bearer ${options.token}` } : undefined
    });

    this.ws.addEventListener("open", () => {
      this.dispatchEvent(new Event("open"));
    });

    this.ws.addEventListener("close", (event) => {
      this.dispatchEvent(event);
    });

    this.ws.addEventListener("error", (ev) => {
      this.dispatchEvent(ev);
    });

    this.ws.addEventListener("message", (event) => {
      this.dispatchEvent(event);
    });
  }

  public call<
    Name extends ExtractMethodNames<Schema>,
    Method = ExtractMethod<Schema, Name>
  >(
    method: Name,
    ...params: ExtractParams<Schema, Method>
  ): Promise<ExtractResult<Schema, Method>> {
    
  }
}

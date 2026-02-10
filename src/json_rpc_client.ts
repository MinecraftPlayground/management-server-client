import type { OpenRpcDocument } from './open_rpc/open_rpc_document.ts';
import type { ExtractMethod } from './open_rpc/method/extract_method.ts';
import type { ExtractParams } from './open_rpc/method/params/extract_params.ts';
import type { ExtractResult } from './open_rpc/result/extract_result.ts';
import type { ExtractRequestMethodNames } from './open_rpc/method/extract_request_method_names.ts';
import type { ExtractNotificationMethodNames } from './open_rpc/method/extract_notification_method_names.ts';
import { validatedOpenRpcDocument, type ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';
import { CustomEventTarget, type CustomEventListenerOrCustomEventListenerObject } from './custom_event_target.ts';
import type { NotificationObject, RequestObject, ResponseObject } from './json_rpc/json_rpc_object.ts';
import type { PendingRequest } from './json_rpc/pending_requests.ts';
import type { IncomingMessage } from './json_rpc/incoming_message.ts';
import { isNotification } from './json_rpc/is_notification.ts';
import { isResponse } from './json_rpc/is_response.ts';


/**
 * Options for the JsonRpcClient.
 */
interface ClientOptions {
  /**
   * Optional authentication token for WebSocket connection.
   */
  token? : string
}

/**
 * JSON-RPC 2.0 WebSocket client with full type safety based on OpenRPC schema.
 * 
 * @template Schema OpenRPC document schema
 * 
 * @example
 * ```ts
 * const client = new Client('ws://localhost:8080', schema);
 * 
 * // Type-safe method calls
 * const result = await client.call('minecraft:allowlist');
 * 
 * // Type-safe event listeners
 * client.addEventListener('minecraft:notification/server/started', (event) => {
 *   console.log('Server started');
 * });
 * ```
 */
export class JsonRpcClient<Schema extends OpenRpcDocument> extends CustomEventTarget {
  private readonly ws : WebSocket;
  private readonly pendingRequests : Map<
    number,
    PendingRequest<Schema, ExtractRequestMethodNames<Schema>>
  > = new Map();
  private requestId : number = 0;
  public readonly schema : Schema;
  
  constructor(
    url : string,
    schema : ValidatedOpenRpcDocument<Schema>,
    options? : ClientOptions
  ) {
    super();

    this.schema = validatedOpenRpcDocument(schema);

    this.ws = new WebSocket(`ws://${url}`, {
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined
    });

    this.ws.addEventListener("open", () => {
      console.log('Client connected');
    });

    this.ws.addEventListener("close", () => {
      console.log('Client disconnected');

      this.pendingRequests.forEach((pending) => {
        pending.reject({
          code: -32603,
          message: 'Connection closed'
        });
      });
      this.pendingRequests.clear();
    });

    this.ws.addEventListener("error", (event) => {
      console.log('Client error:', event)
    });

    this.ws.addEventListener("message", (event) => {
      this.handleMessage(event)
    });
  }

  /**
   * Handles incoming notification messages.
   * Dispatches a CustomEvent for the notification method.
   * 
   * @param data Notification object from server
   */
  private handleNotification(data : NotificationObject<Schema, ExtractNotificationMethodNames<Schema>>) : void {
    const event = new CustomEvent(data.method, {
      detail: data.params || []
    });
    this.dispatchEvent(event);
  }

  /**
   * Handles incoming response messages.
   * Resolves or rejects the corresponding pending request promise.
   * 
   * @param data Response object from server
   */
  private handleResponse(data : ResponseObject<Schema, ExtractRequestMethodNames<Schema>>) : void {
    const pending = this.pendingRequests.get(data.id as number);
    
    if (!pending) {
      console.warn('Received response for unknown request id:', data.id);
      return;
    }

    this.pendingRequests.delete(data.id as number);

    if (data.error) {
      pending.reject(data.error);
    } else {
      pending.resolve(data.result);
    }
  }

  /**
   * Handles incoming WebSocket messages.
   * Parses JSON-RPC messages and routes them to appropriate handlers.
   * 
   * @param event WebSocket message event
   */
  private handleMessage(event : MessageEvent) : void {
    try {
      const data : IncomingMessage<Schema> = JSON.parse(event.data);
      
      if (isNotification(data)) {
        this.handleNotification(data);
        return;
      }

      if (isResponse(data)) {
        this.handleResponse(data);
        return;
      }

      console.warn('Received unknown message format:', data);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  public get connected() : Promise<boolean> {
    return new Promise((resolve) => {
      this.ws.addEventListener('open', () => resolve(true), { once: true });
      this.ws.addEventListener('error', () => resolve(false), { once: true });
    });
  }

  /**
   * Calls a JSON-RPC method on the server.
   * Returns a type-safe promise based on the method's result type.
   * 
   * @template MethodName Name of the method to call
   * @template Method Method object type
   * @param method Name of the method to invoke
   * @param params Method parameters (type-checked based on schema)
   * @returns Promise that resolves with the method's result type
   * 
   * @example
   * ```ts
   * // Get allowlist (returns Player[])
   * const allowlist = await client.call('minecraft:allowlist');
   * 
   * // Set difficulty (requires difficulty parameter)
   * const result = await client.call('minecraft:serversettings/difficulty/set', 'hard');
   * ```
   */
  public call<
    MethodName extends ExtractRequestMethodNames<Schema>,
    Method extends ExtractMethod<Schema, MethodName>
  >(
    method : MethodName,
    ...params : ExtractParams<Schema, Method>
  ) : Promise<ExtractResult<Schema, Method>> {
    const id = ++this.requestId;

    const request : RequestObject<Schema, MethodName> = {
      jsonrpc: '2.0',
      method,
      params: params.length > 0 ? params : undefined,
      id
    };

    return new Promise<ExtractResult<Schema, Method>>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve,
        reject
      });

      try {
        this.ws.send(JSON.stringify(request));
      } catch (error) {
        this.pendingRequests.delete(id);
        reject({
          code: -32603,
          message: error instanceof Error ? error.message : 'Failed to send request'
        });
      }
    });
  }

  public disconnect() : void {
    this.ws.close();
  }
  /**
   * Registers an event listener for server notifications.
   * Type-safe listener with correct parameter types based on notification schema.
   * 
   * @template MethodName Name of the notification method
   * @param type Notification method name
   * @param listener Event listener callback
   * @param options Event listener options
   * 
   * @example
   * ```ts
   * client.addEventListener('minecraft:notification/players/joined', (event) => {
   *   // event.detail is type-checked as [{ player: Player }]
   *   const [{ player }] = event.detail;
   *   console.log(`Player ${player.name} joined`);
   * });
   * ```
   */
  public override addEventListener<MethodName extends ExtractNotificationMethodNames<Schema>>(
    type : MethodName,
    listener : CustomEventListenerOrCustomEventListenerObject<ExtractParams<Schema, ExtractMethod<Schema, MethodName>>> | null,
    options? : boolean | AddEventListenerOptions
  ) : void {
    super.addEventListener(type, listener, options);
  }

  /**
   * Removes an event listener for server notifications.
   * 
   * @template MethodName Name of the notification method
   * @param type Notification method name
   * @param listener Event listener callback to remove
   * @param options Event listener options
   */
  public override removeEventListener<MethodName extends ExtractNotificationMethodNames<Schema>>(
    type : MethodName,
    listener : CustomEventListenerOrCustomEventListenerObject<ExtractParams<Schema, ExtractMethod<Schema, MethodName>>> | null,
    options? : boolean | EventListenerOptions
  ) : void {
    super.removeEventListener(type, listener, options);
  }
}

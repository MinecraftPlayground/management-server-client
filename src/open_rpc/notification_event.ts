import type { ExtractParams } from './method/params/extract_params.ts';
import type { ExtractMethod } from './method/extract_method.ts';
import type { ExtractNotificationMethodNames } from './method/extract_notification_method_names.ts';
import type { OpenRpcDocument } from './open_rpc_document.ts';

/**
 * Custom event for JSON-RPC notifications with typed detail.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the notification method
 */
export interface NotificationEvent<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractNotificationMethodNames<Schema>
> extends Event {
  readonly type: MethodName;
  readonly detail: ExtractParams<Schema, ExtractMethod<Schema, MethodName>>;
}

/**
 * Event listener for notification events.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the notification method
 */
export interface NotificationEventListener<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractNotificationMethodNames<Schema>
> {
  (event: NotificationEvent<Schema, MethodName>): void;
}

/**
 * Event listener object for notification events.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the notification method
 */
export interface NotificationEventListenerObject<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractNotificationMethodNames<Schema>
> {
  handleEvent(event: NotificationEvent<Schema, MethodName>): void;
}

/**
 * Type for event listener or event listener object.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the notification method
 */
export type NotificationEventListenerOrEventListenerObject<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractNotificationMethodNames<Schema>
> = 
  | NotificationEventListener<Schema, MethodName>
  | NotificationEventListenerObject<Schema, MethodName>;

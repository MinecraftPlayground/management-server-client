/**
 * A function that handles a {@link CustomEvent} with a specific detail type.
 *
 * @template Detail Type of the `detail` property in the CustomEvent
 */
export type CustomEventListener<Detail = unknown> =
  (event : CustomEvent<Detail>) => void;

/**
 * An object that can handle {@link CustomEvent} events via its `handleEvent` method.
 *
 * @template Detail Type of the `detail` property in the CustomEvent
 */
export interface CustomEventListenerObject<Detail = unknown> {
  /**
   * Called when an event of the specified type is dispatched.
   *
   * @param event Custom event being handled
   */
  handleEvent(event : CustomEvent<Detail>) : void;
}

/**
 * Union type that represents either a {@link CustomEventListener} function or a {@link CustomEventListenerObject}
 * object.
 *
 * @template Detail Type of the `detail` property in the CustomEvent
 */
export type CustomEventListenerOrCustomEventListenerObject<Detail = unknown> =
  | CustomEventListener<Detail>
  | CustomEventListenerObject<Detail>

/**
 * An extended version of `EventTarget` that expects listeners to receive {@link CustomEvent} instances
 * (instead of plain `Event`).
 *
 * This interface is mainly useful for better type safety when working exclusively with CustomEvent in your application.
 *
 * @see {@link CustomEventTarget} the constructor/cast helper
 */
export interface CustomEventTarget<EventType extends string = string> extends EventTarget {
  /**
   * Registers an event handler of a specific event type.
   *
   * @param type String representing the event type to listen for
   * @param listener Object or function that receives a notification
   * @param options Object specifying characteristics about the event listener, or a boolean indicating whether the
   * listener should be passive
   */
  addEventListener(
    type : EventType,
    listener : CustomEventListenerOrCustomEventListenerObject | null,
    options? : boolean | AddEventListenerOptions
  ) : void;

  /**
   * Removes an event listener previously registered with addEventListener.
   *
   * @param type String that specifies the event type of the listener to remove
   * @param listener Event listener handler to remove
   * @param options Object that specifies characteristics about the event listener to remove
   */
  removeEventListener(
    type : EventType,
    listener : CustomEventListenerOrCustomEventListenerObject | null,
    options? : boolean | EventListenerOptions
  ) : void;

  dispatchEvent(event : CustomEvent) : boolean;
}

/**
 * A constructor that allows creating instances with the {@link CustomEventTarget} interface.
 *
 * @example
 * ```ts
 * class MyClass extends CustomEventTarget { ... }
 * ```
 * @example
 * ```ts
 * const target = new CustomEventTarget();
 * ```
 */
export class CustomEventTarget extends EventTarget implements CustomEventTarget {}

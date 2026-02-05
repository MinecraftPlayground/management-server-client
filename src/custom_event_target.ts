/**
 * A simple EventTarget wrapper that accepts CustomEvent listeners.
 * This is a base class that allows using CustomEvent instead of Event in listeners.
 * 
 * Subclasses can override addEventListener/removeEventListener to provide
 * specific type mappings between event names and CustomEvent detail types.
 */
// deno-lint-ignore-file no-explicit-any explicit-module-boundary-types
export class CustomEventTarget extends EventTarget {
  /**
   * Add an event listener that accepts CustomEvent.
   * This overload allows listeners to work with CustomEvent instead of plain Event.
   */
  override addEventListener(
    type: string,
    listener: ((event: CustomEvent) => void) | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  
  /**
   * Standard EventTarget addEventListener overload for compatibility.
   */
  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
  
  override addEventListener(
    type: string,
    callback: any,
    options?: EventListenerOptions | boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, callback, options);
  }

  /**
   * Remove an event listener that accepts CustomEvent.
   */
  override removeEventListener(
    type: string,
    listener: ((event: CustomEvent) => void) | null,
    options?: boolean | EventListenerOptions
  ): void;
  
  /**
   * Standard EventTarget removeEventListener overload for compatibility.
   */
  override removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
  
  override removeEventListener(
    type: string,
    callback: any,
    options?: EventListenerOptions | boolean
  ): void {
    super.removeEventListener(type, callback, options);
  }
}

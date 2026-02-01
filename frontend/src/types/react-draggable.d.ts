// Type definitions for react-draggable
// Since @types/react-draggable doesn't exist, we create our own

declare module 'react-draggable' {
  import * as React from 'react';

  export interface DraggableProps {
    /**
     * The Draggable component position can be controlled or uncontrolled.
     * If `position` is provided, the element will be locked to that position.
     */
    position?: { x: number; y: number };
    
    /**
     * Default position for uncontrolled mode.
     */
    defaultPosition?: { x: number; y: number };
    
    /**
     * Specifies movement in the x and y directions.
     */
    axis?: 'both' | 'x' | 'y' | 'none';
    
    /**
     * Specifies a selector to be used to prevent drag initialization.
     */
    cancel?: string;
    
    /**
     * Specifies a selector to be used as the handle that initiates drag.
     */
    handle?: string;
    
    /**
     * Called when dragging starts.
     */
    onStart?: (e: any, data: any) => void | false;
    
    /**
     * Called while dragging.
     */
    onDrag?: (e: any, data: any) => void | false;
    
    /**
     * Called when dragging stops.
     */
    onStop?: (e: any, data: any) => void | false;
    
    /**
     * Specifies the boundsrict area for dragging. Can be 'parent', a selector, or an object.
     */
    bounds?: string | { left?: number; top?: number; right?: number; bottom?: number } | false;
    
    /**
     * Specifies the x and y that dragging should snap to.
     */
    grid?: [number, number];
    
    /**
     * Specifies the scale of the element (for transforms).
     */
    scale?: number;
    
    /**
     * Disables dragging.
     */
    disabled?: boolean;
    
    /**
     * Children of Draggable must be a single element.
     */
    children: React.ReactElement;
  }

  export default class Draggable extends React.Component<DraggableProps> {}
}

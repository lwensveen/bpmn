declare module 'bpmn-js/lib/util/ModelUtil';
declare module 'bpmn-js/lib/Modeler';

declare module 'diagram-js/lib/core/Canvas' {
  export interface Canvas {
    zoom(
      newScale: string | number,
      center: string | { x: number; y: number }
    ): number;
  }

  export default Canvas;
}

declare module 'diagram-js/lib/core/ElementRegistry' {
  export interface ElementRegistry {
    forEach(fn: (element: djs.model.Base, gfx: SVGElement) => void): void;
  }

  export default ElementRegistry;
}

declare module 'diagram-js/lib/features/modeling/Modeling' {
  export interface Modeling {
    setColor(
      elements: djs.model.Base | djs.model.Base[],
      colors: { stroke: string; fill: string }
    ): void;
  }

  export default Modeling;
}

declare namespace djs {
  namespace model {
    interface Base {
      id: string;
      businessObject: Object;
      label: string;
      type: string;
    }
  }
}

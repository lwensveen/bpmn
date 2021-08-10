declare module 'bpmn-js/lib/util/ModelUtil';
declare module 'diagram-js' {
  export default class Diagram {
    get(name: string, strict?: boolean): any;
  }
}

declare module 'bpmn-js/lib/BaseViewer' {
  import Diagram from 'diagram-js';

  export interface ImportXMLResult {
    warnings: string[];
  }

  export interface ImportXMLError {
    warnings: string[];
  }

  export default class BaseViewer extends Diagram {
    attachTo(parentNode: string | Node): void;

    destroy(): void;

    importXML(
      xml: string,
      bpmnDiagram?: Object | string
    ): Promise<ImportXMLResult | ImportXMLError>;
  }
}

declare module 'bpmn-js/lib/BaseModeler' {
  import BaseViewer from 'bpmn-js/lib/BaseViewer';
  export default class BaseModeler extends BaseViewer {}
}

declare module 'bpmn-js/lib/Modeler' {
  import BaseModeler from 'bpmn-js/lib/BaseModeler';

  export interface ModelerOptions {
    container?: string;
    width?: string | number;
    height?: string | number;
    moddleExtensions?: Object;
    modules?: any[];
    additionalModules?: any[];
  }

  export default class Modeler extends BaseModeler {
    constructor(options?: ModelerOptions);

    createDiagram(): void;
  }
}

declare module 'bpmn-js/lib/features/modeling/Modeling' {
  export default class Modeling {
    setColor(
      elements: djs.model.Base | djs.model.Base[],
      colors: { stroke?: string; fill?: string }
    ): void;
  }
}

declare module 'bpmn-js-properties-panel/lib/PropertiesPanel' {
  export default class PropertiesPanel {
    attachTo(parentNode: string | Node): void;
  }
}

declare module 'diagram-js/lib/core/Canvas' {
  export default class Canvas {
    zoom(
      newScale: string | number,
      center: string | { x: number; y: number }
    ): number;

    scrollToElement(
      element: djs.model.Base,
      padding?:
        | number
        | { top?: number; right?: number; bottom?: number; left?: number }
    ): void;
  }
}

declare module 'diagram-js/lib/core/ElementRegistry' {
  export default class ElementRegistry {
    forEach(fn: (element: djs.model.Base, gfx: SVGElement) => void): void;
  }
}

declare module 'diagram-js/lib/core/EventBus' {
  export default class EventBus {
    on(
      events: string | string[],
      priority: number,
      callback: (...args: any[]) => void,
      that?: Object
    ): void;
    on(
      events: string | string[],
      callback: (...args: any[]) => void,
      that?: Object
    ): void;
  }
}

declare module 'diagram-js/lib/features/overlays/Overlays' {
  import Base = djs.model.Base;

  export interface Overlay {
    html: string | HTMLElement;
    show?: {
      minZoom?: number;
      maxZoom?: number;
    };
    position: {
      left?: number;
      top?: number;
      bottom?: number;
      right?: number;
    };
    scale?: boolean | { min?: number; max?: number };
  }

  export default class Overlays {
    add(element: string | Base, type: string, overlay: Overlay): string;
    add(element: string | Base, overlay: Overlay): string;

    remove(id: string): void;
  }
}

declare namespace djs {
  namespace model {
    interface Base {
      id: string;
      businessObject: any;
      label: string;
      type: string;
      source?: Base;
      target?: Base;
    }
  }
}

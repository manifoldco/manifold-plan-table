/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface ManifoldPlanMatrix {
    'baseUrl'?: string;
    'clientId'?: string;
    'ctaText'?: string;
    'env'?: 'stage' | 'local' | 'prod';
    'productId'?: string;
  }
}

declare global {


  interface HTMLManifoldPlanMatrixElement extends Components.ManifoldPlanMatrix, HTMLStencilElement {}
  var HTMLManifoldPlanMatrixElement: {
    prototype: HTMLManifoldPlanMatrixElement;
    new (): HTMLManifoldPlanMatrixElement;
  };
  interface HTMLElementTagNameMap {
    'manifold-plan-matrix': HTMLManifoldPlanMatrixElement;
  }
}

declare namespace LocalJSX {
  interface ManifoldPlanMatrix {
    'baseUrl'?: string;
    'clientId'?: string;
    'ctaText'?: string;
    'env'?: 'stage' | 'local' | 'prod';
    'productId'?: string;
  }

  interface IntrinsicElements {
    'manifold-plan-matrix': ManifoldPlanMatrix;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'manifold-plan-matrix': LocalJSX.ManifoldPlanMatrix & JSXBase.HTMLAttributes<HTMLManifoldPlanMatrixElement>;
    }
  }
}



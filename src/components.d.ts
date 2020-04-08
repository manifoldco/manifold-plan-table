/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface ManifoldPlanTable {
        "baseUrl"?: string;
        "clientId"?: string;
        "ctaText"?: string;
        "env"?: "stage" | "local" | "prod";
        "gatewayUrl"?: string;
        "productId"?: string;
    }
}
declare global {
    interface HTMLManifoldPlanTableElement extends Components.ManifoldPlanTable, HTMLStencilElement {
    }
    var HTMLManifoldPlanTableElement: {
        prototype: HTMLManifoldPlanTableElement;
        new (): HTMLManifoldPlanTableElement;
    };
    interface HTMLElementTagNameMap {
        "manifold-plan-table": HTMLManifoldPlanTableElement;
    }
}
declare namespace LocalJSX {
    interface ManifoldPlanTable {
        "baseUrl"?: string;
        "clientId"?: string;
        "ctaText"?: string;
        "env"?: "stage" | "local" | "prod";
        "gatewayUrl"?: string;
        "onCtaClick"?: (event: CustomEvent<any>) => void;
        "productId"?: string;
    }
    interface IntrinsicElements {
        "manifold-plan-table": ManifoldPlanTable;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "manifold-plan-table": LocalJSX.ManifoldPlanTable & JSXBase.HTMLAttributes<HTMLManifoldPlanTableElement>;
        }
    }
}

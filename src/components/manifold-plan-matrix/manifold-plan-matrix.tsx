import { Component, Element, h, State, Prop, Watch } from '@stencil/core';
import {
  ProductQueryVariables,
  ProductQuery,
  PlanFeatureType,
  PlanConfigurableFeatureOption,
  PlanConfigurableFeatureNumericDetails,
  PlanFixedFeature,
} from '../../types/graphql';
import query from './product.graphql';
import { CLIENT_ID_WARNING } from './warning';

const GRAPHQL_ENDPOINT = 'https://api.manifold.co/graphql';
const MANIFOLD_CLIENT_ID = 'Manifold-Client-ID';

type ConditionalClassesObj = {
  [name: string]: boolean;
};
type tierLabel = { tierLabel: string };
type TableRef = {
  [key: string]: tierLabel;
};
type NumericDetails = ProductQuery['product']['plans']['edges'][0]['node']['meteredFeatures']['edges'][0]['node']['numericDetails'];
@Component({
  tag: 'manifold-plan-matrix',
  styleUrl: 'manifold-plan-matrix.css',
})
export class ManifoldPricing {
  // Used to apply css variables to root element
  @Element() el: HTMLElement;
  // Passed product ID to the graphql endpoint
  @Prop() productId?: string;
  // Passed client ID header to the graphql calls
  @Prop() clientId?: string = '';
  // Base url for buttons
  @Prop() baseUrl?: string = '/signup';
  // CTA Text for buttons
  @Prop() ctaText?: string = 'Get Started';
  // Graphql enpoint (TEMP)
  @Prop() graphqlUrl?: string = GRAPHQL_ENDPOINT;
  // Product data
  @State() product?: ProductQuery['product'];
  // Plans data
  @State() plans: ProductQuery['product']['plans']['edges'];
  // Table tableRef
  @State() labels: TableRef;
  // Loading state
  @State() loading = true;
  @Watch('productId') refetchProduct(newVal?: string) {
    if (newVal) {
      this.fetchProduct(newVal);
    }
  }

  componentWillLoad() {
    if (!this.clientId) {
      console.warn(CLIENT_ID_WARNING);
    }
    if (this.productId) {
      // Note: we could warn here if product-id is missing, but let’s not. In some front-end frameworks it may be set a half-second after it loads
      this.fetchProduct(this.productId);
    }
  }

  fetchProduct(productID: string) {
    const variables: ProductQueryVariables = { id: productID, first: 50 };
    fetch(this.graphqlUrl || GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        ...(this.clientId ? { [MANIFOLD_CLIENT_ID]: this.clientId } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(({ data }) => {
        if (data.product) {
          this.product = data.product;
          this.createPlans();
        }
      });
  }

  createPlans() {
    if (this.product) {
      // Knarley set of reducers to generate a TabelRef object containing a label (DisplayName) and an index to populate the correct cell.
      const features = this?.product?.plans?.edges.reduce((acc, { node }) => {
        // Grab unique fixed
        const fixedFeatures = node?.fixedFeatures?.edges.reduce(
          (fixedAccumulator: TableRef, { node: n }) => {
            // Check if key exists
            if (fixedAccumulator[n.displayName]) {
              return fixedAccumulator;
            }
            // Add new key
            return {
              [n.label]: {
                tierLabel: n.displayName,
              },
              ...fixedAccumulator,
            };
          },
          {}
        );

        // Grab unique metered
        const meteredFeatures = node?.meteredFeatures?.edges.reduce(
          (meteredAccumulator: TableRef, { node: n }) => {
            // Check if key exists
            if (meteredAccumulator[n.label]) {
              return meteredAccumulator;
            }
            // Add new key
            return {
              [n.label]: {
                tierLabel: n.displayName,
              },
              ...meteredAccumulator,
            };
          },
          {}
        );

        const configurableFeatures = node?.configurableFeatures?.edges.reduce(
          (fixedAccumulator: TableRef, { node: n }) => {
            if (fixedAccumulator[n.displayName]) {
              return fixedAccumulator;
            }
            return {
              [n.label]: {
                tierLabel: n.displayName,
              },
              ...fixedAccumulator,
            };
          },
          {}
        );

        return { ...fixedFeatures, ...meteredFeatures, ...configurableFeatures, ...acc };
      }, {});

      this.labels = features || {};
      this.plans = this.product?.plans?.edges;
      this.loading = false;
    } else {
      console.warn('There was a problem with the API');
    }
  }

  addClass(obj: ConditionalClassesObj, baseClass = ''): string {
    const conditionalClasses = Object.keys(obj).map(cl => (obj[cl] ? cl : ''));
    return `${baseClass} ${conditionalClasses.join(' ')}`;
  }

  fixedFeatures(displayValue: PlanFixedFeature['displayName'], planIndex: number) {
    if (displayValue === 'true' || displayValue === 'false') {
      return (
        <div class="mp--cell mp--cell__body">
          <manifold-checkbox
            input-id={`${planIndex}-${displayValue}`}
            name={displayValue}
            checked={displayValue === 'true'}
          ></manifold-checkbox>
        </div>
      );
    }
    return <div class="mp--cell mp--cell__body">{displayValue}</div>;
  }

  meteredFeatures(numericDetails: NumericDetails) {
    if (numericDetails.costTiers.length === 0) {
      return (
        <div class="mp--cell mp--cell__body">
          <manifold-empty-cell></manifold-empty-cell>
        </div>
      );
    }

    return (
      <div class="mp--cell mp--cell__body mp--cell__block">
        <manifold-metered>
          {numericDetails.costTiers.map(({ limit, cost }, i) => {
            const previous = numericDetails.costTiers[i - 1];
            const min = previous?.limit ? previous.limit : 0;
            return (
              <manifold-cost-tiers
                min-limit={min}
                max-limit={limit}
                cost={cost}
                unit={numericDetails.unit}
              ></manifold-cost-tiers>
            );
          })}
        </manifold-metered>
      </div>
    );
  }

  configurableFeatures(
    type: PlanFeatureType,
    numericDetails?: PlanConfigurableFeatureNumericDetails,
    featureOptions?: PlanConfigurableFeatureOption[]
  ) {
    switch (type) {
      case PlanFeatureType.String:
        return (
          <div class="mp--cell mp--cell__body">
            <manifold-select options={featureOptions}></manifold-select>
          </div>
        );
      case PlanFeatureType.Number:
        return (
          <div class="mp--cell mp--cell__body">
            <manifold-numeric-input
              min={numericDetails?.min}
              max={numericDetails?.max}
              increment={numericDetails?.increment}
              unit={numericDetails?.unit}
            ></manifold-numeric-input>
          </div>
        );
      case PlanFeatureType.Boolean:
        if (Array.isArray(featureOptions)) {
          const [on, off] = featureOptions;
          return (
            <div class="mp--cell mp--cell__body">
              <manifold-toggle on={on.cost} off={off.cost}></manifold-toggle>
            </div>
          );
        }
        return (
          <div class="mp--cell mp--cell__body">
            <manifold-empty-cell></manifold-empty-cell>
          </div>
        );
      default:
        return (
          <div class="mp--cell mp--cell__body">
            <manifold-empty-cell></manifold-empty-cell>
          </div>
        );
    }
  }

  render() {
    if (this.loading) {
      return <div>Loading...</div>;
    }

    if (this.product && !this.product.plans) {
      return <div>error</div>;
    }
    const tierLabels =
      (this.labels && Object.values(this.labels).map((feature: tierLabel) => feature.tierLabel)) ||
      [];
    const gridColumns = this.plans.length + 1;
    const gridRows = tierLabels.length + 2; // +1 for the "Get Started" row

    // Pass column count into css grid
    this.el.style.setProperty('--manifold-table-columns', `${gridColumns}`);
    this.el.style.setProperty('--manifold-table-rows', `${gridRows}`);

    return (
      <div class="mp">
        <div class="mp--cell mp--cell__sticky mp--cell__bls mp--cell__al mp--cell__th mp--cell__thead mp--cell__bts mp--cell__rounded-tl"></div>
        {tierLabels.map(label => {
          return (
            <div class="mp--cell  mp--cell__sticky mp--cell__bls mp--cell__al mp--cell__th">
              {label}
            </div>
          );
        })}
        <div class="mp--cell mp--cell__sticky mp--cell__bls mp--cell__bbs mp--cell__al mp--cell__th mp--cell__rounded-bl"></div>
        {this.plans
          .sort((a, b) => a.node.cost - b.node.cost)
          .map(({ node: plan }, i) => [
            <div
              class={this.addClass(
                {
                  'mp--cell__rounded-tr': i === gridColumns - 2,
                },
                'mp--cell mp--cell__bts mp--cell__thead mp--cell__thead mp--cell__th'
              )}
            >
              <manifold-thead title-text={plan.displayName} plan={plan}></manifold-thead>
            </div>,
            Object.keys(this.labels).map((label, ii) => {
              const fixedFeatureMatch = plan.fixedFeatures.edges.find(({ node: { label: l } }) => {
                return label === l;
              });

              const meteredFeaturesMatch = plan.meteredFeatures.edges.find(
                ({ node: { label: l } }) => {
                  return label === l;
                }
              );

              const configurableFeaturesMatch = plan.configurableFeatures.edges.find(
                ({ node: { label: l } }) => {
                  return label === l;
                }
              );

              if (fixedFeatureMatch) {
                return this.fixedFeatures(fixedFeatureMatch.node.displayValue, ii);
              }

              if (meteredFeaturesMatch) {
                return this.meteredFeatures(meteredFeaturesMatch.node.numericDetails);
              }

              if (configurableFeaturesMatch) {
                return this.configurableFeatures(
                  configurableFeaturesMatch.node.type,
                  configurableFeaturesMatch.node.numericDetails,
                  configurableFeaturesMatch.node.featureOptions
                );
              }

              return (
                <div class="mp--cell mp--cell__body">
                  <manifold-empty-cell></manifold-empty-cell>
                </div>
              );
            }),
            <div
              class={this.addClass(
                {
                  'mp--cell__brs mp--cell__rounded-br': i === gridColumns - 2,
                },
                'mp--cell mp--cell__body mp--cell__bbs'
              )}
            >
              <a class="mp--button" id={`manifold-cta-plan-${plan.id}`} href={this.baseUrl}>
                {this.ctaText}
              </a>
            </div>,
          ])}
      </div>
    );
  }
}

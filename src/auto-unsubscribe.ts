export class SubscriptionList {
  [key: string]: any;
}

export interface AutoUnsubscribeParams {
  subscriptionListKey: string;
}

export function AutoUnsubscribe(params: AutoUnsubscribeParams) {
  return function(constructor: any) {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function() {
      if (params) {
        const key = params.subscriptionListKey;

        if (key) {
          const subscriptionListKeyProp = this[key];

          if (subscriptionListKeyProp instanceof SubscriptionList) {
            for (const prop in subscriptionListKeyProp) {
              if (prop) {
                const property = subscriptionListKeyProp[prop];
                if (property && typeof property.unsubscribe === 'function') {
                  property.unsubscribe();
                }
              }
            }
          }
        }
      }

      if (original && typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  };
}

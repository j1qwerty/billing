import { useUserStore } from '../store/user';
import { useTeamStore } from '../store/team';
import { useOnboardingStore } from '../store/onboarding';
import { useBillingStore } from '../store/billing';
import { usePlanStore } from '../store/plan';

// Map Vuex module names to Pinia store factories
const storeMap = {
  'userStore': useUserStore,
  'teamStore': useTeamStore,
  'onboardingStore': useOnboardingStore,
  'billingStore': useBillingStore,
  'planStore': usePlanStore,
};

export function mapState(moduleName, keys) {
  if (!(moduleName in storeMap)) {
    throw new Error(`mapState: unsupported module ${moduleName}`);
  }

  const storeFactory = storeMap[moduleName];
  const mapped = {};
  
  keys.forEach(key => {
    mapped[key] = function() {
      const store = storeFactory();
      return store[key];
    };
  });
  
  return mapped;
}

export function mapActions(moduleName, actionNames) {
  if (!(moduleName in storeMap)) {
    throw new Error(`mapActions: unsupported module ${moduleName}`);
  }

  const storeFactory = storeMap[moduleName];
  const mapped = {};
  
  actionNames.forEach(actionName => {
    mapped[actionName] = function(...args) {
      const store = storeFactory();
      const method = store[actionName];
      if (typeof method !== 'function') {
        throw new Error(`Action ${actionName} not found on ${moduleName}`);
      }
      return method.apply(store, args);
    };
  });
  
  return mapped;
}

// Vue plugin to provide backward compatibility
export default {
  install(app) {
    // Optionally expose as global properties for legacy code
    app.config.globalProperties.$store = {
      get state() {
        return {
          userStore: useUserStore(),
          teamStore: useTeamStore(),
          onboardingStore: useOnboardingStore(),
          billingStore: useBillingStore(),
          planStore: usePlanStore(),
        };
      }
    };
  }
};

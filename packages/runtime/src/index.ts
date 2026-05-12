export interface RuntimeContainer {
  setAttribute(name: string, value: string): void;
}

export interface Runtime {
  mount(container: RuntimeContainer): void;
}

export function createRuntime(): Runtime {
  return {
    mount(container) {
      container.setAttribute('data-runtime', 'mounted');
    },
  };
}

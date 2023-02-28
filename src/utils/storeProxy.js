export const createProxy = store => {
  return new Proxy(store, {})
}

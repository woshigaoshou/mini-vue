const createApp = (rootComponent) => {
  return {
    mount(selector) {
      const el = document.querySelector(selector);
      
      let isMounted = false;
      let oldVnode = null;
      watchEffect(function() {
        if (!isMounted) {
          isMounted = true;
          oldVnode = rootComponent.render();
          mount(oldVnode, el);
        } else {
          let newVnode = rootComponent.render();
          patch(oldVnode, newVnode);
          oldVnode = newVnode;
        }
      })
    }
  }
}

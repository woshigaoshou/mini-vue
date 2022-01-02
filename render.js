const h = (tag, props, children) => {
  return {
    tag,
    props,
    children
  }
}

const mount = (vNode, container) => {
  const el = vNode.el = document.createElement(vNode.tag);
  
  if (vNode.props) {
    for (const key in vNode.props) {
      const value = vNode.props[key];
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  if (vNode.children) {
    if (typeof vNode.children === 'string') {
      el.innerHTML = vNode.children;
    } else {
      vNode.children.forEach(child => {
        mount(child, el);
      })
    }
  }

  container.appendChild(vNode.el);
}

const patch = (n1, n2) => {
  const el = n2.el = n1.el;
  if (n1.tag !== n2.tag) {
    console.log(el);
    
    const parentNode = el.parentElement;
    parentNode.removeChild(el);
    mount(n2, parentNode);
  } else {
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    console.log(n1, n2);
    
    for (let key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (oldValue !== newValue) {
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }

    for (let key in oldProps) {
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldProps[key]);
      } 
      if (!(key in newProps)) {
        el.removeAttribute(key);
      }
    }

    const oldChildren = n1.children || [];
    const newChildren = n2.children || [];

    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
       el.innerHTML = newChildren;
      }
    } else {
      if (typeof oldChildren === 'string') {
        el.innerHTML = "";
        newChildren.forEach(item => {
          mount(item, el);
        });
      } else {
        const commonLength = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0;i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }
        if (oldChildren.length > newChildren.length) {
          oldChildren.slice(commonLength).forEach(item => {
            el.removeChild(item.el);
          });
        } 
        if (oldChildren.length < newChildren.length) {
          newChildren.slice(commonLength).forEach(item => {
            mount(item, el);
          });
        }
      }
    }
  }
}

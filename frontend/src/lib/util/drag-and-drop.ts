export function draggable(node, data) {
  let state = data;

  node.draggable = true;
  node.style.cursor = 'grab';

  function handleDragStart(e) {
    if (!e.dataTransfer) return;
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', state);
  }

  node.addEventListener('dragstart', handleDragStart);

  return {
    update(data) {
      state = data;
    },

    destroy() {
      node.removeEventListener('dragstart', handleDragStart);
    },
  };
}

export function dropzone(node, options) {
  let state = {
    dropEffect: 'move',
    dragover_class: 'droppable',
    ...options,
  };

  function handleDragEnter(e) {
    if (!(e.target instanceof HTMLElement)) return;
    e.target.classList.add(state.dragover_class);
  }

  function handleDragLeave(e) {
    if (!(e.target instanceof HTMLElement)) return;
    e.target.classList.remove(state.dragover_class);
  }

  function handleDragOver(e) {
    e.preventDefault();
    if (!e.dataTransfer) return;
    e.dataTransfer.dropEffect = state.dropEffect;
  }

  function handleDrop(e) {
    e.preventDefault();
    if (!e.dataTransfer) return;
    const data = e.dataTransfer.getData('text/plain');
    if (!(e.target instanceof HTMLElement)) return;
    e.target.classList.remove(state.dragover_class);
    state.onDrop(data, e);
  }

  node.addEventListener('dragenter', handleDragEnter);
  node.addEventListener('dragleave', handleDragLeave);
  node.addEventListener('dragover', handleDragOver);
  node.addEventListener('drop', handleDrop);

  return {
    update(options) {
      state = {
        dropEffect: 'move',
        dragover_class: 'droppable',
        ...options,
      };
    },

    destroy() {
      node.removeEventListener('dragenter', handleDragEnter);
      node.removeEventListener('dragleave', handleDragLeave);
      node.removeEventListener('dragover', handleDragOver);
      node.removeEventListener('drop', handleDrop);
    },
  };
}

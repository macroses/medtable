const draggables = document.querySelectorAll('.draggable');
const tableDoctorCols = document.querySelectorAll('.table__doctor-col');
const blankCanvas = document.createElement('canvas'); // удаляем тень для перетаскиваемого элемента
blankCanvas.style.opacity = '0';


function handleDragStart(event) {
  this.classList.add('dragging');

  // сбросил позицию, чтобы было лучше видно, куда тащим элемент
  // теперь снепшот перетаскиваемого элемента не виден
  event.dataTransfer.setDragImage(blankCanvas, 0, 0);
  document.body.appendChild(blankCanvas);
}

function handleDragEnd() {
  this.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();

  const afterElement = getDragAfterElement(this, e.clientY);
  const draggingElement = document.querySelector('.dragging');
  const dropRect = this.getBoundingClientRect();

  const newTop = Math.round((e.clientY - dropRect.top) / 10) * 10 + 1;

  draggingElement.style.top = `${newTop}px`;

  if (afterElement == null) {
    this.appendChild(draggingElement);
  } else {
    this.insertBefore(draggingElement, afterElement);
  }

  checkIntersection(draggingElement)
}

function checkIntersection (draggingElement) {
  const draggingRect = draggingElement.getBoundingClientRect();

  draggables.forEach((element) => {
    if (element !== draggingElement) {
      const elementRect = element.getBoundingClientRect();

      if (
        draggingRect.top < elementRect.bottom &&
        draggingRect.bottom > elementRect.top &&
        draggingRect.left < elementRect.right &&
        draggingRect.right > elementRect.left
      ) {
        draggingElement.classList.add('intersected');
        console.log('Пересечение элементов!');
      } else {
        draggingElement.classList.remove('intersected');
      }
    }
  })
}



function handleDrop(e) {
  const dropRect = this.getBoundingClientRect();
  const newTop = Math.round((e.clientY - dropRect.top) / 10) * 10 + 1;

  const draggingElement = document.querySelector('.dragging');
  draggingElement.style.top = `${newTop}px`;

  tableDoctorCols.forEach((col) => {
    col.classList.remove('active');
  });

  e.preventDefault();
}

function handleDragEnter(e) {
  this.classList.add('active');
}

function handleDragLeave() {
  this.classList.remove('active');
}

function handleDrag(e) {
  const draggingElement = document.querySelector('.dragging');
  const currentTop = parseInt(draggingElement.style.top);

  const dragDistance = e.clientY - e.target.getBoundingClientRect().top;
  const newTop = Math.round((currentTop + dragDistance) / 10) * 10;

  draggingElement.style.top = `${newTop}px`;
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll('.draggable:not(.dragging)'),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}


draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', handleDragStart);
  draggable.addEventListener('dragend', handleDragEnd);
  draggable.addEventListener('drag', handleDrag);
});

tableDoctorCols.forEach((col) => {
  col.addEventListener('dragover', handleDragOver);
  col.addEventListener('drop', handleDrop);
  col.addEventListener('dragenter', handleDragEnter);
  col.addEventListener('dragleave', handleDragLeave);
});

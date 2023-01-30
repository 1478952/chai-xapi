import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const defaultTodos = [
  { id: "1", title: "1" },
  { id: "2", title: "2" },
  { id: "3", title: "3" },
  { id: "4", title: "4" },
  { id: "5", title: "5" },
];

const Dnd = () => {
  const [todos, setTodos] = useState(defaultTodos);
  const [drops, setDrops] = useState<{ id: string; title: string }[]>([]);

  const handleChange = (result: DropResult) => {
    if (!result.destination) return;
    console.log(result);
    const dropsArr = [...drops, todos[result.source.index]];
    setDrops(dropsArr);
  };

  return (
    <DragDropContext onDragEnd={handleChange}>
      <Droppable droppableId="todos" isDropDisabled={true}>
        {(provided) => (
          <div
            className="todos"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todos.map((todo, index) => {
              return (
                <Draggable draggableId={todo.id} key={todo.id} index={index}>
                  {(provided) => (
                    <button
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {todo.title}
                    </button>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <Droppable droppableId="dropzone">
        {(provided) => (
          <div
            className="dropzone"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ border: "1px solid red", width: "200px", height: "200px" }}
          >
            {drops.map((drop, index) => {
              return <button key={index}>{drop.title}</button>;
            })}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Dnd;

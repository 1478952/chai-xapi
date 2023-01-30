import { useState, useEffect } from "react";
const useContextMenu = () => {
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const handleClick = () => setClicked(false);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return {
    clicked,
    setClicked,
    points,
    setPoints,
  };
};
export default useContextMenu;

// const { clicked, setClicked, points, setPoints } = useContextMenu();

// {clicked && (
//   <ContextMenu top={points.y} left={points.x}>
//     <ul>
//       <li>편집하기</li>
//       <li>복사</li>
//       <li>붙여넣기</li>
//       <li>삭제</li>
//     </ul>
//   </ContextMenu>
// )}
// onContextMenu={(event) => {
//   event.preventDefault();
//   setClicked(true);
//   setPoints({
//     x: event.pageX,
//     y: event.pageY,
//   });
// }}

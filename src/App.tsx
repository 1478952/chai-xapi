import "./lx-xapi-wrapper-es5.mjs";
import React, { useEffect, useMemo, useState } from "react";
import { BubblePlayer } from "./bubblePlayer";
import Dnd from "./Dnd";
import FileUploader from "./FileUploader";

function App() {
  const [pageIndex, setPageIndex] = useState(0);

  const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255],
  } satisfies Record<
    "red" | "blue" | "green",
    [number, number, number] | string
  >;

  const normalGreen = palette.green.toUpperCase();

  function validate(someValue: number) {
    return !Number.isNaN(someValue);
  }

  const lrsUrl = "abcd";
  const sessionId = "1";
  const homepageUrl = "homepage";
  const userAgent = "user";
  const course = "1";
  const totalPage = 12;
  const activityId = "activity";
  const contentName = "content";
  const description = "description";
  const actor = {
    account: {
      homePage: "https://smake.caihong.co.kr",
      name: "아이디|소속|사원/대리",
    },
    name: "tester",
    objectType: "Agent",
  };

  const props = useMemo(() => {
    return {
      lrsUrl,
      sessionId,
      homepageUrl,
      userAgent,
      course,
      totalPage,
      activityId,
      contentName,
      description,
      actor,
    };
  }, []);

  const bubblePlayer = useMemo(() => {
    return new BubblePlayer(props);
  }, [props]);

  useEffect(() => {
    bubblePlayer.subscribe({
      name: "button",
      state: "a",
      callback: () => {
        bubblePlayer.sendStart(pageIndex);
      },
    });
    bubblePlayer.subscribe({
      name: "pageIndex",
      state: pageIndex,
      callback: () => {
        bubblePlayer.sendProgressed(pageIndex, 0);
      },
    });
    bubblePlayer.dispatch({ name: "pageIndex", state: pageIndex });
  }, [bubblePlayer, pageIndex]);

  return (
    <div>
      <button
        onClick={() => {
          bubblePlayer.dispatch({ name: "button", state: "b" });
        }}
      >
        시작하기!
      </button>
      <button
        onClick={() => {
          setPageIndex((prev) => prev - 1);
        }}
      >
        이전버튼
      </button>
      <button
        onClick={() => {
          setPageIndex((prev) => prev + 1);
        }}
      >
        다음버튼
      </button>
      <button
        onClick={() => {
          bubblePlayer.terminate();
        }}
      >
        나가기
      </button>
      <Dnd />
      <FileUploader />
    </div>
  );
}

export default App;

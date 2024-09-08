import * as React from "react";
import { useState, useEffect } from "react";

const fonts = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Comic Sans MS",
];

export default function Header(props) {
  const [currentFont, setCurrentFont] = useState(fonts[0]);
  useEffect(() => {
    const changeFont = () => {
      setCurrentFont((prevFont) => {
        const currentIndex = fonts.indexOf(prevFont);
        const nextIndex = (currentIndex + 1) % fonts.length;
        return fonts[nextIndex];
      });
    };
    const intervalId = setInterval(changeFont, 5000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <header className="App-header">
      <h1 className="App-title text-truncate" style={{ fontFamily: currentFont }}>
        {props.pageTitle}
      </h1>
    </header>
  );
}

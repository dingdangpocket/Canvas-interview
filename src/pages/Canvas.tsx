import { useEffect, useState, ChangeEvent } from "react";
import styles from "./Canvas.module.less";
export type ShapeType = {
  x: number;
  y: number;
  width: number;
  height: number;
  lineUnActiveColor: string;
  lineActiveColor: string;
  clickFlag: boolean;
};
export default function Canvas() {
  const [curClientX, setCurClientX] = useState<number | null>(null);
  const [curClientY, setCurClientY] = useState<number | null>(null);
  const [initCanvasFlag, setInitCanvasFlag] = useState<boolean>(false);
  const [boardWidth, setBoardWidth] = useState<string>("920");
  const [boardHeight, setBoardHeight] = useState<string>("500");
  const [columnLineInput, setColumnLineInput] = useState<string>("100");
  const [rowLineInput, setRowLineInput] = useState<string>("100");
  const [curShape, setCurShape] = useState<ShapeType>({
    x: 20,
    y: 20,
    width: 920,
    height: 500,
    lineUnActiveColor: "black",
    lineActiveColor: "white",
    clickFlag: true,
  });
  const [shapes, setShapes] = useState<ShapeType[]>([]);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>();
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();
  useEffect(() => {
    const canvasRef = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasCtx = canvasRef.getContext("2d")! as CanvasRenderingContext2D;
    setCanvasRef(canvasRef);
    setCanvasCtx(canvasCtx);
  }, []);
  const onClearShape = () => {
    shapes.map((shape: ShapeType) => {
      canvasCtx?.clearRect(shape.x, shape.y, shape.width, shape.height);
    });
  };
  const renderShape = (newShapes: ShapeType[]) => {
    if (!canvasCtx) return;
    onClearShape();
    newShapes.map((shape: ShapeType) => {
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = shape.clickFlag
        ? shape.lineActiveColor
        : shape.lineUnActiveColor;
      canvasCtx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
      canvasCtx.fillStyle = shape.clickFlag ? "#151515cc" : "white";
      canvasCtx.fillRect(shape.x, shape.y, shape.width, shape.height);
      canvasCtx.font = `${10}px Arial`;
      canvasCtx.fillStyle = shape.clickFlag ? "white" : "black";
      canvasCtx.fillText(
        `???:${shape.width}mm`,
        shape.x,
        shape.y + shape.height * 0.25
      );
      canvasCtx.font = `${10}px Arial`;
      canvasCtx.fillStyle = shape.clickFlag ? "white" : "black";
      canvasCtx.fillText(
        `???:${shape.height}mm`,
        shape.x,
        shape.y + shape.height * (0.25 + 0.3)
      );
    });
  };
  const upDateClickStatus = (X: number, Y: number) => {
    shapes.forEach((shape: any) => {
      if (
        shape.x <= X &&
        shape.x + shape.width >= X &&
        shape.y <= Y &&
        shape.y + shape.height >= Y
      ) {
        //??????shape;
        shape.clickFlag = !shape.clickFlag;
        setCurShape(shape);
      } else {
        //?????????shape;
        shape.clickFlag = false;
      }
    });
    setShapes([...shapes]);
  };
  const getMousePosition = (
    canvasRef: HTMLCanvasElement,
    clickEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    let viewRect = canvasRef.getBoundingClientRect();
    let X = clickEvent.clientX - viewRect.left;
    let Y = clickEvent.clientY - viewRect.top;
    setCurClientX(X);
    setCurClientY(Y);
    upDateClickStatus(X, Y);
  };

  const onClickListener = (
    clickEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvasRef || !clickEvent) return;
    getMousePosition(canvasRef, clickEvent);
  };
  useEffect(() => {
    renderShape(shapes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes]);

  const columnShapeSlice = () => {
    if (!canvasCtx) return;
    const shapeConfigA = {
      x: curShape.x,
      y: curShape.y,
      width: Number(columnLineInput),
      height: curShape.height,
      lineUnActiveColor: "black",
      lineActiveColor: "gray",
      clickFlag: false,
    };
    const shapeConfigB = {
      x: curShape.x + Number(columnLineInput),
      y: curShape.y,
      width: curShape.width - Number(columnLineInput),
      height: curShape.height,
      lineUnActiveColor: "black",
      lineActiveColor: "gray",
      clickFlag: false,
    };
    setShapes([...shapes, shapeConfigA, shapeConfigB]);
  };
  const rowShapeSlice = () => {
    if (!canvasCtx) return;
    const shapeConfigA = {
      x: curShape.x,
      y: curShape.y,
      width: curShape.width,
      height: Number(rowLineInput),
      lineUnActiveColor: "black",
      lineActiveColor: "gray",
      clickFlag: false,
    };
    const shapeConfigB = {
      x: curShape.x,
      y: curShape.y + Number(rowLineInput),
      width: curShape.width,
      height: curShape.height - Number(rowLineInput),
      lineUnActiveColor: "black",
      lineActiveColor: "gray",
      clickFlag: false,
    };
    setShapes([...shapes, shapeConfigA, shapeConfigB]);
  };
  const commonInterceptor = (input: string, tag: string) => {
    if (!initCanvasFlag) {
      alert("???????????????????????????????????????");
      return false;
    }
    if (!input) {
      alert("????????????????????????,??????????????????");
      return false;
    }
    if (tag === "colTag") {
      if (Number(input) >= curShape.width) {
        alert("????????????????????????????????????,????????????,???????????????");
        setColumnLineInput("");
        return false;
      }
    }
    if (tag === "rowTag") {
      if (Number(input) >= curShape.height) {
        alert("????????????????????????????????????,????????????,???????????????");
        setRowLineInput("");
        return false;
      }
    }
    return true;
  };

  const commonRehandleShapes = () => {
    const curIndex = shapes.findIndex((item: { clickFlag: boolean }) => {
      return item.clickFlag === true;
    });
    if (curIndex !== -1) {
      const reHandleShapes = shapes.splice(curIndex, 1);
      setShapes([...reHandleShapes]);
    }
  };
  const onAddColumnLine = () => {
    const Auth = commonInterceptor(columnLineInput, "colTag");
    if (!Auth) return;
    commonRehandleShapes();
    columnShapeSlice();
  };
  const onAddRowLine = () => {
    const Auth = commonInterceptor(rowLineInput, "rowTag");
    if (!Auth) return;
    commonRehandleShapes();
    rowShapeSlice();
  };
  const onColumnLineInputRefChange = (
    inputEvent: ChangeEvent<HTMLInputElement>
  ) => {
    const authValue = inputEvent?.target?.value.replace(/[^\d]+/, "");
    setColumnLineInput(authValue);
    console.log(inputEvent?.target?.value);
  };
  const onRowLineInputRefChange = (
    inputEvent: ChangeEvent<HTMLInputElement>
  ) => {
    const authValue = inputEvent?.target?.value.replace(/[^\d]+/, "");
    setRowLineInput(authValue);
    console.log(inputEvent?.target?.value);
  };
  const onBoardWidthChange = (inputEvent: ChangeEvent<HTMLInputElement>) => {
    const authValue = inputEvent?.target?.value.replace(/[^\d]+/, "");
    setBoardWidth(authValue);
    console.log(inputEvent?.target?.value);
  };
  const onBoardHeightChange = (inputEvent: ChangeEvent<HTMLInputElement>) => {
    const authValue = inputEvent?.target?.value.replace(/[^\d]+/, "");
    setBoardHeight(authValue);
    console.log(inputEvent?.target?.value);
  };

  const commonTip = (TIP: string) => {
    alert(TIP);
    setBoardWidth("");
    setBoardHeight("");
  };
  const onInitCanvas = () => {
    if (!canvasCtx || !boardWidth || !boardHeight) {
      commonTip("??????????????????????????????;");
      return;
    }
    if (initCanvasFlag) {
      commonTip("???????????????????????????????????????;");
      return;
    }
    if (Number(boardWidth) > 920 || Number(boardHeight) > 500) {
      commonTip("??????????????????????????????,???????????????;");
      canvasCtx?.clearRect(0, 0, 960, 540);
      return;
    }
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "black";
    const x = 960 - Number(boardWidth);
    const y = 540 - Number(boardHeight);
    canvasCtx?.strokeRect(
      x / 2,
      y / 2,
      Number(boardWidth),
      Number(boardHeight)
    );
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(x / 2, y / 2, Number(boardWidth), Number(boardHeight));
    setCurShape({
      x: x / 2,
      y: y / 2,
      width: Number(boardWidth),
      height: Number(boardHeight),
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: true,
    });
    setInitCanvasFlag(true);
  };
  const onClearCanvas = () => {
    if (!canvasCtx) return;
    setShapes([]);
    setCurShape({
      x: 20,
      y: 20,
      width: 920,
      height: 500,
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: true,
    });
    setInitCanvasFlag(false);
    canvasCtx.clearRect(0, 0, 960, 540);
  };
  return (
    <div>
      <div>?????????:960mm</div>
      <div>?????????:540mm</div>
      <div className={styles.headerControl}>
        <div>??????X??????:{curClientX}</div>
        <div>??????Y??????:{curClientY}</div>
        <div>???????????????:920mm</div>
        <div>???????????????:500mm</div>
        <div>
          ???:
          <input
            type="text"
            value={boardWidth}
            placeholder="?????????????????????"
            onChange={onBoardWidthChange}
          />
          <span>??????(??????(mm))</span>
        </div>
        <div>
          ???:
          <input
            type="text"
            value={boardHeight}
            placeholder="?????????????????????"
            onChange={onBoardHeightChange}
          />
          <span>??????(mm)</span>
        </div>
        <div>
          <button onClick={() => onInitCanvas()}>????????????</button>
        </div>
        <div>
          <button onClick={() => onClearCanvas()}>????????????</button>
        </div>
      </div>
      <div className={styles.canvas}>
        <div>
          <canvas
            id="canvas"
            width="960"
            height="540"
            onClick={(
              clickEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
            ) => onClickListener(clickEvent)}
          ></canvas>
        </div>
      </div>
      <div className={styles.footerControl}>
        ?????????:
        <input
          type="text"
          value={columnLineInput}
          placeholder="??????????????????"
          onChange={onColumnLineInputRefChange}
        />
        <span>??????(mm)</span>
        <button onClick={() => onAddColumnLine()}>?????????</button>
        ?????????:
        <input
          type="text"
          value={rowLineInput}
          placeholder="??????????????????"
          onChange={onRowLineInputRefChange}
        />
        <span>??????(mm)</span>
        <button onClick={() => onAddRowLine()}>?????????</button>
      </div>
    </div>
  );
}

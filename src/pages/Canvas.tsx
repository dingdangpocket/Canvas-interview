import { useEffect, useState, ChangeEvent } from "react";
import styles from "./Canvas.module.less";
export default function Canvas() {
  const [curClientX, setCurClientX] = useState<number | null>(null);
  const [curClientY, setCurClientY] = useState<number | null>(null);
  const [initCanvasFlag, setInitCanvasFlag] = useState<boolean>(false);
  const [boardWidth, setBoardWidth] = useState<string>("920");
  const [boardHeight, setBoardHeight] = useState<string>("500");
  const [columnLineInput, setColumnLineInput] = useState<string>("100");
  const [rowLineInput, setRowLineInput] = useState<string>("");
  const [curShape, setCurShape] = useState<any>({
    id: 0,
    x: 20,
    y: 20,
    width: 920,
    height: 500,
    lineUnActiveColor: "black",
    lineActiveColor: "red",
    clickFlag: true,
  });
  const [shapes, setShapes] = useState<any>([]);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>();
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();
  useEffect(() => {
    const canvasRef = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasCtx = canvasRef.getContext("2d")! as CanvasRenderingContext2D;
    setCanvasRef(canvasRef);
    setCanvasCtx(canvasCtx);
  }, []);
  const onClearShape = () => {
    shapes.map((shape: any) => {
      canvasCtx?.clearRect(shape.x, shape.y, shape.width, shape.height);
    });
  };
  const renderShape = (newShapes: any) => {
    if (!canvasCtx) return;
    onClearShape();
    newShapes.map((shape: any) => {
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = shape.clickFlag
        ? shape.lineActiveColor
        : shape.lineUnActiveColor;
      canvasCtx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
      canvasCtx.fillStyle = shape.clickFlag ? "#993e3ecc" : "white";
      canvasCtx.fillRect(shape.x, shape.y, shape.width, shape.height);
      canvasCtx.font = `${10}px Arial`;
      canvasCtx.fillStyle = "black";
      canvasCtx.fillText(
        `宽:${shape.width}mm`,
        shape.x,
        shape.y + shape.height * 0.25
      );
      canvasCtx.font = `${10}px Arial`;
      canvasCtx.fillStyle = "black";
      canvasCtx.fillText(
        `高:${shape.height}mm`,
        shape.x,
        shape.y + shape.height * 0.4
      );
      // canvasCtx.fillStyle = "black";
      // canvasCtx.font = "20px Arial";
      // canvasCtx.fillText(`高:${shape.height}mm`, shape.x, shape.y);
    });
  };
  const upDateClickStatus = (X: any, Y: any) => {
    shapes.forEach((shape: any) => {
      if (
        shape.x <= X &&
        shape.x + shape.width >= X &&
        shape.y <= Y &&
        shape.y + shape.height >= Y
      ) {
        //点击shape;
        shape.clickFlag = !shape.clickFlag;
        setCurShape(shape);
      } else {
        //非点击shape;
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
      id: 0,
      x: curShape.x,
      y: curShape.y,
      width: Number(columnLineInput),
      height: curShape.height,
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: false,
    };
    const shapeConfigB = {
      id: 1,
      x: curShape.x + Number(columnLineInput),
      y: curShape.y,
      width: curShape.width - Number(columnLineInput),
      height: curShape.height,
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: false,
    };
    // onClearShape();
    setShapes([...shapes, shapeConfigA, shapeConfigB]);
  };
  const rowShapeSlice = () => {
    if (!canvasCtx) return;
    const shapeConfigA = {
      id: 0,
      x: curShape.x,
      y: curShape.y,
      width: curShape.width,
      height: Number(rowLineInput),
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: false,
    };
    const shapeConfigB = {
      id: 1,
      x: curShape.x,
      y: curShape.y + Number(rowLineInput),
      width: curShape.width,
      height: curShape.height - Number(rowLineInput),
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: false,
    };
    // onClearShape();
    setShapes([...shapes, shapeConfigA, shapeConfigB]);
  };
  const onAddColumnLine = () => {
    if (columnLineInput > curShape.width) {
      alert("左间距超出当前图形,无法追加,请重新输入");
      setColumnLineInput("");
    }
    const curIndex = shapes.findIndex((item: { clickFlag: boolean }) => {
      return item.clickFlag === true;
    });
    if (curIndex !== -1) {
      const reHandleShapes = shapes.splice(curIndex, 1);
      setShapes([...reHandleShapes]);
    }
    console.log(curIndex);
    columnShapeSlice();
  };
  const onAddRowLine = () => {
    if (rowLineInput > curShape.height) {
      alert("左间距超出当前图形,无法追加,请重新输入");
      setRowLineInput("");
    }
    const curIndex = shapes.findIndex((item: { clickFlag: boolean }) => {
      return item.clickFlag === true;
    });
    if (curIndex !== -1) {
      const reHandleShapes = shapes.splice(curIndex, 1);
      setShapes([...reHandleShapes]);
    }
    console.log(curIndex);
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
      commonTip("请输入完整的宽高数据;");
      return;
    }
    if (initCanvasFlag) {
      commonTip("如需重新初始化请先清空画板;");
      return;
    }
    if (Number(boardWidth) > 920 || Number(boardHeight) > 500) {
      commonTip("超出最大支持画板尺寸,请重新输入;");
      canvasCtx?.clearRect(0, 0, 960, 540);
      return;
    }
    canvasCtx.lineWidth = 3;
    canvasCtx.strokeStyle = "black";
    canvasCtx?.strokeRect(20, 20, Number(boardWidth), Number(boardHeight));
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(20, 20, Number(boardWidth), Number(boardHeight));
    setInitCanvasFlag(true);
  };
  const onClearCanvas = () => {
    if (!canvasCtx) return;
    setInitCanvasFlag(false);
    canvasCtx.clearRect(0, 0, 960, 540);
  };
  return (
    <div>
      {JSON.stringify(curShape)}
      {JSON.stringify(shapes)}
      {/* <button onClick={() => renderShape()}>shape</button> */}
      <div>当前点击X坐标:{curClientX}</div>
      <div>当前点击Y坐标:{curClientY}</div>
      <div>画布长:960mm</div>
      <div>画布宽:540mm</div>
      <div>最大画板长:920mm</div>
      <div>最大画板宽:500mm</div>
      <div className={styles.footerControl}>
        <div>
          宽:
          <input
            type="text"
            value={boardWidth}
            placeholder="请输入画板宽度"
            onChange={onBoardWidthChange}
          />
          <span>mm</span>
        </div>
        <div>
          高:
          <input
            type="text"
            value={boardHeight}
            placeholder="请输入画板高度"
            onChange={onBoardHeightChange}
          />
          <span>mm</span>
        </div>
        <div>
          <button onClick={() => onInitCanvas()}>初始画板</button>
        </div>
        <div>
          <button onClick={() => onClearCanvas()}>清空画板</button>
        </div>
      </div>
      <div className={styles.canvas}>
        <canvas
          id="canvas"
          width="960"
          height="540"
          onClick={(
            clickEvent: React.MouseEvent<HTMLCanvasElement, MouseEvent>
          ) => onClickListener(clickEvent)}
        ></canvas>
        <div className={styles.footerControl}>
          左边距:
          <input
            type="text"
            value={columnLineInput}
            placeholder="请输入内容"
            onChange={onColumnLineInputRefChange}
          />
          <span>mm</span>
          <button onClick={() => onAddColumnLine()}>加竖线</button>
          右边距:
          <input
            type="text"
            value={rowLineInput}
            placeholder="请输入内容"
            onChange={onRowLineInputRefChange}
          />
          <span>mm</span>
          <button onClick={() => onAddRowLine()}>加横线</button>
        </div>
      </div>
    </div>
  );
}

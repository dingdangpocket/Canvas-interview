import { useEffect, useState, useRef, ChangeEvent } from "react";
import styles from "./Canvas.module.less";
export default function Canvas() {
  const [curClientX, setCurClientX] = useState<number | null>(null);
  const [curClientY, setCurClientY] = useState<number | null>(null);
  const [initCanvasFlag, setInitCanvasFlag] = useState<boolean>(false);
  const [boardWidth, setBoardWidth] = useState<string>("920");
  const [boardHeight, setBoardHeight] = useState<string>("500");
  const [columnLineInput, setColumnLineInput] = useState<string>("");
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
  const [shapes, setShapes] = useState<any>([
    {
      id: 0,
      x: 20,
      y: 20,
      width: 920,
      height: 500,
      lineUnActiveColor: "black",
      lineActiveColor: "red",
      clickFlag: true,
    },
    // {
    //   id: 1,
    //   x: 20,
    //   y: 20,
    //   width: 300,
    //   height: 300,
    //   lineUnActiveColor: "black",
    //   lineActiveColor: "red",
    //   clickFlag: false,
    // },
    // {
    //   id: 2,
    //   x: 70,
    //   y: 20,
    //   width: 50,
    //   height: 50,
    //   lineUnActiveColor: "black",
    //   lineActiveColor: "red",
    //   clickFlag: false,
    // },
  ]);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>();
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D>();

  const onClearShape = () => {
    shapes.map((shape: any) => {
      canvasCtx?.clearRect(shape.x, shape.y, shape.width, shape.height);
    });
  };

  const renderShape = () => {
    if (!canvasCtx) return;
    onClearShape();
    shapes.map((shape: any) => {
      canvasCtx.lineWidth = 3;
      canvasCtx.strokeStyle = shape.clickFlag
        ? shape.lineActiveColor
        : shape.lineUnActiveColor;
      canvasCtx?.strokeRect(shape.x, shape.y, shape.width, shape.height);
      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(shape.x, shape.y, shape.width, shape.height);
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
  useEffect(() => {
    renderShape();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes]);
  const getMousePosition = (
    canvasRef: HTMLCanvasElement,
    clickEvent: MouseEvent
  ) => {
    let viewRect = canvasRef.getBoundingClientRect();
    let X = clickEvent.clientX - viewRect.left;
    let Y = clickEvent.clientY - viewRect.top;
    setCurClientX(X);
    setCurClientY(Y);
    upDateClickStatus(X, Y);
  };
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
    onClearShape();
    setShapes([shapeConfigA, shapeConfigB]);
  };
  const onAddColumnLine = () => {
    if (columnLineInput > curShape.width) {
      alert("左间距超出当前图形,无法追加,请重新输入");
      setColumnLineInput("");
    }
    columnShapeSlice();
    console.log(columnLineInput);
  };
  const onAddRowLine = () => {
    console.log(rowLineInput);
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
  useEffect(() => {
    const canvasRef = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasCtx = canvasRef.getContext("2d")! as CanvasRenderingContext2D;
    setCanvasRef(canvasRef);
    setCanvasCtx(canvasCtx);
    canvasRef.addEventListener("mousedown", (clickEvent: MouseEvent) => {
      if (!canvasRef || !clickEvent) return;
      console.log("=>", shapes);
      getMousePosition(canvasRef, clickEvent);
    });

    // //正方形;
    // canvasCtx.fillStyle = "black";
    // canvasCtx.fillRect(20, 20, 150, 100);
    // canvasCtx.clearRect(30, 30, 130, 80);

    // //方框
    // canvasCtx.lineWidth = 5;
    // canvasCtx.strokeStyle = "white";
    // canvasCtx.strokeRect(20, 200, 150, 100);

    // //正方形;
    // canvasCtx.beginPath();
    // canvasCtx.rect(20, 360, 120, 120);
    // canvasCtx.fillStyle = "teal";
    // canvasCtx.fill();

    // //三角形
    // canvasCtx.beginPath();
    // canvasCtx.moveTo(350, 20);
    // canvasCtx.lineTo(500, 20);
    // canvasCtx.lineTo(425, 180);
    // canvasCtx.lineTo(350, 20);
    // canvasCtx.fillStyle = "black";
    // canvasCtx.stroke();
    // canvasCtx.fill();

    // Animation 1
    // const circle = {
    //   x: 200,
    //   y: 200,
    //   size: 30,
    //   dx: 5,
    //   dy: 4
    // };

    // function drawCircle() {
    //   canvasRef.beginPath();
    //   canvasRef.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
    //   canvasRef.fillStyle = 'purple';
    //   canvasRef.fill();
    // }

    // function update() {
    //   canvasRef.clearRect(0, 0, canvas.width, canvas.height);

    //   drawCircle();

    //   // change position
    //   circle.x += circle.dx;
    //   circle.y += circle.dy;

    //   // Detect side walls
    //   if (circle.x + circle.size > canvas.width || circle.x - circle.size < 0) {
    //     circle.dx *= -1;
    //   }

    //   // Detect top and bottom walls
    //   if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
    //     circle.dy *= -1;
    //   }

    //   requestAnimationFrame(update);
    // }

    // update();
  }, []);
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
      <button onClick={() => renderShape()}>shape</button>
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
        <canvas id="canvas" width="960" height="540"></canvas>
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

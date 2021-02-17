//Create a stage by getting a reference to the canvas

function init() {
    stage = new createjs.Stage("gameMain");

    var backgroundImage = new createjs.Bitmap("./assets/imgs/bg.png")
    stage.addChild(backgroundImage);
    var shape1 = new createjs.Shape();
    var shape2 = new createjs.Shape();
    var shape3 = new createjs.Shape();
    var shape4 = new createjs.Shape();

    shape1.graphics.beginFill("#ff0000")
    shape2.graphics.beginFill("#ff0")
    shape3.graphics.beginFill("#222fff")
    shape4.graphics.beginFill("#ff0fff")

    let shapes = [shape1, shape2, shape3, shape4]

    for (let i = 0; i < 4; i++){
        console.log(shapes[i])
        shapes[i].positionId = i
        if (i == 0){
            y = 95
        } else {
            y = 100 * (i + 1)
        }
        shapes[i].graphics.drawRect(4, y, 31, 20);
        stage.addChild(shapes[i])

    }

    stage.update()
    console.log(stage)
}

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick(event) {
    stage.update();
    if (!event.paused) {
        // Actions carried out when the Ticker is not paused.
    }
}



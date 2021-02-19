//Create a stage by getting a reference to the canvas

function init() {
    stage = new createjs.Stage("gameMain");
    connected = 0
    gameContainer = new createjs.Container()
    var backgroundImage = new createjs.Bitmap("./assets/imgs/bg.png")
    createjs.Sound.on("fileload", handleLoad)
    createjs.Sound.registerSound('./assets/sounds/bg.mp3', 'bg', 1)
    createjs.Sound.registerSound('./assets/sounds/connect.mp3', 'connect', 2)

    backgroundImage.scale = 1.25
    gameContainer.addChild(backgroundImage);
    stage.addChild(gameContainer)

    createjs.Touch.enable(stage);
    createjs.Ticker.framerate = 24;
    let colors = [{color: 'red', hex: '#ff0000', circle: false, sides: 3, point: 0, angle: -90}, {
        color: 'blue',
        hex: '#222fff',
        circle: false,
        sides: 4,
        point: .99,
        angle: -45
    }, {color: 'yellow', hex: '#ff0', circle: true}, {
        color: 'pink',
        hex: '#ff0fff',
        circle: false,
        sides: 5,
        point: .65,
        angle: -90
    }]
    let nodesL = createNodes(shuffle(colors), true)
    let nodesR = createNodes(shuffle(colors), false)
    addShapesToStage(nodesL, stage, true)
    addShapesToStage(nodesR, stage)


}

createjs.Ticker.addEventListener("tick", handleTick);

function handleTick(event) {
    if (!event.paused) {
        stage.update();

        // Actions carried out when the Ticker is not paused.
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*

*/

function handlePress(event) {
    startingTarget = event.currentTarget.children[0]
    startingContainer = event.currentTarget
    connection = new createjs.Shape().set({
        x: event.target.parent.x,
        y: event.target.parent.y,
        mouseEnabled: false,
        graphics: new createjs.Graphics().s(startingTarget.graphics._fill.style).dc(0, 0, 50)
    });
    gameContainer.addChild(connection);
    stage.addEventListener("stagemousemove", drawLine);
    stage.addEventListener("stagemouseup", endDraw);
}

function drawLine(event) {
    connection.graphics.clear()
        .ss(20)
        .s(startingTarget.graphics._fill.style)
        .mt(38, 13).lt(stage.mouseX - connection.x, stage.mouseY - connection.y);
}

function endDraw(event) {
    var target, targets = stage.getObjectsUnderPoint(stage.mouseX, stage.mouseY);
    for (var i = 0; i < targets.length; i++) {
        if (targets[i].name == startingTarget.name && targets[i].id !== startingTarget.id) {
            target = targets[i];
            break;
        }
    }

    if (target != null) {
        createjs.Sound.play('connect')
        connection.graphics.clear()
            .ss(20)
            .s(startingTarget.graphics._fill.style)
            .mt(38, 13).lt(target.parent.x - connection.x + 5, target.parent.y - connection.y + 13);
        startingContainer.removeAllEventListeners()
        connected++
        if (connected === 4) {
            let popupContainer = new createjs.Container().set({
                x : 250,
                y : 250
            })
            let popupBox = new createjs.Shape()
            popupBox.graphics.ss(5).s('#555').beginFill('rgba(114, 114, 114, .4').drawRect(0, 0, 200, 70)
            let popupText = new createjs.Text('Power Restored', "20px Arial", "#00ff00").set({
                x : 30,
                y: 25
            })
            popupContainer.addChild(popupBox, popupText)
            var blurFilter = new createjs.BlurFilter(20, 20, 1);
            gameContainer.filters = [blurFilter]
            var bounds = blurFilter.getBounds();

            gameContainer.cache(-10+bounds.x, -10+bounds.y, 1000+bounds.width, 1000+bounds.height);

            stage.addChild(popupContainer)
        }

    } else {
        gameContainer.removeChild(connection);
    }

    stage.removeEventListener("stagemousemove", drawLine);
    stage.removeEventListener("stagemouseup", endDraw);
    stage.update()
}


function createNodes(colors, left) {


    let yCord = 0
    let nodes = []
    let stars = []
    let shape
    let star
    for (let i = 0; i < colors.length; i++) {
        if (i === 0) {
            yCord = 118
        } else if (i <= 2) {
            yCord = 125 * (i + 1)
        } else {
            yCord = 502
        }
        if (left) {
            shape = new createjs.Container().set({
                x: 4,
                y: yCord -2,
                cursor: "pointer",
            })

        } else {
            shape = new createjs.Container().set({
                x: 585,
                y: yCord -2,
                cursor: "pointer",

            })
        }
        let wireColor = new createjs.Shape();
        wireColor.name = colors[i].color
        wireColor.graphics.beginFill(colors[i].hex).drawRect(0, 0, 43, 30)
        shape.addChild(wireColor)
        let wireShape = new createjs.Shape()
        if(!colors[i].circle){
            wireShape.graphics.s('#000').drawPolyStar(20,15, 10, colors[i].sides, colors[i].point, colors[i].angle)
        } else{
            wireShape.graphics.s('#000').dc(20,15, 10)
        }
        shape.addChild(wireShape)
        nodes.push(shape)

    }

    return nodes

}


function addShapesToStage(shapes, stage, left = false) {
    for (var i = 0; i < shapes.length; i++) {
        let shape = shapes[i]
        gameContainer.addChild(shape);
        if (left) {
            shape.on("mousedown", handlePress)
        }
    }
    stage.update()
}

function handleLoad(event){
    createjs.Sound.play('bg', {loop:-1})
}
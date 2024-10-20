<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Fullscreen Drawing with Bounding Box</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            overflow: hidden; /* Prevent scrollbars */
            height: 100%;
        }

        canvas {
            --background-color: rgba(0,0,0,.1);
            display: block; /* Remove spacing below the canvas */
            position:absolute;
            top:0;
        }

        nav {
            display: flex;
            flex-direction: row;
            flex: 1;
            border: 1px solid black;
            padding: 1rem;
        }

        .rectangle, .text {
            border: 1px solid black;
            height: 64px;
            flex: 1;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: flex;
        }

        .close {
            color: white;
            
            background-color: white;
            font-size: 1rem;
            font-weight: bold;
            padding: 1rem;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 10px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            content:'x';
            
            border:4px dashed silver;
            opacity:1;
            transform: all .3s ease-in-out;
        }
        
        .close::before {
            content: '\1F512';
        }
        
        .unlock {
            background-color:;
            display:block;
             border:4px solid black;
             font-size:50px;
             opacity:1;
        }
        
        .close.unlock::before{
            content:'\1F58C';
        
            
        }

        .hide {
            display: none;
        }

        /* Bounding box info */
        .bounding-box-info {
            position: absolute;
            top: 10px;
            left:50%;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border: 1px solid black;
            font-family: Arial, sans-serif;
        }

        /* Style for elements inside the bounding box */
        .highlight {
            border: 8px solid orange;
            background-color:limegreen;
        }

        content {
            display: flex;
            flex-direction: row;
            flex: 1;
            border: 5px solid red;
            padding: 1rem;
            min-height: 50vh;
        }

        .drop {
            padding: 1rem;
        }
        
    </style>
</head>
<body>

    <nav>
        <div class="rectangle">Rectangle</div>
        <div class="text shape">Text Goes Here</div>
        <input type="color" class="color">
    </nav>
    <content class="canvas">
    </content>

    <canvas class="hide" id="myCanvas"></canvas>
    <button class="close"></button>
    <div class="bounding-box-info hide" id="boundingBoxInfo">
        <strong>Bounding Box:</strong>
        <p id="boxDetails"></p>
    </div>

<script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const boundingBoxInfo = document.getElementById('boundingBoxInfo');
    const boxDetails = document.getElementById('boxDetails');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;
    let minX, maxX, minY, maxY;

    // Set up line styles
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'red';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Function to set canvas size to the entire viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Adjust canvas size on window resize
    window.addEventListener('resize', resizeCanvas);

    // Set initial canvas size
    resizeCanvas();

    // Function to get the position of the touch or mouse relative to the canvas
    function getPosition(event) {
        const rect = canvas.getBoundingClientRect(); // Get canvas position

        if (event.touches) {
            // For touch events
            return [
                event.touches[0].clientX - rect.left, 
                event.touches[0].clientY - rect.top
            ];
        } else {
            // For mouse events
            return [
                event.clientX - rect.left, 
                event.clientY - rect.top
            ];
        }
    }

    function startDraw(event) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isDrawing = true;
        [startX, startY] = getPosition(event); // Store the initial position
        [lastX, lastY] = [startX, startY]; // Initialize lastX and lastY
        minX = maxX = lastX;
        minY = maxY = lastY;

        boundingBoxInfo.classList.add('hide'); // Hide bounding box info when starting a new shape
    }

    function keepDrawing(event) {
        if (!isDrawing) return; // Only draw when the mouse is down or the screen is touched

        const [x, y] = getPosition(event);

        // Track the min and max x, y coordinates to determine the bounding box
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        ctx.beginPath();
        ctx.moveTo(lastX, lastY); // Start from the last position
        ctx.lineTo(x, y); // Draw a line to the current cursor/touch position
        ctx.stroke();

        [lastX, lastY] = [x, y]; // Update the last position
    }

    function stopDrawing() {
        isDrawing = false;

        // Bounding box calculations
        const boundingWidth = maxX - minX;
        const boundingHeight = maxY - minY;

        // Show the bounding box information
        boundingBoxInfo.classList.remove('hide');
        boxDetails.textContent = `X: ${minX}, Y: ${minY}, Width: ${boundingWidth}, Height: ${boundingHeight}`;

        // Highlight any elements in canvas-container and canvas that are within the bounding box
        highlightElementsInBoundingBox();
    }

   // Function to highlight elements within the bounding box
function highlightElementsInBoundingBox() {
    const elements = document.querySelectorAll('.canvas .shape'); // Select elements inside the .canvas container

    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect(); // Get canvas bounds

        // Check if the element is fully inside the bounding box (top-left and bottom-right corners)
        if (
            rect.left >= minX && rect.right <= maxX && // Check horizontal bounds
            rect.top >= minY && rect.bottom <= maxY    // Check vertical bounds
        ) {
            element.classList.add('highlight');
        } else {
            element.classList.remove('highlight');
            
        }

        // Optionally, display element dimensions for debugging
       // element.textContent = `X: ${rect.left}, Y: ${rect.top}, Width: ${rect.width}, Height: ${rect.height}`;
    });
}


    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('touchstart', startDraw);

    canvas.addEventListener('mousemove', keepDrawing);
    canvas.addEventListener('touchmove', keepDrawing);

    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('touchend', stopDrawing);

    canvas.addEventListener('mouseout', stopDrawing);
    
    document.querySelector('.close').addEventListener('click',()=>{
        canvas.classList.toggle('hide');
        document.querySelector(".close").classList.toggle('unlock');
    });
</script>
<script>
    var cType = "";
    controls = document.querySelectorAll("nav .rectangle, nav .text, nav .color");
    controls.forEach((control)=> {
        control.addEventListener("click",(e)=>{
            document.body.style.cursor = "move";
            cType = control.getAttribute("class");
        });
    });
    
    droppables = document.querySelectorAll(".canvas, .shape");
    
    droppables.forEach((dropMe) =>{
        setUp(dropMe);
    });

    function setUp(node){
        node.addEventListener("click",(e)=>{
            e.stopPropagation();

            if(document.body.style.cursor == "move"){
                if(cType.indexOf("color") > -1){
                    node.style.backgroundColor = document.querySelector(`nav .${cType}`).value;
                    document.body.style.cursor = "pointer";
                    return;
                }

                var clone = document.querySelector(`nav .${cType}`).cloneNode(true);
                delete clone.style.height;
                clone.style.border = "1px solid purple";
                clone.classList.remove("rectangle");
                clone.textContent = "";
                clone.style.flex = 1;
                node.append(clone);
                //node.classList.remove("shape");

                node.style.display = "flex";
                node.style.flexWrap = "wrap";
                node.style.padding = "1rem";
                clone.style.flexWrap = "wrap";
                clone.style.padding = "1rem";
                clone.style.display="flex";
                clone.classList.add("shape");
                
                
                setUp(clone);
                var cr = clone.getBoundingClientRect();
                clone.textContent = `X: ${cr.left}, Y: ${cr.top}, Width: ${cr.width}, Height: ${cr.height}`;
                document.body.style.cursor = "pointer";
            } else {
                if(e.clientX > e.target.offsetLeft + e.target.getBoundingClientRect().width/2) {
                    p = prompt("which direction", node.style.flexDirection);
                    node.setAttribute('title', p);
                    node.style.flexDirection = p;
                } else {
                    e.target.remove();
                }
            }
        });
    }
</script>

</body>
</html>

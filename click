<style>

    :root {
        --myFlex: "column";
    }
    
    nav {
        display:flex;
        flex-direction:row;
        flex:1;
        border:1px solid black;
        padding:1rem;
    }
    
    content {
        display:flex;
        flex-direction:row;
        flex:1;
        border:5px solid red;
        padding:1rem;
        min-height:50vh;
        
    }
    
    .rectangle, .text {
        border: 1px solid black;
        height:64px;
        flex:1;
        text-align:center;
        justify-content:center;
        align-items:center;
        display:flex;
    }
    
    .
    
    .drop {
        padding:1rem;
    }
    
</style>
<div class="screen">
    <nav>
        <div class="rectangle">Rectangle</div>
        <div class="text">Text Goes Here</div>
        <input type="color" class="color">
    </nav>
    <content class="canvas">
       
    </content>
</div>
<script>
    var cType = "";
    controls = document.querySelectorAll("nav .rectangle, nav .text, nav .color");
    controls.forEach((control)=> {
        control.addEventListener("click",(e)=>{
            document.body.style.cursor = "move";
            cType = control.getAttribute("class");
            //alert(cType);
        })
    })
    
    droppables = document.querySelectorAll(".canvas, .shape");
    
    droppables.forEach((dropMe) =>{
        setUp(dropMe);
 
    })
    
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
                //clone.style.backgroundColor="pink";
                //clone.style.minHeight = "200px";
                //clone.style.minWidth = "200px";
                delete clone.style.height;
                clone.style.border = "1px solid purple";
                //clone.classList.add("shape");
                clone.classList.remove("rectangle");
                clone.textContent = "";
                clone.setAttribute("title",clone.style.flexDirection)
                node.setAttribute("title",node.style.flexDirection)
                clone.style.flex = 1;
                node.append(clone);
                node.classList.remove("shape");
                
                //alert(`${node.getBoundingClientRect().height}  + ${parseInt(getComputedStyle(clone).height)}`)
                
                var newHeight =  node.getBoundingClientRect().height +   parseInt(getComputedStyle(clone).height);
                
                
                node.style.display = "flex";
             
              node.style.flexWrap = "wrap";
              node.style.padding = "1rem";
              clone.style.flexWrap = "wrap";
                clone.style.padding = "1rem";
                clone.style.display="flex";
                setUp(clone);
                document.body.style.cursor = "pointer";
                
            } else {
                if(e.clientX > e.target.offsetLeft + e.target.getBoundingClientRect().width/2) {
                p = prompt("which direction",node.style.flexDirection);
                node.setAttribute('title',p);
                node.style.flexDirection = p;
                } else {
                    e.target.remove()
                }
            }
        })
        
       
    }
</script>







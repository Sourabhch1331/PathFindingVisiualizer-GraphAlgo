
// Some Required global data....

const size=30;
let s={i:5,j:5};
let e={i:26,j:26};
let blocked=new Array(size);
for(let k=0;k<size;++k){
    blocked[k]=new Array(size);
    for(let j=0;j<size;++j){
        blocked[k][j]=0;
    }
}
let weight=new Array(size);
for(let k=0;k<size;++k){
    weight[k]=new Array(size);
    for(let j=0;j<size;++j){
        weight[k][j]=1;
    }
}
let v=new Array(size);
for(let k=0;k<size;++k){
    v[k]=new Array(size);
    for(let j=0;j<size;++j){
        v[k][j]=0;
    }
}
let speed=10;
let dr=[[1,0],[-1,0],[0,1],[0,-1]];

// selecting buttons
const bfsInput=document.getElementById('bfs-input');
const dfsInput=document.getElementById('dfs-input');
const dijstraInput=document.getElementById('dijstra-input');
const resetBotton=document.getElementById('reset-input');
const startBotton=document.getElementById('start-input');
const randomMaze=document.getElementById('randomize-maze');
const addWeightsbtn=document.getElementById('add-Weights');
const removeWeightsbtn=document.getElementById('remove-Weights');
const Info=document.getElementById('Info');
const content=document.getElementById('content');
const slow=document.getElementById('slow');
const medium=document.getElementById('medium');
const fast=document.getElementById('fast');
const cancel=document.getElementById('hide-info');

const main=()=>{
     // creating the grid
    creatGrid(s,e);
    createMaze(s,e);
    let cnt=0;
    // handling some DOM Events
    Info.addEventListener('click',()=>{
        if(cnt%2==0){
            content.classList.remove('hide');
            Info.classList.add('selected');
        }
        else{
            content.classList.add('hide');
            Info.classList.remove('selected');
        }
        ++cnt;
    });
    cancel.addEventListener('click',()=>{
        content.classList.add('hide');
        Info.classList.remove('selected');
        cnt++;
    });
    // dealing with satrt end location...
    const endCell=document.getElementById(`c${e.i},${e.j}`);
    const startCell=document.getElementById(`c${s.i},${s.j}`);
    startCell.innerHTML='<i class="fa-solid fa-dungeon"></i>';
    endCell.innerHTML='<i class="fa-solid fa-crosshairs"></i>';

    randomMaze.addEventListener('click',()=>{
        clearBoard();
        randomizeMaze();
    });

    // adding EventListners

    let currAlgo="";

    addWeightsbtn.addEventListener('click',()=>{
        addWeights();
    });
    removeWeightsbtn.addEventListener('click',()=>{
        removeweights();
        console.log('removed');
    });
    bfsInput.addEventListener('click',()=>{
        currAlgo="bfs";
        bfsInput.classList.add('selected');
        dijstraInput.classList.remove('selected');
        dfsInput.classList.remove('selected');
    });
    dfsInput.addEventListener('click',()=>{
        currAlgo="dfs";
        dfsInput.classList.add('selected');
        bfsInput.classList.remove('selected');
        dijstraInput.classList.remove('selected');
    });
    dijstraInput.addEventListener('click',()=>{
        currAlgo="dijstra";
        dijstraInput.classList.add('selected');
        bfsInput.classList.remove('selected');
        dfsInput.classList.remove('selected');
    });

    // animation speed 
    
    slow.addEventListener('click',()=>{
        speed=20;
        slow.classList.add('selected');
        fast.classList.remove('selected');
        medium.classList.remove('selected');
    });
    medium.addEventListener('click',()=>{
        speed=10;
        medium.classList.add('selected');
        slow.classList.remove('selected');
        fast.classList.remove('selected');
    });
    fast.addEventListener('click',()=>{
        speed=0;
        fast.classList.add('selected');
        slow.classList.remove('selected');
        medium.classList.remove('selected');
    });


    startBotton.addEventListener('click',()=>{
        clearBoard();
        if(currAlgo==="bfs"){
            let info=bfs(s,e);
            let path=info.path;
            let animate=info.animate; 
            path.reverse();

            // animateing bfs
            animateBfsAndPath(animate,path,e);
        }
        else if(currAlgo==="dijstra"){
            let info=Dijstra(s,e);
            let path=info.path;
            let animate=info.animate; 
            path.reverse();
            // animateing bfs
            animateBfsAndPath(animate,path,e);
        }
        else if(currAlgo==="dfs"){
            let animate=[];
            let exist=dfs(s,e,animate);
            animateDfs(animate,e,exist);
        }
        else alert('Select the algorithm first');
    });
    
}

main();

// utility functions...


// <--- Graph Algorithms --->

// Bread-First-Search     
function bfs(s,e){
    let path=[];
    let animate=[];
    if(s.i==e.i && s.j==e.j) return {animate:animate,path:path};

    // Parent matrix to keep track of
    // parent of each node pushed
    let parent=Array(size);
    let vis=Array(size);
    for(let i=0;i<size;++i){
        parent[i]=Array(size);
        vis[i]=Array(size);
        for(let j=0;j<size;++j){
            parent[i][j]=[-1,-1];
            vis[i][j]=0;
        }
    }

    // starting bfs

    let q=[];
    q.push(s);
    parent[s.i][s.j]=[0,0];
    vis[s.i][s.j]=1;
    let pathExist=0;

    while(q.length>0){
        let size=q.length;
        let done=0;

        while(size--){
            let curr=q.shift();
            animate.push([curr.i,curr.j]);
            if(curr.i==e.i && curr.j==e.j){
                done=1;
                pathExist=1;
                break;
            }
            for(let i=0;i<4;++i){
                let x=dr[i][0]+curr.i;
                let y=dr[i][1]+curr.j;
                
                if(isValid(x,y,vis)){
                    vis[x][y]=1;
                    parent[x][y]=[curr.i,curr.j];
                    q.push({i:x,j:y});
                }

            }
        }
        if(done) break;
    }

    if(!pathExist){
        return {path:path,animate:animate};
    }

    // tracing and storing path....
    let x=e.i,y=e.j;
    while(x!=s.i || y!=s.j){
        let p=parent[x][y];
        path.push(p);
        x=p[0],y=p[1];
    }
    return {path:path,animate:animate};
}


function Dijstra(s,e){
    let dr=[[1,0],[-1,0],[0,1],[0,-1]];
    let path=[];
    let animate=[];
    if(s.i==e.i && s.j==e.j) return {animate:animate,path:path};

    // Parent matrix to keep track of
    // parent of each node pushed
    let parent=Array(size);
    let dist=Array(size);
    for(let i=0;i<size;++i){
        parent[i]=Array(size);
        dist[i]=Array(size);
        for(let j=0;j<size;++j){
            parent[i][j]=[-1,-1];
            dist[i][j]=1e5;
        }
    }

    let pq=[];
    
    dist[s.i][s.j]=0;
    pq.push([[s.i,s.j],0]);
    let pathExist=0;
    while(pq.length!=0){
        pq.sort(sortByDist);

        let curr=pq.shift();
        if(curr[0][0]==e.i && curr[0][1]==e.j){
            pathExist=1;
            break;
        }
        animate.push([curr[0][0],curr[0][1]]);

        for(let i=0;i<4;++i){
            let x=dr[i][0]+curr[0][0];
            let y=dr[i][1]+curr[0][1];
            
            if(isValidDijkstra(x,y)){
                let w=weight[x][y];

                if(curr[1]+w < dist[x][y]){
                    dist[x][y]=curr[1]+w;
                    parent[x][y]=[curr[0][0],curr[0][1]];
                    pq.push([[x,y],dist[x][y]]);
                }
            }
        }
    }

    if(!pathExist){
        return {path:path,animate:animate};
    }

    // tracing and storing path....
    let x=e.i,y=e.j;
    while(x!=s.i || y!=s.j){
        let p=parent[x][y];
        path.push(p);
        x=p[0],y=p[1];
    }
    return {path:path,animate:animate};
}

function dfs(s,e,animate){
    if(s.i==e.i && s.j==e.j){
        return 1;
    }
    v[s.i][s.j]=1;
    for(let i=0;i<4;++i){
        let x=dr[i][0]+s.i;
        let y=dr[i][1]+s.j;
        
        if(isValid(x,y,v)){
            animate.push([x,y]);
            if(dfs({i:x,j:y},e,animate)){
                return 1;
            }
            animate.push([-x,-y]);
        }
    }
    return 0;
}

function sortByDist(a,b){
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}
function isValid(x,y,vis){
    return !(x<0 || y<0 || x>=size || y>=size || vis[x][y] || blocked[x][y]);
}
function isValidDijkstra(x,y){
    return !(x<0 || y<0 || x>=size || y>=size || blocked[x][y]);
}


// DOM Manupulation Function

function animateBfsAndPath(animate,path,e){
    let i=0;
    let timer=setInterval(()=>{
        
        disableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
        let currNode=animate[i++];
        if(i==animate.length){
            if(path.length==0)  alert("No path exists");
            else tracePath(path);
            unableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
            clearInterval(timer);
        }
        if(currNode[0]==e.i && currNode[1]==e.j){
            if(path.length==0)  alert("No path exists");
            else tracePath(path);
            unableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
            clearInterval(timer);
        }
        let div=document.getElementById(`c${currNode[0]},${currNode[1]}`);
        if(!div.classList.contains(`start`) && !div.classList.contains(`end`)){
            div.classList.add(`visited`);
        }
    },speed);
}
function animateDfs(animate,e,exist){
    let i=0;
    let timer=setInterval(()=>{
        disableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
        let currNode=animate[i++];
        
        if(i==animate.length){
            unableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
            clearInterval(timer);
        }
        if(currNode[0]==e.i && currNode[1]==e.j){
            unableButtons(bfsInput,dijstraInput,resetBotton,startBotton,randomMaze,addWeightsbtn,removeWeightsbtn,slow,medium,fast);
            
            clearInterval(timer);
        }

        let div=document.getElementById(`c${Math.abs(currNode[0])},${Math.abs(currNode[1])}`);
        if(currNode[0]<0 || currNode[1]<0 || (currNode[0]==0 && currNode[1]==0)){
            div.classList.remove('visited');
        }
        else if(!div.classList.contains(`start`) && !div.classList.contains(`end`)){
            div.classList.add(`visited`);
        }
    },speed);
    if(!exist) alert("No Path Exist!");
    resetBotton.addEventListener('click',()=>{
        clearBoard();
        clearInterval(timer);
    });
}
function tracePath(path){
    if(path.length==0) return;
    let i=0;
    let timer=setInterval(()=>{
        let currNode=path[i++];
        if(i==path.length) clearInterval(timer);
        if(currNode[0]==e.i && currNode[1]==e.j){
            clearInterval(timer);
        }
        let div=document.getElementById(`c${currNode[0]},${currNode[1]}`);
        if(!div.classList.contains(`start`) && !div.classList.contains(`end`)) div.classList.add(`path`);
    },10);

    resetBotton.addEventListener('click',()=>{
        clearBoard();
        clearInterval(timer);
    });
}
function creatGrid(s,e){
    for(let i=0;i<size;++i){
        for(let j=0;j<size;++j){
            let div=document.createElement("div");
            let grid=document.getElementById("grid");

            if(i==s.i && j==s.j){
                div.classList.add("start");
                div.innerHTML='<i class="fa-solid fa-dungeon"></i>';
            }
            if(i==e.i && j==e.j){
                div.classList.add("end");
                div.innerHTML='<i class="fa-solid fa-crosshairs"></i>';
            }
            div.classList.add("grid-item");
            div.id=`c${i},${j}`;
            grid.appendChild(div);
        }
    }
}
function createMaze(e,s){
    for(let i=0;i<300;++i){
        let x= Math.floor(Math.random() * size);
        let y= Math.floor(Math.random() * size);
        if((x==e.i && y==e.j) || (x==s.i && y==s.j)) continue;
        blocked[x][y]=true;
        let currCell=document.getElementById(`c${x},${y}`);
        
        currCell.classList.add('blocked');
    }
}
function addWeights(){
    for(let i=0;i<120;++i){
        let x= Math.floor(Math.random() * size);
        let y= Math.floor(Math.random() * size);
        if((x==e.i && y==e.j) || (x==s.i && y==s.j) || blocked[x][y]) continue;
        weight[x][y]=10;
        let currCell=document.getElementById(`c${x},${y}`);
        currCell.classList.add('weights');
        currCell.innerHTML='<i class="fa-solid fa-weight-hanging"></i>';
    }
}

function removeweights(){
    for(let i=0;i<size;++i){
        for(let j=0;j<size;++j){
            if((i==e.i && j==e.j) || (i==s.i && j==s.j)) continue;
            let currCell=document.getElementById(`c${i},${j}`);
            weight[i][j]=1;
            currCell.classList.remove('weights');
            currCell.innerHTML='';
            currCell.classList.remove('path');
            currCell.classList.remove('visited');
        }
    }
}

function clearBoard(){
    for(let i=0;i<size;++i){
        for(let j=0;j<size;++j){
            let currCell=document.getElementById(`c${i},${j}`);
            currCell.classList.remove('path');
            currCell.classList.remove('visited');
            v[i][j]=0;
        }
    }
}
function randomizeMaze(){
    for(let i=0;i<size;++i){
        for(let j=0;j<size;++j){
            let currCell=document.getElementById(`c${i},${j}`);
            if(blocked[i][j]){
                blocked[i][j]=0;
                currCell.classList.remove('blocked');
            }
            
        }
    }
    createMaze(s,e);
}
function disableButtons(...btns){
    btns.forEach((btn)=>{
        if(!btn.classList.contains('eventNone')) btn.classList.add('eventNone');
    });
}
function unableButtons(...btns){
    btns.forEach(btn => btn.classList.remove('eventNone'));
}
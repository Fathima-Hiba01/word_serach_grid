const grids = [
{
 w:"PHONE,LAPTOP,MOUSE,SCREEN,KEYBOARD",
 g:"XKWWENOHPY/PXDULGLIFP/MYRPFIKWOO/WYASRUZNWT/NMOCDGWMJP/NOBRRSNFQA/PUYEKNHFZL/OSEEGTJOUV/GEKNCNYKQH/SRSNJGTCFL"
},
{
 w:"APPLE,MANGO,GRAPE,LEMON,ORANGE",
 g:"ZCMLOXMXLU/XASLSGAQFN/SXDAPHNCNH/JXTTLCGSML/ELPPAQOORN/PBRTXJWTUO/ZEGAWXMAMM/BBORANGEKE/VJJDVLFHYL/PNGRAPEXRF"
},
{
 w:"TIGER,LION,HORSE,BEAR,WOLF",
 g:"NRSSIFDNIO/HDSAZDUBHR/DLENKDTSUA/UQBOOWPBDE/UDTIEOJCHB/TFILGLQGOH/TFGQWFGRRR/CXELAIUZSV/USRKAANMEZ/LEDDFXKDTA"
},
{
 w:"KERALA,INDIA,DELHI,MUMBAI,KOCHI",
 g:"KXNGJIHLED/AJZLYUPRAW/RFQKPOUELQ/AKBODDLCAG/SZKCMJKARO/AYHHUYZCEU/TQYIMJQDKZ/AJGWBSAMAN/KOYZAZDAMY/QITZINDIAC"
},
{
 w:"RIVER,OCEAN,LAKE,RAIN,CLOUD",
 g:"EYCLOUDWPI/IWSLCIMUTF/NHFQPRSTQD/EGRAINFBGZ/NAECODEDDN/RIGXFNYWRQ/RINKDIVIIZ/JHLAKEGGVA/CPGNDZVGEM/VMVDSAARRJ"
}
];

let game, selected=[], found=[], dragging=false;

function rotate(a){
    return a[0].map((_,i)=>a.map(r=>r[i]).reverse());
}

function startGame(){
    let x=grids[Math.floor(Math.random()*grids.length)];
    game={
        words:x.w.split(","),
        grid:x.g.split("/").map(r=>r.split(""))
    };

    let n=Math.floor(Math.random()*4);
    while(n--) game.grid=rotate(game.grid);

    selected=[]; found=[];
    showWords();
    showGrid();
    document.getElementById("message").textContent="";
}

function showWords(){
    wordList.innerHTML=game.words.map(w=>
        `<li id="word-${w}" class="${found.includes(w)?"found":""}">${w}</li>`
    ).join("");
}

function showGrid(){
    grid.innerHTML="";
    game.grid.forEach((row,r)=>row.forEach((letter,c)=>{
        let e=document.createElement("div");
        e.className="cell";
        e.textContent=letter;
        e.dataset.row=r;
        e.dataset.col=c;
        e.onmousedown=()=>{dragging=true;clear();pick(e)};
        e.onmouseenter=()=>dragging&&pick(e);
        e.onmouseup=finish;
        grid.appendChild(e);
    }));
}

function pick(e){
    let p={row:+e.dataset.row,col:+e.dataset.col};
    if(!selected.some(x=>x.row==p.row&&x.col==p.col)){
        selected.push(p);
        e.classList.add("selected");
    }
}

function finish(){
    if(!dragging)return;
    dragging=false;

    if(selected.length<2)return clear();

    let a=selected[0],b=selected.at(-1);
    let horizontal=a.row==b.row;
    let vertical=a.col==b.col;

    if(!horizontal&&!vertical)return clear();

    let word=selected.map(p=>game.grid[p.row][p.col]).join("");
    let reverse=[...word].reverse().join("");
    let foundWord=game.words.find(w=>w==word||w==reverse);

    if(foundWord&&!found.includes(foundWord)){
        found.push(foundWord);
        selected.forEach(p=>{
            document.querySelector(
                `.cell[data-row="${p.row}"][data-col="${p.col}"]`
            ).className="cell found";
        });
        document.getElementById("word-"+foundWord).classList.add("found");
    }

    clear();

    if(found.length==game.words.length)
        message.textContent="Congratulations! You found all the words!";
}

function clear(){
    document.querySelectorAll(".selected")
        .forEach(e=>e.classList.remove("selected"));
    selected=[];
}

document.addEventListener("mouseup",()=>dragging=false);
startGame();

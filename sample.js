const arr = ()=> {
setImmediate(()=> console.log("imm 1"));
setTimeout(()=>console.log("timeout 2"),2);
setImmediate(()=> console.log("imm 2"));
setTimeout(()=>console.log("timeout 1"),100);
setTimeout(()=>console.log("timeout 3"),3);
setTimeout(()=>console.log("timeout 4"),4);
}
setImmediate(()=> console.log("imm 3"));
setImmediate(()=> console.log("imm 4"));
console.log(arr());
console.log("plain console log will be given more priority");
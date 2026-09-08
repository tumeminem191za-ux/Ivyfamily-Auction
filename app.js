let data=[];
function add(){
 let x={name:name.value,item:item.value,page:page.value,piece:piece.value};
 data.push(x);render();
}
function render(){
 list.innerHTML=data.map(x=>`${x.name} | ${x.item} | ${x.page} | ชิ้น ${x.piece}`).join('<br>');
}
function wheel(){
 let target=prompt('ใส่ชื่อไอเทมที่จะหมุน');
 let a=[...new Set(data.filter(x=>x.item==target).map(x=>x.name))];
 if(a.length<2){result.innerHTML='ไม่มีการแย่ง';return}
 let w=a[Math.floor(Math.random()*a.length)];
 result.innerHTML='ผู้ได้สิทธิ์: '+w;
}

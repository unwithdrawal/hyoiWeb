var userflag = 0 //事前にuserflagを初期値（0）にしておきたい

document.getElementById("配信を始める").onclick = function() {
  document.getElementById.innerHTML = (userflag = 1);
};
<input type="button" value="(配信)" onclick="(userflag = 1)"/>//「配信を始める」ボタンを押したらuserflagを1に上書き
//ユーザーの位置情報をマップに落とし込み

//「配信を見る」ボタンを押したらuserflagは0で維持（操作なし）
<input type="button" value="(見る)" onclick="(location.assign('http://マップのページ.com');)"/>
//マップのページへ遷移する

//選択されたピンの情報（phpを参照）を取得し、roomNameに渡す
var roomName = document.getElementById('value');
var roomNames = JSON.parse(item.dataset.fruit);

//ルームに入るタイミングで、userflagの値を判定して切り替え
if( userflag = 1){　
    room = peer.joinRoom('mesh_multi_' + roomName,{stream; localstream});
}else if( userflag = 0){
    room = peer.joinRoom("roomName", {mode: 'mesh'})
}

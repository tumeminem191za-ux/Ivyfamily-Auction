<!doctype html>
<html lang="th">

<head>

<meta charset="utf-8">

<title>Ivyfamily Admin</title>

<style>

body{
font-family:sans-serif;
background:#101010;
color:white;
padding:20px
}

.card{
background:#222;
padding:15px;
border-radius:12px;
margin:12px 0
}

button,input{
padding:10px;
margin:5px
}

</style>

</head>


<body>


<h1>Ivyfamily Admin</h1>


<div class="card">


<h3>เข้าสู่ระบบ</h3>


<input id="pass" placeholder="รหัสแอดมิน">


<button onclick="login()">
เข้า
</button>


</div>




<div id="admin" style="display:none">


<div class="card">


<h3>จัดการประมูล</h3>


<button onclick="wheel()">
หมุนวงล้อ
</button>


<button onclick="clearAll()">
ล้างรายชื่อ
</button>


<h2 id="result"></h2>


</div>


</div>



<script type="module" src="admin.js"></script>


</body>

</html>

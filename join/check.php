<?php
session_start();
require('../dbconnect.php');

if (!isset($_SESSION['join'])) {
	header('Location: mode.php');
exit();
}
if (!empty($_POST["SignUp"])) {
	// 登録処理をする
	$u_name = $_SESSION['join']['name'];
	$u_mail = $_SESSION['join']['mail'];
	$u_password = sha1($_SESSION['join']['password']);
	$u_image = $_SESSION['join']['image'];
	
	$statement = $pbo->prepare("INSERT INTO users SET name=$u_name,mail,=$u_password,password=$u_password,picture=$u_image");
	$statement->execute();
	unset($_SESSION['join']);
	header('Location: thanks.php');
	exit();
	}

?>
<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>hyoi</title>

	<link rel="stylesheet" href="../style.css" />
</head>

<body>
<div id="wrap">
  <div id="head">
    <h1>会員登録</h1>
  </div>
  <div id="content">
		<form action="" method="post">
			<input type="hidden" name="action" value="submit" />
		<dl>
		<dt>ニックネーム</dt>
		<dd>
			<?php echo htmlspecialchars($_SESSION['join']['name'], ENT_QUOTES,'UTF-8'); ?>
		</dd>
		<dt>メールアドレス</dt>
		<dd>
			<?php echo htmlspecialchars($_SESSION['join']['mail'], ENT_QUOTES,'UTF-8'); ?>
		</dd>
		<dt>パスワード</dt>
		<dd>
		【表示されません】
		</dd>
		<dt>写真など</dt>
		<dd>
			<img src="../user_picture/<?php echo htmlspecialchars($_SESSION['join']['image'], ENT_QUOTES, 'UTF-8'); ?>" width="100" height="100" alt="" />
		</dd>
		</dl>
		<div><a href="index.php?action=rewrite">&laquo;&nbsp;書き直す</a> | <input
		type="submit" id="SignUp" name="SignUp" value="登録する" /></div>
		</form>
  </div>

</div>
</body>
</html>

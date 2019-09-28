<?php
session_start();
require('dbconnect.php');
if (isset($_SESSION['id']) && $_SESSION['time'] + 3600 > time()) {
	// ログインしている
	$_SESSION['time'] = time();
	$abatars = $db->prepare('SELECT * FROM abatars WHERE id=?');
	$abatars->execute(array($_SESSION['id']));
	$abatar = $abatars->fetch();
} else {
	// ログインしていない
	header('Location: login.php');
  exit();
}

//投稿を記録する
if (!empty($_POST)) {
	if ($_POST['message'] != '') {
		$message = $db->prepare('INSERT INTO aposts SET member_id=?, message=?,created=NOW()');
		$message->execute(array(
			$abatar['id'],
			$_POST['message']
		));
		header('Location: index.php'); exit();
	}
}

//投稿を取得する
$aposts = $db->query('SELECT abatars.name, abatars.picture, aposts.* FROM abatars , aposts  WHERE abatars.id=aposts.member_id ORDER BY aposts.created DESC');
?>
<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>ひとこと掲示板</title>

	<link rel="stylesheet" href="style.css" />
</head>

<body>
<div id="wrap">
  <div id="head">
    <h1>ひとこと掲示板</h1>
  </div>
  <div id="content">
		<form action="" method="post">
		<dl>
			<dt><?php echo htmlspecialchars($abatar['name'], ENT_QUOTES, 'UTF-8'); ?>さん、メッセージをどうぞ</dt>
		<dd>
		<textarea name="message" cols="50" rows="5"></textarea>
		</dd>
		</dl>
		<div>
		<input type="submit" value="投稿する" />
		</div>
		</form>

		<p><a href="./logout.php">ログアウト</a></p>

<?php
foreach ($aposts as $apost ):
 ?>
    <div class="msg">
      <img src="member_picture/<?php echo htmlspecialchars($apost['picture'], ENT_QUOTES, 'UTF-8'); ?>" width="48" height="48" alt="<?php echo htmlspecialchars($apost['name'], ENT_QUOTES); ?>" />
			<p><?php echo htmlspecialchars($apost['message'], ENT_QUOTES, 'UTF-8');?><span class="name">（<?php echo htmlspecialchars($apost['name'], ENT_QUOTES, 'UTF-8'); ?>）</span></p>
			<p class="day"><?php echo htmlspecialchars($apost['created'], ENT_QUOTES, 'UTF-8'); ?></p>
		</div>
		<?php
		endforeach;
		?>
  </div>

</div>
</body>
</html>

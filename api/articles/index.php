<?php
ini_set('date.timezone','Asia/Shanghai');

$rss = new SimpleXMLElement(file_get_contents('./rss.xml'));
$xpath = '/rss/channel/item';
$items = $rss->xpath($xpath);
if ($items) {
  $output = array();
  foreach ($items as $id => $item) {
    $pubdate = strtotime(strval($item->pubDate));
    $output[] = array(
      'id' => $id + 1,
      'headline' => strval($item->title),
      'date' => date('Y年m月d日',$pubdate),
      'body' => strval($item->description),
      'author' => strval($item->children('http://purl.org/dc/elements/1.1/')->creator)
    );
  }
}

echo json_encode($output);
<?php
header('Content-Type: application/json; charset=utf-8');

$url = "https://en.wikipedia.org/api/rest_v1/page/random/summary";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	"User-Agent: RandomWikiArticleApp/1.0"
]);
curl_setopt($ch, CURLOPT_CAINFO, __DIR__ . "/cacert-2025-09-09.pem");
$response = curl_exec($ch);

if (curl_errno($ch)) {
	echo json_encode(["error" => "Curl error: " . curl_error($ch)]);
	exit;
}

$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode !== 200 || !$response) {
	echo json_encode(["error" => "Wikipedia API error, HTTP code $httpcode"]);
	exit;
}

echo $response;

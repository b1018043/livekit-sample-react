### Livekit-sample
Livekit-serverとかで遊んでみたやつ
## 操作
```
npm i
npm run start
```
上のコードを実行後、http://localhost:3000 にアクセス
左からroom名とユーザ名を記入 (動作を確認したところ、ユーザ名の被りはNGっぽい)
token取得時にはCORSに引っ掛かる場合があるので実験環境での利用の際はpackage.jsonにproxyの項目を追加してあげること。

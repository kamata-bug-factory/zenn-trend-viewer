Zennのトレンド記事をブラウザのツールバーから確認できるChrome拡張を作りたい。
著者、記事タイトル、投稿日時、タグ、LGTM数を表示する。

トレンド記事は以下のAPIを使って取得する。
- Tech: `https://zenn.dev/api/articles?order=daily&article_type=tech`
- Idea: `https://zenn.dev/api/articles?order=daily&article_type=idea`

[qiita-trend-viewer](https://github.com/kamata-bug-factory/qiita-trend-viewer) に合わせて、表示対象はTech, Ideaそれぞれ10件とする。
一度取得した記事情報はブラウザのストレージにキャッシュ保存し、有効期限を3時間とする。

UIはqiita-trend-viewerと同様で、ヘッダーにTechとIdeaを切り替えるトグルを追加する。
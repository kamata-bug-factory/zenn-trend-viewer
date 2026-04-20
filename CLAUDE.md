# zenn-trend-viewer

## プロジェクト概要

Zennのトレンド記事をブラウザのツールバーから確認できるChrome拡張機能。
ヘッダーのトグルで Tech / Idea を切り替えて表示する。
詳細な仕様は `docs/SPEC.md` を参照。

## 技術スタック

- **言語:** TypeScript（strict mode）
- **UI:** React 19 + Vite
- **UIライブラリ:** shadcn/ui + Tailwind CSS v4
- **Chrome拡張:** Manifest V3
- **ビルド:** Vite（CRXJS Vite Plugin で Chrome拡張向けにビルド）

## プロジェクト構成

```
src/
├── popup/           # ポップアップUI（エントリポイント）
│   ├── main.tsx
│   ├── App.tsx
│   └── components/  # ポップアップ固有のコンポーネント（ArticleCard, CategoryToggle など）
├── components/      # 共有UIコンポーネント（shadcn/ui）
├── lib/             # ユーティリティ
├── hooks/           # カスタムフック（useArticles など）
├── services/        # 外部通信・データ取得ロジック
│   └── api.ts       # Zenn API クライアント（Tech / Idea）
├── storage/         # chrome.storage のラッパー
│   └── cache.ts     # 記事キャッシュ管理（Tech / Idea を別キーで保持）
└── types/           # 型定義
public/
├── manifest.json    # Chrome拡張マニフェスト（Manifest V3）
└── icons/           # 拡張機能アイコン
```

## 開発コマンド

```bash
npm install          # 依存インストール
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLint 実行
npm run typecheck    # 型チェック
```

## 開発ワークフロー

1. `npm run build` でビルド
2. Chrome で `chrome://extensions` を開く
3. 「デベロッパーモード」を有効化
4. 「パッケージ化されていない拡張機能を読み込む」から `dist/` を選択

## コーディング規約

- 関数コンポーネントと hooks を使用（クラスコンポーネント不可）
- 状態管理は React hooks で完結させる（外部状態管理ライブラリ不要）
- `chrome.storage` へのアクセスは `src/storage/` のラッパー経由で行う
- API通信は `src/services/` に集約する
- 型定義は `src/types/` に集約する
- コード・コメントは英語、ドキュメントは日本語で記述する

## アーキテクチャ上の判断

- **表示件数10件制限:** Zenn API のレスポンスから上位10件のみ表示。[qiita-trend-viewer](https://github.com/kamata-bug-factory/qiita-trend-viewer) と件数を揃える方針
- **認証不要:** Zenn API はトークン不要で記事一覧・タグ・LGTM数まで1回のリクエストで取得できるため、トークン登録フォームは持たない
- **キャッシュ:** `chrome.storage.local` に記事情報を保存、有効期限3時間。Tech / Idea を別キーで保持し、トグル切替時もキャッシュを優先
- **Tech / Idea トグル:** ヘッダーにトグルを配置し、選択中カテゴリの記事一覧を表示する。初期表示は Tech

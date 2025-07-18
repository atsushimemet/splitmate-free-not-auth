# SplitMate クイックデプロイ手順

現在のSplitMateは**フロントエンドのみ**でlocalStorageを使用するため、**Netlifyのみ**でデプロイ可能です。

## 🚀 Netlifyデプロイ（5分で完了）

### 1. 事前準備
```bash
# ビルド確認
cd frontend
npm install
npm run build
```

### 2. Netlifyでデプロイ

1. **[Netlify](https://www.netlify.com/)**にGitHubでサインアップ
2. **"New site from Git"** をクリック
3. **GitHubリポジトリ**を選択
4. **ビルド設定**:
   ```
   Build command: npm run build
   Publish directory: frontend/dist
   Base directory: frontend
   ```
5. **"Deploy site"** をクリック

### 3. 完了！

- デプロイURL: `https://[site-name].netlify.app`
- 設定ファイル: `netlify.toml`（自動設定済み）
- SPA対応: `frontend/public/_redirects`（自動設定済み）

## ✅ 動作確認

- [ ] ルートアクセスで識別子付きURLに自動リダイレクト
- [ ] 費用入力・編集・削除
- [ ] 精算管理・承認
- [ ] 精算サマリー・LINE共有
- [ ] 異なる識別子でのデータ分離

## 🔧 カスタムドメイン（オプション）

1. **Site settings** → **Domain management**
2. **Add custom domain**
3. **DNS設定**を更新

---

> **注意**: 現在はlocalStorageベースのため、**バックエンド不要**です。
> 詳細な手順は [`deployment-guide.md`](./deployment-guide.md) を参照してください。 

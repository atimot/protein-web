# 環境構築
#### ビルド
```
docker compose build
```

#### ホスト側にnode_modulesをインストール
ローカルで開発する際、node_modulesがないと参照エラーが発生してしまう
また、docker-compose.yml でボリュームをマウントするときにホスト側のnode_moduleが空だとコンテナ側のnode_moduleも空で上書きしてしまう
```
docker compose run --rm node npm install
```

#### 開発
```
docker compose up -d
```

#### ブラウザで確認
http://localhost:5173

## データベースマイグレーション

#### マイグレーション実行
```
docker compose exec app go run cmd/migrate/main.go -action=up
```

#### マイグレーション状態確認
```
docker compose exec app go run cmd/migrate/main.go -action=status
```

#### マイグレーションロールバック
```
docker compose exec app go run cmd/migrate/main.go -action=down
```

#### 新しいマイグレーション追加
`backend/migrations/` ディレクトリに以下の命名規則でファイルを作成：

```
XXX_description.up.sql   # マイグレーション実行用
XXX_description.down.sql # ロールバック用
```

例：
```
002_create_products_table.up.sql
002_create_products_table.down.sql
```

- **XXX**: 3桁の連番（001, 002, 003...）
- **description**: マイグレーションの説明（スネークケース）
- **up.sql**: テーブル作成・カラム追加などの変更
- **down.sql**: up.sqlの変更を元に戻す処理

## Tips
#### コンテナの中に入りたいとき
```
docker compose exec node bash
```

#### Storybookでコンポーネントを確認したいとき
コンテナの中に入って
```
npm run storybook
```

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

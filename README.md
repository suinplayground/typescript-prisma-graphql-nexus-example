# TypeScript + Prisma + Graphql Nexus Example

このサンプルアプリケーションは GraphQL Nexus を用いて GraphQL エンドポイントを提供する方法を例示するものです。

このサンプルアプリケーションは次の技術スタックを使用します:

- [**Apollo Server**](https://github.com/apollographql/apollo-server): GraphQL API の HTTP サーバー
- [**GraphQL Nexus**](https://nexusjs.org/docs/): GraphQL のスキーマ定義とリゾルバーの実装
- [**Prisma Client**](https://www.prisma.io/docs/concepts/components/prisma-client): データベースへのアクセス(ORM)
- [**Prisma Migrate**](https://www.prisma.io/docs/concepts/components/prisma-migrate): データベースのマイグレーション
- [**SQLite**](https://www.sqlite.org/index.html): データベース

このサンプルアプリケーションは、次のような「請求」を例題とした API を提供します:

```graphql
"""
請求
"""
type Invoice {
  billingDate: DateTime!
  id: Int!
  items: [InvoiceItem!]!
  total: Int!
}

"""
請求明細
"""
type InvoiceItem {
  id: Int!
  name: String!
  price: Int!
  quantity: Int!
  total: Int!
}

type Mutation {
  createInvoice(data: CreateInvoiceInput!): Invoice!
}

type Query {
  allInvoices: [Invoice!]!
}

input CreateInvoiceInput {
  billingDate: DateTime!
  items: [CreateInvoiceItemInput!]!
}

input CreateInvoiceItemInput {
  name: String!
  price: Int!
  quantity: Int!
}
```

## サンプルの起動方法

### 1. コードの入手

コードをダウンロードする:

```
git clone git@github.com:suinplayground/typescript-prisma-graphql-nexus-example.git --depth=1
```

パッケージをインストールする:

```bash
# おすすめはPNPMを使う
pnpm install
# or
yarn install
# or
npm install
```

### 2. データベースの準備

データベースを作る:

```bash
npx prisma migrate dev --name init --preview-feature
```

初期データ(seed)をデータベースに入れる:

```bash
npx prisma db seed --preview-feature
```

### 3. GraphQL サーバーを起動する

```bash
npm run dev
```

起動したら[http://localhost:4000](http://localhost:4000)にアクセスする。

## 使い方

### 請求をすべて取得する

登録されている請求をすべて取得するには次の GraphQL を実行します:

```graphql
{
  allInvoices {
    id
    billingDate
    total
    items {
      id
      name
      price
      quantity
      total
    }
  }
}
```

### 請求を作成する

新たに請求を登録するには次の GraphQL を実行します:

```graphql
mutation {
  createInvoice(
    data: {
      billingDate: "2021-02-28T00:00:00Z"
      items: [
        { name: "ランディングページ制作", price: 300000, quantity: 1 }
        { name: "マーケティング", price: 1000000, quantity: 1 }
      ]
    }
  ) {
    id
    total
    billingDate
    items {
      id
      price
      quantity
      total
    }
  }
}
```

### schema.prisma を更新したとき

schema.prisma を更新したときは下記のようなコマンドでマイグレーションを実行してください。

```bash
npx prisma migrate dev --name $変更名 --preview-feature
```

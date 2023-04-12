## 概要

Next.jsとFirebaseの自分用のサンプルで、ハマりどころをあらかじめ解決しています。  
時間が経つと忘れてしまうのと、どうせどのアプリでも同じようなことをするので都度調べるコストが高いからです。
  
使い方はdocker-compose upで起動するだけです。  
正しいかどうかは置いておいて、Functions側はオニオンアーキテクチャを意識しています。  
なので基本的にインターフェースを切って、抽象クラスへの依存を行っています。

## 要点など

### あらかじめFunctionsを分割
1つのfunctionに含まれるコード量が多くなればなるほど、functions実行時のオーバーヘッドが大きくなるので分割しています。  
また、リージョンをasia-northeast1に指定することで、実行速度が向上します。  
```typescript
export const auth = functions
  .region('asia-northeast1')
  .https
  .onRequest((request, response) => {
    ...
  })
```

### Functionsでのexpressフレームワークを使用可能
expressを組み込んでいるのでルーティングが使えます。  
以下のようにパスを増やしていくと、世間一般のMVCフレームワークにある `[Controller名]/[Method名]` のような感覚で呼び出せます。
```typescript
export const auth = functions
  .region('asia-northeast1')
  .https
  .onRequest((request, response) => {
    const homePresenter = new HomePresenter()
    app.post('/', async (req, res) => await homePresenter.home(req, res))
    app.post('/hoge', async (req, res) => await homePresenter.home(req, res))
    app(request, response)
  })
```

### CORS問題の対応済み
expressを組み込んでいるのでcorsの設定を渡せば完了です。
```typescript
app.use(
  cors({
    origin: [process.env.FRONT_URL],
    methods: 'GET, POST, OPTIONS',
    allowedHeaders: 'Authorization, Accept, Content-Type, Cookie',
    maxAge: 3600,
    credentials: true,
    optionsSuccessStatus: 204,
  })
)
```

### FunctionsでCookieが使用できるように対応済み
- corsでCookieやcredentialsを許可する必要あり
- フロント側でwithCredentialオプションをtrueにしてリクエストを送る必要あり
- クロスドメイン下でCookieを発行できる必要あり
  
など、考慮する点が多いのですが、あらかじめ対応しています。
```typescript
// リクエスト箇所
return axios.request({
  method: request.getMethod(),
  url: request.getUrl(),
  params: request,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
})
```
```typescript
// クッキー発行
response.cookie(cookieName, jwt, {
  maxAge: new Date().getTime() + 1000 * 60 * 60 * 24 * 1,
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  path: '/',
})
```

### Authentication/Storage/Firestore連携済み
エミュレーターを使用しているので、エミュレーター接続用のクライアントが用意されています。
[firebase.client.ts](https://github.com/Kate-AC/firebase-architecture-template/blob/main/functions/src/infrastructure/firebase/firebase.client.ts)を参照してください。

### GithubActions構築済み
[.github/workflows/config.yml](https://github.com/Kate-AC/firebase-architecture-template/blob/main/.github/workflows/config.yml)を参照してください。  
サンプルではstagingブランチにプッシュすればデプロイされます。  
環境変数はGitのActions secrets and variablesに設定してください。

### Webpack設定済み
webpackが5系になり、TypeScriptからFunctionsで動くjsに変換するまでにいろいろ面倒になりましたが構築済みです。  
何が大変だったかはあまり覚えていませんが、多分このあたりを自動で解決してくれなくなったことだと思います。
```js
alias: {
    "crypto": require.resolve("crypto-browserify"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "assert": require.resolve("assert/")
},
 ```
 
 また注意点として、クラスのstaticメソッドを使いたい場合はそのクラスをwebpackにあらかじめ指定する必要があります。  
 ここは結構ハマりポイントでした。いい解決方法ないかな。
 ```js
 externals: [
  nodeExternals({
      allowlist: [
        'util/log' // これ
      ],
      importType: "node-commonjs",
    }),
],
```
書いててうっすら思い出してきましたが、Webpack5でTypesciptES5の記述をCommonJSに変換するのはクソ面倒ということです。

### jest環境構築済み
雑にプッシュしたので未確認です。  
[firebase.test.client.ts](https://github.com/Kate-AC/firebase-architecture-template/blob/main/functions/test/infrastructure/firebase.test.client.ts)では、テストが並列で実行されるので、  
クライアントを作成する度に別のプロジェクトIDを割り振って、エミュレーター内部での接続先を論理的に分けています。   
また、firestore.rulesやstorage.rulesがテストで邪魔になるケースがあるので、一括で全部許可しています。

### Firestore/Storage接続用リポジトリ用意済み
[firebase.repository.ts](https://github.com/Kate-AC/firebase-architecture-template/blob/main/functions/src/infrastructure/firebase/firebase.repository.ts)を参照してください。  
このクラスではrefやcollectionの参照を取得するという役割を持っています。

### Firestoreでのトランザクションを簡易化する仕組み導入済み
[firestore.transactionable.repository.ts](https://github.com/Kate-AC/firebase-architecture-template/blob/main/functions/src/infrastructure/firebase/firestore.transactionable.repository.ts)を参照してください。  
Firestoreでのトランザクションは、MySQLでforUpdateでロックしておくようなイメージで、  
トランザクション対象のドキュメントのIDをあらかじめ指定する必要があるので、  
トランザクションを使っていくのであれば最初からリポジトリやエンティティ周りの設計を先に考えないとカオスが待ち受けるでしょう。

このサンプルでは以下のように書くことができます。  

```typescript
return await this.firebaseRepository.beginTransaction<User>(async () => {
  await this.userRepository.save(user)
  await this.ownerRepository.save(owner)
  return user
})
```
saveメソッドの中身は以下のようになっています。  
トランザクション中ならsetDocではなく、トランザクション用のsetを呼んでいます。 
```typescript
async save(user: User): Promise<void> {
  const ref = this.userRef(user.uuid)
  const userJson = JSON.parse(JSON.stringify(new UserVO(user)))

  if (this.intoTransaction()) {
    this.getTransaction().set(ref, userJson)
    return
  }

  await setDoc(ref, userJson)
}
```

仕組みとしては単純で、トランザクションオブジェクトをstaticで持つことで、  
どの階層からでも同じトランザクションを呼んだり、トランザクション中かを判断しています。  
~詳しく検証したわけではないので弊害があるかもしれんけどテスト書いて担保しろ~  
~それかFirestoreのドキュメント設計を見直してそもそもトランザクションを乱発するな~  
~そんなに整合性が大事ならRDBを使え~
```typescript
export class FirestoreTransactionableRepository implements FirestoreTransactionableRepositoryInterface {
  static transaction: Transaction = null
  ...
}
```

### ログイン機能のサンプル導入済み
docker-compose up後に `http://localhost:51001` にアクセスして、ログインボタンを押せばhomeに飛ぶ挙動を確認できます。  
Cookieがないとトップに戻されます。

### SWRサンプル導入済み
[home.page.tsx](https://github.com/Kate-AC/firebase-architecture-template/blob/main/app/presenter/pages/home.page.tsx)にて使用例を書いています。  
ついでに既にカスタムフックになっています。  
[use.call.api.tsx](https://github.com/Kate-AC/firebase-architecture-template/blob/main/app/presenter/hooks/use.call.api.tsx)を参照して下さい。

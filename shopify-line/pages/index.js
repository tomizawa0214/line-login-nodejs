import { Page, Button, Card } from '@shopify/polaris'
import store from 'store-js'

function Index() {
  const line_notify_url = 'https://76b113c34e18.ngrok.io/line-notify'
  // const token = store.get('token')

  const handleConnect = (e) => {
    e.preventDefault()
    window.parent.location.href = line_notify_url
  }

  const handleDisConnect = (e) => {
    e.preventDefault()
    window.parent.location.href = line_notify_url
    // store.clearAll()
  }

  // console.log('token', token)

  return (
    <Page>
      <Card title="LINE連携" sectioned>
        <p>
          LINE Notify
          のサイトで認証を行って下さい。認証すると注文が発生する都度LINE
          に通知されます。
        </p>
        <Button primary type="submit" onClick={handleConnect}>
          接続する
        </Button>

        {/* {token ? (
          <Button primary type="submit" onClick={handleConnect}>
            接続する
          </Button>
        ) : (
          <Button primary type="submit" onClick={handleDisConnect}>
            切断する
          </Button>
        )} */}
      </Card>

      {/* <div class="Polaris-Page">
        <div class="Polaris-Page__Content">
          <div class="Polaris-Layout">
            <div class="Polaris-Layout__AnnotatedSection">
              <div class="Polaris-Layout__AnnotationWrapper">
                <div class="Polaris-Layout__Annotation">
                  <div class="Polaris-TextContainer">
                    <h2 class="Polaris-Heading">LINE に通知</h2>
                    <div class="Polaris-Layout__AnnotationDescription">
                      <p>注文が発生する都度 LINE に通知されます。</p>
                    </div>
                  </div>
                </div>
                <div class="Polaris-Layout__AnnotationContent">
                  <div class="Polaris-Card">
                    <div class="Polaris-Card__Section">
                      <div class="Polaris-Card">
                        <div class="Polaris-Card__Section">
                          <div class="Polaris-SettingAction">
                            <div class="Polaris-SettingAction__Setting">
                              <div class="Polaris-Stack">
                                <div class="Polaris-Stack__Item">
                                  <span
                                    aria-label="Avatar"
                                    role="img"
                                    class="Polaris-Avatar Polaris-Avatar--sizeMedium Polaris-Avatar--styleOne"
                                  >
                                    <span class="Polaris-Avatar__Initials">
                                      <svg
                                        class="Polaris-Avatar__Svg"
                                        viewBox="0 0 40 40"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M8.28 27.5A14.95 14.95 0 0120 21.8c4.76 0 8.97 2.24 11.72 5.7a14.02 14.02 0 01-8.25 5.91 14.82 14.82 0 01-6.94 0 14.02 14.02 0 01-8.25-5.9zM13.99 12.78a6.02 6.02 0 1112.03 0 6.02 6.02 0 01-12.03 0z"
                                        ></path>
                                      </svg>
                                    </span>
                                  </span>
                                </div>
                                <div class="Polaris-Stack__Item Polaris-Stack__Item--fill">
                                  <div class="Polaris-AccountConnection__Content">
                                    <div>LINE Notify</div>
                                    <div>
                                      <span class="Polaris-TextStyle--variationSubdued">
                                        接続済
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="Polaris-SettingAction__Action">
                              <button class="Polaris-Button" type="button">
                                <span class="Polaris-Button__Content">
                                  <span class="Polaris-Button__Text">
                                    切断する
                                  </span>
                                </span>
                              </button>
                            </div>
                          </div>
                          <div class="Polaris-AccountConnection__TermsOfService">
                            <div>
                              <p>
                                通知先をグループ LINE に設定している場合は、LINE
                                アプリから そのグループへ「LINE
                                Notify」を招待してください。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <Link url="https://76b113c34e18.ngrok.io/line-notify">接続する</Link> */}
      {/* <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__AnnotatedSection">
            <div class="Polaris-Layout__AnnotationWrapper">
              <div class="Polaris-Layout__Annotation">
                <div class="Polaris-TextContainer">
                  <h2 class="Polaris-Heading">LINE に通知</h2>
                  <div class="Polaris-Layout__AnnotationDescription">
                    <p>
                      LINE Notify
                      のサイトで認証を行って下さい。認証すると注文が発生する都度
                      LINE に通知されます。
                    </p>
                  </div>
                </div>
              </div>
              <div class="Polaris-Layout__AnnotationContent">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Section">
                    <div class="Polaris-Card">
                      <div class="Polaris-Card__Section">
                        <div class="Polaris-SettingAction">
                          <div class="Polaris-SettingAction__Setting">
                            <div class="Polaris-Stack">
                              <div class="Polaris-Stack__Item Polaris-Stack__Item--fill">
                                <div class="Polaris-AccountConnection__Content">
                                  <div>LINE Notify</div>
                                  <div>
                                    <span class="Polaris-TextStyle--variationSubdued">
                                      未接続
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="Polaris-SettingAction__Action">
                            <button
                              class="Polaris-Button Polaris-Button--primary"
                              type="button"
                            >
                              <span class="Polaris-Button__Content">
                                <span class="Polaris-Button__Text">
                                  接続する
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                        <div class="Polaris-AccountConnection__TermsOfService">
                          <div>
                            <p>
                              <strong>接続する</strong> をクリックすると LINE
                              Notify
                              の設定ページに遷移します。遷移後、以下の操作で
                              LINE との接続処理が完了します。
                            </p>
                            <p>
                              <ul>
                                <li>
                                  LINE に登録済のメールアドレスで認証を行う。
                                </li>
                                <li>
                                  通知を受け取りたいトークルームを選択する。
                                </li>
                              </ul>
                            </p>
                            <p>
                              なお、ご利用にはメールアドレスが登録済でログイン許可済の
                              LINE アカウントが必要です。
                            </p>
                            <p>
                              LINE
                              アカウントへのメールアドレス登録・ログイン許可については
                              LINE の公式の
                              <a
                                href="https://guide.line.me/ja/account-and-settings/account-and-profile/set-email-address.html"
                                target="_blank"
                              >
                                使い方ガイド
                              </a>
                              を参照して下さい。
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
    </Page>
  )
}

export default Index

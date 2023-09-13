import Head from "next/head";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="./favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
      </Head>
      <section>
        <header
          style={{
            paddingLeft: "2rem",
            paddingRight: "2rem",
            boxSizing: 'border-box',
            justifyContent: "space-between",
            display: "flex",
            position: "fixed",
            top: 0,
            width: "100%",
          }}
          className="blog-header"
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "2.25rem",
              padding: "1rem 0",
              margin:0
            }}
          >
            <Link href="/">ChrisSong Blog</Link>
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "20rem",
            }}
          >
            <Link href="/">首页</Link>
            <Link href="/archives">归档</Link>
            <Link href="/about">关于</Link>
            <Link
              href="https://github.com/ChrisSong1994"
              target="__blank"
              
            >
              <svg
                height="28"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                width="28"
                data-view-component="true"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </Link>
          </div>
        </header>
        <main
          className="blog-content"
          style={{
            minHeight: "calc(100vh - 115px)",
            paddingTop: "1.5rem",
            margin: "0 auto",
            marginTop: 75,
            maxWidth: "64rem",
          }}
        >
          {children}
        </main>
        <footer
          className="blog-footer"
          style={{
            textAlign: "center",
            paddingTop: "0.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          Copyright © 2023 ChrisSong
        </footer>
      </section>
    </>
  );
};

export default Layout;

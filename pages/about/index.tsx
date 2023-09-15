import Layout from "components/layout";

export default function About() {
  return (
    <Layout>
      <section
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
        }}
      >
        <p
          style={{
            marginBottom: "1rem",
            textIndent: 8,
          }}
        >
          大家好，我是
          ChrisSong，是一个梦想成为独立开发者的前端工程师，目前在尝试做一些有趣的事情以及技术积累，我想在这里把自己的想法和沉淀记录下来。对我有兴趣的朋友可以通过我的邮箱{" "}
          <b>18557511748@163.com</b> 联系我。
        </p>
        <ul className="list-disc">
          <li>
            <a href="https://www.91ape.net" target="__blank">
              🦍 猿简历
            </a>
            : 简历制作工具，所见即所得的编辑体验；
          </li>
          <li>
            <a href="https://github.com/ChrisSong1994/developer-assistant">
              🔧 开发者工具
            </a>
            : 一个常用开发工具集客户端，包含了常用的 json
            解析处理、颜色拾取转换、编码、文本 diff 等工具；
          </li>
        </ul>
      </section>
    </Layout>
  );
}

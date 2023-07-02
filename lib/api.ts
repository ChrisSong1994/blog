import fs from "fs-extra";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(process.cwd(), "_posts");
const publicDirectory = join(process.cwd(), "public");
const postsListJsonPath = join(publicDirectory, "postsList.json");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: string[] = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  // // 这里创建索引信息存在根目录提供静态站点搜索
  // fs.writeJson(postsListJsonPath, posts);

  return posts;
}

export function getPostsByTag(fields: string[], tag: string) {
  const posts = getAllPosts(fields)
    .filter(({ tags }) => tags.includes(tag))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

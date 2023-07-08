import { BlogPost, Meta } from "@/types";
import axios from "axios";

type FileTree = {
  tree: [
    {
      path: string;
    }
  ];
};

export async function getPostsByFilename(
  fileName: string
): Promise<BlogPost | undefined> {
  const res = await axios.get(`${process.env.API_URL}/posts/${fileName}`);

  if (res.status != 200) {
    return undefined;
  }

  const rawMDX = await res.data.text();
  if (rawMDX === "404. not found") {
    return undefined;
  }
}

export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const res = await axios.get(`${process.env.API_URL}/posts`);

  if (res.status !== 200) {
    return undefined;
  }

  const repoFileTree: FileTree = res.data.json();

  const filesArray = repoFileTree.tree
    .map((o) => o.path)
    .filter((path) => path.endsWith(".mdx"));

  const posts: Meta[] = [];

  for (const file of filesArray) {
    const post = await getPostByName(file);
    if (post) {
      const meta = post;
      posts.push(meta);
    }
  }

  return posts.sort((a, b) => {
    return a.date > b.date ? -1 : 1;
  });
}

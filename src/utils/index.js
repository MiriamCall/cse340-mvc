import { getCategories } from "../models/category/index.js";

const getNav = async () => {
  const categories = await getCategories();
  let nav = "<nav class='nav'><ul class='nav-list'>";
  categories.forEach((row) => {
    const id = row.category_id;
    const name = row.category_name;
    nav += `<li><a href="/category/view/${id}">${name}</a></li>`;
  });
  return `
    ${nav}
    <li><a href="/category/add">Add Game</a></li>
    <li><a href="/category/add">Add Category</a></li>
    <li><a href="/category/delete">Delete Category</a></li>
    <li><a href="/about">About</a></li>
    </ul></nav>`;
};

export { getNav };

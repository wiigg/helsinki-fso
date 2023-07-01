import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import BlogForm from "./BlogForm";

describe("new blog", () => {
  test("creating a new blog calls the event handler with the right details", () => {
    // login user
    const user = {
      username: "testuser",
      name: "Test User",
    };
    window.localStorage.setItem("bloglistUser", JSON.stringify(user));

    const createBlog = jest.fn();
    const showBanner = jest.fn();

    const container = render(
      <BlogForm createBlog={createBlog} showBanner={showBanner} />
    ).container;

    // fill in the form
    const title = container.querySelector("#titleInput");
    const author = container.querySelector("#authorInput");
    const url = container.querySelector("#urlInput");
    const submit = container.querySelector("#submitButton");

    userEvent.type(title, "Test Title");
    userEvent.type(author, "Test Author");
    userEvent.type(url, "Test URL");
    userEvent.click(submit);

    // check that the event handler was called with the right details
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: "Test Title",
      author: "Test Author",
      url: "Test URL",
    });
  });
});

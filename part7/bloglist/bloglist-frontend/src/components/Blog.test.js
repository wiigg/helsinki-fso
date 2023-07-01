import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

import Blog from "./Blog";

describe("view blog details", () => {
  let container;
  beforeEach(() => {
    // login user
    const user = {
      username: "testuser",
      name: "Test User",
    };
    window.localStorage.setItem("bloglistUser", JSON.stringify(user));

    // create blog
    const blog = {
      title: "Test Title",
      author: "Test Author",
      url: "Test URL",
      likes: 7,
      user: {
        username: "testuser",
        name: "Test User",
      },
    };

    container = render(<Blog blog={blog} />).container;
  });

  test("renders the blog title and author, but not the url or likes by default", () => {
    // title and author should be visible
    let div = container.querySelector("#blog");
    expect(div).toHaveTextContent("Test Title Test Author");

    // url and likes should exist
    div = container.querySelector("#url");
    expect(div).not.toBeVisible();

    div = container.querySelector("#likes");
    expect(div).not.toBeVisible();
  });

  test("renders the blog title, author, url, and likes when the view button is clicked", () => {
    // click the view button
    const button = container.querySelector("#viewButton");
    userEvent.click(button);

    // title and author should exist
    let div = container.querySelector("#blog");
    expect(div).toHaveTextContent("Test Title Test Author");

    // url and likes should be visible
    div = container.querySelector("#url");
    expect(div).toBeVisible();

    div = container.querySelector("#likes");
    expect(div).toBeVisible();
  });

  describe("like blog", () => {
    test("clicking the like button twice calls the event handler twice", () => {
      // login user
      const user = {
        username: "testuser",
        name: "Test User",
      };
      window.localStorage.setItem("bloglistUser", JSON.stringify(user));

      // create blog
      const blog = {
        title: "Test Title",
        author: "Test Author",
        url: "Test URL",
        likes: 7,
        user: {
          username: "testuser",
          name: "Test User",
        },
      };

      const likeBlog = jest.fn();
      const showBanner = jest.fn();

      const container = render(
        <Blog blog={blog} likeBlog={likeBlog} showBanner={showBanner} />
      ).container;

      // click the view button
      const viewButton = container.querySelector("#viewButton");
      userEvent.click(viewButton);

      // click the like button twice
      const likeButton = container.querySelector("#likeButton");
      userEvent.click(likeButton);
      userEvent.click(likeButton);

      expect(likeBlog.mock.calls).toHaveLength(2);
    });
  });
});

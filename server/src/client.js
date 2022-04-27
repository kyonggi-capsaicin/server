const axios = require("axios");

console.log("client code running.");

const URI = "http://localhost:4000";

// 선한영향력 가게 => 240ms (nesting 전)
// 선한영향력 가게 => 120ms (nesting 후)

const test = async () => {
  console.time("loading time: ");

  try {
    await axios.get(`${URI}/api/posts?page=3000`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGQ2MDcyYjYwZWFlNWY3OWNiZTNmMyIsIm5pY2tuYW1lIjoi7ISg7ZWcNDc2MyIsImlhdCI6MTY0OTUwNzE0MiwiZXhwIjoxNjQ5NTA4OTQyfQ.vFaPlJKN8EK7U8BSm6RW21PPizzstYwVs5uUAGYKHCU",
      },
    });
  } catch (error) {
    console.log(error);
  }

  // blogs = await Promise.all(
  //   blogs.map(async (blog) => {
  //     try {
  //       const [res1, res2] = await Promise.all([
  //         axios.get(`${URI}/user/${blog.user}`),
  //         axios.get(`${URI}/blog/${blog._id}/comment`),
  //       ]);

  //       blog.user = res1.data.user;
  //       blog.comments = await Promise.all(
  //         res2.data.comment.map(async (comment) => {
  //           const {
  //             data: { user },
  //           } = await axios.get(`${URI}/user/${comment.user}`);

  //           comment.user = user;
  //           return comment;
  //         }),
  //       );

  //       return blog;
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }),
  // );

  //console.dir(blogs[0], { depth: 10 });
  console.timeEnd("loading time: ");
};

const testGroup = async () => {
  try {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
  } catch (error) {
    console.log(error);
  }
};

testGroup();

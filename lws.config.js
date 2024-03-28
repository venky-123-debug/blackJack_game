module.exports = {
  port: 5000,
  directory: "public",
  spa: "index.html",
  logFormat: "dev",
  rewrite: [
    {
      from: "/api/v4/(.*)",
      to: "https://test.swagger.print2block.in/rng/$1",
    },
  ],
}

import request from "supertest";
import express from "express";
import routes from "../../routes";

describe("Routes", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    routes(app);
  });

  describe("GET /", () => {
    it("should return API working message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toBe("API working as planned.");
    });
  });
});

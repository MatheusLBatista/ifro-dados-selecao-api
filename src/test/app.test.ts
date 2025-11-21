import app from "../app";

describe("App", () => {
  it("deve ser uma aplicação Express válida", () => {
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe("function");
    expect(typeof app.use).toBe("function");
    expect(typeof app.get).toBe("function");
    expect(typeof app.post).toBe("function");
  });

  it("deve ter propriedades básicas do Express", () => {
    expect(app.settings).toBeDefined();
    expect(app.locals).toBeDefined();
    expect(app.mountpath).toBe("/");
  });

  it("deve suportar configuração de middlewares", () => {
    expect(typeof app.use).toBe("function");
    expect(typeof app.all).toBe("function");
  });
});

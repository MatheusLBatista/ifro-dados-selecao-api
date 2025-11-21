import asyncWrapper from "../../middlewares/asyncWrapper";

describe("asyncWrapper", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {};
    mockNext = jest.fn();
  });

  it("deve chamar o handler com os parâmetros corretos", async () => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const wrappedHandler = asyncWrapper(mockHandler);

    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("deve chamar next() quando o handler resolve com sucesso", async () => {
    const mockHandler = jest.fn().mockResolvedValue("success");
    const wrappedHandler = asyncWrapper(mockHandler);

    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next() com o erro quando o handler rejeita", async () => {
    const mockError = new Error("Test error");
    const mockHandler = jest.fn().mockRejectedValue(mockError);
    const wrappedHandler = asyncWrapper(mockHandler);

    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("deve funcionar com handlers que retornam valores não-promise", async () => {
    const mockHandler = jest.fn().mockReturnValue("not a promise");
    const wrappedHandler = asyncWrapper(mockHandler);

    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve funcionar com handlers que não retornam nada", async () => {
    const mockHandler = jest.fn();
    const wrappedHandler = asyncWrapper(mockHandler);

    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });
});

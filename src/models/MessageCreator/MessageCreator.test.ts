import { MessageCreator } from "./MessageCreator";
import { Template } from "../template.types";

describe("MessageCreator", () => {
  const template: Template = {
    usedVarNames: ["firstName", "age"],
    nodes: [
      { id: "1", type: "text", value: "Hello" },
      {
        id: "2",
        type: "condition",
        nodes: {
          if: [{ id: "3", type: "text", value: "{firstName}" }],
          then: [
            { id: "4", type: "text", value: ", {firstName}!" },
            {
              id: "5",
              type: "condition",
              nodes: {
                if: [{ id: "6", type: "text", value: "{age}" }],
                then: [{ id: "7", type: "text", value: " Your age is {age}." }],
                else: [{ id: "8", type: "text", value: " How old you?" }],
              },
            },
          ],
          else: [{ id: "9", type: "text", value: ". How your name?" }],
        },
      },
      { id: "10", type: "text", value: "{  non-existent}" },
    ]
  };

  test("create() should generate the correct message with variable substitution", () => {
    const creator = new MessageCreator(template, {
      firstName: "Bob",
      age: "20",
    });

    const message = creator.create();
    expect(message).toBe("Hello, Bob! Your age is 20.{  non-existent}");
  });

  test("create() should handle missing variables", () => {
    const creator = new MessageCreator(template, {
      firstName: "Bob",
    });

    const message = creator.create();
    expect(message).toBe("Hello, Bob! How old you?{  non-existent}");
  });

  test("create() should handle non-existent variables", () => {
    const creator = new MessageCreator(template, {
      bla: "some-value",
    });

    const message = creator.create();
    expect(message).toBe("Hello. How your name?{  non-existent}");
  });

  test("updateVariableValue() should update the variable value", () => {
    const creator = new MessageCreator(template, {
      firstName: "Bob",
      age: "20",
    });

    creator.updateVariableValue("firstName", "Alice");

    const message = creator.create();
    expect(message).toBe("Hello, Alice! Your age is 20.{  non-existent}");
  });
});


import { formatMessages } from "./messageUtils";

test("formatMessages returns an array with a single string message", () => {
  const message = "Hello, world!";
  const formattedMessages = formatMessages(message);
  expect(formattedMessages).toEqual(["Hello, world!"]);
});

test("formatMessages returns an array with multiple string messages", () => {
  const message = ["Hello. How are you?", "I am fine. Thanks!"];
  const formattedMessages = formatMessages(message);
  expect(formattedMessages).toEqual(["Hello", "How are you?", "I am fine", "Thanks!"]);
});

test("formatMessages flattens nested arrays and splits string messages", () => {
  const message = [["Hello. How are you?"], ["I am fine. Thanks!"]];
  const formattedMessages = formatMessages(message);
  expect(formattedMessages).toEqual(["Hello", "How are you?", "I am fine", "Thanks!"]);
});

test("formatMessages handles mixed types of input messages", () => {
  const message = ["Hello. How are you?", ["I am fine. Thanks!", "See you."]];
  const formattedMessages = formatMessages(message);
  expect(formattedMessages).toEqual(["Hello", "How are you?", "I am fine", "Thanks!", "See you."]);
});

test("formatMessages handles empty input", () => {
  const message = [];
  const formattedMessages = formatMessages(message);
  expect(formattedMessages).toEqual([]);
});

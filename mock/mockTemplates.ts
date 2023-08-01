import { TemplateNode } from "../src/models";

export const template1: TemplateNode[] = [
  { id: "1a", type: "text", value: "Hello" },
  {
    id: "2a",
    type: "condition",
    nodes: {
      if: [{ id: "3a", type: "text", value: "World" }],
      then: [{ id: "4a", type: "text", value: "" }],
      else: [{ id: "5a", type: "text", value: "" }],
    },
  },
  { id: "6a", type: "text", value: "the end" },
];

export const template2: TemplateNode[] = [
  {
    id: "60cc12cc-a48b-4518-9b43-4575061c3b7c",
    type: "text",
    value:
      "Hello {firstname}!\n\nI just went through your profile and I would love to join your network!\n",
  },
  {
    id: "e4b98be8-f9d6-4c28-8471-957b591b8917",
    type: "condition",
    nodes: {
      if: [
        {
          id: "195f0537-7db7-44a0-ab74-592703118e90",
          type: "text",
          value: "{company}",
        },
      ],
      then: [
        {
          id: "c92ac188-3a9c-45f1-9e91-ae1543837047",
          type: "text",
          value: "I know you work at {company}",
        },
        {
          id: "e95d170d-75e4-4b5f-80b1-a4d8f1b8b40b",
          type: "condition",
          nodes: {
            if: [
              {
                id: "cc63b5a1-7ce9-40ba-bb2d-a4755c905968",
                type: "text",
                value: "{position}",
              },
            ],
            then: [
              {
                id: "658e6930-7ce7-44fd-8131-80c96ec1e346",
                type: "text",
                value: " as {position} ",
              },
            ],
            else: [
              {
                id: "8ea54599-c380-4f14-98ed-dcf375a053b1",
                type: "text",
                value: ", but what is you role? ",
              },
            ],
          },
        },
        {
          id: "d0aff011-0d58-4d5c-bec5-f4861e49f91e",
          type: "text",
          value: ";)",
        },
      ],
      else: [
        {
          id: "7058e85a-8ae1-411d-ae3e-ea9c74245bd2",
          type: "text",
          value: "Where do you work at the moment?",
        },
      ],
    },
  },
  {
    id: "a63fb045-5351-4b81-87b9-d9ed50e74bd3",
    type: "text",
    value: "\n\nJake\nSoftware Developer\njakelennard911@gmail.com",
  },
];

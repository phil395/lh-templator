# Message Template Editor

## Demo

[https://message-template-editor.pages.dev/](https://message-template-editor.pages.dev/)

## Start

```bash
# install dependencies
yarn

# start dev mode
yarn start
```

## Possible optimizations

#### Avoiding regular expressions

Currently, regular expressions are used when creating messages based on a template.

Regular expressions allow us to achieve our goal quickly and easily. However, they do not have the best asymptotic complexity.

In case we need to generate thousands of messages at the same time, a good solution would be to replace regular expressions.

Below is an example of a function that parses an incoming text fragment of a template and forms a structure that allows us to quickly substitute variables.

```js
const parseTemplateString = (templateString, variables = {}) => {
  const textParts = []
  const varNames = []

  let startTextIndex = 0
  let startVarIndex

  for (let i = 0; i < templateString.length; i++) {
    const char = templateString[i];
    if (char === '{') {
      startVarIndex = i
    }
    else if (char === '}') {
      const varName = templateString.slice(startVarIndex + 1, i)
      if (varName in variables) {
        varNames.push(varName)
        const text = templateString.slice(startTextIndex, startVarIndex)
        textParts.push(text)
        startTextIndex = i + 1
      }
    }
  }

  const lastTextPart = templateString.slice(startTextIndex)
  textParts.push(lastTextPart)

  return {
    textParts,
    varNames
  }
}
```

Examples of how this function works

```js
const templateString = "Hello {name}! You age is {age}"
const variables = { name: "Bob", age: 20 }
parseTemplateString(templateString, variables)
/* output:
  {
    textParts: [
      'Hello ',
      '! You age is ',
      ''
    ],
    varNames: [
      'name',
      'age'
    ]
  }
*/
```

#### Reducing the size of the sterilized template

Each node of the template has its own identifier (uuid).

It is necessary for the application to work, for example, when searching for the right node when inserting a variable or when deleting a condition node

If we need to create a large number of templates and store them in the database in serialized form, a good solution would be to go through all its nodes before sterilizing the template and delete the identifiers, for example, this can be done using the replacer function as an argument in `JSON.stringify()`. This will reduce the size of the template. Then, when importing the template back into the application, go through all the nodes again and generate the identifiers required by the application.

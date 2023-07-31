import { MessageTemplator } from "./MessageTemplator";
import { getNewTextNode, type ConditionNode, type TextNode, getDefaultConditionNode } from "../template";


describe('MessageTemplator', () => {
  let templator: MessageTemplator;
  let nodes: [TextNode, ConditionNode, TextNode];

  beforeEach(() => {
    nodes = [
      getNewTextNode('Hello'),
      getDefaultConditionNode(),
      getNewTextNode("World")
    ];
    templator = new MessageTemplator(nodes, ["firstname"]);
  });

  describe('addCondition', () => {
    it('should add a condition node with text node before and after', () => {
      const textNodeId = nodes[0].id;
      const textBefore = 'Hi ';
      const textAfter = ', how are you?';

      templator.addCondition(textNodeId, textBefore, textAfter);

      expect(templator.getNodes()).toHaveLength(5);

      const conditionNode = templator.getNodes()[1] as ConditionNode;
      expect(conditionNode.type).toBe('condition');
      expect(conditionNode.nodes.if).toHaveLength(1);
      expect(conditionNode.nodes.then).toHaveLength(1);
      expect(conditionNode.nodes.else).toHaveLength(1);

      const ifNode = conditionNode.nodes.if[0] as TextNode;
      expect(ifNode.type).toBe('text');
      expect(ifNode.value).toBe('');

      const thenNode = conditionNode.nodes.then[0] as TextNode;
      expect(thenNode.type).toBe('text');
      expect(thenNode.value).toBe('');

      const elseNode = conditionNode.nodes.else[0] as TextNode;
      expect(elseNode.type).toBe('text');
      expect(elseNode.value).toBe('');

      const beforeTextNode = templator.getNodes()[0] as TextNode;
      expect(beforeTextNode.type).toBe('text');
      expect(beforeTextNode.value).toBe(textBefore);

      const afterTextNode = templator.getNodes()[2] as TextNode;
      expect(afterTextNode.type).toBe('text');
      expect(afterTextNode.value).toBe(textAfter);
    });

    it('should not add a condition node if the specified text node is not found', () => {
      const textNodeId = "bla"; // non-existent ID
      const textBefore = 'Hi ';
      const textAfter = ', how are you?';

      templator.addCondition(textNodeId, textBefore, textAfter);

      expect(templator.getNodes()).toBe(nodes);
    });

    it("should not affect other neighboring nodes", () => {
      const textNodeId = nodes[0].id;
      const textBefore = 'Hi ';
      const textAfter = ', how are you?';

      templator.addCondition(textNodeId, textBefore, textAfter);

      expect(templator.getNodes()).toHaveLength(5);

      const notUsedConditionNode = templator.getNodes()[3] as ConditionNode;
      expect(notUsedConditionNode).toBe(nodes[1]);

      const notUsedTextNode = templator.getNodes()[4] as TextNode;
      expect(notUsedTextNode).toBe(nodes[2]);
    })
  });

  describe('updateTextNode', () => {
    it('should update the value of a text node', () => {
      const textNode = nodes[0];
      const newText = 'Hi there!';

      templator.updateTextNode(textNode.id, newText);

      expect(templator.getNodes()).toHaveLength(3);
      expect(templator.getNodes()[0].type).toBe('text');
      expect((templator.getNodes()[0] as TextNode).value).toBe(newText);
    });


    it('should not update the node if it is not a text node', () => {
      const conditionNode = nodes[1];
      const newText = 'Hi there!';

      templator.updateTextNode(conditionNode.id, newText);

      expect(templator.getNodes()).toBe(nodes);
    });
  });

  describe('removeCondition', () => {
    it('should remove a condition node and merge adjacent text nodes', () => {
      const conditionNode = nodes[1];

      templator.removeCondition(conditionNode.id);

      expect(templator.getNodes()).toHaveLength(1);
      expect(templator.getNodes()[0].type).toBe('text');
      expect((templator.getNodes()[0] as TextNode).value).toBe('HelloWorld');
    });

    it('should not remove the condition node if the specified ID is not found', () => {
      const conditionNodeId = "bla"; // non-existent ID

      templator.removeCondition(conditionNodeId);

      expect(templator.getNodes()).toBe(nodes);
    });

    it('should not remove the node if it is not a condition node', () => {
      const textNode = nodes[0];

      templator.removeCondition(textNode.id);

      expect(templator.getNodes()).toBe(nodes);
    });

    it('should not remove the condition node if adjacent nodes are not text nodes', () => {
      const conditionNode = nodes[1];
      nodes.pop() // remove adjacent text node

      templator.removeCondition(conditionNode.id);

      expect(templator.getNodes()).toBe(nodes);
    });
  });

  describe('sanitizeText', () => {
    it('should handle non-existent variables as plain text, removing curly braces from them', () => {
      const textNode = nodes[0]

      templator.updateTextNode(textNode.id, "Hello, {non-existent}")

      expect((templator.getNodes()[0] as TextNode).value).toBe("Hello, non-existent");

      templator.updateTextNode(textNode.id, "Hello, {  non-existent }")

      expect((templator.getNodes()[0] as TextNode).value).toBe("Hello,   non-existent ");
    })

    it("should remove leading and trailing spaces from existing variable names", () => {
      const textNode = nodes[0]

      templator.updateTextNode(textNode.id, "Hello, { firstname  }")

      expect((templator.getNodes()[0] as TextNode).value).toBe("Hello, {firstname}");
    })
  })

  describe('comprehensive test', () => {
    it('should work correctly during a series of changes', () => {
      const conditionNode = nodes[1];

      templator.removeCondition(conditionNode.id);
      expect(templator.getNodes()).toHaveLength(1);

      templator.addCondition(templator.getNodes()[0].id, "Hi ", ", how are you?");
      expect(templator.getNodes()).toHaveLength(3);

      templator.updateTextNode(templator.getNodes()[0].id, "Hello, {firstname}. {non-existent}");
      expect((templator.getNodes()[0] as TextNode).value).toBe("Hello, {firstname}. non-existent");
    });
  })

  describe('serialize', () => {
    it('should serialize the templated nodes', () => {
      templator = new MessageTemplator([{ id: '1', type: 'text', value: 'Hello' }], ["firstname"])

      const serialized = JSON.stringify(templator.getNodes())
      expect(serialized).toBe(`[{"id":"1","type":"text","value":"Hello"}]`);
    });
  })
});

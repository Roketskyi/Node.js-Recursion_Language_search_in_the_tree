const fs = require('fs');

const searchTree = (node, searchValue, path = []) => {
  if (node && node.Node && node.Node.Label === searchValue) {
    return [...path, node.Node.Label];
  } else if (node && node.Children) {
    for (let i = 0; i < node.Children.length; i++) {
      const result = searchTree(node.Children[i], searchValue, [...path, node.Node.Label]);

      if (result) {
        return result;
      }
    }
  }
  return null;
};

const isValidValue = (node, searchValue) => {
  if (node.Node && node.Node.Label === searchValue) {
    return true;
  } else if (node.Children) {
    for (let i = 0; i < node.Children.length; i++) {
      if (isValidValue(node.Children[i], searchValue)) {
        return true;
      }
    }
  }
  
  for (const child of Object.values(node)) {
    if (typeof child === 'object') {
      if (isValidValue(child, searchValue)) {
        return true;
      }
    }
  }
  
  return false;
};


const filePath = './language-tree.json';
const fileContents = fs.readFileSync(filePath, 'utf-8');
const tree = JSON.parse(fileContents);

const searchValue = process.argv[2];

if (!isValidValue(tree, searchValue)) {
  console.log(`${searchValue} is not a valid language name.`);
} else {
  const rootNode = tree.Root;
  const results = [];

  const searchInNode = (node, path) => {
    if (node && node.Node && node.Node.Label === searchValue) {
      results.push([...path, node.Node.Label]);
    }

    if (node && node.Children) {
      for (let i = 0; i < node.Children.length; i++) {
        searchInNode(node.Children[i], [...path, node.Node.Label]);
      }
    }
  };

  searchInNode(rootNode, []);

  if (results.length === 0) {
    console.log(`${searchValue} was not found in the tree.`);
  } else {
    console.log('Results:');
    for (const result of results) {
      console.log(result.join(' -> '));
    }
  }
}

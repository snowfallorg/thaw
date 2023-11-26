import { Parser, NodeKind } from '../vendor/sleet.mjs';
import todo from './todo';
import merge from './merge';
import edit from './edit';

// Serializes a subset of Nix AST nodes to a static value.
// Location information is preserved on some primitives.
export function toStaticValue(node) {
  if (typeof node === 'string') {
    return node;
  } else if (typeof node === 'boolean') {
    return node;
  }

  switch (node.kind) {
    default:
      throw new Error(`Unsupported AST node: ${node.kind}`);
    case 'Expr':
      return toStaticValue(node.value);
    case 'SubExpr':
      return toStaticValue(node.value);
    case 'String': {
      const result = new String(node.value.map(toStaticValue).join(''));
      result.loc = node.loc;
      return result;
    }
    case 'Bool': {
      const result = new Boolean(node.value);
      result.loc = node.loc;
      return result;
    }
    case 'Fn':
      return undefined;
    case 'Attrs': {
      let attrs = {};

      for (const attr of node.value) {
        let property = attrs;

        const parts = attr.name.value.map(toStaticValue);

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];

          if (i !== parts.length - 1) {
            property[part] ??= {};
          } else if (attr.value.kind === 'Attrs') {
            property[part] ??= {};
          } else if (attr.value.kind === 'List') {
            property[part] ??= [];
          } else if (!property.hasOwnProperty(part)) {
            property[part] = toStaticValue(attr.value);
          } else {
            throw new Error(`Duplicate property: ${part}`);
          }

          property = property[part];
        }
      }

      return attrs;
    }
  }
}

export async function parse(path: string) {
  const text = await Bun.file(path).text();

  const parser = new Parser();

  const ast = parser.parse(text);

  return ast;
}

export async function getFlakeInputs(path: string) {
  const ast = await parse(path);

  const root = ast.value.value.value;

  if (root.kind !== 'Attrs') {
    throw new Error('Expected flake to be an attribute set.');
  }

  const flake = toStaticValue(root);

  if (!flake.inputs) {
    throw new Error('Expected flake to have inputs.');
  }

  return flake.inputs;
}

export async function upgradeFlakeInput(flake, input, target) {
  if (!input.ref?.loc && !input.url?.loc) {
    throw new Error('No location information for input: ' + input.name);
  }

  if (input.ref) {
    await edit({
      file: flake,
      from: input.ref.loc.start,
      to: input.ref.loc.end,
      insert: `"${target}"`,
    });
  } else {
    const url = new URL(input.url);

    url.searchParams.set('ref', target);

    await edit({
      file: flake,
      from: input.url.loc.start,
      to: input.url.loc.end,
      insert: `"${url.href}"`,
    });
  }
}

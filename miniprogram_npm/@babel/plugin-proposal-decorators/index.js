module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1680223929247, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _helperPluginUtils = require("@babel/helper-plugin-utils");
var _pluginSyntaxDecorators = require("@babel/plugin-syntax-decorators");
var _helperCreateClassFeaturesPlugin = require("@babel/helper-create-class-features-plugin");
var _transformerLegacy = require("./transformer-legacy");
var _transformer = require("./transformer-2023-01");
var _default = (0, _helperPluginUtils.declare)((api, options) => {
  api.assertVersion(7);
  {
    var {
      legacy
    } = options;
  }
  const {
    version
  } = options;
  if (legacy || version === "legacy") {
    return {
      name: "proposal-decorators",
      inherits: _pluginSyntaxDecorators.default,
      visitor: _transformerLegacy.default
    };
  } else if (version === "2021-12" || version === "2022-03" || version === "2023-01") {
    return (0, _transformer.default)(api, options, version);
  } else {
    api.assertVersion("^7.0.2");
    return (0, _helperCreateClassFeaturesPlugin.createClassFeaturePlugin)({
      name: "proposal-decorators",
      api,
      feature: _helperCreateClassFeaturesPlugin.FEATURES.decorators,
      inherits: _pluginSyntaxDecorators.default
    });
  }
});
exports.default = _default;

//# sourceMappingURL=index.js.map

}, function(modId) {var map = {"./transformer-legacy":1680223929248,"./transformer-2023-01":1680223929249}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1680223929248, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@babel/core");
const buildClassDecorator = _core.template.statement(`
  DECORATOR(CLASS_REF = INNER) || CLASS_REF;
`);
const buildClassPrototype = (0, _core.template)(`
  CLASS_REF.prototype;
`);
const buildGetDescriptor = (0, _core.template)(`
    Object.getOwnPropertyDescriptor(TARGET, PROPERTY);
`);
const buildGetObjectInitializer = (0, _core.template)(`
    (TEMP = Object.getOwnPropertyDescriptor(TARGET, PROPERTY), (TEMP = TEMP ? TEMP.value : undefined), {
        enumerable: true,
        configurable: true,
        writable: true,
        initializer: function(){
            return TEMP;
        }
    })
`);
const WARNING_CALLS = new WeakSet();
function applyEnsureOrdering(path) {
  const decorators = (path.isClass() ? [path, ...path.get("body.body")] : path.get("properties")).reduce((acc, prop) => acc.concat(prop.node.decorators || []), []);
  const identDecorators = decorators.filter(decorator => !_core.types.isIdentifier(decorator.expression));
  if (identDecorators.length === 0) return;
  return _core.types.sequenceExpression(identDecorators.map(decorator => {
    const expression = decorator.expression;
    const id = decorator.expression = path.scope.generateDeclaredUidIdentifier("dec");
    return _core.types.assignmentExpression("=", id, expression);
  }).concat([path.node]));
}
function applyClassDecorators(classPath) {
  if (!hasClassDecorators(classPath.node)) return;
  const decorators = classPath.node.decorators || [];
  classPath.node.decorators = null;
  const name = classPath.scope.generateDeclaredUidIdentifier("class");
  return decorators.map(dec => dec.expression).reverse().reduce(function (acc, decorator) {
    return buildClassDecorator({
      CLASS_REF: _core.types.cloneNode(name),
      DECORATOR: _core.types.cloneNode(decorator),
      INNER: acc
    }).expression;
  }, classPath.node);
}
function hasClassDecorators(classNode) {
  return !!(classNode.decorators && classNode.decorators.length);
}
function applyMethodDecorators(path, state) {
  if (!hasMethodDecorators(path.node.body.body)) return;
  return applyTargetDecorators(path, state, path.node.body.body);
}
function hasMethodDecorators(body) {
  return body.some(node => {
    var _node$decorators;
    return (_node$decorators = node.decorators) == null ? void 0 : _node$decorators.length;
  });
}
function applyObjectDecorators(path, state) {
  if (!hasMethodDecorators(path.node.properties)) return;
  return applyTargetDecorators(path, state, path.node.properties.filter(prop => prop.type !== "SpreadElement"));
}
function applyTargetDecorators(path, state, decoratedProps) {
  const name = path.scope.generateDeclaredUidIdentifier(path.isClass() ? "class" : "obj");
  const exprs = decoratedProps.reduce(function (acc, node) {
    let decorators = [];
    if (node.decorators != null) {
      decorators = node.decorators;
      node.decorators = null;
    }
    if (decorators.length === 0) return acc;
    if (node.computed) {
      throw path.buildCodeFrameError("Computed method/property decorators are not yet supported.");
    }
    const property = _core.types.isLiteral(node.key) ? node.key : _core.types.stringLiteral(node.key.name);
    const target = path.isClass() && !node.static ? buildClassPrototype({
      CLASS_REF: name
    }).expression : name;
    if (_core.types.isClassProperty(node, {
      static: false
    })) {
      const descriptor = path.scope.generateDeclaredUidIdentifier("descriptor");
      const initializer = node.value ? _core.types.functionExpression(null, [], _core.types.blockStatement([_core.types.returnStatement(node.value)])) : _core.types.nullLiteral();
      node.value = _core.types.callExpression(state.addHelper("initializerWarningHelper"), [descriptor, _core.types.thisExpression()]);
      WARNING_CALLS.add(node.value);
      acc.push(_core.types.assignmentExpression("=", _core.types.cloneNode(descriptor), _core.types.callExpression(state.addHelper("applyDecoratedDescriptor"), [_core.types.cloneNode(target), _core.types.cloneNode(property), _core.types.arrayExpression(decorators.map(dec => _core.types.cloneNode(dec.expression))), _core.types.objectExpression([_core.types.objectProperty(_core.types.identifier("configurable"), _core.types.booleanLiteral(true)), _core.types.objectProperty(_core.types.identifier("enumerable"), _core.types.booleanLiteral(true)), _core.types.objectProperty(_core.types.identifier("writable"), _core.types.booleanLiteral(true)), _core.types.objectProperty(_core.types.identifier("initializer"), initializer)])])));
    } else {
      acc.push(_core.types.callExpression(state.addHelper("applyDecoratedDescriptor"), [_core.types.cloneNode(target), _core.types.cloneNode(property), _core.types.arrayExpression(decorators.map(dec => _core.types.cloneNode(dec.expression))), _core.types.isObjectProperty(node) || _core.types.isClassProperty(node, {
        static: true
      }) ? buildGetObjectInitializer({
        TEMP: path.scope.generateDeclaredUidIdentifier("init"),
        TARGET: _core.types.cloneNode(target),
        PROPERTY: _core.types.cloneNode(property)
      }).expression : buildGetDescriptor({
        TARGET: _core.types.cloneNode(target),
        PROPERTY: _core.types.cloneNode(property)
      }).expression, _core.types.cloneNode(target)]));
    }
    return acc;
  }, []);
  return _core.types.sequenceExpression([_core.types.assignmentExpression("=", _core.types.cloneNode(name), path.node), _core.types.sequenceExpression(exprs), _core.types.cloneNode(name)]);
}
function decoratedClassToExpression({
  node,
  scope
}) {
  if (!hasClassDecorators(node) && !hasMethodDecorators(node.body.body)) {
    return;
  }
  const ref = node.id ? _core.types.cloneNode(node.id) : scope.generateUidIdentifier("class");
  return _core.types.variableDeclaration("let", [_core.types.variableDeclarator(ref, _core.types.toExpression(node))]);
}
const visitor = {
  ExportDefaultDeclaration(path) {
    const decl = path.get("declaration");
    if (!decl.isClassDeclaration()) return;
    const replacement = decoratedClassToExpression(decl);
    if (replacement) {
      const [varDeclPath] = path.replaceWithMultiple([replacement, _core.types.exportNamedDeclaration(null, [_core.types.exportSpecifier(_core.types.cloneNode(replacement.declarations[0].id), _core.types.identifier("default"))])]);
      if (!decl.node.id) {
        path.scope.registerDeclaration(varDeclPath);
      }
    }
  },
  ClassDeclaration(path) {
    const replacement = decoratedClassToExpression(path);
    if (replacement) {
      const [newPath] = path.replaceWith(replacement);
      const decl = newPath.get("declarations.0");
      const id = decl.node.id;
      const binding = path.scope.getOwnBinding(id.name);
      binding.identifier = id;
      binding.path = decl;
    }
  },
  ClassExpression(path, state) {
    const decoratedClass = applyEnsureOrdering(path) || applyClassDecorators(path) || applyMethodDecorators(path, state);
    if (decoratedClass) path.replaceWith(decoratedClass);
  },
  ObjectExpression(path, state) {
    const decoratedObject = applyEnsureOrdering(path) || applyObjectDecorators(path, state);
    if (decoratedObject) path.replaceWith(decoratedObject);
  },
  AssignmentExpression(path, state) {
    if (!WARNING_CALLS.has(path.node.right)) return;
    path.replaceWith(_core.types.callExpression(state.addHelper("initializerDefineProperty"), [_core.types.cloneNode(path.get("left.object").node), _core.types.stringLiteral(path.get("left.property").node.name || path.get("left.property").node.value), _core.types.cloneNode(path.get("right.arguments")[0].node), _core.types.cloneNode(path.get("right.arguments")[1].node)]));
  },
  CallExpression(path, state) {
    if (path.node.arguments.length !== 3) return;
    if (!WARNING_CALLS.has(path.node.arguments[2])) return;
    if (path.node.callee.name !== state.addHelper("defineProperty").name) {
      return;
    }
    path.replaceWith(_core.types.callExpression(state.addHelper("initializerDefineProperty"), [_core.types.cloneNode(path.get("arguments")[0].node), _core.types.cloneNode(path.get("arguments")[1].node), _core.types.cloneNode(path.get("arguments.2.arguments")[0].node), _core.types.cloneNode(path.get("arguments.2.arguments")[1].node)]));
  }
};
var _default = visitor;
exports.default = _default;

//# sourceMappingURL=transformer-legacy.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1680223929249, function(require, module, exports) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _core = require("@babel/core");
var _pluginSyntaxDecorators = require("@babel/plugin-syntax-decorators");
var _helperReplaceSupers = require("@babel/helper-replace-supers");
var _helperSplitExportDeclaration = require("@babel/helper-split-export-declaration");
function incrementId(id, idx = id.length - 1) {
  if (idx === -1) {
    id.unshift(65);
    return;
  }
  const current = id[idx];
  if (current === 90) {
    id[idx] = 97;
  } else if (current === 122) {
    id[idx] = 65;
    incrementId(id, idx - 1);
  } else {
    id[idx] = current + 1;
  }
}
function createPrivateUidGeneratorForClass(classPath) {
  const currentPrivateId = [];
  const privateNames = new Set();
  classPath.traverse({
    PrivateName(path) {
      privateNames.add(path.node.id.name);
    }
  });
  return () => {
    let reifiedId;
    do {
      incrementId(currentPrivateId);
      reifiedId = String.fromCharCode(...currentPrivateId);
    } while (privateNames.has(reifiedId));
    return _core.types.privateName(_core.types.identifier(reifiedId));
  };
}
function createLazyPrivateUidGeneratorForClass(classPath) {
  let generator;
  return () => {
    if (!generator) {
      generator = createPrivateUidGeneratorForClass(classPath);
    }
    return generator();
  };
}
function replaceClassWithVar(path) {
  if (path.type === "ClassDeclaration") {
    const varId = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
    const classId = _core.types.identifier(path.node.id.name);
    path.scope.rename(classId.name, varId.name);
    path.insertBefore(_core.types.variableDeclaration("let", [_core.types.variableDeclarator(varId)]));
    path.get("id").replaceWith(classId);
    return [_core.types.cloneNode(varId), path];
  } else {
    let className;
    let varId;
    if (path.node.id) {
      className = path.node.id.name;
      varId = path.scope.parent.generateDeclaredUidIdentifier(className);
      path.scope.rename(className, varId.name);
    } else if (path.parentPath.node.type === "VariableDeclarator" && path.parentPath.node.id.type === "Identifier") {
      className = path.parentPath.node.id.name;
      varId = path.scope.parent.generateDeclaredUidIdentifier(className);
    } else {
      varId = path.scope.parent.generateDeclaredUidIdentifier("decorated_class");
    }
    const newClassExpr = _core.types.classExpression(className && _core.types.identifier(className), path.node.superClass, path.node.body);
    const [newPath] = path.replaceWith(_core.types.sequenceExpression([newClassExpr, varId]));
    return [_core.types.cloneNode(varId), newPath.get("expressions.0")];
  }
}
function generateClassProperty(key, value, isStatic) {
  if (key.type === "PrivateName") {
    return _core.types.classPrivateProperty(key, value, undefined, isStatic);
  } else {
    return _core.types.classProperty(key, value, undefined, undefined, isStatic);
  }
}
function addProxyAccessorsFor(element, originalKey, targetKey, isComputed = false) {
  const {
    static: isStatic
  } = element.node;
  const getterBody = _core.types.blockStatement([_core.types.returnStatement(_core.types.memberExpression(_core.types.thisExpression(), _core.types.cloneNode(targetKey)))]);
  const setterBody = _core.types.blockStatement([_core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.memberExpression(_core.types.thisExpression(), _core.types.cloneNode(targetKey)), _core.types.identifier("v")))]);
  let getter, setter;
  if (originalKey.type === "PrivateName") {
    getter = _core.types.classPrivateMethod("get", _core.types.cloneNode(originalKey), [], getterBody, isStatic);
    setter = _core.types.classPrivateMethod("set", _core.types.cloneNode(originalKey), [_core.types.identifier("v")], setterBody, isStatic);
  } else {
    getter = _core.types.classMethod("get", _core.types.cloneNode(originalKey), [], getterBody, isComputed, isStatic);
    setter = _core.types.classMethod("set", _core.types.cloneNode(originalKey), [_core.types.identifier("v")], setterBody, isComputed, isStatic);
  }
  element.insertAfter(setter);
  element.insertAfter(getter);
}
function extractProxyAccessorsFor(targetKey, version) {
  if (version !== "2023-01") {
    return [_core.template.expression.ast`
        function () {
          return this.${_core.types.cloneNode(targetKey)};
        }
      `, _core.template.expression.ast`
        function (value) {
          this.${_core.types.cloneNode(targetKey)} = value;
        }
      `];
  }
  return [_core.template.expression.ast`
      o => o.${_core.types.cloneNode(targetKey)}
    `, _core.template.expression.ast`
      (o, v) => o.${_core.types.cloneNode(targetKey)} = v
    `];
}
const FIELD = 0;
const ACCESSOR = 1;
const METHOD = 2;
const GETTER = 3;
const SETTER = 4;
const STATIC = 5;
function getElementKind(element) {
  switch (element.node.type) {
    case "ClassProperty":
    case "ClassPrivateProperty":
      return FIELD;
    case "ClassAccessorProperty":
      return ACCESSOR;
    case "ClassMethod":
    case "ClassPrivateMethod":
      if (element.node.kind === "get") {
        return GETTER;
      } else if (element.node.kind === "set") {
        return SETTER;
      } else {
        return METHOD;
      }
  }
}
function isDecoratorInfo(info) {
  return "decorators" in info;
}
function filteredOrderedDecoratorInfo(info) {
  const filtered = info.filter(isDecoratorInfo);
  return [...filtered.filter(el => el.isStatic && el.kind >= ACCESSOR && el.kind <= SETTER), ...filtered.filter(el => !el.isStatic && el.kind >= ACCESSOR && el.kind <= SETTER), ...filtered.filter(el => el.isStatic && el.kind === FIELD), ...filtered.filter(el => !el.isStatic && el.kind === FIELD)];
}
function generateDecorationExprs(info) {
  return _core.types.arrayExpression(filteredOrderedDecoratorInfo(info).map(el => {
    const decs = el.decorators.length > 1 ? _core.types.arrayExpression(el.decorators) : el.decorators[0];
    const kind = el.isStatic ? el.kind + STATIC : el.kind;
    return _core.types.arrayExpression([decs, _core.types.numericLiteral(kind), el.name, ...(el.privateMethods || [])]);
  }));
}
function extractElementLocalAssignments(decorationInfo) {
  const localIds = [];
  for (const el of filteredOrderedDecoratorInfo(decorationInfo)) {
    const {
      locals
    } = el;
    if (Array.isArray(locals)) {
      localIds.push(...locals);
    } else if (locals !== undefined) {
      localIds.push(locals);
    }
  }
  return localIds;
}
function addCallAccessorsFor(element, key, getId, setId) {
  element.insertAfter(_core.types.classPrivateMethod("get", _core.types.cloneNode(key), [], _core.types.blockStatement([_core.types.returnStatement(_core.types.callExpression(_core.types.cloneNode(getId), [_core.types.thisExpression()]))])));
  element.insertAfter(_core.types.classPrivateMethod("set", _core.types.cloneNode(key), [_core.types.identifier("v")], _core.types.blockStatement([_core.types.expressionStatement(_core.types.callExpression(_core.types.cloneNode(setId), [_core.types.thisExpression(), _core.types.identifier("v")]))])));
}
function isNotTsParameter(node) {
  return node.type !== "TSParameterProperty";
}
function movePrivateAccessor(element, key, methodLocalVar, isStatic) {
  let params;
  let block;
  if (element.node.kind === "set") {
    params = [_core.types.identifier("v")];
    block = [_core.types.expressionStatement(_core.types.callExpression(methodLocalVar, [_core.types.thisExpression(), _core.types.identifier("v")]))];
  } else {
    params = [];
    block = [_core.types.returnStatement(_core.types.callExpression(methodLocalVar, [_core.types.thisExpression()]))];
  }
  element.replaceWith(_core.types.classPrivateMethod(element.node.kind, _core.types.cloneNode(key), params, _core.types.blockStatement(block), isStatic));
}
function isClassDecoratableElementPath(path) {
  const {
    type
  } = path;
  return type !== "TSDeclareMethod" && type !== "TSIndexSignature" && type !== "StaticBlock";
}
function staticBlockToIIFE(block) {
  return _core.types.callExpression(_core.types.arrowFunctionExpression([], _core.types.blockStatement(block.body)), []);
}
function maybeSequenceExpression(exprs) {
  if (exprs.length === 0) return _core.types.unaryExpression("void", _core.types.numericLiteral(0));
  if (exprs.length === 1) return exprs[0];
  return _core.types.sequenceExpression(exprs);
}
function transformClass(path, state, constantSuper, version) {
  const body = path.get("body.body");
  const classDecorators = path.node.decorators;
  let hasElementDecorators = false;
  const generateClassPrivateUid = createLazyPrivateUidGeneratorForClass(path);
  for (const element of body) {
    if (!isClassDecoratableElementPath(element)) {
      continue;
    }
    if (element.node.decorators && element.node.decorators.length > 0) {
      hasElementDecorators = true;
    } else if (element.node.type === "ClassAccessorProperty") {
      const {
        key,
        value,
        static: isStatic,
        computed
      } = element.node;
      const newId = generateClassPrivateUid();
      const valueNode = value ? _core.types.cloneNode(value) : undefined;
      const newField = generateClassProperty(newId, valueNode, isStatic);
      const [newPath] = element.replaceWith(newField);
      addProxyAccessorsFor(newPath, key, newId, computed);
    }
  }
  if (!classDecorators && !hasElementDecorators) return;
  const elementDecoratorInfo = [];
  let firstFieldPath;
  let constructorPath;
  let requiresProtoInit = false;
  let requiresStaticInit = false;
  const decoratedPrivateMethods = new Set();
  let protoInitLocal, staticInitLocal, classInitLocal, classIdLocal;
  const assignments = [];
  const scopeParent = path.scope.parent;
  const memoiseExpression = (expression, hint) => {
    const localEvaluatedId = scopeParent.generateDeclaredUidIdentifier(hint);
    assignments.push(_core.types.assignmentExpression("=", localEvaluatedId, expression));
    return _core.types.cloneNode(localEvaluatedId);
  };
  if (classDecorators) {
    classInitLocal = scopeParent.generateDeclaredUidIdentifier("initClass");
    const [classId, classPath] = replaceClassWithVar(path);
    path = classPath;
    classIdLocal = classId;
    path.node.decorators = null;
    for (const classDecorator of classDecorators) {
      if (!scopeParent.isStatic(classDecorator.expression)) {
        classDecorator.expression = memoiseExpression(classDecorator.expression, "dec");
      }
    }
  } else {
    if (!path.node.id) {
      path.node.id = path.scope.generateUidIdentifier("Class");
    }
    classIdLocal = _core.types.cloneNode(path.node.id);
  }
  let lastInstancePrivateName;
  let needsInstancePrivateBrandCheck = false;
  if (hasElementDecorators) {
    for (const element of body) {
      if (!isClassDecoratableElementPath(element)) {
        continue;
      }
      const {
        node
      } = element;
      const decorators = element.get("decorators");
      const hasDecorators = Array.isArray(decorators) && decorators.length > 0;
      if (hasDecorators) {
        for (const decoratorPath of decorators) {
          if (!scopeParent.isStatic(decoratorPath.node.expression)) {
            decoratorPath.node.expression = memoiseExpression(decoratorPath.node.expression, "dec");
          }
        }
      }
      const isComputed = "computed" in element.node && element.node.computed === true;
      if (isComputed) {
        if (!scopeParent.isStatic(node.key)) {
          node.key = memoiseExpression(node.key, "computedKey");
        }
      }
      const kind = getElementKind(element);
      const {
        key
      } = node;
      const isPrivate = key.type === "PrivateName";
      const isStatic = !!element.node.static;
      let name = "computedKey";
      if (isPrivate) {
        name = key.id.name;
      } else if (!isComputed && key.type === "Identifier") {
        name = key.name;
      }
      if (isPrivate && !isStatic) {
        if (hasDecorators) {
          needsInstancePrivateBrandCheck = true;
        }
        if (_core.types.isClassPrivateProperty(node) || !lastInstancePrivateName) {
          lastInstancePrivateName = key;
        }
      }
      if (element.isClassMethod({
        kind: "constructor"
      })) {
        constructorPath = element;
      }
      if (hasDecorators) {
        let locals;
        let privateMethods;
        if (kind === ACCESSOR) {
          const {
            value
          } = element.node;
          const params = [_core.types.thisExpression()];
          if (value) {
            params.push(_core.types.cloneNode(value));
          }
          const newId = generateClassPrivateUid();
          const newFieldInitId = element.scope.parent.generateDeclaredUidIdentifier(`init_${name}`);
          const newValue = _core.types.callExpression(_core.types.cloneNode(newFieldInitId), params);
          const newField = generateClassProperty(newId, newValue, isStatic);
          const [newPath] = element.replaceWith(newField);
          if (isPrivate) {
            privateMethods = extractProxyAccessorsFor(newId, version);
            const getId = newPath.scope.parent.generateDeclaredUidIdentifier(`get_${name}`);
            const setId = newPath.scope.parent.generateDeclaredUidIdentifier(`set_${name}`);
            addCallAccessorsFor(newPath, key, getId, setId);
            locals = [newFieldInitId, getId, setId];
          } else {
            addProxyAccessorsFor(newPath, key, newId, isComputed);
            locals = newFieldInitId;
          }
        } else if (kind === FIELD) {
          const initId = element.scope.parent.generateDeclaredUidIdentifier(`init_${name}`);
          const valuePath = element.get("value");
          valuePath.replaceWith(_core.types.callExpression(_core.types.cloneNode(initId), [_core.types.thisExpression(), valuePath.node].filter(v => v)));
          locals = initId;
          if (isPrivate) {
            privateMethods = extractProxyAccessorsFor(key, version);
          }
        } else if (isPrivate) {
          locals = element.scope.parent.generateDeclaredUidIdentifier(`call_${name}`);
          const replaceSupers = new _helperReplaceSupers.default({
            constantSuper,
            methodPath: element,
            objectRef: classIdLocal,
            superRef: path.node.superClass,
            file: state.file,
            refToPreserve: classIdLocal
          });
          replaceSupers.replace();
          const {
            params,
            body,
            async: isAsync
          } = element.node;
          privateMethods = [_core.types.functionExpression(undefined, params.filter(isNotTsParameter), body, isAsync)];
          if (kind === GETTER || kind === SETTER) {
            movePrivateAccessor(element, _core.types.cloneNode(key), _core.types.cloneNode(locals), isStatic);
          } else {
            const node = element.node;
            path.node.body.body.unshift(_core.types.classPrivateProperty(key, _core.types.cloneNode(locals), [], node.static));
            decoratedPrivateMethods.add(key.id.name);
            element.remove();
          }
        }
        let nameExpr;
        if (isComputed) {
          nameExpr = _core.types.cloneNode(key);
        } else if (key.type === "PrivateName") {
          nameExpr = _core.types.stringLiteral(key.id.name);
        } else if (key.type === "Identifier") {
          nameExpr = _core.types.stringLiteral(key.name);
        } else {
          nameExpr = _core.types.cloneNode(key);
        }
        elementDecoratorInfo.push({
          kind,
          decorators: decorators.map(d => d.node.expression),
          name: nameExpr,
          isStatic,
          privateMethods,
          locals
        });
        if (kind !== FIELD) {
          if (isStatic) {
            requiresStaticInit = true;
          } else {
            requiresProtoInit = true;
          }
        }
        if (element.node) {
          element.node.decorators = null;
        }
        if (!firstFieldPath && !isStatic && (kind === FIELD || kind === ACCESSOR)) {
          firstFieldPath = element;
        }
      }
    }
  }
  const elementDecorations = generateDecorationExprs(elementDecoratorInfo);
  const classDecorations = _core.types.arrayExpression((classDecorators || []).map(d => d.expression));
  const elementLocals = extractElementLocalAssignments(elementDecoratorInfo);
  if (requiresProtoInit) {
    protoInitLocal = scopeParent.generateDeclaredUidIdentifier("initProto");
    elementLocals.push(protoInitLocal);
    const protoInitCall = _core.types.callExpression(_core.types.cloneNode(protoInitLocal), [_core.types.thisExpression()]);
    if (firstFieldPath) {
      const value = firstFieldPath.get("value");
      const body = [protoInitCall];
      if (value.node) {
        body.push(value.node);
      }
      value.replaceWith(_core.types.sequenceExpression(body));
    } else if (constructorPath) {
      if (path.node.superClass) {
        path.traverse({
          CallExpression: {
            exit(path) {
              if (!path.get("callee").isSuper()) return;
              path.replaceWith(_core.types.callExpression(_core.types.cloneNode(protoInitLocal), [path.node]));
              path.skip();
            }
          }
        });
      } else {
        constructorPath.node.body.body.unshift(_core.types.expressionStatement(protoInitCall));
      }
    } else {
      const body = [_core.types.expressionStatement(protoInitCall)];
      if (path.node.superClass) {
        body.unshift(_core.types.expressionStatement(_core.types.callExpression(_core.types.super(), [_core.types.spreadElement(_core.types.identifier("args"))])));
      }
      path.node.body.body.unshift(_core.types.classMethod("constructor", _core.types.identifier("constructor"), [_core.types.restElement(_core.types.identifier("args"))], _core.types.blockStatement(body)));
    }
  }
  if (requiresStaticInit) {
    staticInitLocal = scopeParent.generateDeclaredUidIdentifier("initStatic");
    elementLocals.push(staticInitLocal);
  }
  if (decoratedPrivateMethods.size > 0) {
    path.traverse({
      PrivateName(path) {
        if (!decoratedPrivateMethods.has(path.node.id.name)) return;
        const parentPath = path.parentPath;
        const parentParentPath = parentPath.parentPath;
        if (parentParentPath.node.type === "AssignmentExpression" && parentParentPath.node.left === parentPath.node || parentParentPath.node.type === "UpdateExpression" || parentParentPath.node.type === "RestElement" || parentParentPath.node.type === "ArrayPattern" || parentParentPath.node.type === "ObjectProperty" && parentParentPath.node.value === parentPath.node && parentParentPath.parentPath.type === "ObjectPattern" || parentParentPath.node.type === "ForOfStatement" && parentParentPath.node.left === parentPath.node) {
          throw path.buildCodeFrameError(`Decorated private methods are not updatable, but "#${path.node.id.name}" is updated via this expression.`);
        }
      }
    });
  }
  const classLocals = [];
  let classInitInjected = false;
  const classInitCall = classInitLocal && _core.types.callExpression(_core.types.cloneNode(classInitLocal), []);
  const originalClass = path.node;
  if (classDecorators) {
    classLocals.push(classIdLocal, classInitLocal);
    const statics = [];
    let staticBlocks = [];
    path.get("body.body").forEach(element => {
      if (element.isStaticBlock()) {
        staticBlocks.push(element.node);
        element.remove();
        return;
      }
      const isProperty = element.isClassProperty() || element.isClassPrivateProperty();
      if ((isProperty || element.isClassPrivateMethod()) && element.node.static) {
        if (isProperty && staticBlocks.length > 0) {
          const allValues = staticBlocks.map(staticBlockToIIFE);
          if (element.node.value) allValues.push(element.node.value);
          element.node.value = maybeSequenceExpression(allValues);
          staticBlocks = [];
        }
        element.node.static = false;
        statics.push(element.node);
        element.remove();
      }
    });
    if (statics.length > 0 || staticBlocks.length > 0) {
      const staticsClass = _core.template.expression.ast`
        class extends ${state.addHelper("identity")} {}
      `;
      staticsClass.body.body = [_core.types.staticBlock([_core.types.toStatement(originalClass, true) || _core.types.expressionStatement(originalClass)]), ...statics];
      const constructorBody = [];
      const newExpr = _core.types.newExpression(staticsClass, []);
      if (staticBlocks.length > 0) {
        constructorBody.push(...staticBlocks.map(staticBlockToIIFE));
      }
      if (classInitCall) {
        classInitInjected = true;
        constructorBody.push(classInitCall);
      }
      if (constructorBody.length > 0) {
        constructorBody.unshift(_core.types.callExpression(_core.types.super(), [_core.types.cloneNode(classIdLocal)]));
        staticsClass.body.body.push(_core.types.classMethod("constructor", _core.types.identifier("constructor"), [], _core.types.blockStatement([_core.types.expressionStatement(_core.types.sequenceExpression(constructorBody))])));
      } else {
        newExpr.arguments.push(_core.types.cloneNode(classIdLocal));
      }
      path.replaceWith(newExpr);
    }
  }
  if (!classInitInjected && classInitCall) {
    path.node.body.body.push(_core.types.staticBlock([_core.types.expressionStatement(classInitCall)]));
  }
  originalClass.body.body.unshift(_core.types.staticBlock([_core.types.expressionStatement(createLocalsAssignment(elementLocals, classLocals, elementDecorations, classDecorations, needsInstancePrivateBrandCheck ? lastInstancePrivateName : null, state, version)), requiresStaticInit && _core.types.expressionStatement(_core.types.callExpression(_core.types.cloneNode(staticInitLocal), [_core.types.thisExpression()]))].filter(Boolean)));
  path.insertBefore(assignments.map(expr => _core.types.expressionStatement(expr)));
  path.scope.crawl();
  return path;
}
function createLocalsAssignment(elementLocals, classLocals, elementDecorations, classDecorations, maybePrivateBranName, state, version) {
  let lhs, rhs;
  const args = [_core.types.thisExpression(), elementDecorations, classDecorations];
  if (version === "2021-12" || version === "2022-03" && !state.availableHelper("applyDecs2203R")) {
    lhs = _core.types.arrayPattern([...elementLocals, ...classLocals]);
    rhs = _core.types.callExpression(state.addHelper(version === "2021-12" ? "applyDecs" : "applyDecs2203"), args);
  } else {
    if (version === "2023-01") {
      if (maybePrivateBranName) {
        args.push(_core.template.expression.ast`
            _ => ${_core.types.cloneNode(maybePrivateBranName)} in _
          `);
      }
      rhs = _core.types.callExpression(state.addHelper("applyDecs2301"), args);
    } else {
      rhs = _core.types.callExpression(state.addHelper("applyDecs2203R"), args);
    }
    if (elementLocals.length > 0) {
      if (classLocals.length > 0) {
        lhs = _core.types.objectPattern([_core.types.objectProperty(_core.types.identifier("e"), _core.types.arrayPattern(elementLocals)), _core.types.objectProperty(_core.types.identifier("c"), _core.types.arrayPattern(classLocals))]);
      } else {
        lhs = _core.types.arrayPattern(elementLocals);
        rhs = _core.types.memberExpression(rhs, _core.types.identifier("e"), false, false);
      }
    } else {
      lhs = _core.types.arrayPattern(classLocals);
      rhs = _core.types.memberExpression(rhs, _core.types.identifier("c"), false, false);
    }
  }
  return _core.types.assignmentExpression("=", lhs, rhs);
}
function _default({
  assertVersion,
  assumption
}, {
  loose
}, version) {
  var _assumption;
  if (version === "2023-01") {
    assertVersion("^7.21.0");
  } else if (version === "2021-12") {
    assertVersion("^7.16.0");
  } else {
    assertVersion("^7.19.0");
  }
  const VISITED = new WeakSet();
  const constantSuper = (_assumption = assumption("constantSuper")) != null ? _assumption : loose;
  return {
    name: "proposal-decorators",
    inherits: _pluginSyntaxDecorators.default,
    visitor: {
      "ExportNamedDeclaration|ExportDefaultDeclaration"(path) {
        var _declaration$decorato;
        const {
          declaration
        } = path.node;
        if ((declaration == null ? void 0 : declaration.type) === "ClassDeclaration" && ((_declaration$decorato = declaration.decorators) == null ? void 0 : _declaration$decorato.length) > 0) {
          (0, _helperSplitExportDeclaration.default)(path);
        }
      },
      Class(path, state) {
        if (VISITED.has(path)) return;
        const newPath = transformClass(path, state, constantSuper, version);
        if (newPath) VISITED.add(newPath);
      }
    }
  };
}

//# sourceMappingURL=transformer-2023-01.js.map

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1680223929247);
})()
//miniprogram-npm-outsideDeps=["@babel/helper-plugin-utils","@babel/plugin-syntax-decorators","@babel/helper-create-class-features-plugin","@babel/core","@babel/helper-replace-supers","@babel/helper-split-export-declaration"]
//# sourceMappingURL=index.js.map
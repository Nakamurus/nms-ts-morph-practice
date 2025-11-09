import ts from "ts-morph";

// Extend SourceFile with custom getArrowFunctions method
declare module "ts-morph" {
  interface SourceFile {
    getArrowFunctions(): ts.VariableDeclaration[];
  }
}

ts.SourceFile.prototype.getArrowFunctions = function (this: ts.SourceFile) {
  return this.getVariableDeclarations().filter((vd) => {
    const initializer = vd.getInitializer();
    return initializer && ts.Node.isArrowFunction(initializer);
  });
};

// Initialize a new ts-morph project
const project = new ts.Project({
  tsConfigFilePath: "tsconfig.app.json",
});

const sourceFiles = project.getSourceFiles();

console.log("sourceFiles", sourceFiles.map((sf) => sf.getBaseName()));

// get hooks of React components
const hooks = sourceFiles.flatMap((sf) => {
  const regularFunctions = sf.getFunctions();
  const arrowFunctions = sf.getArrowFunctions();
  const hooks = [...regularFunctions, ...arrowFunctions].filter((fn) =>
    fn.getName()?.startsWith("use")
  );
  return hooks;
});

console.log("hooks", hooks.map((hook) => hook.getName()));
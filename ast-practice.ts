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

const renameIncrementButtonToCounterButton = (): void => {
  const incrementButtonDirs = project.getDirectories().filter((dir) =>
    dir.getPath().includes("incrementButton")
  );

  console.log(`Found ${incrementButtonDirs.length} directories to rename`);
  for (const dir of incrementButtonDirs) {
    const newPath = dir.getPath().replace("incrementButton", "counterButton");
    console.log(`  Moving directory: ${dir.getBaseName()} -> ${newPath}`);
    dir.move(newPath);
  }

  const incrementButtonFiles = project.getSourceFiles().filter((sf) =>
    sf.getFilePath().includes("IncrementButton")
  );

  console.log(`\nFound ${incrementButtonFiles.length} files to rename`);
  for (const file of incrementButtonFiles) {
    const newFilePath = file
      .getFilePath()
      .replace("IncrementButton", "CounterButton");
    console.log(`  Moving: ${file.getBaseName()} -> ${newFilePath}`);
    file.move(newFilePath);
  }

  for (const sf of project.getSourceFiles()) {
    console.log(`\nProcessing file: ${sf.getBaseName()}`);
  
    const statements = sf.getStatements();
    console.log(`  Total statements: ${statements.length}`);
    
    for (const statement of statements) {
      const stmtKind = statement.getKind();
      const kindName = ts.SyntaxKind[stmtKind];
      console.log(`  Statement kind: ${kindName}`);
      
      if (stmtKind === ts.SyntaxKind.TypeAliasDeclaration
        || stmtKind === ts.SyntaxKind.InterfaceDeclaration
        || stmtKind === ts.SyntaxKind.FunctionDeclaration
        || stmtKind === ts.SyntaxKind.VariableDeclaration
      ) {
        const declaration = statement as ts.TypeAliasDeclaration | ts.InterfaceDeclaration | ts.FunctionDeclaration | ts.VariableDeclaration;
        const name = declaration.getName();
        console.log(`    Found ${kindName}: ${name}`);
        if (name?.includes("IncrementButton")) {
          const newName = name.replace(/IncrementButton/g, "CounterButton");
          console.log(`    -> Renaming ${name} to ${newName}`);
          declaration.rename(newName);
        }
      }
    }
  }
};

renameIncrementButtonToCounterButton();

// traverse from main.tsx recursively until leaf nodes
// change indentation based on depth
const traverse = (startsWith: string, depth = 0) => {
  if (depth === 0) {
    console.log(`Starting traversal from: ${startsWith}`);
  }
  const file = project.getSourceFile(startsWith);
  if (!file) {
    console.error(`${startsWith} not found`);
    return;
  }

  const importDeclarations = file.getImportDeclarations();
  const ignorePattern = (importDeclaration: string) => {
    const isRelative = importDeclaration.startsWith(".") || importDeclaration.startsWith("/");
    return !isRelative;
  }
  for (const importDecl of importDeclarations) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    if (ignorePattern(moduleSpecifier)) {
      continue;
    }
    const indent = "   ".repeat(depth);
    // change log to X imports Y style
    console.log(`${indent}|--${file.getBaseName()} imports ${moduleSpecifier}`);
    const importedFile = importDecl.getModuleSpecifierSourceFile();
    if (importedFile) {
      // Further traversal logic can be added here
      traverse(importedFile.getFilePath(), depth + 1);
    }
  }
};

traverse("src/main.tsx");

// traverse recursively upwards from a file which contains a specific pattern
const traverseUpwards = (pattern: string) => {
  const targetFile = project.getSourceFiles().find((sf) =>
    sf.getFullText().includes(pattern)
  );

  if (!targetFile) {
    console.error(`No file contains the pattern: ${pattern}`);
    return;
  }

  console.log(`Starting upwards traversal from file: ${targetFile.getBaseName()}`);

  const queue: ts.SourceFile[] = [targetFile];
  const visited = new Set<ts.SourceFile>();
  let depth = -1;
  while (queue.length > 0) {
    depth += 1;
    const currentFile = queue.shift();
    if (!currentFile || visited.has(currentFile)) {
      continue;
    }
    visited.add(currentFile);

    const importDeclarations = currentFile.getImportDeclarations();
    for (const importDecl of importDeclarations) {
      const importedFile = importDecl.getModuleSpecifierSourceFile();
      if (importedFile && !visited.has(importedFile)) {
        const indent = "   ".repeat(depth);
        console.log(`${indent}|--${currentFile.getBaseName()} is imported by ${importedFile.getBaseName()}`);
        queue.push(importedFile);
      }
    }
  }
}

traverseUpwards("useButton");

// project.save();
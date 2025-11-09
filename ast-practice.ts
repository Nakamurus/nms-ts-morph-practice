import ts from "ts-morph";

// Initialize a new ts-morph project
const project = new ts.Project({
  tsConfigFilePath: "tsconfig.app.json",
});

const sourceFiles = project.getSourceFiles();

console.log("sourceFiles", sourceFiles);
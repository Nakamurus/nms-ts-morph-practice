# ts-morph Practice

This repository is for practicing and experimenting with [ts-morph](https://ts-morph.com/), a TypeScript compiler API wrapper.

## What is ts-morph?

ts-morph is a library that makes it easier to work with the TypeScript Compiler API for code analysis and manipulation tasks like:

- AST traversal and analysis
- Code refactoring and transformations
- Automated renaming and refactoring
- File and directory operations

## Operations Practiced

- **AST Traversal**: Finding specific node types (functions, arrow functions, type declarations)
- **Custom Extensions**: Extending SourceFile with custom methods (e.g., `getArrowFunctions()`)
- **File Operations**: Moving and renaming files using `file.move()`
- **Directory Operations**: Moving and renaming directories using `dir.move()`
- **Symbol Renaming**: Using `rename()` to update declarations and all their references
- **Statement Analysis**: Iterating through statements and handling different syntax kinds
- **Export Handling**: Manipulating export declarations
- **Type Reference Updates**: Renaming type aliases and updating all usage locations

## Setup

```bash
npm install
```

## Run

```bash
node ast-practice.ts
```

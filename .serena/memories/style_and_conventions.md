# Rivendell — Coding Style & Conventions

## Line Length
- Max 78 characters unless breaking would hurt readability

## Indentation
- 2 spaces per level (no tabs in indentation logic, helps keep lines short)

## Naming
- Qt C++ style mixed with classic UNIX C style
- Class names: PascalCase with Rd prefix (e.g., RDLogLine, RDLibrary)
- Member variables: likely snake_case or camelCase with prefixes

## Braces
- Opening brace on same line as statement
- Example: `if(to_line<0) {`

## Spacing
- No space between function name and parenthesis: `if(condition)`, `func(arg)`

## General
- Idiosyncratic mix of Qt C++ and UNIX C styles
- Use QObject::tr() for translatable strings
- QString::sprintf() for formatted strings

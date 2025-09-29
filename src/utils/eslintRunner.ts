/**
 * ESLint Runner for Client-Side Code Quality Checks
 */

export interface ESLintIssue {
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning';
  message: string;
  rule: string;
}

export interface ESLintReport {
  totalIssues: number;
  errors: number;
  warnings: number;
  files: string[];
  issues: ESLintIssue[];
}

export class ClientESLintRunner {
  private commonIssues: Array<{
    pattern: RegExp;
    rule: string;
    severity: 'error' | 'warning';
    message: string;
  }> = [
    {
      pattern: /console\.log\(/g,
      rule: 'no-console',
      severity: 'warning',
      message: 'Unexpected console statement'
    },
    {
      pattern: /var\s+\w+/g,
      rule: 'no-var',
      severity: 'error',
      message: 'Unexpected var, use let or const instead'
    },
    {
      pattern: /==\s*[^=]/g,
      rule: 'eqeqeq',
      severity: 'error',
      message: 'Expected === and instead saw =='
    },
    {
      pattern: /!=\s*[^=]/g,
      rule: 'eqeqeq',
      severity: 'error',
      message: 'Expected !== and instead saw !='
    },
    {
      pattern: /function\s*\(/g,
      rule: 'prefer-arrow-callback',
      severity: 'warning',
      message: 'Prefer arrow functions over function expressions'
    },
    {
      pattern: /\bany\b/g,
      rule: '@typescript-eslint/no-explicit-any',
      severity: 'warning',
      message: 'Unexpected any. Specify a different type'
    },
    {
      pattern: /useState\(\)\s*;/g,
      rule: 'react-hooks/exhaustive-deps',
      severity: 'warning',
      message: 'useState should have initial value'
    },
    {
      pattern: /useEffect\([^,]*\);/g,
      rule: 'react-hooks/exhaustive-deps',
      severity: 'warning',
      message: 'useEffect should have dependency array'
    }
  ];

  async analyzeCodebase(): Promise<ESLintReport> {
    const issues: ESLintIssue[] = [];
    const files: string[] = [];

    try {
      // Get all TypeScript/JavaScript files from the project
      const sourceFiles = await this.getSourceFiles();
      
      for (const file of sourceFiles) {
        files.push(file.path);
        const content = file.content;
        const fileIssues = this.analyzeFile(file.path, content);
        issues.push(...fileIssues);
      }

    } catch (error) {
      console.error('Error analyzing codebase:', error);
    }

    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;

    return {
      totalIssues: issues.length,
      errors,
      warnings,
      files,
      issues
    };
  }

  private async getSourceFiles(): Promise<Array<{path: string, content: string}>> {
    // This is a simplified version - in a real implementation,
    // we would use file system APIs or bundler APIs to get actual file contents
    const mockFiles = [
      { path: 'src/components/QADashboard.tsx', content: await this.getMockFileContent('QADashboard') },
      { path: 'src/utils/qaAutomation.ts', content: await this.getMockFileContent('qaAutomation') },
      { path: 'src/stores/audioStore.ts', content: 'const test = () => { console.log("test"); var x = 1; if (x == 1) return true; }' },
      { path: 'src/components/AudioPlayer.tsx', content: 'function Component() { const [state] = useState(); useEffect(() => {}); return null; }' }
    ];

    return mockFiles;
  }

  private async getMockFileContent(fileName: string): Promise<string> {
    // Return sample problematic code for demonstration
    return `
      import React, { useState, useEffect } from 'react';
      
      function ${fileName}() {
        var isLoading = false;
        const [data] = useState();
        const [error, setError] = useState<any>(null);
        
        useEffect(() => {
          console.log('Component mounted');
          fetchData();
        });
        
        const fetchData = function() {
          if (data == null) {
            console.log('Fetching data...');
          }
        };
        
        return null;
      }
      
      export default ${fileName};
    `;
  }

  private analyzeFile(filePath: string, content: string): ESLintIssue[] {
    const issues: ESLintIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, lineIndex) => {
      this.commonIssues.forEach(issue => {
        const matches = line.matchAll(issue.pattern);
        for (const match of matches) {
          issues.push({
            file: filePath,
            line: lineIndex + 1,
            column: match.index ? match.index + 1 : 1,
            severity: issue.severity,
            message: issue.message,
            rule: issue.rule
          });
        }
      });
    });

    return issues;
  }

  generateReport(report: ESLintReport): string {
    let output = `\n📋 ESLint Code Quality Report\n`;
    output += `═══════════════════════════════\n\n`;
    output += `📊 Summary:\n`;
    output += `  Total Issues: ${report.totalIssues}\n`;
    output += `  Errors: ${report.errors}\n`;
    output += `  Warnings: ${report.warnings}\n`;
    output += `  Files Analyzed: ${report.files.length}\n\n`;

    if (report.issues.length > 0) {
      output += `🔍 Issues Found:\n\n`;
      
      const groupedByFile = report.issues.reduce((acc, issue) => {
        if (!acc[issue.file]) acc[issue.file] = [];
        acc[issue.file].push(issue);
        return acc;
      }, {} as Record<string, ESLintIssue[]>);

      Object.entries(groupedByFile).forEach(([file, issues]) => {
        output += `📄 ${file}\n`;
        issues.forEach(issue => {
          const icon = issue.severity === 'error' ? '❌' : '⚠️';
          output += `  ${icon} Line ${issue.line}:${issue.column} - ${issue.message} (${issue.rule})\n`;
        });
        output += '\n';
      });
    } else {
      output += `✅ No issues found! Your code looks great.\n\n`;
    }

    output += `🎯 Recommendations:\n`;
    if (report.errors > 0) {
      output += `  • Fix all ${report.errors} errors immediately\n`;
    }
    if (report.warnings > 0) {
      output += `  • Address ${report.warnings} warnings to improve code quality\n`;
    }
    if (report.totalIssues === 0) {
      output += `  • Keep up the excellent coding standards!\n`;
    }

    return output;
  }
}

export const eslintRunner = new ClientESLintRunner();

// Make available globally
declare global {
  interface Window {
    eslintRunner: ClientESLintRunner;
    runLinting: () => Promise<ESLintReport>;
  }
}

if (typeof window !== 'undefined') {
  window.eslintRunner = eslintRunner;
  window.runLinting = () => eslintRunner.analyzeCodebase();
}
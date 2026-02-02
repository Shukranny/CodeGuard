import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/navigation/Header';
import AIExplanationOverlay from '../../components/navigation/AIExplanationOverlay';
import FileTreePanel from './components/FileTreePanel';
import CodePreviewPanel from './components/CodePreviewPanel';
import FileMetricsPanel from './components/FileMetricsPanel';
import VulnerabilityAnnotation from './components/VulnerabilityAnnotation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FileTreeExplorer = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);
  const [viewMode, setViewMode] = useState('split');

  const mockFiles = [
    {
      path: 'src/api/users.js',
      name: 'users.js',
      isFolder: false,
      language: 'JavaScript',
      lastModified: '2026-01-18',
      content: `const express = require('express');
const router = express.Router();
const db = require('../database');

// Get user by ID - VULNERABLE TO SQL INJECTION
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  try {
    const result = await db.execute(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user - VULNERABLE TO SQL INJECTION
router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const query = \`UPDATE users SET name = '\${name}', email = '\${email}' WHERE id = \${userId}\`;
  
  try {
    await db.execute(query);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  
  try {
    await db.execute(query, [userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;`
    },
    {
      path: 'src/api/auth.js',
      name: 'auth.js',
      isFolder: false,
      language: 'JavaScript',
      lastModified: '2026-01-17',
      content: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database');

// HARDCODED SECRET KEY - CRITICAL VULNERABILITY
const SECRET_KEY = 'my-super-secret-key-12345';

// Login endpoint - WEAK PASSWORD HASHING
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Vulnerable query
  const query = "SELECT * FROM users WHERE username = '" + username + "'";
  const user = await db.execute(query);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Weak password comparison
  if (password === user.password) {
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  // No input validation
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = \`INSERT INTO users (username, password, email) VALUES ('\${username}', '\${hashedPassword}', '\${email}')\`;
  
  try {
    await db.execute(query);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;`
    },
    {
      path: 'src/config/database.js',
      name: 'database.js',
      isFolder: false,
      language: 'JavaScript',
      lastModified: '2026-01-16',
      content: `const mysql = require('mysql2/promise');

// HARDCODED DATABASE CREDENTIALS - CRITICAL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'production_db',
  port: 3306
};

let connection;

async function connect() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

async function execute(query, params = []) {
  if (!connection) {
    await connect();
  }
  
  const [results] = await connection.execute(query, params);
  return results;
}

module.exports = { connect, execute };`
    },
    {
      path: 'src/utils/validation.js',
      name: 'validation.js',
      isFolder: false,
      language: 'JavaScript',
      lastModified: '2026-01-15',
      content: `// Input validation utilities

function validateEmail(email) {
  // Weak email validation
  return email.includes('@');
}

function validatePassword(password) {
  // No password strength requirements
  return password.length > 0;
}

function sanitizeInput(input) {
  // Insufficient sanitization
  return input.replace(/[<>]/g, '');
}

function validateUsername(username) {
  // No length or character restrictions
  return username.length > 0;
}

module.exports = {
  validateEmail,
  validatePassword,
  sanitizeInput,
  validateUsername
};`
    },
    {
      path: 'package.json',
      name: 'package.json',
      isFolder: false,
      language: 'JSON',
      lastModified: '2026-01-14',
      content: `{
  "name": "vulnerable-app",
  "version": "1.0.0",
  "dependencies": {
    "express": "4.17.1",
    "mysql2": "2.3.0",
    "jsonwebtoken": "8.5.1",
    "bcrypt": "5.0.1",
    "lodash": "4.17.19"
  }
}`
    }
  ];

  const mockVulnerabilities = [
    {
      id: 'vuln-1',
      title: 'SQL Injection Vulnerability',
      description: 'User input is directly concatenated into SQL query without parameterization, allowing attackers to inject malicious SQL commands.',
      severity: 'Critical',
      cweId: '89',
      file: 'src/api/users.js',
      line: 8,
      impact: 'Attackers can read, modify, or delete database contents, potentially compromising all user data and system integrity.',
      quickFix: 'Use parameterized queries: const query = "SELECT * FROM users WHERE id = ?"; await db.execute(query, [userId]);',
      codeSnippet: 'const query = "SELECT * FROM users WHERE id = " + userId;'
    },
    {
      id: 'vuln-2',
      title: 'SQL Injection in UPDATE Statement',
      description: 'Template literals are used to construct SQL UPDATE query with unsanitized user input.',
      severity: 'Critical',
      cweId: '89',
      file: 'src/api/users.js',
      line: 20,
      impact: 'Attackers can modify arbitrary database records or execute administrative commands.',
      quickFix: 'Use parameterized queries with placeholders for all user inputs.',
      codeSnippet: 'const query = `UPDATE users SET name = \'${name}\', email = \'${email}\' WHERE id = ${userId}`;'
    },
    {
      id: 'vuln-3',
      title: 'Hardcoded Secret Key',
      description: 'JWT secret key is hardcoded in source code, compromising token security.',
      severity: 'Critical',
      cweId: '798',
      file: 'src/api/auth.js',
      line: 5,
      impact: 'Attackers can forge authentication tokens and impersonate any user.',
      quickFix: 'Store secret keys in environment variables: const SECRET_KEY = process.env.JWT_SECRET;',
      codeSnippet: 'const SECRET_KEY = \'my-super-secret-key-12345\';'
    },
    {
      id: 'vuln-4',
      title: 'SQL Injection in Authentication',
      description: 'Login query concatenates username directly without parameterization.',
      severity: 'Critical',
      cweId: '89',
      file: 'src/api/auth.js',
      line: 11,
      impact: 'Authentication bypass allowing unauthorized access to any account.',
      quickFix: 'Use parameterized queries for authentication: const query = "SELECT * FROM users WHERE username = ?";',
      codeSnippet: 'const query = "SELECT * FROM users WHERE username = \'" + username + "\'";'
    },
    {
      id: 'vuln-5',
      title: 'Weak Password Comparison',
      description: 'Plain text password comparison instead of using secure hash verification.',
      severity: 'High',
      cweId: '916',
      file: 'src/api/auth.js',
      line: 18,
      impact: 'Passwords stored or compared insecurely, vulnerable to timing attacks.',
      quickFix: 'Use bcrypt.compare() for secure password verification.',
      codeSnippet: 'if (password === user.password) {'
    },
    {
      id: 'vuln-6',
      title: 'Hardcoded Database Credentials',
      description: 'Database connection credentials are hardcoded in source code.',
      severity: 'Critical',
      cweId: '798',
      file: 'src/config/database.js',
      line: 4,
      impact: 'Database credentials exposed in version control, allowing unauthorized database access.',
      quickFix: 'Use environment variables for all sensitive configuration.',
      codeSnippet: 'password: \'admin123\','
    },
    {
      id: 'vuln-7',
      title: 'Insufficient Input Validation',
      description: 'Email validation only checks for @ symbol presence.',
      severity: 'Medium',
      cweId: '20',
      file: 'src/utils/validation.js',
      line: 4,
      impact: 'Invalid email addresses accepted, potential for injection attacks.',
      quickFix: 'Use proper regex pattern or validation library for email validation.',
      codeSnippet: 'return email.includes(\'@\');'
    },
    {
      id: 'vuln-8',
      title: 'Weak Password Policy',
      description: 'No password strength requirements enforced.',
      severity: 'Medium',
      cweId: '521',
      file: 'src/utils/validation.js',
      line: 9,
      impact: 'Users can set weak passwords, increasing account compromise risk.',
      quickFix: 'Implement minimum length, complexity requirements, and common password checks.',
      codeSnippet: 'return password.length > 0;'
    },
    {
      id: 'vuln-9',
      title: 'Inadequate Input Sanitization',
      description: 'Input sanitization only removes angle brackets, insufficient for security.',
      severity: 'High',
      cweId: '79',
      file: 'src/utils/validation.js',
      line: 14,
      impact: 'XSS attacks possible through various injection vectors.',
      quickFix: 'Use comprehensive sanitization library like DOMPurify or validator.js.',
      codeSnippet: 'return input.replace(/[<>]/g, \'\');'
    },
    {
      id: 'vuln-10',
      title: 'Vulnerable Dependency',
      description: 'lodash version 4.17.19 has known security vulnerabilities.',
      severity: 'High',
      cweId: '1104',
      file: 'package.json',
      line: 9,
      impact: 'Application vulnerable to prototype pollution attacks.',
      quickFix: 'Update lodash to version 4.17.21 or higher.',
      codeSnippet: '"lodash": "4.17.19"'
    }
  ];

  const mockRelatedFiles = [
    {
      name: 'database.js',
      path: 'src/config/database.js',
      relationship: 'Database connection dependency'
    },
    {
      name: 'validation.js',
      path: 'src/utils/validation.js',
      relationship: 'Input validation utilities'
    },
    {
      name: 'auth.js',
      path: 'src/api/auth.js',
      relationship: 'Authentication module'
    }
  ];

  useEffect(() => {
    if (mockFiles?.length > 0) {
      setSelectedFile(mockFiles?.[0]);
    }
  }, []);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setSelectedVulnerability(null);
  };

  const handleVulnerabilityClick = (vulnerability) => {
    setSelectedVulnerability(vulnerability);
  };

  const handleViewAIExplanation = () => {
    setShowAIExplanation(true);
  };

  const handleMarkResolved = () => {
    console.log('Marking vulnerability as resolved:', selectedVulnerability?.id);
    setSelectedVulnerability(null);
  };

  const handleNavigateToFile = (file) => {
    const targetFile = mockFiles?.find(f => f?.path === file?.path);
    if (targetFile) {
      setSelectedFile(targetFile);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 h-screen flex flex-col">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border bg-card">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate('/scan-results')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="ArrowLeft" size={16} />
              <span className="hidden md:inline">Back to Results</span>
            </button>
            <div className="h-4 w-px bg-border hidden md:block" />
            <h1 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Code Explorer
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1 bg-muted/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('split')}
                className={`
                  px-3 py-1.5 rounded text-xs font-medium transition-smooth
                  ${viewMode === 'split' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <Icon name="Columns" size={14} className="inline mr-1" />
                Split
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`
                  px-3 py-1.5 rounded text-xs font-medium transition-smooth
                  ${viewMode === 'full' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <Icon name="Maximize" size={14} className="inline mr-1" />
                Full
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetricsPanel(!showMetricsPanel)}
              iconName={showMetricsPanel ? 'PanelRightClose' : 'PanelRightOpen'}
              iconPosition="left"
              className="hidden lg:flex"
            >
              Metrics
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/scan-results')}
              iconName="FileSearch"
              iconPosition="left"
              className="hidden md:flex"
            >
              View All Results
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className={`
            ${viewMode === 'full' ? 'hidden' : 'w-full md:w-80 lg:w-96'}
            flex-shrink-0
          `}>
            <FileTreePanel
              files={mockFiles}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              vulnerabilities={mockVulnerabilities}
            />
          </div>

          <div className={`
            flex-1 min-w-0
            ${viewMode === 'full' ? 'w-full' : 'hidden md:block'}
          `}>
            <CodePreviewPanel
              file={selectedFile}
              vulnerabilities={mockVulnerabilities}
              onVulnerabilityClick={handleVulnerabilityClick}
            />
          </div>

          {showMetricsPanel && (
            <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
              <FileMetricsPanel
                file={selectedFile}
                vulnerabilities={mockVulnerabilities}
                relatedFiles={mockRelatedFiles}
                onNavigateToFile={handleNavigateToFile}
              />
            </div>
          )}
        </div>
      </div>

      {selectedVulnerability && (
        <VulnerabilityAnnotation
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
          onViewDetails={handleViewAIExplanation}
          onMarkResolved={handleMarkResolved}
        />
      )}

      {showAIExplanation && selectedVulnerability && (
        <AIExplanationOverlay
          vulnerability={selectedVulnerability}
          onClose={() => setShowAIExplanation(false)}
        />
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex gap-2 z-[1000]">
        <Button
          variant={viewMode === 'split' ? 'default' : 'outline'}
          size="sm"
          fullWidth
          onClick={() => setViewMode('split')}
          iconName="Columns"
          iconPosition="left"
        >
          Tree
        </Button>
        <Button
          variant={viewMode === 'full' ? 'default' : 'outline'}
          size="sm"
          fullWidth
          onClick={() => setViewMode('full')}
          iconName="FileCode"
          iconPosition="left"
        >
          Code
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMetricsPanel(!showMetricsPanel)}
          iconName="BarChart3"
        />
      </div>
    </div>
  );
};

export default FileTreeExplorer;
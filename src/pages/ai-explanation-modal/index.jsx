import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import ModalOverlay from '../../components/ui/ModalOverlay';
import TabNavigation from './components/TabNavigation';
import ProblemAnalysisTab from './components/ProblemAnalysisTab';
import CodeExamplesTab from './components/CodeExamplesTab';
import FixImplementationTab from './components/FixImplementationTab';
import ReferenceSection from './components/ReferenceSection';
import NavigationControls from './components/NavigationControls';

const AIExplanationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('analysis');
  const [currentVulnerabilityIndex, setCurrentVulnerabilityIndex] = useState(0);
  const [bookmarkedVulnerabilities, setBookmarkedVulnerabilities] = useState(new Set());
  const [copiedNotification, setCopiedNotification] = useState(false);

  const vulnerabilities = [
    {
      id: 1,
      ruleName: "SQL Injection Vulnerability",
      severity: "High",
      category: "OWASP A03:2021 - Injection",
      filePath: "src/database/queries.js",
      lineNumber: 45,
      description: "User input is directly concatenated into SQL query without proper sanitization or parameterization, allowing potential SQL injection attacks.",
      aiExplanation: {
        whyItMatters: "SQL injection is one of the most dangerous web application vulnerabilities. It allows attackers to manipulate database queries by injecting malicious SQL code through user inputs. This can lead to unauthorized data access, data modification, or even complete database compromise. In this case, the user-provided search term is directly inserted into the SQL query without any validation or escaping.",
        securityImpact: "An attacker could exploit this vulnerability to bypass authentication, extract sensitive data including user credentials and personal information, modify or delete database records, or execute administrative operations on the database. In severe cases, attackers might gain access to the underlying operating system through database-specific functions.",
        attackScenarios: [
          "Attacker inputs: ' OR '1'='1' -- to bypass authentication and access all records",
          "Using UNION SELECT statements to extract data from other database tables",
          "Executing DROP TABLE commands to delete critical database tables",
          "Using time-based blind SQL injection to extract data character by character"
        ]
      },
      codeExamples: {
        vulnerable: `const searchUsers = (searchTerm) => {\n  const query = "SELECT * FROM users WHERE username = '" + searchTerm + "'";\n  return db.execute(query);\n};`,
        vulnerableExplanation: "This code directly concatenates user input into the SQL query string, creating a critical injection point.",
        fixed: `const searchUsers = (searchTerm) => {\n  const query = "SELECT * FROM users WHERE username = ?";\n  return db.execute(query, [searchTerm]);\n};`,
        fixedExplanation: "The fixed version uses parameterized queries with placeholders (?), ensuring user input is properly escaped and treated as data rather than executable SQL code.",
        keyChanges: [
          "Replaced string concatenation with parameterized query placeholder (?)",
          "Passed user input as a separate parameter array to db.execute()",
          "Database driver now handles proper escaping and sanitization automatically"
        ]
      },
      fixImplementation: {
        overview: "The recommended fix involves implementing parameterized queries (also known as prepared statements) which separate SQL code from user data. This ensures that user input is always treated as data values and never as executable SQL commands.",
        steps: [
          {
            title: "Replace String Concatenation",
            description: "Remove all instances of string concatenation that include user input in SQL queries. Replace them with parameter placeholders.",
            code: `// Before\nconst query = "SELECT * FROM users WHERE id = " + userId;\n\n// After\nconst query = "SELECT * FROM users WHERE id = ?";`
          },
          {
            title: "Use Parameterized Queries",
            description: "Pass user inputs as separate parameters to the database execution method. Most database libraries support this pattern.",
            code: `// Pass parameters as array\ndb.execute(query, [userId]);\n\n// Or as named parameters\ndb.execute(query, { userId: userId });`
          },
          {
            title: "Validate Input Types",
            description: "Add input validation to ensure data types match expected values before passing to database queries.",
            code: `const validateUserId = (id) => {\n  const numId = parseInt(id, 10);\n  if (isNaN(numId) || numId < 1) {\n    throw new Error('Invalid user ID');\n  }\n  return numId;\n};`
          },
          {
            title: "Use ORM or Query Builder",
            description: "Consider using an ORM (Object-Relational Mapping) library or query builder that handles parameterization automatically.",
            code: `// Using an ORM like Sequelize\nconst users = await User.findAll({\n  where: { username: searchTerm }\n});`
          }
        ],
        bestPractices: [
          "Always use parameterized queries or prepared statements for database operations",
          "Implement input validation and sanitization as an additional defense layer",
          "Use ORM libraries that provide built-in protection against SQL injection",
          "Apply the principle of least privilege to database user accounts",
          "Regularly audit and review database query code for potential vulnerabilities",
          "Use stored procedures with parameterized inputs where appropriate"
        ],
        considerations: [
          "Ensure all database queries in the application are updated, not just this one instance",
          "Test the fix thoroughly with various input scenarios including edge cases",
          "Update any related documentation or API specifications",
          "Consider implementing additional security measures like Web Application Firewall (WAF)",
          "Monitor database logs for suspicious query patterns even after implementing the fix"
        ]
      },
      references: [
        {
          title: "OWASP SQL Injection Prevention Cheat Sheet",
          source: "OWASP Foundation",
          url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
        },
        {
          title: "CWE-89: Improper Neutralization of Special Elements used in an SQL Command",
          source: "MITRE Common Weakness Enumeration",
          url: "https://cwe.mitre.org/data/definitions/89.html"
        },
        {
          title: "SQL Injection Attack Explained",
          source: "PortSwigger Web Security Academy",
          url: "https://portswigger.net/web-security/sql-injection"
        }
      ]
    },
    {
      id: 2,
      ruleName: "Cross-Site Scripting (XSS) Vulnerability",
      severity: "High",
      category: "OWASP A03:2021 - Injection",
      filePath: "src/components/UserProfile.jsx",
      lineNumber: 78,
      description: "User-generated content is rendered directly into the DOM without proper sanitization, allowing potential XSS attacks through malicious script injection.",
      aiExplanation: {
        whyItMatters: "Cross-Site Scripting (XSS) vulnerabilities allow attackers to inject malicious JavaScript code into web pages viewed by other users. This code executes in the victim's browser with the same privileges as the legitimate website, enabling attackers to steal sensitive information, hijack user sessions, or perform actions on behalf of the victim.",
        securityImpact: "Successful XSS attacks can lead to session hijacking through cookie theft, credential harvesting via fake login forms, defacement of web pages, redirection to malicious sites, or installation of malware. The impact is particularly severe when targeting administrative users, as it could lead to complete application compromise.",
        attackScenarios: [
          "Injecting <script>alert(document.cookie)</script> to steal session cookies",
          "Creating fake login forms to capture user credentials",
          "Redirecting users to phishing sites using injected JavaScript",
          "Modifying page content to spread misinformation or damage reputation"
        ]
      },
      codeExamples: {
        vulnerable: `const UserProfile = ({ userData }) => {\n  return (\n    <div>\n      <h2>Welcome, {userData.name}</h2>\n      <div dangerouslySetInnerHTML={{ __html: userData.bio }} />\n    </div>\n  );\n};`,
        vulnerableExplanation: "Using dangerouslySetInnerHTML with unsanitized user input allows arbitrary HTML and JavaScript execution.",
        fixed: `import DOMPurify from 'dompurify'
;\n\nconst UserProfile = ({ userData }) => {\n  const sanitizedBio = DOMPurify.sanitize(userData.bio);\n  return (\n    <div>\n      <h2>Welcome, {userData.name}</h2>\n      <div dangerouslySetInnerHTML={{ __html: sanitizedBio }} />\n    </div>\n  );\n};`,
        fixedExplanation: "The fixed version uses DOMPurify library to sanitize HTML content before rendering, removing any potentially malicious scripts while preserving safe HTML formatting.",
        keyChanges: [
          "Added DOMPurify library for HTML sanitization",
          "Sanitized user bio content before rendering",
          "Maintained HTML formatting capabilities while removing script execution risk"
        ]
      },
      fixImplementation: {
        overview: "Implement proper output encoding and HTML sanitization using trusted libraries like DOMPurify. This ensures that user-generated content is safely rendered without executing malicious scripts.",
        steps: [
          {
            title: "Install Sanitization Library",
            description: "Add DOMPurify or similar HTML sanitization library to your project dependencies.",
            code: `npm install dompurify\n# or\nyarn add dompurify`
          },
          {
            title: "Import and Configure Sanitizer",
            description: "Import the sanitization library and configure it according to your security requirements.",
            code: `import DOMPurify from 'dompurify'
;\n\n// Configure allowed tags and attributes\nconst config = {\n  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],\n  ALLOWED_ATTR: ['href']\n};`
          },
          {
            title: "Sanitize Before Rendering",
            description: "Apply sanitization to all user-generated content before rendering it in the DOM.",
            code: `const sanitizedContent = DOMPurify.sanitize(\n  userData.bio,\n  config\n);\n\nreturn (\n  <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />\n);`
          },
          {
            title: "Implement Content Security Policy",
            description: "Add CSP headers to provide an additional layer of XSS protection.",
            code: `// In your server configuration or meta tag\nContent-Security-Policy: default-src 'self'; script-src 'self'`
          }
        ],
        bestPractices: [
          "Always sanitize user-generated HTML content before rendering",
          "Use React\'s default JSX escaping for text content when possible",
          "Implement Content Security Policy (CSP) headers",
          "Avoid using dangerouslySetInnerHTML unless absolutely necessary",
          "Validate and sanitize data on both client and server sides",
          "Use HTTP-only cookies to prevent JavaScript access to session tokens"
        ],
        considerations: [
          "Review all instances where user content is rendered in the application",
          "Test sanitization with various XSS payloads to ensure effectiveness",
          "Consider the balance between security and allowed HTML features",
          "Update sanitization library regularly to protect against new attack vectors",
          "Implement proper error handling for sanitization failures"
        ]
      },
      references: [
        {
          title: "OWASP Cross-Site Scripting (XSS) Prevention Cheat Sheet",
          source: "OWASP Foundation",
          url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
        },
        {
          title: "DOMPurify Documentation",
          source: "DOMPurify GitHub",
          url: "https://github.com/cure53/DOMPurify"
        },
        {
          title: "Content Security Policy Reference",
          source: "MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP"
        }
      ]
    },
    {
      id: 3,
      ruleName: "Hardcoded Credentials",
      severity: "High",
      category: "OWASP A07:2021 - Identification and Authentication Failures",
      filePath: "src/config/database.js",
      lineNumber: 12,
      description: "Database credentials are hardcoded directly in the source code, exposing sensitive authentication information that could be exploited if the code is compromised.",
      aiExplanation: {
        whyItMatters: "Hardcoded credentials in source code represent a critical security vulnerability because they can be easily discovered through code repository access, decompilation, or source code leaks. Once exposed, these credentials provide direct access to sensitive systems and data without requiring any additional authentication bypass.",
        securityImpact: "Exposed credentials can lead to unauthorized database access, data breaches, data manipulation or deletion, and potential lateral movement to other connected systems. If the code is stored in version control systems, the credentials remain in the repository history even after being removed from current code.",
        attackScenarios: [
          "Attacker gains access to source code repository and extracts database credentials",
          "Credentials discovered through decompilation of deployed application",
          "Leaked credentials used to access production database from external networks",
          "Credentials reused across multiple systems, amplifying the breach impact"
        ]
      },
      codeExamples: {
        vulnerable: `const dbConfig = {\n  host: 'db.example.com',\n  user: 'admin',\n  password: 'P@ssw0rd123!',\n  database: 'production_db'\n};`,
        vulnerableExplanation: "Database credentials are directly embedded in the source code, making them visible to anyone with code access.",
        fixed: `const dbConfig = {\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME\n};\n\n// .env file (not committed to version control)\n// DB_HOST=db.example.com\n// DB_USER=admin\n// DB_PASSWORD=P@ssw0rd123!\n// DB_NAME=production_db`,
        fixedExplanation: "Credentials are stored in environment variables, keeping them separate from source code and allowing different values for different environments.",
        keyChanges: [
          "Replaced hardcoded values with environment variable references",
          "Created .env file for local development (added to .gitignore)",
          "Credentials now managed through secure environment configuration"
        ]
      },
      fixImplementation: {
        overview: "Move all sensitive credentials to environment variables or secure secret management systems. This separates configuration from code and allows secure credential management across different environments.",
        steps: [
          {
            title: "Create Environment Variables",
            description: "Set up environment variables for all sensitive configuration values.",
            code: `// Create .env file in project root\nDB_HOST=localhost\nDB_USER=dev_user\nDB_PASSWORD=dev_password\nDB_NAME=dev_database\nDB_PORT=5432`
          },
          {
            title: "Update .gitignore",
            description: "Ensure .env files are excluded from version control to prevent credential leaks.",
            code: `# Add to .gitignore\n.env\n.env.local\n.env.*.local`
          },
          {
            title: "Install dotenv Package",
            description: "Add dotenv package to load environment variables in your application.",
            code: `npm install dotenv\n\n// At the top of your main file\nrequire('dotenv').config();`
          },
          {
            title: "Update Configuration Code",
            description: "Replace all hardcoded credentials with environment variable references.",
            code: `const dbConfig = {\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  port: process.env.DB_PORT || 5432\n};`
          }
        ],
        bestPractices: [
          "Never commit .env files or credentials to version control",
          "Use different credentials for development, staging, and production environments",
          "Implement secret rotation policies for production credentials",
          "Use secret management services (AWS Secrets Manager, Azure Key Vault) for production",
          "Audit code repositories for accidentally committed credentials",
          "Implement pre-commit hooks to prevent credential commits"
        ],
        considerations: [
          "Rotate all exposed credentials immediately after implementing the fix",
          "Review git history for previously committed credentials and consider repository cleanup",
          "Document environment variable requirements for deployment",
          "Implement proper access controls for environment configuration in production",
          "Consider using encrypted secret management for highly sensitive environments"
        ]
      },
      references: [
        {
          title: "OWASP Secrets Management Cheat Sheet",
          source: "OWASP Foundation",
          url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html"
        },
        {
          title: "The Twelve-Factor App: Config",
          source: "12factor.net",
          url: "https://12factor.net/config"
        },
        {
          title: "Managing Secrets in Node.js Applications",
          source: "Node.js Best Practices",
          url: "https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices"
        }
      ]
    }
  ];

  const tabs = [
    { id: 'analysis', label: 'Problem Analysis' },
    { id: 'examples', label: 'Code Examples' },
    { id: 'implementation', label: 'Fix Implementation' }
  ];

  const currentVulnerability = vulnerabilities?.[currentVulnerabilityIndex];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const vulnId = params?.get('id');
    if (vulnId) {
      const index = vulnerabilities?.findIndex(v => v?.id === parseInt(vulnId));
      if (index !== -1) {
        setCurrentVulnerabilityIndex(index);
      }
    }
  }, [location?.search]);

  const handleClose = () => {
    navigate('/vulnerability-dashboard');
  };

  const handlePrevious = () => {
    if (currentVulnerabilityIndex > 0) {
      setCurrentVulnerabilityIndex(currentVulnerabilityIndex - 1);
      setActiveTab('analysis');
    }
  };

  const handleNext = () => {
    if (currentVulnerabilityIndex < vulnerabilities?.length - 1) {
      setCurrentVulnerabilityIndex(currentVulnerabilityIndex + 1);
      setActiveTab('analysis');
    }
  };

  const handleCopyCode = () => {
    const fixedCode = currentVulnerability?.codeExamples?.fixed;
    navigator.clipboard?.writeText(fixedCode);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const handleBookmark = () => {
    const newBookmarks = new Set(bookmarkedVulnerabilities);
    if (newBookmarks?.has(currentVulnerability?.id)) {
      newBookmarks?.delete(currentVulnerability?.id);
    } else {
      newBookmarks?.add(currentVulnerability?.id);
    }
    setBookmarkedVulnerabilities(newBookmarks);
  };

  const handleShare = () => {
    const shareUrl = `${window.location?.origin}/ai-explanation-modal?id=${currentVulnerability?.id}`;
    navigator.clipboard?.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return <ProblemAnalysisTab vulnerability={currentVulnerability} />;
      case 'examples':
        return <CodeExamplesTab vulnerability={currentVulnerability} />;
      case 'implementation':
        return <FixImplementationTab vulnerability={currentVulnerability} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PrimaryNavigation />
      <div className="main-content">
        <ModalOverlay
          isOpen={true}
          onClose={handleClose}
          title="AI-Powered Vulnerability Analysis"
          maxWidth="max-w-6xl"
        >
          <div className="flex flex-col h-full">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            />

            <div
              className="flex-1 overflow-y-auto p-6"
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              {renderTabContent()}
            </div>

            <ReferenceSection references={currentVulnerability?.references} />

            <NavigationControls
              currentIndex={currentVulnerabilityIndex}
              totalCount={vulnerabilities?.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onCopyCode={handleCopyCode}
              onBookmark={handleBookmark}
              onShare={handleShare}
              isBookmarked={bookmarkedVulnerabilities?.has(currentVulnerability?.id)}
            />
          </div>
        </ModalOverlay>

        {copiedNotification && (
          <div className="fixed bottom-4 right-4 bg-success text-success-foreground px-4 py-3 rounded-lg shadow-lg animate-fade-in z-[1001]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Fixed code copied to clipboard!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIExplanationModal;
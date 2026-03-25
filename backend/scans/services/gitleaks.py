import subprocess
import json
import os
import tempfile

class GitleaksScanner:
    def __init__(self, project_path):
        self.project_path = project_path

    def scan(self):
        try:
            # Gitleaks requires a temporary file for the JSON report
            with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as tmp_file:
                report_path = tmp_file.name

            # Run gitleaks detect over the directory
            result = subprocess.run(
                ['gitleaks', 'detect', '--source', self.project_path, '--report-format', 'json', '--report-path', report_path, '--no-git'],
                capture_output=True,
                text=True,
                encoding='utf-8'
            )

            results = []
            if os.path.exists(report_path):
                # Read JSON report
                with open(report_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if content.strip():
                        results = json.loads(content)
                os.remove(report_path)

            return {
                'total_vulnerabilities': len(results),
                'severity_counts': {
                    'critical': len(results) # Gitleaks findings are generally critical secrets
                },
                'all_vulnerabilities': results,
            }

        except FileNotFoundError:
            return {
                'error': 'gitleaks not found. Please install it.'
            }
        except Exception as e:
            if 'report_path' in locals() and os.path.exists(report_path):
                os.remove(report_path)
            return {
                'error': str(e)
            }

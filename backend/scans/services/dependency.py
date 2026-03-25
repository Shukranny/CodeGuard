import subprocess
import json
import os

class DependencyScanner:
    def __init__(self, project_path):
        self.project_path = project_path

    def scan(self):
        try:
            # Run npm audit
            result = subprocess.run(
                ['npm', 'audit', '--json'],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )

            if result.returncode != 0:
                # npm audit returns non-zero on vulnerabilities
                # We still want to parse the JSON if possible
                try:
                    data = json.loads(result.stdout)
                except json.JSONDecodeError:
                    return {
                        'error': 'Failed to parse npm audit output',
                        'raw_output': result.stderr
                    }
            else:
                data = json.loads(result.stdout)

            # Extract vulnerabilities
            vulnerabilities = data.get('vulnerabilities', {})
            
            # Count by severity
            severity_counts = {
                'low': 0,
                'moderate': 0,
                'high': 0,
                'critical': 0
            }
            
            for vuln in vulnerabilities.values():
                severity = vuln.get('severity', 'low')
                severity_counts[severity] += 1
            
            return {
                'total_vulnerabilities': len(vulnerabilities),
                'severity_counts': severity_counts,
                'all_vulnerabilities': vulnerabilities,
                'summary': data.get('metadata', {}).get('summary', 'No summary available')
            }

        except FileNotFoundError:
            return {
                'error': 'npm not found. Please install Node.js and npm.'
            }
        except Exception as e:
            return {
                'error': str(e)
            }   
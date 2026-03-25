import subprocess
import json

class SemgrepScanner:
    def __init__(self, project_path):
        self.project_path = project_path

    def scan(self):
        try:
            # Run semgrep
            result = subprocess.run(
                ['semgrep', 'scan', '--json', '--config', 'auto', '.'],
                cwd=self.project_path,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            # Semgrep may return non-zero exit code if issues are found, 
            # but stdout should still contain valid JSON if issues exist
            try:
                data = json.loads(result.stdout)
            except json.JSONDecodeError:
                return {
                    'error': 'Failed to parse semgrep output',
                    'raw_output': result.stderr
                }

            results = data.get('results', [])
            
            # Count severity
            severity_counts = {
                'INFO': 0,
                'WARNING': 0,
                'ERROR': 0
            }
            
            for finding in results:
                severity = finding.get('extra', {}).get('severity', 'INFO')
                if severity in severity_counts:
                    severity_counts[severity] += 1
            
            return {
                'total_vulnerabilities': len(results),
                'severity_counts': severity_counts,
                'all_vulnerabilities': results,
            }

        except FileNotFoundError:
            return {
                'error': 'semgrep not found. Please install it using pip or brew.'
            }
        except Exception as e:
            return {
                'error': str(e)
            }

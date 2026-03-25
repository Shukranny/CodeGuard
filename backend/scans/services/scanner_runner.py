from .dependency import DependencyScanner
from .semgrep import SemgrepScanner
from .gitleaks import GitleaksScanner

class ScannerRunner:
    SCANNER_MAP = {
        'dependency': DependencyScanner,
        'semgrep': SemgrepScanner,
        'gitleaks': GitleaksScanner
    }

    def __init__(self, project_path, selected_scanners):
        self.project_path = project_path
        self.selected_scanners = selected_scanners

    def run_all(self):
        results = {}
        for scanner_name in self.selected_scanners:
            if scanner_name in self.SCANNER_MAP:
                scanner_class = self.SCANNER_MAP[scanner_name]
                scanner_instance = scanner_class(self.project_path)
                try:
                    # Execute the scan
                    scan_result = scanner_instance.scan()
                    results[scanner_name] = scan_result
                except Exception as e:
                    results[scanner_name] = {'error': str(e)}
            else:
                results[scanner_name] = {'error': f'Scanner {scanner_name} not supported'}
        
        return results

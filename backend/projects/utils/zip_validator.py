import os
import zipfile
import tempfile

LANGUAGE_MAP = {
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".py": "Python",
    ".java": "Java",
    ".php": "PHP",
    ".go": "Go",
    ".rb": "Ruby",
    ".cs": "C#",
    ".cpp": "C++",
    ".c": "C",
    ".html": "HTML",
    ".css": "CSS",
}

def validate_zip(zip_path):
    languages = set()
    file_count = 0
    total_size = 0

    with tempfile.TemporaryDirectory() as extract_dir:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)

        for root, _, files in os.walk(extract_dir):
            for file in files:
                file_count += 1
                file_path = os.path.join(root, file)

                try:
                    total_size += os.path.getsize(file_path)
                except OSError:
                    pass

                ext = os.path.splitext(file)[1].lower()
                if ext in LANGUAGE_MAP:
                    languages.add(LANGUAGE_MAP[ext])

    return {
        "isValid": True if file_count > 0 else False,
        "languages": sorted(list(languages)),
        "fileCount": file_count,
        "totalSize": total_size,
        "errors": [],
        "warnings": [],
    }

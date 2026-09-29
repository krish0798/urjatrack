import os
import re

directories = [
    r"d:\urjatrack\backend\src\main\java\com\urjatrack\backend\domain"
]

for d in directories:
    for f in os.listdir(d):
        if not f.endswith(".java"):
            continue
        filepath = os.path.join(d, f)
        with open(filepath, "r", encoding="utf-8") as file:
            content = file.read()
        
        if "@Builder" in content:
            print(f"Removing @Builder from {filepath}")
            content = re.sub(r"@Builder\s*", "", content)
            
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(content)
